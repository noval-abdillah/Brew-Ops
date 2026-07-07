import { NextResponse } from 'next/server';
import { prisma, runWithDatabaseFallback } from '@/lib/prisma';
import { resolveTenantBySlug } from '@/lib/tenant';
import { mockProducts, mockModifiers } from '@/lib/mock-data';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tenantSlug: string }> }
) {
  try {
    const { tenantSlug } = await params;
    const tenant = await resolveTenantBySlug(tenantSlug);

    if (!tenant) {
      return NextResponse.json({ error: 'Cafe not found.' }, { status: 404 });
    }

    const catalog = await runWithDatabaseFallback(
      async () => {
        return prisma.product.findMany({
          where: { tenantId: tenant.id, active: true },
          include: {
            modifiers: { include: { options: true } },
          },
        });
      },
      async () =>
        mockProducts
          .filter((p) => p.tenantId === tenant.id)
          .map((p) => ({
            ...p,
            modifiers: mockModifiers.filter((m) => m.productId === p.id),
          }))
    );

    return NextResponse.json({
      tenant: { name: tenant.name, slug: tenant.slug, taxRate: tenant.taxRate, currency: tenant.currency },
      products: catalog,
    });
  } catch (error) {
    console.error('Public menu products error:', error);
    return NextResponse.json({ error: 'Failed to load menu.' }, { status: 500 });
  }
}
