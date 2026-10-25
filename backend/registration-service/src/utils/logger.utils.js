/**
 * ---------------------------------
 * File: logger.utils.js
 * Description:
 * This file configures and exports logging mechanisms using `morgan` and `winston` for an Express application.
 * It handles both HTTP access logs and application-level logs (info, errors).
 * - `morgan` is used for logging HTTP requests and responses.
 * - `winston` is used for logging application events with rotating log files for error and combined logs.
 * 
 * Enhanced Features:
 * - Standardized logging format: api-functionName
 * - Service-specific log files with timestamps
 * - Comprehensive error logging with stack traces
 * - Request context logging
 * 
 * Author: Rameshware Marbate
 * Created On: May-07-2025
 * Updated On: May-07-2025
 * 
 * Notes:
 * - The log directory is created if it does not already exist.
 * - Logs are saved to a directory named `log` located two levels above the current file's directory.
 * - The logging setup includes:
 *     - `dev`: Logs in the 'dev' format for development.
 *     - `combined`: Logs all HTTP requests to rotating files.
 *     - `logger`: A custom Winston logger for combined and error-level logs.
 * ---------------------------------
 */

const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const path = require('path');
const fs = require('fs');
const winston = require("winston");
require("winston-daily-rotate-file");

// Service name for logging
const SERVICE_NAME = 'registration-service';

// log directory path
const logDirectory = path.resolve(__dirname, '../../uploads/log');
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory, { recursive: true });

// create a rotating write stream
const accessLogStream = rfs.createStream(`${SERVICE_NAME}_access.log`, {
    interval: '1d',
    path: logDirectory
})

// Create a rotating transport for errors
const errorTransport = new winston.transports.DailyRotateFile({
    filename: path.join(logDirectory, `${SERVICE_NAME}_error-%DATE%.log`),
    datePattern: "YYYY-MM-DD",
    maxFiles: "30d", // Keep logs for 30 days
    level: "error",
});

// Create a rotating transport for combined logs (including info & errors)
const combinedTransport = new winston.transports.DailyRotateFile({
    filename: path.join(logDirectory, `${SERVICE_NAME}_combined-%DATE%.log`),
    datePattern: "YYYY-MM-DD",
    maxFiles: "30d",
});

// Create Winston logger
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.printf(({ timestamp, level, message, stack, functionName }) => {
            const prefix = functionName ? `api-${functionName}` : 'api-registration';
            const stackTrace = stack ? `\nStack: ${stack}` : '';
            return `${timestamp} [${level.toUpperCase()}] ${prefix}: ${message}${stackTrace}`;
        })
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        combinedTransport, // Save all logs
        errorTransport, // Save errors separately
    ],
});

/**
 * Enhanced logger with function name context
 * @param {string} functionName - The name of the function being logged
 * @returns {Object} Logger object with context
 */
const createFunctionLogger = (functionName) => {
    return {
        info: (message, meta = {}) => {
            logger.info(message, { functionName, ...meta });
        },
        error: (message, error = null, meta = {}) => {
            const errorInfo = error ? {
                message: error.message,
                stack: error.stack,
                ...meta
            } : meta;
            logger.error(message, { functionName, ...errorInfo });
        },
        warn: (message, meta = {}) => {
            logger.warn(message, { functionName, ...meta });
        },
        debug: (message, meta = {}) => {
            logger.debug(message, { functionName, ...meta });
        }
    };
};

/**
 * Standardized error logging for controllers
 * @param {string} functionName - The name of the controller function
 * @param {Error} error - The error object
 * @param {Object} req - Express request object (optional)
 * @param {Object} meta - Additional metadata
 */
const logError = (functionName, error, req = null, meta = {}) => {
    const requestInfo = req ? {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: req.user?.id || req.body?.id || req.query?.id,
        ...meta
    } : meta;

    logger.error(`Error in ${functionName}`, error, { functionName, ...requestInfo });
};

module.exports = {
    dev: morgan('dev'),
    combined: morgan('combined', { stream: accessLogStream }),
    logger,
    createFunctionLogger,
    logError,
    SERVICE_NAME
}

