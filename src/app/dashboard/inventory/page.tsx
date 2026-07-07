'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  AlertTriangle,
  RefreshCw,
  PlusCircle,
  Truck,
  BookOpen,
  ArrowRight,
  TrendingDown,
  Timer,
  X,
  UserCheck,
  ClipboardList,
  CheckCircle2
} from 'lucide-react';

interface Ingredient {
  id: string;
  name: string;
  sku: string;
  unit: string;
  currentStock: number;
  minStockLevel: number;
  costPerUnit: number;
  supplier?: { name: string } | null;
}

interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
}

export default function InventoryDashboard() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Manual Stock Adjuster Modal
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustReason, setAdjustReason] = useState('Manual stock take check');

  // Supplier purchase orders builders
  const [showPOModal, setShowPOModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [poItems, setPoItems] = useState<{ name: string; qty: number; cost: number }[]>([
    { name: 'Beans Restock 10kg', qty: 10000, cost: 0.02 }
  ]);

  // Recipes viewer
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  // Load functions
  const loadInventoryData = async () => {
    setLoading(true);
    try {
      const ingRes = await fetch('/api/inventory');
      if (ingRes.ok) {
        const ings = await ingRes.json();
        setIngredients(ings);
      }
      
      const supRes = await fetch('/api/suppliers');
      if (supRes.ok) {
        const sups = await supRes.json();
        setSuppliers(sups);
        if (sups.length > 0) setSelectedSupplier(sups[0].id);
      }
    } catch (err) {
      console.error("Failed to load inventory data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventoryData();
  }, []);

  // Submit manual adjustment
  const handleAdjustmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIngredient || !adjustmentAmount) return;

    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredientId: selectedIngredient.id,
          adjustmentAmount: parseFloat(adjustmentAmount),
          reason: adjustReason
        })
      });

      if (res.ok) {
        setShowAdjustModal(false);
        setAdjustmentAmount('');
        loadInventoryData();
      } else {
        const data = await res.json();
        alert("Stock adjustment failed: " + data.error);
      }
    } catch (err) {
      alert("Adjustment request failed.");
    }
  };

  // Submit Purchase Order
  const handlePOSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier) return;

    // Simulate PO restock success locally
    try {
      // Find the items and add their stock levels
      const itemToRestock = ingredients.find(ing => ing.name.toLowerCase().includes("beans"));
      if (itemToRestock) {
        await fetch('/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ingredientId: itemToRestock.id,
            adjustmentAmount: 10000,
            reason: "Procurement restock purchase order PO-BREW-0921"
          })
        });
      }

      setShowPOModal(false);
      alert("Purchase Order placed and received! 10kg beans added to inventory stock.");
      loadInventoryData();
    } catch (err) {
      alert("PO submission failed.");
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] w-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-amber-600/30 border-t-amber-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-xs font-semibold text-stone-500 dark:text-stone-400">Loading live inventory shelf...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* HEADER ACTION ACTIONS BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-sans tracking-tight">Inventory Stock Control</h2>
          <p className="text-xs text-stone-500 mt-1">Track ingredient levels, manage recipe deductions, and procure from suppliers.</p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setShowRecipeModal(true)}
            className="px-4 py-2.5 bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-850 border border-border rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-stone-500" />
            Product Recipes
          </button>
          
          <button
            onClick={() => setShowPOModal(true)}
            className="px-4 py-2.5 bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-850 border border-border rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Truck className="w-4 h-4 text-amber-500" />
            Supplier Reorder PO
          </button>
          
          <button
            onClick={loadInventoryData}
            className="p-2.5 bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-850 border border-border rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-stone-500" />
          </button>
        </div>
      </div>

      {/* CORE INGREDIENT LIST TABLE */}
      <div className="glass-panel border border-border rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-amber-600 animate-pulse" />
            Ingredient safety Safety levels
          </h3>
          <span className="text-[10px] font-bold text-stone-400">
            Total items: {ingredients.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-stone-50/50 dark:bg-stone-900/30 text-stone-400 font-bold uppercase tracking-wider">
                <th className="p-4">SKU Code</th>
                <th className="p-4">Ingredient Name</th>
                <th className="p-4">Category Supplier</th>
                <th className="p-4 text-right">Current Stock</th>
                <th className="p-4 text-right">Minimum safety level</th>
                <th className="p-4">Alert Status</th>
                <th className="p-4 text-right">Unit Cost</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ingredients.map((ing) => {
                const isBelowMin = ing.currentStock <= ing.minStockLevel;
                const percent = Math.min(100, (ing.currentStock / (ing.minStockLevel * 4)) * 100);
                
                return (
                  <tr key={ing.id} className="hover:bg-stone-50/20 dark:hover:bg-stone-900/10 transition-colors">
                    <td className="p-4 font-mono text-[10px] text-stone-500 font-bold">{ing.sku}</td>
                    <td className="p-4 font-bold">{ing.name}</td>
                    <td className="p-4 text-stone-400 font-semibold">{ing.supplier?.name || 'Local Vendor'}</td>
                    
                    <td className="p-4 text-right font-extrabold text-stone-700 dark:text-stone-200">
                      {ing.currentStock.toFixed(0)} {ing.unit}
                    </td>
                    
                    <td className="p-4 text-right text-stone-400 font-bold">
                      {ing.minStockLevel} {ing.unit}
                    </td>

                    <td className="p-4">
                      {isBelowMin ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-[9px] font-black uppercase text-red-500 tracking-wider flex items-center gap-1.5 w-fit">
                          <AlertTriangle className="w-3 h-3 text-red-500" />
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/30 text-[9px] font-black uppercase text-green-600 dark:text-green-400 tracking-wider flex items-center gap-1.5 w-fit">
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                          Balanced
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right text-stone-400 font-mono">${ing.costPerUnit.toFixed(4)}/{ing.unit}</td>
                    
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedIngredient(ing);
                          setShowAdjustModal(true);
                        }}
                        className="px-2.5 py-1 hover:bg-amber-600 hover:text-white border border-amber-600/30 rounded-lg text-[10px] font-bold text-amber-600 transition-all active:scale-95"
                      >
                        Adjust Stock
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
          STOCK ADJUSTMENT MODAL OVERLAY
         ========================================================= */}
      {showAdjustModal && selectedIngredient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="w-full max-w-sm bg-card border border-border rounded-3xl p-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <h3 className="font-bold text-sm">Adjust Stock: {selectedIngredient.name}</h3>
              <button onClick={() => setShowAdjustModal(false)} className="p-1 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustmentSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                  Adjustment quantity ({selectedIngredient.unit})
                </label>
                <input
                  type="number"
                  step="any"
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(e.target.value)}
                  placeholder="e.g. +5000 to restock, or -200 for waste"
                  required
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                  Adjustment Reason
                </label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Manual count verification, Spillage/waste"
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div className="p-3.5 bg-amber-600/10 border border-amber-600/30 rounded-2xl flex items-start gap-2.5 text-[10px] leading-normal text-amber-600 dark:text-amber-500">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>This stock correction will immediately write a new line to the active inventory audit log.</p>
              </div>

              <button
                type="submit"
                className="w-full py-3 coffee-gradient rounded-xl font-bold text-xs text-white"
              >
                Apply stock adjustment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          SUPPLIER PURCHASE ORDER DIALOG OVERLAY
         ========================================================= */}
      {showPOModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <h3 className="font-bold text-sm">Draft Purchase Order</h3>
              <button onClick={() => setShowPOModal(false)} className="p-1 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePOSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Select Supplier</label>
                <select
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-xl text-xs focus:outline-none"
                >
                  {suppliers.map(sup => (
                    <option key={sup.id} value={sup.id}>{sup.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">Order Items</label>
                <div className="p-3 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Espresso Roast Beans 10kg</span>
                    <span>Cost: $200.00</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 coffee-gradient rounded-xl font-bold text-xs text-white"
              >
                Place and Receive Purchase Order
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          PRODUCT RECIPES CONFIGURATION VIEWER
         ========================================================= */}
      {showRecipeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-card border border-border rounded-3xl p-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <h3 className="font-bold text-sm">Product recipe Recipe configuration</h3>
              <button onClick={() => setShowRecipeModal(false)} className="p-1 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              
              <div className="p-4 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-2xl space-y-2">
                <h4 className="font-bold text-xs">Caffe Latte 12oz</h4>
                <div className="text-[11px] text-stone-500 space-y-1 pl-3">
                  <p>• 18g Espresso Blend Beans</p>
                  <p>• 200ml Whole Milk (replaced by Oat milk if selected as modifier)</p>
                  <p>• 1 Paper Coffee Cups 12oz</p>
                </div>
              </div>

              <div className="p-4 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-2xl space-y-2">
                <h4 className="font-bold text-xs">Double Espresso</h4>
                <div className="text-[11px] text-stone-500 space-y-1 pl-3">
                  <p>• 18g Espresso Blend Beans</p>
                </div>
              </div>

              <div className="p-4 bg-stone-50 dark:bg-stone-900/30 border border-border rounded-2xl space-y-2">
                <h4 className="font-bold text-xs">Iced Vanilla Latte 12oz</h4>
                <div className="text-[11px] text-stone-500 space-y-1 pl-3">
                  <p>• 18g Espresso Blend Beans</p>
                  <p>• 200ml Whole Milk</p>
                  <p>• 30ml Organic Vanilla Syrup</p>
                  <p>• 1 Paper Coffee Cups 12oz</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
