<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search } from "lucide-vue-next";
</script>

<template>
  <div class="container mx-auto flex min-h-[80vh] items-center justify-center px-4">
    <Card class="w-full max-w-md">
      <CardContent class="py-16 text-center">
        <!-- 404 Number -->
        <div class="mb-6">
          <span class="text-8xl font-bold text-primary/20">404</span>
        </div>

        <!-- Message -->
        <h1 class="text-2xl font-bold">Pagina non trovata</h1>
        <p class="mt-2 text-muted-foreground">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>

        <!-- Actions -->
        <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button as-child>
            <RouterLink to="/">
              <Home class="mr-2 size-4" />
              Torna alla Home
            </RouterLink>
          </Button>
          <Button as-child variant="outline">
            <RouterLink to="/catalogo">
              <Search class="mr-2 size-4" />
              Vai al catalogo
            </RouterLink>
          </Button>
        </div>

        <!-- Back Link -->
        <div class="mt-8">
          <button
            @click="$router.back()"
            class="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft class="size-4" />
            Torna indietro
          </button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
