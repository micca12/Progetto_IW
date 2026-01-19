import bcrypt from "bcrypt";
import prisma from "../services/prisma.js";
import { BadRequestError } from "../middleware/asyncHandler.js";

/**
 * Valida che tutti i campi richiesti siano presenti
 * @throws BadRequestError se un campo manca
 */
export function validateRequired(
  data: Record<string, unknown>,
  fields: string[],
  fieldNames?: Record<string, string>
): void {
  const missing = fields.filter((field) => {
    const value = data[field];
    return value === undefined || value === null || value === "";
  });

  if (missing.length > 0) {
    const names = missing.map((f) => fieldNames?.[f] || f);
    if (missing.length === 1) {
      throw new BadRequestError(`${names[0]} è obbligatorio`);
    }
    throw new BadRequestError(`I seguenti campi sono obbligatori: ${names.join(", ")}`);
  }
}

/**
 * Normalizza un'email (lowercase + trim)
 */
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Valida il formato email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida la lunghezza minima della password
 */
export function validatePassword(password: string, minLength = 8): void {
  if (password.length < minLength) {
    throw new BadRequestError(`La password deve essere di almeno ${minLength} caratteri`);
  }
}

/**
 * Parsa un ID numerico da stringa
 * @throws BadRequestError se l'ID non è valido
 */
export function parseId(id: string | undefined, fieldName = "ID"): number {
  const parsed = parseInt(id || "", 10);
  if (isNaN(parsed) || parsed < 1) {
    throw new BadRequestError(`${fieldName} non valido`);
  }
  return parsed;
}

/**
 * Hash di una password con bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Verifica che l'email non sia già in uso
 * @throws BadRequestError se l'email è già utilizzata
 */
export async function checkEmailUniqueness(
  email: string,
  excludeUserId?: number
): Promise<void> {
  const existing = await prisma.utenti.findFirst({
    where: {
      email,
      ...(excludeUserId && { id: { not: excludeUserId } }),
    },
  });
  if (existing) {
    throw new BadRequestError("Email già in uso");
  }
}
