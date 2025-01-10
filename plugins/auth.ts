export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore()
  
  // Initialize auth state from localStorage
  if (process.client) {
    authStore.initAuth()
  }
  
  // Add auth header to all requests
  nuxtApp.hooks.hook('app:created', () => {
    const token = authStore.token
    if (token) {
      // Update fetch defaults
      const fetchDefaults = nuxtApp.$fetch.create({
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      nuxtApp.provide('fetch', fetchDefaults)
    }
  })
})