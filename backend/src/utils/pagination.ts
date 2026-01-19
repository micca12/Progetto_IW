/**
 * Parametri di paginazione parsati
 */
export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

/**
 * Parsa i parametri di paginazione dalla query string
 * @param page - Numero pagina (default: 1)
 * @param limit - Elementi per pagina (default: 12, max: 50)
 */
export function parsePagination(
  page?: string | number,
  limit?: string | number,
  defaultLimit = 12,
  maxLimit = 50
): PaginationParams {
  const pageNum = Math.max(1, parseInt(String(page || 1), 10) || 1);
  const limitNum = Math.min(
    maxLimit,
    Math.max(1, parseInt(String(limit || defaultLimit), 10) || defaultLimit)
  );
  const skip = (pageNum - 1) * limitNum;

  return { page: pageNum, limit: limitNum, skip };
}

/**
 * Calcola i metadati di paginazione per la risposta
 */
export function paginationMeta(total: number, page: number, limit: number) {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
