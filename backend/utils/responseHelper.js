/**
 * Response Helper Utilities
 * Standardized success and error response formats
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {*} data - Response data
 * @returns {Object} - JSON response
 */
export const successResponse = (res, statusCode = 200, message = 'Success', data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {*} error - Error details
 * @returns {Object} - JSON response
 */
export const errorResponse = (res, statusCode = 500, message = 'Error', error = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: error || message,
    timestamp: new Date().toISOString()
  });
};

/**
 * Send validation error response
 * @param {Object} res - Express response object
 * @param {Array|string} errors - Validation errors
 * @returns {Object} - JSON response
 */
export const validationErrorResponse = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: 'Validation Error',
    errors: Array.isArray(errors) ? errors : [errors],
    timestamp: new Date().toISOString()
  });
};

/**
 * Send not found response
 * @param {Object} res - Express response object
 * @param {string} resource - Resource name
 * @returns {Object} - JSON response
 */
export const notFoundResponse = (res, resource = 'Resource') => {
  return res.status(404).json({
    success: false,
    message: `${resource} not found`,
    timestamp: new Date().toISOString()
  });
};

/**
 * Send unauthorized response
 * @param {Object} res - Express response object
 * @param {string} message - Custom message
 * @returns {Object} - JSON response
 */
export const unauthorizedResponse = (res, message = 'Unauthorized access') => {
  return res.status(401).json({
    success: false,
    message,
    timestamp: new Date().toISOString()
  });
};

/**
 * Send created response
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {*} data - Created resource data
 * @returns {Object} - JSON response
 */
export const createdResponse = (res, message = 'Resource created successfully', data = null) => {
  return res.status(201).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};
