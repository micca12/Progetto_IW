<script setup lang="ts">
import { computed } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { toast } from "vue-sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Paintbrush, Loader2, Check } from "lucide-vue-next";

const props = defineProps<{
  mode: "login" | "register";
}>();

const router = useRouter();
const authStore = useAuthStore();
const isLogin = computed(() => props.mode === "login");

// Schema Zod dinamico basato sulla modalità
const formSchema = computed(() => {
  if (isLogin.value) {
    return toTypedSchema(
      z.object({
        email: z
          .string({ required_error: "L'email è obbligatoria" })
          .email("Inserisci un'email valida"),
        password: z.string({ required_error: "La password è obbligatoria" }).min(1, "La password è obbligatoria"),
        // Campi opzionali per evitare errori di validazione quando si passa a register
        nome: z.string().optional(),
        cognome: z.string().optional(),
        confirmPassword: z.string().optional(),
      })
    );
  } else {
    return toTypedSchema(
      z
        .object({
          nome: z.string({ required_error: "Il nome è obbligatorio" }).min(1, "Il nome è obbligatorio"),
          cognome: z.string({ required_error: "Il cognome è obbligatorio" }).min(1, "Il cognome è obbligatorio"),
          email: z
            .string({ required_error: "L'email è obbligatoria" })
            .email("Inserisci un'email valida"),
          password: z
            .string({ required_error: "La password è obbligatoria" })
            .min(8, "La password deve essere di almeno 8 caratteri"),
          confirmPassword: z.string({
            required_error: "Conferma password è obbligatoria",
          }),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Le password non coincidono",
          path: ["confirmPassword"],
        })
    );
  }
});

// Computed titles and texts
const title = computed(() => (isLogin.value ? "Bentornato" : "Crea un account"));
const subtitle = computed(() =>
  isLogin.value
    ? "Inserisci le tue credenziali per accedere"
    : "Registrati per salvare i tuoi preferiti"
);
const submitText = computed(() => (isLogin.value ? "Accedi" : "Crea account"));
const loadingText = computed(() =>
  isLogin.value ? "Accesso in corso..." : "Registrazione in corso..."
);
const successMessage = computed(() =>
  isLogin.value ? "Login effettuato con successo!" : "Registrazione completata con successo!"
);

// Submit handler
async function onSubmit(values: Record<string, unknown>) {
  const success = isLogin.value
    ? await authStore.login(values as { email: string; password: string })
    : await authStore.register(values as { nome: string; cognome: string; email: string; password: string });

  if (success) {
    toast.success(successMessage.value);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push("/");
  } else {
    toast.error(authStore.error || "Errore durante l'operazione");
  }
}

const benefits = [
  "Salva i tuoi prodotti preferiti",
  "Accedi rapidamente alle schede tecniche",
  "Ricevi aggiornamenti su nuovi prodotti",
];
</script>

<template>
  <div class="relative flex min-h-screen w-full items-center justify-center p-6 md:p-10">
    <!-- Background Pattern (solo per login) -->
    <div v-if="isLogin" class="absolute inset-0 -z-10 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
      <div class="absolute -top-40 right-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      <div class="absolute -bottom-40 left-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
    </div>

    <div class="w-full max-w-md">
      <!-- Logo/Brand (solo per login) -->
      <div v-if="isLogin" class="mb-8 text-center">
        <RouterLink to="/" class="inline-flex items-center gap-2">
          <div class="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Paintbrush class="size-5" />
          </div>
          <span class="text-xl font-bold">Catalogo Vernici</span>
        </RouterLink>
      </div>

      <Card class="shadow-xl">
        <CardHeader class="space-y-1 text-center">
          <CardTitle class="text-2xl font-bold">{{ title }}</CardTitle>
          <CardDescription>{{ subtitle }}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            v-slot="{ isSubmitting }"
            :validation-schema="formSchema"
            class="space-y-4"
            @submit="onSubmit"
          >
            <!-- Nome e Cognome (solo register) -->
            <div v-if="!isLogin" class="grid gap-4 sm:grid-cols-2">
              <FormField v-slot="{ componentField }" name="nome">
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Mario"
                      :disabled="isSubmitting"
                      autocomplete="given-name"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="cognome">
                <FormItem>
                  <FormLabel>Cognome</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Rossi"
                      :disabled="isSubmitting"
                      autocomplete="family-name"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <!-- Email -->
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="mario.rossi@example.com"
                    :disabled="isSubmitting"
                    autocomplete="email"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Password -->
            <div>
              <FormField v-slot="{ componentField }" name="password">
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      :placeholder="isLogin ? '' : 'Minimo 8 caratteri'"
                      :disabled="isSubmitting"
                      :autocomplete="isLogin ? 'current-password' : 'new-password'"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Forgot password (solo login) -->
              <div v-if="isLogin" class="mt-1 text-right">
                <a
                  href="#"
                  class="text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                  @click.prevent
                >
                  Password dimenticata?
                </a>
              </div>
            </div>

            <!-- Conferma Password (solo register) -->
            <FormField v-if="!isLogin" v-slot="{ componentField }" name="confirmPassword">
              <FormItem>
                <FormLabel>Conferma Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Ripeti la password"
                    :disabled="isSubmitting"
                    autocomplete="new-password"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <Button
              type="submit"
              :disabled="isSubmitting"
              class="w-full"
              size="lg"
            >
              <Loader2 v-if="isSubmitting" class="mr-2 size-4 animate-spin" />
              {{ isSubmitting ? loadingText : submitText }}
            </Button>
          </Form>

          <!-- Benefits (solo register) -->
          <div v-if="!isLogin" class="mt-6 rounded-lg bg-muted/50 p-4">
            <p class="mb-2 text-xs font-medium text-muted-foreground">
              Perché registrarsi?
            </p>
            <ul class="space-y-1">
              <li
                v-for="benefit in benefits"
                :key="benefit"
                class="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <Check class="size-3 text-primary" />
                {{ benefit }}
              </li>
            </ul>
          </div>

          <div class="relative my-6">
            <Separator />
            <span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              oppure
            </span>
          </div>

          <p class="text-center text-sm text-muted-foreground">
            {{ isLogin ? "Non hai un account?" : "Hai già un account?" }}
            <RouterLink
              :to="isLogin ? '/register' : '/login'"
              class="font-medium text-primary underline-offset-4 hover:underline"
            >
              {{ isLogin ? "Registrati ora" : "Accedi" }}
            </RouterLink>
          </p>
        </CardContent>
      </Card>

      <!-- Footer Links -->
      <p class="mt-6 text-center text-xs text-muted-foreground">
        <RouterLink to="/" class="hover:text-foreground hover:underline">
          Torna alla home
        </RouterLink>
      </p>
    </div>
  </div>
</template>
