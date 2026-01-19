<script setup lang="ts">
import { onMounted, computed, ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useFavoritesStore } from "@/stores/favorites";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Shield,
  Heart,
  LogOut,
  ShoppingBag,
  Settings,
  ChevronRight,
  Pencil,
  KeyRound,
  Loader2,
} from "lucide-vue-next";
import { toast } from "vue-sonner";

const router = useRouter();
const authStore = useAuthStore();
const favoritesStore = useFavoritesStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);

const initials = computed(() => {
  if (!user.value) return "?";
  return `${user.value.nome.charAt(0)}${user.value.cognome.charAt(0)}`.toUpperCase();
});

const fullName = computed(() => {
  if (!user.value) return "";
  return `${user.value.nome} ${user.value.cognome}`;
});

// Edit profile state
const editDialogOpen = ref(false);
const editNome = ref("");
const editCognome = ref("");
const editEmail = ref("");
const isUpdating = ref(false);

// Password change state
const passwordDialogOpen = ref(false);
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const isChangingPassword = ref(false);

onMounted(async () => {
  if (!isAuthenticated.value) {
    router.push("/login");
    return;
  }

  if (!favoritesStore.initialized) {
    await favoritesStore.fetchFavorites();
  }
});

function openEditDialog() {
  if (user.value) {
    editNome.value = user.value.nome;
    editCognome.value = user.value.cognome;
    editEmail.value = user.value.email;
  }
  editDialogOpen.value = true;
}

async function handleUpdateProfile() {
  if (!editNome.value.trim() || !editCognome.value.trim() || !editEmail.value.trim()) {
    toast.error("Tutti i campi sono obbligatori");
    return;
  }

  isUpdating.value = true;
  const success = await authStore.updateProfile({
    nome: editNome.value.trim(),
    cognome: editCognome.value.trim(),
    email: editEmail.value.trim(),
  });

  if (success) {
    toast.success("Profilo aggiornato con successo");
    editDialogOpen.value = false;
  } else {
    toast.error(authStore.error || "Errore nell'aggiornamento");
  }
  isUpdating.value = false;
}

async function handleChangePassword() {
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    toast.error("Tutti i campi sono obbligatori");
    return;
  }

  if (newPassword.value.length < 8) {
    toast.error("La nuova password deve essere di almeno 8 caratteri");
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    toast.error("Le password non corrispondono");
    return;
  }

  isChangingPassword.value = true;
  const success = await authStore.updatePassword(currentPassword.value, newPassword.value);

  if (success) {
    toast.success("Password aggiornata con successo");
    passwordDialogOpen.value = false;
    currentPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
  } else {
    toast.error(authStore.error || "Errore nell'aggiornamento password");
  }
  isChangingPassword.value = false;
}

function handleLogout() {
  authStore.logout();
  toast.success("Logout effettuato");
  router.push("/");
}

const menuItems = computed(() => [
  {
    icon: Heart,
    label: "I miei preferiti",
    description: `${favoritesStore.count} prodotti salvati`,
    to: "/preferiti",
  },
  {
    icon: ShoppingBag,
    label: "Esplora catalogo",
    description: "Scopri nuovi prodotti",
    to: "/catalogo",
  },
]);
</script>

