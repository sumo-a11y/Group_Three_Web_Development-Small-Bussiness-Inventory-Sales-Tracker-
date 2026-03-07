// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

import LandingPage from "@/pages/LandingPage.vue";
import Login from "@/pages/Login.vue";
import SignUp from "@/pages/SignUp.vue";
import BusinessDashboard from "@/pages/BusinessDashboard.vue";
import AdminDashbaord from "@/pages/AdminDashbaord.vue";
import Products from "@/pages/Products.vue";
import Sales from "@/pages/Sales.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: LandingPage, meta: { public: true } },
    { path: "/login", component: Login, meta: { public: true } },
    { path: "/signup", component: SignUp, meta: { public: true } },
    { path: "/products", component: Products, meta: { requiresAuth: true } },

    { path: "/dashboard", component: BusinessDashboard, meta: { requiresAuth: true } },
    {
      path: "/admin", component: AdminDashbaord, meta: { requiresAuth: true, role: "system_admin" }
    },
    { path: "/sales", component: Sales, meta: { requiresAuth: true } }
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();

  const isPublic = to.matched.some((r) => r.meta.public);
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth);

  if (requiresAuth && !auth.isAuthenticated) {
    return { path: "/login", query: { redirect: to.fullPath } };
  }

  // logged-in users shouldn't see login/signup
  if (isPublic && auth.isAuthenticated && (to.path === "/login" || to.path === "/signup")) {
    return { path: auth.role === "system_admin" ? "/admin" : "/dashboard" };
  }

  // role gating
  const requiredRole = to.matched.find((r) => r.meta.role)?.meta?.role;
  if (requiredRole && auth.role !== requiredRole) {
    return { path: "/dashboard" };
  }
});

export default router;