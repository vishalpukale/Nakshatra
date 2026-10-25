/**
 * ---------------------------------
 * File: policy.controller.js
 * Description:
 * This file handles policy-related operations through the API Gateway.
 * It communicates with the RabbitMQ service to fetch policy data and
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
const logger = createFunctionLogger('getAllPolicy');

/**
 * Handles fetching all policies.
 * - Sends a request to the RabbitMQ "policy-requests" queue to fetch policies data.
 * - Waits for the response from the RabbitMQ service.
 * - Returns the response to the client or an error if the request fails.
 *
 * @param {Object} req - Express request object containing request body with filter data.
 * @param {Object} res - Express response object used to return the policies data or error.
 */
const get = async (req, res) => {
  try {
    logger.info('Fetching policies', { 
      body: req.body,
      method: req.method,
      url: req.url 
    });

    const response = await rabbitMQClient.sendRequestAndWaitResponse(
      "policy-requests",
      {
        action: "getAllPolicy",
        data: req.body,
      }
    );

    logger.info('Policies fetched successfully', { 
      responseStatus: response?.status,
      recordCount: response?.data?.length || 0 
    });

    res.json(response);
  } catch (error) {
    logError('getAllPolicy', error, req, {
      action: "getAllPolicy",
      queue: "policy-requests"
    });
    
    res.status(500).json({ 
      success: false,
      message: "Error fetching policies",
      error: "Internal Server Error" 
    });
  }
};

module.exports = {
  get,
};
