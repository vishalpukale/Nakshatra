/**
 * ---------------------------------
 * File: awaitHandlerFactory.middleware.js
 * Description:
 * Utility functions for handling encryption and decryption using AES with a secret key.
 * Also includes a middleware handler that supports asynchronous operations, ensures the encryption key is available, 
 * and handles errors gracefully.
 * 
 * Author: Rameshware Marbate
 * Created On: May-07-2025
 * Updated On: May-07-2025
 * 
 * Notes:
 * - `awaitHandlerFactory` wraps a middleware function to handle async operations and ensure the encryption key is set.
 * - `encrypt` function uses AES encryption to secure data with the provided key.
 * - `decrypt` function decrypts AES-encrypted data back into a JSON object using the provided key.
 * - Encryption and decryption operations use the `SECRET_CRYPTO` environment variable.
 * - Error handling is implemented to catch decryption failures or missing keys.
 * ---------------------------------
 */


const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const { logger } = require("../utils/logger.utils");


/**
 * Wraps middleware functions to handle errors and perform encryption/decryption tasks.
 * 
 * @param {Function} middleware - The middleware function to be wrapped.
 * @returns {Function} - A new middleware function that handles errors and async operations.
 */
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

/**
 * Encrypts the provided data using AES encryption and a given key.
 * 
 * @param {Object} data - The data to be encrypted.
 * @param {string} key - The key to use for encryption.
 * @returns {string} - The encrypted data as a string.
 */
const encrypt = (data, key) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

/**
 * Decrypts the provided encrypted data using AES decryption and a given key.
 * 
 * @param {string} encryptedData - The encrypted data to decrypt.
 * @param {string} key - The key to use for decryption.
 * @returns {Object} - The decrypted data.
 * @throws {Object} - Throws an error if decryption fails.
 */
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
