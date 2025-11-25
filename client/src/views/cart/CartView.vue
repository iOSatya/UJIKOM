<script setup>
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()
const isProcessing = ref(false)

// Format Rupiah
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

const handleCheckout = async () => {
  if (!authStore.isAuthenticated) {
    alert('Silakan login terlebih dahulu untuk melanjutkan checkout.')
    router.push('/login')
    return
  }

  if (confirm('Apakah Anda yakin ingin memproses pesanan ini?')) {
    isProcessing.value = true
    try {
      const orderData = await cartStore.checkout()
      // Jika berhasil, redirect ke halaman invoice/detail order
      alert('Checkout berhasil!')
      router.push(`/orders/${orderData.order.id}`)
    } catch (error) {
      console.error(error)
      alert('Gagal melakukan checkout. Silakan coba lagi.')
    } finally {
      isProcessing.value = false
    }
  }
}
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-6">
    <h1 class="text-2xl font-bold mb-6 text-gray-900">Keranjang Belanja</h1>

    <div v-if="cartStore.items.length === 0" class="text-center py-12">
      <p class="text-gray-500 mb-4">Keranjang belanja Anda masih kosong.</p>
      <router-link to="/" class="text-indigo-600 hover:text-indigo-500 font-medium">
        &larr; Mulai Belanja
      </router-link>
    </div>

    <div v-else>
      <div class="flow-root">
        <ul role="list" class="-my-6 divide-y divide-gray-200">
          <li v-for="item in cartStore.items" :key="item.id" class="flex py-6">
            <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
              <img :src="item.image || 'https://placehold.co/200'" :alt="item.name" class="h-full w-full object-cover object-center">
            </div>

            <div class="ml-4 flex flex-1 flex-col">
              <div>
                <div class="flex justify-between text-base font-medium text-gray-900">
                  <h3>{{ item.name }}</h3>
                  <p class="ml-4">{{ formatCurrency(item.price * item.quantity) }}</p>
                </div>
                <p class="mt-1 text-sm text-gray-500">Harga satuan: {{ formatCurrency(item.price) }}</p>
              </div>
              
              <div class="flex flex-1 items-end justify-between text-sm">
                <div class="flex items-center border border-gray-300 rounded">
                    <button @click="cartStore.updateQuantity(item.id, item.quantity - 1)" class="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50" :disabled="item.quantity <= 1">-</button>
                    <span class="px-2 py-1 text-gray-900">{{ item.quantity }}</span>
                    <button @click="cartStore.updateQuantity(item.id, item.quantity + 1)" class="px-2 py-1 text-gray-600 hover:bg-gray-100">+</button>
                </div>

                <div class="flex">
                  <button @click="cartStore.removeFromCart(item.id)" type="button" class="font-medium text-red-600 hover:text-red-500">Hapus</button>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="border-t border-gray-200 px-4 py-6 sm:px-6 mt-6">
        <div class="flex justify-between text-base font-medium text-gray-900">
          <p>Total Bayar</p>
          <p>{{ formatCurrency(cartStore.totalPrice) }}</p>
        </div>
        <p class="mt-0.5 text-sm text-gray-500">Ongkos kirim dihitung saat konfirmasi akhir.</p>
        
        <div class="mt-6">
          <button 
            @click="handleCheckout" 
            :disabled="isProcessing"
            class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {{ isProcessing ? 'Memproses...' : 'Checkout Sekarang' }}
          </button>
        </div>
        <div class="mt-6 flex justify-center text-center text-sm text-gray-500">
          <p>
            atau
            <router-link to="/" class="font-medium text-indigo-600 hover:text-indigo-500">
              Lanjutkan Belanja &rarr;
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>