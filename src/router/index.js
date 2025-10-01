import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("@/views/ProfileView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/shop/:category?",
      name: "shop",
      component: () => import("@/views/ShopView.vue"),
    },
    {
      path: "/product/:id",
      name: "product",
      component: () => import("@/views/ProductView.vue"),
    },
    {
      path: "/cart",
      name: "cart",
      component: () => import("@/views/CartView.vue"),
    },
    {
      path: "/checkout",
      name: "checkout",
      component: () => import("@/views/CheckoutView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/auth/LoginView.vue"),
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("@/views/auth/SignupView.vue"),
    },
    {
      path: "/orders",
      name: "orders",
      component: () => import("@/views/OrdersView.vue"),
      meta: { requiresAuth: true },
    },
    // {
    //   path: "/order/:id",
    //   name: "order-detail",
    //   component: () => import("@/views/OrderView.vue"),
    //   meta: { requiresAuth: true },
    // },
    {
      path: "/order-completion",
      name: "order-completion",
      component: () => import("@/views/OrderCompletView.vue"),
    },
    // {
    //   path: "/payment-success",
    //   name: "payment-success",
    //   component: () => import("@/views/PaymentSuccessful.vue"),
    // },
    {
      path: "/forgot-password",
      name: "forgot-password",
      component: () => import("@/views/auth/ForgotPasswordView.vue"),
    },
    {
      path: "/update-password",
      name: "update-password",
      component: () => import("@/views/auth/UpdatePasswordView.vue"),
    },
    // {
    //   path: "/downloads",
    //   name: "downloads",
    //   component: () => import("@/views/DownloadsView.vue"),
    //   meta: { requiresAuth: true },
    // },
    {
      path: "/terms-of-use",
      name: "terms",
      component: () => import("@/views/policy/TermsView.vue"),
    },
    {
      path: "/privacy-policy",
      name: "privacy",
      component: () => import("@/views/policy/PrivacyView.vue"),
    },
    {
      path: "/cookies-policy",
      name: "cookies",
      component: () => import("@/views/policy/CookiesView.vue"),
    },
    {
      path: "/refunds-policy",
      name: "refunds",
      component: () => import("@/views/policy/RefundsView.vue"),
    },
    // Error pages
    {
      path: "/403",
      name: "forbidden",
      component: () => import("@/views/error/403.vue"),
    },
    {
      path: "/404",
      name: "not-found",
      component: () => import("@/views/error/404.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/404",
    },
  ],
});

// Navigation guard for protected routes
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const { useAuthStore } = await import("@/stores/auth");
    const authStore = useAuthStore();

    // Ensure auth is checked before routing
    await authStore.checkAuth();

    if (!authStore.isLoggedIn) {
      next("/login");
      return;
    }
  }
  next();
});

export default router;
