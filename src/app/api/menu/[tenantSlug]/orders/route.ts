import { NextResponse } from 'next/server';
import { prisma, runWithDatabaseFallback } from '@/lib/prisma';
import { resolveTenantBySlug } from '@/lib/tenant';
import { createNotification } from '@/lib/notifications';
import { localOrdersCache, ensureMockOrders } from '@/lib/order-store';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ tenantSlug: string }> }
) {
  try {
    const { tenantSlug } = await params;
    const tenant = await resolveTenantBySlug(tenantSlug);

    if (!tenant) {
      return NextResponse.json({ error: 'Cafe not found.' }, { status: 404 });
    }

    const body = await request.json();
    const {
      cartItems,
      paymentMethod = 'CASH',
      tableNumber,
      discountAmount = 0,
    } = body;

    if (!cartItems?.length) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }

    let totalAmount = 0;
    cartItems.forEach((item: { totalPrice: number }) => {
      totalAmount += item.totalPrice;
    });

    const taxRate = tenant.taxRate ?? 0.08;
    const taxAmount = (totalAmount - discountAmount) * taxRate;
    const finalAmount = totalAmount - discountAmount + taxAmount;

    const paymentStatus =
      paymentMethod === 'DIGITAL' || paymentMethod === 'CARD' ? 'PENDING' : 'PENDING';

    const result = await runWithDatabaseFallback(
      async () => {
        return prisma.$transaction(async (tx: any) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todaysCount = await tx.order.count({
            where: { tenantId: tenant.id, createdAt: { gte: today } },
          });
          const serialStr = `#${String(todaysCount + 1).padStart(4, '0')}`;

          const order = await tx.order.create({
            data: {
              tenantId: tenant.id,
              userId: tenant.defaultUserId,
              orderNumber: serialStr,
              source: 'ONLINE',
              status: 'PENDING',
              totalAmount,
              discountAmount,
              taxAmount,
              finalAmount,
              paymentMethod,
              paymentStatus,
              tableNumber: tableNumber || null,
              loyaltyPointsEarned: 0,
            },
          });

          for (const item of cartItems) {
            await tx.orderItem.create({
              data: {
                orderId: order.id,
                productId: item.id,
                quantity: item.quantity,
                unitPrice: item.price,
                totalPrice: item.totalPrice,
              },
            });
          }

          await tx.transaction.create({
            data: {
              orderId: order.id,
              paymentMethod,
              amount: finalAmount,
            },
          });

          return order;
        });
      },
      async () => {
        ensureMockOrders();
        const order = {
          id: `mock-order-${Date.now()}`,
          tenantId: tenant.id,
          userId: tenant.defaultUserId,
          orderNumber: `#${String(localOrdersCache.length + 1).padStart(4, '0')}`,
          source: 'ONLINE',
          status: 'PENDING',
          totalAmount: Math.round(totalAmount * 100) / 100,
          discountAmount,
          taxAmount: Math.round(taxAmount * 100) / 100,
          finalAmount: Math.round(finalAmount * 100) / 100,
          paymentMethod,
          paymentStatus,
          tableNumber: tableNumber || null,
          createdAt: new Date().toISOString(),
          orderItems: cartItems.map((item: any, idx: number) => ({
            id: `mock-item-${Date.now()}-${idx}`,
            productId: item.id,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.totalPrice,
            product: { name: item.name },
          })),
        };
        localOrdersCache.unshift(order);
        return order;
      }
    );

    const payLabel =
      paymentMethod === 'DIGITAL'
        ? 'QR/Digital'
        : paymentMethod === 'CARD'
          ? 'Card'
          : 'Cash at counter';

    await createNotification(
      tenant.id,
      'ORDER',
      `New online order ${result.orderNumber} from ${tableNumber || 'customer'} — ${payLabel} — $${finalAmount.toFixed(2)} (payment ${paymentStatus.toLowerCase()})`
    );

    return NextResponse.json({
      success: true,
      order: result,
      payment: {
        method: paymentMethod,
        status: paymentStatus,
        amount: finalAmount,
        qrUrl:
          paymentMethod === 'DIGITAL'
            ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=brewops-pay-${result.id}-${finalAmount.toFixed(2)}`
            : null,
      },
    });
  } catch (error: unknown) {
    console.error('Online order error:', error);
    const message = error instanceof Error ? error.message : 'Order failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ tenantSlug: string }> }
) {
  try {
    const { tenantSlug } = await params;
    const tenant = await resolveTenantBySlug(tenantSlug);
    if (!tenant) {
      return NextResponse.json({ error: 'Cafe not found.' }, { status: 404 });
    }

    const body = await request.json();
    const { orderId, action } = body;

    if (!orderId || action !== 'CONFIRM_PAYMENT') {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    const updated = await runWithDatabaseFallback(
      async () => {
        const order = await prisma.order.findFirst({
          where: { id: orderId, tenantId: tenant.id, source: 'ONLINE' },
        });
        if (!order) throw new Error('Order not found.');

        return prisma.order.update({
          where: { id: orderId },
          data: { paymentStatus: 'PAID', status: 'PREPARING' },
        });
      },
      async () => {
        ensureMockOrders();
        const idx = localOrdersCache.findIndex((o) => o.id === orderId);
        if (idx === -1) throw new Error('Order not found.');
        localOrdersCache[idx] = {
          ...localOrdersCache[idx],
          paymentStatus: 'PAID',
          status: 'PREPARING',
        };
        return localOrdersCache[idx];
      }
    );

    await createNotification(
      tenant.id,
      'PAYMENT',
      `Payment confirmed for order ${updated.orderNumber} — $${updated.finalAmount?.toFixed(2) ?? ''}`
    );

    return NextResponse.json({ success: true, order: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Update failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
