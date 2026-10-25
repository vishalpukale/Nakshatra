/**
/**
 * ---------------------------------
 * File: auth.middleware.js
 * Description:
 * Middleware to authenticate users via JWT. It checks for a valid JWT token 
 * in the `Authorization` header, decodes it, and attaches user data to the request. 
 * If the token is missing or invalid, it returns an appropriate error response.
 * 
 * Author: Rameshware Marbate
 * Created On: May-07-2025
 * Updated On: May-07-2025
 * 
 * Notes:
 * - Expects a JWT token in the `Authorization` header, prefixed with `Bearer`.
 * - If valid, the token's user data (userId, email, userAccess) is attached to the request.
 * - Handles JWT errors like token expiry, invalid token, and missing secret key.
 * - The `SECRET_JWT` environment variable must be set.
 * ---------------------------------
 */

const HttpException = require("../utils/HttpException.utils");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { logger } = require("../utils/logger.utils");

dotenv.config();


/**
 * Middleware to authenticate and authorize API requests.
 * - Checks if a valid JWT token is provided in the Authorization header.
 * - Verifies the token using the secret key from environment variables.
 * - Validates the token's fields and user type (Agent for onboarding).
 * - Attaches user information (userId and email) to the request object for further use.
 * - Handles different JWT errors and sends appropriate responses.
 * 
 * @param {Object} req - Express request object containing the Authorization header.
 * @param {Object} res - Express response object used to send responses.
 * @param {Function} next - Express next middleware function to pass control to the next middleware.
 */
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const bearer = "Bearer ";

    if (!authHeader || !authHeader.startsWith(bearer)) {
      return next(
        new HttpException(401, "Access denied. No credentials sent!")
      );
    }

    const token = authHeader.replace(bearer, "");
    const secretKey = process.env.SECRET_JWT;

    if (!secretKey) {
      logger.error("❌ JWT Secret Key is missing in environment variables!");
      return next(new HttpException(500, "Internal Server Error"));
    }

    const decoded = jwt.verify(token, secretKey);

    // Validate required fields in token
    if (!decoded.userId || !decoded.email) {
      return next(new HttpException(401, "Invalid token format"));
    }

    // Validate whether user type is Agent
    if (req.baseUrl.includes("onboarding")) {
      if (decoded.userTypeId !== 1) {
        return next(new HttpException(401, "Access denied. No credentials sent!"));
      }
    }

    // Validate field types
    if (
      typeof decoded.userId !== "number" ||
      typeof decoded.email !== "string"
    ) {
      return next(new HttpException(401, "Invalid token data types"));
    }

    // Validate role
    const validRoles = ["admin", "superadmin", "agent"];

    // Attach user information to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    logger.error("❌ Auth Middleware Error:", error.message);

    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return next(new HttpException(401, "Token has expired"));
    }
    if (error.name === "JsonWebTokenError") {
      return next(new HttpException(401, "Invalid token"));
    }
    if (error.name === "NotBeforeError") {
      return next(new HttpException(401, "Token not active"));
    }

    // Handle other errors
    return next(new HttpException(401, "Authentication failed"));
  }
};

module.exports = auth;
