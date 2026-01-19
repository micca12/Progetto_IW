interface ApiErrorResult {
  message: string;
  status?: number;
}

/**
 * Extracts error message and status from Axios error responses
 * Handles the common pattern of backend error responses
 */
export function extractApiErrorWithStatus(err: unknown, fallback = "Errore di connessione"): ApiErrorResult {
  if (err && typeof err === "object" && "response" in err) {
    const axiosError = err as {
      response?: {
        data?: { error?: string; message?: string };
        status?: number;
      };
    };
    return {
      message: axiosError.response?.data?.error
        || axiosError.response?.data?.message
        || fallback,
      status: axiosError.response?.status,
    };
  }
  return { message: fallback };
}

/**
 * Extracts error message from Axios error responses
 * Handles the common pattern of backend error responses
 */
export function extractApiError(err: unknown, fallback = "Errore di connessione"): string {
  return extractApiErrorWithStatus(err, fallback).message;
}

/**
 * Checks if an error is a 401 Unauthorized response
 */
export function isUnauthorizedError(err: unknown): boolean {
  return extractApiErrorWithStatus(err).status === 401;
}
