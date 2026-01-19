/**
 * Composable per azioni sui prodotti (preferiti, eliminazione)
 */
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useFavoritesStore } from "@/stores/favorites";
import apiClient from "@/api/client";
import { extractApiError } from "@/utils/apiError";
import { toast } from "vue-sonner";

export function useProductActions() {
  const router = useRouter();
  const authStore = useAuthStore();
  const favoritesStore = useFavoritesStore();

  // State per eliminazione
  const deleting = ref(false);
  const deleteError = ref<string | null>(null);

  // Helpers auth
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const isMarca = computed(() => authStore.isMarca);
  const userMarcaId = computed(() => authStore.user?.marca_id);

  /**
   * Verifica se l'utente può modificare/eliminare un prodotto
   */
  function canManageProduct(productMarcaId?: number): boolean {
    return isMarca.value && userMarcaId.value === productMarcaId;
  }

  /**
   * Toggle preferito
   */
  async function toggleFavorite(productId: number): Promise<boolean> {
    if (!isAuthenticated.value) {
      toast.info("Accedi per salvare i preferiti");
      router.push("/login");
      return false;
    }

    const wasInFavorites = favoritesStore.isFavorite(productId);
    const success = await favoritesStore.toggleFavorite(productId);

    if (success) {
      toast.success(wasInFavorites ? "Rimosso dai preferiti" : "Aggiunto ai preferiti");
    } else {
      toast.error(favoritesStore.error || "Errore");
    }

    return success;
  }

  /**
   * Rimuovi preferito con toast (per PreferitiView)
   */
  async function removeFavoriteWithToast(productId: number): Promise<boolean> {
    const success = await favoritesStore.removeFavorite(productId);
    if (success) {
      toast.success("Rimosso dai preferiti");
    } else {
      toast.error(favoritesStore.error || "Errore nella rimozione");
    }
    return success;
  }

  /**
   * Elimina prodotto (solo per marca owner)
   */
  async function deleteProduct(productId: number): Promise<boolean> {
    deleting.value = true;
    deleteError.value = null;

    try {
      await apiClient.delete(`/marca/prodotti/${productId}`);
      toast.success("Prodotto eliminato");
      return true;
    } catch (err) {
      deleteError.value = extractApiError(err, "Errore nell'eliminazione");
      toast.error(deleteError.value);
      return false;
    } finally {
      deleting.value = false;
    }
  }

  /**
   * Crea nuovo prodotto (solo per marca)
   */
  async function createProduct(nome: string): Promise<number | null> {
    try {
      const response = await apiClient.post<{ id: number }>("/marca/prodotti", {
        nome: nome.trim(),
        colori: [],
        ambienti_materiali: [],
      });
      toast.success("Prodotto creato");
      return response.data.id;
    } catch (err) {
      toast.error(extractApiError(err, "Errore nella creazione"));
      return null;
    }
  }

  // Favorites status helpers
  const isFavorite = (productId: number) => favoritesStore.isFavorite(productId);
  const isTogglingFavorite = (productId: number) => favoritesStore.toggling === productId;

  return {
    // State
    deleting,
    deleteError,

    // Auth helpers
    isAuthenticated,
    isMarca,
    userMarcaId,
    canManageProduct,

    // Actions
    toggleFavorite,
    removeFavoriteWithToast,
    deleteProduct,
    createProduct,

    // Favorites helpers
    isFavorite,
    isTogglingFavorite,
  };
}
