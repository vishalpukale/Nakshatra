require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const HttpException = require("./utils/HttpException.utils");
const errorMiddleware = require("./middleware/error.middleware");
const claimRouter = require("./routes/claim.route");
const policyRouter = require("./routes/policy.route");
const logger = require("./utils/logger.utils");
const proxy = require("express-http-proxy");
const { cacheMiddleware } = require("./middleware/cache");
const authMiddleware = require("./middleware/auth.middleware");
const { connectRedis } = require("./config/redis");
const rabbitMQClient = require("./config/rabbitmq");

// Initialize Express app
const app = express();
const port = Number(process.env.PORT || 3330);
app.set("trust proxy", true);

// Load Swagger API Spec
const apiGatewaySwagger = YAML.load(
  path.join(__dirname, "swagger", "gateway.swagger.yaml")
);
const insuranceSwagger = YAML.load(
  path.join(__dirname, "swagger", "insurance.swagger.yaml")
);
const onboardingSwagger = YAML.load(
  path.join(__dirname, "swagger", "onboarding.swagger.yaml")
);
const authSwagger = YAML.load(
  path.join(__dirname, "swagger", "auth.swagger.yaml")
);
// const jobSwagger = YAML.load(
//   path.join(__dirname, "swagger", "jobs.swagger.yaml")
// );

// Combine Swagger Docs (you can adjust this depending on your needs)
const combinedSwagger = {
  openapi: "3.0.0",
  info: apiGatewaySwagger.info,
  servers: [
    ...apiGatewaySwagger.servers,
    ...authSwagger.servers,
    ...insuranceSwagger.servers,
    ...onboardingSwagger.servers,
    // ...jobSwagger.servers,
  ],
  paths: {
    ...apiGatewaySwagger.paths,
    ...authSwagger.paths,
    ...insuranceSwagger.paths,
    ...onboardingSwagger.paths,
    // ...jobSwagger.paths,
  },
  components: {
    ...apiGatewaySwagger.components,
    schemas: {
      ...apiGatewaySwagger.components.schemas,
      ...authSwagger.components.schemas,
      ...insuranceSwagger.components.schemas,
      ...onboardingSwagger.components.schemas,
      // ...jobSwagger.components.schemas,
    },
    securitySchemes: {
      ...apiGatewaySwagger.components.securitySchemes,
      ...authSwagger.components.securitySchemes,
      ...insuranceSwagger.components.securitySchemes,
      ...onboardingSwagger.components.securitySchemes,
      // ...jobSwagger.components.securitySchemes,
    },
  },
  security: [{ bearerAuth: [] }],
};
// Security middleware
app.use(helmet());
app.use(cors());
app.options("*", cors());

// Configure custom logger middleware
app.use(logger.dev, logger.combined);

// Body parsing middleware
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API Routes
app.use("/api/claim", claimRouter);
app.use("/api/policy", policyRouter);

// Proxy configuration using express-http-proxy
const API_AUTH_URL = process.env.API_AUTH_URL || "http://localhost:3001";

// const API_INSURANCE_URL =
//   process.env.API_INSURANCE_URL || "http://localhost:3002";
// const API_ONBOARDING_URL =
//   process.env.API_ONBOARDING_URL || "http://localhost:3003";

// const API_JOBS_URL =
//   process.env.API_JOBS_URL || "http://localhost:3004";

const API_REGISTRATION_URL =
  process.env.API_REGISTRATION_URL || "http://localhost:3002";

app.use(
  "/api/auth",
  proxy(API_AUTH_URL, {
    proxyReqPathResolver: (req) => req.originalUrl,
    limit: '50mb',
    parseReqBody: false,
  })
);

app.use(
  "/api/master",
  proxy(API_AUTH_URL, {
    proxyReqPathResolver: (req) => req.originalUrl,
    limit: '50mb',
    parseReqBody: false,
  })
);
// app.use(
//   "/api/claim",
//   authMiddleware,
//   proxy(API_INSURANCE_URL, {
//     proxyReqPathResolver: (req) => req.originalUrl,
//     limit: '50mb',
//     parseReqBody: false,
//   })
// );
// app.use(
//   "/api/onboarding",
//   // authMiddleware,
//   proxy(API_ONBOARDING_URL, {
//     proxyReqPathResolver: (req) => req.originalUrl,
//     limit: '50mb',
//     parseReqBody: false,
//   })
// );
// app.use(
//   "/api/admin",
//   authMiddleware,
//   proxy(API_ONBOARDING_URL, {
//     proxyReqPathResolver: (req) => req.originalUrl,
//     limit: '50mb',
//     parseReqBody: false,
//   })
// );

