import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'

// Set base URL agar tidak perlu mengetik 'http://localhost:8000/api' terus
axios.defaults.baseURL = 'http://localhost:8000/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null, // Ambil token dari storage jika ada
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async register(userData) {
      try {
        const response = await axios.post('/register', userData)
        // Opsional: Langsung login setelah register
        this.token = response.data.access_token
        this.user = response.data.user
        localStorage.setItem('token', this.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        
        router.push('/') // Redirect ke home
      } catch (error) {
        throw error.response.data
      }
    },

    async login(credentials) {
      try {
        const response = await axios.post('/login', credentials)
        
        this.token = response.data.access_token
        this.user = response.data.user
        
        // Simpan token di LocalStorage agar tidak hilang saat refresh
        localStorage.setItem('token', this.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        
        router.push('/') // Redirect ke home
      } catch (error) {
        throw error.response.data
      }
    },

    async logout() {
      try {
        // Set header token sebelum request logout
        if (this.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
            await axios.post('/logout')
        }
      } catch (error) {
        console.error('Logout error', error)
      } finally {
        // Hapus data lokal apapun yang terjadi di server
        this.token = null
        this.user = null
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        router.push('/login')
      }
    },

    async fetchUser() {
      if (!this.token) return
      
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        const response = await axios.get('/user')
        this.user = response.data
      } catch (error) {
        // Jika token invalid/expired, logout paksa
        this.logout()
      }
    }
  }
})