import { NextResponse } from 'next/server';
import { prisma, runWithDatabaseFallback } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/api-auth';
import { generateMockOrders } from '@/lib/mock-data';
import { createNotification } from '@/lib/notifications';
import { localOrdersCache, ensureMockOrders } from '@/lib/order-store';

export async function GET(request: Request) {
  try {
    const { error, session } = await authenticateRequest(request);
    if (error) return error;

    const tenantId = session!.tenantId;

    const orders = await runWithDatabaseFallback(
      async () => {
        return await prisma.order.findMany({
          where: { tenantId },
          include: {
            orderItems: {
              include: {
                product: true,
                options: true
              }
            },
            customer: true
          },
          orderBy: { createdAt: 'desc' },
          take: 30
        });
      },
      async () => {
        ensureMockOrders();
        return localOrdersCache.filter((o) => o.tenantId === tenantId);
      }
    );

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders." }, { status: 500 }) as any;
  }
}

export async function POST(request: Request) {
  try {
    const { error, session } = await authenticateRequest(request);
    if (error) return error;

    const tenantId = session!.tenantId;
    const userId = session!.userId;

    const body = await request.json();
    const {
      customerId,
      cartItems,
      discountAmount = 0,
      paymentMethod,
      payments, // array of { method, amount, referenceId } for splits
      tableNumber,
      source = 'POS'
    } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Empty shopping cart." }, { status: 400 }) as any;
    }

    // Process check calculations
    let totalAmount = 0;
    cartItems.forEach((item: any) => {
      totalAmount += item.totalPrice;
    });

    const isOnline = source === 'ONLINE';
    const paymentStatus = isOnline ? 'PENDING' : 'PAID';

    const result = await runWithDatabaseFallback(
      async () => {
        // --- REAL TRANSACTION IN POSTGRESQL ---
        return await prisma.$transaction(async (tx: any) => {
          // 1. Fetch Tenant's real taxRate
          const tenant = await tx.tenant.findUnique({
            where: { id: tenantId }
          });
          const taxRate = tenant?.taxRate ?? 0.10;
          const taxAmount = (totalAmount - discountAmount) * taxRate;
          const finalAmount = totalAmount - discountAmount + taxAmount;
          const pointsEarned = Math.floor(totalAmount * 10);

          // 2. Generate Order Serial number
          const today = new Date();
          today.setHours(0,0,0,0);
          const todaysCount = await tx.order.count({
            where: { tenantId, createdAt: { gte: today } }
          });
          const serialStr = `#${String(todaysCount + 1).padStart(4, '0')}`;

          // 3. Create Order
          const order = await tx.order.create({
            data: {
              tenantId,
              userId,
              customerId: customerId || null,
              orderNumber: serialStr,
              source,
              status: source === 'ONLINE' ? 'PENDING' : 'COMPLETED',
              totalAmount,
              discountAmount,
              taxAmount,
              finalAmount,
              paymentMethod: paymentMethod === 'SPLIT' ? 'SPLIT' : paymentMethod,
              paymentStatus,
              tableNumber,
              loyaltyPointsEarned: pointsEarned
            }
          });

          // 3. Create items, options, and trigger recipe deductions
          for (const item of cartItems) {
            const orderItem = await tx.orderItem.create({
              data: {
                orderId: order.id,
                productId: item.id,
                quantity: item.quantity,
                unitPrice: item.price,
                totalPrice: item.totalPrice,
                notes: item.notes
              }
            });

            // Create Order Item Modifiers
            if (item.selectedModifiers) {
              for (const mod of item.selectedModifiers) {
                await tx.orderItemModifier.create({
                  data: {
                    orderItemId: orderItem.id,
                    optionName: mod.name,
                    priceAdjustment: mod.price
                  }
                });
              }
            }

            // --- INVENTORY AUTO-DEDUCTION ENGINE ---
            // Fetch product ingredients recipe
            const recipe = await tx.productIngredient.findMany({
              where: { productId: item.id }
            });

            // Deduct standard recipe ingredients
            for (const rec of recipe) {
              // Check if there is an alternative milk option selected which overrides Whole Milk (mock-ing-2)
              const hasOatMilkModifier = item.selectedModifiers?.some((m: any) => m.name === 'Oat Milk');
              if (rec.ingredientId === 'ING-MILK-WHOLE' && hasOatMilkModifier) {
                // Steer clear of whole milk deduction since oat milk overrides it
                continue;
              }

              await tx.ingredient.update({
                where: { id: rec.ingredientId },
                data: { currentStock: { decrement: rec.quantity * item.quantity } }
              });

              // Log standard recipe deductions
              await tx.inventoryLog.create({
                data: {
                  tenantId,
                  ingredientId: rec.ingredientId,
                  userId,
                  type: 'DEDUCTION_ORDER',
                  quantity: -(rec.quantity * item.quantity),
                  reason: `Automated deduction for Order ${serialStr}`
                }
              });
            }

            // Deduct custom modifiers ingredients (like Oat milk)
            if (item.selectedModifiers) {
              for (const mod of item.selectedModifiers) {
                // Find if this modifier option is configured with an ingredient deduction
                const modOption = await tx.modifierOption.findFirst({
                  where: {
                    name: mod.name,
                    modifier: { productId: item.id }
                  }
                });

                if (modOption && modOption.deductIngredientId && modOption.deductQuantity) {
                  await tx.ingredient.update({
                    where: { id: modOption.deductIngredientId },
                    data: { currentStock: { decrement: modOption.deductQuantity * item.quantity } }
                  });

                  await tx.inventoryLog.create({
                    data: {
                      tenantId,
                      ingredientId: modOption.deductIngredientId,
                      userId,
                      type: 'DEDUCTION_ORDER',
                      quantity: -(modOption.deductQuantity * item.quantity),
                      reason: `Modifier "${mod.name}" deduction for Order ${serialStr}`
                    }
                  });
                }
              }
            }
          }

          // 4. Create Payments Transactions (Split Support)
          if (paymentMethod === 'SPLIT' && payments) {
            for (const pay of payments) {
              await tx.transaction.create({
                data: {
                  orderId: order.id,
                  paymentMethod: pay.method,
                  amount: pay.amount,
                  referenceId: pay.referenceId || null
                }
              });
            }
          } else {
            await tx.transaction.create({
              data: {
                orderId: order.id,
                paymentMethod,
                amount: finalAmount
              }
            });
          }

          // 5. Customer Loyalty Point accrual
          if (customerId) {
            await tx.customer.update({
              where: { id: customerId },
              data: { loyaltyPoints: { increment: pointsEarned } }
            });
          }

          return order;
        });
      },
      async () => {
        // --- IN-MEMORY FALLBACK ---
        const taxRate = 0.08; // 8% default for fallback
        const taxAmount = (totalAmount - discountAmount) * taxRate;
        const finalAmount = totalAmount - discountAmount + taxAmount;
        const pointsEarned = Math.floor(totalAmount * 10);

        const newMockOrder = {
          id: `mock-order-${Date.now()}`,
          tenantId,
          userId,
          customerId: customerId || null,
          orderNumber: `#${String(localOrdersCache.length + 1).padStart(4, '0')}`,
          source,
          status: source === 'ONLINE' ? 'PENDING' : 'COMPLETED',
          totalAmount: Math.round(totalAmount * 100) / 100,
          discountAmount: Math.round(discountAmount * 100) / 100,
          taxAmount: Math.round(taxAmount * 100) / 100,
          finalAmount: Math.round(finalAmount * 100) / 100,
          paymentMethod,
          paymentStatus,
          tableNumber,
          loyaltyPointsEarned: pointsEarned,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          orderItems: cartItems.map((item: any, idx: number) => ({
            id: `mock-item-${Date.now()}-${idx}`,
            productId: item.id,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.totalPrice,
            product: { name: item.name, category: item.category },
            options: item.selectedModifiers?.map((m: any) => ({ optionName: m.name, priceAdjustment: m.price })) || []
          }))
        };

        localOrdersCache.unshift(newMockOrder);
        return newMockOrder;
      }
    );

    if (isOnline) {
      await createNotification(
        tenantId,
        'ORDER',
        `New online order ${result.orderNumber} — ${tableNumber || 'pickup'} — payment ${(result.paymentStatus || paymentStatus).toLowerCase()}`
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order placed successfully!",
      order: result
    });
  } catch (error: any) {
    console.error("Order checkout error:", error);
    return NextResponse.json({ error: error.message || "Checkout transaction failed." }, { status: 500 }) as any;
  }
}
