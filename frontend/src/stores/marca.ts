/**
 * Store per la gestione dei prodotti della marca
 *
 * Centralizza la logica CRUD per i prodotti della marca loggata.
 */

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import apiClient from "@/api/client";
import { extractApiError } from "@/utils/apiError";
import type { Prodotto } from "@/types";

export const useMarcaStore = defineStore("marca", () => {
  // State
  const products = ref<Prodotto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const deleting = ref<number | null>(null); // ID del prodotto in eliminazione

  // Getters
  const productsCount = computed(() => products.value.length);
  const isDeleting = (productId: number) => deleting.value === productId;

  /**
   * Carica i prodotti della marca
   */
  async function fetchProducts(): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const response = await apiClient.get<{ prodotti: Prodotto[] }>("/marca/prodotti");
      products.value = response.data.prodotti;
    } catch (err) {
      error.value = extractApiError(err, "Errore nel caricamento prodotti");
    } finally {
      loading.value = false;
    }
  }

  /**
   * Crea un nuovo prodotto
   * @returns ID del prodotto creato o null in caso di errore
   */
  async function createProduct(nome: string): Promise<number | null> {
    try {
      const response = await apiClient.post<{ id: number }>("/marca/prodotti", {
        nome: nome.trim(),
        colori: [],
        ambienti_materiali: [],
      });
      return response.data.id;
    } catch (err) {
      error.value = extractApiError(err, "Errore nella creazione");
      return null;
    }
  }

  /**
   * Elimina un prodotto
   * @returns true se eliminato con successo
   */
  async function deleteProduct(productId: number): Promise<boolean> {
    deleting.value = productId;
    error.value = null;

    try {
      await apiClient.delete(`/marca/prodotti/${productId}`);
      // Rimuovi dalla lista locale
      products.value = products.value.filter((p) => p.id !== productId);
      return true;
    } catch (err) {
      error.value = extractApiError(err, "Errore nell'eliminazione");
      return false;
    } finally {
      deleting.value = null;
    }
  }

  /**
   * Resetta lo store (da chiamare al logout)
   */
  function $reset() {
    products.value = [];
    loading.value = false;
    error.value = null;
    deleting.value = null;
  }

  return {
    // State
    products,
    loading,
    error,
    deleting,

    // Getters
    productsCount,
    isDeleting,

    // Actions
    fetchProducts,
    createProduct,
    deleteProduct,
    $reset,
  };
});
