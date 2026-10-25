/**
 * ---------------------------------
 * File: token-generator.utils.js
 * Description:
 * This class provides functionality for generating, signing, and refreshing JWTs (JSON Web Tokens).
 * It can be used to securely create and manage tokens for authentication and authorization purposes.
 *  
 * Methods:
 * - `sign(payload, signOptions)`: Signs a payload and returns a JWT.
 * - `refresh(token, refreshOptions)`: Refreshes an existing token by verifying and re-signing it, optionally with new options.
 * 
 * Dependencies:
 * - `jsonwebtoken`: A library for signing, verifying, and decoding JWTs.
 * 
 * Author: Rameshware Marbate
 * Created On: May-07-2025
 * Updated On: May-07-2025
 * 
 * Notes:
 * - The constructor requires a `secretOrPrivateKey` for signing tokens, and optionally, a `secretOrPublicKey` for verification.
 * - The refresh method allows modifying the payload while retaining the token's essential properties.
 * ---------------------------------
 */



const jwt = require("jsonwebtoken");
const { logger } = require("./logger.utils");

class TokenGenerator {
   /**
   * Constructor for TokenGenerator class.
   * @param {string} secretOrPrivateKey - The key used to sign the JWT. This is required.
   * @param {string} [secretOrPublicKey] - The key used for verification. Default is the same as the signing key (for symmetric encryption).
   * @param {Object} [options={}] - Optional JWT options like expiration.
   */
  constructor(secretOrPrivateKey, secretOrPublicKey, options = {}) {
    if (!secretOrPrivateKey) {
      throw new Error("Secret key for signing is required.");
    }
    this.secretOrPrivateKey = secretOrPrivateKey;
    this.secretOrPublicKey = secretOrPublicKey || secretOrPrivateKey; // Allow same key for symmetric encryption
    this.options = { expiresIn: "1h", ...options }; // Default to 1 hour expiry
  }

   /**
   * Signs a payload and generates a JWT token.
   * @param {Object} payload - The payload (data) to be encoded into the token.
   * @param {Object} [signOptions={}] - Optional sign options (e.g., audience, issuer).
   * @returns {string} The signed JWT token.
   */
  sign(payload, signOptions = {}) {
    const jwtSignOptions = { ...this.options, ...signOptions };
    return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
  }

  /**
   * Refreshes an expired JWT token by verifying it and creating a new token.
   * @param {string} token - The expired JWT token.
   * @param {Object} [refreshOptions={}] - Options for refreshing, such as verification options.
   * @returns {string} The new signed JWT token.
   * @throws {Error} Throws an error if the token is invalid or expired.
   */
  refresh(token, refreshOptions = {}) {
    try {
      const payload = jwt.verify(token, this.secretOrPublicKey, refreshOptions.verify || {});
      const newPayload = { ...payload }; // Allow modifications if needed

      delete newPayload.iat;
      delete newPayload.exp;
      delete newPayload.nbf;
      delete newPayload.jti;

      const jwtSignOptions = { ...this.options, jwtid: refreshOptions.jwtid };
      return jwt.sign(newPayload, this.secretOrPrivateKey, jwtSignOptions);
    } catch (error) {
      logger.error("JWT refresh error:", error.message);
      throw new Error("Invalid or expired token.");
    }
  }
}

module.exports = TokenGenerator;
