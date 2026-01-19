<script setup lang="ts">
import { useDarkMode } from "@/composables/useDarkMode";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-vue-next";

const { isDark, toggle } = useDarkMode();
</script>

<template>
  <Button
    variant="ghost"
    size="icon"
    @click="toggle"
    class="size-9"
    :aria-label="isDark ? 'Passa al tema chiaro' : 'Passa al tema scuro'"
  >
    <Sun
      class="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
    />
    <Moon
      class="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
    />
  </Button>
</template>
