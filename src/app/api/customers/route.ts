import { NextResponse } from 'next/server';
import { prisma, runWithDatabaseFallback } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/api-auth';
import { mockCustomers } from '@/lib/mock-data';

let localCustomersCache: any[] = [];

export async function GET(request: Request) {
  try {
    const { error, session } = await authenticateRequest(request);
    if (error) return error;

    const tenantId = session!.tenantId;

    const list = await runWithDatabaseFallback(
      async () => {
        return await prisma.customer.findMany({
          where: { tenantId },
          orderBy: { name: 'asc' }
        });
      },
      async () => {
        if (localCustomersCache.length === 0) {
          localCustomersCache = [...mockCustomers];
        }
        return localCustomersCache;
      }
    );

    return NextResponse.json(list);
  } catch (error) {
    console.error("Fetch CRM customers error:", error);
    return NextResponse.json({ error: "Failed to fetch customer directory." }, { status: 500 }) as any;
  }
}

export async function POST(request: Request) {
  try {
    const { error, session } = await authenticateRequest(request);
    if (error) return error;

    const tenantId = session!.tenantId;

    const body = await request.json();
    const { name, email, phone } = body;

    if (!name) {
      return NextResponse.json({ error: "Customer name is required." }, { status: 400 }) as any;
    }

    const result = await runWithDatabaseFallback(
      async () => {
        // Enforce uniqueness of phone number per tenant
        if (phone) {
          const dup = await prisma.customer.findFirst({
            where: { tenantId, phone }
          });
          if (dup) throw new Error("A customer with this phone number is already registered.");
        }

        return await prisma.customer.create({
          data: {
            tenantId,
            name,
            email: email || null,
            phone: phone || null,
            loyaltyPoints: 100 // Welcome reward points!
          }
        });
      },
      async () => {
        if (localCustomersCache.length === 0) {
          localCustomersCache = [...mockCustomers];
        }
        
        const newMockCust = {
          id: `mock-cust-${Date.now()}`,
          tenantId,
          name,
          email: email || '',
          phone: phone || '',
          loyaltyPoints: 100
        };
        
        localCustomersCache.push(newMockCust);
        return newMockCust;
      }
    );

    return NextResponse.json({
      success: true,
      message: "Customer registered successfully!",
      customer: result
    });
  } catch (error: any) {
    console.error("Create customer error:", error);
    return NextResponse.json({ error: error.message || "Failed to register customer." }, { status: 500 }) as any;
  }
}
