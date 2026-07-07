'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Coffee,
  ShoppingCart,
  Plus,
  Minus,
  CheckCircle2,
  Trash2,
  X,
  ChevronRight,
  Sparkles,
  Banknote,
  CreditCard,
  QrCode,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  description?: string;
}

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

type PaymentMethod = 'CASH' | 'CARD' | 'DIGITAL';
type CheckoutStep = 'cart' | 'payment' | 'paying' | 'done';

export default function PublicOnlineMenu() {
  const params = useParams();
  const tenantSlug = params.tenantSlug as string;

  const [tenantName, setTenantName] = useState('');
  const [taxRate, setTaxRate] = useState(0.08);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [tableNumber, setTableNumber] = useState('Table #5');

  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('cart');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('DIGITAL');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [placedOrder, setPlacedOrder] = useState<{
    id: string;
    orderNumber: string;
    finalAmount: number;
    paymentStatus: string;
  } | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadPublicCatalog() {
      try {
        const res = await fetch(`/api/menu/${tenantSlug}/products`);
        if (res.ok) {
          const data = await res.json();
          setTenantName(data.tenant?.name || tenantSlug);
          setTaxRate(data.tenant?.taxRate ?? 0.08);
          const list = data.products || [];
          setProducts(list);
          const cats = ['All', ...Array.from(new Set(list.map((p: Product) => p.category))) as string[]];
          setCategories(cats);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPublicCatalog();
  }, [tenantSlug]);

  const handleProductClick = (prod: Product) => {
    const itemId = `${prod.id}-none`;
    const existingIdx = cart.findIndex((item) => item.id === itemId);
    if (existingIdx !== -1) {
      const newCart = [...cart];
      newCart[existingIdx].quantity += 1;
      newCart[existingIdx].totalPrice = newCart[existingIdx].quantity * newCart[existingIdx].price;
      setCart(newCart);
    } else {
      setCart([
        ...cart,
        {
          id: itemId,
          productId: prod.id,
          name: prod.name,
          price: prod.price,
          quantity: 1,
          totalPrice: prod.price,
        },
      ]);
    }
  };

  const handleQtyChange = (itemId: string, increment: boolean) => {
    const idx = cart.findIndex((item) => item.id === itemId);
    if (idx === -1) return;
    const newCart = [...cart];
    if (increment) {
      newCart[idx].quantity += 1;
    } else {
      newCart[idx].quantity = Math.max(1, newCart[idx].quantity - 1);
    }
    newCart[idx].totalPrice = newCart[idx].quantity * newCart[idx].price;
    setCart(newCart);
  };

  const handleRemove = (itemId: string) => {
    setCart(cart.filter((i) => i.id !== itemId));
  };

  const submitOrder = async () => {
    setCheckoutLoading(true);
    try {
      const payload = {
        cartItems: cart.map((item) => ({
          id: item.productId,
          price: item.price,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
          name: item.name,
        })),
        paymentMethod,
        tableNumber,
        source: 'ONLINE',
      };

      const res = await fetch(`/api/menu/${tenantSlug}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        alert('Failed to submit order: ' + data.error);
        return;
      }

      setPlacedOrder(data.order);
      setQrUrl(data.payment?.qrUrl || null);
      setCart([]);
      setShowCartDrawer(false);

      if (paymentMethod === 'DIGITAL' || paymentMethod === 'CARD') {
        setCheckoutStep('paying');
      } else {
        setCheckoutStep('done');
      }
    } catch {
      alert('Checkout connection failed.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const confirmPayment = async () => {
    if (!placedOrder) return;
    setCheckoutLoading(true);
    try {
      const res = await fetch(`/api/menu/${tenantSlug}/orders`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: placedOrder.id, action: 'CONFIRM_PAYMENT' }),
      });
      const data = await res.json();
      if (res.ok) {
        setPlacedOrder({ ...placedOrder, paymentStatus: 'PAID' });
        setCheckoutStep('done');
      } else {
        alert(data.error || 'Payment confirmation failed.');
      }
    } catch {
      alert('Connection failed.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const resetOrder = () => {
    setPlacedOrder(null);
    setQrUrl(null);
    setCheckoutStep('cart');
    setPaymentMethod('DIGITAL');
  };

  const subtotal = cart.reduce((a, c) => a + c.totalPrice, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100 text-stone-900">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-amber-600/30 border-t-amber-600 rounded-full animate-spin"></div>
          <Coffee className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-amber-600 animate-pulse" />
        </div>
        <p className="mt-6 text-sm font-bold text-stone-600 animate-pulse">Brewing your menu...</p>
      </div>
    );
  }

  const filteredProducts = products.filter((p) => activeCategory === 'All' || p.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/20 to-stone-100 text-stone-900 pb-24 relative font-sans">
      <header className="h-16 bg-white/95 backdrop-blur-lg border-b border-stone-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl coffee-gradient flex items-center justify-center shadow-lg">
            <Coffee className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm uppercase tracking-wider text-amber-600">{tenantName}</h1>
            <p className="text-[9px] text-stone-400 font-semibold">Order & Pay Online</p>
          </div>
        </div>
        <div className="px-3 py-1.5 bg-amber-600/10 rounded-full border border-amber-600/30 text-[10px] font-bold text-amber-600 font-mono">
          {tableNumber}
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {checkoutStep === 'paying' && placedOrder ? (
          <div className="p-6 bg-white border border-stone-200 rounded-3xl shadow-xl flex flex-col items-center text-center gap-4 my-8">
            <QrCode className="w-10 h-10 text-amber-600" />
            <h3 className="font-black text-sm uppercase">Complete Payment</h3>
            <p className="text-xs text-stone-500">Order {placedOrder.orderNumber} — ${placedOrder.finalAmount?.toFixed(2)}</p>
            {qrUrl && (
              <img src={qrUrl} alt="Payment QR" className="w-48 h-48 border border-stone-200 rounded-2xl p-2 bg-white" />
            )}
            <p className="text-[11px] text-stone-500">Scan QR to pay, then tap confirm below.</p>
            <button
              onClick={confirmPayment}
              disabled={checkoutLoading}
              className="w-full py-3 coffee-gradient rounded-xl text-xs font-bold text-white"
            >
              {checkoutLoading ? 'Confirming...' : 'I Have Paid — Confirm Payment'}
            </button>
            <button onClick={() => setCheckoutStep('done')} className="text-[10px] text-stone-400 underline">
              Pay at counter instead
            </button>
          </div>
        ) : checkoutStep === 'done' && placedOrder ? (
          <div className="p-6 bg-white border border-stone-200 rounded-3xl shadow-xl flex flex-col items-center text-center gap-4 my-12 font-mono">
            <CheckCircle2 className={`w-12 h-12 ${placedOrder.paymentStatus === 'PAID' ? 'text-green-500' : 'text-amber-500'}`} />
            <h3 className="font-black text-sm uppercase text-stone-800">
              {placedOrder.paymentStatus === 'PAID' ? 'Order & Payment Confirmed!' : 'Order Sent — Pay at Counter'}
            </h3>
            <div className="p-4 bg-stone-50 border border-stone-100 rounded-2xl w-full space-y-1">
              <span className="text-[10px] text-stone-400 block">TICKET NUMBER</span>
              <span className="text-3xl font-black text-amber-600">{placedOrder.orderNumber}</span>
              <span className="text-[9px] text-stone-400 block pt-1.5">{tableNumber}</span>
              <span className={`text-[10px] font-bold block pt-2 ${placedOrder.paymentStatus === 'PAID' ? 'text-green-600' : 'text-amber-600'}`}>
                Payment: {placedOrder.paymentStatus}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-stone-500">
              {placedOrder.paymentStatus === 'PAID'
                ? 'Your order is being prepared. Staff has been notified.'
                : 'Please pay at the counter. Show this ticket number to the cashier.'}
            </p>
            <button onClick={resetOrder} className="w-full py-3 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl text-xs font-bold text-stone-700">
              Order Something Else
            </button>
          </div>
        ) : (
          <>
            <div className="p-5 coffee-gradient text-white rounded-3xl flex items-center justify-between gap-4 shadow-xl">
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full inline-block">Mobile Order</span>
                <h3 className="font-bold text-base">Scan, Order & Pay</h3>
                <p className="text-[11px] opacity-80">Choose QR, card, or pay at counter.</p>
              </div>
              <Sparkles className="w-12 h-12 shrink-0 text-amber-300" />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold border whitespace-nowrap ${
                    activeCategory === cat
                      ? 'coffee-gradient text-white border-transparent shadow-lg'
                      : 'bg-white text-stone-500 border-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => handleProductClick(prod)}
                  className="bg-white border border-stone-200 rounded-3xl p-4 flex gap-4 cursor-pointer hover:border-amber-400 hover:shadow-xl active:scale-[0.98]"
                >
                  <img
                    src={prod.imageUrl || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400'}
                    alt={prod.name}
                    className="w-24 h-24 object-cover rounded-2xl border border-stone-100 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400';
                    }}
                  />
                  <div className="flex-1 flex flex-col justify-between overflow-hidden">
                    <div>
                      <h4 className="font-extrabold text-sm text-stone-800 truncate">{prod.name}</h4>
                      <p className="text-[11px] text-stone-500 line-clamp-2 mt-1">{prod.description || 'Specialty coffee.'}</p>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="font-black text-sm text-amber-600">${prod.price.toFixed(2)}</span>
                      <div className="p-2 rounded-xl bg-amber-600 text-white">
                        <Plus className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {cart.length > 0 && checkoutStep === 'cart' && (
        <div className="fixed bottom-0 inset-x-0 p-4 bg-white/95 backdrop-blur border-t border-stone-200 flex items-center justify-between max-w-md mx-auto z-30 shadow-2xl rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 flex items-center justify-center text-white relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full font-bold text-[10px] flex items-center justify-center border-2 border-white text-white">
                {cart.reduce((a, c) => a + c.quantity, 0)}
              </span>
            </div>
            <div>
              <p className="text-[9px] uppercase font-bold text-stone-400">Subtotal</p>
              <span className="font-black text-sm">${subtotal.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={() => setShowCartDrawer(true)}
            className="px-5 py-3 coffee-gradient rounded-xl font-bold text-xs text-white shadow-lg flex items-center gap-1"
          >
            Checkout <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {showCartDrawer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-end justify-center">
          <div className="w-full max-w-md bg-white border-t border-stone-200 rounded-t-3xl p-6 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-4">
              <h3 className="font-black text-sm uppercase flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-amber-600" />
                {checkoutStep === 'payment' ? 'Choose Payment' : `Cart (${cart.reduce((a, c) => a + c.quantity, 0)})`}
              </h3>
              <button onClick={() => { setShowCartDrawer(false); setCheckoutStep('cart'); }} className="p-1 hover:bg-stone-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {checkoutStep === 'payment' ? (
              <div className="space-y-4 flex-1">
                <p className="text-xs text-stone-500">Total: <strong className="text-amber-600">${total.toFixed(2)}</strong></p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'DIGITAL' as const, label: 'QR / Digital Wallet', icon: QrCode },
                    { id: 'CARD' as const, label: 'Credit / Debit Card', icon: CreditCard },
                    { id: 'CASH' as const, label: 'Pay at Counter (Cash)', icon: Banknote },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setPaymentMethod(id)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border text-left text-xs font-bold transition-all ${
                        paymentMethod === id ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-stone-200 text-stone-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={submitOrder}
                  disabled={checkoutLoading}
                  className="w-full py-4 coffee-gradient rounded-2xl font-bold text-xs text-white mt-4"
                >
                  {checkoutLoading ? 'Processing...' : `Place Order — $${total.toFixed(2)}`}
                </button>
                <button onClick={() => setCheckoutStep('cart')} className="w-full text-[10px] text-stone-400">
                  ← Back to cart
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto space-y-3 max-h-60">
                  {cart.map((item) => (
                    <div key={item.id} className="p-3 bg-stone-50 border border-stone-100 rounded-2xl flex items-center justify-between gap-4">
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-xs truncate">{item.name}</h4>
                        <span className="text-[10px] font-bold text-amber-600">${item.price.toFixed(2)} each</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleQtyChange(item.id, false)} className="p-1"><Minus className="w-3 h-3" /></button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => handleQtyChange(item.id, true)} className="p-1"><Plus className="w-3 h-3" /></button>
                        <button onClick={() => handleRemove(item.id)} className="p-1 text-stone-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-stone-200 pt-4 mt-4 space-y-4">
                  <div>
                    <label className="block text-[9px] font-black uppercase text-stone-400 mb-1.5">Table / Location</label>
                    <input
                      type="text"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-600"
                    />
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                    <div className="flex justify-between font-black text-sm border-t pt-2"><span>Total</span><span className="text-amber-600">${total.toFixed(2)}</span></div>
                  </div>
                  <button
                    onClick={() => setCheckoutStep('payment')}
                    className="w-full py-4 coffee-gradient rounded-2xl font-bold text-xs text-white flex items-center justify-center gap-2"
                  >
                    Continue to Payment <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
