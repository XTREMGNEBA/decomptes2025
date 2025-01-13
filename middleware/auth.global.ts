// middleware/auth.global.ts
import { toast } from 'vue3-toastify'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const publicRoutes = ['/login', '/register']

  // Vérifie si l'utilisateur essaie d'accéder à une page publique (login/register)
  if (publicRoutes.includes(to.path)) {
    // Si l'utilisateur est déjà authentifié
    if (authStore.isAuthenticated) {
      // Si ce n'est pas un admin, afficher une erreur
      if (!authStore.isAdmin) {
        toast.error('Seul un administrateur peut accéder à cette page', {
          autoClose: 5000,
        })
        // Si l'utilisateur est déjà sur /register, ne pas rediriger encore
        if (to.path === '/register') {
          return
        }
        // Redirige l'utilisateur vers une autre page en fonction de son rôle
        return navigateTo(authStore.isAdmin ? '/register' : '/decomptes')
      }
      // Si c'est un admin, on l'envoie sur la page register
      if (to.path !== '/register') {
        return navigateTo('/register')
      }
    }
    return // Si l'utilisateur n'est pas authentifié, on permet l'accès à la page publique
  }

  // Si l'utilisateur n'est pas authentifié, on le redirige vers login
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  // Validation du jeton d'authentification
  const isValid = await authStore.validateToken()
  if (!isValid) {
    // Si le jeton est invalide, redirection vers login
    return navigateTo('/login')
  }
})
