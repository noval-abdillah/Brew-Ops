'use client';

import React from 'react';
import Link from 'next/link';
import { Coffee, Star, Heart } from 'lucide-react';

export default function ReviewsPage() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Owner, Brew & Bean Cafe',
      avatar: 'SJ',
      rating: 5,
      text: 'BrewOps transformed our operations! We cut inventory waste by 40% and our staff loves the intuitive interface.',
      color: 'from-pink-400 to-pink-600'
    },
    {
      name: 'Michael Chen',
      role: 'Manager, Urban Coffee Co.',
      avatar: 'MC',
      rating: 5,
      text: 'The AI predictions are incredibly accurate. We always have the right amount of stock and never run out during rush hours.',
      color: 'from-blue-400 to-blue-600'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Owner, Espresso Express',
      avatar: 'ER',
      rating: 5,
      text: 'Best investment we made! The POS system is lightning fast and the online ordering feature increased our revenue by 30%.',
      color: 'from-purple-400 to-purple-600'
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
            <Link href="/features" className="text-sm font-bold text-stone-600 hover:text-amber-600">Features</Link>
            <Link href="/benefits" className="text-sm font-bold text-stone-600 hover:text-amber-600">Benefits</Link>
            <Link href="/reviews" className="text-sm font-bold text-amber-600">Reviews</Link>
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
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-100 px-3 py-1.5 rounded-full">Reviews</span>
          <h2 className="text-4xl md:text-5xl font-black mt-4">What Coffee Shop Owners Say</h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto mt-4 font-sans">
            Join hundreds of successful coffee shops using BrewOps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div 
              key={idx}
              className="group p-8 bg-white border border-stone-200 rounded-3xl hover:border-amber-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold shadow-lg`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{testimonial.name}</h4>
                  <p className="text-sm text-stone-500">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                ))}
              </div>

              <p className="text-stone-600 leading-relaxed italic">"{testimonial.text}"</p>

              <div className="mt-6 flex items-center gap-2 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-bold">Verified Customer</span>
              </div>
            </div>
          ))}
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
