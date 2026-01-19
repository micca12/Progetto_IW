<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Check } from "lucide-vue-next";

interface Color {
  id: number;
  codice_hex: string;
  nome?: string;
}

interface Props {
  colors: Color[];
  selectedColorId: number | null;
  size?: "sm" | "md" | "lg";
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
});

const emit = defineEmits<{
  select: [id: number];
}>();

const sizeClasses = {
  sm: "size-10",
  md: "size-12 lg:size-14",
  lg: "size-16",
};

const checkSizeClasses = {
  sm: "size-4",
  md: "size-5 lg:size-6",
  lg: "size-7",
};
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <Button
      v-for="color in colors"
      :key="color.id"
      size="icon"
      :style="{ backgroundColor: color.codice_hex }"
      @click="emit('select', color.id)"
      :class="[
        sizeClasses[size],
        'rounded-full border-2 transition-all hover:scale-110 focus:outline-none',
        selectedColorId === color.id
          ? 'border-primary ring-2 ring-primary/30'
          : 'border-border hover:border-primary/50',
      ]"
      :aria-label="`Select color ${color.nome || color.id}`"
    >
      <Check
        v-if="selectedColorId === color.id"
        :class="['text-green-300', checkSizeClasses[size]]"
      />
    </Button>
  </div>
</template>
