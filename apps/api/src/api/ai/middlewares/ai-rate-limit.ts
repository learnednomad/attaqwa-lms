/**
 * AI-specific Rate Limiting Middleware
 * Stricter limits than general API:
 * - Anonymous: 0 requests (blocked)
 * - Authenticated: 10 requests/min
 * - Admin: 50 requests/min
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const AI_RATE_LIMITS = {
  anonymous: {
    maxRequests: 0,
    windowMs: 60 * 1000,
  },
  authenticated: {
    maxRequests: parseInt(process.env.AI_RATE_LIMIT_AUTHENTICATED || '10', 10),
    windowMs: 60 * 1000,
  },
  admin: {
    maxRequests: parseInt(process.env.AI_RATE_LIMIT_ADMIN || '50', 10),
    windowMs: 60 * 1000,
  },
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

export default (_config: Record<string, unknown>, { strapi }: { strapi: any }) => {
  return async (ctx: any, next: () => Promise<void>) => {
    const user = ctx.state?.user;

    // Block anonymous users from AI endpoints
    if (!user) {
      ctx.status = 401;
      ctx.body = {
        error: {
          status: 401,
          name: 'UnauthorizedError',
          message: 'Authentication required to access AI features.',
        },
      };
      return;
    }

    const userId = user.id;
    const tier: keyof typeof AI_RATE_LIMITS =
      user.role?.type === 'admin' ? 'admin' : 'authenticated';

    const key = `ai:user:${userId}`;
    const { maxRequests, windowMs } = AI_RATE_LIMITS[tier];

    const now = Date.now();
    let entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetTime) {
      entry = { count: 0, resetTime: now + windowMs };
    }

    entry.count++;
    rateLimitStore.set(key, entry);

    const remaining = Math.max(0, maxRequests - entry.count);
    const resetInSeconds = Math.ceil((entry.resetTime - now) / 1000);

    ctx.set('X-AI-RateLimit-Limit', maxRequests.toString());
    ctx.set('X-AI-RateLimit-Remaining', remaining.toString());
    ctx.set('X-AI-RateLimit-Reset', resetInSeconds.toString());

    if (entry.count > maxRequests) {
      ctx.status = 429;
      ctx.body = {
        error: {
          status: 429,
          name: 'TooManyRequestsError',
          message: 'AI rate limit exceeded. Please try again later.',
          details: {
            retryAfter: resetInSeconds,
            limit: maxRequests,
            windowMs,
          },
        },
      };
      ctx.set('Retry-After', resetInSeconds.toString());
      strapi.log.warn(`AI rate limit exceeded for user:${userId} (tier: ${tier})`);
      return;
    }

    await next();
  };
};
