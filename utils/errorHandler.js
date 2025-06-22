/**
 * Global error handler middleware
 * Handles different types of errors and sends appropriate responses
 */
const errorHandler = (err, req, res, next) => {
  // Log the error for debugging (in production, you might want to use a proper logging service)
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  // Default error status and message
  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific types of errors
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Invalid input data';
  } else if (err.name === 'UnauthorizedError') {
    status = 401;
    message = 'Unauthorized access';
  } else if (err.name === 'NotFoundError') {
    status = 404;
    message = 'Resource not found';
  }

  // Send error response
  res.status(status).json({
    error: {
      message,
      // Only include stack trace in development
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      status,
      path: req.path,
      timestamp: new Date().toISOString()
    }
  });
};

// Custom error classes
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

module.exports = {
  errorHandler,
  ValidationError,
  UnauthorizedError,
  NotFoundError
};
