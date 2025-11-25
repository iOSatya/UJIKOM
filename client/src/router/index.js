import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'
import CartView from '../views/cart/CartView.vue'
import InvoiceView from '../views/order/InvoiceView.vue'       // IMPORT BARU
import OrderHistoryView from '../views/order/OrderHistoryView.vue' // IMPORT BARU

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView,
    },
    {
      path: '/orders',
      name: 'order-history',
      component: OrderHistoryView,
      meta: { requiresAuth: true } // Penanda butuh login (opsional untuk logic middleware)
    },
    {
      path: '/orders/:id',
      name: 'invoice',
      component: InvoiceView,
      meta: { requiresAuth: true }
    },
  ],
})

// Optional: Global Navigation Guard untuk memproteksi halaman order
import { useAuthStore } from '@/stores/auth'

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    if (to.meta.requiresAuth && !authStore.token) {
        next('/login')
    } else {
        next()
    }
})

export default router