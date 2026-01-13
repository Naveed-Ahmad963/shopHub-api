// src/utils/errorHandler.js
// ============================================
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404);
  }
}

export class AuthenticationError extends AppError {
  constructor(message) {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message) {
    super(message, 403);
  }
}

export const handleAsyncErrors = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
