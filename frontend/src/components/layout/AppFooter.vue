<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Separator } from "@/components/ui/separator";
import { Paintbrush } from "lucide-vue-next";

const currentYear = new Date().getFullYear();

const footerLinks = [
  {
    title: "Navigazione",
    links: [
      { name: "Home", path: "/" },
      { name: "Catalogo", path: "/catalogo" },
      { name: "Preferiti", path: "/preferiti" },
    ],
  },
  {
    title: "Account",
    links: [
      { name: "Accedi", path: "/login" },
      { name: "Registrati", path: "/register" },
    ],
  },
  {
    title: "Filtri rapidi",
    links: [
      { name: "Vernici per interni", path: "/catalogo?ambiente=Interno" },
      { name: "Vernici per esterni", path: "/catalogo?ambiente=Esterno" },
    ],
  },
];
</script>

<template>
  <footer class="border-t bg-muted/30">
    <div class="container mx-auto px-4 py-12">
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Brand -->
        <div>
          <RouterLink to="/" class="flex items-center gap-2">
            <div class="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Paintbrush class="size-4 text-primary-foreground" />
            </div>
            <span class="text-lg font-bold">Verncat</span>
          </RouterLink>
          <p class="mt-4 text-sm text-muted-foreground">
            Il tuo catalogo di vernici professionali. Trova la vernice perfetta
            per ogni progetto.
          </p>
        </div>

        <!-- Link Groups -->
        <div
          v-for="group in footerLinks"
          :key="group.title"
        >
          <h3 class="font-semibold">{{ group.title }}</h3>
          <ul class="mt-4 space-y-2">
            <li v-for="link in group.links" :key="link.name">
              <RouterLink
                :to="link.path"
                class="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {{ link.name }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <Separator class="my-8" />

      <!-- Bottom -->
      <div class="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <p class="text-sm text-muted-foreground">
          &copy; {{ currentYear }} Verncat. Tutti i diritti riservati.
        </p>
        <p class="text-sm text-muted-foreground">
          Progetto universitario - Ingegneria del Web
        </p>
      </div>
    </div>
  </footer>
</template>
