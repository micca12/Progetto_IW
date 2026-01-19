import jwt from "jsonwebtoken";

interface UserForToken {
  id: number;
  email: string;
  ruoli: { nome: string };
  marca_id?: number | null;
}

interface TokenPayload {
  id: number;
  email: string;
  ruolo: string;
  marca_id?: number;
}

/**
 * Genera un token JWT per un utente
 * Include marca_id se l'utente è una marca
 */
export function generateToken(utente: UserForToken): string {
  const payload: TokenPayload = {
    id: utente.id,
    email: utente.email,
    ruolo: utente.ruoli.nome,
  };

  if (utente.marca_id) {
    payload.marca_id = utente.marca_id;
  }

  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "24h" });
}

/**
 * Verifica e decodifica un token JWT
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  } catch {
    return null;
  }
}
