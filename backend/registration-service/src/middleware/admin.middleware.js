const jwt = require("jsonwebtoken");
const HttpException = require("../utils/HttpException.utils");

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"];

function requireAdmin(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token || !process.env.SECRET_JWT) {
      return next(new HttpException(401, "Sign in to continue."));
    }
    const decoded = jwt.verify(token, process.env.SECRET_JWT);
    if (!ADMIN_ROLES.includes(decoded.role)) {
      return next(new HttpException(403, "Admin access only."));
    }
    req.admin = {
      userId: Number(decoded.userId),
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch {
    next(new HttpException(401, "Sign in to continue."));
  }
}

module.exports = { requireAdmin, ADMIN_ROLES };
