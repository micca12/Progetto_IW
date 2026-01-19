<script setup lang="ts">
/**
 * FavoriteButton - Bottone unificato per gestione preferiti
 *
 * Incapsula:
 * - UI (icona cuore, stato loading)
 * - Logica toggle con store
 * - Redirect a login se non autenticato
 * - Toast notifications
 */
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useFavoritesStore } from "@/stores/favorites";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { cn } from "@/lib/utils";

interface Props {
  productId: number;
  /** Variante visiva */
  variant?: "card" | "page";
  /** Classe aggiuntive */
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "card",
});

const router = useRouter();
const authStore = useAuthStore();
const favoritesStore = useFavoritesStore();

// Computed
const isFavorite = computed(() => favoritesStore.isFavorite(props.productId));
const isToggling = computed(() => favoritesStore.toggling === props.productId);
const isAuthenticated = computed(() => authStore.isAuthenticated);

// Styles per variante
const buttonClasses = computed(() => {
  if (props.variant === "card") {
    return cn(
      "absolute right-2 top-2 z-10 size-8 rounded-full bg-white/80 backdrop-blur-sm transition-all hover:bg-white hover:scale-110",
      isFavorite.value && "text-red-500",
      props.class
    );
  }
  // variant === "page"
  return cn("rounded-full", props.class);
});

const buttonVariant = computed(() => {
  if (props.variant === "card") return "ghost";
  return isFavorite.value ? "default" : "outline";
});

// Handler
async function handleClick(e: Event) {
  e.preventDefault();
  e.stopPropagation();

  if (!isAuthenticated.value) {
    toast.info("Accedi per salvare i preferiti");
    router.push("/login");
    return;
  }

  const wasInFavorites = isFavorite.value;
  const success = await favoritesStore.toggleFavorite(props.productId);

  if (success) {
    toast.success(
      wasInFavorites ? "Rimosso dai preferiti" : "Aggiunto ai preferiti"
    );
  } else {
    toast.error(favoritesStore.error || "Errore");
  }
}
</script>

<template>
  <Button
    :variant="buttonVariant"
    size="icon"
    :class="buttonClasses"
    :disabled="isToggling"
    @click="handleClick"
  >
    <Loader2 v-if="isToggling" class="size-4 animate-spin" />
    <Heart
      v-else
      class="size-4 transition-colors"
      :class="{ 'fill-current': isFavorite }"
    />
  </Button>
</template>
