/**
 * Authentication Middleware
 * JWT token verification (placeholder implementation)
 */

import jwt from 'jsonwebtoken';
import { unauthorizedResponse, errorResponse } from '../utils/responseHelper.js';

/**
 * Verify JWT token from request headers
 * This is a placeholder implementation for demonstration
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const authenticateToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    // If no token provided
    if (!token) {
      return unauthorizedResponse(res, 'Access token required');
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return unauthorizedResponse(res, 'Invalid or expired token');
      }

      // Attach user to request
      req.user = user;
      next();
    });
  } catch (error) {
    return errorResponse(res, 500, 'Authentication error', error.message);
  }
};

/**
 * Generate JWT token
 * Helper function to create tokens
 * @param {Object} payload - Token payload
 * @param {string} expiresIn - Expiration time
 * @returns {string} - JWT token
 */
export const generateToken = (payload, expiresIn = process.env.JWT_EXPIRE || '7d') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Optional authentication middleware
 * Verifies token if present, but doesn't block if absent
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (!err) {
          req.user = user;
        }
      });
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};
