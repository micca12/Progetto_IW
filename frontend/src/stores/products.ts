import { defineStore } from "pinia";
import { ref, computed } from "vue";
import apiClient from "@/api/client";
import type {
  Prodotto,
  ProdottoLight,
  TrendingProdotto,
  CatalogFilters,
  Ambiente,
  Materiale,
  Marca,
} from "@/types";

/** Info pagination ritornate dal server */
interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Risposta API con pagination */
interface PaginatedResponse {
  data: ProdottoLight[];
  pagination: PaginationInfo;
}

export const useProductsStore = defineStore("products", () => {
  // === DATI DI RIFERIMENTO (caricati una volta, cached) ===
  const ambienti = ref<Ambiente[]>([]);
  const materiali = ref<Materiale[]>([]);
  const marche = ref<Marca[]>([]);

  // === PRODOTTI ===
  const products = ref<ProdottoLight[]>([]);
  const trendingProducts = ref<TrendingProdotto[]>([]);
  const currentProduct = ref<Prodotto | null>(null);

  // === PAGINATION ===
  const pagination = ref<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  // === FILTRI ATTIVI ===
  const activeFilters = ref<CatalogFilters>({});

  // === CACHE ===
  const productDetailCache = ref<Map<number, Prodotto>>(new Map());

  // === LOADING STATES ===
  const loading = ref({
    catalog: false,
    product: false,
    trending: false,
    filters: false,
  });
  const error = ref<string | null>(null);

  // === MAPPE NOME → ID ===
  const ambienteNameToId = computed(() => {
    const map = new Map<string, number>();
    ambienti.value.forEach((a) => map.set(a.nome.toLowerCase(), a.id));
    return map;
  });

  const materialeNameToId = computed(() => {
    const map = new Map<string, number>();
    materiali.value.forEach((m) => map.set(m.nome.toLowerCase(), m.id));
    return map;
  });

  const marcaNameToId = computed(() => {
    const map = new Map<string, number>();
    marche.value.forEach((m) => map.set(m.nome.toLowerCase(), m.id));
    return map;
  });

  /**
   * Inizializza lo stato del catalogo (ambienti, materiali, marche)
   */
  async function initCatalog() {
    if (ambienti.value.length > 0) return;

    loading.value.filters = true;
    error.value = null;

    try {
      const [ambRes, matRes, marRes] = await Promise.all([
        apiClient.get<Ambiente[]>("/catalogo/ambienti"),
        apiClient.get<Materiale[]>("/catalogo/materiali"),
        apiClient.get<Marca[]>("/catalogo/marche-per-filtro"),
      ]);

      ambienti.value = ambRes.data;
      materiali.value = matRes.data;
      marche.value = marRes.data;
    } catch (e) {
      error.value = "Errore nel caricamento del catalogo";
      console.error(e);
    } finally {
      loading.value.filters = false;
    }
  }

  // === CONVERTI FILTRI NOME → ID ===
  function filtersToIds(filters: CatalogFilters) {
    return {
      ambiente_id: filters.ambiente
        ? ambienteNameToId.value.get(filters.ambiente.toLowerCase())
        : undefined,
      materiale_id: filters.materiale
        ? materialeNameToId.value.get(filters.materiale.toLowerCase())
        : undefined,
      marca_id: filters.marca
        ? marcaNameToId.value.get(filters.marca.toLowerCase())
        : undefined,
    };
  }

  // === FETCH PRODOTTI CON PAGINATION ===
  async function fetchProducts(filters: CatalogFilters = {}, page: number = 1) {
    loading.value.catalog = true;
    error.value = null;

    try {
      const ids = filtersToIds(filters);
      const params = new URLSearchParams();

      // Filtri
      if (ids.ambiente_id)
        params.append("ambiente_id", ids.ambiente_id.toString());
      if (ids.materiale_id)
        params.append("materiale_id", ids.materiale_id.toString());
      if (ids.marca_id) params.append("marca_id", ids.marca_id.toString());

      // Pagination
      params.append("page", page.toString());
      params.append("limit", "12");

      const response = await apiClient.get<PaginatedResponse>(
        `/prodotti?${params}`
      );

      products.value = response.data.data;
      pagination.value = response.data.pagination;
      activeFilters.value = filters;

      return response.data;
    } catch (e) {
      error.value = "Errore nel caricamento dei prodotti";
      console.error(e);
      return {
        data: [],
        pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
      };
    } finally {
      loading.value.catalog = false;
    }
  }

  // === FETCH PRODOTTO DETTAGLIO ===
  async function fetchProductDetail(id: number, force: boolean = false) {
    // Usa cache solo se non forzato
    if (!force && productDetailCache.value.has(id)) {
      currentProduct.value = productDetailCache.value.get(id)!;
      return currentProduct.value;
    }

    loading.value.product = true;
    error.value = null;

    try {
      const response = await apiClient.get<Prodotto>(`/prodotti/${id}`);
      currentProduct.value = response.data;
      productDetailCache.value.set(id, response.data);
      return response.data;
    } catch (e) {
      error.value = "Errore nel caricamento del prodotto";
      console.error(e);
      return null;
    } finally {
      loading.value.product = false;
    }
  }

  // === FETCH TRENDING ===
  async function fetchTrending() {
    if (trendingProducts.value.length > 0) return trendingProducts.value;

    loading.value.trending = true;
    error.value = null;

    try {
      const response =
        await apiClient.get<TrendingProdotto[]>("/prodotti/trending");
      trendingProducts.value = response.data;
      return response.data;
    } catch (e) {
      error.value = "Errore nel caricamento dei prodotti trending";
      console.error(e);
      return [];
    } finally {
      loading.value.trending = false;
    }
  }

  // === SETTA FILTRI E FETCH ===
  function setFilters(filters: CatalogFilters, page: number = 1) {
    activeFilters.value = filters;
    fetchProducts(filters, page);
  }

  // === CAMBIA PAGINA ===
  function setPage(page: number) {
    fetchProducts(activeFilters.value, page);
  }

  // === CLEAR CACHE ===
  function clearCache() {
    productDetailCache.value.clear();
  }

  return {
    // State
    ambienti,
    materiali,
    marche,
    products,
    trendingProducts,
    currentProduct,
    pagination,
    activeFilters,
    loading,
    error,

    // Actions
    initCatalog,
    fetchProducts,
    fetchProductDetail,
    fetchTrending,
    setFilters,
    setPage,
    clearCache,
  };
});
