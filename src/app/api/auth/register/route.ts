import { NextResponse } from 'next/server';
import { prisma, runWithDatabaseFallback } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { shopName, shopSlug, ownerName, ownerEmail, ownerPassword } = body;

    if (!shopName || !shopSlug || !ownerName || !ownerEmail || !ownerPassword) {
      return NextResponse.json(
        { error: "Missing required registration parameters." },
        { status: 400 }
      ) as any;
    }

    const sanitizedSlug = shopSlug.toLowerCase().replace(/[^a-z0-9-]/g, '');

    const result = await runWithDatabaseFallback(
      async () => {
        // 1. Check if slug already exists
        const existingTenant = await prisma.tenant.findUnique({
          where: { slug: sanitizedSlug }
        });
        if (existingTenant) {
          throw new Error("A coffee shop with this URL slug already exists.");
        }

        // 2. Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: ownerEmail }
        });
        if (existingUser) {
          throw new Error("This email is already registered.");
        }

        // 3. Create Tenant and Owner
        const passwordHash = await hashPassword(ownerPassword);
        
        const transactionResult = await prisma.$transaction(async (tx: any) => {
          const tenant = await tx.tenant.create({
            data: {
              name: shopName,
              slug: sanitizedSlug,
              taxRate: 0.08,
              currency: 'USD',
              paymentConfig: {
                digitalEnabled: false
              }
            }
          });

          const user = await tx.user.create({
            data: {
              tenantId: tenant.id,
              email: ownerEmail,
              passwordHash,
              name: ownerName,
              role: 'OWNER'
            }
          });

          // Provision starter ingredients
          const beans = await tx.ingredient.create({
            data: {
              tenantId: tenant.id,
              name: 'House Blend Coffee Beans',
              sku: 'ING-STARTER-BEANS',
              unit: 'g',
              currentStock: 5000, // 5kg
              minStockLevel: 1000,
              costPerUnit: 0.02
            }
          });

          const milk = await tx.ingredient.create({
            data: {
              tenantId: tenant.id,
              name: 'Whole Milk',
              sku: 'ING-STARTER-MILK',
              unit: 'ml',
              currentStock: 10000, // 10L
              minStockLevel: 2000,
              costPerUnit: 0.002
            }
          });

          const cups = await tx.ingredient.create({
            data: {
              tenantId: tenant.id,
              name: 'Paper Coffee Cups 12oz',
              sku: 'ING-STARTER-CUPS',
              unit: 'pcs',
              currentStock: 100,
              minStockLevel: 20,
              costPerUnit: 0.15
            }
          });

          // Provision starter menu
          const espresso = await tx.product.create({
            data: {
              tenantId: tenant.id,
              name: 'Espresso Double Shot',
              description: 'Pure rich coffee bean extraction.',
              price: 3.00,
              cost: 0.36,
              category: 'Coffee'
            }
          });

          const latte = await tx.product.create({
            data: {
              tenantId: tenant.id,
              name: 'House Caffe Latte',
              description: 'Double espresso with silky whole milk microfoam.',
              price: 4.50,
              cost: 0.91,
              category: 'Coffee'
            }
          });

          // Connect recipes
          await tx.productIngredient.createMany({
            data: [
              { productId: espresso.id, ingredientId: beans.id, quantity: 18 },
              { productId: latte.id, ingredientId: beans.id, quantity: 18 },
              { productId: latte.id, ingredientId: milk.id, quantity: 200 },
              { productId: latte.id, ingredientId: cups.id, quantity: 1 }
            ]
          });

          return { tenant, user };
        });

        return {
          success: true,
          message: "Registration completed successfully!",
          tenant: transactionResult.tenant,
          user: {
            id: transactionResult.user.id,
            email: transactionResult.user.email,
            name: transactionResult.user.name,
            role: transactionResult.user.role
          }
        };
      },
      () => {
        // Mock fallback registration response for offline/fallback mode
        return {
          success: true,
          message: "Registration completed successfully (Demo Mode / Local Memory active)!",
          tenant: {
            id: 'mock-tenant-id-' + Math.random().toString(36).substr(2, 5),
            name: shopName,
            slug: sanitizedSlug,
            taxRate: 0.08,
            currency: 'USD'
          },
          user: {
            id: 'mock-user-id-' + Math.random().toString(36).substr(2, 5),
            email: ownerEmail,
            name: ownerName,
            role: 'OWNER'
          }
        };
      }
    );

    return NextResponse.json(result) as any;
  } catch (error: any) {
    console.error("Error registering shop:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during registration." },
      { status: 500 }
    ) as any;
  }
}
