import { NextRequest, NextResponse } from 'next/server'

// ============================================
// Rate Limiting Middleware
// Protects auth endpoints from spam/brute-force attacks
// ============================================

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory rate limit store
// Note: This resets on each serverless function cold start / redeploy
// For production-grade persistence, use Upstash Redis or similar
const rateLimitStore = new Map<string, RateLimitEntry>()

// Configuration per route
const RATE_LIMITS: Record<string, { maxRequests: number; windowMs: number }> = {
  '/api/auth/signup': { maxRequests: 3, windowMs: 60 * 1000 },  // 3 signups/minute
  '/api/auth/login': { maxRequests: 5, windowMs: 60 * 1000 },   // 5 logins/minute
  '/api/auth/change-password': { maxRequests: 3, windowMs: 60 * 1000 }, // 3 password changes/minute
}

// Cleanup stale entries every 5 minutes to prevent memory leak
let lastCleanup = Date.now()
function cleanupStore() {
  const now = Date.now()
  if (now - lastCleanup < 5 * 60 * 1000) return
  lastCleanup = now
  for (const [key, entry] of rateLimitStore) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Find matching rate limit config
  let matchedPath: string | null = null
  for (const path of Object.keys(RATE_LIMITS)) {
    if (pathname.startsWith(path)) {
      matchedPath = path
      break
    }
  }

  // No rate limit needed for this path
  if (!matchedPath) {
    return NextResponse.next()
  }

  const config = RATE_LIMITS[matchedPath]

  // Get client identifier (IP address)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0]?.trim() || realIp || 'unknown'

  // Create a unique key: IP + path
  const key = `${ip}:${matchedPath}`
  const now = Date.now()

  // Cleanup stale entries periodically
  cleanupStore()

  // Check rate limit
  const entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetTime) {
    // First request or window expired — reset counter
    rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs })
    return NextResponse.next()
  }

  entry.count++

  if (entry.count > config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000)

    return NextResponse.json(
      {
        error: 'Quá nhiều yêu cầu. Vui lòng đợi vài phút rồi thử lại.',
        retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(config.maxRequests),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(entry.resetTime / 1000)),
        },
      }
    )
  }

  // Allow request but add rate limit headers
  const response = NextResponse.next()
  response.headers.set('X-RateLimit-Limit', String(config.maxRequests))
  response.headers.set('X-RateLimit-Remaining', String(config.maxRequests - entry.count))
  response.headers.set('X-RateLimit-Reset', String(Math.ceil(entry.resetTime / 1000)))

  return response
}

export const config = {
  // Match only API routes that need rate limiting
  matcher: [
    '/api/auth/:function*',
  ],
}
