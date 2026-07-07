import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Successfully logged out."
    }) as any;

    // Clear session token by deleting the cookie
    response.cookies.delete('session_token');

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during logout." },
      { status: 500 }
    ) as any;
  }
}
export async function GET() {
  // Support GET logout requests for simpler redirects if needed
  const response = NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
  response.cookies.delete('session_token');
  return response;
}
