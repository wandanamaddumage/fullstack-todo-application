import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// In-memory rate limiter for development
class MemoryRateLimiter {
  constructor(requests = 100, windowInSeconds = 60) {
    this.requests = requests;
    this.windowInSeconds = windowInSeconds;
    this.store = new Map();
  }

  async limit(identifier) {
    const now = Date.now();
    const windowStart = now - (this.windowInSeconds * 1000);
    const timestamps = (this.store.get(identifier) || []).filter(ts => ts > windowStart);
    
    if (timestamps.length >= this.requests) {
      return {
        success: false,
        limit: this.requests,
        remaining: 0,
        reset: Math.floor((timestamps[0] + (this.windowInSeconds * 1000)) / 1000)
      };
    }

    timestamps.push(now);
    this.store.set(identifier, timestamps);
    
    return {
      success: true,
      limit: this.requests,
      remaining: this.requests - timestamps.length,
      reset: Math.floor((now + (this.windowInSeconds * 1000)) / 1000)
    };
  }
}

// Initialize rate limiter
let ratelimit;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    // Use Upstash Redis if configured
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '60 s'),
      analytics: true,
    });
    console.log('Using Upstash Redis for rate limiting');
  } else {
    // Fallback to in-memory rate limiter
    ratelimit = new MemoryRateLimiter(100, 60);
    console.warn('Using in-memory rate limiter (not suitable for production)');
  }
} catch (error) {
  console.error('Error initializing rate limiter:', error);
  // Fallback to in-memory rate limiter if there's an error
  ratelimit = new MemoryRateLimiter(100, 60);
  console.warn('Falling back to in-memory rate limiter due to error');
}

const rateLimiter = async (req, res, next) => {
  try {
    const identifier = req.ip || 'unknown';
    const result = await ratelimit.limit(identifier);

    // Set rate limit headers
    res.set({
      'X-RateLimit-Limit': result.limit,
      'X-RateLimit-Remaining': result.remaining,
      'X-RateLimit-Reset': result.reset
    });

    if (!result.success) {
      return res.status(429).json({
        error: 'Too Many Requests',
        message: 'You have exceeded the rate limit. Please try again later.'
      });
    }

    next();
  } catch (error) {
    console.error('Rate limiter error:', error);
    // Allow the request to continue in case of rate limiter error
    next();
  }
};

export default rateLimiter;