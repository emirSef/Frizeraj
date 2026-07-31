/**
 * Application-level error primitives used across the service layer so callers
 * can handle failures consistently regardless of the underlying source.
 */
export class AppError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, options?: { code?: string; status?: number; cause?: unknown }) {
    super(message, { cause: options?.cause });
    this.name = "AppError";
    this.code = options?.code ?? "APP_ERROR";
    this.status = options?.status ?? 500;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, { code: "NOT_FOUND", status: 404 });
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "You must be signed in to do that") {
    super(message, { code: "UNAUTHORIZED", status: 401 });
    this.name = "UnauthorizedError";
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Something went wrong. Please try again.";
}
