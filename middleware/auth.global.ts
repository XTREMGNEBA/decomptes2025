import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to: { path: string }) => {
  const authStore = useAuthStore()
  const publicRoutes = ['/login', '/register']

  // Always allow access to public routes
  if (publicRoutes.includes(to.path)) {
    return
  }

  // Check authentication for protected routes
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
