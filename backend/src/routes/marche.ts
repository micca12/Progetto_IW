import { Router, Request, Response } from "express";
import prisma from "../services/prisma.js";
import { asyncHandler, NotFoundError } from "../middleware/asyncHandler.js";
import { parseId } from "../utils/validators.js";
import { PRODOTTO_LIGHT_INCLUDE } from "../services/prodottiService.js";

const router = Router();

// GET /api/marche
router.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    const data = await prisma.marche.findMany({
      where: { attivo: true },
      orderBy: { nome: "asc" },
    });
    res.json(data);
  })
);

// GET /api/marche/:id
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const id = parseId(req.params.id, "ID marca");

    const marca = await prisma.marche.findFirst({
      where: { id, attivo: true },
      include: {
        prodotti: {
          include: PRODOTTO_LIGHT_INCLUDE,
        },
      },
    });

    if (!marca) {
      throw new NotFoundError("Marca non trovata");
    }

    res.json(marca);
  })
);

export default router;
