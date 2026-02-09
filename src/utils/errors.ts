import { i18n } from '../config/i18n/i18n';

/**
 * Custom error class to handle errors
 * It will be caught by the error handler middleware at the app.ts
 */
export class CustomError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode || 500;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Custom error class to handle 400 errors
 * It will be caught by the error handler middleware at the app.ts
 */
export class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message, 400);
  }
}

/**
 * Custom error class to handle 404 errors
 * It will be caught by the error handler middleware at the app.ts
 */
export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, 404);
  }
}

/**
 * Custom error class to handle 500 errors
 * It will be caught by the error handler middleware at the app.ts
 */
export class UnExpectedError extends CustomError {
  constructor(error: string) {
    super(error || i18n.t('errors.unexpected'), 500);
  }
}

/**
 * Custom error class to handle 403 errors
 * It will be caught by the error handler middleware at the app.ts
 */
export class ForbiddenError extends CustomError {
  constructor(message: string) {
    super(message, 403);
  }
}

/**
 * Custom error class to handle 401 errors
 * It will be catched by the error handler middleware at the app.ts
 */
export class UnAuthorizedError extends CustomError {
  constructor(message: string) {
    super(message, 401);
  }
}
