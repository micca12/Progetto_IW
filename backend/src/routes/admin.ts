/**
 * Route Admin - Gestione marche e utenti marca
 */

import { Router, Response } from "express";
import prisma from "../services/prisma.js";
import { authenticateToken, requireAdmin, AuthRequest } from "../middleware/auth.js";
import {
  asyncHandler,
  BadRequestError,
  NotFoundError,
} from "../middleware/asyncHandler.js";
import {
  parseId,
  validateRequired,
  normalizeEmail,
  hashPassword,
  checkEmailUniqueness,
} from "../utils/validators.js";

const router = Router();

// Applica autenticazione admin a tutte le routes
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/admin/marche - Lista marche con utenti associati
router.get(
  "/marche",
  asyncHandler(async (_req: AuthRequest, res: Response) => {
    // Query unica: marche + utente associato + conteggio prodotti
    const marche = await prisma.marche.findMany({
      select: {
        id: true,
        nome: true,
        logo_url: true,
        attivo: true,
        data_registrazione: true,
        _count: { select: { prodotti: true } },
        // Include direttamente l'utente marca (evita N+1)
        utenti: {
          where: { ruolo_id: 3 },
          select: { id: true, email: true },
          take: 1, // Una marca ha un solo utente
        },
      },
      orderBy: { id: "desc" },
    });

    // Trasforma per mantenere la stessa struttura di risposta
    const marcheConEmail = marche.map(({ utenti, ...m }) => ({
      ...m,
      email: utenti[0]?.email || null,
      utente_id: utenti[0]?.id || null,
    }));

    res.json({ marche: marcheConEmail });
  })
);

// POST /api/admin/marche - Crea nuova marca con utente
router.post(
  "/marche",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { nome, email, password } = req.body;

    validateRequired(req.body, ["nome", "email", "password"], {
      nome: "Nome marca",
      email: "Email",
      password: "Password",
    });

    const normalizedEmail = normalizeEmail(email);
    await checkEmailUniqueness(normalizedEmail);

    // Verifica nome marca unico
    const existingMarca = await prisma.marche.findFirst({
      where: { nome: nome.trim() },
    });
    if (existingMarca) {
      throw new BadRequestError("Nome marca già esistente");
    }

    const password_hash = await hashPassword(password);

    // Crea marca
    const marca = await prisma.marche.create({
      data: {
        nome: nome.trim(),
        attivo: true,
        data_registrazione: new Date(),
      },
    });

    // Crea utente marca
    await prisma.utenti.create({
      data: {
        email: normalizedEmail,
        password_hash,
        nome: nome.trim(),
        cognome: "Account",
        ruolo_id: 3, // marca
        marca_id: marca.id,
        attivo: true,
      },
    });

    res.status(201).json({
      id: marca.id,
      nome: marca.nome,
      email: normalizedEmail,
      attivo: marca.attivo,
      data_registrazione: marca.data_registrazione,
    });
  })
);

// PUT /api/admin/marche/:id - Modifica marca (attiva/disattiva)
router.put(
  "/marche/:id",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseId(req.params.id, "ID marca");
    const { attivo } = req.body;

    const marca = await prisma.marche.update({
      where: { id },
      data: { attivo: !!attivo },
      select: {
        id: true,
        nome: true,
        attivo: true,
      },
    });

    // Aggiorna anche l'utente marca associato
    await prisma.utenti.updateMany({
      where: { marca_id: id },
      data: { attivo: !!attivo },
    });

    res.json(marca);
  })
);

// DELETE /api/admin/marche/:id - Elimina marca
router.delete(
  "/marche/:id",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseId(req.params.id, "ID marca");

    // Verifica che non abbia prodotti
    const marca = await prisma.marche.findUnique({
      where: { id },
      include: { _count: { select: { prodotti: true } } },
    });

    if (!marca) {
      throw new NotFoundError("Marca non trovata");
    }

    if (marca._count.prodotti > 0) {
      throw new BadRequestError("Non puoi eliminare una marca con prodotti");
    }

    // Elimina prima l'utente marca
    await prisma.utenti.deleteMany({ where: { marca_id: id } });

    // Poi elimina la marca
    await prisma.marche.delete({ where: { id } });

    res.json({ message: "Marca eliminata" });
  })
);

export default router;
