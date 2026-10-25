/**
 * ---------------------------------
 * File: error.middleware.js
 * Description:
 * Custom error-handling middleware that catches errors, logs them with appropriate details, 
 * and sends a structured response to the client. The response varies based on the environment 
 * (development or production), providing more detailed logs in development.
 * 
 * Author: Rameshware Marbate
 * Created On: May-07-2025
 * Updated On: May-07-2025
 * 
 * Notes:
 * - Catches errors thrown by any part of the application.
 * - Logs errors with full stack trace in development and limited info in production.
 * - Ensures that a valid HTTP status code is used (default to 500 if invalid).
 * - Provides a standardized error response with status, message, and optional data.
 * - Logs the error using the `logger` utility for further tracking.
 * ---------------------------------
 */


const { logger } = require("../utils/logger.utils");
/**
 * Error handling middleware for Express.js.
 * - Ensures that valid HTTP status codes are used.
 * - Logs error details for both development (full stack trace) and production (without stack trace).
 * - Returns a structured error response with status, message, and optional data.
 * - The `data` field is optional but ensures the client can access error details if available.
 *
 * @module middleware/errorMiddleware
 * 
 * @param {Object} error - The error object, typically passed from an earlier middleware or route handler.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object used to return the error.
 * @param {Function} next - The next middleware function (not used in this case).
 */
function errorMiddleware(error, req, res, next) {
  let { status, message, data } = error;
  status = Number.isInteger(status) && status >= 100 && status < 600 ? status : 500;
  if (process.env.NODE_ENV !== "production") {
    logger.error(`[❌ ERROR] ${status} - ${message}\n`, error.stack);
  } else {
    logger.error(`[❌ ERROR] ${status} - ${message}`);
  }
  message = status === 500 ? "Internal server error" : message || "Something went wrong";
  logger.error(`${req.method} ${req.originalUrl} ${status || 500} - ${message}`);

  res.status(status).json({
    type: "error",
    status,
    message,
    data: data || null,
  });
}

module.exports = errorMiddleware;
