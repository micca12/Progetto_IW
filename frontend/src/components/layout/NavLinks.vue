<script setup lang="ts">
import { Home, BookOpen, Heart, Settings, Store, Building2 } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

const route = useRoute()
const authStore = useAuthStore()
const { setOpenMobile } = useSidebar()

function handleLinkClick() {
  setOpenMobile(false)
}

const mainLinks = [
  { name: 'Home', url: '/', icon: Home },
  { name: 'Catalogo', url: '/catalogo', icon: BookOpen },
  { name: 'Preferiti', url: '/preferiti', icon: Heart },
]
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>Navigazione</SidebarGroupLabel>
    <SidebarMenu>
      <SidebarMenuItem v-for="link in mainLinks" :key="link.name">
        <SidebarMenuButton
          as-child
          :is-active="route.path === link.url"
          :tooltip="link.name"
        >
          <router-link :to="link.url" @click="handleLinkClick">
            <component :is="link.icon" />
            <span>{{ link.name }}</span>
          </router-link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <!-- Link Admin -->
      <SidebarMenuItem v-if="authStore.isAdmin">
        <SidebarMenuButton
          as-child
          :is-active="route.path === '/admin'"
          tooltip="Admin"
        >
          <router-link to="/admin" @click="handleLinkClick">
            <Settings />
            <span>Admin</span>
          </router-link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem v-if="authStore.isAdmin">
        <SidebarMenuButton
          as-child
          :is-active="route.path === '/admin/marche'"
          tooltip="Gestione Marche"
        >
          <router-link to="/admin/marche" @click="handleLinkClick">
            <Building2 />
            <span>Gestione Marche</span>
          </router-link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>

  <!-- Area Marca (solo per utente con ruolo marca) -->
  <SidebarGroup v-if="authStore.isMarca">
    <SidebarGroupLabel>Area Marca</SidebarGroupLabel>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          as-child
          :is-active="route.path === '/marca'"
          tooltip="I Miei Prodotti"
        >
          <router-link to="/marca" @click="handleLinkClick">
            <Store />
            <span>I Miei Prodotti</span>
          </router-link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>
