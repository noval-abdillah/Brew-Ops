// ---------------------------------------------------------
// HIGH-FIDELITY CENTRALIZED MOCK DATA STORE FOR BREWOPS
// Serves as the source-of-truth for both seed.js and in-memory mock controllers.
// ---------------------------------------------------------

export interface MockTenant {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  taxRate: number;
  currency: string;
}

export interface MockUser {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: 'OWNER' | 'MANAGER' | 'STAFF';
}

export interface MockCustomer {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
}

export interface MockSupplier {
  id: string;
  tenantId: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
}

export interface MockIngredient {
  id: string;
  tenantId: string;
  supplierId: string;
  name: string;
  sku: string;
  unit: string;
  currentStock: number;
  minStockLevel: number;
  costPerUnit: number;
}

export interface MockProduct {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  category: string;
  imageUrl: string;
  active: boolean;
}

export const mockTenant: MockTenant = {
  id: 'mock-tenant-id-brewops',
  name: 'BrewOps Coffee Co.',
  slug: 'brewops',
  address: '100 Specialty Coffee Lane, Seattle, WA',
  phone: '555-123-4567',
  taxRate: 0.08,
  currency: 'USD'
};

export const mockUsers: MockUser[] = [
  { id: 'mock-user-id-owner', tenantId: mockTenant.id, email: 'owner@brewops.com', name: 'Elena Vance', role: 'OWNER' },
  { id: 'mock-user-id-manager', tenantId: mockTenant.id, email: 'manager@brewops.com', name: 'Marcus Brody', role: 'MANAGER' },
  { id: 'mock-user-id-staff', tenantId: mockTenant.id, email: 'staff@brewops.com', name: 'Jordan Miller', role: 'STAFF' }
];

export const mockCustomers: MockCustomer[] = [
  { id: 'mock-cust-1', tenantId: mockTenant.id, name: 'Alice Cooper', email: 'alice@gmail.com', phone: '206-555-0192', loyaltyPoints: 1250 },
  { id: 'mock-cust-2', tenantId: mockTenant.id, name: 'Bob Ross', email: 'bob@painting.org', phone: '206-555-0143', loyaltyPoints: 340 },
  { id: 'mock-cust-3', tenantId: mockTenant.id, name: 'Charlie Brown', email: 'charlie@peanuts.com', phone: '206-555-0111', loyaltyPoints: 80 }
];

export const mockSuppliers: MockSupplier[] = [
  {
    id: 'mock-sup-1',
    tenantId: mockTenant.id,
    name: 'Bean & Co. Roasters',
    contactName: 'Carlos Santoro',
    email: 'carlos@beanandco.com',
    phone: '555-987-6543',
    address: '42 Coffee Roastery Rd, Portland, OR'
  },
  {
    id: 'mock-sup-2',
    tenantId: mockTenant.id,
    name: 'Dairy Fresh Foods LLC',
    contactName: 'Sarah Jenkins',
    email: 'sarah@dairyfresh.com',
    phone: '555-876-5432',
    address: '12 Milk Meadows Blvd, Yakima, WA'
  }
];

export const mockIngredients: MockIngredient[] = [
  {
    id: 'mock-ing-1',
    tenantId: mockTenant.id,
    supplierId: 'mock-sup-1',
    name: 'Espresso Blend Beans',
    sku: 'ING-ESP-BEANS',
    unit: 'g',
    currentStock: 12500,
    minStockLevel: 2500,
    costPerUnit: 0.02
  },
  {
    id: 'mock-ing-2',
    tenantId: mockTenant.id,
    supplierId: 'mock-sup-2',
    name: 'Whole Milk',
    sku: 'ING-MILK-WHOLE',
    unit: 'ml',
    currentStock: 32000,
    minStockLevel: 8000,
    costPerUnit: 0.002
  },
  {
    id: 'mock-ing-3',
    tenantId: mockTenant.id,
    supplierId: 'mock-sup-2',
    name: 'Barista Oat Milk',
    sku: 'ING-MILK-OAT',
    unit: 'ml',
    currentStock: 18000,
    minStockLevel: 5000,
    costPerUnit: 0.0035
  },
  {
    id: 'mock-ing-4',
    tenantId: mockTenant.id,
    supplierId: 'mock-sup-2',
    name: 'Organic Vanilla Syrup',
    sku: 'ING-SYRUP-VANILLA',
    unit: 'ml',
    currentStock: 4000,
    minStockLevel: 1000,
    costPerUnit: 0.012
  },
  {
    id: 'mock-ing-5',
    tenantId: mockTenant.id,
    supplierId: 'mock-sup-2',
    name: 'Paper Coffee Cups 12oz',
    sku: 'ING-CUPS-12OZ',
    unit: 'pcs',
    currentStock: 450,
    minStockLevel: 100,
    costPerUnit: 0.15
  }
];

