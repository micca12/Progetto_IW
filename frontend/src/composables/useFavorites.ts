import { computed, type ComputedRef, type Ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useFavoritesStore } from "@/stores/favorites";

/**
 * Composable unificato per la gestione dei preferiti.
 * Combina inizializzazione e stato di un singolo prodotto.
 *
 * @param productId - (Opzionale) Ref con l'ID del prodotto per ottenere stato specifico
 */
export function useFavorites(
  productId?: Ref<number | null | undefined> | ComputedRef<number | null | undefined>
) {
  const authStore = useAuthStore();
  const favoritesStore = useFavoritesStore();

  /**
   * Inizializza i preferiti se l'utente è autenticato e non sono già caricati
   */
  function initIfNeeded(): void {
    if (authStore.isAuthenticated && !favoritesStore.initialized) {
      favoritesStore.fetchFavorites();
    }
  }

  /** True se il prodotto è nei preferiti (richiede productId) */
  const isFavorite = computed(() =>
    productId?.value ? favoritesStore.isFavorite(productId.value) : false
  );

  /** True se è in corso un'operazione di toggle per questo prodotto */
  const isToggling = computed(() =>
    productId?.value ? favoritesStore.toggling === productId.value : false
  );

  return {
    initIfNeeded,
    isFavorite,
    isToggling,
  };
}
