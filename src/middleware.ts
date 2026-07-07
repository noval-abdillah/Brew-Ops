import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Pure JS JWT Decoder suitable for the Next.js Edge Runtime.
 * Decodes the payload section of a standard HS256 JWT token.
 */
function decodeJWTPayload(token: string): {
  userId: string;
  tenantId: string;
  email: string;
  name: string;
  role: 'OWNER' | 'MANAGER' | 'STAFF';
  tenantSlug: string;
} | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. PUBLIC ROUTES (Allow bypass)
  const isPublicPage =
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname.startsWith('/menu/') || // online scan menu
    pathname.startsWith('/api/auth'); // auth API endpoints

  if (isPublicPage || pathname.startsWith('/_next') || pathname.endsWith('.ico') || pathname.endsWith('.png') || pathname.endsWith('.jpg')) {
    return NextResponse.next();
  }

  // 2. DASHBOARD & SECURE ROUTES (Verify authentication)
  if (pathname.startsWith('/dashboard') || (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/'))) {
    const sessionToken = request.cookies.get('session_token')?.value;

    if (!sessionToken) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      // Not logged in -> Redirect to login page
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    const session = decodeJWTPayload(sessionToken);
    if (!session) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: "Invalid session" }, { status: 401 });
      }
      // Invalid session cookie -> Clear cookie and redirect
      const loginUrl = new URL('/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('session_token');
      return response;
    }

    // 3. ROLE-BASED ACCESS CONTROL (RBAC)
    const isStaff = session.role === 'STAFF';
    
    // STAFF can only access the POS interface and dashboard base page redirect
    const isAdminOnlyPage =
      pathname.startsWith('/dashboard/inventory') ||
      pathname.startsWith('/dashboard/staff') ||
      pathname.startsWith('/dashboard/reports') ||
      pathname.startsWith('/dashboard/settings');

    if (isStaff && isAdminOnlyPage) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      // Staff trying to access admin pages -> Redirect them back to the POS panel
      const posUrl = new URL('/dashboard/pos', request.url);
      return NextResponse.redirect(posUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
