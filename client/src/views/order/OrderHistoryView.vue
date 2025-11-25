<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const orders = ref([])
const isLoading = ref(true)

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(value)
}

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric'
    })
}

onMounted(async () => {
    try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`
        const response = await axios.get('/orders')
        orders.value = response.data
    } catch (error) {
        console.error(error)
    } finally {
        isLoading.value = false
    }
})
</script>

<template>
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-6 max-w-5xl mx-auto">
        <h1 class="text-2xl font-bold mb-6 text-gray-900">Riwayat Pesanan Saya</h1>

        <div v-if="isLoading" class="text-center py-10 text-gray-500">
            Memuat data...
        </div>

        <div v-else-if="orders.length === 0" class="text-center py-10">
            <p class="text-gray-500 mb-4">Belum ada riwayat pesanan.</p>
            <router-link to="/" class="text-indigo-600 font-medium hover:underline">Mulai Belanja Sekarang</router-link>
        </div>

        <div v-else class="overflow-hidden bg-white border border-gray-200 rounded-md">
            <ul role="list" class="divide-y divide-gray-200">
                <li v-for="order in orders" :key="order.id" class="px-6 py-4 hover:bg-gray-50 transition">
                    <div class="flex items-center justify-between">
                        <div class="flex flex-col">
                            <p class="text-sm font-medium text-indigo-600 truncate">
                                Invoice #{{ order.invoice_number }}
                            </p>
                            <p class="flex items-center text-sm text-gray-500 mt-1">
                                <span class="truncate">{{ formatDate(order.created_at) }}</span>
                            </p>
                        </div>
                        <div class="flex items-center gap-6">
                            <div class="hidden md:block">
                                <p class="text-sm text-gray-900 font-medium">{{ formatCurrency(order.total_price) }}</p>
                            </div>
                            <div>
                                <span :class="{
                                    'bg-yellow-100 text-yellow-800': order.status === 'pending',
                                    'bg-green-100 text-green-800': order.status === 'paid',
                                }" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize">
                                    {{ order.status }}
                                </span>
                            </div>
                            <div>
                                <router-link :to="`/orders/${order.id}`" class="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                                    Lihat Detail &rarr;
                                </router-link>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>