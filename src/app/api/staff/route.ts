import { NextResponse } from 'next/server';
import { prisma, runWithDatabaseFallback } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/api-auth';
import { mockShifts } from '@/lib/mock-data';

let localShiftsCache: any[] = [];

export async function GET(request: Request) {
  try {
    const { error, session } = await authenticateRequest(request);
    if (error) return error;

    const tenantId = session!.tenantId;

    const list = await runWithDatabaseFallback(
      async () => {
        return await prisma.shift.findMany({
          where: { tenantId },
          include: { staff: true },
          orderBy: { startTime: 'desc' }
        });
      },
      async () => {
        if (localShiftsCache.length === 0) {
          localShiftsCache = [...mockShifts];
        }
        return localShiftsCache;
      }
    );

    return NextResponse.json(list);
  } catch (error) {
    console.error("Fetch shift rosters error:", error);
    return NextResponse.json({ error: "Failed to load shift rosters." }, { status: 500 }) as any;
  }
}

export async function POST(request: Request) {
  try {
    const { error, session } = await authenticateRequest(request);
    if (error) return error;

    const tenantId = session!.tenantId;
    const userId = session!.userId;

    const body = await request.json();
    const { action } = body; // 'CLOCK_IN' or 'CLOCK_OUT'

    if (!action) {
      return NextResponse.json({ error: "Shift action CLOCK_IN/CLOCK_OUT is required." }, { status: 400 }) as any;
    }

    const result = await runWithDatabaseFallback(
      async () => {
        if (action === 'CLOCK_IN') {
          // Verify no active shifts exist for the user
          const active = await prisma.shift.findFirst({
            where: { tenantId, userId, status: 'ACTIVE' }
          });
          if (active) throw new Error("You already have an active clock-in session.");

          return await prisma.shift.create({
            data: {
              tenantId,
              userId,
              status: 'ACTIVE',
              startTime: new Date()
            }
          });
        } else {
          // Clock out of active shift
          const active = await prisma.shift.findFirst({
            where: { tenantId, userId, status: 'ACTIVE' }
          });
          if (!active) throw new Error("No active clock-in session found.");

          return await prisma.shift.update({
            where: { id: active.id },
            data: {
              status: 'COMPLETED',
              endTime: new Date()
            }
          });
        }
      },
      async () => {
        if (localShiftsCache.length === 0) {
          localShiftsCache = [...mockShifts];
        }

        if (action === 'CLOCK_IN') {
          const active = localShiftsCache.find(s => s.userId === userId && s.status === 'ACTIVE');
          if (active) throw new Error("You already have an active shift in local simulation.");

          const newMockShift = {
            id: `mock-shift-${Date.now()}`,
            userId,
            name: session!.name,
            startTime: new Date().toISOString(),
            endTime: null,
            status: 'ACTIVE',
            salesGenerated: 0,
            ordersHandled: 0
          };
          localShiftsCache.unshift(newMockShift);
          return newMockShift;
        } else {
          const activeIdx = localShiftsCache.findIndex(s => s.userId === userId && s.status === 'ACTIVE');
          if (activeIdx === -1) throw new Error("No active shift found in local simulation.");

          localShiftsCache[activeIdx].status = 'COMPLETED';
          localShiftsCache[activeIdx].endTime = new Date().toISOString();
          return localShiftsCache[activeIdx];
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: `Successfully clocked ${action === 'CLOCK_IN' ? 'in' : 'out'}!`,
      shift: result
    });
  } catch (error: any) {
    console.error("Shift attendance update error:", error);
    return NextResponse.json({ error: error.message || "Failed to update attendance." }, { status: 500 }) as any;
  }
}
