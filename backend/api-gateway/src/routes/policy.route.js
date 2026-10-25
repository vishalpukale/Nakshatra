/**
 * ---------------------------------
 * File: Policy.route.js
 * Description:
 * This file defines the routes related to fetching policy data in the application. 
 * It specifies the GET route for retrieving policies and applies necessary 
 * middleware for authentication and caching (optional).
 * 
 * - **GET /get**: Retrieves all policy data. This route is protected by authentication 
 *   middleware (`authMiddleware`), ensuring only authorized users can access it.
 * - Optionally, caching middleware (`cacheMiddleware`) can be applied to cache 
 *   the response for GET requests, reducing unnecessary repeated calls to the data source.
 * 
 * Author: Your Name
 * Created On: May-07-2025
 * Updated On: May-07-2025
 * 
 * Notes:
 * - The authentication middleware is mandatory for accessing policy data.
 * - Caching functionality is available but currently commented out for possible future use.
 * 
 * ---------------------------------
 */


const express = require("express");
const router = express.Router();
const { get } = require("../controllers/policy.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { cacheMiddleware } = require("../middleware/cache");

// Private routes
router.get("/get", authMiddleware, get);
// router.get("/get", authMiddleware, cacheMiddleware(300), get);
module.exports = router;
