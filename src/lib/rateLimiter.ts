/**
 * A very small in-memory sliding window rate limiter for demonstration.
 * In production you would use a redis-backed solution such as
 * `rate-limiter-flexible` or `express-rate-limit` with a shared store.
 *
 * Example usage in a route:
 *   const limiter = getRateLimiter({ windowMs: 60000, max: 20 });
 *   if (!limiter.check(key)) return NextResponse.json(...429...)
 */

interface LimiterOptions {
  windowMs: number;
  max: number;
}

interface Bucket {
  count: number;
  reset: number; // timestamp in ms
}

const stores = new Map<string, Bucket>();

export function getRateLimiter(opts: LimiterOptions) {
  return {
    check(key: string) {
      const now = Date.now();
      const bucket = stores.get(key) || {
        count: 0,
        reset: now + opts.windowMs,
      };
      if (now > bucket.reset) {
        bucket.count = 0;
        bucket.reset = now + opts.windowMs;
      }
      bucket.count += 1;
      stores.set(key, bucket);
      return bucket.count <= opts.max;
    },
    remaining(key: string) {
      const bucket = stores.get(key);
      if (!bucket) return opts.max;
      return Math.max(0, opts.max - bucket.count);
    },
    reset(key: string) {
      stores.delete(key);
    },
  };
}
