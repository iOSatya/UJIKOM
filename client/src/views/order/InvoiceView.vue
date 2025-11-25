<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const order = ref(null)
const isLoading = ref(true)
const error = ref(null)

// Format Tanggal
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
}

// Format Rupiah
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

const fetchOrder = async () => {
    try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`
        const response = await axios.get(`/orders/${route.params.id}`)
        order.value = response.data
    } catch (err) {
        error.value = "Gagal memuat pesanan. Pastikan Anda memiliki akses."
        console.error(err)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchOrder()
})
</script>

<template>
    <div class="max-w-3xl mx-auto px-4 py-10 sm:px-6 lg:px-8 bg-white shadow-lg rounded-lg mt-6 print:shadow-none">
        
        <div v-if="isLoading" class="text-center py-10">
            <p>Memuat Invoice...</p>
        </div>

        <div v-else-if="error" class="text-center py-10 text-red-600">
            <p>{{ error }}</p>
            <router-link to="/" class="text-indigo-600 hover:underline mt-4 block">Kembali ke Beranda</router-link>
        </div>

        <div v-else>
            <div class="border-b border-gray-200 pb-6 flex justify-between items-start">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Invoice</h1>
                    <p class="mt-2 text-gray-500">#{{ order.invoice_number }}</p>
                </div>
                <div class="text-right">
                    <p class="font-medium text-gray-900">Status: 
                        <span :class="{
                            'text-yellow-600 bg-yellow-100 px-2 py-1 rounded': order.status === 'pending',
                            'text-green-600 bg-green-100 px-2 py-1 rounded': order.status === 'paid',
                            'text-red-600 bg-red-100 px-2 py-1 rounded': order.status === 'cancelled'
                        }">{{ order.status.toUpperCase() }}</span>
                    </p>
                    <p class="mt-2 text-sm text-gray-500">{{ formatDate(order.created_at) }}</p>
                </div>
            </div>

            <div class="mt-8">
                <h2 class="text-lg font-medium text-gray-900 mb-4">Rincian Pesanan</h2>
                <div class="flow-root">
                    <ul class="-my-6 divide-y divide-gray-200">
                        <li v-for="item in order.items" :key="item.id" class="flex py-6">
                            <div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img :src="item.product?.image || 'https://placehold.co/150'" class="h-full w-full object-cover object-center">
                            </div>
                            <div class="ml-4 flex flex-1 flex-col">
                                <div>
                                    <div class="flex justify-between text-base font-medium text-gray-900">
                                        <h3>{{ item.product?.name }}</h3>
                                        <p>{{ formatCurrency(item.price * item.quantity) }}</p>
                                    </div>
                                    <p class="text-sm text-gray-500">{{ item.quantity }} x {{ formatCurrency(item.price) }}</p>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="mt-8 border-t border-gray-200 pt-6">
                <div class="flex justify-between text-base font-medium text-gray-900">
                    <p>Total Tagihan</p>
                    <p class="text-xl text-indigo-600">{{ formatCurrency(order.total_price) }}</p>
                </div>
                <p class="mt-2 text-sm text-gray-500 text-right italic">Terima kasih telah berbelanja di TokoOnline.</p>
            </div>

            <div class="mt-10 flex justify-end gap-4 print:hidden">
                <button onclick="window.print()" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                    Cetak Invoice
                </button>
                <router-link to="/" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    Belanja Lagi
                </router-link>
            </div>
        </div>
    </div>
</template>