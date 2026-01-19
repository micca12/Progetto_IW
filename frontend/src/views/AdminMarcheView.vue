<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import apiClient from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/ui/page-header.vue";
import EmptyState from "@/components/ui/empty-state.vue";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Loader2, Building2 } from "lucide-vue-next";
import { useConfirmDialog } from "@/composables/useConfirmDialog";
import { extractApiError } from "@/utils/apiError";
import type { MarcaConProdotti } from "@/types";

const router = useRouter();
const authStore = useAuthStore();

const marche = ref<MarcaConProdotti[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Create dialog
const createDialogOpen = ref(false);
const createForm = ref({ nome: "", email: "", password: "" });
const creating = ref(false);

// Delete dialog
const {
  isOpen: deleteDialogOpen,
  isLoading: deleting,
  itemToConfirm: marcaToDelete,
  open: openDeleteDialog,
  confirm: confirmDeleteAction,
} = useConfirmDialog<MarcaConProdotti>();

onMounted(async () => {
  if (!authStore.isAdmin) {
    router.push("/");
    return;
  }
  await fetchMarche();
});

async function fetchMarche() {
  loading.value = true;
  error.value = null;
  try {
    const response = await apiClient.get<{ marche: MarcaConProdotti[] }>("/admin/marche");
    marche.value = response.data.marche;
  } catch {
    error.value = "Errore nel caricamento marche";
  } finally {
    loading.value = false;
  }
}

async function handleCreate() {
  if (!createForm.value.nome.trim() || !createForm.value.email.trim() || !createForm.value.password) {
    return;
  }

  creating.value = true;
  error.value = null;
  try {
    await apiClient.post("/admin/marche", createForm.value);
    createDialogOpen.value = false;
    createForm.value = { nome: "", email: "", password: "" };
    await fetchMarche();
  } catch (err) {
    error.value = extractApiError(err, "Errore nella creazione");
  } finally {
    creating.value = false;
  }
}

async function toggleAttivo(marca: MarcaConProdotti) {
  try {
    await apiClient.put(`/admin/marche/${marca.id}`, { attivo: !marca.attivo });
    marca.attivo = !marca.attivo;
  } catch {
    error.value = "Errore nell'aggiornamento";
  }
}

function confirmDelete(marca: MarcaConProdotti) {
  openDeleteDialog(marca);
}

async function handleDelete() {
  if (!marcaToDelete.value) return;

  error.value = null;
  try {
    await confirmDeleteAction(async () => {
      await apiClient.delete(`/admin/marche/${marcaToDelete.value!.id}`);
      await fetchMarche();
    });
  } catch (err) {
    error.value = extractApiError(err, "Errore nell'eliminazione");
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("it-IT");
}
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <PageHeader
      title="Gestione Marche"
      :subtitle="!loading ? `${marche.length} marche registrate` : undefined"
      back-link="/admin"
      back-label="Torna al pannello admin"
    >
      <template #actions>
        <Button @click="createDialogOpen = true" class="gap-2">
          <Plus class="size-4" />
          Nuova Marca
        </Button>
      </template>
    </PageHeader>

    <!-- Content -->
    <div class="container mx-auto px-4 py-6">
      <!-- Error -->
      <div v-if="error" class="mb-4 rounded-md bg-destructive/10 p-4 text-destructive text-sm">
        {{ error }}
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-16">
        <Loader2 class="size-8 animate-spin text-muted-foreground" />
      </div>

      <!-- Table -->
      <Card v-else-if="marche.length > 0">
        <CardContent class="p-0">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b bg-muted/50">
                  <th class="p-4 text-left font-medium">Marca</th>
                  <th class="p-4 text-left font-medium">Email</th>
                  <th class="p-4 text-center font-medium">Prodotti</th>
                  <th class="p-4 text-center font-medium">Registrazione</th>
                  <th class="p-4 text-center font-medium">Stato</th>
                  <th class="p-4 text-center font-medium">Azioni</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="marca in marche" :key="marca.id" class="border-b last:border-0">
                  <td class="p-4">
                    <div class="flex items-center gap-3">
                      <div class="flex size-10 items-center justify-center rounded-lg bg-muted">
                        <Building2 class="size-5 text-muted-foreground" />
                      </div>
                      <span class="font-medium">{{ marca.nome }}</span>
                    </div>
                  </td>
                  <td class="p-4 text-muted-foreground">{{ marca.email }}</td>
                  <td class="p-4 text-center">
                    <Badge variant="secondary">{{ marca._count?.prodotti ?? 0 }}</Badge>
                  </td>
                  <td class="p-4 text-center text-sm text-muted-foreground">
                    {{ formatDate(marca.data_registrazione ?? null) }}
                  </td>
                  <td class="p-4 text-center">
                    <div class="flex items-center justify-center gap-2">
                      <Switch
                        :checked="marca.attivo"
                        @update:checked="toggleAttivo(marca)"
                      />
                      <Badge :variant="marca.attivo ? 'default' : 'secondary'">
                        {{ marca.attivo ? "Attiva" : "Inattiva" }}
                      </Badge>
                    </div>
                  </td>
                  <td class="p-4 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      @click="confirmDelete(marca)"
                      :disabled="(marca._count?.prodotti ?? 0) > 0"
                      class="text-destructive hover:text-destructive"
                      :title="(marca._count?.prodotti ?? 0) > 0 ? 'Non puoi eliminare una marca con prodotti' : 'Elimina marca'"
                    >
                      <Trash2 class="size-4" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <!-- Empty State -->
      <EmptyState
        v-else
        :icon="Building2"
        title="Nessuna marca"
        description="Inizia creando la prima marca"
        action-label="Crea Marca"
        @action="createDialogOpen = true"
      >
        <template #action-icon>
          <Plus class="mr-2 size-4" />
        </template>
      </EmptyState>
    </div>

    <!-- Create Dialog -->
    <Dialog v-model:open="createDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuova Marca</DialogTitle>
        </DialogHeader>
        <form @submit.prevent="handleCreate" class="space-y-4">
          <div class="space-y-2">
            <Label for="create-nome">Nome Marca</Label>
            <Input id="create-nome" v-model="createForm.nome" placeholder="Es. Colorificio Rossi" required />
          </div>
          <div class="space-y-2">
            <Label for="create-email">Email</Label>
            <Input id="create-email" v-model="createForm.email" type="email" placeholder="info@marca.it" required />
          </div>
          <div class="space-y-2">
            <Label for="create-password">Password</Label>
            <Input id="create-password" v-model="createForm.password" type="password" required />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" @click="createDialogOpen = false">
              Annulla
            </Button>
            <Button type="submit" :disabled="creating" class="gap-2">
              <Loader2 v-if="creating" class="size-4 animate-spin" />
              Crea Marca
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Delete Dialog -->
    <AlertDialog v-model:open="deleteDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Elimina marca</AlertDialogTitle>
          <AlertDialogDescription>
            Sei sicuro di voler eliminare "{{ marcaToDelete?.nome }}"?
            Questa azione non può essere annullata.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel :disabled="deleting">Annulla</AlertDialogCancel>
          <AlertDialogAction
            @click="handleDelete"
            :disabled="deleting"
            class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <Loader2 v-if="deleting" class="mr-2 size-4 animate-spin" />
            Elimina
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
