<script setup lang="ts">
import { Paintbrush } from 'lucide-vue-next'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton size="lg" as-child>
        <router-link to="/">
          <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Paintbrush class="size-4" />
          </div>
          <div class="grid flex-1 text-left text-sm leading-tight">
            <span class="truncate font-semibold">Verncat</span>
            <span class="truncate text-xs">Catalogo Vernici</span>
          </div>
        </router-link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
