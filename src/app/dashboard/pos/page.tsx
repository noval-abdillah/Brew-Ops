'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Users,
  CreditCard,
  Banknote,
  QrCode,
  CheckCircle2,
  DollarSign,
  Printer,
  ChevronRight,
  PlusCircle,
  X,
  PlusSquare,
  MinusSquare,
  Ticket,
  Coffee,
  Smartphone
} from 'lucide-react';

interface ModifierOption {
  id: string;
  name: string;
  priceAdjustment: number;
}

interface ProductModifier {
  id: string;
  name: string;
  options: ModifierOption[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  modifiers?: ProductModifier[];
}

interface CartItem {
  id: string; // unique item id in cart (productId + stringified mods)
  productId: string;
  name: string;
  category: string;
  price: number; // product base + modifier adjustments
  quantity: number;
  totalPrice: number;
  selectedModifiers: { name: string; price: number }[];
  notes?: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  loyaltyPoints: number;
}

export default function POSTerminal() {
  // Catalog & state
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [tableNumber, setTableNumber] = useState('');
  
  // Modifiers modal
  const [selectedProductForMod, setSelectedProductForMod] = useState<Product | null>(null);
  const [activeModifiersSelection, setActiveModifiersSelection] = useState<{ [modName: string]: { name: string; price: number } }>({});
  
  // Customers loyalty selection
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  // Payment modals
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'DIGITAL' | 'SPLIT'>('CASH');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  
  // Split payment state
  const [splitPayments, setSplitPayments] = useState<{ method: 'CASH' | 'CARD' | 'DIGITAL'; amount: number }[]>([
    { method: 'CASH', amount: 0 },
    { method: 'CARD', amount: 0 }
  ]);

  // Order submission results
  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const [onlineOrders, setOnlineOrders] = useState<any[]>([]);

  const loadOnlineOrders = async () => {
    try {
      const res = await fetch('/api/pos/orders');
      if (res.ok) {
        const orders = await res.json();
        setOnlineOrders(
          orders.filter(
            (o: any) =>
              o.source === 'ONLINE' &&
              (o.status === 'PENDING' || o.status === 'PREPARING')
          )
        );
      }
    } catch {
      /* ignore */
    }
  };

  const handleOnlineOrderAction = async (orderId: string, action: string) => {
    try {
      const res = await fetch(`/api/pos/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        await loadOnlineOrders();
      } else {
        const data = await res.json();
        alert(data.error || 'Action failed.');
      }
    } catch {
      alert('Network error.');
    }
  };

  // 1. Initial product and customer loads
  useEffect(() => {
    async function loadPOSData() {
      try {
        const prodRes = await fetch('/api/pos/products');
        if (prodRes.ok) {
          const prods = await prodRes.json();
          setProducts(prods);
          
          // Compute unique categories
          const cats = ['All', ...Array.from(new Set(prods.map((p: any) => p.category))) as string[]];
          setCategories(cats);
        }

        const custRes = await fetch('/api/customers');
        if (custRes.ok) {
          const custs = await custRes.json();
          setCustomers(custs);
        }
      } catch (err) {
        console.error("Failed to load POS checkout data", err);
      }
    }
    loadPOSData();
    loadOnlineOrders();
    const interval = setInterval(loadOnlineOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  // 2. Add product to cart handler
  const handleProductClick = (product: Product) => {
    if (product.modifiers && product.modifiers.length > 0) {
      // Product has customizable options -> Open Modifiers Overlay Modal
      setSelectedProductForMod(product);
      // Preselect first option for required modifiers if needed
      setActiveModifiersSelection({});
    } else {
      // Direct fast insertion into cart
      addToCart(product, []);
    }
  };

  const addToCart = (product: Product, selectedModifiers: { name: string; price: number }[]) => {
    const modAdjustments = selectedModifiers.reduce((acc, curr) => acc + curr.price, 0);
    const unitPrice = product.price + modAdjustments;
    
    // Create deterministic ID for this distinct product+modifier selection
    const modString = selectedModifiers.map(m => m.name).sort().join('-');
    const cartItemId = `${product.id}-${modString}`;

    const existingIdx = cart.findIndex(item => item.id === cartItemId);
    if (existingIdx !== -1) {
      const newCart = [...cart];
      newCart[existingIdx].quantity += 1;
      newCart[existingIdx].totalPrice = newCart[existingIdx].quantity * newCart[existingIdx].price;
      setCart(newCart);
    } else {
      setCart([...cart, {
        id: cartItemId,
        productId: product.id,
        name: product.name,
        category: product.category,
        price: unitPrice,
        quantity: 1,
        totalPrice: unitPrice,
        selectedModifiers
      }]);
    }
  };

  const handleApplyModifiers = () => {
    if (!selectedProductForMod) return;
    const selectedMods = Object.values(activeModifiersSelection);
    addToCart(selectedProductForMod, selectedMods);
    setSelectedProductForMod(null);
    setActiveModifiersSelection({});
  };

  // 3. Cart increment/decrement controls
  const handleQtyChange = (itemId: string, increment: boolean) => {
    const idx = cart.findIndex(item => item.id === itemId);
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

  const handleRemoveItem = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  // 4. Calculations
  const [tenantTaxRate, setTenantTaxRate] = useState(0.08); // fallback
  
  useEffect(() => {
    async function loadTenantTax() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          // We can call /api/dashboard/stats or similar, or calculate it based on custom settings.
          // Let's check stats API for tenant profile details
          const statsRes = await fetch('/api/dashboard/stats');
          if (statsRes.ok) {
            const stats = await statsRes.json();
            if (stats.taxRate !== undefined) {
              setTenantTaxRate(stats.taxRate);
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadTenantTax();
  }, []);

  const cartSubtotal = cart.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const taxAmount = Math.max(0, (cartSubtotal - discount) * tenantTaxRate);
  const cartTotal = Math.max(0, cartSubtotal - discount + taxAmount);

  // 5. Submit POS checkout transaction
  const handleCheckoutSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        customerId: selectedCustomer?.id || null,
        cartItems: cart.map(item => ({
          id: item.productId,
          price: item.price,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
          selectedModifiers: item.selectedModifiers,
          name: item.name,
          category: item.category
        })),
        discountAmount: discount,
        paymentMethod,
        tableNumber: tableNumber || null,
        payments: paymentMethod === 'SPLIT' ? splitPayments : null
      };

      const res = await fetch('/api/pos/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);

      setCompletedOrder(data.order);
      setShowCheckoutModal(false);
      setShowReceiptModal(true);
      
      // Clear Cart state on complete
      setCart([]);
      setDiscount(0);
      setTableNumber('');
      setSelectedCustomer(null);
    } catch (err) {
      alert("Checkout failed: " + err);
    } finally {
      setLoading(false);
    }
  };

  // Filters
  const filteredProducts = products.filter(p => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto">
      {onlineOrders.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <Smartphone className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-sm text-amber-700 dark:text-amber-400">
              Online Orders ({onlineOrders.length})
            </h3>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {onlineOrders.map((order) => (
              <div
                key={order.id}
                className="min-w-[220px] bg-white dark:bg-stone-900 border border-border rounded-xl p-3 text-xs shrink-0"
              >
                <div className="font-black text-amber-600">{order.orderNumber}</div>
                <div className="text-stone-500 mt-1">{order.tableNumber || 'Pickup'}</div>
                <div className="font-bold mt-1">${order.finalAmount?.toFixed(2)}</div>
                <div className={`mt-1 font-semibold ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-amber-600'}`}>
                  Pay: {order.paymentStatus}
                </div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {order.paymentStatus !== 'PAID' && (
                    <button
                      onClick={() => handleOnlineOrderAction(order.id, 'CONFIRM_PAYMENT')}
                      className="px-2 py-1 bg-green-600 text-white rounded-lg text-[10px] font-bold"
                    >
                      Confirm Pay
                    </button>
                  )}
                  {order.status !== 'PREPARING' && order.paymentStatus === 'PAID' && (
                    <button
                      onClick={() => handleOnlineOrderAction(order.id, 'START_PREPARING')}
                      className="px-2 py-1 bg-amber-600 text-white rounded-lg text-[10px] font-bold"
                    >
                      Prepare
                    </button>
                  )}
                  <button
                    onClick={() => handleOnlineOrderAction(order.id, 'COMPLETE')}
                    className="px-2 py-1 bg-stone-700 text-white rounded-lg text-[10px] font-bold"
                  >
                    Done
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-8rem)]">
      
      {/* =========================================================
          LEFT PANEL: MENU PRODUCTS CATALOG SELECTOR
         ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 bg-card border border-border rounded-3xl p-6 overflow-hidden">
        
        {/* Category filtering bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-6 shrink-0">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all border whitespace-nowrap ${
                  activeCategory === cat
                    ? 'coffee-gradient text-white border-transparent shadow-lg shadow-amber-900/10'
                    : 'bg-stone-50 dark:bg-stone-900/30 text-stone-500 hover:text-amber-500 border-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-2xl text-xs focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 w-full sm:w-48"
            />
          </div>
        </div>

        {/* Dynamic products list grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          {filteredProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-400">
              <Coffee className="w-12 h-12 text-stone-300 mb-3 animate-pulse" />
              <p className="text-xs">No coffee menu items found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => handleProductClick(prod)}
                  className="bg-stone-50/50 dark:bg-stone-900/10 border border-border rounded-3xl p-3.5 flex flex-col cursor-pointer transition-all hover:border-amber-600/30 glow-hover"
                >
                  <img
                    src={prod.imageUrl || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400'}
                    alt={prod.name}
                    className="w-full h-24 object-cover rounded-2xl mb-3 border border-border/10"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400';
                    }}
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs truncate leading-normal text-stone-800 dark:text-stone-100">{prod.name}</h4>
                      <span className="text-[9px] uppercase font-semibold text-stone-400 tracking-wider">
                        {prod.category}
                      </span>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="font-extrabold text-xs text-amber-600 dark:text-amber-500">${prod.price.toFixed(2)}</span>
                      <div className="p-1.5 rounded-xl bg-amber-600/10 text-amber-600 dark:text-amber-500 border border-amber-600/20">
                        <Plus className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          RIGHT PANEL: CART CHECKOUT TERMINAL
         ========================================================= */}
      <div className="w-full xl:w-96 bg-card border border-border rounded-3xl p-6 flex flex-col justify-between shrink-0">
        
        {/* Cart top section */}
        <div className="flex flex-col min-h-0 flex-1">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4 shrink-0">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-amber-600" />
              Checkout Cart ({cart.reduce((a,c) => a + c.quantity, 0)})
            </h3>
            <button
              onClick={() => setCart([])}
              className="text-[10px] text-red-500 hover:underline font-bold"
            >
              Clear Cart
            </button>
          </div>

          {/* Active Cart Listing */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-stone-400">
                <ShoppingCart className="w-10 h-10 text-stone-300 mb-2" />
                <p className="text-xs">Your shopping cart is empty.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="p-3 bg-stone-50/50 dark:bg-stone-900/10 border border-border rounded-2xl space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-xs truncate">{item.name}</h4>
                      {item.selectedModifiers.length > 0 && (
                        <p className="text-[9px] text-amber-600 dark:text-amber-500 font-semibold truncate leading-tight">
                          Modifiers: {item.selectedModifiers.map(m => m.name).join(', ')}
                        </p>
                      )}
                    </div>
                    <span className="font-extrabold text-xs text-stone-700 dark:text-stone-300">${item.totalPrice.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleQtyChange(item.id, false)}
                        className="p-1 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-lg text-stone-500"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQtyChange(item.id, true)}
                        className="p-1 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-lg text-stone-500"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 hover:bg-red-500/10 rounded-lg text-stone-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Cart Bottom Math Summary Section */}
        <div className="border-t border-border pt-4 mt-4 space-y-4 shrink-0">
          
          {/* CRM Customer loyalty connector */}
          <div className="flex items-center justify-between gap-3 p-3 bg-stone-50 dark:bg-stone-900/30 rounded-2xl border border-border">
            <div className="flex items-center gap-2 shrink-0">
              <Users className="w-4 h-4 text-stone-400" />
              <span className="text-xs font-semibold text-stone-500">Customer:</span>
            </div>
            
            {selectedCustomer ? (
              <div className="flex items-center justify-between gap-2 overflow-hidden w-full pl-2">
                <span className="font-bold text-xs truncate text-amber-500">{selectedCustomer.name}</span>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-[9px] text-red-500 hover:underline font-bold"
                >
                  Clear
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCustomerModal(true)}
                className="text-xs font-bold text-amber-500 hover:underline ml-auto"
              >
                Add Loyalty Club Member
              </button>
            )}
          </div>

