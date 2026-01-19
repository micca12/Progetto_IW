import { Router, Request, Response } from "express";
import prisma from "../services/prisma.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { Prisma } from "@prisma/client";

const router = Router();

// GET /api/catalogo/ambienti
router.get(
  "/ambienti",
  asyncHandler(async (_req: Request, res: Response) => {
    const data = await prisma.ambienti.findMany({
      orderBy: { nome: "asc" },
    });
    res.json(data);
  })
);

// GET /api/catalogo/materiali
router.get(
  "/materiali",
  asyncHandler(async (req: Request, res: Response) => {
    const { ambiente_id } = req.query;

    const where: Prisma.materialiWhereInput = {};

    if (ambiente_id) {
      where.prodotti_ambienti_materiali = {
        some: { ambiente_id: parseInt(ambiente_id as string) },
      };
    }

    const data = await prisma.materiali.findMany({
      where,
      orderBy: { nome: "asc" },
    });
    res.json(data);
  })
);

// GET /api/catalogo/dimensioni
router.get(
  "/dimensioni",
  asyncHandler(async (_req: Request, res: Response) => {
    const data = await prisma.dimensioni.findMany({
      orderBy: { litri: "asc" },
    });
    res.json(data);
  })
);

// GET /api/catalogo/marche-per-filtro
// Ottiene le marche che hanno prodotti per ambiente/materiale specifico
router.get(
  "/marche-per-filtro",
  asyncHandler(async (req: Request, res: Response) => {
    const { ambiente_id, materiale_id } = req.query;

    const where: Prisma.marcheWhereInput = {
      attivo: true,
    };

    if (ambiente_id || materiale_id) {
      where.prodotti = {
        some: {
          prodotti_ambienti_materiali: {
            some: {
              ...(ambiente_id && { ambiente_id: parseInt(ambiente_id as string) }),
              ...(materiale_id && { materiale_id: parseInt(materiale_id as string) }),
            },
          },
        },
      };
    }

    const data = await prisma.marche.findMany({
      where,
      orderBy: { nome: "asc" },
    });

    res.json(data);
  })
);

export default router;
