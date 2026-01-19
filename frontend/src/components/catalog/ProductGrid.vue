<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-vue-next";
import type { Prodotto, ProdottoLight } from "@/types";

interface Pagination {
  page: number;
  totalPages: number;
  total: number;
}

interface Props {
  products: (Prodotto | ProdottoLight)[];
  pagination?: Pagination;
  loading?: boolean;
  linkPrefix?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  linkPrefix: "/catalogo",
});

const emit = defineEmits<{
  (e: "page-change", page: number): void;
}>();

// Generate visible page numbers
const visiblePages = computed(() => {
  if (!props.pagination) return [];

  const total = props.pagination.totalPages;
  const current = props.pagination.page;
  const pages: number[] = [];

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, 5);
    } else if (current >= total - 2) {
      pages.push(total - 4, total - 3, total - 2, total - 1, total);
    } else {
      pages.push(current - 2, current - 1, current, current + 1, current + 2);
    }
  }

  return pages;
});

function goToPage(page: number) {
  if (props.pagination && page >= 1 && page <= props.pagination.totalPages) {
    emit("page-change", page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
</script>

<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16">
      <Loader2 class="size-8 animate-spin text-muted-foreground" />
    </div>

    <!-- Grid -->
    <template v-else-if="products.length > 0">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <RouterLink
          v-for="product in products"
          :key="product.id"
          :to="`${linkPrefix}/${product.id}`"
          class="block"
        >
          <slot name="card" :product="product">
            <!-- Default: just show product name -->
            <div class="p-4 border rounded">{{ product.nome }}</div>
          </slot>
        </RouterLink>
      </div>

      <!-- Pagination -->
      <div
        v-if="pagination && pagination.totalPages > 1"
        class="mt-10 flex flex-col items-center gap-4"
      >
        <div class="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            class="size-9"
            :disabled="pagination.page <= 1"
            @click="goToPage(pagination.page - 1)"
          >
            <ChevronLeft class="size-4" />
          </Button>

          <Button
            v-for="page in visiblePages"
            :key="page"
            :variant="page === pagination.page ? 'default' : 'outline'"
            size="icon"
            class="size-9"
            @click="goToPage(page)"
          >
            {{ page }}
          </Button>

          <Button
            variant="outline"
            size="icon"
            class="size-9"
            :disabled="pagination.page >= pagination.totalPages"
            @click="goToPage(pagination.page + 1)"
          >
            <ChevronRight class="size-4" />
          </Button>
        </div>

        <p class="text-sm text-muted-foreground">
          Pagina {{ pagination.page }} di {{ pagination.totalPages }}
        </p>
      </div>
    </template>

    <!-- Empty -->
    <slot v-else name="empty">
      <div class="py-16 text-center text-muted-foreground">
        Nessun prodotto trovato
      </div>
    </slot>
  </div>
</template>
