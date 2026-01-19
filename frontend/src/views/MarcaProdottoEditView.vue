<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import apiClient from "@/api/client";
import { toast } from "vue-sonner";
import {
  useAsyncAction,
  useAsyncActionWithParams,
} from "@/composables/useAsyncAction";
import { useConfirmDialog } from "@/composables/useConfirmDialog";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  Save,
  Package,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ConfirmDialog from "@/components/shared/ConfirmDialog.vue";
import type { Prodotto, Ambiente, Materiale, Dimensione } from "@/types";

interface ColoreForm {
  nome: string;
  codice_hex: string;
  prezzi: { dimensione_id: number; prezzo: string }[];
}

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Dati form (tutti i campi raggruppati)
const formData = reactive({
  nome: "",
  descrizione: "",
  base: "",
  numeroMani: undefined as number | undefined,
  coperturaPerLitro: "",
  temperaturaApplicazione: "",
  resistenza: "",
  certificazioni: "",
  schedaTecnicaUrl: "",
  selectedAmbientiMateriali: new Set<string>(),
  colori: [] as ColoreForm[],
});

// Dati catalogo (caricati una volta, read-only)
const catalog = reactive({
  ambienti: [] as Ambiente[],
  materiali: [] as Materiale[],
  dimensioni: [] as Dimensione[],
});

// Prodotto corrente (per edit mode)
const product = ref<Prodotto | null>(null);

// Delete color dialog with useConfirmDialog
const deleteColorDialog = useConfirmDialog<number>();

const isEdit = computed(() => !!route.params.id);
const productId = computed(() =>
  route.params.id ? parseInt(route.params.id as string) : null
);

// Computed for form validation
const isFormValid = computed(() => {
  if (!formData.nome.trim()) return false;
  if (formData.selectedAmbientiMateriali.size === 0) return false;
  const hasValidColor = formData.colori.some((c) => c.nome.trim());
  return hasValidColor;
});

// Computed for save button text
const saveButtonText = computed(() => {
  if (saving.value) return isEdit.value ? "Salvataggio..." : "Creazione...";
  return isEdit.value ? "Salva modifiche" : "Crea prodotto";
});

onMounted(async () => {
  if (!authStore.isMarca) {
    router.push("/");
    return;
  }
  await loadCatalogData();
  if (isEdit.value && productId.value) {
    await loadProduct(productId.value);
  }
});

const { execute: loadCatalogData } = useAsyncAction(
  async () => {
    const [ambRes, matRes, dimRes] = await Promise.all([
      apiClient.get<Ambiente[]>("/catalogo/ambienti"),
      apiClient.get<Materiale[]>("/catalogo/materiali"),
      apiClient.get<Dimensione[]>("/catalogo/dimensioni"),
    ]);

    Object.assign(catalog, {
      ambienti: ambRes.data,
      materiali: matRes.data,
      dimensioni: dimRes.data,
    });
  },
  {
    errorMessage: "Errore caricamento catalogo",
    onError: (err) => toast.error(err),
  }
);

const { loading: loadingProduct, execute: loadProduct } =
  useAsyncActionWithParams<number, Prodotto>(
    (id) =>
      apiClient.get<Prodotto>(`/marca/prodotti/${id}`).then((r) => r.data),
    {
      errorMessage: "Errore caricamento prodotto",
      onSuccess: (data) => {
        product.value = data;
        populateForm(data);
      },
      onError: (err) => {
        toast.error(err);
        router.push("/marca");
      },
    }
  );

// Helper function to transform colors for form (reusable, testable)
function transformColoriForForm(
  colori: Prodotto["colori"],
  dimensioni: Dimensione[]
): ColoreForm[] {
  return (colori || []).map((c) => ({
    nome: c.nome,
    codice_hex: c.codice_hex,
    prezzi: dimensioni.map((d) => ({
      dimensione_id: d.id,
      prezzo: c.prezzi?.find((p) => p.dimensione_id === d.id)?.prezzo || "",
    })),
  }));
}

