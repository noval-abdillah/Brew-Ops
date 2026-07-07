import { NextResponse } from 'next/server';
import { prisma, runWithDatabaseFallback } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/api-auth';
import { mockIngredients } from '@/lib/mock-data';

let localIngredientsCache: any[] = [];

export async function GET(request: Request) {
  try {
    const { error, session } = await authenticateRequest(request);
    if (error) return error;

    const tenantId = session!.tenantId;

    const list = await runWithDatabaseFallback(
      async () => {
        return await prisma.ingredient.findMany({
          where: { tenantId },
          include: { supplier: true },
          orderBy: { name: 'asc' }
        });
      },
      async () => {
        if (localIngredientsCache.length === 0) {
          localIngredientsCache = [...mockIngredients];
        }
        return localIngredientsCache;
      }
    );

    return NextResponse.json(list);
  } catch (error) {
    console.error("Load inventory error:", error);
    return NextResponse.json({ error: "Failed to load inventory." }, { status: 500 }) as any;
  }
}

export async function POST(request: Request) {
  try {
    const { error, session } = await authenticateRequest(request);
    if (error) return error;

    const tenantId = session!.tenantId;
    const userId = session!.userId;

    const body = await request.json();
    const { ingredientId, adjustmentAmount, reason = "Manual adjustment" } = body;

    if (!ingredientId || adjustmentAmount === undefined) {
      return NextResponse.json({ error: "Missing adjustment properties." }, { status: 400 }) as any;
    }

    const result = await runWithDatabaseFallback(
      async () => {
        return await prisma.$transaction(async (tx: any) => {
          const updatedIng = await tx.ingredient.update({
            where: { id: ingredientId },
            data: { currentStock: { increment: parseFloat(adjustmentAmount) } }
          });

          await tx.inventoryLog.create({
            data: {
              tenantId,
              ingredientId,
              userId,
              type: 'ADJUSTMENT',
              quantity: parseFloat(adjustmentAmount),
              reason
            }
          });

          return updatedIng;
        });
      },
      async () => {
        if (localIngredientsCache.length === 0) {
          localIngredientsCache = [...mockIngredients];
        }
        
        const idx = localIngredientsCache.findIndex(ing => ing.id === ingredientId);
        if (idx !== -1) {
          localIngredientsCache[idx].currentStock = Math.max(0, localIngredientsCache[idx].currentStock + parseFloat(adjustmentAmount));
          return localIngredientsCache[idx];
        }
        throw new Error("Ingredient not found in memory store.");
      }
    );

    return NextResponse.json({
      success: true,
      message: "Stock adjusted successfully!",
      ingredient: result
    });
  } catch (error: any) {
    console.error("Adjust stock error:", error);
    return NextResponse.json({ error: error.message || "Failed to adjust stock." }, { status: 500 }) as any;
  }
}
