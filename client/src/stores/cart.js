import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart_items')) || [],
  }),

  getters: {
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    
    totalPrice: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
  },

  actions: {
    addToCart(product) {
      const existingItem = this.items.find(item => item.id === product.id)

      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price), // Pastikan harga angka
            image: product.image,
            quantity: 1
        })
      }
      this.saveCart()
    },

    removeFromCart(productId) {
      this.items = this.items.filter(item => item.id !== productId)
      this.saveCart()
    },
    
    updateQuantity(productId, quantity) {
        const item = this.items.find(i => i.id === productId)
        if (item) {
            item.quantity = quantity
            if (item.quantity <= 0) this.removeFromCart(productId)
        }
        this.saveCart()
    },

    clearCart() {
      this.items = []
      this.saveCart()
    },

    saveCart() {
      localStorage.setItem('cart_items', JSON.stringify(this.items))
    },

    async checkout() {
      const authStore = useAuthStore()
      
      if (!authStore.isAuthenticated) {
        alert('Silakan login terlebih dahulu untuk checkout!')
        return
      }

      // Format data sesuai permintaan Backend (OrderController)
      const payload = {
          items: this.items.map(item => ({
              product_id: item.id,
              quantity: item.quantity
          }))
      }

      try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`
          const response = await axios.post('/orders', payload)
          
          this.clearCart()
          return response.data // Kembalikan data order untuk ditampilkan di Invoice
      } catch (error) {
          throw error.response.data
      }
    }
  }
})