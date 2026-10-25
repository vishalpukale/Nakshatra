const HttpException = require("../utils/HttpException.utils");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

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
      console.error("❌ JWT Secret Key is missing in environment variables!");
      return next(new HttpException(500, "Internal Server Error"));
    }

    const decoded = jwt.verify(token, secretKey);

    // Validate required fields in token
    if (!decoded.userId || !decoded.email) {
      return next(new HttpException(401, "Invalid token format"));
    }

    // Validate field types
    if (
      typeof decoded.userId !== "number" ||
      typeof decoded.email !== "string"
    ) {
      return next(new HttpException(401, "Invalid token data types"));
    }


    // Attach user information to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error.message);

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

