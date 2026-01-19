import { Router, Request, Response } from "express";
import prisma from "../services/prisma.js";
import { asyncHandler, NotFoundError } from "../middleware/asyncHandler.js";
import { parsePagination, paginationMeta } from "../utils/pagination.js";
import { parseId } from "../utils/validators.js";
import { PRODOTTO_FULL_INCLUDE } from "../services/prodottiService.js";
import { Prisma } from "@prisma/client";

const router = Router();

// GET /api/prodotti - Versione LIGHT per lista/card con pagination
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { marca_id, ambiente_id, materiale_id, page, limit } = req.query;

    const { page: pageNum, limit: limitNum, skip } = parsePagination(
      page as string,
      limit as string
    );

    // Filtri base: solo marche attive
    const where: Prisma.prodottiWhereInput = {
      marche: { attivo: true },
    };

    if (marca_id) {
      where.marca_id = parseInt(marca_id as string);
    }

    if (ambiente_id || materiale_id) {
      where.prodotti_ambienti_materiali = {
        some: {
          ...(ambiente_id && { ambiente_id: parseInt(ambiente_id as string) }),
          ...(materiale_id && { materiale_id: parseInt(materiale_id as string) }),
        },
      };
    }

    // Esegui query per dati e conteggio in parallelo
    const [data, total] = await Promise.all([
      prisma.prodotti.findMany({
        where,
        select: {
          id: true,
          marca_id: true,
          nome: true,
          marche: { select: { id: true, nome: true } },
          colori: { select: { codice_hex: true } },
        },
        orderBy: { nome: "asc" },
        skip,
        take: limitNum,
      }),
      prisma.prodotti.count({ where }),
    ]);

    res.json({
      data,
      pagination: paginationMeta(total, pageNum, limitNum),
    });
  })
);

// GET /api/prodotti/trending - Top 10 prodotti più preferiti
router.get(
  "/trending",
  asyncHandler(async (_req: Request, res: Response) => {
    const trending = await prisma.prodotti.findMany({
      where: {
        marche: { attivo: true },
        preferiti: { some: {} },
      },
      include: {
        ...PRODOTTO_FULL_INCLUDE,
        _count: { select: { preferiti: true } },
      },
      orderBy: { preferiti: { _count: "desc" } },
      take: 10,
    });

    // Formatta la risposta aggiungendo il conteggio preferiti
    const data = trending.map(({ _count, ...prodotto }) => ({
      ...prodotto,
      preferiti_count: _count.preferiti,
    }));

    res.json(data);
  })
);

// GET /api/prodotti/:id
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const id = parseId(req.params.id, "ID prodotto");

    const prodotto = await prisma.prodotti.findFirst({
      where: {
        id,
        marche: { attivo: true },
      },
      include: PRODOTTO_FULL_INCLUDE,
    });

    if (!prodotto) {
      throw new NotFoundError("Prodotto non trovato");
    }

    res.json(prodotto);
  })
);

export default router;
