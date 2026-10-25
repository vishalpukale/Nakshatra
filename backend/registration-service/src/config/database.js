const { drizzle } = require("drizzle-orm/node-postgres");
const { Pool } = require("pg");
const { migrate } = require("drizzle-orm/node-postgres/migrator");
require("dotenv").config();

// Database configuration with retry options
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
  // Connection pool settings
  max: process.env.DB_POOL_MAX || 50,
  min: 0,
  idleTimeoutMillis: process.env.DB_POOL_IDLE_TIMEOUT || 30000,
  connectionTimeoutMillis: process.env.DB_POOL_CONNECTION_TIMEOUT || 30000,
  // Retry configuration
  retry: {
    retries: 3,
    factor: 2,
    minTimeout: 3000,
    maxTimeout: 30000,
  },
};

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL)
          ? false
          : { rejectUnauthorized: false },
        max: Number(process.env.DB_POOL_MAX || 10),
      }
    : dbConfig
);

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});
const db = drizzle(pool, {
  logger: process.env.DB_LOGGING === "true",
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("🚀 Database connected successfully!");
    client.release();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
};

// Run migrations
const runMigrations = async () => {
  try {
    await migrate(db, { migrationsFolder: "./src/db/migrations" });
    console.log("✅ Database migrations completed successfully");
  } catch (error) {
    console.error("❌ Database migrations failed:", error);
    throw error;
  }
};

// Initialize database
const initializeDatabase = async () => {
  const isConnected = await testConnection();
  if (!isConnected) return;
  const existing = await pool.query(`SELECT to_regclass('public.users') AS users_table`);
  if (existing.rows[0]?.users_table) {
    console.log("Database schema already present");
    return;
  }
  await runMigrations();
};

// Graceful shutdown handling
const closeConnection = async () => {
  console.log("🔴 Closing database connection...");
  await pool.end();
  console.log("✅ Database connection closed.");
};

process.on("SIGINT", async () => {
  await closeConnection();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closeConnection();
  process.exit(0);
});

module.exports = {
  db,
  pool,
  initializeDatabase,
};

