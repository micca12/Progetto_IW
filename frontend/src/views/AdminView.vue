<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/ui/page-header.vue";
import StatCard from "@/components/ui/stat-card.vue";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import {
  VisXYContainer,
  VisStackedBar,
  VisAxis,
  VisLine,
  VisArea,
  VisSingleContainer,
  VisDonut,
} from "@unovis/vue";
import {
  Users,
  Package,
  Heart,
  TrendingUp,
  Shield,
  UserCheck,
} from "lucide-vue-next";

const router = useRouter();
const authStore = useAuthStore();

// Check admin access
onMounted(() => {
  if (!authStore.isAuthenticated || !authStore.isAdmin) {
    router.push("/");
  }
});

// Pagination state
const currentPage = ref(1);
const itemsPerPage = 8;

// Stats
const stats = ref({
  totalUsers: 156,
  totalProducts: 89,
  totalFavorites: 423,
  newUsersThisMonth: 12,
});

// Data-driven stat cards configuration
const statCards = computed(() => [
  {
    label: "Utenti totali",
    value: stats.value.totalUsers,
    subtitleHighlight: `+${stats.value.newUsersThisMonth}`,
    subtitle: " questo mese",
    icon: Users,
    color: "blue" as const,
  },
  {
    label: "Prodotti",
    value: stats.value.totalProducts,
    subtitle: "In catalogo",
    icon: Package,
    color: "green" as const,
  },
  {
    label: "Preferiti",
    value: stats.value.totalFavorites,
    subtitle: "Prodotti salvati",
    icon: Heart,
    color: "red" as const,
  },
  {
    label: "Crescita",
    value: "+24%",
    subtitle: "Rispetto al mese scorso",
    icon: TrendingUp,
    color: "purple" as const,
  },
]);

// Type definitions for chart data
interface RegistrationDataPoint {
  month: string;
  users: number;
}

interface TrendDataPoint {
  month: string;
  favorites: number;
}

interface CategoryDataPoint {
  category: string;
  value: number;
  color: string;
}

interface UserData {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  ruolo: string;
  data_registrazione: string;
}

// Mock users data
const allUsers = ref<UserData[]>([
  { id: 1, nome: "Mario", cognome: "Rossi", email: "mario.rossi@example.com", ruolo: "user", data_registrazione: "2024-01-15" },
  { id: 2, nome: "Luigi", cognome: "Verdi", email: "luigi.verdi@example.com", ruolo: "user", data_registrazione: "2024-02-20" },
  { id: 3, nome: "Anna", cognome: "Bianchi", email: "anna.bianchi@example.com", ruolo: "admin", data_registrazione: "2024-01-10" },
  { id: 4, nome: "Paolo", cognome: "Neri", email: "paolo.neri@example.com", ruolo: "user", data_registrazione: "2024-03-05" },
  { id: 5, nome: "Giulia", cognome: "Russo", email: "giulia.russo@example.com", ruolo: "user", data_registrazione: "2024-03-12" },
  { id: 6, nome: "Marco", cognome: "Ferrari", email: "marco.ferrari@example.com", ruolo: "user", data_registrazione: "2024-04-01" },
  { id: 7, nome: "Sara", cognome: "Romano", email: "sara.romano@example.com", ruolo: "user", data_registrazione: "2024-04-15" },
  { id: 8, nome: "Andrea", cognome: "Colombo", email: "andrea.colombo@example.com", ruolo: "user", data_registrazione: "2024-05-02" },
  { id: 9, nome: "Elena", cognome: "Ricci", email: "elena.ricci@example.com", ruolo: "admin", data_registrazione: "2024-05-10" },
  { id: 10, nome: "Francesco", cognome: "Marino", email: "francesco.marino@example.com", ruolo: "user", data_registrazione: "2024-06-01" },
  { id: 11, nome: "Chiara", cognome: "Greco", email: "chiara.greco@example.com", ruolo: "user", data_registrazione: "2024-06-15" },
  { id: 12, nome: "Luca", cognome: "Bruno", email: "luca.bruno@example.com", ruolo: "user", data_registrazione: "2024-07-01" },
  { id: 13, nome: "Valentina", cognome: "Gallo", email: "valentina.gallo@example.com", ruolo: "user", data_registrazione: "2024-07-20" },
  { id: 14, nome: "Davide", cognome: "Conti", email: "davide.conti@example.com", ruolo: "user", data_registrazione: "2024-08-05" },
  { id: 15, nome: "Federica", cognome: "Costa", email: "federica.costa@example.com", ruolo: "user", data_registrazione: "2024-08-18" },
  { id: 16, nome: "Simone", cognome: "Giordano", email: "simone.giordano@example.com", ruolo: "user", data_registrazione: "2024-09-01" },
]);

