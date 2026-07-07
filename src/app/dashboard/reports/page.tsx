'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  CreditCard,
  Banknote,
  Search,
  ShoppingCart,
  Users,
  Award,
  CircleDollarSign,
  Briefcase,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  source: string;
  totalAmount: number;
  taxAmount: number;
  finalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  orderItems: any[];
}

export default function ReportsPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState<'30d' | '7d' | '1d'>('30d');

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch('/api/pos/orders');
        if (res.ok) {
          const list = await res.json();
          setOrders(list);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  // Filter orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.orderNumber.includes(search) || o.paymentMethod.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  // Calculate gross summary
  const totalRevenue = filteredOrders.reduce((a,c) => a + c.finalAmount, 0);
  const totalCost = filteredOrders.reduce((a,c) => {
    // If orderItems is present, try to sum the real cost of each product
    if (c.orderItems && Array.isArray(c.orderItems)) {
      const itemsCost = c.orderItems.reduce((sum: number, item: any) => {
        const baseCost = item.product?.cost || 0.28 * (item.unitPrice || 0);
        // Modifiers might have cost adjustments too
        let modsCost = 0;
        if (item.options && Array.isArray(item.options)) {
          // If cost adjustment is simulated for Oat milk / mods:
          modsCost = item.options.length * 0.30;
        }
        return sum + (baseCost + modsCost) * (item.quantity || 1);
      }, 0);
      return a + itemsCost;
    }
    return a + (c.totalAmount * 0.28); // fallback
  }, 0);
  const totalProfit = totalRevenue - totalCost;

  // 4. Export to CSV (Construct CSV string dynamically and trigger browser download)
  const exportToCSV = () => {
    if (filteredOrders.length === 0) return;

    // Header row
    let csvContent = "Order Serial,Date,Source,Payment Method,Subtotal ($),Tax ($),Final Total ($)\n";
    
    // Data rows
    filteredOrders.forEach(o => {
      const dateStr = new Date(o.createdAt).toLocaleString().replace(/,/g, '');
      csvContent += `${o.orderNumber},${dateStr},${o.source},${o.paymentMethod},${o.totalAmount.toFixed(2)},${o.taxAmount.toFixed(2)},${o.finalAmount.toFixed(2)}\n`;
    });

    // Create a Blob and trigger a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `brewops_sales_report_${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="h-[60vh] w-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-amber-600/30 border-t-amber-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-xs font-semibold text-stone-500 dark:text-stone-400">Compiling financial ledgers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* HEADER ROW ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-sans tracking-tight">Sales Reports & Margins</h2>
          <p className="text-xs text-stone-500 mt-1">Review operational checkout history, track cost margins, and export logs to CSV.</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="px-3 py-2 bg-stone-100 dark:bg-stone-900 border border-border rounded-xl text-xs focus:outline-none"
          >
            <option value="30d">Last 30 Days</option>
            <option value="7d">Last 7 Days</option>
            <option value="1d">Today</option>
          </select>

          <button
            onClick={exportToCSV}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg active:scale-95"
          >
            <Download className="w-4 h-4" />
            Export to CSV
          </button>
        </div>
      </div>

      {/* CORE FINANCIAL Profit/Cost METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="glass-panel p-6 rounded-3xl border border-border flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Gross Sales Revenue</span>
            <h3 className="text-2xl font-black">${totalRevenue.toFixed(2)}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-600/10 flex items-center justify-center text-amber-600 dark:text-amber-500">
            <CircleDollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-border flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Ingredient Cost Overhead</span>
            <h3 className="text-2xl font-black">${totalCost.toFixed(2)}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-border flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Net Operations Margin</span>
            <h3 className="text-2xl font-black text-green-500">${totalProfit.toFixed(2)}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* SALES RECEIPT REGISTER LEDGER TABLE */}
      <div className="glass-panel border border-border rounded-3xl overflow-hidden shadow-xl">
        
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-600" />
            Receipts Ledger Register
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by serial # or method..."
              className="pl-10 pr-4 py-2 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-2xl text-xs w-full focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-stone-50/50 dark:bg-stone-900/30 text-stone-400 font-bold uppercase tracking-wider">
                <th className="p-4">Serial Number</th>
                <th className="p-4">Date Time</th>
                <th className="p-4">Checkout Channel</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4 text-right">Subtotal</th>
                <th className="p-4 text-right">Tax</th>
                <th className="p-4 text-right">Total Charged</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-stone-50/20 dark:hover:bg-stone-900/10 transition-colors">
                  <td className="p-4 font-mono font-bold text-amber-600 dark:text-amber-500">{o.orderNumber}</td>
                  <td className="p-4 text-stone-500 font-semibold">{new Date(o.createdAt).toLocaleString()}</td>
                  
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      o.source === 'ONLINE'
                        ? 'bg-amber-600/10 text-amber-600'
                        : 'bg-stone-100 dark:bg-stone-900 text-stone-400'
                    }`}>
                      {o.source}
                    </span>
                  </td>

                  <td className="p-4 text-stone-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      {o.paymentMethod === 'CARD' ? <CreditCard className="w-3.5 h-3.5 text-blue-400" /> : <Banknote className="w-3.5 h-3.5 text-green-500" />}
                      {o.paymentMethod}
                    </span>
                  </td>

                  <td className="p-4 text-right text-stone-500 font-bold">${o.totalAmount.toFixed(2)}</td>
                  <td className="p-4 text-right text-stone-500 font-bold">${o.taxAmount.toFixed(2)}</td>
                  <td className="p-4 text-right font-black">${o.finalAmount.toFixed(2)}</td>

                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/30 text-[9px] font-bold uppercase text-green-500">
                      PAID
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
