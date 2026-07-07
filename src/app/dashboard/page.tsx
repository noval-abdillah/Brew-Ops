'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Timer,
  Coffee
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function DashboardHome() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardStats() {
      try {
        const res = await fetch('/api/dashboard/stats');
        if (!res.ok) throw new Error("Could not load stats.");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    }
    loadDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] w-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-amber-600/30 border-t-amber-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-xs font-semibold text-stone-500 dark:text-stone-400">Pouring hot analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-500">
        <AlertTriangle className="w-5 h-5 shrink-0" />
        <p className="text-sm font-semibold">{error || "Failed to parse dashboard data."}</p>
      </div>
    );
  }

  const { kpis, charts, aiForecast } = data;
  
  // HSL curated colors for Pie Chart
  const COLORS = ['#92400e', '#d97706', '#f59e0b', '#78350f'];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-sans tracking-tight">Welcome Back to BrewOps</h2>
          <p className="text-xs text-stone-500 mt-1">Here is a real-time summary of your coffee shop analytics & AI observations today.</p>
        </div>
        
        {kpis.lowStockCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-600 dark:text-amber-500 animate-pulse text-xs font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{kpis.lowStockCount} ingredient items below safety safety limit!</span>
          </div>
        )}
      </div>

      {/* KPI GRID METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-panel p-6 rounded-3xl border border-border flex items-center justify-between glow-hover">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Revenue Today</span>
            <h3 className="text-2xl font-black">${kpis.revenueToday.toFixed(2)}</h3>
            <span className="flex items-center gap-1 text-[10px] font-bold text-green-500">
              <TrendingUp className="w-3 h-3" /> +14.5% vs yesterday
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-600/10 flex items-center justify-center text-amber-600 dark:text-amber-500">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-border flex items-center justify-between glow-hover">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Orders Today</span>
            <h3 className="text-2xl font-black">{kpis.ordersToday} orders</h3>
            <span className="flex items-center gap-1 text-[10px] font-bold text-green-500">
              <TrendingUp className="w-3 h-3" /> +8% vs weekday average
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-600/10 flex items-center justify-center text-amber-600 dark:text-amber-500">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-border flex items-center justify-between glow-hover">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Sales This Month</span>
            <h3 className="text-2xl font-black">${kpis.revenueMonth.toFixed(2)}</h3>
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
              <Sparkles className="w-3 h-3 text-amber-500" /> Margin: 72%
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-600/10 flex items-center justify-center text-amber-600 dark:text-amber-500">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-border flex items-center justify-between glow-hover">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Loyal Club</span>
            <h3 className="text-2xl font-black">{kpis.customersCount} Members</h3>
            <span className="flex items-center gap-1 text-[10px] font-bold text-green-500">
              <TrendingUp className="w-3 h-3" /> +4 signups today
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-600/10 flex items-center justify-center text-amber-600 dark:text-amber-500">
            <Users className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* RECHARTS PLOTS AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Timeline Line Area Plot */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-border space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-base">Sales Velocity</h4>
              <p className="text-[10px] text-stone-500">Total revenue fluctuations generated over the last 7 active days.</p>
            </div>
            <span className="text-[10px] font-bold uppercase px-3 py-1 bg-stone-100 dark:bg-stone-900 border border-border rounded-xl text-amber-500 tracking-wider">
              Live updates
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.salesTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(120, 110, 100, 0.1)" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="rgba(120, 110, 100, 0.4)" />
                <YAxis tick={{ fontSize: 10 }} stroke="rgba(120, 110, 100, 0.4)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    borderRadius: '16px',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#d97706" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product categories Pie chart */}
        <div className="glass-panel p-6 rounded-3xl border border-border flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-base">Sales Category Distribution</h4>
            <p className="text-[10px] text-stone-500">Revenue split breakdown per primary menu category.</p>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {charts.categoryDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    borderRadius: '12px',
                    fontSize: '11px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center label */}
            <div className="absolute flex flex-col items-center justify-center">
              <Coffee className="w-5 h-5 text-amber-600" />
              <span className="text-[10px] uppercase font-bold text-stone-400 mt-1">Menu Sales</span>
            </div>
          </div>

          {/* Custom Pie Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {charts.categoryDistribution.map((entry: any, index: number) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="font-medium truncate text-stone-600 dark:text-stone-300">{entry.name}</span>
                <span className="font-bold ml-auto text-stone-500">${entry.value.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* PEAK HOURS & BEST SELLERS & AI OBSERVATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Peak Hours bar chart */}
        <div className="glass-panel p-6 rounded-3xl border border-border space-y-6">
          <div>
            <h4 className="font-bold text-base">Traffic & Peak Hours</h4>
            <p className="text-[10px] text-stone-500">Hourly checkout distribution indicating high-demand time slots.</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.peakHours} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(120, 110, 100, 0.1)" />
                <XAxis dataKey="hour" tick={{ fontSize: 9 }} stroke="rgba(120, 110, 100, 0.4)" />
                <YAxis tick={{ fontSize: 9 }} stroke="rgba(120, 110, 100, 0.4)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    borderRadius: '12px',
                    fontSize: '11px'
                  }}
                />
                <Bar dataKey="orders" fill="#92400e" radius={[4, 4, 0, 0]} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Best Sellers Board */}
        <div className="glass-panel p-6 rounded-3xl border border-border flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-base">Best-Selling Menu Items</h4>
            <p className="text-[10px] text-stone-500">Popular drinks and food orders listed by sales velocity volume.</p>
          </div>

          <div className="space-y-3.5 my-6">
            {charts.bestSellers.map((item: any, idx: number) => (
              <div key={item.id} className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-xl bg-amber-600/10 font-black text-amber-600 dark:text-amber-500 flex items-center justify-center text-xs">
                  {idx + 1}
                </div>
                <div className="overflow-hidden">
                  <h5 className="font-bold text-xs truncate">{item.name}</h5>
                  <span className="text-[9px] uppercase font-bold text-stone-400 tracking-wider">
                    {item.quantity} units sold
                  </span>
                </div>
                <div className="ml-auto text-right">
                  <span className="font-extrabold text-xs text-amber-600 dark:text-amber-500">
                    ${item.revenue.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-stone-50 dark:bg-stone-900/30 rounded-2xl border border-border flex items-center gap-2">
            <Timer className="w-4 h-4 text-amber-500 animate-pulse shrink-0" />
            <p className="text-[9px] leading-tight text-stone-400">
              Menu item performance velocities recalculate automatically every midnight based on sales receipts.
            </p>
          </div>
        </div>

        {/* AI observations */}
        <div className="glass-panel p-6 rounded-3xl border border-border space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-base flex items-center gap-1.5 text-amber-600 dark:text-amber-500">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                AI Operations Tips
              </h4>
              <p className="text-[10px] text-stone-500">Heuristics generated by local algorithmic engines.</p>
            </div>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-72 pr-1">
            {aiForecast.aiInsights.map((insight: any) => (
              <div key={insight.id} className="p-4 bg-stone-50 dark:bg-stone-900/30 rounded-2xl border border-border space-y-2 hover:border-amber-600/30 transition-colors">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                    insight.priority === 'CRITICAL'
                      ? 'bg-red-500/10 text-red-500'
                      : insight.priority === 'HIGH'
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'bg-stone-500/10 text-stone-500'
                  }`}>
                    {insight.priority} Priority
                  </span>
                  
                  {insight.impactMetric && (
                    <span className="text-[9px] font-bold text-green-500 bg-green-500/5 px-2 py-0.5 rounded-full">
                      {insight.impactMetric}
                    </span>
                  )}
                </div>

                <h5 className="font-bold text-xs">{insight.title}</h5>
                <p className="text-[10px] text-stone-500 leading-normal">{insight.details}</p>
                
                <div className="pt-1 flex items-center gap-1 text-[9px] font-black text-amber-600 dark:text-amber-500 uppercase hover:underline cursor-pointer group">
                  <span>Action: {insight.recommendedAction}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
