<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const authStore = useAuthStore()
const cartStore = useCartStore()

// Hitung jumlah item di keranjang
const cartItemCount = computed(() => cartStore.totalItems)

const handleLogout = async () => {
  await authStore.logout()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-indigo-600">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          
          <div class="flex items-center">
            <RouterLink to="/" class="flex-shrink-0 text-white font-bold text-xl">
              TokoOnline
            </RouterLink>
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                <RouterLink to="/" class="text-indigo-100 hover:bg-indigo-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Produk
                </RouterLink>
                <RouterLink v-if="authStore.isAuthenticated" to="/orders" class="text-indigo-100 hover:bg-indigo-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Riwayat Pesanan
                </RouterLink>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-4">
            
            <RouterLink to="/cart" class="relative p-2 text-indigo-100 hover:text-white group">
              <span class="sr-only">Keranjang Belanja</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 5c.07.286.074.58.012.868l-.56 2.242c-.2.8-.925 1.383-1.748 1.383h-12.98c-.823 0-1.548-.583-1.748-1.383l-.56-2.242a2.126 2.126 0 01.012-.868l1.263-5M9.75 9.75V6c0-1.125.9-2.025 2.025-2.025 2.025 0 2.025.9 2.025 2.025v3.75" />
              </svg>
              <span v-if="cartItemCount > 0" class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                {{ cartItemCount }}
              </span>
            </RouterLink>

            <div v-if="!authStore.isAuthenticated" class="flex gap-2">
              <RouterLink to="/login" class="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium">
                Masuk
              </RouterLink>
              <RouterLink to="/register" class="bg-white text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-md text-sm font-medium">
                Daftar
              </RouterLink>
            </div>

            <div v-else class="flex items-center gap-4">
              <span class="text-indigo-100 text-sm">Hai, {{ authStore.user?.name }}</span>
              <button @click="handleLogout" class="text-white bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded-md text-sm font-medium">
                Keluar
              </button>
            </div>

          </div>
        </div>
      </div>
    </nav>

    <main>
      <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <RouterView />
      </div>
    </main>
  </div>
</template>