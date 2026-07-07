'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Award,
  Gift,
  RefreshCw,
  X,
  CheckCircle2,
  CalendarDays,
  ShoppingBag
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  loyaltyPoints: number;
  createdAt: string;
}

export default function CustomersCRM() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Customer Form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Points redemption modal state
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedCustomerForPoints, setSelectedCustomerForPoints] = useState<Customer | null>(null);
  const [redemptionOption, setRedemptionOption] = useState<'coffee' | 'croissant'>('coffee');

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone })
      });
      if (res.ok) {
        setShowAddModal(false);
        setName('');
        setEmail('');
        setPhone('');
        loadCustomers();
      } else {
        const data = await res.json();
        alert("Registration failed: " + data.error);
      }
    } catch (err) {
      alert("Registration request failed.");
    }
  };

  // points redemption simulation
  const handleRedeemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerForPoints) return;

    const cost = redemptionOption === 'coffee' ? 200 : 500;
    if (selectedCustomerForPoints.loyaltyPoints < cost) {
      alert("Insufficient points! Need " + cost + " points.");
      return;
    }

    // Adjust local state to simulate immediately
    setCustomers(customers.map(c => {
      if (c.id === selectedCustomerForPoints.id) {
        return {
          ...c,
          loyaltyPoints: c.loyaltyPoints - cost
        };
      }
      return c;
    }));

    setShowRedeemModal(false);
    alert(`Reward redeemed! Free ${redemptionOption === 'coffee' ? 'Americano Coffee' : 'Pastry Combo'} issued.`);
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone?.includes(searchQuery)
  );

  if (loading) {
    return (
      <div className="h-[60vh] w-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-amber-600/30 border-t-amber-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-xs font-semibold text-stone-500 dark:text-stone-400">Loading Loyalty CRM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* HEADER ROW ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-sans tracking-tight">Customer Loyalty CRM</h2>
          <p className="text-xs text-stone-500 mt-1">Manage loyalty club members, track accumulated points, and redeem rewards.</p>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            Add Loyalty Member
          </button>
          
          <button
            onClick={loadCustomers}
            className="p-2.5 bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-850 border border-border rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-stone-500" />
          </button>
        </div>
      </div>

      {/* CORE CUSTOMERS CRM LIST TABLE */}
      <div className="glass-panel border border-border rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-600" />
            Loyalty Club Registry
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or phone..."
              className="pl-10 pr-4 py-2 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-2xl text-xs w-full focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-stone-50/50 dark:bg-stone-900/30 text-stone-400 font-bold uppercase tracking-wider">
                <th className="p-4">Customer ID</th>
                <th className="p-4">Full Name</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4 text-right">Loyalty Points Balance</th>
                <th className="p-4">Tier Status</th>
                <th className="p-4 text-center">Reward Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCustomers.map((c) => {
                const isGold = c.loyaltyPoints >= 1000;
                
                return (
                  <tr key={c.id} className="hover:bg-stone-50/20 dark:hover:bg-stone-900/10 transition-colors">
                    <td className="p-4 font-mono text-[10px] text-stone-500 font-bold">{c.id.substring(0,8).toUpperCase()}</td>
                    <td className="p-4 font-bold">{c.name}</td>
                    <td className="p-4 text-stone-500 font-semibold">{c.email || 'N/A'}</td>
                    <td className="p-4 font-mono text-stone-400">{c.phone || 'N/A'}</td>
                    
                    <td className="p-4 text-right font-black text-amber-600 dark:text-amber-500 text-sm">
                      {c.loyaltyPoints} pts
                    </td>

                    <td className="p-4">
                      {isGold ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[9px] font-black uppercase text-amber-600 tracking-wider flex items-center gap-1 w-fit">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          Gold Club
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-900 text-[9px] font-bold text-stone-400 w-fit">
                          Standard
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedCustomerForPoints(c);
                          setShowRedeemModal(true);
                        }}
                        disabled={c.loyaltyPoints < 200}
                        className="px-2.5 py-1 bg-stone-50 dark:bg-stone-900/30 hover:bg-amber-600 hover:text-white border border-border rounded-lg text-[10px] font-bold text-stone-600 dark:text-stone-300 disabled:opacity-30 active:scale-95 transition-all flex items-center gap-1 mx-auto"
                      >
                        <Gift className="w-3.5 h-3.5" />
                        Redeem Reward
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================
          LOYALTY REGISTRATION SHEET OVERLAY
         ========================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="w-full max-w-sm bg-card border border-border rounded-3xl p-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <h3 className="font-bold text-sm">Register Loyalty Member</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Customer full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alice Cooper"
                  required
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alice@gmail.com"
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Phone Number (Required for POS lookups)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="206-555-0192"
                  required
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div className="p-3.5 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-start gap-2.5 text-[10px] leading-normal text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <p>New signups instantly accumulate a 100 points Welcome Reward credit!</p>
              </div>

              <button
                type="submit"
                className="w-full py-3 coffee-gradient rounded-xl font-bold text-xs text-white shadow-lg active:scale-[0.98] transition-all"
              >
                Register Loyalty Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          REWARD REDEMPTION SELECTOR OVERLAY
         ========================================================= */}
      {showRedeemModal && selectedCustomerForPoints && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-card border border-border rounded-3xl p-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <h3 className="font-bold text-sm">Issue Loyalty Reward</h3>
              <button onClick={() => setShowRedeemModal(false)} className="p-1 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-xs text-stone-500">
                Customer: <span className="font-bold text-stone-800 dark:text-stone-200">{selectedCustomerForPoints.name}</span>
              </p>
              <p className="text-xs text-stone-500">
                Active Balance: <span className="font-bold text-amber-500">{selectedCustomerForPoints.loyaltyPoints} points</span>
              </p>
            </div>

            <form onSubmit={handleRedeemSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">Choose Reward Option</label>
                
                <div className="grid grid-cols-1 gap-2.5">
                  
                  <button
                    type="button"
                    onClick={() => setRedemptionOption('coffee')}
                    className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      redemptionOption === 'coffee'
                        ? 'coffee-gradient text-white border-transparent'
                        : 'bg-stone-50 dark:bg-stone-900/30 hover:border-amber-600/30'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-xs">Free Specialty Coffee Drink</h4>
                      <p className="text-[9px] opacity-70">Applies to Americano, Double Espresso, or hot Drips.</p>
                    </div>
                    <span className="font-black text-xs">200 pts</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRedemptionOption('croissant')}
                    disabled={selectedCustomerForPoints.loyaltyPoints < 500}
                    className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all disabled:opacity-30 ${
                      redemptionOption === 'croissant'
                        ? 'coffee-gradient text-white border-transparent'
                        : 'bg-stone-50 dark:bg-stone-900/30 hover:border-amber-600/30'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-xs">Free Pastry Combo Reward</h4>
                      <p className="text-[9px] opacity-70">Applies to Butter Croissants or warm pastries.</p>
                    </div>
                    <span className="font-black text-xs">500 pts</span>
                  </button>

                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 coffee-gradient rounded-xl font-bold text-xs text-white shadow-lg"
              >
                Confirm Points Deduction & Issue Voucher
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
