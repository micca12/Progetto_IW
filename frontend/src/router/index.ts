import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/AuthFormView.vue"),
      props: { mode: "login" },
      meta: { hideLayout: true },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/views/AuthFormView.vue"),
      props: { mode: "register" },
      meta: { hideLayout: true },
    },
    {
      path: "/catalogo",
      name: "catalogo",
      component: () => import("@/views/CatalogoView.vue"),
    },
    {
      path: "/catalogo/:id",
      name: "prodotto",
      component: () => import("@/views/ProdottoView.vue"),
    },
    {
      path: "/preferiti",
      name: "preferiti",
      component: () => import("@/views/PreferitiView.vue"),
    },
    {
      path: "/profilo",
      name: "profilo",
      component: () => import("@/views/ProfiloView.vue"),
    },
    {
      path: "/marca",
      name: "marca",
      component: () => import("@/views/MarcaDashboardView.vue"),
    },
    {
      path: "/marca/prodotto/nuovo",
      name: "marca-prodotto-nuovo",
      component: () => import("@/views/MarcaProdottoEditView.vue"),
    },
    {
      path: "/marca/prodotto/:id",
      name: "marca-prodotto-edit",
      component: () => import("@/views/MarcaProdottoEditView.vue"),
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("@/views/AdminView.vue"),
    },
    {
      path: "/admin/marche",
      name: "admin-marche",
      component: () => import("@/views/AdminMarcheView.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/views/NotFoundView.vue"),
    },
  ],
});

export default router;
