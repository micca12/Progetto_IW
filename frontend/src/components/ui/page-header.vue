<script setup lang="ts">
import type { Component } from "vue"
import { RouterLink } from "vue-router"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-vue-next"

interface Props {
  title: string
  subtitle?: string
  icon?: Component
  backLink?: string
  backLabel?: string
}

withDefaults(defineProps<Props>(), {
  backLabel: "Indietro",
})
</script>

<template>
  <div class="border-b bg-background">
    <div class="container mx-auto px-4 py-6">
      <Button
        v-if="backLink"
        as-child
        variant="ghost"
        size="sm"
        class="mb-4 -ml-2 gap-2"
      >
        <RouterLink :to="backLink">
          <ArrowLeft class="size-4" />
          {{ backLabel }}
        </RouterLink>
      </Button>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            v-if="icon"
            class="flex size-10 items-center justify-center rounded-full bg-primary/10"
          >
            <component :is="icon" class="size-5 text-primary" />
          </div>
          <div>
            <h1 class="text-2xl font-bold tracking-tight lg:text-3xl">{{ title }}</h1>
            <p v-if="subtitle" class="mt-1 text-sm text-muted-foreground">
              {{ subtitle }}
            </p>
          </div>
        </div>
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
