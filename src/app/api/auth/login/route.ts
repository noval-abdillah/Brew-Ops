import { NextResponse } from 'next/server';
import { prisma, runWithDatabaseFallback } from '@/lib/prisma';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please enter both email and password." },
        { status: 400 }
      ) as any;
    }

    const loginResult = await runWithDatabaseFallback(
      async () => {
        // 1. Fetch user by email with their Tenant details
        const user = await prisma.user.findUnique({
          where: { email },
          include: { tenant: true }
        });

        if (!user || !user.active) {
          throw new Error("Invalid email or password.");
        }

        // 2. Validate password
        const passwordMatch = await comparePassword(password, user.passwordHash);
        if (!passwordMatch) {
          throw new Error("Invalid email or password.");
        }

        // 3. Create Session Token
        const sessionPayload = {
          userId: user.id,
          tenantId: user.tenantId,
          email: user.email,
          name: user.name,
          role: user.role,
          tenantSlug: user.tenant.slug
        };

        const token = signToken(sessionPayload);

        return {
          success: true,
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          },
          tenant: {
            id: user.tenant.id,
            name: user.tenant.name,
            slug: user.tenant.slug,
            currency: user.tenant.currency
          }
        };
      },
      async () => {
        // FALLBACK IN-MEMORY AUTHENTICATION (For local quick run without DB)
        // Check standard seeded accounts
        const mockCredentials: { [key: string]: { name: string; role: 'OWNER' | 'MANAGER' | 'STAFF'; slug: string } } = {
          'owner@brewops.com': { name: 'Elena Vance', role: 'OWNER', slug: 'brewops' },
          'manager@brewops.com': { name: 'Marcus Brody', role: 'MANAGER', slug: 'brewops' },
          'staff@brewops.com': { name: 'Jordan Miller', role: 'STAFF', slug: 'brewops' },
          'owner@mocha.com': { name: 'Sam Brooks', role: 'OWNER', slug: 'mocha-co' }
        };

        const matchedMock = mockCredentials[email.toLowerCase()];
        
        // Let any password pass for seed emails in offline dev mode, or check password123
        if (matchedMock && password === 'password123') {
          const sessionPayload = {
            userId: `mock-user-id-${matchedMock.role.toLowerCase()}`,
            tenantId: `mock-tenant-id-${matchedMock.slug}`,
            email: email.toLowerCase(),
            name: matchedMock.name,
            role: matchedMock.role,
            tenantSlug: matchedMock.slug
          };

          const token = signToken(sessionPayload);

          return {
            success: true,
            token,
            user: {
              id: sessionPayload.userId,
              email: sessionPayload.email,
              name: sessionPayload.name,
              role: sessionPayload.role
            },
            tenant: {
              id: sessionPayload.tenantId,
              name: matchedMock.slug === 'brewops' ? 'BrewOps Coffee Co.' : 'Mocha & Co. Coffee Shop',
              slug: sessionPayload.tenantSlug,
              currency: 'USD'
            }
          };
        }

        throw new Error("Invalid credentials in offline demo mode. Use owner@brewops.com, manager@brewops.com, or staff@brewops.com with 'password123'.");
      }
    );

    // Set secure HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: loginResult.user,
      tenant: loginResult.tenant
    });

    response.cookies.set({
      name: 'session_token',
      value: loginResult.token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });

    return response;
  } catch (error: any) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
