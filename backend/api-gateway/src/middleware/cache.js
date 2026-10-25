/**
 * ---------------------------------
 * File: CacheMiddleware.js
 * Description:
 * This file contains middleware for caching GET requests in Redis. The cache is 
 * used to store the response data for GET requests and will serve the cached 
 * data when available, improving performance by reducing the need for repeated 
 * database queries or expensive operations. The cache is bypassed for non-GET 
 * requests. The cache expiration time is configurable and defaults to 5 minutes.
 * 
 * Dependencies:
 * - `redisClient`: A Redis client for interacting with the Redis cache.
 * 
 * Author: Your Name
 * Created On: May-07-2025
 * Updated On: May-07-2025
 * 
 * Notes:
 * - The `cacheMiddleware` function is used for GET requests to check if data is 
 *   cached in Redis, and if not, caches the response before sending it.
 * - The `clearCache` function can be used to clear specific cache entries based 
 *   on a pattern, useful for clearing outdated cache after data updates.
 * 
 * ---------------------------------
 */


const { redisClient } = require("../config/redis");
const { logger } = require("../utils/logger.utils");

const CACHE_TTL = 300; // 5 minutes in seconds

/**
 * Middleware to cache GET requests in Redis.
 * - If the request method is not GET, the cache is bypassed.
 * - It checks if the data for the request's URL is already cached in Redis. If so, it returns the cached data.
 * - If not cached, it intercepts the response to store the data in Redis before sending it.
 * @param {number} duration - The TTL (time-to-live) in seconds for the cache. Default is 5 minutes.
 * @returns {Function} - The middleware function for Express.js.
 */
const cacheMiddleware = (duration = CACHE_TTL) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    const key = `cache:${req.originalUrl}`;

    try {
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        console.log("Cache hit for:", key);
        return res.json(JSON.parse(cachedData));
      }

      // Store original send function
      const originalSend = res.send;

      // Override send function to cache the response
      res.send = function (data) {
        // Cache the response
        redisClient.setEx(key, duration, JSON.stringify(data));

        // Restore original send function
        res.send = originalSend;

        // Send the response
        return res.send(data);
      };

      next();
    } catch (error) {
      logger.error("Error in cacheMiddleware function: ", error.stack);
      next();
    }
  };
};

/**
 * Clears cached data based on a given pattern.
 * This function is useful when you want to clear specific cache entries, such as after data updates.
 * @param {string} pattern - The Redis key pattern to match for cache clearing (e.g., "cache:*").
 */
const clearCache = async (pattern) => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      logger.info(`Cleared cache for pattern: ${pattern}`);
    }
  } catch (error) {
    logger.error("Clear Cache Error:", error.stack);
  }
};

module.exports = {
  cacheMiddleware,
  clearCache,
};