// app.use(
//   "/api/agent",
//   authMiddleware,
//   proxy(API_ONBOARDING_URL, {
//     proxyReqPathResolver: (req) => req.originalUrl,
//     limit: '50mb',
//     parseReqBody: false,
//   })
// );
// app.use(
//   "/api/client",
//   authMiddleware,
//   proxy(API_ONBOARDING_URL, {
//     proxyReqPathResolver: (req) => req.originalUrl,
//     limit: '50mb',
//     parseReqBody: false,
//   })
// );
// app.use(
//   "/api/compliance",
//   authMiddleware,
//   proxy(API_ONBOARDING_URL, {
//     proxyReqPathResolver: (req) => req.originalUrl,
//     limit: '50mb',
//     parseReqBody: false,
//   })
// );

// app.use(
//   "/api/contracting",
//   authMiddleware,
//   proxy(API_ONBOARDING_URL, {
//     proxyReqPathResolver: (req) => req.originalUrl,
//     limit: '50mb',
//     parseReqBody: false,
//   })
// );


// app.use(
//   "/api/commission",
//   authMiddleware,
//   proxy(API_ONBOARDING_URL, {
//     proxyReqPathResolver: (req) => req.originalUrl,
//     limit: '50mb',
//     parseReqBody: false,
//   })
// );

// app.use(
//   "/api/training/webhook",
//   proxy(API_JOBS_URL, {
//     proxyReqPathResolver: (req) => req.originalUrl,
//     limit: '50mb',
//     parseReqBody: false,
//   })
// );

// app.use(
//   "/api/training",
//   authMiddleware,
//   proxy(API_ONBOARDING_URL, {
//     proxyReqPathResolver: (req) => req.originalUrl,
//     limit: '50mb',
//     parseReqBody: false,
//   })
// );



// app.use(
//   "/api/jobs",
//   authMiddleware,
//   proxy(API_JOBS_URL, {
//     proxyReqPathResolver: (req) => req.originalUrl,
//     limit: '50mb', 
//     parseReqBody: false, 
//   })
// ); 
// app.use(
//   "/uploads/carrier_images",
//   proxy(API_ONBOARDING_URL, {
//     proxyReqPathResolver: (req) => req.originalUrl,
//     limit: '50mb',
//     parseReqBody: false,
//   })
// );

// app.use(
//   "/uploads/certificates",
//   proxy(API_ONBOARDING_URL, {
//     proxyReqPathResolver: (req) => req.originalUrl,
//     limit: '50mb',
//     parseReqBody: false,
//   })
// );
// app.use(
//   "/uploads/signed_documents",
//   proxy(API_ONBOARDING_URL, {
//     proxyReqPathResolver: (req) => req.originalUrl,
//     limit: '50mb',
//     parseReqBody: false,
//   })
// );
// app.use(
//   "/uploads/onboarding_documents",
//   proxy(API_ONBOARDING_URL, {
//     proxyReqPathResolver: (req) => req.originalUrl,
//     limit: '50mb',
//     parseReqBody: false,
//   })
// );

// app.use(
//   "/uploads/EO_documents",
//   proxy(API_ONBOARDING_URL, {
//     proxyReqPathResolver: (req) => req.originalUrl,
//     limit: '50mb',
//     parseReqBody: false,
//   })
// );

// app.use(
//   "/uploads/license_documents",
//   proxy(API_ONBOARDING_URL, {
//     proxyReqPathResolver: (req) => req.originalUrl,
//     limit: '50mb',
//     parseReqBody: false,
//   })
// );
// app.use(
//   "/uploads/advertise_images",
//   proxy(API_AUTH_URL, {
//     proxyReqPathResolver: (req) => req.originalUrl,
//     limit: '50mb',
//     parseReqBody: false,
//   })
// );

app.use(
  "/uploads/log",
  proxy(API_AUTH_URL, {
    proxyReqPathResolver: (req) => req.originalUrl,
    limit: '50mb',
    parseReqBody: false,
  })
);


app.use(
  "/uploads",
  proxy(API_AUTH_URL, {
    proxyReqPathResolver: (req) => req.originalUrl,
    limit: '50mb',
    parseReqBody: false,
  })
);

// Registration Service Proxy
app.use(
  "/api/registration",
  proxy(API_REGISTRATION_URL, {
    proxyReqPathResolver: (req) => req.originalUrl,
    limit: '50mb',
    parseReqBody: false,
  })
);

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(combinedSwagger));

// Handle undefined routes
app.all("*", (req, res, next) => {
  next(new HttpException(404, "Endpoint Not Found"));
});

// Error middleware
app.use(errorMiddleware);

// Initialize database and start server
const startServer = async () => {
  try {
    // await connectRedis();
    await rabbitMQClient.connect(); // Initialize RabbitMQ connection
    app.listen(port, () =>
    logger.logger.info(`🚀 Server running on http://localhost:${port}`)
    );
  } catch (error) {
    logger.logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on("SIGINT", () => {
   logger.logger.info("Shutting down server...");
  process.exit();
});
process.on("SIGTERM", () => {
  logger.logger.info("Process terminated.");
  process.exit();
});
