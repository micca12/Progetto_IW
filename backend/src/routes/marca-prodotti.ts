/**
 * Route per gestione prodotti da parte delle marche
 * CRUD semplice senza workflow di approvazione
 */

import { Router, Response } from "express";
import prisma from "../services/prisma.js";
import { authenticateToken, requireMarca, AuthRequest } from "../middleware/auth.js";
import {
  asyncHandler,
  BadRequestError,
  NotFoundError,
} from "../middleware/asyncHandler.js";
import { parseId } from "../utils/validators.js";
import {
  PRODOTTO_FULL_INCLUDE,
  deleteProdottoRelations,
  verifyProdottoOwnership,
  buildColorsInput,
  ColoreInput,
} from "../services/prodottiService.js";

const router = Router();

// Applica autenticazione e verifica ruolo marca a tutte le route
router.use(authenticateToken);
router.use(requireMarca);

// GET /api/marca/prodotti - Lista prodotti della marca
router.get(
  "/",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const prodotti = await prisma.prodotti.findMany({
      where: { marca_id: req.user!.marca_id },
      include: PRODOTTO_FULL_INCLUDE,
      orderBy: { id: "desc" },
    });

    res.json({ prodotti });
  })
);

// GET /api/marca/prodotti/:id - Dettaglio prodotto
router.get(
  "/:id",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseId(req.params.id, "ID prodotto");

    const prodotto = await prisma.prodotti.findFirst({
      where: { id, marca_id: req.user!.marca_id },
      include: PRODOTTO_FULL_INCLUDE,
    });

    if (!prodotto) {
      throw new NotFoundError("Prodotto non trovato");
    }

    res.json(prodotto);
  })
);

interface AmbienteMaterialeInput {
  ambiente_id: number;
  materiale_id: number;
}

// POST /api/marca/prodotti - Crea prodotto con colori e prezzi
router.post(
  "/",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const {
      nome,
      descrizione,
      certificazioni,
      resistenza,
      base,
      numero_mani,
      temperatura_applicazione,
      copertura_per_litro,
      scheda_tecnica_url,
      ambienti_materiali,
      colori,
    } = req.body;

    if (!nome?.trim()) {
      throw new BadRequestError("Nome prodotto obbligatorio");
    }

    // Crea prodotto con relazioni
    const prodotto = await prisma.prodotti.create({
      data: {
        marca_id: req.user!.marca_id!,
        nome: nome.trim(),
        descrizione: descrizione?.trim() || null,
        certificazioni: certificazioni?.trim() || null,
        resistenza: resistenza?.trim() || null,
        base: base?.trim() || null,
        numero_mani: numero_mani || null,
        temperatura_applicazione: temperatura_applicazione?.trim() || null,
        copertura_per_litro: copertura_per_litro ? String(copertura_per_litro) : null,
        scheda_tecnica_url: scheda_tecnica_url?.trim() || null,
        prodotti_ambienti_materiali: {
          create: (ambienti_materiali || []).map((am: AmbienteMaterialeInput) => ({
            ambiente_id: am.ambiente_id,
            materiale_id: am.materiale_id,
          })),
        },
        colori: {
          create: buildColorsInput(colori as ColoreInput[]),
        },
      },
      include: PRODOTTO_FULL_INCLUDE,
    });

    res.status(201).json(prodotto);
  })
);

// PUT /api/marca/prodotti/:id - Modifica prodotto
router.put(
  "/:id",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseId(req.params.id, "ID prodotto");
    const {
      nome,
      descrizione,
      certificazioni,
      resistenza,
      base,
      numero_mani,
      temperatura_applicazione,
      copertura_per_litro,
      scheda_tecnica_url,
      ambienti_materiali,
      colori,
    } = req.body;

    // Verifica proprietà
    const isOwner = await verifyProdottoOwnership(id, req.user!.marca_id!);
    if (!isOwner) {
      throw new NotFoundError("Prodotto non trovato");
    }

    // Esegui tutto in una transazione per garantire atomicità
    const prodotto = await prisma.$transaction(async (tx) => {
      // 1. Ottieni colori associati per eliminare i prezzi
      const coloriIds = await tx.colori.findMany({
        where: { prodotto_id: id },
        select: { id: true },
      });

      // 2. Elimina prezzi (dipendono da colori)
      await tx.prezzi.deleteMany({
        where: { colore_id: { in: coloriIds.map((c) => c.id) } },
      });

      // 3. Elimina colori, ambienti_materiali e preferiti
      await Promise.all([
        tx.colori.deleteMany({ where: { prodotto_id: id } }),
        tx.prodotti_ambienti_materiali.deleteMany({ where: { prodotto_id: id } }),
        tx.preferiti.deleteMany({ where: { prodotto_id: id } }),
      ]);

      // 4. Aggiorna prodotto e ricrea relazioni
      return tx.prodotti.update({
        where: { id },
        data: {
          nome: nome?.trim() || undefined,
          descrizione: descrizione?.trim() || null,
          certificazioni: certificazioni?.trim() || null,
          resistenza: resistenza?.trim() || null,
          base: base?.trim() || null,
          numero_mani: numero_mani || null,
          temperatura_applicazione: temperatura_applicazione?.trim() || null,
          copertura_per_litro: copertura_per_litro ? String(copertura_per_litro) : null,
          scheda_tecnica_url: scheda_tecnica_url?.trim() || null,
          prodotti_ambienti_materiali: {
            create: (ambienti_materiali || []).map((am: AmbienteMaterialeInput) => ({
              ambiente_id: am.ambiente_id,
              materiale_id: am.materiale_id,
            })),
          },
          colori: {
            create: buildColorsInput(colori as ColoreInput[]),
          },
        },
        include: PRODOTTO_FULL_INCLUDE,
      });
    });

    res.json(prodotto);
  })
);

// DELETE /api/marca/prodotti/:id - Elimina prodotto (hard delete)
router.delete(
  "/:id",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseId(req.params.id, "ID prodotto");

    // Verifica proprietà
    const isOwner = await verifyProdottoOwnership(id, req.user!.marca_id!);
    if (!isOwner) {
      throw new NotFoundError("Prodotto non trovato");
    }

    // Elimina in cascata: prezzi -> colori -> ambienti_materiali -> preferiti -> prodotto
    await deleteProdottoRelations(id);
    await prisma.prodotti.delete({ where: { id } });

    res.json({ message: "Prodotto eliminato" });
  })
);

export default router;
