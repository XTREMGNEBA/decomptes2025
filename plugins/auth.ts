export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore()

  // Initialize auth state
  await authStore.initAuth()

  // Add auth header to all requests
  nuxtApp.hooks.hook('app:created', () => {
    const token = authStore.token
    if (token) {
      nuxtApp.vueApp.provide('fetchOptions', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }
  })
})