const totalPages = computed(() => Math.ceil(allUsers.value.length / itemsPerPage));
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return allUsers.value.slice(start, start + itemsPerPage);
});

// Chart data - Registrations per month
const registrationData: RegistrationDataPoint[] = [
  { month: "Gen", users: 8 },
  { month: "Feb", users: 12 },
  { month: "Mar", users: 15 },
  { month: "Apr", users: 10 },
  { month: "Mag", users: 18 },
  { month: "Giu", users: 22 },
  { month: "Lug", users: 25 },
  { month: "Ago", users: 14 },
  { month: "Set", users: 20 },
  { month: "Ott", users: 28 },
  { month: "Nov", users: 32 },
  { month: "Dic", users: 12 },
];

const barChartConfig: ChartConfig = {
  users: {
    label: "Nuovi utenti",
    color: "hsl(var(--primary))",
  },
};

// Donut chart - Products by category
const categoryData: CategoryDataPoint[] = [
  { category: "Interno", value: 35, color: "hsl(var(--primary))" },
  { category: "Esterno", value: 28, color: "hsl(217, 91%, 60%)" },
  { category: "Legno", value: 18, color: "hsl(142, 71%, 45%)" },
  { category: "Metallo", value: 8, color: "hsl(38, 92%, 50%)" },
];

const donutChartConfig: ChartConfig = {
  interno: { label: "Interno", color: "hsl(var(--primary))" },
  esterno: { label: "Esterno", color: "hsl(217, 91%, 60%)" },
  legno: { label: "Legno", color: "hsl(142, 71%, 45%)" },
  metallo: { label: "Metallo", color: "hsl(38, 92%, 50%)" },
};

// Trend chart - Favorites over time
const trendData: TrendDataPoint[] = [
  { month: "Gen", favorites: 45 },
  { month: "Feb", favorites: 52 },
  { month: "Mar", favorites: 78 },
  { month: "Apr", favorites: 95 },
  { month: "Mag", favorites: 130 },
  { month: "Giu", favorites: 168 },
  { month: "Lug", favorites: 210 },
  { month: "Ago", favorites: 245 },
  { month: "Set", favorites: 298 },
  { month: "Ott", favorites: 345 },
  { month: "Nov", favorites: 398 },
  { month: "Dic", favorites: 423 },
];

const trendChartConfig: ChartConfig = {
  favorites: {
    label: "Preferiti totali",
    color: "hsl(var(--primary))",
  },
};

// Chart accessors
const xAccessor = (_d: RegistrationDataPoint, i: number) => i;
const yAccessorUsers = (d: RegistrationDataPoint) => d.users;
const tickFormatRegistration = (i: number) => registrationData[i]?.month || "";

const xAccessorTrend = (_d: TrendDataPoint, i: number) => i;
const yAccessorFavorites = (d: TrendDataPoint) => d.favorites;
const tickFormatTrend = (i: number) => trendData[i]?.month || "";

const donutValue = (d: CategoryDataPoint) => d.value;
const donutColor = (d: CategoryDataPoint) => d.color;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
</script>

