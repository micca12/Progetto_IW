<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Pencil } from "lucide-vue-next";
import FavoriteButton from "@/components/catalog/FavoriteButton.vue";
import type { Prodotto, ProdottoLight, TrendingProdotto } from "@/types";

interface Props {
  product: Prodotto | ProdottoLight | TrendingProdotto;
  // Azioni disponibili
  showFavoriteButton?: boolean;
  showManageButtons?: boolean;
  editLink?: string;
  // Stato (solo per manage buttons)
  isDeleting?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showFavoriteButton: false,
  showManageButtons: false,
  isDeleting: false,
});

const emit = defineEmits<{
  (e: "edit-click"): void;
  (e: "delete-click"): void;
}>();

// Computed
const imageColor = computed(
  () => props.product.colori?.[0]?.codice_hex || "#E5E5E5"
);

const colorsToShow = computed(() => props.product.colori?.slice(0, 5) || []);

const extraColorsCount = computed(() => {
  const total = props.product.colori?.length || 0;
  return total > 5 ? total - 5 : 0;
});

// Handlers
function handleEditClick(e: Event) {
  e.preventDefault();
  e.stopPropagation();
  emit("edit-click");
}

function handleDeleteClick(e: Event) {
  e.preventDefault();
  e.stopPropagation();
  emit("delete-click");
}
</script>

<template>
  <Card
    class="group relative cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl pt-0"
  >
    <!-- Favorite Button -->
    <FavoriteButton v-if="showFavoriteButton" :product-id="product.id" />

    <!-- Color Preview Image -->
    <div class="relative overflow-hidden">
      <div
        class="aspect-square transition-transform duration-500 group-hover:scale-105"
        :style="{ backgroundColor: imageColor }"
      />
    </div>

    <!-- Content -->
    <CardHeader :class="showManageButtons ? 'pb-2' : ''">
      <CardDescription class="text-xs uppercase tracking-wider">
        {{ product.marche?.nome }}
      </CardDescription>
      <CardTitle class="line-clamp-2 text-base transition-colors group-hover:text-primary">
        {{ product.nome }}
      </CardTitle>
      <CardDescription v-if="showManageButtons && product.colori" class="text-xs">
        {{ product.colori.length }} colori
      </CardDescription>
    </CardHeader>

    <CardContent class="space-y-3">
      <!-- Color Swatches -->
      <div v-if="product.colori && product.colori.length > 0" class="flex flex-wrap gap-1">
        <div
          v-for="(colore, index) in colorsToShow"
          :key="colore.codice_hex"
          class="size-5 rounded-full border border-border/50 shadow-sm transition-transform hover:scale-125"
          :class="{ 'ring-1 ring-primary ring-offset-1': index === 0 }"
          :style="{ backgroundColor: colore.codice_hex }"
        />
        <div
          v-if="extraColorsCount > 0"
          class="flex size-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium"
        >
          +{{ extraColorsCount }}
        </div>
      </div>

      <!-- Manage Buttons -->
      <div v-if="showManageButtons" class="flex gap-2">
        <Button
          v-if="editLink"
          as-child
          variant="outline"
          size="sm"
          class="flex-1 gap-1"
        >
          <RouterLink :to="editLink">
            <Pencil class="size-3" />
            Modifica
          </RouterLink>
        </Button>
        <Button
          v-else
          variant="outline"
          size="sm"
          class="flex-1 gap-1"
          @click="handleEditClick"
        >
          <Pencil class="size-3" />
          Modifica
        </Button>
        <Button variant="destructive" size="sm" :disabled="isDeleting" @click="handleDeleteClick">
          <Loader2 v-if="isDeleting" class="size-3 animate-spin" />
          <Trash2 v-else class="size-3" />
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
