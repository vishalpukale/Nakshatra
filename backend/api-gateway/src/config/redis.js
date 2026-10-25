/**
 * ---------------------------------
 * File: RedisClient.js
 * Description:
 * This file sets up and manages a Redis client connection using the `redis` 
 * Node.js package. It handles connection events, error handling, and automatic 
 * reconnection strategies with custom retry logic. The client is configured to 
 * reconnect a few times if the connection to Redis is lost, and provides a method 
 * to manually attempt to connect to Redis if the client isn't already connected.
 * 
 * Dependencies:
 * - `redis`: A Redis client for Node.js.
 * 
 * Author: Rameshware Marbate
 * Created On: May-07-2025
 * Updated On: May-07-2025
 * 
 * Notes:
 * - The client connects to a Redis server at `redis://107.155.65.157:6378`.
 * - If the connection fails, the client will attempt to reconnect, up to 3 retries.
 * - The `connectRedis` method should be called if the client isn't already connected 
 *   when performing Redis operations.
 * 
 */


const { createClient } = require("redis");
// Initializes and manages a Redis client with custom reconnect logic, 
// connection event handling, and an asynchronous connection function.
const redisClient = createClient({
  url: "redis://107.155.65.157:6378",
  socket: {
    connectTimeout: 10000,
    reconnectStrategy: (retries) => {
      if (retries > 3) {
        console.error("Max reconnection attempts reached");
        return new Error("Max reconnection attempts reached");
      }
      return Math.min(retries * 1000, 3000);
    },
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err.message);
  if (err.code === "ECONNREFUSED") {
    console.error(
      "Connection refused. Please check if Redis server is running and accessible."
    );
  }
});

redisClient.on("connect", () => console.log("Redis Client Connected"));
redisClient.on("reconnecting", () =>
  console.log("Redis Client Reconnecting...")
);
redisClient.on("end", () => console.log("Redis Client Connection Ended"));
// Attempts to connect to Redis if not already connected
const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      console.log("Attempting to connect to Redis...");
      await redisClient.connect();
    }
  } catch (error) {
    console.error("Redis Connection Error:", error.message);
    throw error;
  }
};

module.exports = {
  redisClient,
  connectRedis,
};
