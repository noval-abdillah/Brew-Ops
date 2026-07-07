import { NextResponse } from 'next/server';
import { prisma, runWithDatabaseFallback } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/api-auth';
import { mockSuppliers } from '@/lib/mock-data';

let localSuppliersCache: any[] = [];

export async function GET(request: Request) {
  try {
    const { error, session } = await authenticateRequest(request);
    if (error) return error;

    const tenantId = session!.tenantId;

    const list = await runWithDatabaseFallback(
      async () => {
        return await prisma.supplier.findMany({
          where: { tenantId },
          orderBy: { name: 'asc' }
        });
      },
      async () => {
        if (localSuppliersCache.length === 0) {
          localSuppliersCache = [...mockSuppliers];
        }
        return localSuppliersCache;
      }
    );

    return NextResponse.json(list);
  } catch (error) {
    console.error("Fetch suppliers error:", error);
    return NextResponse.json({ error: "Failed to load suppliers." }, { status: 500 }) as any;
  }
}

export async function POST(request: Request) {
  try {
    const { error, session } = await authenticateRequest(request);
    if (error) return error;

    const tenantId = session!.tenantId;

    const body = await request.json();
    const { name, contactName, email, phone, address } = body;

    if (!name) {
      return NextResponse.json({ error: "Supplier name is required." }, { status: 400 }) as any;
    }

    const result = await runWithDatabaseFallback(
      async () => {
        return await prisma.supplier.create({
          data: {
            tenantId,
            name,
            contactName: contactName || null,
            email: email || null,
            phone: phone || null,
            address: address || null
          }
        });
      },
      async () => {
        if (localSuppliersCache.length === 0) {
          localSuppliersCache = [...mockSuppliers];
        }

        const newMockSup = {
          id: `mock-sup-${Date.now()}`,
          tenantId,
          name,
          contactName: contactName || '',
          email: email || '',
          phone: phone || '',
          address: address || ''
        };
        localSuppliersCache.push(newMockSup);
        return newMockSup;
      }
    );

    return NextResponse.json({
      success: true,
      message: "Supplier added successfully!",
      supplier: result
    });
  } catch (error) {
    console.error("Create supplier error:", error);
    return NextResponse.json({ error: "Failed to add supplier." }, { status: 500 }) as any;
  }
}
