<script setup lang="ts">
import type { Component } from "vue"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Props {
  icon: Component
  title: string
  description?: string
  actionLabel?: string
  actionVariant?: "default" | "outline"
}

withDefaults(defineProps<Props>(), {
  actionVariant: "default",
})

const emit = defineEmits<{
  (e: "action"): void
}>()
</script>

<template>
  <Card class="mx-auto max-w-md">
    <CardContent class="py-16 text-center">
      <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
        <component :is="icon" class="size-8 text-muted-foreground" />
      </div>
      <h3 class="text-lg font-semibold">{{ title }}</h3>
      <p v-if="description" class="mt-2 text-muted-foreground">
        {{ description }}
      </p>
      <Button
        v-if="actionLabel"
        :variant="actionVariant"
        class="mt-6"
        @click="emit('action')"
      >
        <slot name="action-icon" />
        {{ actionLabel }}
      </Button>
    </CardContent>
  </Card>
</template>
