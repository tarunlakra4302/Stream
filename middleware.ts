import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Minimal middleware for Edge runtime
// Note: Arcjet protection is handled in API routes due to Edge Function size limits
// Authentication is handled in the (root)/layout.tsx server component
export function middleware(request: NextRequest) {
  // Simply pass through - authentication handled at layout level
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sign-in|assets).*)"],
};