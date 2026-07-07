const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean database
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Tenant" CASCADE;`);
  
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  // ---------------------------------------------------------
  // TENANT 1: BrewOps Coffee Co. (Primary Premium Shop)
  // ---------------------------------------------------------
  const tenant1 = await prisma.tenant.create({
    data: {
      name: 'BrewOps Coffee Co.',
      slug: 'brewops',
      address: '100 Specialty Coffee Lane, Seattle, WA',
      phone: '555-123-4567',
      taxRate: 0.08,
      currency: 'USD',
      paymentConfig: {
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=pay-to-brewops',
        digitalEnabled: true,
        taxNumber: 'TX-BREW-9912'
      }
    }
  });

  // Users for Tenant 1
  const owner1 = await prisma.user.create({
    data: {
      tenantId: tenant1.id,
      email: 'owner@brewops.com',
      passwordHash,
      name: 'Elena Vance',
      role: 'OWNER'
    }
  });

  const manager1 = await prisma.user.create({
    data: {
      tenantId: tenant1.id,
      email: 'manager@brewops.com',
      passwordHash,
      name: 'Marcus Brody',
      role: 'MANAGER'
    }
  });

  const staff1 = await prisma.user.create({
    data: {
      tenantId: tenant1.id,
      email: 'staff@brewops.com',
      passwordHash,
      name: 'Jordan Miller',
      role: 'STAFF'
    }
  });

  // Customers for Tenant 1
  const alice = await prisma.customer.create({
    data: {
      tenantId: tenant1.id,
      name: 'Alice Cooper',
      email: 'alice@gmail.com',
      phone: '206-555-0192',
      loyaltyPoints: 1250
    }
  });

  const bob = await prisma.customer.create({
    data: {
      tenantId: tenant1.id,
      name: 'Bob Ross',
      email: 'bob@painting.org',
      phone: '206-555-0143',
      loyaltyPoints: 340
    }
  });

  const charlie = await prisma.customer.create({
    data: {
      tenantId: tenant1.id,
      name: 'Charlie Brown',
      email: 'charlie@peanuts.com',
      phone: '206-555-0111',
      loyaltyPoints: 80
    }
  });

  // Suppliers for Tenant 1
  const beanSupplier = await prisma.supplier.create({
    data: {
      tenantId: tenant1.id,
      name: 'Bean & Co. Roasters',
      contactName: 'Carlos Santoro',
      email: 'carlos@beanandco.com',
      phone: '555-987-6543',
      address: '42 Coffee Roastery Rd, Portland, OR'
    }
  });

  const dairySupplier = await prisma.supplier.create({
    data: {
      tenantId: tenant1.id,
      name: 'Dairy Fresh Foods LLC',
      contactName: 'Sarah Jenkins',
      email: 'sarah@dairyfresh.com',
      phone: '555-876-5432',
      address: '12 Milk Meadows Blvd, Yakima, WA'
    }
  });

  // Ingredients for Tenant 1
  const beans = await prisma.ingredient.create({
    data: {
      tenantId: tenant1.id,
      supplierId: beanSupplier.id,
      name: 'Espresso Blend Beans',
      sku: 'ING-ESP-BEANS',
      unit: 'g',
      currentStock: 12500, // 12.5 kg
      minStockLevel: 2500,
      costPerUnit: 0.02 // $0.02 per gram ($20/kg)
    }
  });

  const wholeMilk = await prisma.ingredient.create({
    data: {
      tenantId: tenant1.id,
      supplierId: dairySupplier.id,
      name: 'Whole Milk',
      sku: 'ING-MILK-WHOLE',
      unit: 'ml',
      currentStock: 32000, // 32 Liters
      minStockLevel: 8000,
      costPerUnit: 0.002 // $0.002 per ml ($2/L)
    }
  });

  const oatMilk = await prisma.ingredient.create({
    data: {
      tenantId: tenant1.id,
      supplierId: dairySupplier.id,
      name: 'Barista Oat Milk',
      sku: 'ING-MILK-OAT',
      unit: 'ml',
      currentStock: 18000, // 18 Liters
      minStockLevel: 5000,
      costPerUnit: 0.0035 // $0.0035 per ml ($3.50/L)
    }
  });

  const vanillaSyrup = await prisma.ingredient.create({
    data: {
      tenantId: tenant1.id,
      supplierId: dairySupplier.id,
      name: 'Organic Vanilla Syrup',
      sku: 'ING-SYRUP-VANILLA',
      unit: 'ml',
      currentStock: 4000, // 4 Liters
      minStockLevel: 1000,
      costPerUnit: 0.012 // $0.012 per ml
    }
  });

  const paperCups = await prisma.ingredient.create({
    data: {
      tenantId: tenant1.id,
      supplierId: dairySupplier.id,
      name: 'Paper Coffee Cups 12oz',
      sku: 'ING-CUPS-12OZ',
      unit: 'pcs',
      currentStock: 450,
      minStockLevel: 100,
      costPerUnit: 0.15 // $0.15 per cup
    }
  });

  // Products (Menu) for Tenant 1
  const espresso = await prisma.product.create({
    data: {
      tenantId: tenant1.id,
      name: 'Double Espresso',
      description: 'Rich, concentrated double shot of specialty espresso beans.',
      price: 3.50,
      cost: 0.36, // 18g beans * 0.02
      category: 'Coffee',
      imageUrl: 'https://images.unsplash.com/photo-1510707577719-0d32152862e0?auto=format&fit=crop&q=80&w=400'
    }
  });

  const americano = await prisma.product.create({
    data: {
      tenantId: tenant1.id,
      name: 'Americano 12oz',
      description: 'Double espresso hot water pour over.',
      price: 4.00,
      cost: 0.51, // 18g beans * 0.02 + 1 cup * 0.15
      category: 'Coffee',
      imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400'
    }
  });

  const latte = await prisma.product.create({
    data: {
      tenantId: tenant1.id,
      name: 'Caffe Latte 12oz',
      description: 'Espresso double shot with steamed silky microfoam whole milk.',
      price: 4.75,
      cost: 0.91, // 18g beans * 0.02 + 200ml milk * 0.002 + 1 cup * 0.15
      category: 'Coffee',
      imageUrl: 'https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?auto=format&fit=crop&q=80&w=400'
    }
  });

  const vanillaLatte = await prisma.product.create({
    data: {
      tenantId: tenant1.id,
      name: 'Iced Vanilla Latte 12oz',
      description: 'Double shot espresso, cold milk, rich vanilla syrup, and ice.',
      price: 5.50,
      cost: 1.27, // 18g beans * 0.02 + 200ml milk * 0.002 + 30ml syrup * 0.012 + 1 cup * 0.15
      category: 'Coffee',
      imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=400'
    }
  });

  const croissant = await prisma.product.create({
    data: {
      tenantId: tenant1.id,
      name: 'Butter Croissant',
      description: 'Freshly baked flaky butter pastry.',
      price: 3.75,
      cost: 1.10, // wholesale cost
      category: 'Pastry',
      imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=400'
    }
  });

  // Product recipes mapping (ProductIngredient)
  await prisma.productIngredient.createMany({
    data: [
      { productId: espresso.id, ingredientId: beans.id, quantity: 18 },
      
      { productId: americano.id, ingredientId: beans.id, quantity: 18 },
      { productId: americano.id, ingredientId: paperCups.id, quantity: 1 },
      
      { productId: latte.id, ingredientId: beans.id, quantity: 18 },
      { productId: latte.id, ingredientId: wholeMilk.id, quantity: 200 },
      { productId: latte.id, ingredientId: paperCups.id, quantity: 1 },
      
      { productId: vanillaLatte.id, ingredientId: beans.id, quantity: 18 },
      { productId: vanillaLatte.id, ingredientId: wholeMilk.id, quantity: 200 },
      { productId: vanillaLatte.id, ingredientId: vanillaSyrup.id, quantity: 30 },
      { productId: vanillaLatte.id, ingredientId: paperCups.id, quantity: 1 }
    ]
  });

  // Product Modifiers
  const milkMod = await prisma.productModifier.create({
    data: {
      productId: latte.id,
      name: 'Milk Type',
      required: false,
      minSelections: 0,
      maxSelections: 1
    }
  });

  const milkModIced = await prisma.productModifier.create({
    data: {
      productId: vanillaLatte.id,
      name: 'Milk Type',
      required: false,
      minSelections: 0,
      maxSelections: 1
    }
  });

  // Modifiers Options (with ingredient overrides for Oat Milk!)
  await prisma.modifierOption.create({
    data: {
      modifierId: milkMod.id,
      name: 'Oat Milk',
      priceAdjustment: 0.80,
      costAdjustment: 0.30, // Oat milk costs $0.30 more per 200ml
      deductIngredientId: oatMilk.id,
      deductQuantity: 200
    }
  });

  await prisma.modifierOption.create({
    data: {
      modifierId: milkModIced.id,
      name: 'Oat Milk',
      priceAdjustment: 0.80,
      costAdjustment: 0.30,
      deductIngredientId: oatMilk.id,
      deductQuantity: 200
    }
  });

  // ---------------------------------------------------------
  // GENERATE 30 DAYS OF REALISTIC TRANSACTIONS (Tenant 1)
  // ---------------------------------------------------------
  console.log('📈 Seeding sales history (30 days)...');
  const now = new Date();
  let totalOrderCounter = 1;

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    // Simulate peak hours: Breakfast (8am-10am) & Afternoon (2pm-4pm)
    // Weekends (Fri, Sat, Sun) have higher transaction volume
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
    const numOrders = isWeekend ? 10 + Math.floor(Math.random() * 8) : 5 + Math.floor(Math.random() * 6);

    for (let o = 0; o < numOrders; o++) {
      // Pick random customer or guest (70% guest)
      let customerId = null;
      let customerObj = null;
      if (Math.random() > 0.7) {
        const custIdx = Math.floor(Math.random() * 3);
        const custs = [alice, bob, charlie];
        customerObj = custs[custIdx];
        customerId = customerObj.id;
      }

      // Determine hour of order
      let hour = 9; // default breakfast
      if (Math.random() > 0.5) {
        hour = 14 + Math.floor(Math.random() * 3); // Afternoon: 2pm - 5pm
      } else {
        hour = 8 + Math.floor(Math.random() * 3); // Morning: 8am - 11am
      }
      
      const orderDate = new Date(date);
      orderDate.setHours(hour);
      orderDate.setMinutes(Math.floor(Math.random() * 60));

      // Choose order items
      const itemsToBuy = [];
      const itemTypes = [espresso, americano, latte, vanillaLatte, croissant];
      const itemsCount = 1 + Math.floor(Math.random() * 3);

      let orderTotal = 0;
      let orderCost = 0;

      for (let k = 0; k < itemsCount; k++) {
        const prod = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        const qty = 1;
        let modifierPrice = 0;
        let modifierCost = 0;
        const selectedModOptions = [];

        // Apply Oat Milk modifier randomly to lattes (50% chance)
        if ((prod.id === latte.id || prod.id === vanillaLatte.id) && Math.random() > 0.5) {
          modifierPrice = 0.80;
          modifierCost = 0.30;
          selectedModOptions.push({ optionName: 'Oat Milk', priceAdjustment: 0.80 });
        }

        const unitPrice = prod.price + modifierPrice;
        const unitCost = prod.cost + modifierCost;
        const totalPrice = unitPrice * qty;

        itemsToBuy.push({
          productId: prod.id,
          quantity: qty,
          unitPrice,
          totalPrice,
          modifiers: selectedModOptions,
          cost: unitCost * qty
        });

        orderTotal += totalPrice;
        orderCost += unitCost * qty;
      }

      const tax = orderTotal * tenant1.taxRate;
      const finalAmount = orderTotal + tax;
      const pointsEarned = Math.floor(orderTotal * 10); // 10 points per dollar

      const orderNumStr = `#${String(totalOrderCounter++).padStart(4, '0')}`;

      // Insert Order
      const newOrder = await prisma.order.create({
        data: {
          tenantId: tenant1.id,
          userId: staff1.id,
          customerId,
          orderNumber: orderNumStr,
          source: Math.random() > 0.95 ? 'ONLINE' : 'POS',
          status: 'COMPLETED',
          totalAmount: orderTotal,
          discountAmount: 0,
          taxAmount: tax,
          finalAmount: finalAmount,
          paymentMethod: Math.random() > 0.4 ? 'CARD' : 'CASH',
          paymentStatus: 'PAID',
          loyaltyPointsEarned: pointsEarned,
          createdAt: orderDate,
          updatedAt: orderDate
        }
      });

      // Insert Items
      for (const item of itemsToBuy) {
        const orderItem = await prisma.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice
          }
        });

        // Insert Order Item Modifiers
        for (const mod of item.modifiers) {
          await prisma.orderItemModifier.create({
            data: {
              orderItemId: orderItem.id,
              optionName: mod.optionName,
              priceAdjustment: mod.priceAdjustment
            }
          });
        }
      }

      // Add payments transaction
      await prisma.transaction.create({
        data: {
          orderId: newOrder.id,
          paymentMethod: newOrder.paymentMethod,
          amount: newOrder.finalAmount,
          referenceId: newOrder.paymentMethod === 'CARD' ? 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase() : null,
          createdAt: orderDate
        }
      });

      // Update loyalty points if customer exists
      if (customerObj) {
        await prisma.customer.update({
          where: { id: customerObj.id },
          data: { loyaltyPoints: { increment: pointsEarned } }
        });
      }
    }
  }

  // ---------------------------------------------------------
  // 10. NOTIFICATIONS, SHIFTS, PO & AI INSIGHTS
  // ---------------------------------------------------------
  // Staff shifts
  await prisma.shift.createMany({
    data: [
      {
        tenantId: tenant1.id,
        userId: staff1.id,
        startTime: new Date(new Date().setHours(8, 0, 0)),
        endTime: new Date(new Date().setHours(16, 0, 0)),
        status: 'COMPLETED',
        salesGenerated: 345.50,
        ordersHandled: 42
      },
      {
        tenantId: tenant1.id,
        userId: manager1.id,
        startTime: new Date(new Date().setHours(12, 0, 0)),
        status: 'ACTIVE',
        salesGenerated: 120.00,
        ordersHandled: 15
      }
    ]
  });

  // Supplier Purchase Orders
  const purchaseOrder = await prisma.purchaseOrder.create({
    data: {
      tenantId: tenant1.id,
      supplierId: beanSupplier.id,
      status: 'RECEIVED',
      totalCost: 200.00,
      receivedAt: new Date(),
      items: {
        create: [
          { name: 'Espresso Blend Beans 10kg', quantity: 10000, unitCost: 0.02 }
        ]
      }
    }
  });

  // Low stock notifications
  await prisma.notification.createMany({
    data: [
      {
        tenantId: tenant1.id,
        type: 'LOW_STOCK',
        message: 'Ingredient "Paper Coffee Cups 12oz" has reached critical levels (75 left).',
        read: false
      },
      {
        tenantId: tenant1.id,
        type: 'SYSTEM',
        message: 'Monthly sales metrics are ready for export.',
        read: true
      }
    ]
  });

  // AI Insights
  await prisma.aIInsight.createMany({
    data: [
      {
        tenantId: tenant1.id,
        type: 'SALES',
        content: {
          title: 'Optimize Afternoon Lattes',
          details: 'Caffe Latte sales peak around 2:30 PM on weekdays. You can increase revenue by offering a "Latte & Croissant" combo discount between 2:00 PM and 4:00 PM.',
          recommendedAction: 'Create 15% Afternoon Combo Promo',
          priority: 'HIGH'
        }
      },
      {
        tenantId: tenant1.id,
        type: 'INVENTORY',
        content: {
          title: 'Stock Out Warning: Cups',
          details: 'Based on your recent 7-day average sales velocity, "Paper Coffee Cups 12oz" is projected to run out in 3.5 days. Place a reorder now to avoid disruptions.',
          recommendedAction: 'Reorder 500 Cups from Supplier',
          priority: 'CRITICAL'
        }
      },
      {
        tenantId: tenant1.id,
        type: 'BUSINESS',
        content: {
          title: 'Almond & Oat Milk Cost Adjustments',
          details: 'Whole milk consumption represents 80% of recipes, but Oat Milk upgrades are generating 45% of modifier profit margins. Maintain a $0.80 Oat Milk premium pricing.',
          recommendedAction: 'Keep Modifier Pricing Premium',
          priority: 'MEDIUM'
        }
      }
    ]
  });

  // ---------------------------------------------------------
  // TENANT 2: Mocha & Co. (Secondary Tenant for Multi-Tenant Isolation)
  // ---------------------------------------------------------
  const tenant2 = await prisma.tenant.create({
    data: {
      name: 'Mocha & Co. Coffee Shop',
      slug: 'mocha-co',
      address: '404 Hipster Lane, Portland, OR',
      phone: '555-888-9999',
      taxRate: 0.09,
      currency: 'USD'
    }
  });

  // User for Tenant 2
  await prisma.user.create({
    data: {
      tenantId: tenant2.id,
      email: 'owner@mocha.com',
      passwordHash,
      name: 'Sam Brooks',
      role: 'OWNER'
    }
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
