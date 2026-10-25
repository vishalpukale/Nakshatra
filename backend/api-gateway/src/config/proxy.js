/**
 * ---------------------------------
 * File: proxy.js
 * Description:
 * This file sets up a proxy middleware for routing and forwarding requests to external services.
 * It defines routes for the "Claim" and "Policy" services and handles various aspects of the 
 * proxy including request forwarding, error handling, response parsing, and path rewriting.
 * 
 * - **Route Definition**: Specifies which routes should be proxied and defines whether the route should use caching.
 * 
 * Dependencies:
 * - `http-proxy-middleware`: A library to create a proxy middleware that intercepts requests and forwards them to other servers.
 * 
 * Author: Rameshware Marbate
 * Created On: May-07-2025
 * Updated On: May-07-2025
 * 
 * Notes:
 * - The `SERVICE_URLS` object defines the base URLs for the external services.
 * - The proxy middleware for each service (Claim and Policy) handles request forwarding and response handling.
 * - Error responses are customized based on the status code and the response body.
 * ---------------------------------
 */


const { createProxyMiddleware } = require("http-proxy-middleware");

// Service URLs
const SERVICE_URLS = {
  CLAIM: "http://localhost:3001",
  POLICY: "http://localhost:3003",
};

// Common response handling function
// This function handles the response from the proxy, parsing the response body, 
// handling errors, and sending an appropriate response to the client.
const handleResponse = (proxyRes, req, res) => {
  let body = "";
  proxyRes.on("data", (chunk) => {
    body += chunk;
  });

  proxyRes.on("end", () => {
    try {
      const response = JSON.parse(body);

      // Handle different status codes
      if (proxyRes.statusCode >= 400) {
        res.status(proxyRes.statusCode).json({
          message: response.message || "Error occurred",
          error: response.error || "Unknown error",
          statusCode: proxyRes.statusCode,
        });
      } else {
        res.status(proxyRes.statusCode).json(response);
      }
    } catch (error) {
      res.status(500).json({
        message: "Error parsing response",
        error: error.message,
      });
    }
  });
};

// Proxy configuration for the Claim service
// This configures the proxy for requests to the claim service, including handling request/response data 
// and error scenarios. It rewrites the path and forwards the body when necessary.
const proxyConfig = {
  // Claim service proxy
  claim: createProxyMiddleware({
    target: SERVICE_URLS.CLAIM,
    changeOrigin: true,
    pathRewrite: {
      "^/api/claim": "",
    },
    onProxyReq: (proxyReq, req, res) => {
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    onProxyRes: handleResponse,
    onError: (err, req, res) => {
      res.status(500).json({
        message: "Proxy Error",
        error: err.message,
      });
    },
  }),

  // Policy service proxy
  policy: createProxyMiddleware({
    target: SERVICE_URLS.POLICY,
    changeOrigin: true,
    pathRewrite: {
      "^/api/policy": "",
    },
    onProxyReq: (proxyReq, req, res) => {
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    onProxyRes: handleResponse,
    onError: (err, req, res) => {
      res.status(500).json({
        message: "Proxy Error",
        error: err.message,
      });
    },
  }),
};

// Route configuration
// This array defines the different routes that should be proxied, including 
// the service to proxy to and the cache behavior for each route.
const routes = [
  {
    path: "/api/claim/create",
    proxy: "claim",
    cache: false, // Don't cache auth requests
  },
  {
    path: "/api/policy/create",
    proxy: "policy",
    cache: false,
  },
];
module.exports = {
  proxyConfig,
  routes,
};
