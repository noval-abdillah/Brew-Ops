import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // Get session_token cookie from request headers
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/session_token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, error: "No active session." },
        { status: 401 }
      ) as any;
    }

    const session = verifyToken(token);
    if (!session) {
      return NextResponse.json(
        { authenticated: false, error: "Session expired or invalid." },
        { status: 401 }
      ) as any;
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.userId,
        email: session.email,
        name: session.name,
        role: session.role
      },
      tenant: {
        id: session.tenantId,
        slug: session.tenantSlug
      }
    });
  } catch (error) {
    console.error("Auth me check error:", error);
    return NextResponse.json(
      { authenticated: false, error: "Internal server error during session validation." },
      { status: 500 }
    ) as any;
  }
}
