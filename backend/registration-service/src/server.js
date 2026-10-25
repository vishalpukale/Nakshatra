require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const HttpException = require("./utils/HttpException.utils");
const errorMiddleware = require("./middleware/error.middleware");
const registrationRouter = require("./routes/registration.route");
const logger = require("./utils/logger.utils");
const { initializeDatabase } = require("./config/database");
const { ensureRegistrationData } = require("./db/ensure");

const app = express();
const port = Number(process.env.PORT || 3335);
app.set("trust proxy", true);

// Security middleware
app.use(helmet());
app.use(cors());
app.options("*", cors());

// Configure custom logger middleware
app.use(logger.dev, logger.combined);

// Body parsing middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve static files
app.use(
  "/uploads",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "../uploads"))
);

// API Routes
app.use("/api/registration", registrationRouter);

app.get('/', (req, res) => {
  res.status(200).send('OK');
});

// Handle undefined routes
app.all("*", (req, res, next) => {
  next(new HttpException(404, "Endpoint Not Found"));
});

// Error middleware
app.use(errorMiddleware);

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();
    await ensureRegistrationData();
    app.listen(port, () =>
      console.log(`🚀 Registration Service running on http://localhost:${port}`)
    );
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down server...");
  process.exit();
});
process.on("SIGTERM", () => {
  console.log("Process terminated.");
  process.exit();
});

