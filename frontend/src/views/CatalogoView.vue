<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProductsStore } from "@/stores/products";
import { useFavorites } from "@/composables/useFavorites";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { X, SlidersHorizontal, Package, RotateCcw } from "lucide-vue-next";
import ProductCard from "@/components/catalog/ProductCard.vue";
import ProductGrid from "@/components/catalog/ProductGrid.vue";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const route = useRoute();
const router = useRouter();
const store = useProductsStore();
const { initIfNeeded } = useFavorites();

/* ---------------------------------------
   FILTER STATE
--------------------------------------- */

type FilterKey = "ambiente" | "materiale" | "marca";

const selectedAmbiente = ref<string | null>(null);
const selectedMateriale = ref<string | null>(null);
const selectedMarca = ref<string | null>(null);
const currentPage = ref(1);

const filtersMap: Record<FilterKey, typeof selectedAmbiente> = {
  ambiente: selectedAmbiente,
  materiale: selectedMateriale,
  marca: selectedMarca,
};

/* ---------------------------------------
   FILTER CONFIG (for UI + logic)
--------------------------------------- */

const FILTER_CONFIGS = [
  {
    key: "ambiente",
    label: "Ambiente",
    allLabel: "Tutti gli ambienti",
    options: computed(() => store.ambienti),
  },
  {
    key: "materiale",
    label: "Materiale",
    allLabel: "Tutti i materiali",
    options: computed(() => store.materiali),
  },
  {
    key: "marca",
    label: "Marca",
    allLabel: "Tutte le marche",
    options: computed(() => store.marche),
  },
] as const;

/* ---------------------------------------
   DERIVED FILTER STATE
--------------------------------------- */

const filters = computed(() =>
  FILTER_CONFIGS.map((f) => ({
    key: f.key,
    label: filtersMap[f.key].value,
  }))
);

const activeFilters = computed(() => filters.value.filter((f) => f.label));

const hasActiveFilters = computed(() => activeFilters.value.length > 0);

/* ---------------------------------------
   URL ↔ STATE SYNC
--------------------------------------- */

onMounted(async () => {
  await store.initCatalog();
  initIfNeeded();
  syncFromUrl();
});

watch(() => route.query, syncFromUrl, { deep: true });

function syncFromUrl() {
  for (const key of Object.keys(filtersMap) as FilterKey[]) {
    filtersMap[key].value = (route.query[key] as string) || null;
  }

  currentPage.value = parseInt(route.query.page as string) || 1;

  fetchProducts();
}

/* ---------------------------------------
   DATA FETCH
--------------------------------------- */

function fetchProducts() {
  const filters: Record<string, string> = {};

  for (const key of Object.keys(filtersMap) as FilterKey[]) {
    const value = filtersMap[key].value;
    if (value) filters[key] = value;
  }

  store.fetchProducts(filters, currentPage.value);
}

/* ---------------------------------------
   URL UPDATE
--------------------------------------- */

function updateUrl() {
  const query: Record<string, string> = {};

  for (const key of Object.keys(filtersMap) as FilterKey[]) {
    const value = filtersMap[key].value;
    if (value) query[key] = value;
  }

  if (currentPage.value > 1) {
    query.page = String(currentPage.value);
  }

  router.push({ query });
}

/* ---------------------------------------
   FILTER ACTIONS
--------------------------------------- */

function setFilter(key: FilterKey, value: unknown) {
  const v = String(value ?? "");
  filtersMap[key].value = v === "all" ? null : v;

  currentPage.value = 1;
  updateUrl();
}

function removeFilter(key: FilterKey) {
  filtersMap[key].value = null;
  currentPage.value = 1;
  updateUrl();
}

function clearFilters() {
  for (const key of Object.keys(filtersMap) as FilterKey[]) {
    filtersMap[key].value = null;
  }

  currentPage.value = 1;
  router.push({ query: {} });
}

/* ---------------------------------------
   PAGINATION
--------------------------------------- */

function handlePageChange(page: number) {
  currentPage.value = page;
  updateUrl();
}

