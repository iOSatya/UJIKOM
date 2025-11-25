<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const products = ref([])
const isLoading = ref(true)

// Fungsi untuk mengambil data produk dari Backend Laravel
const fetchProducts = async () => {
  try {
    const response = await axios.get('/products')
    products.value = response.data
  } catch (error) {
    console.error('Gagal mengambil data produk:', error)
  } finally {
    isLoading.value = false
  }
}

// Format Rupiah
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

// Ambil data saat halaman dimuat
onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="bg-white">
    <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h2 class="text-2xl font-bold tracking-tight text-gray-900 mb-6">Katalog Produk</h2>

      <div v-if="isLoading" class="text-center py-20">
        <span class="text-gray-500 text-lg">Memuat produk...</span>
      </div>

      <div v-else class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        <div v-for="product in products" :key="product.id" class="group relative flex flex-col justify-between h-full border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
          
          <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
            <img :src="product.image || 'https://placehold.co/600x400?text=No+Image'" :alt="product.name" class="h-full w-full object-cover object-center lg:h-full lg:w-full">
          </div>

          <div class="mt-4 flex justify-between">
            <div>
              <h3 class="text-sm text-gray-700 font-semibold">
                {{ product.name }}
              </h3>
              <p class="mt-1 text-sm text-gray-500">Stok: {{ product.stock }}</p>
            </div>
            <p class="text-sm font-medium text-gray-900">{{ formatCurrency(product.price) }}</p>
          </div>

          <div class="mt-4">
              <button @click.prevent="cartStore.addToCart(product)" class="cursor-pointer relative z-10 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-500 flex items-center justify-center gap-2 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                <span>+ Keranjang</span>
              </button>
           </div>
        </div>
      </div>
      
      <div v-if="!isLoading && products.length === 0" class="text-center py-20 bg-gray-50 rounded-lg mt-4">
        <p class="text-gray-500">Belum ada produk yang tersedia.</p>
        <p class="text-sm text-gray-400 mt-2">Silakan tambahkan data produk di database.</p>
      </div>

    </div>
  </div>
</template>