'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Coffee,
  LayoutDashboard,
  Calculator,
  Package,
  Users,
  Calendar,
  Sparkles,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Sun,
  Moon,
  Clock,
  Menu,
  X,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface UserSession {
  id: string;
  email: string;
  name: string;
  role: 'OWNER' | 'MANAGER' | 'STAFF';
  tenantId: string;
  tenantSlug: string;
  tenantName: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserSession | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shiftActive, setShiftActive] = useState(false);
  const [shiftLoading, setShiftLoading] = useState(false);
  const [shiftMsg, setShiftMsg] = useState<string | null>(null);

  // 1. Fetch user session and setup theme
  useEffect(() => {
    // Check local storage for dark mode
    const isDark = localStorage.getItem('theme') !== 'light';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.replace('/login');
          return;
        }
        const data = await res.json();
        
        // Fetch stats to get active tenant name and notifications
        const statsRes = await fetch('/api/dashboard/stats');
        const stats = statsRes.ok ? await statsRes.json() : null;

        setUser({
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          tenantId: data.tenant.id,
          tenantSlug: data.tenant.slug,
          tenantName: data.tenant.name || (data.tenant.slug === 'brewops' ? 'BrewOps Coffee Co.' : 'Mocha & Co. Coffee Shop')
        });

        await loadNotifications();

      } catch (err) {
        console.error("Session check error", err);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, [router]);

  const loadNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const list = await res.json();
        setNotifications(list);
      }
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch {
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    }
  };

  // 2. Attendance Clock-in/out handlers
  const handleShiftToggle = async () => {
    setShiftLoading(true);
    setShiftMsg(null);
    try {
      const action = shiftActive ? 'CLOCK_OUT' : 'CLOCK_IN';
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (res.ok) {
        setShiftActive(!shiftActive);
        setShiftMsg(`Clocked ${action === 'CLOCK_IN' ? 'in' : 'out'} successfully!`);
        setTimeout(() => setShiftMsg(null), 3000);
      } else {
        setShiftMsg(data.error || "Shift action failed.");
      }
    } catch (err) {
      setShiftMsg("Network connection error.");
    } finally {
      setShiftLoading(false);
    }
  };

  // 3. Theme toggle
  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // 4. Logout handler
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.replace('/login');
    } catch (err) {
      router.replace('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-stone-950 text-stone-50">
        <div className="relative flex flex-col items-center">
          <div className="relative w-20 h-20 border-4 border-amber-600/30 border-t-amber-500 rounded-full animate-spin"></div>
          <Coffee className="absolute top-6 w-8 h-8 text-amber-500" />
          <h2 className="mt-6 text-xl font-semibold tracking-wide font-sans text-amber-400">BrewOps SaaS</h2>
          <p className="mt-2 text-sm text-stone-400">Silky microfoam loading...</p>
        </div>
      </div>
    );
  }

  // Sidebar Links based on role permissions
  const links = [
    { name: 'Dashboard Analytics', href: '/dashboard', icon: LayoutDashboard, roles: ['OWNER', 'MANAGER'] },
    { name: 'POS Terminal', href: '/dashboard/pos', icon: Calculator, roles: ['OWNER', 'MANAGER', 'STAFF'] },
    { name: 'Inventory & Stock', href: '/dashboard/inventory', icon: Package, roles: ['OWNER', 'MANAGER'] },
    { name: 'CRM & Loyalty', href: '/dashboard/customers', icon: Users, roles: ['OWNER', 'MANAGER', 'STAFF'] },
    { name: 'Staff Attendance', href: '/dashboard/staff', icon: Calendar, roles: ['OWNER', 'MANAGER'] },
    { name: 'AI Predictions', href: '/dashboard/predictions', icon: Sparkles, roles: ['OWNER', 'MANAGER'] },
    { name: 'Reports & CSV', href: '/dashboard/reports', icon: BarChart3, roles: ['OWNER', 'MANAGER'] },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['OWNER', 'MANAGER'] },
  ];

  const filteredLinks = links.filter(link => link.roles.includes(user?.role || 'STAFF'));
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      
      {/* --- SIDEBAR FOR DESKTOP --- */}
      <aside className="hidden lg:flex flex-col w-64 glass-panel border-r border-border h-screen sticky top-0 z-30">
        <div className="p-6 flex items-center gap-3 border-b border-border">
          <div className="w-10 h-10 rounded-xl coffee-gradient flex items-center justify-center shadow-lg shadow-amber-900/20">
            <Coffee className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight text-amber-600 dark:text-amber-500 font-sans">BrewOps</h1>
            <span className="text-xs font-semibold uppercase text-stone-400 tracking-wider">Vertical SaaS</span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {filteredLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium ${
                  isActive
                    ? 'coffee-gradient text-white shadow-md shadow-amber-900/10'
                    : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900 hover:text-amber-600 dark:hover:text-amber-400'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-stone-400 group-hover:text-amber-500'
                }`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions inside Sidebar */}
        <div className="p-4 border-t border-border bg-stone-50/50 dark:bg-stone-900/30">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-amber-600/10 border border-amber-600/30 flex items-center justify-center font-bold text-amber-600 uppercase text-sm">
              {user?.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-xs truncate leading-none mb-1">{user?.name}</p>
              <p className="text-[10px] uppercase font-bold text-amber-500 tracking-wider leading-none">
                {user?.role}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-stone-500 hover:text-red-500 hover:bg-red-500/10 dark:hover:bg-red-950/20 text-xs font-semibold transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* --- SIDEBAR FOR MOBILE --- */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <aside
            className="w-64 glass-panel border-r border-border h-full flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-3">
                <Coffee className="w-6 h-6 text-amber-500" />
                <span className="font-bold text-amber-500">BrewOps Mobile</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {filteredLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive ? 'coffee-gradient text-white' : 'text-stone-400 hover:bg-stone-900 hover:text-amber-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-border">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-stone-500 hover:text-red-500 text-xs font-semibold"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* --- MAIN PAGE VIEW CONTENT CONTAINER --- */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-screen">
        
        {/* --- TOP HEADER --- */}
        <header className="h-16 border-b border-border glass-panel flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-stone-800 dark:text-stone-100">
                {user?.tenantName}
              </span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider">
                Store slug: {user?.tenantSlug}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            
            {/* Quick Shift Clock In */}
            <div className="relative flex items-center">
              {shiftMsg && (
                <div className="absolute right-0 top-12 bg-stone-900 text-white text-xs px-3 py-1.5 rounded-lg border border-border flex items-center gap-2 animate-fade-in shadow-xl whitespace-nowrap z-50">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  {shiftMsg}
                </div>
              )}
              <button
                onClick={handleShiftToggle}
                disabled={shiftLoading}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-300 ${
                  shiftActive
                    ? 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400'
                    : 'hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-600 dark:text-stone-300'
                }`}
              >
                <Clock className={`w-3.5 h-3.5 ${shiftActive ? 'animate-pulse text-green-500' : 'text-stone-400'}`} />
                {shiftActive ? 'On Shift' : 'Clock In'}
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-500 hover:text-amber-500 rounded-xl transition-all duration-200"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
            </button>

            {/* Notifications Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-500 hover:text-amber-500 rounded-xl relative transition-all duration-200"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-600 rounded-full animate-pulse"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-card rounded-2xl border border-border shadow-2xl overflow-hidden z-50 animate-slide-up">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <span className="font-bold text-sm">Notifications ({unreadCount})</span>
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[10px] text-amber-500 hover:underline font-semibold"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="divide-y divide-border max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-6 text-center text-xs text-stone-400">All caught up! No notifications.</p>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} className={`p-4 hover:bg-stone-50/50 dark:hover:bg-stone-900/50 flex gap-3 ${!notif.read ? 'bg-amber-500/5 dark:bg-amber-500/2' : ''}`}>
                          {notif.type === 'LOW_STOCK' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          ) : notif.type === 'ORDER' || notif.type === 'PAYMENT' ? (
                            <Bell className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          )}
                          <p className="text-xs text-stone-600 dark:text-stone-300 leading-tight">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Online Order QR Shortcut */}
            <Link
              href={`/menu/${user?.tenantSlug || 'brewops'}`}
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-600/10 hover:bg-amber-600/20 border border-amber-600/30 rounded-xl text-xs font-semibold text-amber-600 dark:text-amber-500 transition-all duration-200"
            >
              <span>QR Order Page</span>
            </Link>
          </div>
        </header>

        {/* --- MAIN PAGE SUB-VIEW CONTENT --- */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
