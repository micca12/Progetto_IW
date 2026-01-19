<script setup lang="ts">
import type { Component } from "vue"
import { Card, CardContent } from "@/components/ui/card"

type ColorVariant = "blue" | "green" | "red" | "purple" | "orange"

interface Props {
  label: string
  value: string | number
  subtitle?: string
  subtitleHighlight?: string
  icon: Component
  color?: ColorVariant
}

withDefaults(defineProps<Props>(), {
  color: "blue",
})

const colorClasses: Record<ColorVariant, { bg: string; icon: string }> = {
  blue: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    icon: "text-blue-600 dark:text-blue-400",
  },
  green: {
    bg: "bg-green-100 dark:bg-green-900/30",
    icon: "text-green-600 dark:text-green-400",
  },
  red: {
    bg: "bg-red-100 dark:bg-red-900/30",
    icon: "text-red-600 dark:text-red-400",
  },
  purple: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    icon: "text-purple-600 dark:text-purple-400",
  },
  orange: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    icon: "text-orange-600 dark:text-orange-400",
  },
}
</script>

<template>
  <Card>
    <CardContent class="pt-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-muted-foreground">{{ label }}</p>
          <p class="text-3xl font-bold">{{ value }}</p>
          <p v-if="subtitle" class="mt-1 text-xs text-muted-foreground">
            <span v-if="subtitleHighlight" class="text-green-600">{{ subtitleHighlight }}</span>
            {{ subtitle }}
          </p>
        </div>
        <div
          class="flex size-12 items-center justify-center rounded-full"
          :class="colorClasses[color].bg"
        >
          <component :is="icon" class="size-6" :class="colorClasses[color].icon" />
        </div>
      </div>
    </CardContent>
  </Card>
</template>
