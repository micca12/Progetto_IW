<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import apiClient from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Trash2, Loader2 } from "lucide-vue-next";
import type { Dimensione } from "@/types";

interface ColoreForm {
  nome: string;
  codice_hex: string;
  prezzi: { dimensione_id: number; prezzo: number | undefined }[];
}

interface ColoreInput {
  id?: number;
  nome: string;
  codice_hex: string;
  prezzi?: { dimensione_id: number; prezzo: string; dimensioni?: Dimensione }[];
}

const props = defineProps<{
  open: boolean;
  colori: ColoreInput[];
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "save", colori: ColoreForm[]): void;
}>();

const dimensioni = ref<Dimensione[]>([]);
const loading = ref(false);
const localColori = ref<ColoreForm[]>([]);

onMounted(async () => {
  try {
    const res = await apiClient.get<Dimensione[]>("/catalogo/dimensioni");
    dimensioni.value = res.data;
  } catch {
    console.error("Errore caricamento dimensioni");
  }
});

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      // Initialize local state from props
      localColori.value = props.colori.map((c) => ({
        nome: c.nome,
        codice_hex: c.codice_hex,
        prezzi: dimensioni.value.map((dim) => {
          const existing = c.prezzi?.find((p) => p.dimensione_id === dim.id);
          return {
            dimensione_id: dim.id,
            prezzo: existing ? parseFloat(existing.prezzo) : undefined,
          };
        }),
      }));
      if (localColori.value.length === 0) {
        addColore();
      }
    }
  }
);

function addColore() {
  localColori.value.push({
    nome: "",
    codice_hex: "#FFFFFF",
    prezzi: dimensioni.value.map((dim) => ({
      dimensione_id: dim.id,
      prezzo: undefined,
    })),
  });
}

function removeColore(index: number) {
  localColori.value.splice(index, 1);
}

function handleSave() {
  // Filter valid colors (with name)
  const validColori = localColori.value.filter((c) => c.nome.trim());
  emit("save", validColori);
  emit("update:open", false);
}

function handleCancel() {
  emit("update:open", false);
}
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Gestisci Colori e Prezzi</DialogTitle>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <div class="flex justify-end">
          <Button type="button" variant="outline" size="sm" @click="addColore" class="gap-1">
            <Plus class="size-4" />
            Aggiungi Colore
          </Button>
        </div>

        <div v-for="(colore, index) in localColori" :key="index" class="rounded-lg border p-4 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div
                class="size-10 rounded-lg border"
                :style="{ backgroundColor: colore.codice_hex }"
              />
              <div class="grid gap-2 sm:grid-cols-2">
                <div class="space-y-1">
                  <Label class="text-xs">Nome Colore</Label>
                  <Input v-model="colore.nome" placeholder="Es. Bianco Neve" class="h-9" />
                </div>
                <div class="space-y-1">
                  <Label class="text-xs">Codice Colore</Label>
                  <div class="flex gap-2">
                    <input
                      type="color"
                      v-model="colore.codice_hex"
                      class="h-9 w-12 cursor-pointer rounded border p-1"
                    />
                    <Input v-model="colore.codice_hex" class="h-9 w-24 font-mono text-xs" />
                  </div>
                </div>
              </div>
            </div>
            <Button
              v-if="localColori.length > 1"
              type="button"
              variant="ghost"
              size="icon"
              @click="removeColore(index)"
              class="text-destructive hover:text-destructive"
            >
              <Trash2 class="size-4" />
            </Button>
          </div>

          <!-- Prezzi per dimensione -->
          <div class="grid gap-3 sm:grid-cols-5">
            <div v-for="prezzo in colore.prezzi" :key="prezzo.dimensione_id" class="space-y-1">
              <Label class="text-xs text-muted-foreground">
                {{ dimensioni.find((d) => d.id === prezzo.dimensione_id)?.litri }}L
              </Label>
              <div class="relative">
                <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
                <Input
                  type="number"
                  v-model.number="prezzo.prezzo"
                  step="0.01"
                  min="0"
                  class="h-9 pl-6"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        </div>

        <p v-if="localColori.length === 0" class="text-center text-muted-foreground py-4">
          Nessun colore aggiunto
        </p>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="handleCancel">Annulla</Button>
        <Button @click="handleSave" :disabled="loading">
          <Loader2 v-if="loading" class="mr-2 size-4 animate-spin" />
          Salva Colori
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
