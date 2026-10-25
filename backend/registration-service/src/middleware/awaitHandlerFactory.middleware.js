const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const { logger } = require("../utils/logger.utils");

const awaitHandlerFactory = (middleware) => {
  return async (req, res, next) => {
    try {
      const key = process.env.SECRET_CRYPTO;

      if (!key) {
        throw { status: 500, message: "Encryption key is missing" };
      }

      // if (req.body?.data) {
      //   req.body = decrypt(req.body.data, key);
      // }

      await middleware(req, res, next);
    } catch (err) {
      console.error("[❌ ERROR] Await Handler:", err);
      logger.error(`${req.method} ${req.originalUrl} ${err.status || 500} - ${err.message}`);
      next(err);
    }
  };
};

const encrypt = (data, key) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

const decrypt = (encryptedData, key) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(decryptedText);
  } catch (error) {
    throw { status: 400, message: "Invalid encrypted data" };
  }
};

module.exports = awaitHandlerFactory;

