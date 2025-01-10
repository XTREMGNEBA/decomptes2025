export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  
  // Rediriger vers la page de connexion si non authentifié
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
  if (!authStore.isAuthenticated || !authStore.isAdmin) {
    return navigateTo('/')  // Rediriger vers la page d'accueil ou une autre page selon vos besoins
  }
  
  // Rediriger vers /decomptes si l'utilisateur n'est pas admin
  if (!authStore.isAdmin) {
    return navigateTo('/decomptes')
  }
})
