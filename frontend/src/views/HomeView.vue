<script setup lang="ts">
import { onMounted, computed } from "vue";
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useProductsStore } from "@/stores/products";
import { useFavorites } from "@/composables/useFavorites";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Home,
  TreeDeciduous,
  Paintbrush,
  Sparkles,
  Layers,
  Shield,
  Palette,
} from "lucide-vue-next";

import ProductCard from "@/components/catalog/ProductCard.vue";
import SpecificationCard from "@/components/product/SpecificationCard.vue";

const authStore = useAuthStore();
const productsStore = useProductsStore();
const { initIfNeeded } = useFavorites();

// Mostra solo i primi 8 prodotti trending
const displayedProducts = computed(() =>
  productsStore.trendingProducts.slice(0, 8)
);

onMounted(async () => {
  if (authStore.token && !authStore.user) {
    await authStore.fetchCurrentUser();
  }

  initIfNeeded();
  await productsStore.fetchTrending();
});

type Tone = "blue" | "emerald" | "amber" | "rose" | "purple" | "cyan";

const categories: {
  name: string;
  description: string;
  icon: any;
  filter: string;
  tone?: Tone;
}[] = [
  {
    name: "Interno",
    description: "Pareti, soffitti e mobili",
    icon: Home,
    filter: "ambiente=Interno",
    tone: "blue",
  },
  {
    name: "Esterno",
    description: "Facciate e superfici esterne",
    icon: TreeDeciduous,
    filter: "ambiente=Esterno",
    tone: "emerald",
  },
  {
    name: "Legno",
    description: "Impregnanti e smalti",
    icon: Layers,
    filter: "materiale=Legno",
    tone: "amber",
  },
  {
    name: "Metallo",
    description: "Antiruggine e finiture",
    icon: Shield,
    filter: "materiale=Metallo",

    tone: "rose",
  },
];

const features = [
  {
    icon: Palette,
    title: "Ampia scelta colori",
    description: "Centinaia di tonalità per ogni esigenza",
  },
  {
    icon: Paintbrush,
    title: "Qualità professionale",
    description: "Solo marche certificate e affidabili",
  },
  {
    icon: Sparkles,
    title: "Finiture speciali",
    description: "Effetti decorativi e protettivi",
  },
];
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section - Compatto -->
    <section
      class="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 to-transparent"
    >
      <div class="container mx-auto px-4 py-12 lg:py-20">
        <div class="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" class="mb-4">
            <Sparkles class="mr-1 size-3" />
            Catalogo Vernici Professionali
          </Badge>

          <h1 class="mb-4 text-3xl font-bold tracking-tight lg:text-5xl">
            Trova la vernice
            <span class="text-primary">perfetta</span>
          </h1>

          <p class="mb-8 text-muted-foreground lg:text-lg">
            Esplora il nostro catalogo completo. Filtra per ambiente, materiale
            e marca.
          </p>

          <div class="flex flex-col justify-center gap-3 sm:flex-row">
            <Button as-child size="lg" class="gap-2">
              <RouterLink to="/catalogo">
                <Paintbrush class="size-4" />
                Sfoglia il catalogo
              </RouterLink>
            </Button>
            <Button as-child variant="outline" size="lg">
              <RouterLink to="/catalogo?ambiente=Interno" class="gap-2">
                Vernici per interni
                <ArrowRight class="size-4" />
              </RouterLink>
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Categories Grid -->
    <section class="container mx-auto px-4 py-12">
      <div class="mb-8">
        <h2 class="text-2xl font-bold">Cerca per categoria</h2>
        <p class="mt-1 text-muted-foreground">
          Trova rapidamente quello che cerchi
        </p>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <RouterLink
          v-for="cat in categories"
          :key="cat.name"
          :to="`/catalogo?${cat.filter}`"
        >
          <SpecificationCard
            :key="cat.name"
            :icon="cat.icon"
            :label="cat.name"
            :value="cat.description"
            :tone="cat.tone"
          />
        </RouterLink>
      </div>
    </section>

    <!-- Trending Products - Static Grid -->
    <section class="border-y bg-muted/30 py-12">
      <div class="container mx-auto px-4">
        <div class="mb-8 flex items-end justify-between">
          <div>
            <h2 class="text-2xl font-bold">Prodotti in evidenza</h2>
            <p class="mt-1 text-muted-foreground">
              I preferiti dai nostri clienti
            </p>
          </div>
          <Button as-child variant="ghost" class="hidden gap-2 sm:flex">
            <RouterLink to="/catalogo">
              Vedi tutti
              <ArrowRight class="size-4" />
            </RouterLink>
          </Button>
        </div>

        <!-- Error State -->
        <Card v-if="productsStore.error" class="border-destructive">
          <CardContent class="py-8 text-center">
            <p class="text-destructive">{{ productsStore.error }}</p>
            <Button
              variant="outline"
              class="mt-4"
              @click="productsStore.fetchTrending()"
            >
              Riprova
            </Button>
          </CardContent>
        </Card>

        <!-- Static Grid -->
        <template v-else-if="displayedProducts.length > 0">
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <RouterLink
              v-for="product in displayedProducts"
              :key="product.id"
              :to="`/catalogo/${product.id}`"
              class="block"
            >
              <ProductCard :product="product" />
            </RouterLink>
          </div>

          <!-- Mobile CTA -->
          <div class="mt-8 text-center sm:hidden">
            <Button as-child variant="outline" class="gap-2">
              <RouterLink to="/catalogo">
                Vedi tutti i prodotti
                <ArrowRight class="size-4" />
              </RouterLink>
            </Button>
          </div>
        </template>

        <!-- Empty State -->
        <Card v-else>
          <CardContent class="py-12 text-center">
            <Paintbrush class="mx-auto mb-4 size-12 text-muted-foreground" />
            <p class="text-muted-foreground">
              Nessun prodotto in evidenza al momento
            </p>
          </CardContent>
        </Card>
      </div>
    </section>

    <!-- Features Section -->
    <section class="container mx-auto px-4 py-12">
      <div class="grid gap-8 sm:grid-cols-3">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="text-center"
        >
          <div
            class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10"
          >
            <component :is="feature.icon" class="size-7 text-primary" />
          </div>
          <h3 class="font-semibold">{{ feature.title }}</h3>
          <p class="mt-1 text-sm text-muted-foreground">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="border-t bg-muted/30">
      <div class="container mx-auto px-4 py-12 text-center">
        <h2 class="text-2xl font-bold">Pronto a trovare la tua vernice?</h2>
        <p class="mt-2 text-muted-foreground">
          Esplora il nostro catalogo completo con oltre 500 prodotti
        </p>
        <Button as-child size="lg" class="mt-6 gap-2">
          <RouterLink to="/catalogo">
            <Paintbrush class="size-4" />
            Vai al catalogo
          </RouterLink>
        </Button>
      </div>
    </section>
  </div>
</template>