function populateForm(p: Prodotto) {
  // Object.assign for flat fields
  Object.assign(formData, {
    nome: p.nome,
    descrizione: p.descrizione || "",
    base: p.base || "",
    numeroMani: p.numero_mani ?? undefined,
    coperturaPerLitro: p.copertura_per_litro || "",
    temperaturaApplicazione: p.temperatura_applicazione || "",
    resistenza: p.resistenza || "",
    certificazioni: p.certificazioni || "",
    schedaTecnicaUrl: p.scheda_tecnica_url || "",
  });

  // Transform ambienti_materiali
  formData.selectedAmbientiMateriali = new Set(
    p.prodotti_ambienti_materiali?.map(
      (pam) => `${pam.ambiente_id}-${pam.materiale_id}`
    ) ?? []
  );

  // Transform colori with helper
  formData.colori = transformColoriForForm(p.colori ?? [], catalog.dimensioni);
}

function toggleAmbienteMateriale(ambienteId: number, materialeId: number) {
  const key = `${ambienteId}-${materialeId}`;
  const newSet = new Set(formData.selectedAmbientiMateriali);
  if (newSet.has(key)) {
    newSet.delete(key);
  } else {
    newSet.add(key);
  }
  formData.selectedAmbientiMateriali = newSet;
}

function isAmbienteMaterialeSelected(ambienteId: number, materialeId: number) {
  return formData.selectedAmbientiMateriali.has(`${ambienteId}-${materialeId}`);
}

// Factory function to create empty color (reusable, testable)
function createEmptyColore(): ColoreForm {
  return {
    nome: "",
    codice_hex: "#ffffff",
    prezzi: catalog.dimensioni.map((d) => ({
      dimensione_id: d.id,
      prezzo: "",
    })),
  };
}

function addColore() {
  formData.colori.push(createEmptyColore());
}

// Delete color handler using useConfirmDialog
async function handleDeleteColor() {
  await deleteColorDialog.confirm(async () => {
    if (deleteColorDialog.itemToConfirm.value !== null) {
      formData.colori.splice(deleteColorDialog.itemToConfirm.value, 1);
    }
  });
}

// Helper function to build product payload
function buildProductPayload() {
  // Transform selectedAmbientiMateriali with Array.from
  const ambienti_materiali = Array.from(
    formData.selectedAmbientiMateriali,
    (key) => {
      const [ambiente_id, materiale_id] = key.split("-").map(Number);
      return { ambiente_id, materiale_id };
    }
  );

  // Transform colori
  const colori = formData.colori
    .filter((c) => c.nome.trim())
    .map((c) => ({
      nome: c.nome.trim(),
      codice_hex: c.codice_hex,
      prezzi: c.prezzi
        .filter((p) => p.prezzo && parseFloat(p.prezzo) > 0)
        .map((p) => ({
          dimensione_id: p.dimensione_id,
          prezzo: parseFloat(p.prezzo),
        })),
    }));

  return {
    nome: formData.nome.trim(),
    descrizione: formData.descrizione.trim() || null,
    base: formData.base.trim() || null,
    numero_mani: formData.numeroMani || null,
    copertura_per_litro: formData.coperturaPerLitro.trim() || null,
    temperatura_applicazione: formData.temperaturaApplicazione.trim() || null,
    resistenza: formData.resistenza.trim() || null,
    certificazioni: formData.certificazioni.trim() || null,
    scheda_tecnica_url: formData.schedaTecnicaUrl.trim() || null,
    ambienti_materiali,
    colori,
  };
}

// useAsyncAction for save
const { loading: saving, execute: executeSave } = useAsyncAction(
  async () => {
    const payload = buildProductPayload();

    if (isEdit.value && productId.value) {
      await apiClient.put(`/marca/prodotti/${productId.value}`, payload);
      return { isCreate: false };
    } else {
      const response = await apiClient.post<Prodotto>(
        "/marca/prodotti",
        payload
      );
      return { isCreate: true, id: response.data.id };
    }
  },
  {
    errorMessage: "Errore salvataggio prodotto",
    onSuccess: (result) => {
      if (result) {
        toast.success(
          result.isCreate ? "Prodotto creato" : "Prodotto aggiornato"
        );
        if (result.isCreate && result.id) {
          router.push(`/marca/prodotto/${result.id}`);
        }
      }
    },
    onError: (err) => toast.error(err),
  }
);

