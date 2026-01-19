<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'
import BrandHeader from './BrandHeader.vue'
import NavLinks from './NavLinks.vue'
import NavUser from './NavUser.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})
</script>

<template>
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <BrandHeader />
    </SidebarHeader>
    <SidebarContent>
      <NavLinks />
    </SidebarContent>
    <SidebarFooter>
      <NavUser />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
