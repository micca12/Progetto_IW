import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Interface per richieste autenticate
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    ruolo: string;
    marca_id?: number; // Se l'utente è una marca, contiene l'id della marca
  };
}

export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Token mancante" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      email: string;
      ruolo: string;
      marca_id?: number;
    };
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: "Token non valido" });
  }
}

export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (req.user?.ruolo !== "admin") {
    res.status(403).json({ error: "Accesso riservato agli admin" });
    return;
  }
  next();
}

// Middleware per verificare che l'utente sia una marca
export function requireMarca(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (req.user?.ruolo !== "marca" || !req.user?.marca_id) {
    res.status(403).json({ error: "Accesso riservato alle marche" });
    return;
  }
  next();
}
