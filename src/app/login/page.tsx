'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Coffee, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Login credentials failed.");
      }

      // Login success -> redirect based on role
      router.replace('/dashboard');
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Quick Developer Demo Login Helpers
  const handleQuickLogin = async (demoEmail: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: 'password123' })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);

      router.replace('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950 text-stone-50 p-6 relative overflow-hidden">
      {/* Dynamic blurred background accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-900/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-800/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md glass-panel border border-stone-800 rounded-3xl p-8 shadow-2xl relative z-10">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl coffee-gradient flex items-center justify-center shadow-lg shadow-amber-950/40 mb-4 animate-bounce-slow">
            <Coffee className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold font-sans tracking-tight text-amber-500">BrewOps SaaS</h1>
          <p className="text-xs text-stone-400 mt-1">Multi-Tenant Coffee Operations Management</p>
        </div>

        {/* Errors Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3 text-xs text-red-400 animate-slide-up">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="barista@brewops.com"
              required
              className="w-full px-4 py-3 bg-stone-900 border border-stone-800 rounded-xl text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full px-4 py-3 bg-stone-900 border border-stone-800 rounded-xl text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 coffee-gradient rounded-xl font-semibold text-sm text-white shadow-lg hover:shadow-amber-950/20 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Silky microfoam loading...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute w-full border-t border-stone-800"></div>
          <span className="relative px-3 bg-stone-950/90 text-[10px] font-bold uppercase text-stone-500 tracking-wider">
            Quick Developer Access
          </span>
        </div>

        {/* Quick Testing logins */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => handleQuickLogin('owner@brewops.com')}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-2 px-3 bg-stone-900 hover:bg-stone-800 border border-stone-800/80 hover:border-amber-600/30 rounded-xl text-[11px] font-semibold text-stone-300 transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            Elena (Owner)
          </button>
          <button
            onClick={() => handleQuickLogin('staff@brewops.com')}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-2 px-3 bg-stone-900 hover:bg-stone-800 border border-stone-800/80 hover:border-green-600/30 rounded-xl text-[11px] font-semibold text-stone-300 transition-all"
          >
            <UserCheck className="w-3.5 h-3.5 text-green-500" />
            Jordan (Staff)
          </button>
        </div>

        {/* Register Redirect */}
        <div className="text-center">
          <p className="text-xs text-stone-500">
            Want to launch a new cafe?{' '}
            <Link href="/register" className="text-amber-500 hover:underline font-semibold">
              Register Shop
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
