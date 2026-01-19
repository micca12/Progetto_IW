import { Request, Response, NextFunction } from "express";

/**
 * Wrapper per route handlers async che gestisce automaticamente gli errori
 * Elimina la necessità di try-catch in ogni route
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Error handler middleware globale
 * Da usare come ultimo middleware in app.ts
 */
export function errorHandler(
  err: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Errore interno del server";

  res.status(statusCode).json({ error: message });
}

/**
 * Classe per errori HTTP custom
 */
export class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Risorsa non trovata") {
    super(message, 404);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Richiesta non valida") {
    super(message, 400);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Non autorizzato") {
    super(message, 401);
  }
}
