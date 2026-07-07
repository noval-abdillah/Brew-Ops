import { NextResponse } from 'next/server';
import { prisma, runWithDatabaseFallback } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/api-auth';
import { mockProducts, mockModifiers } from '@/lib/mock-data';

export async function GET(request: Request) {
  try {
    const { error, session } = await authenticateRequest(request);
    if (error) return error;

    const tenantId = session!.tenantId;

    const catalog = await runWithDatabaseFallback(
      async () => {
        // Fetch products with their custom modifiers and option items
        const products = await prisma.product.findMany({
          where: { tenantId, active: true },
          include: {
            modifiers: {
              include: { options: true }
            }
          }
        });
        return products;
      },
      async () => {
        // Fallback mock menu
        return mockProducts.map(p => {
          const productModifiers = mockModifiers.filter(m => m.productId === p.id);
          return {
            ...p,
            modifiers: productModifiers
          };
        });
      }
    );

    return NextResponse.json(catalog);
  } catch (error) {
    console.error("POS products load error:", error);
    return NextResponse.json({ error: "Failed to load POS menu catalog." }, { status: 500 }) as any;
  }
}
