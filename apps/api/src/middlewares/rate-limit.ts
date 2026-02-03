/**
 * Global Rate Limiting Middleware for Strapi v5
 *
 * Configuration:
 * - Anonymous users: 100 requests per minute
 * - Authenticated users: 500 requests per minute
 * - Admin users: 1000 requests per minute
 *
 * Uses a simple in-memory store. For production with multiple instances,
 * consider using Redis-based rate limiting.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limit configuration
const RATE_LIMITS = {
  anonymous: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 req/min
  authenticated: { maxRequests: 500, windowMs: 60 * 1000 }, // 500 req/min
  admin: { maxRequests: 1000, windowMs: 60 * 1000 }, // 1000 req/min
};

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export default (config: Record<string, unknown>, { strapi }: { strapi: any }) => {
  return async (ctx: any, next: () => Promise<void>) => {
    // Get client identifier (IP address or user ID)
    const clientIP = ctx.request.ip || ctx.request.headers['x-forwarded-for'] || 'unknown';
    const user = ctx.state?.user;
    const userId = user?.id;

    // Determine rate limit tier
    let tier: keyof typeof RATE_LIMITS = 'anonymous';
    if (user) {
      tier = user.role?.type === 'admin' ? 'admin' : 'authenticated';
    }

    // Create unique key for this client
    const key = userId ? `user:${userId}` : `ip:${clientIP}`;
    const { maxRequests, windowMs } = RATE_LIMITS[tier];

    const now = Date.now();
    let entry = rateLimitStore.get(key);

    // Reset if window has expired
    if (!entry || now > entry.resetTime) {
      entry = {
        count: 0,
        resetTime: now + windowMs,
      };
    }

    entry.count++;
    rateLimitStore.set(key, entry);

    // Calculate remaining requests and reset time
    const remaining = Math.max(0, maxRequests - entry.count);
    const resetInSeconds = Math.ceil((entry.resetTime - now) / 1000);

    // Set rate limit headers
    ctx.set('X-RateLimit-Limit', maxRequests.toString());
    ctx.set('X-RateLimit-Remaining', remaining.toString());
    ctx.set('X-RateLimit-Reset', resetInSeconds.toString());

    // Check if rate limit exceeded
    if (entry.count > maxRequests) {
      ctx.status = 429;
      ctx.body = {
        error: {
          status: 429,
          name: 'TooManyRequestsError',
          message: 'Rate limit exceeded. Please try again later.',
          details: {
            retryAfter: resetInSeconds,
            limit: maxRequests,
            windowMs,
          },
        },
      };
      ctx.set('Retry-After', resetInSeconds.toString());

      // Log rate limit violation
      strapi.log.warn(`Rate limit exceeded for ${key} (tier: ${tier})`);
      return;
    }

    await next();
  };
};
