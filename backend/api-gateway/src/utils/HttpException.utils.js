/**
 * ---------------------------------
 * File: HttpException.utils.js
 * Description:
 * This file defines a custom error class, `HttpException`, which extends the built-in `Error` class.
 * The `HttpException` class is designed to handle HTTP exceptions in an Express application.
 * It allows you to structure error responses with a status code, message, and optional additional data,
 * making it easier to manage and return consistent error information from API endpoints.
 * 
 * Author: Rameshware Marbate
 * Created On: May-07-2025
 * Updated On: May-07-2025
 * 
 * Notes:
 * - This class is useful for generating structured error responses in an API, which can then be caught and
 *   returned in a standardized format by middleware or error-handling functions.
 * - It can be used in combination with Express error-handling middleware for consistent API error responses.
 * ---------------------------------
 */


class HttpException extends Error {
    /**
     * Constructs a new HttpException instance.
     * 
     * @param {number} status - The HTTP status code for the error (e.g., 404, 500).
     * @param {string} message - A descriptive message about the error.
     * @param {object|string} data - Any additional data you want to attach to the error (e.g., error details).
     */
    constructor(status = 500, message = "Something went wrong", data = {}) {
        super(message);
        this.name = "HttpException";
        this.status = status;
        this.data = typeof data === "object" ? data : { message: data };

        // Capture stack trace (excluding constructor)
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = HttpException;
