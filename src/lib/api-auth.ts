import { NextResponse } from 'next/server';
import { verifyToken } from './auth';

/**
 * Centralized authentication helper for API routes.
 * Extracts and verifies session token from request cookies.
 * 
 * @returns { error: NextResponse | null, session: SessionPayload | null }
 */
export async function authenticateRequest(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/session_token=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;
  
  if (!token) {
    return { 
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) as any,
      session: null 
    };
  }
  
  const session = verifyToken(token);
  if (!session) {
    return { 
      error: NextResponse.json({ error: "Invalid session" }, { status: 401 }) as any,
      session: null 
    };
  }
  
  return { error: null, session };
}
