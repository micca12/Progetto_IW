<script setup lang="ts">
import {
  ChevronsUpDown,
  LogIn,
  LogOut,
  User,
  UserPlus,
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

const router = useRouter()
const authStore = useAuthStore()
const { isMobile, setOpenMobile } = useSidebar()

// Genera le iniziali dall'utente
function getInitials(nome: string, cognome: string): string {
  return `${nome.charAt(0)}${cognome.charAt(0)}`.toUpperCase()
}

// Gestisce il logout
function handleLogout() {
  authStore.logout()
  setOpenMobile(false)
  router.push('/')
}

// Naviga e chiude sidebar su mobile
function navigateTo(path: string) {
  setOpenMobile(false)
  router.push(path)
}
</script>

<template>
  <!-- Utente autenticato -->
  <SidebarMenu v-if="authStore.isAuthenticated && authStore.user">
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarFallback class="rounded-lg">
                {{ getInitials(authStore.user.nome, authStore.user.cognome) }}
              </AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">
                {{ authStore.user.nome }} {{ authStore.user.cognome }}
              </span>
              <span class="truncate text-xs">{{ authStore.user.email }}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          align="end"
          :side-offset="4"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarFallback class="rounded-lg">
                  {{ getInitials(authStore.user.nome, authStore.user.cognome) }}
                </AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">
                  {{ authStore.user.nome }} {{ authStore.user.cognome }}
                </span>
                <span class="truncate text-xs">{{ authStore.user.email }}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="navigateTo('/profilo')">
            <User />
            Profilo
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="handleLogout">
            <LogOut />
            Esci
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>

  <!-- Utente non autenticato -->
  <SidebarMenu v-else>
    <SidebarMenuItem>
      <SidebarMenuButton as-child tooltip="Accedi">
        <router-link to="/login" @click="setOpenMobile(false)">
          <LogIn />
          <span>Accedi</span>
        </router-link>
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton as-child tooltip="Registrati">
        <router-link to="/register" @click="setOpenMobile(false)">
          <UserPlus />
          <span>Registrati</span>
        </router-link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
