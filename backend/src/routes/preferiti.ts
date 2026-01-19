import { Router, Response } from "express";
import prisma from "../services/prisma.js";
import { authenticateToken, AuthRequest } from "../middleware/auth.js";
import {
  asyncHandler,
  BadRequestError,
  NotFoundError,
} from "../middleware/asyncHandler.js";
import { parseId, validateRequired } from "../utils/validators.js";

const router = Router();

// Tutte le route richiedono autenticazione
router.use(authenticateToken);

// GET /api/preferiti
router.get(
  "/",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = await prisma.preferiti.findMany({
      where: { utente_id: req.user!.id },
      include: {
        prodotti: {
          include: {
            marche: true,
            colori: true,
          },
        },
      },
      orderBy: { data_aggiunta: "desc" },
    });

    res.json(data);
  })
);

// POST /api/preferiti
router.post(
  "/",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { prodotto_id } = req.body;

    validateRequired(req.body, ["prodotto_id"], {
      prodotto_id: "ID prodotto",
    });

    const prodottoId = parseId(String(prodotto_id), "ID prodotto");

    // Verifica che il prodotto esista
    const prodotto = await prisma.prodotti.findUnique({
      where: { id: prodottoId },
    });

    if (!prodotto) {
      throw new NotFoundError("Prodotto non trovato");
    }

    // Verifica se già nei preferiti
    const existing = await prisma.preferiti.findUnique({
      where: {
        utente_id_prodotto_id: {
          utente_id: req.user!.id,
          prodotto_id: prodottoId,
        },
      },
    });

    if (existing) {
      throw new BadRequestError("Prodotto già nei preferiti");
    }

    const preferito = await prisma.preferiti.create({
      data: {
        utente_id: req.user!.id,
        prodotto_id: prodottoId,
      },
      include: {
        prodotti: {
          include: { marche: true },
        },
      },
    });

    res.status(201).json(preferito);
  })
);

// DELETE /api/preferiti/:prodotto_id
router.delete(
  "/:prodotto_id",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const prodottoId = parseId(req.params.prodotto_id, "ID prodotto");

    const preferito = await prisma.preferiti.findUnique({
      where: {
        utente_id_prodotto_id: {
          utente_id: req.user!.id,
          prodotto_id: prodottoId,
        },
      },
    });

    if (!preferito) {
      throw new NotFoundError("Preferito non trovato");
    }

    await prisma.preferiti.delete({
      where: { id: preferito.id },
    });

    res.json({ message: "Preferito rimosso" });
  })
);

export default router;
