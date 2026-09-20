import Redis from 'ioredis';

// Initialize Redis client using the environment variable REDIS_URL.
// Only initialize if REDIS_URL is provided to prevent crashes in environments without Redis setup yet.
const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null;

/**
 * Validates rate limiting for a specific identifier (like an IP address).
 * Uses a fixed-window counter approach for simplicity and performance.
 *
 * @param identifier - Unique identifier for the client (e.g., IP address).
 * @param limit - Maximum number of allowed requests in the given window.
 * @param windowInSeconds - The time window in seconds.
 * @returns { success: boolean } - Returns true if the request is allowed, false if rate limited.
 */
export async function checkRateLimit(
  identifier: string,
  limit: number,
  windowInSeconds: number
): Promise<{ success: boolean; current?: number; limit?: number }> {
  if (!redis) {
    // If Redis is not configured, we gracefully degrade to allowing all traffic
    console.warn('Redis is not configured. Rate limiting is bypassed.');
    return { success: true };
  }

  try {
    const currentUnixTime = Math.floor(Date.now() / 1000);
    const currentWindow = Math.floor(currentUnixTime / windowInSeconds);
    const key = `ratelimit:${identifier}:${currentWindow}`;

    // Use a pipeline to execute commands atomically
    const pipeline = redis.pipeline();
    pipeline.incr(key);
    pipeline.expire(key, windowInSeconds * 2); // Expiry slightly longer than the window to ensure cleanup
    
    const results = await pipeline.exec();
    if (!results) {
        throw new Error('Pipeline execution failed');
    }

    const currentCount = results[0][1] as number;

    if (currentCount > limit) {
      return { success: false, current: currentCount, limit };
    }

    return { success: true, current: currentCount, limit };
  } catch (error) {
    console.error('Rate limiting error:', error);
    // On Redis error, allow the request to prevent blocking legitimate users due to infrastructure issues
    return { success: true };
  }
}
