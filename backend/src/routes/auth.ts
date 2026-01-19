import { Router, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../services/prisma.js";
import { authenticateToken, AuthRequest } from "../middleware/auth.js";
import { generateToken } from "../services/tokenService.js";
import {
  asyncHandler,
  NotFoundError,
  UnauthorizedError,
} from "../middleware/asyncHandler.js";
import {
  validateRequired,
  normalizeEmail,
  validatePassword,
  hashPassword,
  checkEmailUniqueness,
} from "../utils/validators.js";
import { formatUserResponse } from "../utils/formatters.js";

const router = Router();

// POST /api/auth/register
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { email, password, nome, cognome } = req.body;

    validateRequired(req.body, ["email", "password", "nome", "cognome"], {
      email: "Email",
      password: "Password",
      nome: "Nome",
      cognome: "Cognome",
    });

    validatePassword(password);

    const normalizedEmail = normalizeEmail(email);
    await checkEmailUniqueness(normalizedEmail);

    const password_hash = await hashPassword(password);

    const utente = await prisma.utenti.create({
      data: {
        email: normalizedEmail,
        password_hash,
        nome: nome.trim(),
        cognome: cognome.trim(),
        ruolo_id: 2, // user
      },
      include: { ruoli: true, marche: true },
    });

    const token = generateToken(utente);

    res.status(201).json({
      user: formatUserResponse(utente),
      token,
    });
  })
);

// POST /api/auth/login
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    validateRequired(req.body, ["email", "password"], {
      email: "Email",
      password: "Password",
    });

    const normalizedEmail = normalizeEmail(email);

    const utente = await prisma.utenti.findUnique({
      where: { email: normalizedEmail },
      include: { ruoli: true, marche: true },
    });

    if (!utente || !utente.attivo) {
      throw new UnauthorizedError("Credenziali non valide");
    }

    const validPassword = await bcrypt.compare(password, utente.password_hash);
    if (!validPassword) {
      throw new UnauthorizedError("Credenziali non valide");
    }

    // Aggiorna ultimo accesso
    await prisma.utenti.update({
      where: { id: utente.id },
      data: { ultimo_accesso: new Date() },
    });

    const token = generateToken(utente);

    res.json({
      user: formatUserResponse(utente),
      token,
    });
  })
);

// GET /api/auth/me
router.get(
  "/me",
  authenticateToken,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const utente = await prisma.utenti.findUnique({
      where: { id: req.user!.id },
      include: { ruoli: true, marche: true },
    });

    if (!utente) {
      throw new NotFoundError("Utente non trovato");
    }

    res.json(formatUserResponse(utente));
  })
);

// PUT /api/auth/me - Update profile
router.put(
  "/me",
  authenticateToken,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { nome, cognome, email } = req.body;

    validateRequired(req.body, ["nome", "cognome", "email"], {
      nome: "Nome",
      cognome: "Cognome",
      email: "Email",
    });

    const normalizedEmail = normalizeEmail(email);

    // Check if email is taken by another user
    if (normalizedEmail !== req.user!.email.toLowerCase()) {
      await checkEmailUniqueness(normalizedEmail, req.user!.id);
    }

    const utente = await prisma.utenti.update({
      where: { id: req.user!.id },
      data: {
        nome: nome.trim(),
        cognome: cognome.trim(),
        email: normalizedEmail,
      },
      include: { ruoli: true, marche: true },
    });

    const token = generateToken(utente);

    res.json({
      user: formatUserResponse(utente),
      token,
    });
  })
);

// PUT /api/auth/password - Update password
router.put(
  "/password",
  authenticateToken,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    validateRequired(req.body, ["currentPassword", "newPassword"], {
      currentPassword: "Password corrente",
      newPassword: "Nuova password",
    });

    validatePassword(newPassword);

    const utente = await prisma.utenti.findUnique({
      where: { id: req.user!.id },
    });

    if (!utente) {
      throw new NotFoundError("Utente non trovato");
    }

    const validPassword = await bcrypt.compare(
      currentPassword,
      utente.password_hash
    );
    if (!validPassword) {
      throw new UnauthorizedError("Password corrente non corretta");
    }

    const password_hash = await hashPassword(newPassword);

    await prisma.utenti.update({
      where: { id: req.user!.id },
      data: { password_hash },
    });

    res.json({ message: "Password aggiornata con successo" });
  })
);

export default router;
