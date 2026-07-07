'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Clock,
  Briefcase,
  Users,
  Search,
  CheckCircle2,
  Award,
  CircleDollarSign,
  TrendingUp,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface Shift {
  id: string;
  userId: string;
  name?: string;
  startTime: string;
  endTime: string | null;
  status: 'ACTIVE' | 'COMPLETED';
  salesGenerated: number;
  ordersHandled: number;
  staff?: { name: string; email: string } | null;
}

export default function StaffShifts() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadShifts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/staff');
      if (res.ok) {
        const data = await res.json();
        setShifts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShifts();
  }, []);

  const filteredShifts = shifts.filter(s => {
    const employeeName = s.staff?.name || s.name || '';
    return employeeName.toLowerCase().includes(search.toLowerCase());
  });

  const activeShifts = filteredShifts.filter(s => s.status === 'ACTIVE');
  const pastShifts = filteredShifts.filter(s => s.status === 'COMPLETED');

  // Static weekly roster blocks
  const weeklyRoster = [
    { day: 'Monday', staff: 'Jordan Miller', shift: '08:00 AM - 04:00 PM' },
    { day: 'Tuesday', staff: 'Jordan Miller', shift: '08:00 AM - 04:00 PM' },
    { day: 'Wednesday', staff: 'Marcus Brody', shift: '12:00 PM - 08:00 PM' },
    { day: 'Thursday', staff: 'Marcus Brody', shift: '12:00 PM - 08:00 PM' },
    { day: 'Friday', staff: 'Jordan Miller & Marcus', shift: '08:00 AM - 08:00 PM' },
    { day: 'Saturday', staff: 'Jordan Miller & Marcus', shift: '08:00 AM - 08:00 PM' },
    { day: 'Sunday', staff: 'Elena Vance (Owner)', shift: '10:00 AM - 04:00 PM' }
  ];

  if (loading) {
    return (
      <div className="h-[60vh] w-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-amber-600/30 border-t-amber-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-xs font-semibold text-stone-500 dark:text-stone-400">Loading roaster board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* HEADER SECTION ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-sans tracking-tight">Staff Attendance & Rosters</h2>
          <p className="text-xs text-stone-500 mt-1">Review live check-in sessions, schedule shift planners, and track staff performance.</p>
        </div>

        <button
          onClick={loadShifts}
          className="p-2.5 bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-850 border border-border rounded-xl transition-colors ml-auto"
        >
          <RefreshCw className="w-4 h-4 text-stone-500" />
        </button>
      </div>

      {/* CORE WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: ACTIVE WORK SHIFTS & LOGS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active shifts roaster */}
          <div className="glass-panel border border-border rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-green-500 animate-pulse" />
              On-Duty Staff Check-in
            </h3>
            
            {activeShifts.length === 0 ? (
              <p className="text-xs text-stone-400 py-4 text-center">No baristas currently on active shifts.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeShifts.map((shift) => (
                  <div key={shift.id} className="p-4 bg-green-500/5 border border-green-500/20 rounded-2xl space-y-2 animate-fade-in">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-600 font-bold uppercase text-xs flex items-center justify-center">
                        {(shift.staff?.name || shift.name || 'J').charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs">{shift.staff?.name || shift.name}</h4>
                        <span className="text-[9px] uppercase font-bold text-green-500 tracking-wider">Clocked in</span>
                      </div>
                    </div>

                    <div className="divide-y divide-border/40 text-[10px] text-stone-500 space-y-2 pt-2 border-t border-border/10">
                      <div className="flex justify-between items-center">
                        <span>Check-In Time:</span>
                        <span className="font-mono">{new Date(shift.startTime).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span>Orders Processed:</span>
                        <span className="font-bold text-stone-700 dark:text-stone-300">{shift.ordersHandled}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span>Sales Handled:</span>
                        <span className="font-bold text-amber-600 dark:text-amber-500">${shift.salesGenerated.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Historical attendance logs */}
          <div className="glass-panel border border-border rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Briefcase className="w-4.5 h-4.5 text-amber-600" />
                Attendance Logs
              </h3>

              <div className="relative w-full sm:w-48">
                <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-stone-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search staff..."
                  className="pl-9 pr-3 py-1.5 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-xl text-xs w-full focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-stone-50/50 dark:bg-stone-900/30 text-stone-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Employee</th>
                    <th className="p-4">Shift Date</th>
                    <th className="p-4">Duration Hours</th>
                    <th className="p-4 text-right">Orders processed</th>
                    <th className="p-4 text-right">Sales Handled</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-sans text-stone-600 dark:text-stone-300">
                  {pastShifts.map((shift) => {
                    const start = new Date(shift.startTime);
                    const end = shift.endTime ? new Date(shift.endTime) : new Date();
                    const hours = Math.round(((end.getTime() - start.getTime()) / 3600000) * 10) / 10;
                    
                    return (
                      <tr key={shift.id} className="hover:bg-stone-50/10 dark:hover:bg-stone-900/5">
                        <td className="p-4 font-bold">{shift.staff?.name || shift.name}</td>
                        <td className="p-4 font-semibold">{start.toLocaleDateString()} ({start.toLocaleTimeString()} - {shift.endTime ? end.toLocaleTimeString() : 'Active'})</td>
                        <td className="p-4 font-bold">{hours} hrs</td>
                        <td className="p-4 text-right font-bold">{shift.ordersHandled}</td>
                        <td className="p-4 text-right font-black text-amber-600 dark:text-amber-500">${shift.salesGenerated.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: WEEKLY ROSTER PLANNER */}
        <div className="glass-panel p-6 rounded-3xl border border-border space-y-6">
          <div>
            <h4 className="font-bold text-base flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-amber-500 shrink-0" />
              Weekly Roster Planner
            </h4>
            <p className="text-[10px] text-stone-500">Designated shift allocations for active store baristas.</p>
          </div>

          <div className="space-y-3.5">
            {weeklyRoster.map((item) => (
              <div key={item.day} className="p-3.5 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-2xl flex items-center justify-between">
                <div>
                  <h5 className="font-extrabold text-[11px] text-stone-400 uppercase tracking-wide">{item.day}</h5>
                  <span className="font-bold text-xs">{item.staff}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-500">
                    {item.shift}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