<template>
  <div class="min-h-screen bg-muted/30">
    <!-- Header -->
    <PageHeader
      title="Dashboard Admin"
      subtitle="Panoramica e gestione del sistema"
      :icon="Shield"
    />

    <!-- Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Stats Cards -->
      <div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          v-for="stat in statCards"
          :key="stat.label"
          :label="stat.label"
          :value="stat.value"
          :subtitle-highlight="stat.subtitleHighlight"
          :subtitle="stat.subtitle"
          :icon="stat.icon"
          :color="stat.color"
        />
      </div>

      <!-- Charts Row -->
      <div class="mb-8 grid gap-6 overflow-hidden md:grid-cols-2">
        <!-- Bar Chart - Registrations -->
        <Card class="min-w-0 overflow-hidden">
          <CardHeader>
            <CardTitle>Nuove registrazioni</CardTitle>
            <CardDescription>Utenti registrati per mese nel 2024</CardDescription>
          </CardHeader>
          <CardContent class="w-full">
            <div class="h-[250px] w-full sm:h-[300px]">
              <ChartContainer :config="barChartConfig" class="!h-full !w-full [&_[data-vis-xy-container]]:!w-full [&_svg]:!w-full">
                <VisXYContainer :data="registrationData" :margin="{ top: 20, right: 10, bottom: 40, left: 35 }">
                  <VisStackedBar
                    :x="xAccessor"
                    :y="yAccessorUsers"
                    :bar-padding="0.3"
                    :rounded-corners="4"
                    color="hsl(var(--primary))"
                  />
                  <VisAxis
                    type="x"
                    :tick-format="tickFormatRegistration"
                    :grid-line="false"
                  />
                  <VisAxis type="y" :grid-line="true" />
                </VisXYContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <!-- Area Chart - Favorites Trend -->
        <Card class="min-w-0 overflow-hidden">
          <CardHeader>
            <CardTitle>Trend preferiti</CardTitle>
            <CardDescription>Crescita cumulativa dei preferiti</CardDescription>
          </CardHeader>
          <CardContent class="w-full">
            <div class="h-[250px] w-full sm:h-[300px]">
              <ChartContainer :config="trendChartConfig" class="!h-full !w-full [&_[data-vis-xy-container]]:!w-full [&_svg]:!w-full">
                <VisXYContainer :data="trendData" :margin="{ top: 20, right: 10, bottom: 40, left: 45 }">
                  <VisArea
                    :x="xAccessorTrend"
                    :y="yAccessorFavorites"
                    color="hsl(var(--primary))"
                    :opacity="0.2"
                  />
                  <VisLine
                    :x="xAccessorTrend"
                    :y="yAccessorFavorites"
                    color="hsl(var(--primary))"
                    :line-width="2"
                  />
                  <VisAxis
                    type="x"
                    :tick-format="tickFormatTrend"
                    :grid-line="false"
                  />
                  <VisAxis type="y" :grid-line="true" />
                </VisXYContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Users Table - Full Width -->
      <Card class="mb-6">
        <CardHeader>
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Utenti registrati</CardTitle>
              <CardDescription>{{ allUsers.length }} utenti totali</CardDescription>
            </div>
            <Badge variant="outline" class="w-fit gap-1">
              <UserCheck class="size-3" />
              {{ allUsers.filter(u => u.ruolo === 'admin').length }} admin
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div class="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <div class="inline-block min-w-full align-middle">
              <div class="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utente</TableHead>
                      <TableHead class="hidden sm:table-cell">Email</TableHead>
                      <TableHead>Ruolo</TableHead>
                      <TableHead class="hidden md:table-cell text-right">Registrato</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-for="user in paginatedUsers" :key="user.id">
                      <TableCell>
                        <div>
                          <p class="font-medium">{{ user.nome }} {{ user.cognome }}</p>
                          <p class="text-xs text-muted-foreground sm:hidden">{{ user.email }}</p>
                        </div>
                      </TableCell>
                      <TableCell class="hidden text-muted-foreground sm:table-cell">
                        {{ user.email }}
                      </TableCell>
                      <TableCell>
                        <Badge :variant="user.ruolo === 'admin' ? 'default' : 'secondary'">
                          {{ user.ruolo === 'admin' ? 'Admin' : 'User' }}
                        </Badge>
                      </TableCell>
                      <TableCell class="hidden text-right text-muted-foreground md:table-cell">
                        {{ formatDate(user.data_registrazione) }}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p class="text-sm text-muted-foreground">
              Pagina {{ currentPage }} di {{ totalPages }}
            </p>
            <Pagination
              :total="allUsers.length"
              :items-per-page="itemsPerPage"
              :sibling-count="0"
              :default-page="1"
              v-model:page="currentPage"
            >
              <PaginationContent v-slot="{ items }">
                <PaginationFirst />
                <PaginationPrevious />
                <template v-for="(item, index) in items" :key="index">
                  <PaginationItem
                    v-if="item.type === 'page'"
                    :value="item.value"
                    :is-active="item.value === currentPage"
                  >
                    {{ item.value }}
                  </PaginationItem>
                  <PaginationEllipsis v-else :index="index" />
                </template>
                <PaginationNext />
                <PaginationLast />
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      <!-- Donut Chart -->
      <Card>
        <CardHeader>
          <CardTitle>Prodotti per categoria</CardTitle>
          <CardDescription>Distribuzione dei prodotti</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
            <ChartContainer :config="donutChartConfig" class="h-[200px] w-[200px] sm:h-[250px] sm:w-[250px]">
              <VisSingleContainer :data="categoryData">
                <VisDonut
                  :value="donutValue"
                  :color="donutColor"
                  :arc-width="40"
                  :corner-radius="4"
                  :pad-angle="0.02"
                />
              </VisSingleContainer>
            </ChartContainer>
            <!-- Legend -->
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-1 sm:gap-2">
              <div v-for="item in categoryData" :key="item.category" class="flex items-center gap-2">
                <div class="size-3 shrink-0 rounded-full" :style="{ backgroundColor: item.color }" />
                <span class="text-sm">{{ item.category }}</span>
                <span class="ml-auto text-sm font-medium">{{ item.value }}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
