'use client';

import React from 'react';
import Link from 'next/link';
import { Coffee, ShoppingCart, BarChart3, TrendingUp, Users, Smartphone, Zap, ArrowRight } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      icon: ShoppingCart,
      title: 'Smart POS System',
      description: 'Lightning-fast point of sale with customizable modifiers, split payments, and real-time order tracking.',
      color: 'from-amber-400 to-amber-600',
    },
    {
      icon: BarChart3,
      title: 'Inventory Management',
      description: 'Track ingredients, get low-stock alerts, and automate reordering with supplier integration.',
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: TrendingUp,
      title: 'AI Sales Predictions',
      description: 'Machine learning models predict demand patterns to optimize inventory and reduce waste.',
      color: 'from-green-400 to-green-600',
    },
    {
      icon: Users,
      title: 'Staff Management',
      description: 'Schedule shifts, track hours, manage roles and permissions with ease.',
      color: 'from-purple-400 to-purple-600',
    },
    {
      icon: Smartphone,
      title: 'Online Menu & Ordering',
      description: 'QR code menus for dine-in customers with mobile ordering and payment integration.',
      color: 'from-pink-400 to-pink-600',
    },
    {
      icon: Zap,
      title: 'Real-time Analytics',
      description: 'Live dashboards showing sales, popular items, peak hours, and customer insights.',
      color: 'from-orange-400 to-orange-600',
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100 text-stone-900 font-sans flex flex-col justify-between">
      {/* Navigation */}
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
            <Link href="/features" className="text-sm font-bold text-amber-600">Features</Link>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-20 flex-1">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-100 px-3 py-1.5 rounded-full">Features</span>
          <h2 className="text-4xl md:text-5xl font-black mt-4">Everything You Need to Brew Success</h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto mt-4">
            Powerful features designed specifically for coffee shop operations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx}
                className="group p-8 bg-white border border-stone-200 rounded-3xl hover:border-amber-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-black mb-3 group-hover:text-amber-600 transition-colors">{feature.title}</h3>
                <p className="text-stone-600 leading-relaxed">{feature.description}</p>
                <div className="mt-4 flex items-center gap-2 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-bold">Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* FOOTER */}
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
                <li><Link href="/" className="hover:text-amber-400 transition-colors">About Us</Link></li>
                <li><Link href="/" className="hover:text-amber-400 transition-colors">Contact</Link></li>
                <li><Link href="/" className="hover:text-amber-400 transition-colors">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-stone-400">
                <li><Link href="/" className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/" className="hover:text-amber-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/" className="hover:text-amber-400 transition-colors">Cookie Policy</Link></li>
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