          {/* Quick options */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-wide mb-1">Discount ($)</span>
              <input
                type="number"
                value={discount || ''}
                onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                placeholder="0.00"
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-wide mb-1">Table Number</span>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Table #4"
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* Checkout pricing details */}
          <div className="space-y-2 text-xs border-t border-border pt-4">
            <div className="flex justify-between text-stone-500">
              <span>Subtotal</span>
              <span className="font-semibold">${cartSubtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-red-500">
                <span>Discount</span>
                <span className="font-semibold">-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-500">
              <span>Tax ({Math.round(tenantTaxRate * 100)}%)</span>
              <span className="font-semibold">${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-black border-t border-border pt-2">
              <span>Total Charge</span>
              <span className="text-amber-600 dark:text-amber-500">${cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => setShowCheckoutModal(true)}
            disabled={cart.length === 0}
            className="w-full py-4 coffee-gradient rounded-2xl font-bold text-sm text-white shadow-xl hover:shadow-amber-950/20 active:scale-[0.99] transition-all disabled:opacity-50"
          >
            Collect Payment & Sync
          </button>
        </div>

      </div>

      {/* =========================================================
          MODIFIERS OPTIONS DIALOG OVERLAY
         ========================================================= */}
      {selectedProductForMod && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <h3 className="font-bold text-sm">Customize {selectedProductForMod.name}</h3>
              <button
                onClick={() => {
                  setSelectedProductForMod(null);
                  setActiveModifiersSelection({});
                }}
                className="p-1 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modifiers List */}
            <div className="space-y-6">
              {selectedProductForMod.modifiers?.map((mod) => (
                <div key={mod.id} className="space-y-3">
                  <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">{mod.name}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {mod.options.map((opt) => {
                      const isSelected = activeModifiersSelection[mod.name]?.name === opt.name;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setActiveModifiersSelection({
                              ...activeModifiersSelection,
                              [mod.name]: { name: opt.name, price: opt.priceAdjustment }
                            });
                          }}
                          className={`p-3 rounded-2xl text-xs font-semibold border flex items-center justify-between transition-all ${
                            isSelected
                              ? 'coffee-gradient text-white border-transparent'
                              : 'bg-stone-50 dark:bg-stone-900/30 border-border hover:border-amber-600/30'
                          }`}
                        >
                          <span>{opt.name}</span>
                          <span className={isSelected ? 'text-white font-bold' : 'text-amber-500 font-extrabold'}>
                            {opt.priceAdjustment > 0 ? `+$${opt.priceAdjustment.toFixed(2)}` : 'Free'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 mt-6">
              <button
                onClick={handleApplyModifiers}
                className="w-full py-3 coffee-gradient rounded-xl font-bold text-xs text-white"
              >
                Confirm Additions & Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          LOYALTY CUSTOMER LISTING MODAL
         ========================================================= */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <h3 className="font-bold text-sm">Select Loyalty Customer</h3>
              <button onClick={() => setShowCustomerModal(false)} className="p-1 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Search by name or phone..."
                  className="pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-2xl text-xs w-full"
                />
              </div>

              <div className="divide-y divide-border max-h-60 overflow-y-auto pr-1">
                {customers
                  .filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.phone.includes(customerSearch))
                  .map(c => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedCustomer(c);
                        setShowCustomerModal(false);
                      }}
                      className="p-3 hover:bg-stone-50 dark:hover:bg-stone-900/30 flex items-center justify-between rounded-xl cursor-pointer"
                    >
                      <div>
                        <h4 className="font-bold text-xs">{c.name}</h4>
                        <span className="text-[10px] text-stone-500 font-mono">{c.phone}</span>
                      </div>
                      <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-500 px-2 py-0.5 rounded-full font-bold">
                        {c.loyaltyPoints} points
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          CHECKOUT DRAWER MODAL (CASH, CARD, DIGITAL, SPLIT)
         ========================================================= */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <h3 className="font-bold text-sm">Collect Payment: ${cartTotal.toFixed(2)}</h3>
              <button onClick={() => setShowCheckoutModal(false)} className="p-1 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              
              {/* Payment Methods tabs grid */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => setPaymentMethod('CASH')}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 border text-[10px] font-bold ${
                    paymentMethod === 'CASH' ? 'coffee-gradient text-white border-transparent' : 'bg-stone-50 dark:bg-stone-900/30'
                  }`}
                >
                  <Banknote className="w-5 h-5" />
                  Cash
                </button>
                <button
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 border text-[10px] font-bold ${
                    paymentMethod === 'CARD' ? 'coffee-gradient text-white border-transparent' : 'bg-stone-50 dark:bg-stone-900/30'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  Card
                </button>
                <button
                  onClick={() => {
                    setPaymentMethod('DIGITAL');
                    // seed dynamic mock pay QR
                    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=pay-charge-amount-${cartTotal}`);
                  }}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 border text-[10px] font-bold ${
                    paymentMethod === 'DIGITAL' ? 'coffee-gradient text-white border-transparent' : 'bg-stone-50 dark:bg-stone-900/30'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  QR Pay
                </button>
                <button
                  onClick={() => {
                    setPaymentMethod('SPLIT');
                    setSplitPayments([
                      { method: 'CASH', amount: Math.round((cartTotal / 2) * 100) / 100 },
                      { method: 'CARD', amount: Math.round((cartTotal / 2) * 100) / 100 }
                    ]);
                  }}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 border text-[10px] font-bold ${
                    paymentMethod === 'SPLIT' ? 'coffee-gradient text-white border-transparent' : 'bg-stone-50 dark:bg-stone-900/30'
                  }`}
                >
                  <PlusCircle className="w-5 h-5" />
                  Split Bill
                </button>
              </div>

              {/* CASH INPUT */}
              {paymentMethod === 'CASH' && (
                <div className="p-4 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-2xl flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-500">Suggested Cash tender:</span>
                  <span className="font-extrabold text-sm text-stone-700 dark:text-stone-300">
                    ${Math.ceil(cartTotal)} ($1 bills change: ${(Math.ceil(cartTotal) - cartTotal).toFixed(2)})
                  </span>
                </div>
              )}

              {/* QR PAY DYNAMIC VIEWER */}
              {paymentMethod === 'DIGITAL' && qrCodeUrl && (
                <div className="flex flex-col items-center justify-center p-4 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold">Scan QR Code to Pay</h4>
                  <img src={qrCodeUrl} alt="Dynamic QR Pay Code" className="w-32 h-32 border border-border/20 rounded-xl" />
                  <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">Dynamic QR Payload Active</span>
                </div>
              )}

              {/* SPLIT BILL CALCULATOR */}
              {paymentMethod === 'SPLIT' && (
                <div className="space-y-4 p-4 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-2xl">
                  <h4 className="text-xs font-bold border-b border-border pb-2">Split payments ledger:</h4>
                  {splitPayments.map((pay, idx) => (
                    <div key={idx} className="flex items-center gap-3 justify-between">
                      <span className="text-xs font-semibold text-stone-600">{pay.method} amount ($):</span>
                      <input
                        type="number"
                        value={pay.amount || ''}
                        onChange={(e) => {
                          const newSplits = [...splitPayments];
                          newSplits[idx].amount = parseFloat(e.target.value) || 0;
                          
                          // automatically balance the other payment if only 2 splits
                          if (newSplits.length === 2) {
                            const otherIdx = idx === 0 ? 1 : 0;
                            newSplits[otherIdx].amount = Math.max(0, Math.round((cartTotal - newSplits[idx].amount) * 100) / 100);
                          }
                          setSplitPayments(newSplits);
                        }}
                        className="w-28 px-3 py-1.5 bg-card border border-border rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                  ))}
                  
                  {/* Validation check */}
                  <div className="flex justify-between items-center pt-2 text-[10px] font-bold">
                    <span>Target Balance:</span>
                    <span className={Math.abs(splitPayments.reduce((a,c) => a + c.amount, 0) - cartTotal) < 0.05 ? 'text-green-500' : 'text-red-500'}>
                      Sum: ${splitPayments.reduce((a,c) => a + c.amount, 0).toFixed(2)} / ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

            </div>

            <div className="border-t border-border pt-4 mt-6">
              <button
                onClick={handleCheckoutSubmit}
                disabled={loading || (paymentMethod === 'SPLIT' && Math.abs(splitPayments.reduce((a,c) => a + c.amount, 0) - cartTotal) >= 0.05)}
                className="w-full py-3.5 coffee-gradient rounded-xl font-bold text-xs text-white"
              >
                {loading ? 'Submitting checkout receipt...' : 'Complete Checkout Transaction'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          VIRTUAL RECEIPT PRINTER POPUP
         ========================================================= */}
      {showReceiptModal && completedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-card border border-border rounded-3xl p-6 shadow-2xl animate-slide-up relative">
            <button
              onClick={() => {
                setShowReceiptModal(false);
                setCompletedOrder(null);
              }}
              className="absolute right-4 top-4 p-1 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Simulated Receipt paper layout */}
            <div className="p-4 bg-white text-stone-900 border border-stone-200 rounded-2xl shadow-inner font-mono text-xs space-y-4 max-h-[80vh] overflow-y-auto">
              
              <div className="text-center space-y-1">
                <Coffee className="w-6 h-6 text-stone-800 mx-auto" />
                <h4 className="font-extrabold text-sm uppercase tracking-wide">BrewOps Coffee Co.</h4>
                <p className="text-[10px] text-stone-500">100 Specialty Coffee Lane, Seattle</p>
                <p className="text-[9px] text-stone-400">Tel: 555-123-4567</p>
              </div>

              <div className="border-t border-dashed border-stone-300 pt-3 space-y-1 text-[10px] text-stone-500">
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span>{completedOrder.id.substring(0,8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Serial:</span>
                  <span className="font-bold">{completedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{new Date(completedOrder.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Source:</span>
                  <span>{completedOrder.source}</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="border-t border-dashed border-stone-300 pt-3 space-y-2">
                <div className="grid grid-cols-4 font-bold text-[10px] pb-1 border-b border-dashed border-stone-300">
                  <span className="col-span-2">Item</span>
                  <span className="text-center">Qty</span>
                  <span className="text-right">Price</span>
                </div>
                {completedOrder.orderItems?.map((item: any) => (
                  <div key={item.id} className="grid grid-cols-4 text-[10px] text-stone-700">
                    <div className="col-span-2 overflow-hidden leading-tight">
                      <span className="font-semibold block">{item.product?.name || 'Drink Item'}</span>
                      {item.options?.length > 0 && (
                        <span className="text-[9px] text-stone-400 block pl-2">
                          + {item.options.map((m: any) => m.optionName).join(', ')}
                        </span>
                      )}
                    </div>
                    <span className="text-center font-semibold">{item.quantity}</span>
                    <span className="text-right font-semibold">${item.totalPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Subtotals & Taxes */}
              <div className="border-t border-dashed border-stone-300 pt-3 space-y-1.5 text-[10px] text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${completedOrder.totalAmount.toFixed(2)}</span>
                </div>
                {completedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount</span>
                    <span>-${completedOrder.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax ({Math.round((completedOrder.taxAmount / (completedOrder.totalAmount - completedOrder.discountAmount || 1)) * 100)}%)</span>
                  <span>${completedOrder.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-black text-xs text-stone-900 border-t border-dashed border-stone-300 pt-1.5">
                  <span>Total Charge</span>
                  <span>${completedOrder.finalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* CRM loyalty award */}
              {completedOrder.loyaltyPointsEarned > 0 && (
                <div className="p-2 bg-stone-50 border border-stone-100 rounded-lg text-center text-[9px] text-stone-500">
                  <span className="font-bold block text-stone-700">LOYALTY MEMBERSHIP:</span>
                  Earned {completedOrder.loyaltyPointsEarned} points this purchase.
                </div>
              )}

              <div className="text-center border-t border-dashed border-stone-300 pt-3 space-y-1 text-[10px] text-stone-400">
                <p className="font-semibold uppercase tracking-wide">Thank You for Brewing with Us!</p>
                <p className="text-[8px]">BrewOps Vertical SaaS • Tax ID: TX-BREW-9912</p>
              </div>

            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 border border-border rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4 text-stone-500" />
                Print Receipt
              </button>
              <button
                onClick={() => {
                  setShowReceiptModal(false);
                  setCompletedOrder(null);
                }}
                className="flex-1 py-2.5 coffee-gradient rounded-xl font-bold text-xs text-white"
              >
                Start Next Order
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
    </div>
  );
}
