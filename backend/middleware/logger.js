/**
 * Request Logger Middleware
 * Logs incoming HTTP requests with method, route, and timestamp
 */

/**
 * Log incoming requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const requestLogger = (req, res, next) => {
  // Get current timestamp
  const timestamp = new Date().toISOString();
  
  // Get request method and URL
  const method = req.method;
  const url = req.originalUrl || req.url;
  
  // Get client IP
  const ip = req.ip || req.connection.remoteAddress;

  // Log request info
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

  // Capture response time
  const startTime = Date.now();

  // Override res.json to log response status
  const originalJson = res.json.bind(res);
  res.json = function (body) {
    const duration = Date.now() - startTime;
    console.log(`[${timestamp}] ${method} ${url} - Status: ${res.statusCode} - Duration: ${duration}ms`);
    return originalJson(body);
  };

  next();
};

/**
 * Detailed request logger with body
 * Logs request body for debugging (use cautiously in production)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const detailedLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl || req.url;

  console.log(`\n${'='.repeat(60)}`);
  console.log(`[${timestamp}] ${method} ${url}`);
  console.log(`IP: ${req.ip}`);
  console.log(`Headers:`, req.headers);
  
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`Body:`, req.body);
  }
  
  console.log(`${'='.repeat(60)}\n`);

  next();
};

/**
 * Error logger
 * Logs errors with stack trace
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const errorLogger = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  
  console.error(`\n${'!'.repeat(60)}`);
  console.error(`[${timestamp}] ERROR in ${req.method} ${req.url}`);
  console.error(`Message: ${err.message}`);
  console.error(`Stack: ${err.stack}`);
  console.error(`${'!'.repeat(60)}\n`);

  next(err);
};