<template>
  <div class="min-h-screen bg-muted/30">
    <!-- Header -->
    <div class="border-b bg-background">
      <div class="container mx-auto px-4 py-8">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-full bg-primary/10">
            <User class="size-5 text-primary" />
          </div>
          <div>
            <h1 class="text-3xl font-bold tracking-tight">Il tuo profilo</h1>
            <p class="mt-1 text-muted-foreground">Gestisci le tue informazioni</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-8">
      <template v-if="isAuthenticated && user">
        <div class="grid gap-6 lg:grid-cols-3">
          <!-- Left Column: Profile Card -->
          <div class="lg:col-span-1">
            <Card>
              <CardContent class="pt-6">
                <!-- Avatar & Name -->
                <div class="flex flex-col items-center text-center">
                  <Avatar class="size-24 text-2xl">
                    <AvatarFallback class="bg-primary text-primary-foreground">
                      {{ initials }}
                    </AvatarFallback>
                  </Avatar>
                  <h2 class="mt-4 text-xl font-semibold">{{ fullName }}</h2>
                  <Badge variant="secondary" class="mt-2">
                    <Shield class="mr-1 size-3" />
                    {{ user.ruolo === 'admin' ? 'Amministratore' : 'Utente' }}
                  </Badge>
                </div>

                <Separator class="my-6" />

                <!-- User Info -->
                <div class="space-y-4">
                  <div class="flex items-center gap-3">
                    <div class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Mail class="size-4 text-muted-foreground" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-xs text-muted-foreground">Email</p>
                      <p class="truncate font-medium">{{ user.email }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-3">
                    <div class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Heart class="size-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p class="text-xs text-muted-foreground">Preferiti</p>
                      <p class="font-medium">{{ favoritesStore.count }} prodotti</p>
                    </div>
                  </div>
                </div>

                <Separator class="my-6" />

                <!-- Edit Profile Button -->
                <Dialog v-model:open="editDialogOpen">
                  <DialogTrigger as-child>
                    <Button variant="outline" class="mb-3 w-full gap-2" @click="openEditDialog">
                      <Pencil class="size-4" />
                      Modifica profilo
                    </Button>
                  </DialogTrigger>
                  <DialogContent class="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Modifica profilo</DialogTitle>
                      <DialogDescription>
                        Aggiorna le tue informazioni personali
                      </DialogDescription>
                    </DialogHeader>
                    <div class="space-y-4 py-4">
                      <div class="space-y-2">
                        <Label for="edit-nome">Nome</Label>
                        <Input id="edit-nome" v-model="editNome" placeholder="Mario" />
                      </div>
                      <div class="space-y-2">
                        <Label for="edit-cognome">Cognome</Label>
                        <Input id="edit-cognome" v-model="editCognome" placeholder="Rossi" />
                      </div>
                      <div class="space-y-2">
                        <Label for="edit-email">Email</Label>
                        <Input id="edit-email" v-model="editEmail" type="email" placeholder="mario.rossi@email.com" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" @click="editDialogOpen = false">Annulla</Button>
                      <Button @click="handleUpdateProfile" :disabled="isUpdating">
                        <Loader2 v-if="isUpdating" class="mr-2 size-4 animate-spin" />
                        Salva modifiche
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <!-- Logout Button -->
                <Button variant="outline" class="w-full gap-2" @click="handleLogout">
                  <LogOut class="size-4" />
                  Esci dall'account
                </Button>
              </CardContent>
            </Card>
          </div>

          <!-- Right Column: Menu & Actions -->
          <div class="space-y-6 lg:col-span-2">
            <!-- Quick Actions -->
            <Card>
              <CardHeader>
                <CardTitle class="text-lg">Azioni rapide</CardTitle>
                <CardDescription>Accedi rapidamente alle tue sezioni preferite</CardDescription>
              </CardHeader>
              <CardContent class="grid gap-3 sm:grid-cols-2">
                <RouterLink
                  v-for="item in menuItems"
                  :key="item.label"
                  :to="item.to"
                  class="group flex items-center gap-4 rounded-xl border p-4 transition-all hover:border-primary/50 hover:bg-muted/50"
                >
                  <div class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <component :is="item.icon" class="size-6 text-primary" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="font-medium">{{ item.label }}</p>
                    <p class="text-sm text-muted-foreground">{{ item.description }}</p>
                  </div>
                  <ChevronRight class="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </RouterLink>
              </CardContent>
            </Card>

            <!-- Admin Link -->
            <Card v-if="user.ruolo === 'admin'">
              <CardHeader>
                <CardTitle class="text-lg">Area amministratore</CardTitle>
                <CardDescription>Gestisci utenti e visualizza statistiche</CardDescription>
              </CardHeader>
              <CardContent>
                <RouterLink
                  to="/admin"
                  class="group flex items-center gap-4 rounded-xl border border-primary/30 bg-primary/5 p-4 transition-all hover:border-primary hover:bg-primary/10"
                >
                  <div class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Settings class="size-6" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="font-medium">Dashboard Admin</p>
                    <p class="text-sm text-muted-foreground">Statistiche, utenti e gestione</p>
                  </div>
                  <ChevronRight class="size-5 text-primary transition-transform group-hover:translate-x-1" />
                </RouterLink>
              </CardContent>
            </Card>

            <!-- Security Card -->
            <Card>
              <CardHeader>
                <CardTitle class="text-lg">Sicurezza</CardTitle>
                <CardDescription>Gestisci la sicurezza del tuo account</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog v-model:open="passwordDialogOpen">
                  <div class="flex items-center justify-between rounded-lg border p-4">
                    <div class="flex items-center gap-3">
                      <div class="flex size-10 items-center justify-center rounded-lg bg-muted">
                        <KeyRound class="size-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p class="font-medium">Modifica password</p>
                        <p class="text-sm text-muted-foreground">Aggiorna la tua password di accesso</p>
                      </div>
                    </div>
                    <DialogTrigger as-child>
                      <Button variant="outline" size="sm">
                        Modifica
                      </Button>
                    </DialogTrigger>
                  </div>
                  <DialogContent class="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Modifica password</DialogTitle>
                      <DialogDescription>
                        Inserisci la password corrente e scegli una nuova password
                      </DialogDescription>
                    </DialogHeader>
                    <div class="space-y-4 py-4">
                      <div class="space-y-2">
                        <Label for="current-password">Password corrente</Label>
                        <Input id="current-password" v-model="currentPassword" type="password" />
                      </div>
                      <div class="space-y-2">
                        <Label for="new-password">Nuova password</Label>
                        <Input id="new-password" v-model="newPassword" type="password" placeholder="Minimo 8 caratteri" />
                      </div>
                      <div class="space-y-2">
                        <Label for="confirm-password">Conferma nuova password</Label>
                        <Input id="confirm-password" v-model="confirmPassword" type="password" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" @click="passwordDialogOpen = false">Annulla</Button>
                      <Button @click="handleChangePassword" :disabled="isChangingPassword">
                        <Loader2 v-if="isChangingPassword" class="mr-2 size-4 animate-spin" />
                        Aggiorna password
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
