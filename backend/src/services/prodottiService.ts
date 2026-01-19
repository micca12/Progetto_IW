import prisma from "./prisma.js";

/**
 * Include completo per query prodotti con tutte le relazioni
 * Usato in: prodotti.ts, marca-prodotti.ts, catalogo.ts
 */
export const PRODOTTO_FULL_INCLUDE = {
  marche: true,
  colori: {
    include: {
      prezzi: {
        include: {
          dimensioni: true,
        },
        orderBy: {
          dimensioni: { litri: "asc" as const },
        },
      },
    },
  },
  prodotti_ambienti_materiali: {
    include: {
      ambienti: true,
      materiali: true,
    },
  },
} as const;

/**
 * Include leggero per liste prodotti (senza prezzi)
 */
export const PRODOTTO_LIGHT_INCLUDE = {
  marche: {
    select: { id: true, nome: true, logo_url: true },
  },
  colori: {
    select: { id: true, codice_hex: true },
  },
} as const;

/**
 * Elimina tutte le relazioni di un prodotto (cascade delete)
 * Da usare prima di eliminare o aggiornare un prodotto
 */
export async function deleteProdottoRelations(prodottoId: number): Promise<void> {
  // Ottieni colori associati
  const coloriIds = await prisma.colori.findMany({
    where: { prodotto_id: prodottoId },
    select: { id: true },
  });

  // Prima elimina prezzi (dipendono da colori)
  await prisma.prezzi.deleteMany({
    where: { colore_id: { in: coloriIds.map((c) => c.id) } },
  });

  // Poi elimina colori e altre relazioni indipendenti in parallelo
  await Promise.all([
    prisma.colori.deleteMany({ where: { prodotto_id: prodottoId } }),
    prisma.prodotti_ambienti_materiali.deleteMany({ where: { prodotto_id: prodottoId } }),
    prisma.preferiti.deleteMany({ where: { prodotto_id: prodottoId } }),
  ]);
}

/**
 * Verifica che un prodotto appartenga a una marca specifica
 */
export async function verifyProdottoOwnership(
  prodottoId: number,
  marcaId: number
): Promise<boolean> {
  const prodotto = await prisma.prodotti.findFirst({
    where: { id: prodottoId, marca_id: marcaId },
    select: { id: true },
  });
  return !!prodotto;
}

/**
 * Input per la creazione di colori con prezzi
 */
export interface ColoreInput {
  nome: string;
  codice_hex: string;
  prezzi?: { dimensione_id: number; prezzo: number }[];
}

/**
 * Costruisce l'input Prisma per la creazione di colori con prezzi
 */
export function buildColorsInput(colori: ColoreInput[]) {
  return (colori || []).map((c) => ({
    nome: c.nome,
    codice_hex: c.codice_hex.toUpperCase(),
    prezzi: {
      create: (c.prezzi || []).map((p) => ({
        dimensione_id: p.dimensione_id,
        prezzo: String(p.prezzo),
      })),
    },
  }));
}