export const mockProducts: MockProduct[] = [
  {
    id: 'mock-prod-1',
    tenantId: mockTenant.id,
    name: 'Double Espresso',
    description: 'Rich, concentrated double shot of specialty espresso beans.',
    price: 3.50,
    cost: 0.36,
    category: 'Coffee',
    imageUrl: 'https://images.unsplash.com/photo-1510707577719-0d32152862e0?auto=format&fit=crop&q=80&w=400',
    active: true
  },
  {
    id: 'mock-prod-2',
    tenantId: mockTenant.id,
    name: 'Americano 12oz',
    description: 'Double espresso hot water pour over.',
    price: 4.00,
    cost: 0.51,
    category: 'Coffee',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400',
    active: true
  },
  {
    id: 'mock-prod-3',
    tenantId: mockTenant.id,
    name: 'Caffe Latte 12oz',
    description: 'Espresso double shot with steamed silky microfoam whole milk.',
    price: 4.75,
    cost: 0.91,
    category: 'Coffee',
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=400',
    active: true
  },
  {
    id: 'mock-prod-4',
    tenantId: mockTenant.id,
    name: 'Iced Vanilla Latte 12oz',
    description: 'Double shot espresso, cold milk, rich vanilla syrup, and ice.',
    price: 5.50,
    cost: 1.27,
    category: 'Coffee',
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=400',
    active: true
  },
  {
    id: 'mock-prod-5',
    tenantId: mockTenant.id,
    name: 'Butter Croissant',
    description: 'Freshly baked flaky butter pastry.',
    price: 3.75,
    cost: 1.10,
    category: 'Pastry',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=400',
    active: true
  }
];

export const mockRecipes = [
  { productId: 'mock-prod-1', ingredientId: 'mock-ing-1', quantity: 18 },
  
  { productId: 'mock-prod-2', ingredientId: 'mock-ing-1', quantity: 18 },
  { productId: 'mock-prod-2', ingredientId: 'mock-ing-5', quantity: 1 },
  
  { productId: 'mock-prod-3', ingredientId: 'mock-ing-1', quantity: 18 },
  { productId: 'mock-prod-3', ingredientId: 'mock-ing-2', quantity: 200 },
  { productId: 'mock-prod-3', ingredientId: 'mock-ing-5', quantity: 1 },
  
  { productId: 'mock-prod-4', ingredientId: 'mock-ing-1', quantity: 18 },
  { productId: 'mock-prod-4', ingredientId: 'mock-ing-2', quantity: 200 },
  { productId: 'mock-prod-4', ingredientId: 'mock-ing-3', quantity: 0 }, // whole milk override placeholder
  { productId: 'mock-prod-4', ingredientId: 'mock-ing-4', quantity: 30 },
  { productId: 'mock-prod-4', ingredientId: 'mock-ing-5', quantity: 1 },

  // Modifier options ingredients mapping
  { modifierOptionName: 'Oat Milk', ingredientId: 'mock-ing-3', quantity: 200 }
];

export const mockModifiers = [
  {
    id: 'mock-mod-1',
    productId: 'mock-prod-3',
    name: 'Milk Type',
    required: false,
    minSelections: 0,
    maxSelections: 1,
    options: [
      { id: 'mock-opt-1', name: 'Oat Milk', priceAdjustment: 0.80, costAdjustment: 0.30, deductIngredientId: 'mock-ing-3', deductQuantity: 200 }
    ]
  },
  {
    id: 'mock-mod-2',
    productId: 'mock-prod-4',
    name: 'Milk Type',
    required: false,
    minSelections: 0,
    maxSelections: 1,
    options: [
      { id: 'mock-opt-2', name: 'Oat Milk', priceAdjustment: 0.80, costAdjustment: 0.30, deductIngredientId: 'mock-ing-3', deductQuantity: 200 }
    ]
  }
];

export interface MockOrder {
  id: string;
  tenantId: string;
  userId: string;
  customerId: string | null;
  orderNumber: string;
  source: 'POS' | 'ONLINE';
  status: 'PENDING' | 'PREPARING' | 'COMPLETED' | 'CANCELLED';
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  finalAmount: number;
  paymentMethod: 'CASH' | 'CARD' | 'DIGITAL' | 'SPLIT';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  loyaltyPointsEarned: number;
  createdAt: string;
  updatedAt: string;
  orderItems: any[];
}

/**
 * Generates highly deterministic, realistic, high-fidelity mock sales data for 30 days.
 */
