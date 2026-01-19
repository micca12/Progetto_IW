export interface Marca {
  id: number;
  nome: string;
  logo_url: string | null;
  attivo?: boolean;
  data_registrazione?: string | null;
}

/** Marca con conteggio prodotti (per admin) */
export interface MarcaConProdotti extends Marca {
  email?: string | null; // email dell'utente marca associato
  utente_id?: number | null;
  _count?: {
    prodotti: number;
  };
}

export interface Colore {
  id: number;
  prodotto_id: number;
  nome: string;
  codice_hex: string;
  prezzi?: Prezzo[];
}

export interface Dimensione {
  id: number;
  litri: string;
}

export interface Prezzo {
  id: number;
  colore_id: number;
  dimensione_id: number;
  prezzo: string;
  dimensioni?: Dimensione;
}

export interface Ambiente {
  id: number;
  nome: string;
}

export interface Materiale {
  id: number;
  nome: string;
}

export interface ProdottoAmbienteMateriale {
  id: number;
  prodotto_id: number;
  ambiente_id: number;
  materiale_id: number;
  ambienti?: Ambiente;
  materiali?: Materiale;
}

export interface Prodotto {
  id: number;
  marca_id: number;
  nome: string;
  descrizione: string | null;
  certificazioni: string | null;
  resistenza: string | null;
  base: string | null;
  numero_mani: number | null;
  temperatura_applicazione: string | null;
  copertura_per_litro: string | null;
  scheda_tecnica_url: string | null;
  marche?: Marca;
  colori?: Colore[];
  prodotti_ambienti_materiali?: ProdottoAmbienteMateriale[];
}

/** Versione light del prodotto per lista/card (meno dati) */
export interface ProdottoLight {
  id: number;
  marca_id: number;
  nome: string;
  marche: { id: number; nome: string };
  colori: { codice_hex: string }[];
}

/** Prodotto con conteggio preferiti per trending */
export interface TrendingProdotto extends Prodotto {
  preferiti_count: number;
}

/** Filtri catalogo (usati in URL query params) */
export interface CatalogFilters {
  ambiente?: string;
  materiale?: string;
  marca?: string;
}

/** Statistiche marca */
export interface MarcaStats {
  totale: number;
}

/** Statistiche admin */
export interface AdminStats {
  totali: {
    utenti: number;
    prodotti: number;
    marche: number;
    marche_attive: number;
  };
}

/** Paginazione generica */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Risposta paginata generica */
export interface PaginatedResponse<T> {
  data?: T[];
  prodotti?: T[];
  marche?: T[];
  pagination: Pagination;
}
