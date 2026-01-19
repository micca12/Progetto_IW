<script setup lang="ts">
import { computed } from "vue";
import type { LucideIcon } from "lucide-vue-next";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

interface Props {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: "blue" | "emerald" | "amber" | "rose" | "purple" | "cyan";
}

const props = withDefaults(defineProps<Props>(), {
  tone: "blue",
});

const classes = computed(() => {
  switch (props.tone) {
    case "emerald":
      return {
        bg: "from-emerald-50/50 to-emerald-100/30 dark:from-emerald-950/30 dark:to-emerald-900/20",
        iconBg: "bg-emerald-500/10",
        icon: "text-emerald-600 dark:text-emerald-400",
      };
    case "amber":
      return {
        bg: "from-amber-50/50 to-amber-100/30 dark:from-amber-950/30 dark:to-amber-900/20",
        iconBg: "bg-amber-500/10",
        icon: "text-amber-600 dark:text-amber-400",
      };
    case "rose":
      return {
        bg: "from-rose-50/50 to-rose-100/30 dark:from-rose-950/30 dark:to-rose-900/20",
        iconBg: "bg-rose-500/10",
        icon: "text-rose-600 dark:text-rose-400",
      };
    case "purple":
      return {
        bg: "from-purple-50/50 to-purple-100/30 dark:from-purple-950/30 dark:to-purple-900/20",
        iconBg: "bg-purple-500/10",
        icon: "text-purple-600 dark:text-purple-400",
      };
    case "cyan":
      return {
        bg: "from-cyan-50/50 to-cyan-100/30 dark:from-cyan-950/30 dark:to-cyan-900/20",
        iconBg: "bg-cyan-500/10",
        icon: "text-cyan-600 dark:text-cyan-400",
      };
    default:
      return {
        bg: "from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20",
        iconBg: "bg-blue-500/10",
        icon: "text-blue-600 dark:text-blue-400",
      };
  }
});
</script>

<template>
  <Item
    variant="outline"
    class="bg-gradient-to-br hover:opacity-90 transition-opacity"
    :class="classes.bg"
  >
    <ItemMedia class="size-15 rounded-lg" :class="classes.iconBg">
      <component :is="icon" class="size-5" :class="classes.icon" />
    </ItemMedia>

    <ItemContent>
      <ItemTitle class="text-2xl font-bold">
        {{ label }}
      </ItemTitle>
      <ItemDescription>
        {{ value }}
      </ItemDescription>
    </ItemContent>
  </Item>
</template>
