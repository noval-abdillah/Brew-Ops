'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Coffee, Store, User, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [shopName, setShopName] = useState('');
  const [shopSlug, setShopSlug] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSlugSync = (val: string) => {
    const slug = val
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    setShopSlug(slug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopName, shopSlug, ownerName, ownerEmail, ownerPassword })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to create shop registration.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950 text-stone-50 p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-900/20 rounded-full blur-3xl animate-pulse-slow"></div>
      
      <div className="w-full max-w-md glass-panel border border-stone-800 rounded-3xl p-8 shadow-2xl relative z-10">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl coffee-gradient flex items-center justify-center shadow-lg mb-3">
            <Coffee className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-bold font-sans tracking-tight text-amber-500">Register Coffee Shop</h1>
          <p className="text-xs text-stone-400 mt-1">Deploy your Vertical SaaS tenant and seed espresso menus</p>
        </div>

        {/* Success Alert */}
        {success ? (
          <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-2xl flex flex-col items-center text-center gap-3 animate-fade-in mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
            <h3 className="font-bold text-sm text-green-400">Coffee Shop Provisioned!</h3>
            <p className="text-xs text-stone-300">
              Your tenant domain is ready. Redirecting to the secure login terminal...
            </p>
          </div>
        ) : (
          <>
            {/* Errors Alert */}
            {error && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3 text-xs text-red-400 animate-slide-up">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* Registration Form Locked Overlay */}
            <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col items-center text-center gap-3 animate-fade-in mb-4">
              <AlertCircle className="w-10 h-10 text-amber-500 animate-bounce" />
              <h3 className="font-bold text-sm text-amber-500">Cafe Registration Suspended</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                The registration system is currently under maintenance because the database is offline. Please sign in using the provided demo testing accounts on the login page.
              </p>
              <Link href="/login" className="mt-2 px-4 py-2 bg-stone-900 border border-stone-800 hover:border-amber-600/30 rounded-xl text-xs font-semibold text-stone-300 transition-all">
                Back to Login Page
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
