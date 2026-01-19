<script setup lang="ts">
import { onMounted, computed } from "vue";
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useFavoritesStore } from "@/stores/favorites";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/catalog/ProductCard.vue";
import ProductGrid from "@/components/catalog/ProductGrid.vue";
import PageHeader from "@/components/ui/page-header.vue";
import { Heart, LogIn, ShoppingBag } from "lucide-vue-next";

const authStore = useAuthStore();
const favoritesStore = useFavoritesStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);

// Map favorites to products for ProductGrid
const favoriteProducts = computed(() =>
  favoritesStore.favorites.map((f) => ({
    ...f.prodotti,
    _dataAggiunta: f.data_aggiunta,
  }))
);

onMounted(async () => {
  if (isAuthenticated.value && !favoritesStore.initialized) {
    await favoritesStore.fetchFavorites();
  }
});
</script>

<template>
  <div class="min-h-screen bg-muted/30">
    <!-- Header -->
    <PageHeader
      title="I tuoi preferiti"
      :subtitle="isAuthenticated && favoritesStore.count > 0
        ? `${favoritesStore.count} ${favoritesStore.count === 1 ? 'prodotto salvato' : 'prodotti salvati'}`
        : undefined"
      :icon="Heart"
    />

    <!-- Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Not Authenticated State -->
      <template v-if="!isAuthenticated">
        <Card class="mx-auto max-w-md">
          <CardContent class="py-16 text-center">
            <div class="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-muted">
              <LogIn class="size-10 text-muted-foreground" />
            </div>
            <h2 class="text-xl font-semibold">Accedi per vedere i tuoi preferiti</h2>
            <p class="mt-2 text-muted-foreground">
              Salva i tuoi prodotti preferiti per trovarli facilmente in seguito
            </p>
            <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button as-child class="gap-2">
                <RouterLink to="/login">
                  <LogIn class="size-4" />
                  Accedi
                </RouterLink>
              </Button>
              <Button as-child variant="outline">
                <RouterLink to="/register">
                  Registrati
                </RouterLink>
              </Button>
            </div>
          </CardContent>
        </Card>
      </template>

      <!-- Authenticated Content -->
      <template v-else>
        <!-- Empty State -->
        <Card v-if="favoritesStore.favorites.length === 0" class="mx-auto max-w-md">
          <CardContent class="py-16 text-center">
            <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
              <Heart class="size-8 text-muted-foreground" />
            </div>
            <h3 class="text-lg font-semibold">Nessun preferito salvato</h3>
            <p class="mt-2 text-muted-foreground">
              Esplora il catalogo e salva i prodotti che ti interessano cliccando sul cuore
            </p>
            <Button as-child class="mt-6">
              <RouterLink to="/catalogo">
                <ShoppingBag class="mr-2 size-4" />
                Esplora il catalogo
              </RouterLink>
            </Button>
          </CardContent>
        </Card>

        <!-- Favorites Grid -->
        <template v-else>
          <ProductGrid :products="favoriteProducts">
            <template #card="{ product }">
              <ProductCard :product="product" :show-favorite-button="true" />
            </template>
          </ProductGrid>

          <!-- Bottom CTA -->
          <div class="mt-12 text-center">
            <p class="text-muted-foreground">Vuoi scoprire altri prodotti?</p>
            <Button as-child variant="outline" class="mt-4 gap-2">
              <RouterLink to="/catalogo">
                <ShoppingBag class="size-4" />
                Vai al catalogo
              </RouterLink>
            </Button>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