export function generateMockOrders(): MockOrder[] {
  const list: MockOrder[] = [];
  const baseDate = new Date();
  let orderIdCounter = 1;

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(baseDate.getDate() - i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
    const numOrders = isWeekend ? 12 : 7; // consistent numbers to keep memory foot-print stable

    for (let o = 0; o < numOrders; o++) {
      let customerId = null;
      let customerName = null;
      if (o % 3 === 0) {
        const c = mockCustomers[o % mockCustomers.length];
        customerId = c.id;
        customerName = c.name;
      }

      const hour = o % 2 === 0 ? 8 + (o % 4) : 14 + (o % 3); // realistic breakfast/afternoon hours
      const orderDate = new Date(date);
      orderDate.setHours(hour);
      orderDate.setMinutes(o * 5);
      orderDate.setSeconds(0);

      // Construct order items
      const itemsCount = 1 + (o % 2);
      const items = [];
      let totalAmount = 0;
      let totalCost = 0;

      for (let k = 0; k < itemsCount; k++) {
        const prodIdx = (o + k) % mockProducts.length;
        const prod = mockProducts[prodIdx];
        const qty = 1;
        
        let modPrice = 0;
        const options = [];
        if ((prod.id === 'mock-prod-3' || prod.id === 'mock-prod-4') && o % 2 === 0) {
          modPrice = 0.80;
          options.push({ optionName: 'Oat Milk', priceAdjustment: 0.80 });
        }

        const unitPrice = prod.price + modPrice;
        const totalPrice = unitPrice * qty;

        items.push({
          id: `mock-orderitem-${orderIdCounter}-${k}`,
          orderId: `mock-order-${orderIdCounter}`,
          productId: prod.id,
          quantity: qty,
          unitPrice,
          totalPrice,
          options,
          product: {
            name: prod.name,
            category: prod.category
          }
        });

        totalAmount += totalPrice;
        totalCost += (prod.cost + (modPrice > 0 ? 0.30 : 0)) * qty;
      }

      const tax = totalAmount * mockTenant.taxRate;
      const finalAmount = totalAmount + tax;
      const points = Math.floor(totalAmount * 10);

      list.push({
        id: `mock-order-${orderIdCounter}`,
        tenantId: mockTenant.id,
        userId: 'mock-user-id-staff',
        customerId,
        orderNumber: `#${String(orderIdCounter).padStart(4, '0')}`,
        source: o === 5 ? 'ONLINE' : 'POS',
        status: 'COMPLETED',
        totalAmount: Math.round(totalAmount * 100) / 100,
        discountAmount: 0,
        taxAmount: Math.round(tax * 100) / 100,
        finalAmount: Math.round(finalAmount * 100) / 100,
        paymentMethod: o % 2 === 0 ? 'CARD' : 'CASH',
        paymentStatus: 'PAID',
        loyaltyPointsEarned: points,
        createdAt: orderDate.toISOString(),
        updatedAt: orderDate.toISOString(),
        orderItems: items
      });

      orderIdCounter++;
    }
  }

  return list;
}

export const mockShifts = [
  { id: 'mock-shift-1', userId: 'mock-user-id-staff', name: 'Jordan Miller', startTime: new Date(new Date().setHours(8,0,0)).toISOString(), endTime: new Date(new Date().setHours(16,0,0)).toISOString(), status: 'COMPLETED', salesGenerated: 345.50, ordersHandled: 42 },
  { id: 'mock-shift-2', userId: 'mock-user-id-manager', name: 'Marcus Brody', startTime: new Date(new Date().setHours(12,0,0)).toISOString(), endTime: null, status: 'ACTIVE', salesGenerated: 120.00, ordersHandled: 15 }
];

export const mockNotifications = [
  { id: 'mock-notif-1', tenantId: mockTenant.id, type: 'LOW_STOCK', message: 'Ingredient "Paper Coffee Cups 12oz" has reached critical levels (75 left).', read: false, createdAt: new Date().toISOString() },
  { id: 'mock-notif-2', tenantId: mockTenant.id, type: 'SYSTEM', message: 'Monthly sales metrics are ready for export.', read: true, createdAt: new Date(Date.now() - 3600000).toISOString() }
];

export const mockAIInsights = [
  {
    id: 'mock-insight-1',
    tenantId: mockTenant.id,
    type: 'SALES',
    content: {
      title: 'Optimize Afternoon Lattes',
      details: 'Caffe Latte sales peak around 2:30 PM on weekdays. You can increase revenue by offering a "Latte & Croissant" combo discount between 2:00 PM and 4:00 PM.',
      recommendedAction: 'Create 15% Afternoon Combo Promo',
      priority: 'HIGH',
      impactMetric: '+$145/wk margin'
    }
  },
  {
    id: 'mock-insight-2',
    tenantId: mockTenant.id,
    type: 'INVENTORY',
    content: {
      title: 'Stock Out Warning: Cups',
      details: 'Based on your recent 7-day average sales velocity, "Paper Coffee Cups 12oz" is projected to run out in 3.5 days. Place a reorder now to avoid disruptions.',
      recommendedAction: 'Reorder 500 Cups from Supplier',
      priority: 'CRITICAL',
      impactMetric: 'Avoid stockout'
    }
  },
  {
    id: 'mock-insight-3',
    tenantId: mockTenant.id,
    type: 'BUSINESS',
    content: {
      title: 'Almond & Oat Milk Cost Adjustments',
      details: 'Whole milk consumption represents 80% of recipes, but Oat Milk upgrades are generating 45% of modifier profit margins. Maintain a $0.80 Oat Milk premium pricing.',
      recommendedAction: 'Keep Modifier Pricing Premium',
      priority: 'MEDIUM',
      impactMetric: '+8% menu profit'
    }
  }
];
