'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Coffee,
  Sparkles,
  TrendingUp,
  Users,
  ShoppingCart,
  BarChart3,
  Zap,
  CheckCircle2,
  ArrowRight,
  Star,
  Clock,
  Shield,
  Smartphone,
  ChevronDown,
  Menu,
  X,
  Play,
  Award,
  Heart,
  MessageCircle,
  DollarSign
} from 'lucide-react';

type Particle = {
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
};

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);

  // Fix hydration mismatch by only setting scroll listener after mount
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsVisible(true);
    setParticles(
      Array.from({ length: 20 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${5 + Math.random() * 10}s`,
      }))
    );
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Update active section based on scroll position
      const sections = ['home', 'features', 'benefits', 'testimonials', 'pricing'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    setViewportSize({ width: window.innerWidth, height: window.innerHeight });

    const handleResize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Owner, Brew & Bean Cafe',
      avatar: <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold shadow-lg">SJ</div>,
      rating: 5,
      text: 'BrewOps transformed our operations! We cut inventory waste by 40% and our staff loves the intuitive interface.',
    },
    {
      name: 'Michael Chen',
      role: 'Manager, Urban Coffee Co.',
      avatar: <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">MC</div>,
      rating: 5,
      text: 'The AI predictions are incredibly accurate. We always have the right amount of stock and never run out during rush hours.',
    },
    {
      name: 'Emma Rodriguez',
      role: 'Owner, Espresso Express',
      avatar: <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">ER</div>,
      rating: 5,
      text: 'Best investment we made! The POS system is lightning fast and the online ordering feature increased our revenue by 30%.',
    }
  ];

  if (!mounted) {
    return <div className="min-h-screen bg-stone-50 text-stone-900 overflow-x-hidden relative"></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100 text-stone-900 overflow-x-hidden relative">
      
      {/* Animated cursor follower */}
      <div 
        className="fixed w-6 h-6 rounded-full border-2 border-amber-500/30 pointer-events-none z-50 transition-transform duration-300 hidden lg:block"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      />
      
      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-amber-400/20 rounded-full animate-float"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.animationDelay,
              animationDuration: particle.animationDuration,
            }}
          />
        ))}
      </div>
      
      {/* NAVIGATION */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrollY > 50 
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-stone-200' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className={`w-10 h-10 rounded-xl coffee-gradient flex items-center justify-center shadow-lg transition-transform duration-300 ${
              scrollY > 50 ? 'scale-90' : 'scale-100'
            }`}>
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight text-amber-600">BrewOps</h1>
              <p className="text-[9px] text-stone-500 font-semibold uppercase tracking-wider">Coffee SaaS Platform</p>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { id: 'home', label: 'Home', href: '/' },
              { id: 'features', label: 'Features', href: '/features' },
              { id: 'benefits', label: 'Benefits', href: '/benefits' },
              { id: 'testimonials', label: 'Reviews', href: '/reviews' },
              { id: 'pricing', label: 'Pricing', href: '/pricing' }
            ].map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`text-sm font-bold transition-all duration-300 relative group ${
                  activeSection === item.id ? 'text-amber-600' : 'text-stone-600 hover:text-amber-600'
                }`}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-amber-600 transition-all duration-300 ${
                  activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/login"
              className="hidden sm:block px-4 py-2 text-sm font-bold text-stone-600 hover:text-amber-600 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/register"
              className="px-5 py-2.5 coffee-gradient rounded-xl text-sm font-bold text-white shadow-lg hover:shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              Start Free Trial
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-stone-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-xl border-b border-stone-200 shadow-2xl animate-slide-down">
            <div className="px-6 py-4 space-y-3">
              {[
                { id: 'home', label: 'Home', href: '/' },
                { id: 'features', label: 'Features', href: '/features' },
                { id: 'benefits', label: 'Benefits', href: '/benefits' },
                { id: 'testimonials', label: 'Reviews', href: '/reviews' },
                { id: 'pricing', label: 'Pricing', href: '/pricing' }
              ].map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`block w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeSection === item.id 
                      ? 'bg-amber-600 text-white' 
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section id="home" className="relative pt-32 pb-20 px-6 overflow-hidden min-h-screen flex items-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute w-96 h-96 bg-amber-300/20 rounded-full blur-3xl animate-blob"
            style={{ top: '10%', left: '10%' }}
          />
          <div 
            className="absolute w-96 h-96 bg-amber-400/10 rounded-full blur-3xl animate-blob animation-delay-2000"
            style={{ top: '50%', right: '10%' }}
          />
          <div 
            className="absolute w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-blob animation-delay-4000"
            style={{ bottom: '10%', left: '50%' }}
          />
        </div>

        <div className={`max-w-7xl mx-auto relative z-10 w-full transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-8">
              
              {/* Badge */}
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur border border-amber-200 rounded-full shadow-lg animate-bounce-slow"
                style={{ animationDelay: '0.2s' }}
              >
                <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">AI-Powered Coffee Shop Management</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
                  Transform Your
                  <span className="block bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 bg-clip-text text-transparent animate-gradient">
                    Coffee Business
                  </span>
                  with Smart SaaS
                </h1>

                <p className="text-lg md:text-xl text-stone-600 leading-relaxed">
                  Complete point-of-sale, inventory management, staff scheduling, and AI-powered sales predictions. 
                  Built specifically for modern coffee shops and cafes.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
                <Link 
                  href="/register"
                  className="group px-8 py-4 coffee-gradient rounded-2xl text-base font-bold text-white shadow-2xl hover:shadow-amber-500/50 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/menu/brewops"
                  className="group px-8 py-4 bg-white border-2 border-stone-200 rounded-2xl text-base font-bold text-stone-700 hover:border-amber-600 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  View Demo
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex flex-wrap items-center gap-6 pt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div 
                        key={i} 
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-white animate-scale-in"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-stone-600 font-semibold">500+ Coffee Shops</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  {[1,2,3,4,5].map(i => (
                    <Star 
                      key={i} 
                      className="w-4 h-4 fill-current animate-scale-in" 
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                  <span className="ml-2 text-stone-600 font-semibold">4.9/5 Rating</span>
                </div>
              </div>
            </div>

            {/* Right Content - 3D Card Effect */}
            <div className="relative lg:block hidden">
              <div 
                className="relative transform transition-transform duration-300 hover:scale-105"
                style={{
                  transform: viewportSize.width > 0
                    ? `perspective(1000px) rotateY(${(mousePosition.x - viewportSize.width / 2) / 50}deg) rotateX(${-(mousePosition.y - viewportSize.height / 2) / 50}deg)`
                    : 'perspective(1000px) rotateY(0deg) rotateX(0deg)',
                }}
              >
                {/* Main Dashboard Preview */}
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-stone-200">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl coffee-gradient flex items-center justify-center">
                          <Coffee className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm">BrewOps Dashboard</h3>
                          <p className="text-xs text-stone-500">Real-time Analytics</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                        <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse animation-delay-200" />
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse animation-delay-400" />
                      </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { icon: DollarSign, label: 'Revenue', value: '$12,450', change: '+23%', color: 'green' },
                        { icon: ShoppingCart, label: 'Orders', value: '1,234', change: '+18%', color: 'blue' },
                        { icon: Users, label: 'Customers', value: '856', change: '+12%', color: 'purple' },
                        { icon: TrendingUp, label: 'Growth', value: '34%', change: '+8%', color: 'amber' },
                      ].map((stat, idx) => (
                        <div 
                          key={idx}
                          className="p-4 bg-gradient-to-br from-stone-50 to-white rounded-2xl border border-stone-200 animate-scale-in"
                          style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                          <stat.icon className={`w-5 h-5 text-${stat.color}-600 mb-2`} />
                          <p className="text-xs text-stone-500">{stat.label}</p>
                          <p className="text-lg font-black">{stat.value}</p>
                          <p className={`text-xs text-${stat.color}-600 font-bold`}>{stat.change}</p>
                        </div>
                      ))}
                    </div>

                    {/* Chart Preview */}
                    <div className="h-32 bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-stone-200 flex items-end justify-around p-4 gap-2">
                      {[40, 65, 45, 80, 55, 90, 70].map((height, idx) => (
                        <div 
                          key={idx}
                          className="flex-1 bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-lg animate-grow"
                          style={{ 
                            height: `${height}%`,
                            animationDelay: `${idx * 0.1}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 px-4 py-2 bg-green-500 text-white rounded-full text-xs font-bold shadow-lg animate-bounce-slow">
                  ✓ Live Demo
                </div>
                <div className="absolute -bottom-4 -left-4 px-4 py-2 bg-amber-600 text-white rounded-full text-xs font-bold shadow-lg animate-bounce-slow animation-delay-1000">
                  🔥 Hot Feature
                </div>
              </div>
            </div>

          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer" onClick={() => scrollToSection('features')}>
            <ChevronDown className="w-6 h-6 text-amber-600" />
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 px-6 bg-white/50 backdrop-blur relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-amber-100 rounded-full mb-4">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Everything You Need to Brew Success</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Powerful features designed specifically for coffee shop operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: ShoppingCart,
                title: 'Smart POS System',
                description: 'Lightning-fast point of sale with customizable modifiers, split payments, and real-time order tracking.',
                color: 'from-amber-400 to-amber-600',
                delay: '0s'
              },
              {
                icon: BarChart3,
                title: 'Inventory Management',
                description: 'Track ingredients, get low-stock alerts, and automate reordering with supplier integration.',
                color: 'from-blue-400 to-blue-600',
                delay: '0.1s'
              },
              {
                icon: TrendingUp,
                title: 'AI Sales Predictions',
                description: 'Machine learning models predict demand patterns to optimize inventory and reduce waste.',
                color: 'from-green-400 to-green-600',
                delay: '0.2s'
              },
              {
                icon: Users,
                title: 'Staff Management',
                description: 'Schedule shifts, track hours, manage roles and permissions with ease.',
                color: 'from-purple-400 to-purple-600',
                delay: '0.3s'
              },
              {
                icon: Smartphone,
                title: 'Online Menu & Ordering',
                description: 'QR code menus for dine-in customers with mobile ordering and payment integration.',
                color: 'from-pink-400 to-pink-600',
                delay: '0.4s'
              },
              {
                icon: Zap,
                title: 'Real-time Analytics',
                description: 'Live dashboards showing sales, popular items, peak hours, and customer insights.',
                color: 'from-orange-400 to-orange-600',
                delay: '0.5s'
              }
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="group p-8 bg-white border border-stone-200 rounded-3xl hover:border-amber-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer animate-scale-in"
                style={{ animationDelay: feature.delay }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-black mb-3 group-hover:text-amber-600 transition-colors">{feature.title}</h3>
                <p className="text-stone-600 leading-relaxed">{feature.description}</p>
                
                {/* Hover arrow */}
                <div className="mt-4 flex items-center gap-2 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-bold">Learn more</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section id="benefits" className="py-20 px-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent opacity-50" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-white rounded-full shadow-lg mb-4">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Why Choose Us</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black leading-tight">
                Why Coffee Shops Choose BrewOps
              </h2>
              
              {[
                {
                  icon: Clock,
                  title: 'Save 10+ Hours Per Week',
                  description: 'Automate inventory tracking, staff scheduling, and reporting tasks.',
                  color: 'from-blue-400 to-blue-600'
                },
                {
                  icon: TrendingUp,
                  title: 'Increase Revenue by 25%',
                  description: 'AI predictions help optimize menu pricing and reduce waste.',
                  color: 'from-green-400 to-green-600'
                },
                {
                  icon: Shield,
                  title: 'Enterprise-Grade Security',
                  description: 'Bank-level encryption, PCI compliance, and automatic backups.',
                  color: 'from-purple-400 to-purple-600'
                },
                {
                  icon: CheckCircle2,
                  title: 'Setup in Under 30 Minutes',
                  description: 'No complex installation. Start taking orders the same day.',
                  color: 'from-amber-400 to-amber-600'
                }
              ].map((benefit, idx) => (
                <div 
                  key={idx} 
                  className="flex gap-4 items-start group cursor-pointer animate-slide-in-left"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-amber-600 transition-colors">{benefit.title}</h3>
                    <p className="text-stone-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-amber-100 to-amber-200 p-8 shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <div className="w-full h-full rounded-2xl bg-white/90 backdrop-blur border border-stone-200 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
                  {/* Animated circles */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-4 border-amber-200 animate-ping" />
                    <div className="absolute w-24 h-24 rounded-full border-4 border-amber-300 animate-ping animation-delay-1000" />
                  </div>
                  
                  <Coffee className="w-20 h-20 text-amber-600 mb-6 animate-bounce-slow relative z-10" />
                  <h3 className="text-2xl font-black mb-4 relative z-10">Start Your Free Trial</h3>
                  <p className="text-stone-600 mb-6 relative z-10">No credit card required. Full access for 14 days.</p>
                  <Link 
                    href="/register"
                    className="px-8 py-4 coffee-gradient rounded-xl font-bold text-white shadow-lg hover:shadow-2xl transition-all hover:scale-105 active:scale-95 relative z-10"
                  >
                    Get Started Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-20 px-6 bg-white/50 backdrop-blur">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-amber-100 rounded-full mb-4">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Customer Love</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">What Coffee Shop Owners Say</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Join hundreds of successful coffee shops using BrewOps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div 
                key={idx}
                className="group p-8 bg-white border border-stone-200 rounded-3xl hover:border-amber-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer animate-scale-in"
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <div className="flex items-center gap-4 mb-6">
                  {testimonial.avatar}
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
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-white rounded-full shadow-lg mb-4">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Simple Pricing</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Start Free, Scale as You Grow</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              No hidden fees. Cancel anytime. 14-day free trial on all plans.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '$49',
                period: '/month',
                description: 'Perfect for small cafes',
                features: [
                  'Up to 2 staff accounts',
                  'Basic POS system',
                  'Inventory tracking',
                  'Email support',
                  'Mobile app access'
                ],
                cta: 'Start Free Trial',
                popular: false
              },
              {
                name: 'Professional',
                price: '$99',
                period: '/month',
                description: 'Most popular for growing shops',
                features: [
                  'Up to 10 staff accounts',
                  'Advanced POS + modifiers',
                  'AI sales predictions',
                  'Priority support',
                  'Online ordering',
                  'Custom reports'
                ],
                cta: 'Start Free Trial',
                popular: true
              },
              {
                name: 'Enterprise',
                price: '$199',
                period: '/month',
                description: 'For multi-location chains',
                features: [
                  'Unlimited staff accounts',
                  'Multi-location support',
                  'Advanced AI analytics',
                  '24/7 phone support',
                  'Custom integrations',
                  'Dedicated account manager'
                ],
                cta: 'Contact Sales',
                popular: false
              }
            ].map((plan, idx) => (
              <div 
                key={idx}
                className={`relative p-8 bg-white border-2 rounded-3xl transition-all duration-500 hover:-translate-y-2 cursor-pointer animate-scale-in ${
                  plan.popular 
                    ? 'border-amber-600 shadow-2xl scale-105' 
                    : 'border-stone-200 hover:border-amber-300 hover:shadow-xl'
                }`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full text-xs font-bold shadow-lg">
                    ⭐ Most Popular
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                  <p className="text-sm text-stone-500 mb-4">{plan.description}</p>
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-5xl font-black text-amber-600">{plan.price}</span>
                    <span className="text-stone-500 mb-2">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-stone-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className={`block w-full py-4 rounded-xl font-bold text-center transition-all hover:scale-105 active:scale-95 ${
                    plan.popular
                      ? 'coffee-gradient text-white shadow-lg hover:shadow-2xl'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-stone-500 mt-12">
            All plans include 14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

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
