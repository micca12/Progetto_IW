/**
 * Store Preferiti - Gestione prodotti salvati
 *
 * Gestisce i preferiti dell'utente:
 * - Fetch lista preferiti
 * - Aggiunta/rimozione preferiti
 * - Toggle preferito con feedback
 *
 * @module stores/favorites
 */

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import apiClient from "@/api/client";
import { extractApiError, isUnauthorizedError } from "@/utils/apiError";
import type { ProdottoLight } from "@/types";

/**
 * Rappresenta un preferito con il prodotto associato
 */
interface Preferito {
  id: number;
  utente_id: number;
  prodotto_id: number;
  data_aggiunta: string;
  prodotti: ProdottoLight & {
    marche: { id: number; nome: string; logo_url: string | null };
  };
}

/**
 * Store Pinia per la gestione dei preferiti
 */
export const useFavoritesStore = defineStore("favorites", () => {
  // ========================================================================
  // STATE
  // ========================================================================

  /** Lista completa dei preferiti dell'utente */
  const favorites = ref<Preferito[]>([]);

  /** Set di ID prodotti per lookup veloce O(1) */
  const favoriteIds = ref<Set<number>>(new Set());

  /** Indica se c'è un caricamento in corso */
  const loading = ref(false);

  /** Indica se è in corso un'operazione di toggle */
  const toggling = ref<number | null>(null);

  /** Messaggio di errore */
  const error = ref<string | null>(null);

  /** Indica se i preferiti sono stati caricati almeno una volta */
  const initialized = ref(false);

  // ========================================================================
  // GETTERS
  // ========================================================================

  /** Numero totale di preferiti */
  const count = computed(() => favorites.value.length);

  /** Verifica se un prodotto è nei preferiti */
  function isFavorite(prodottoId: number): boolean {
    return favoriteIds.value.has(prodottoId);
  }

  // ========================================================================
  // ACTIONS
  // ========================================================================

  /**
   * Carica tutti i preferiti dell'utente dal server
   */
  async function fetchFavorites(): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const response = await apiClient.get<Preferito[]>("/preferiti");
      favorites.value = response.data;

      // Aggiorna il Set per lookup veloce
      favoriteIds.value = new Set(response.data.map(f => f.prodotto_id));
      initialized.value = true;
    } catch (err: unknown) {
      // 401 = non autenticato, non è un errore da mostrare
      if (!isUnauthorizedError(err)) {
        error.value = extractApiError(err, "Errore nel caricamento preferiti");
      }
      favorites.value = [];
      favoriteIds.value = new Set();
    } finally {
      loading.value = false;
    }
  }

  /**
   * Aggiunge un prodotto ai preferiti
   */
  async function addFavorite(prodottoId: number): Promise<boolean> {
    toggling.value = prodottoId;
    error.value = null;

    try {
      const response = await apiClient.post<Preferito>("/preferiti", {
        prodotto_id: prodottoId,
      });

      favorites.value.push(response.data);
      favoriteIds.value.add(prodottoId);
      return true;
    } catch (err) {
      error.value = extractApiError(err, "Errore nell'aggiunta ai preferiti");
      return false;
    } finally {
      toggling.value = null;
    }
  }

  /**
   * Rimuove un prodotto dai preferiti
   */
  async function removeFavorite(prodottoId: number): Promise<boolean> {
    toggling.value = prodottoId;
    error.value = null;

    try {
      await apiClient.delete(`/preferiti/${prodottoId}`);

      favorites.value = favorites.value.filter(f => f.prodotto_id !== prodottoId);
      favoriteIds.value.delete(prodottoId);
      return true;
    } catch (err) {
      error.value = extractApiError(err, "Errore nella rimozione dai preferiti");
      return false;
    } finally {
      toggling.value = null;
    }
  }

  /**
   * Toggle preferito - aggiunge se non presente, rimuove se presente
   * @returns true se l'operazione è riuscita
   */
  async function toggleFavorite(prodottoId: number): Promise<boolean> {
    if (isFavorite(prodottoId)) {
      return removeFavorite(prodottoId);
    } else {
      return addFavorite(prodottoId);
    }
  }

  /**
   * Pulisce tutti i preferiti (usato al logout)
   */
  function clearFavorites(): void {
    favorites.value = [];
    favoriteIds.value = new Set();
    initialized.value = false;
    error.value = null;
  }

  // ========================================================================
  // EXPORT
  // ========================================================================

  return {
    // State
    favorites,
    loading,
    toggling,
    error,
    initialized,

    // Getters
    count,
    isFavorite,

    // Actions
    fetchFavorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
  };
});
