<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useMarcaStore } from "@/stores/marca";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/catalog/ProductCard.vue";
import ProductGrid from "@/components/catalog/ProductGrid.vue";
import ConfirmDialog from "@/components/shared/ConfirmDialog.vue";
import PageHeader from "@/components/ui/page-header.vue";
import { Store, Plus, Package } from "lucide-vue-next";
import { toast } from "vue-sonner";
import type { Prodotto, ProdottoLight } from "@/types";

const router = useRouter();
const authStore = useAuthStore();
const marcaStore = useMarcaStore();

// Delete dialog state
const showDeleteDialog = ref(false);
const productToDelete = ref<Prodotto | ProdottoLight | null>(null);
const deleting = ref(false);

onMounted(async () => {
  if (!authStore.isMarca) {
    router.push("/");
    return;
  }
  await marcaStore.fetchProducts();
});

function handleDeleteClick(product: Prodotto | ProdottoLight) {
  productToDelete.value = product;
  showDeleteDialog.value = true;
}

async function confirmDelete() {
  if (!productToDelete.value) return;

  deleting.value = true;
  const success = await marcaStore.deleteProduct(productToDelete.value.id);

  if (success) {
    toast.success("Prodotto eliminato");
  } else {
    toast.error(marcaStore.error || "Errore eliminazione");
  }

  deleting.value = false;
  showDeleteDialog.value = false;
  productToDelete.value = null;
}
</script>

<template>
  <div class="min-h-screen bg-muted/30">
    <!-- Header -->
    <PageHeader
      :title="authStore.user?.marca_nome || 'I miei prodotti'"
      :subtitle="marcaStore.productsCount > 0 ? `${marcaStore.productsCount} ${marcaStore.productsCount === 1 ? 'prodotto' : 'prodotti'}` : undefined"
      :icon="Store"
    >
      <template #actions>
        <Button as-child class="gap-2">
          <RouterLink to="/marca/prodotto/nuovo">
            <Plus class="size-4" />
            Nuovo Prodotto
          </RouterLink>
        </Button>
      </template>
    </PageHeader>

    <!-- Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Empty State -->
      <Card v-if="!marcaStore.loading && marcaStore.products.length === 0" class="mx-auto max-w-md">
        <CardContent class="py-16 text-center">
          <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
            <Package class="size-8 text-muted-foreground" />
          </div>
          <h3 class="text-lg font-semibold">Nessun prodotto</h3>
          <p class="mt-2 text-muted-foreground">
            Inizia a creare i tuoi prodotti per mostrarli nel catalogo
          </p>
          <Button as-child class="mt-6">
            <RouterLink to="/marca/prodotto/nuovo">
              <Plus class="mr-2 size-4" />
              Crea il primo prodotto
            </RouterLink>
          </Button>
        </CardContent>
      </Card>

      <!-- Products Grid -->
      <ProductGrid
        v-else
        :products="marcaStore.products"
        :loading="marcaStore.loading"
      >
        <template #card="{ product }">
          <ProductCard
            :product="product"
            :show-manage-buttons="true"
            :edit-link="`/marca/prodotto/${product.id}`"
            @delete-click="handleDeleteClick(product)"
          />
        </template>
      </ProductGrid>

      <!-- Bottom CTA -->
      <div v-if="marcaStore.products.length > 0" class="mt-12 text-center">
        <p class="text-muted-foreground">Visualizza tutti i prodotti del catalogo</p>
        <Button as-child variant="outline" class="mt-4 gap-2">
          <RouterLink to="/catalogo">
            <Package class="size-4" />
            Vai al catalogo
          </RouterLink>
        </Button>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      v-model:open="showDeleteDialog"
      title="Elimina prodotto"
      :description="`Sei sicuro di voler eliminare '${productToDelete?.nome}'? Questa azione non può essere annullata.`"
      confirm-label="Elimina"
      :loading="deleting"
      :destructive="true"
      @confirm="confirmDelete"
    />
  </div>
</template>
