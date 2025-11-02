/**
 * Security-Focused Error Handling
 * Prevents information leakage while maintaining useful error messages
 */

/**
 * Application Error Types
 */
export enum ErrorType {
  VALIDATION = "VALIDATION",
  AUTHENTICATION = "AUTHENTICATION",
  AUTHORIZATION = "AUTHORIZATION",
  RATE_LIMIT = "RATE_LIMIT",
  NOT_FOUND = "NOT_FOUND",
  INTERNAL = "INTERNAL",
  BAD_REQUEST = "BAD_REQUEST",
}

export class AppError extends Error {
  constructor(
    public type: ErrorType,
    public message: string,
    public statusCode: number = 500,
    public publicMessage?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * Create a safe error response
 * Logs full error server-side but returns safe message to client
 */
export function createErrorResponse(
  error: unknown,
  defaultMessage: string = "An error occurred"
): {
  message: string;
  statusCode: number;
  logMessage?: string;
} {
  // Log the full error server-side (but don't expose it)
  if (error instanceof AppError) {
    console.error(`[${error.type}] ${error.message}`);
    return {
      message: error.publicMessage || error.message,
      statusCode: error.statusCode,
      logMessage: error.message,
    };
  }

  if (error instanceof Error) {
    // Log full error server-side
    console.error("Error:", error.message, error.stack);
    
    // Return safe message to client
    return {
      message: defaultMessage,
      statusCode: 500,
      logMessage: error.message,
    };
  }

  // Unknown error type
  console.error("Unknown error:", error);
  return {
    message: defaultMessage,
    statusCode: 500,
  };
}

/**
 * Validation error helper
 */
export function createValidationError(
  message: string,
  details?: unknown
): AppError {
  return new AppError(
    ErrorType.VALIDATION,
    message,
    400,
    message // Validation errors are safe to expose
  );
}

/**
 * Rate limit error helper
 */
export function createRateLimitError(message: string): AppError {
  return new AppError(
    ErrorType.RATE_LIMIT,
    message,
    429,
    message
  );
}

/**
 * Authentication error helper
 */
export function createAuthError(message: string = "Authentication required"): AppError {
  return new AppError(
    ErrorType.AUTHENTICATION,
    message,
    401,
    message
  );
}

/**
 * Not found error helper
 */
export function createNotFoundError(resource: string = "Resource"): AppError {
  return new AppError(
    ErrorType.NOT_FOUND,
    `${resource} not found`,
    404,
    `${resource} not found`
  );
}

