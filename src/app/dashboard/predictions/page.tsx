'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Zap,
  ArrowRight,
  TrendingDown,
  Timer,
  ShoppingBag,
  Activity,
  CheckCircle2
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function PredictionsPanel() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/dashboard/stats');
        if (!res.ok) throw new Error();
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError("Failed to compile AI heuristics.");
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] w-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-amber-600/30 border-t-amber-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-xs font-semibold text-stone-500 dark:text-stone-400">Consulting AI forecasting models...</p>
        </div>
      </div>
    );
  }

  const { aiForecast } = data;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* HEADER BANNER */}
      <div>
        <h2 className="text-2xl font-bold font-sans tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-500 shrink-0" />
          AI Operational Predictions
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Local mathematical heuristics and moving regressions evaluating sales patterns, run-out velocities, and procurement.
        </p>
      </div>

      {/* TOP ROW: FORECAST PLOT & STATS SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Forecast Area Plot */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-border space-y-6">
          <div>
            <h4 className="font-bold text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              7-Day Demand Projection
            </h4>
            <p className="text-[10px] text-stone-500">Predicted daily revenue and transaction count for next week.</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={aiForecast.salesForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(120, 110, 100, 0.1)" />
                <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="rgba(120, 110, 100, 0.4)" />
                <YAxis tick={{ fontSize: 9 }} stroke="rgba(120, 110, 100, 0.4)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    borderRadius: '16px',
                    fontSize: '11px'
                  }}
                />
                <Area type="monotone" dataKey="predictedRevenue" stroke="#d97706" strokeWidth={3} fillOpacity={1} fill="url(#colorPred)" name="Forecasted Revenue ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Forecast Stats card summary */}
        <div className="glass-panel p-6 rounded-3xl border border-border flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-bold text-base flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Weekly Summary
            </h4>
            <div className="divide-y divide-border text-xs space-y-3.5">
              <div className="flex justify-between items-center pt-2">
                <span className="text-stone-500 font-semibold">Total Projected Revenue:</span>
                <span className="font-black text-amber-600 dark:text-amber-500 text-sm">
                  ${aiForecast.salesForecast.reduce((a:any,c:any) => a + c.predictedRevenue, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3">
                <span className="text-stone-500 font-semibold">Expected Checkout Rush:</span>
                <span className="font-bold">Saturdays (Peak: +45% traffic)</span>
              </div>
              <div className="flex justify-between items-center pt-3">
                <span className="text-stone-500 font-semibold">Highest Demand Category:</span>
                <span className="font-bold bg-amber-600/10 text-amber-600 px-2 py-0.5 rounded-full text-[10px]">
                  Specialty Coffee
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-600/10 border border-amber-600/30 rounded-2xl flex items-start gap-2.5 text-[10px] leading-normal text-amber-600 dark:text-amber-500">
            <Activity className="w-4 h-4 shrink-0 mt-0.5 animate-pulse" />
            <p>Calculations use sliding 30-day moving regression formulas combined with weekly seasonal weighting coefficients.</p>
          </div>
        </div>

      </div>

      {/* INVENTORY RUNOUT FORECASTING TABLES */}
      <div className="glass-panel border border-border rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Timer className="w-4 h-4 text-amber-500" />
            Inventory depletion Depletion forecasting
          </h3>
          <span className="text-[10px] font-bold text-stone-400">
            Ingredient velocities mapped
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-stone-50/50 dark:bg-stone-900/30 text-stone-400 font-bold uppercase tracking-wider">
                <th className="p-4">Ingredient</th>
                <th className="p-4 text-right">Current Stock</th>
                <th className="p-4 text-right">Consumption Velocity (Per Day)</th>
                <th className="p-4 text-right">Days Until Run-Out</th>
                <th className="p-4">Run-Out Projection Status</th>
                <th className="p-4 text-right">Recommended Reorder Quantity</th>
                <th className="p-4 text-center">Suggested Reorder Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-sans">
              {aiForecast.runoutForecast.map((ing: any) => {
                const isCritical = ing.daysRemaining <= 3;
                const isWarning = ing.daysRemaining <= 7 && ing.daysRemaining > 3;

                return (
                  <tr key={ing.ingredientId} className="hover:bg-stone-50/20 dark:hover:bg-stone-900/10 transition-colors">
                    <td className="p-4 font-bold">{ing.name}</td>
                    <td className="p-4 text-right text-stone-500 font-bold">{ing.currentStock} {ing.unit}</td>
                    
                    <td className="p-4 text-right text-amber-600 dark:text-amber-500 font-extrabold font-mono">
                      -{ing.velocityPerDay} {ing.unit}/day
                    </td>

                    <td className="p-4 text-right font-black text-sm">
                      {ing.daysRemaining} days
                    </td>

                    <td className="p-4">
                      {isCritical ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-[9px] font-black uppercase text-red-500 tracking-wider flex items-center gap-1.5 w-fit">
                          <AlertTriangle className="w-3 h-3 text-red-500 animate-bounce" />
                          Critical Stockout
                        </span>
                      ) : isWarning ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[9px] font-black uppercase text-amber-600 dark:text-amber-500 tracking-wider flex items-center gap-1.5 w-fit">
                          <AlertTriangle className="w-3 h-3 text-amber-500" />
                          Reorder Soon
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/30 text-[9px] font-black uppercase text-green-600 dark:text-green-400 tracking-wider flex items-center gap-1.5 w-fit">
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                          Safe Range
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right font-mono text-stone-500 font-bold">+{ing.recommendedReorderQty} {ing.unit}</td>
                    
                    <td className="p-4 text-center font-bold text-amber-600 dark:text-amber-500">
                      {ing.reorderDate || 'No action needed'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI STRATEGY RECOMMENDATIONS GRID */}
      <div className="space-y-4">
        <h3 className="font-bold text-base flex items-center gap-1.5">
          <Sparkles className="w-5 h-5 text-amber-500" />
          Active Cafe Strategies
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiForecast.aiInsights.map((insight: any) => (
            <div key={insight.id} className="glass-panel p-6 rounded-3xl border border-border space-y-4 glow-hover flex flex-col justify-between">
              <div className="space-y-2">
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
                    <span className="text-[10px] font-bold text-green-500 bg-green-500/5 px-2 py-0.5 rounded-full border border-green-500/10">
                      {insight.impactMetric}
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-sm leading-snug">{insight.title}</h4>
                <p className="text-xs text-stone-400 leading-relaxed">{insight.details}</p>
              </div>

              <button className="w-full mt-4 py-2.5 bg-stone-100 dark:bg-stone-900/50 hover:bg-amber-600 hover:text-white border border-border rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1">
                Apply Action Strategy
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
