import { NextResponse } from 'next/server';
import { prisma, runWithDatabaseFallback } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/api-auth';
import { createNotification } from '@/lib/notifications';
import { localOrdersCache, ensureMockOrders } from '@/lib/order-store';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { error, session } = await authenticateRequest(request);
    if (error) return error;

    const { orderId } = await params;
    const body = await request.json();
    const { action } = body as { action: string };

    const tenantId = session!.tenantId;

    const updated = await runWithDatabaseFallback(
      async () => {
        const order = await prisma.order.findFirst({
          where: { id: orderId, tenantId },
        });
        if (!order) throw new Error('Order not found.');

        if (action === 'CONFIRM_PAYMENT') {
          return prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: 'PAID', status: 'PREPARING' },
          });
        }
        if (action === 'START_PREPARING') {
          return prisma.order.update({
            where: { id: orderId },
            data: { status: 'PREPARING' },
          });
        }
        if (action === 'COMPLETE') {
          return prisma.order.update({
            where: { id: orderId },
            data: { status: 'COMPLETED', paymentStatus: 'PAID' },
          });
        }
        if (action === 'CANCEL') {
          return prisma.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' },
          });
        }
        throw new Error('Unknown action.');
      },
      async () => {
        ensureMockOrders();
        const idx = localOrdersCache.findIndex(
          (o) => o.id === orderId && o.tenantId === tenantId
        );
        if (idx === -1) throw new Error('Order not found.');

        const order = localOrdersCache[idx];
        if (action === 'CONFIRM_PAYMENT') {
          localOrdersCache[idx] = { ...order, paymentStatus: 'PAID', status: 'PREPARING' };
        } else if (action === 'START_PREPARING') {
          localOrdersCache[idx] = { ...order, status: 'PREPARING' };
        } else if (action === 'COMPLETE') {
          localOrdersCache[idx] = { ...order, status: 'COMPLETED', paymentStatus: 'PAID' };
        } else if (action === 'CANCEL') {
          localOrdersCache[idx] = { ...order, status: 'CANCELLED' };
        } else {
          throw new Error('Unknown action.');
        }
        return localOrdersCache[idx];
      }
    );

    if (action === 'CONFIRM_PAYMENT') {
      await createNotification(
        tenantId,
        'PAYMENT',
        `Payment confirmed for order ${updated.orderNumber} by staff.`
      );
    } else if (action === 'COMPLETE') {
      await createNotification(
        tenantId,
        'ORDER',
        `Order ${updated.orderNumber} completed and ready for pickup.`
      );
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Update failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
