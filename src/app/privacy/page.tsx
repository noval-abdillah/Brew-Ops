'use client';

import React from 'react';
import Link from 'next/link';
import { Coffee, ShieldCheck, Key, Eye } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100 text-stone-900 font-sans flex flex-col justify-between">
      <nav className="bg-white/95 backdrop-blur-xl shadow-sm border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl coffee-gradient flex items-center justify-center shadow-lg">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight text-amber-600">BrewOps</h1>
              <p className="text-[9px] text-stone-500 font-semibold uppercase tracking-wider">Coffee SaaS Platform</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-bold text-stone-600 hover:text-amber-600">Home</Link>
            <Link href="/features" className="text-sm font-bold text-stone-600 hover:text-amber-600">Features</Link>
            <Link href="/benefits" className="text-sm font-bold text-stone-600 hover:text-amber-600">Benefits</Link>
            <Link href="/reviews" className="text-sm font-bold text-stone-600 hover:text-amber-600">Reviews</Link>
            <Link href="/pricing" className="text-sm font-bold text-stone-600 hover:text-amber-600">Pricing</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="px-4 py-2 text-sm font-bold text-stone-600 hover:text-amber-600">Sign In</Link>
            <Link href="/register" className="px-5 py-2.5 coffee-gradient rounded-xl text-sm font-bold text-white shadow-lg">Start Free Trial</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-20 flex-1">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-100 px-3 py-1.5 rounded-full">Privacy Policy</span>
        
        <div className="grid lg:grid-cols-2 gap-12 mt-6 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-black mt-4">Privacy Policy</h2>
            <p className="text-stone-600 leading-relaxed">
              At BrewOps, we take your cafe data privacy seriously. All transaction histories, customer databases, and employee attendance logs are isolated at the database level and never shared with external parties.
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs">Multi-Tenant Isolation</h4>
                  <p className="text-[11px] text-stone-500 mt-1">Each coffee shop client acts as an independent database partition to prevent cross-tenant leakages.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Key className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs">Encryption Standards</h4>
                  <p className="text-[11px] text-stone-500 mt-1">Barista passwords and secure payment gateway API keys are salted and hashed using standard bcrypt/AES encryption.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&q=80&w=600" 
              alt="Data Security" 
              className="w-full h-80 object-cover rounded-3xl shadow-xl border border-stone-200"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400';
              }}
            />
          </div>
        </div>
      </main>

      <footer className="py-12 px-6 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg coffee-gradient flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-white" />
                </div>
                <span className="font-black text-lg">BrewOps</span>
              </div>
              <p className="text-sm text-stone-400">
                The complete SaaS platform for modern coffee shop management.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-stone-400">
                <li><Link href="/menu/brewops" className="hover:text-amber-400 transition-colors">Demo Menu</Link></li>
                <li><Link href="/pricing" className="hover:text-amber-400 transition-colors">Pricing</Link></li>
                <li><Link href="/features" className="hover:text-amber-400 transition-colors">Features</Link></li>
                <li><Link href="/benefits" className="hover:text-amber-400 transition-colors">Benefits</Link></li>
                <li><Link href="/reviews" className="hover:text-amber-400 transition-colors">Reviews</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-stone-400">
                <li><Link href="/about" className="hover:text-amber-400 transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-amber-400 transition-colors">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-amber-400 transition-colors">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-stone-400">
                <li><Link href="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-amber-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-amber-400 transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-stone-800 pt-8 text-center text-sm text-stone-400">
            <p>&copy; 2026 BrewOps. All rights reserved. Built with ❤️ for coffee lovers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
