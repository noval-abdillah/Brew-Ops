import { NextResponse } from 'next/server';
import { prisma, runWithDatabaseFallback } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/api-auth';
import {
  generateMockOrders,
  mockIngredients,
  mockProducts,
  mockCustomers
} from '@/lib/mock-data';
import {
  generateSalesForecast,
  generateInventoryRunout,
  generateAIInsights
} from '@/lib/ai-engine';

export async function GET(request: Request) {
  try {
    // 1. Authenticate user and extract tenant context
    const { error, session } = await authenticateRequest(request);
    if (error) return error;

    const tenantId = session!.tenantId;

    const stats = await runWithDatabaseFallback(
      async () => {
        // --- REAL DATABASE PATH ---
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);

        const lastMonth = new Date();
        lastMonth.setDate(lastMonth.getDate() - 30);

        // Fetch all orders for this tenant from the last 30 days
        const orders = await prisma.order.findMany({
          where: {
            tenantId,
            createdAt: { gte: lastMonth },
            status: 'COMPLETED'
          },
          include: {
            orderItems: {
              include: { product: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        });

        // Fetch ingredients to check stock levels
        const ingredients = await prisma.ingredient.findMany({
          where: { tenantId }
        });

        // Fetch total products and customers
        const productsCount = await prisma.product.count({ where: { tenantId, active: true } });
        const customersCount = await prisma.customer.count({ where: { tenantId } });

        return computeStats(orders, ingredients, productsCount, customersCount);
      },
      async () => {
        // --- FALLBACK IN-MEMORY PATH ---
        const orders = generateMockOrders();
        const ingredients = mockIngredients;
        const productsCount = mockProducts.length;
        const customersCount = mockCustomers.length;
        return computeStats(orders, ingredients, productsCount, customersCount);
      }
    );

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error("Dashboard stats API error:", error);
    return NextResponse.json({ error: "Failed to load dashboard metrics." }, { status: 500 }) as any;
  }
}

/**
 * Common metrics compiler using loaded orders & ingredients
 */
function computeStats(orders: any[], ingredients: any[], productsCount: number, customersCount: number) {
  const now = new Date();
  
  // 1. Calculate revenue for periods
  let revenueToday = 0;
  let revenueWeek = 0;
  let revenueMonth = 0;
  let ordersToday = 0;
  
  const startOfToday = new Date();
  startOfToday.setHours(0,0,0,0);
  const startOfWeek = new Date();
  startOfWeek.setDate(now.getDate() - 7);
  startOfWeek.setHours(0,0,0,0);

  orders.forEach(o => {
    const oDate = new Date(o.createdAt);
    if (oDate >= startOfToday) {
      revenueToday += o.finalAmount;
      ordersToday += 1;
    }
    if (oDate >= startOfWeek) {
      revenueWeek += o.finalAmount;
    }
    revenueMonth += o.finalAmount;
  });

  // 2. Count low stock items
  const lowStockItems = ingredients.filter(ing => ing.currentStock <= ing.minStockLevel);
  const lowStockCount = lowStockItems.length;

  // 3. Peak hours calculation (group by hour)
  const hourlySales: { [key: number]: number } = {};
  for (let h = 7; h <= 21; h++) hourlySales[h] = 0; // standard hours 7am - 9pm

  orders.forEach(o => {
    const hr = new Date(o.createdAt).getHours();
    if (hourlySales[hr] !== undefined) {
      hourlySales[hr] += 1;
    }
  });

  const peakHoursData = Object.keys(hourlySales).map(hr => ({
    hour: `${hr}:00`,
    orders: hourlySales[parseInt(hr)]
  }));

  // 4. Category breakdown
  const categorySales: { [key: string]: number } = {};
  orders.forEach(o => {
    o.orderItems?.forEach((item: any) => {
      const cat = item.product?.category || 'Other';
      categorySales[cat] = (categorySales[cat] || 0) + item.totalPrice;
    });
  });

  const categoryData = Object.keys(categorySales).map(cat => ({
    name: cat,
    value: Math.round(categorySales[cat] * 100) / 100
  }));

  // 5. Best selling products
  const productQuantities: { [key: string]: { name: string; qty: number; revenue: number } } = {};
  orders.forEach(o => {
    o.orderItems?.forEach((item: any) => {
      const pId = item.productId;
      if (!productQuantities[pId]) {
        productQuantities[pId] = { name: item.product?.name || 'Unknown', qty: 0, revenue: 0 };
      }
      productQuantities[pId].qty += item.quantity;
      productQuantities[pId].revenue += item.totalPrice;
    });
  });

  const bestSellers = Object.keys(productQuantities)
    .map(pId => ({
      id: pId,
      name: productQuantities[pId].name,
      quantity: productQuantities[pId].qty,
      revenue: Math.round(productQuantities[pId].revenue * 100) / 100
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // 6. Last 7 days revenue timeline for line chart
  const dailyTimeline: { [key: string]: number } = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dayStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    dailyTimeline[dayStr] = 0;
  }

  orders.forEach(o => {
    const oDate = new Date(o.createdAt);
    const dayStr = oDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    if (dailyTimeline[dayStr] !== undefined) {
      dailyTimeline[dayStr] += o.finalAmount;
    }
  });

  const salesTimelineData = Object.keys(dailyTimeline).map(day => ({
    day,
    revenue: Math.round(dailyTimeline[day] * 100) / 100
  }));

  // 7. Generate local AI Insights & Forecasts
  const salesForecast = generateSalesForecast(orders);
  const runoutForecast = generateInventoryRunout(ingredients, orders, []);
  const aiInsights = generateAIInsights(ingredients, orders, lowStockItems);

  return {
    kpis: {
      revenueToday: Math.round(revenueToday * 100) / 100,
      revenueWeek: Math.round(revenueWeek * 100) / 100,
      revenueMonth: Math.round(revenueMonth * 100) / 100,
      ordersToday,
      lowStockCount,
      customersCount,
      activeMenuCount: productsCount
    },
    charts: {
      salesTimeline: salesTimelineData,
      peakHours: peakHoursData,
      categoryDistribution: categoryData,
      bestSellers
    },
    aiForecast: {
      salesForecast,
      runoutForecast,
      aiInsights
    }
  };
}
