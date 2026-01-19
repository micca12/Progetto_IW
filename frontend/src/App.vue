<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import { computed } from "vue";
import { Toaster } from "@/components/ui/sonner";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AppSidebar from "@/components/layout/AppSidebar.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import ThemeToggle from "@/components/shared/ThemeToggle.vue";
import { useDarkMode } from "@/composables/useDarkMode";

// Initialize dark mode
useDarkMode();

const route = useRoute();

// Check if current route should hide the layout (login, register)
const hideLayout = computed(() => route.meta.hideLayout === true);

// Dynamic breadcrumb based on current route
const breadcrumbs = computed(() => {
  const crumbs: { name: string; path?: string }[] = [
    { name: "Home", path: "/" },
  ];

  if (route.path === "/") {
    return [{ name: "Home" }];
  }

  if (route.path === "/catalogo") {
    crumbs.push({ name: "Catalogo" });
  } else if (route.path.startsWith("/catalogo/")) {
    crumbs.push({ name: "Catalogo", path: "/catalogo" });
    crumbs.push({ name: "Prodotto" });
  } else if (route.path === "/preferiti") {
    crumbs.push({ name: "Preferiti" });
  } else if (route.path === "/profilo") {
    crumbs.push({ name: "Profilo" });
  } else if (route.path.startsWith("/admin")) {
    crumbs.push({ name: "Admin" });
  }

  return crumbs;
});
</script>

<template>
  <!-- Full-screen layout for auth pages (login, register) -->
  <template v-if="hideLayout">
    <RouterView />
    <Toaster position="top-center" richColors />
  </template>

  <!-- Standard layout with sidebar -->
  <SidebarProvider v-else>
    <AppSidebar />
    <SidebarInset>
      <!-- Header -->
      <header
        class="flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div class="flex items-center gap-2">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />

          <!-- Breadcrumb -->
          <Breadcrumb>
            <BreadcrumbList>
              <template v-for="(crumb, index) in breadcrumbs" :key="crumb.name">
                <BreadcrumbItem>
                  <BreadcrumbLink
                    v-if="crumb.path"
                    as-child
                  >
                    <router-link :to="crumb.path">{{ crumb.name }}</router-link>
                  </BreadcrumbLink>
                  <BreadcrumbPage v-else>{{ crumb.name }}</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator v-if="index < breadcrumbs.length - 1" />
              </template>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <!-- Theme Toggle -->
        <ThemeToggle />
      </header>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto">
        <RouterView />
        <AppFooter />
      </main>
    </SidebarInset>

    <!-- Toaster -->
    <Toaster position="top-center" richColors />
  </SidebarProvider>
</template>
