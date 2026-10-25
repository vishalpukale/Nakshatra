/**
 * ---------------------------------
 * File: claim.controller.js
 * Description:
 * This file handles claim-related operations through the API Gateway.
 * It communicates with the RabbitMQ service to fetch claim data and
 * provides proper error handling and logging.
 * 
 * Dependencies:
 * - `rabbitMQClient`: A client used for communication with RabbitMQ.
 * - `logger`: Enhanced logging utility with function context.
 * 
 * Author: Your Name
 * Created On: May-07-2025
 * Updated On: May-07-2025
 * 
 * Notes:
 * - Uses enhanced logging with api-functionName format
 * - Provides comprehensive error handling and logging
 * - Logs request context and error details
 * 
 * ---------------------------------
 */

const rabbitMQClient = require("../config/rabbitmq");
const { logError, createFunctionLogger } = require("../utils/logger.utils");

// Create function-specific logger
const logger = createFunctionLogger('getAllClaims');

/**
 * Handles fetching all claims.
 * - Sends a request to the RabbitMQ "claim" queue to fetch claims data.
 * - Waits for the response from the RabbitMQ service.
 * - Returns the response to the client or an error if the request fails.
 *
 * @param {Object} req - Express request object containing query parameters.
 * @param {Object} res - Express response object used to return the claims data or error.
 */
const get = async (req, res) => {
  try {
    logger.info('Fetching claims', { 
      query: req.query,
      method: req.method,
      url: req.url 
    });

    const response = await rabbitMQClient.sendRequestAndWaitResponse("claim", {
      action: "getAllClaims",
      body: req.query,
    });

    logger.info('Claims fetched successfully', { 
      responseStatus: response?.status,
      recordCount: response?.data?.length || 0 
    });

    res.json(response);
  } catch (error) {
    logError('getAllClaims', error, req, {
      action: "getAllClaims",
      queue: "claim"
    });
    
    res.status(500).json({ 
      success: false,
      message: "Error fetching claims",
      error: "Internal Server Error" 
    });
  }
};

module.exports = {
  get,
};
