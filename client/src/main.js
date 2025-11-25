import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth' // Import store

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Cek status user saat aplikasi mulai
const authStore = useAuthStore()
if (authStore.token) {
    authStore.fetchUser()
}

app.mount('#app')