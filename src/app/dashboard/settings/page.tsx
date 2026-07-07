'use client';

import React, { useState } from 'react';
import {
  Store,
  Percent,
  QrCode,
  CheckCircle2,
  Lock,
  Globe,
  Eye,
  EyeOff,
  CreditCard
} from 'lucide-react';

export default function SettingsPanel() {
  const [activeTab, setActiveTab] = useState<'profile' | 'payments' | 'taxes'>('profile');
  const [shopName, setShopName] = useState('BrewOps Coffee Co.');
  const [shopPhone, setShopPhone] = useState('555-123-4567');
  const [shopAddress, setShopAddress] = useState('100 Specialty Coffee Lane, Seattle, WA');
  const [currency, setCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState('8');
  const [qrUrl, setQrUrl] = useState('pay-to-brewops');
  const [digitalEnabled, setDigitalEnabled] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Payment Gateway states
  const [stripeSecretKey, setStripeSecretKey] = useState('sk_test_51O7c6B2e4vPqW1sX8z...');
  const [stripePublishableKey, setStripePublishableKey] = useState('pk_test_51O7c6B2e4vPqW1sX8z...');
  const [stripeWebhookSecret, setStripeWebhookSecret] = useState('whsec_8a7d6e5c4b3a2f1e0...');
  const [showStripeSecret, setShowStripeSecret] = useState(false);

  const [midtransServerKey, setMidtransServerKey] = useState('SB-Mid-server-K3a9fB2d8jC5m7...');
  const [midtransClientKey, setMidtransClientKey] = useState('SB-Mid-client-P8n2m5q9s6v8x1...');
  const [midtransIsProd, setMidtransIsProd] = useState(false);
  const [showMidtransServer, setShowMidtransServer] = useState(false);

  const [xenditSecretKey, setXenditSecretKey] = useState('xnd_development_T8y1u2i3o4p5a6s7d8f...');
  const [showXenditSecret, setShowXenditSecret] = useState(false);

  const [paymentCash, setPaymentCash] = useState(true);
  const [paymentCard, setPaymentCard] = useState(true);
  const [paymentEWallet, setPaymentEWallet] = useState(true);
  const [paymentQris, setPaymentQris] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMsg("SaaS Tenant configurations updated successfully!");
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto relative">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 bg-green-500 text-white text-xs px-4 py-3 rounded-2xl border border-green-400 flex items-center gap-2 animate-fade-in shadow-2xl z-50">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-bold">{toastMsg}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div>
        <h2 className="text-2xl font-bold font-sans tracking-tight">SaaS Tenant Settings</h2>
        <p className="text-xs text-stone-500 mt-1">Configure your coffee shop profile, currency units, tax adjustments, and checkout gateways.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT NAV TABS */}
        <div className="glass-panel p-4 rounded-3xl border border-border h-fit space-y-1">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold ${
              activeTab === 'profile'
                ? 'bg-amber-600/10 text-amber-600 dark:text-amber-500 border border-amber-600/20 font-bold'
                : 'text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900/50 hover:text-amber-500 border border-transparent'
            }`}
          >
            Cafe Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('payments')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold ${
              activeTab === 'payments'
                ? 'bg-amber-600/10 text-amber-600 dark:text-amber-500 border border-amber-600/20 font-bold'
                : 'text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900/50 hover:text-amber-500 border border-transparent'
            }`}
          >
            Payment Gateways
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('taxes')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold ${
              activeTab === 'taxes'
                ? 'bg-amber-600/10 text-amber-600 dark:text-amber-500 border border-amber-600/20 font-bold'
                : 'text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900/50 hover:text-amber-500 border border-transparent'
            }`}
          >
            Taxes & Pricing
          </button>
        </div>

        {/* RIGHT COLUMN FORM */}
        <form onSubmit={handleSave} className="md:col-span-2 glass-panel border border-border rounded-3xl p-6 space-y-6">
          
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-scale-in">
              <h3 className="font-bold text-sm border-b border-border pb-3 flex items-center gap-2">
                <Store className="w-4.5 h-4.5 text-amber-600 animate-pulse" />
                General Profile Configurations
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">Coffee Shop Name</label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-xl text-xs focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={shopPhone}
                    onChange={(e) => setShopPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">Address Location</label>
                  <input
                    type="text"
                    value={shopAddress}
                    onChange={(e) => setShopAddress(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              <h3 className="font-bold text-sm border-b border-border pb-3 pt-3 flex items-center gap-2">
                <QrCode className="w-4.5 h-4.5 text-amber-600" />
                Checkout QR pay credentials
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">Static QR Pay Redirect String</label>
                  <input
                    type="text"
                    value={qrUrl}
                    onChange={(e) => setQrUrl(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-2xl">
                  <div>
                    <h4 className="text-xs font-bold">Enable Digital QR Payment</h4>
                    <p className="text-[10px] text-stone-500 mt-0.5">Let cashiers generate dynamic, amount-linked checkout QR codes.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={digitalEnabled}
                    onChange={(e) => setDigitalEnabled(e.target.checked)}
                    className="w-4 h-4 text-amber-600 border-border rounded focus:ring-amber-600 shrink-0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PAYMENT GATEWAYS */}
          {activeTab === 'payments' && (
            <div className="space-y-6 animate-scale-in relative">
              {/* Cover Overlay for Lockout */}
              <div className="absolute inset-0 bg-stone-900/90 dark:bg-stone-950/90 backdrop-blur-[2px] rounded-3xl z-40 flex flex-col items-center justify-center text-center p-6 border border-amber-600/30">
                <Lock className="w-10 h-10 text-amber-500 mb-3 animate-bounce" />
                <h4 className="font-bold text-sm text-stone-200">Payment Gateway Integration Locked</h4>
                <p className="text-[10px] text-stone-400 mt-1 max-w-xs">
                  SaaS digital payment integrations are deactivated for offline tester mode to safeguard API sandbox accounts.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-sm border-b border-border pb-3 flex items-center gap-2">
                  <CreditCard className="w-4.5 h-4.5 text-amber-600" />
                  Payment Gateways Configuration
                </h3>
                <p className="text-[10px] text-stone-500 mt-1">
                  Connect your store to Southeast Asian or international payment networks to process digital payments in real time.
                </p>
              </div>

              {/* 1. MIDTRANS */}
              <div className="p-4 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-500 flex items-center gap-1.5">
                    <Globe className="w-4 h-4" />
                    Midtrans (Indonesia & SE Asia)
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-stone-400 uppercase font-semibold">Production</span>
                    <input
                      type="checkbox"
                      checked={midtransIsProd}
                      onChange={(e) => setMidtransIsProd(e.target.checked)}
                      className="w-3.5 h-3.5 text-amber-600 border-border rounded focus:ring-amber-600 shrink-0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-400 mb-1">Server Key</label>
                    <div className="relative">
                      <input
                        type={showMidtransServer ? 'text' : 'password'}
                        value={midtransServerKey}
                        onChange={(e) => setMidtransServerKey(e.target.value)}
                        className="w-full pl-3 pr-10 py-2 bg-stone-100 dark:bg-stone-950 border border-border rounded-xl text-xs focus:outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowMidtransServer(!showMidtransServer)}
                        className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                      >
                        {showMidtransServer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-stone-400 mb-1">Client Key</label>
                    <input
                      type="text"
                      value={midtransClientKey}
                      onChange={(e) => setMidtransClientKey(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-950 border border-border rounded-xl text-xs focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 2. STRIPE */}
              <div className="p-4 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-2xl space-y-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-500 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" />
                  Stripe (International)
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-400 mb-1">Secret Key</label>
                    <div className="relative">
                      <input
                        type={showStripeSecret ? 'text' : 'password'}
                        value={stripeSecretKey}
                        onChange={(e) => setStripeSecretKey(e.target.value)}
                        className="w-full pl-3 pr-10 py-2 bg-stone-100 dark:bg-stone-950 border border-border rounded-xl text-xs focus:outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowStripeSecret(!showStripeSecret)}
                        className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                      >
                        {showStripeSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-stone-400 mb-1">Publishable Key</label>
                      <input
                        type="text"
                        value={stripePublishableKey}
                        onChange={(e) => setStripePublishableKey(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-950 border border-border rounded-xl text-xs focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-stone-400 mb-1">Webhook Secret</label>
                      <input
                        type="text"
                        value={stripeWebhookSecret}
                        onChange={(e) => setStripeWebhookSecret(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-950 border border-border rounded-xl text-xs focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. XENDIT */}
              <div className="p-4 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-2xl space-y-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-500 flex items-center gap-1.5">
                  <Lock className="w-4 h-4" />
                  Xendit (Southeast Asia)
                </h4>

                <div>
                  <label className="block text-[10px] font-semibold text-stone-400 mb-1">Secret Key</label>
                  <div className="relative">
                    <input
                      type={showXenditSecret ? 'text' : 'password'}
                      value={xenditSecretKey}
                      onChange={(e) => setXenditSecretKey(e.target.value)}
                      className="w-full pl-3 pr-10 py-2 bg-stone-100 dark:bg-stone-950 border border-border rounded-xl text-xs focus:outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowXenditSecret(!showXenditSecret)}
                      className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                    >
                      {showXenditSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. ACTIVE PAYMENT METHODS */}
              <div className="p-4 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-2xl space-y-3">
                <h4 className="text-xs font-bold">Supported Checkout Payment Options</h4>
                <p className="text-[10px] text-stone-500 mt-0.5">Toggle what payment methods appear inside your Point of Sale (POS) and online QR ordering page.</p>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <label className="flex items-center gap-2 p-2 bg-white dark:bg-stone-950/40 border border-border rounded-xl cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={paymentCash}
                      onChange={(e) => setPaymentCash(e.target.checked)}
                      className="w-3.5 h-3.5 text-amber-600 border-border rounded focus:ring-amber-600"
                    />
                    <span className="text-[10px] font-medium">Cash</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-white dark:bg-stone-950/40 border border-border rounded-xl cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={paymentCard}
                      onChange={(e) => setPaymentCard(e.target.checked)}
                      className="w-3.5 h-3.5 text-amber-600 border-border rounded focus:ring-amber-600"
                    />
                    <span className="text-[10px] font-medium">Credit Card</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-white dark:bg-stone-950/40 border border-border rounded-xl cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={paymentEWallet}
                      onChange={(e) => setPaymentEWallet(e.target.checked)}
                      className="w-3.5 h-3.5 text-amber-600 border-border rounded focus:ring-amber-600"
                    />
                    <span className="text-[10px] font-medium">Digital Wallet (OVO, GoPay)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-white dark:bg-stone-950/40 border border-border rounded-xl cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={paymentQris}
                      onChange={(e) => setPaymentQris(e.target.checked)}
                      className="w-3.5 h-3.5 text-amber-600 border-border rounded focus:ring-amber-600"
                    />
                    <span className="text-[10px] font-medium">QRIS Dynamic QR</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TAXES & PRICING */}
          {activeTab === 'taxes' && (
            <div className="space-y-6 animate-scale-in">
              <h3 className="font-bold text-sm border-b border-border pb-3 flex items-center gap-2">
                <Percent className="w-4.5 h-4.5 text-amber-600" />
                Finance, Taxes & Currency
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">Store Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-xl text-xs focus:outline-none"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="IDR">IDR (Rp)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">Standard Tax Rate (%)</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-border pt-4 mt-6">
            <button
              type="submit"
              className="px-6 py-3 coffee-gradient rounded-xl font-bold text-xs text-white shadow-lg active:scale-98 transition-all cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>

      </div>

    </div>
  );
}
