import { NextRequest, NextResponse } from 'next/server';

/**
 * Rate limit configuration
 */
const RATE_LIMIT_CONFIG = {
  maxRequests: 20,
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
  cleanupIntervalMs: 10 * 60 * 1000, // Clean up old entries every 10 minutes
};

/**
 * Rate limit entry for tracking requests per IP
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * In-memory storage for rate limiting
 * Note: In a production environment with multiple instances,
 * consider using Redis or another distributed cache
 */
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Last cleanup timestamp
 */
let lastCleanup = Date.now();

/**
 * Clean up expired entries from the rate limit store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();

  // Only run cleanup if enough time has passed
  if (now - lastCleanup < RATE_LIMIT_CONFIG.cleanupIntervalMs) {
    return;
  }

  lastCleanup = now;

  for (const [ip, entry] of rateLimitStore.entries()) {
    if (now >= entry.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}

/**
 * Get client IP address from request
 */
function getClientIP(request: NextRequest): string {
  // Check various headers for the real IP (in order of preference)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for may contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback to a default identifier if no IP is found
  // This should rarely happen in production
  return 'unknown';
}

/**
 * Check rate limit for a given IP
 * Returns the rate limit status and updates the count
 */
function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();

  // Run cleanup periodically
  cleanupExpiredEntries();

  // Get or create entry for this IP
  let entry = rateLimitStore.get(ip);

  if (!entry || now >= entry.resetTime) {
    // Create new entry or reset expired entry
    entry = {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
    };
    rateLimitStore.set(ip, entry);

    return {
      allowed: true,
      remaining: RATE_LIMIT_CONFIG.maxRequests - 1,
      resetTime: entry.resetTime,
    };
  }

  // Check if limit is exceeded
  if (entry.count >= RATE_LIMIT_CONFIG.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count += 1;
  rateLimitStore.set(ip, entry);

  return {
    allowed: true,
    remaining: RATE_LIMIT_CONFIG.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Create rate limit headers
 */
function createRateLimitHeaders(
  remaining: number,
  resetTime: number
): Record<string, string> {
  return {
    'X-RateLimit-Limit': RATE_LIMIT_CONFIG.maxRequests.toString(),
    'X-RateLimit-Remaining': Math.max(0, remaining).toString(),
    'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
  };
}

/**
 * Next.js middleware for rate limiting
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply rate limiting to POST requests on /api/generate
  if (pathname === '/api/generate' && request.method === 'POST') {
    const ip = getClientIP(request);
    const { allowed, remaining, resetTime } = checkRateLimit(ip);

    if (!allowed) {
      // Calculate time until reset in a human-readable format
      const secondsUntilReset = Math.ceil((resetTime - Date.now()) / 1000);
      const minutesUntilReset = Math.ceil(secondsUntilReset / 60);

      return NextResponse.json(
        {
          error: `Rate limit exceeded. You can make ${RATE_LIMIT_CONFIG.maxRequests} requests per hour. Please try again in ${minutesUntilReset} minute${minutesUntilReset !== 1 ? 's' : ''}.`,
          code: 'RATE_LIMIT_EXCEEDED',
        },
        {
          status: 429,
          headers: createRateLimitHeaders(remaining, resetTime),
        }
      );
    }

    // Add rate limit headers to successful requests
    const response = NextResponse.next();
    const headers = createRateLimitHeaders(remaining, resetTime);

    for (const [key, value] of Object.entries(headers)) {
      response.headers.set(key, value);
    }

    return response;
  }

  // Pass through for all other routes
  return NextResponse.next();
}

/**
 * Configure which routes the middleware runs on
 */
export const config = {
  matcher: [
    // Only match /api/generate route
    '/api/generate',
  ],
};
