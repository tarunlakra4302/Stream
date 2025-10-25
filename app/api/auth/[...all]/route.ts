import aj, {
  ArcjetDecision,
  shield,
  slidingWindow,
  validateEmail,
} from "@/lib/arcjet";
import ip from "@arcjet/ip";
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

// CORS configuration
const getAllowedOrigin = (req: NextRequest) => {
  const origin = req.headers.get("origin");
  const isDev = process.env.NODE_ENV === "development";

  // In development, allow localhost on any port
  if (isDev) {
    if (origin && origin.startsWith("http://localhost:")) {
      return origin;
    }
    // Fallback for development
    return "http://localhost:3001";
  }

  // In production, use specific frontend URL
  return process.env.NEXT_PUBLIC_FRONTEND_URL || "*";
};

const getCorsHeaders = (origin: string) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
});

const emailValidation = aj.withRule(
  validateEmail({
    mode: "LIVE",
    block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
  })
);

const rateLimit = aj.withRule(
  slidingWindow({
    mode: "LIVE",
    interval: process.env.NODE_ENV === "development" ? "1m" : "2m",
    max: process.env.NODE_ENV === "development" ? 100 : 5,
    characteristics: ["fingerprint"],
  })
);

const shieldValidation = aj.withRule(
  shield({
    mode: "LIVE",
  })
);

const protectedAuth = async (req: NextRequest): Promise<ArcjetDecision> => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  let userId: string;
  if (session?.user.id) {
    userId = session.user.id;
  } else {
    userId = ip(req) || "127.0.0.1";
  }
  if (req.nextUrl.pathname.startsWith("/api/auth/sign-in")) {
    try {
      const body = await req.clone().json();
      if (typeof body.email === "string") {
        return emailValidation.protect(req, {
          email: body.email,
        });
      }
    } catch (error) {
      // Body is not JSON or is empty (e.g., social sign-in)
      // Fall through to rate limiting
    }
  }
  if (!req.nextUrl.pathname.startsWith("/api/auth/sign-out")) {
    return rateLimit.protect(req, {
      fingerprint: userId,
    });
  }
  return shieldValidation.protect(req);
};

const authHandlers = toNextJsHandler(auth.handler);

// Handle preflight requests
export async function OPTIONS(req: NextRequest) {
  const origin = getAllowedOrigin(req);
  return NextResponse.json({}, { headers: getCorsHeaders(origin) });
}

// Wrap GET handler with CORS headers
export async function GET(req: NextRequest) {
  const response = await authHandlers.GET(req);
  const origin = getAllowedOrigin(req);
  const corsHeaders = getCorsHeaders(origin);
  const headers = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });
  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export const POST = async (req: NextRequest) => {
  const isDev = process.env.NODE_ENV === "development";
  const origin = getAllowedOrigin(req);
  const corsHeaders = getCorsHeaders(origin);

  try {
    // Add timeout to prevent hanging on Arcjet API issues
    const timeoutMs = isDev ? 3000 : 5000; // 3s in dev, 5s in prod
    const decision = await Promise.race([
      protectedAuth(req),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Arcjet timeout")), timeoutMs)
      ),
    ]);

    if (decision.isDenied()) {
      if (decision.reason.isEmail()) {
        return NextResponse.json(
          { error: "Email validation failed" },
          { status: 400, headers: corsHeaders }
        );
      }
      if (decision.reason.isRateLimit()) {
        return NextResponse.json(
          { error: "Rate limit exceeded" },
          { status: 429, headers: corsHeaders }
        );
      }
      if (decision.reason.isShield()) {
        return NextResponse.json(
          { error: "Shield validation failed" },
          { status: 403, headers: corsHeaders }
        );
      }
    }
  } catch (error) {
    // In development, allow requests through if Arcjet fails
    // In production, you may want stricter handling
    if (isDev) {
      console.warn(
        "[Arcjet] Protection check failed, allowing request in development mode:",
        error instanceof Error ? error.message : error
      );
    } else {
      // In production, return error with CORS headers
      return NextResponse.json(
        { error: "Security check failed" },
        { status: 500, headers: corsHeaders }
      );
    }
  }

  // Clone the request to avoid "Body already read" errors
  // since Arcjet may have consumed the original request body
  const response = await authHandlers.POST(req.clone());
  const headers = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });
  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};