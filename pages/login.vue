<template>
  <div class="max-h-screen flex items-center justify-center">
    <UCard class="w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-6">Connexion</h1>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <UFormGroup label="Email">
          <UInput
            v-model="email"
            type="email"
            placeholder="votre@email.com"
            required
          />
        </UFormGroup>
        
        <UFormGroup label="Mot de passe">
          <UInput
            v-model="password"
            type="password"
            required
          />
        </UFormGroup>

        <div v-if="error" class="text-red-500 text-sm mb-4">
          {{ error }}
        </div>
        
        <UButton
          type="submit"
          block
          :loading="loading"
        >
          Se connecter
        </UButton>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
 
 import { toast } from 'vue3-toastify'

const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

  async function handleLogin() {
  try {
    console.log('Tentative de connexion en cours...')
    error.value = ''
    loading.value = true

    // Appel au store pour la connexion
    await authStore.login(email.value, password.value)
    const token = localStorage.getItem('authToken'); // Si vous utilisez localStorage
console.log('Depuis login.vue Token:', token);

    // Vérification de l'état d'authentification après connexion
    if (authStore.isAuthenticated) {
      console.log('Connexion réussie, utilisateur authentifié.')
      
      // Notification de succès
      toast.success('Connexion réussie ! Bienvenue.', { autoClose: 3000 })
      
      // Redirection vers la page d'accueil ou tableau de bord
      navigateTo('/')
    } else {
      console.error('Problème d\'authentification : utilisateur non identifié après connexion.')
      throw new Error('L\'authentification a échoué. Veuillez réessayer.')
    }
  } catch (err: any) {
    // Gestion des erreurs et affichage d'une notification
    error.value = err.message || 'Une erreur est survenue lors de la connexion'
    console.error('Erreur lors de la tentative de connexion : ' + error.value)
    const token = localStorage.getItem('authToken'); // Si vous utilisez localStorage
console.log('Depuis login.vue Token:', token);


    toast.error(error.value, { autoClose: 3000 })
  } finally {
    // Réinitialisation de l'état de chargement
    loading.value = false
    console.log('Fin de la tentative de connexion.')
  }
}


// Rediriger si l'utilisateur est déjà connecté
if (authStore.isAuthenticated) {
  navigateTo('/')
}
</script>
