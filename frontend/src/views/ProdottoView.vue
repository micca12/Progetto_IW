<script setup lang="ts">
import { ref, watchEffect, computed } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { useProductsStore } from "@/stores/products";
import { useFavorites } from "@/composables/useFavorites";
import {
  ArrowLeft,
  Droplets,
  Thermometer,
  Shield,
  Award,
  Layers,
  PaintBucket,
  type LucideIcon,
} from "lucide-vue-next";
import FavoriteButton from "@/components/catalog/FavoriteButton.vue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemActions,
  ItemTitle,
  ItemGroup,
} from "@/components/ui/item";
import ColorPicker from "@/components/product/ColorPicker.vue";
import SpecificationCard from "@/components/product/SpecificationCard.vue";

// Composables
const route = useRoute();
const store = useProductsStore();

// Color selection
const selectedColorId = ref<number | null>(null);

// Format selection
const selectedFormat = ref<string>("");

// Computed per il prezzo del formato selezionato
const selectedPrice = computed(() => {
  if (!selectedColor.value || !selectedFormat.value) return null;
  const prezzo = selectedColor.value.prezzi?.find(
    (p) => String(p.dimensioni?.litri) === selectedFormat.value
  );
  return prezzo ? Number(prezzo.prezzo).toFixed(2) : null;
});

// Favorites
const productId = computed(() => store.currentProduct?.id ?? null);
const { initIfNeeded } = useFavorites(productId);

// Auto-load product when route changes
watchEffect(async () => {
  const id = parseInt(route.params.id as string);
  if (id) {
    await store.fetchProductDetail(id);
    if (store.currentProduct?.colori?.[0]) {
      selectedColorId.value = store.currentProduct.colori[0].id;
    }
  }
  initIfNeeded();
});

const selectedColor = computed(() => {
  return store.currentProduct?.colori?.find(
    (c) => c.id === selectedColorId.value
  );
});

const ambienti = computed(() => {
  const names =
    store.currentProduct?.prodotti_ambienti_materiali
      ?.map((pam) => pam.ambienti?.nome)
      .filter((v): v is string => !!v) || [];
  return [...new Set(names)];
});

const materiali = computed(() => {
  const names =
    store.currentProduct?.prodotti_ambienti_materiali
      ?.map((pam) => pam.materiali?.nome)
      .filter((v): v is string => !!v) || [];
  return [...new Set(names)];
});

const specs = computed(() => {
  const p = store.currentProduct;
  if (!p) return [];

  const result: Array<{
    label: string;
    icon: LucideIcon;
    value: string;
    color: string;
  }> = [];

  if (p.base) {
    result.push({
      label: "Base",
      icon: PaintBucket,
      value: p.base,
      color: "blue",
    });
  }

  if (p.numero_mani) {
    result.push({
      label: "Mani",
      icon: Layers,
      value: String(p.numero_mani),
      color: "emerald",
    });
  }

  if (p.copertura_per_litro) {
    result.push({
      label: "Copertura",
      icon: Droplets,
      value: `${p.copertura_per_litro} m²/L`,
      color: "amber",
    });
  }

  if (p.temperatura_applicazione) {
    result.push({
      label: "Temperatura",
      icon: Thermometer,
      value: p.temperatura_applicazione,
      color: "rose",
    });
  }

  if (p.resistenza) {
    result.push({
      label: "Resistenza",
      icon: Shield,
      value: p.resistenza,
      color: "purple",
    });
  }

  if (p.certificazioni) {
    result.push({
      label: "Certificazioni",
      icon: Award,
      value: p.certificazioni,
      color: "cyan",
    });
  }

  return result;
});
</script>

<template>
  <div class="min-h-screen">
    <Button variant="link" as-child>
      <RouterLink to="/catalogo">
        <ArrowLeft class="size-4" />
        Go Back
      </RouterLink>
    </Button>

    <Item>
      <ItemHeader class="items-start">
        <ItemContent>
          <ItemDescription
            class="text-sm font-medium uppercase tracking-wider"
            >{{ store.currentProduct?.marche?.nome }}</ItemDescription
          >
          <ItemTitle class="mt-1 text-3xl font-bold tracking-tight lg:text-4xl">
            {{ store.currentProduct?.nome }}
          </ItemTitle>
        </ItemContent>
        <ItemActions>
          <FavoriteButton
            v-if="productId"
            :product-id="productId"
            variant="page"
          />
        </ItemActions>
      </ItemHeader>
    </Item>
    <div class="grid lg:grid-cols-2">
      <div
        class="aspect-square transition-colors duration-500 border rounded-2xl m-6"
        :style="{
          backgroundColor: selectedColor?.codice_hex || '#E5E5E5',
        }"
      ></div>
      <div>
        <Card class="shadow-none border-none">
          <CardHeader>
            <CardTitle class="text-2xl lg:text-3xl">
              {{ store.currentProduct?.nome }}
              {{ selectedColor?.nome }}</CardTitle
            >
            <CardDescription class="text-base lg:text-lg">
              {{ store.currentProduct?.colori?.length }} colors available
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ColorPicker
              :colors="store.currentProduct?.colori || []"
              :selected-color-id="selectedColorId"
              @select="selectedColorId = $event"
            />
          </CardContent>
        </Card>

        <Card class="shadow-none border-none">
          <CardHeader>
            <CardTitle class="text-xl lg:text-2xl">Descrizione</CardTitle>
            <CardDescription
              class="mt-2 text-muted-foreground text-sm lg:text-base"
            >
              {{ store.currentProduct?.descrizione }}
            </CardDescription>
            <div class="flex flex-wrap gap-2 mt-4">
              <Badge
                v-for="amb in ambienti"
                :key="amb"
                variant="secondary"
                class="text-sm lg:text-base"
              >
                {{ amb }}
              </Badge>
              <Badge
                v-for="mat in materiali"
                :key="mat"
                variant="outline"
                class="text-sm lg:text-base"
              >
                {{ mat }}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Card
          v-if="selectedColor?.prezzi?.length"
          class="shadow-none border-none"
        >
          <CardHeader>
            <Field class="flex-1 max-w-md">
              <FieldLabel class="text-sm lg:text-base"
                >Select Format</FieldLabel
              >
              <Select v-model="selectedFormat">
                <SelectTrigger class="text-sm lg:text-base">
                  <SelectValue placeholder="Choose format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    :value="String(p.dimensioni?.litri)"
                    v-for="p in selectedColor.prezzi"
                    :key="p.id"
                    class="text-sm lg:text-base"
                  >
                    {{ p.dimensioni?.litri }} Litri
                  </SelectItem>
                </SelectContent>
              </Select>
              <FieldDescription class="text-xs lg:text-sm">
                Choose the size for {{ selectedColor.nome }}
              </FieldDescription>
            </Field>

            <CardAction class="ml-8" v-if="selectedPrice">
              <CardTitle class="text-sm lg:text-base">Prezzo</CardTitle>
              <CardTitle class="text-3xl lg:text-4xl pt-3">
                {{ selectedPrice }} €</CardTitle
              >
            </CardAction>
          </CardHeader>
        </Card>
      </div>
    </div>
    <Card class="shadow-none border-none" v-if="specs.length > 0">
      <CardHeader>
        <CardTitle class="text-2xl font-bold">Specifiche tecniche</CardTitle>
      </CardHeader>
      <CardContent>
        <ItemGroup class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SpecificationCard
            v-for="spec in specs"
            :key="spec.label"
            :icon="spec.icon"
            :label="spec.label"
            :value="spec.value"
            :color="spec.color"
          />
        </ItemGroup>
      </CardContent>
    </Card>
  </div>
</template>