</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <div class="border-b bg-background">
      <div class="container mx-auto px-4 py-6">
        <h1 class="text-2xl font-bold tracking-tight lg:text-3xl">Catalogo</h1>
        <p
          v-if="!store.loading.catalog"
          class="mt-1 text-sm text-muted-foreground"
        >
          {{ store.pagination.total }} prodotti
        </p>
      </div>
    </div>

    <!-- Filter Toolbar -->
    <div
      class="sticky px-4 py-3 top-14 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <!-- Desktop filters -->
      <FieldGroup
        class="hidden md:flex flex-row mx-auto content-center"
        horizontal
      >
        <Field v-for="filter in FILTER_CONFIGS" :key="filter.key">
          <Select
            :model-value="filtersMap[filter.key].value || 'all'"
            @update:model-value="(v: unknown) => setFilter(filter.key, v)"
          >
            <SelectTrigger class="w-full text-sm lg:text-base">
              <SelectValue :placeholder="filter.allLabel" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">{{ filter.allLabel }}</SelectItem>
              <SelectItem
                v-for="option in filter.options.value"
                :key="option.id"
                :value="option.nome"
              >
                {{ option.nome }}
              </SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Button
          v-if="hasActiveFilters"
          variant="ghost"
          size="sm"
          class="gap-2 text-muted-foreground"
          @click="clearFilters"
        >
          <RotateCcw class="size-4" />
          Reset
        </Button>
      </FieldGroup>

      <!-- Mobile Filter Button -->
      <div class="md:hidden">
        <Sheet>
          <SheetTrigger as-child>
            <Button variant="outline" size="sm" class="gap-2">
              <SlidersHorizontal class="size-4" />
              Filtri
            </Button>
          </SheetTrigger>

          <SheetContent side="bottom" class="h-[70vh] rounded-t-2xl">
            <SheetHeader>
              <SheetTitle>Filtri</SheetTitle>
            </SheetHeader>

            <Card class="shadow-none border-none">
              <CardContent>
                <FieldGroup>
                  <Field v-for="filter in FILTER_CONFIGS" :key="filter.key">
                    <FieldLabel class="text-sm lg:text-base">
                      {{ filter.label }}
                    </FieldLabel>

                    <Select
                      :model-value="filtersMap[filter.key].value || 'all'"
                      @update:model-value="
                        (v: unknown) => setFilter(filter.key, v)
                      "
                    >
                      <SelectTrigger class="w-full text-sm lg:text-base">
                        <SelectValue :placeholder="filter.allLabel" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="all">{{
                          filter.allLabel
                        }}</SelectItem>
                        <SelectItem
                          v-for="option in filter.options.value"
                          :key="option.id"
                          :value="option.nome"
                        >
                          {{ option.nome }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>

            <SheetClose class="flex gap-2 justify-center w-full">
              <Button
                v-if="hasActiveFilters"
                variant="outline"
                @click="clearFilters"
              >
                Reset filtri
              </Button>
              <Button>Vedi {{ store.pagination.total }} risultati</Button>
            </SheetClose>
          </SheetContent>
        </Sheet>
      </div>

      <!-- Active Filters Badges -->
      <div
        v-if="hasActiveFilters"
        class="mt-3 flex flex-wrap items-center gap-2"
      >
        <Badge
          v-for="filter in activeFilters"
          :key="filter.key"
          variant="secondary"
          class="gap-1 pr-1"
        >
          {{ filter.label }}
          <button
            @click="removeFilter(filter.key)"
            class="ml-1 rounded-full p-0.5 hover:bg-muted"
          >
            <X class="size-3" />
          </button>
        </Badge>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="container mx-auto px-4 py-6">
      <ProductGrid
        :products="store.products"
        :pagination="store.pagination"
        :loading="store.loading.catalog"
        @page-change="handlePageChange"
      >
        <template v-slot:card="{ product }">
          <ProductCard :product="product" :show-favorite-button="true" />
        </template>

        <template v-slot:empty>
          <Card class="mx-auto max-w-md">
            <CardContent class="py-16 text-center">
              <div
                class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted"
              >
                <Package class="size-8 text-muted-foreground" />
              </div>
              <h3 class="text-lg font-semibold">Nessun prodotto trovato</h3>
              <p class="mt-2 text-muted-foreground">
                Prova a modificare i filtri di ricerca
              </p>
              <Button
                v-if="hasActiveFilters"
                @click="clearFilters"
                variant="outline"
                class="mt-6 gap-2"
              >
                <RotateCcw class="size-4" />
                Rimuovi tutti i filtri
              </Button>
            </CardContent>
          </Card>
        </template>
      </ProductGrid>
    </div>
  </div>
</template>