// Handler pubblico con validazione
async function handleSave() {
  if (!formData.nome.trim()) {
    toast.error("Il nome è obbligatorio");
    return;
  }
  await executeSave();
}

function goBack() {
  router.push("/marca");
}
</script>

<template>
  <div class="min-h-screen bg-muted/30">
    <!-- Header -->
    <div class="border-b bg-background">
      <div class="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          size="sm"
          class="mb-4 -ml-2 gap-2"
          @click="goBack"
        >
          <ArrowLeft class="size-4" />
          Torna ai prodotti
        </Button>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="flex size-10 items-center justify-center rounded-full bg-primary/10"
            >
              <Package class="size-5 text-primary" />
            </div>
            <div>
              <h1 class="text-2xl font-bold tracking-tight lg:text-3xl">
                {{ isEdit ? "Modifica Prodotto" : "Nuovo Prodotto" }}
              </h1>
              <p
                v-if="isEdit && product"
                class="mt-1 text-sm text-muted-foreground"
              >
                {{ product.nome }}
              </p>
            </div>
          </div>
          <Button
            @click="handleSave"
            :disabled="saving || !isFormValid"
            class="gap-2"
          >
            <Loader2 v-if="saving" class="size-4 animate-spin" />
            <Save v-else class="size-4" />
            {{ saveButtonText }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loadingProduct" class="flex items-center justify-center py-20">
      <Loader2 class="size-8 animate-spin text-muted-foreground" />
    </div>

    <!-- Form -->
    <div v-else class="container mx-auto px-4 py-8">
      <div class="grid gap-8 lg:grid-cols-2">
        <!-- Left Column -->
        <div class="space-y-6">
          <!-- Info Base -->
          <Card>
            <CardHeader>
              <CardTitle>Informazioni Base</CardTitle>
              <CardDescription>Nome e descrizione del prodotto</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="space-y-2">
                <Label for="nome">Nome *</Label>
                <Input
                  id="nome"
                  v-model="formData.nome"
                  placeholder="Nome del prodotto"
                />
              </div>
              <div class="space-y-2">
                <Label for="descrizione">Descrizione</Label>
                <Textarea
                  id="descrizione"
                  v-model="formData.descrizione"
                  placeholder="Descrizione del prodotto"
                  class="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <!-- Specifiche Tecniche -->
          <Card>
            <CardHeader>
              <CardTitle>Specifiche Tecniche</CardTitle>
              <CardDescription>Dettagli tecnici del prodotto</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="base">Base</Label>
                  <Input
                    id="base"
                    v-model="formData.base"
                    placeholder="Es. Acqua, Solvente"
                  />
                </div>
                <div class="space-y-2">
                  <Label for="numeroMani">Numero Mani</Label>
                  <Input
                    id="numeroMani"
                    type="number"
                    v-model.number="formData.numeroMani"
                    placeholder="Es. 2"
                    min="1"
                  />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="copertura">Copertura (m²/L)</Label>
                  <Input
                    id="copertura"
                    v-model="formData.coperturaPerLitro"
                    placeholder="Es. 10-12"
                  />
                </div>
                <div class="space-y-2">
                  <Label for="temperatura">Temperatura Applicazione</Label>
                  <Input
                    id="temperatura"
                    v-model="formData.temperaturaApplicazione"
                    placeholder="Es. 10-30°C"
                  />
                </div>
              </div>
              <div class="space-y-2">
                <Label for="resistenza">Resistenza</Label>
                <Input
                  id="resistenza"
                  v-model="formData.resistenza"
                  placeholder="Es. Acqua, UV, Graffi"
                />
              </div>
              <div class="space-y-2">
                <Label for="certificazioni">Certificazioni</Label>
                <Input
                  id="certificazioni"
                  v-model="formData.certificazioni"
                  placeholder="Es. ISO 9001, CE"
                />
              </div>
              <div class="space-y-2">
                <Label for="scheda">URL Scheda Tecnica</Label>
                <Input
                  id="scheda"
                  v-model="formData.schedaTecnicaUrl"
                  placeholder="https://..."
                  type="url"
                />
              </div>
            </CardContent>
          </Card>

          <!-- Ambienti e Materiali -->
          <Card>
            <CardHeader>
              <CardTitle>Ambienti e Materiali</CardTitle>
              <CardDescription
                >Seleziona dove può essere usato il prodotto</CardDescription
              >
            </CardHeader>
            <CardContent class="space-y-4">
              <div
                v-for="ambiente in catalog.ambienti"
                :key="ambiente.id"
                class="space-y-3"
              >
                <p class="font-medium">{{ ambiente.nome }}</p>
                <div class="flex flex-wrap gap-3">
                  <label
                    v-for="materiale in catalog.materiali"
                    :key="`${ambiente.id}-${materiale.id}`"
                    class="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox
                      :checked="
                        isAmbienteMaterialeSelected(ambiente.id, materiale.id)
                      "
                      @update:checked="
                        toggleAmbienteMateriale(ambiente.id, materiale.id)
                      "
                    />
                    <span class="text-sm">{{ materiale.nome }}</span>
                  </label>
                </div>
                <Separator
                  v-if="
                    ambiente.id !==
                    catalog.ambienti[catalog.ambienti.length - 1]?.id
                  "
                  class="mt-4"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Right Column - Colori -->
        <div class="space-y-6">
          <Card>
            <CardHeader>
              <div class="flex items-center justify-between">
                <div>
                  <CardTitle>Colori e Prezzi</CardTitle>
                  <CardDescription
                    >Gestisci i colori disponibili</CardDescription
                  >
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  @click="addColore"
                  class="gap-2"
                >
                  <Plus class="size-4" />
                  Aggiungi colore
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div
                v-if="formData.colori.length === 0"
                class="text-center py-8 text-muted-foreground"
              >
                <p>Nessun colore aggiunto</p>
                <Button variant="link" @click="addColore" class="mt-2">
                  Aggiungi il primo colore
                </Button>
              </div>

              <div v-else class="space-y-6">
                <div
                  v-for="(colore, index) in formData.colori"
                  :key="index"
                  class="border rounded-lg p-4 space-y-4"
                >
                  <!-- Color Header -->
                  <div class="flex items-start gap-4">
                    <div
                      class="size-16 rounded-lg border-2 shrink-0"
                      :style="{ backgroundColor: colore.codice_hex }"
                    ></div>
                    <div class="flex-1 space-y-3">
                      <div class="flex items-center gap-2">
                        <Input
                          v-model="colore.nome"
                          placeholder="Nome colore"
                          class="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          class="text-destructive hover:text-destructive shrink-0"
                          @click="deleteColorDialog.open(index)"
                        >
                          <Trash2 class="size-4" />
                        </Button>
                      </div>
                      <div class="flex items-center gap-2">
                        <input
                          type="color"
                          v-model="colore.codice_hex"
                          class="h-9 w-14 rounded border cursor-pointer"
                        />
                        <Input
                          v-model="colore.codice_hex"
                          class="w-28 font-mono text-sm"
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Prezzi -->
                  <div class="space-y-2">
                    <Label class="text-sm text-muted-foreground"
                      >Prezzi per dimensione (€)</Label
                    >
                    <div class="grid grid-cols-5 gap-2">
                      <div
                        v-for="prezzo in colore.prezzi"
                        :key="prezzo.dimensione_id"
                        class="space-y-1"
                      >
                        <Label
                          class="text-xs font-normal text-muted-foreground"
                        >
                          {{
                            catalog.dimensioni.find(
                              (d) => d.id === prezzo.dimensione_id
                            )?.litri
                          }}L
                        </Label>
                        <Input
                          v-model="prezzo.prezzo"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          class="h-9 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <!-- Delete Color Dialog -->
    <ConfirmDialog
      v-model:open="deleteColorDialog.isOpen.value"
      :loading="deleteColorDialog.isLoading.value"
      title="Elimina colore"
      description="Sei sicuro di voler eliminare questo colore? I prezzi associati verranno rimossi."
      confirm-label="Elimina"
      :destructive="true"
      @confirm="handleDeleteColor"
    />
  </div>
</template>
