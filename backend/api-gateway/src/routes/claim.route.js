/**
 * ---------------------------------
 * File: claim.ruote.js
 * Description:
 * This file contains routes related to claim data retrieval in the application. 
 * It defines the GET route for fetching claims, applying middleware for both 
 * authentication and optional caching.
 * 
 * - **GET /get**: Fetches claim data. This route is protected by authentication 
 *   middleware (`authMiddleware`), which ensures only authorized users can 
 *   access the claim data.
 * - Optionally, caching middleware (`cacheMiddleware`) can be applied to cache 
 *   responses for GET requests, improving performance by reducing redundant 
 *   database calls.
 * 
 * Author: Your Name
 * Created On: May-07-2025
 * Updated On: May-07-2025
 * 
 * Notes:
 * - The authentication middleware is required for access to the claim data.
 * - Caching functionality is available but currently commented out.
 * 
 * ---------------------------------
 */



const express = require("express");
const router = express.Router();
const { get } = require("../controllers/claim.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { cacheMiddleware } = require("../middleware/cache");

// Private routes
// router.get("/get", get);
router.get("/get", authMiddleware, get);
// router.get("/get", authMiddleware, cacheMiddleware(300), get);

module.exports = router;
