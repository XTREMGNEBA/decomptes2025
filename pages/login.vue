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
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  try {
    error.value = ''
    loading.value = true
    await authStore.login(email.value, password.value)
  } catch (err: any) {
    error.value = err.message || 'Une erreur est survenue lors de la connexion'
  } finally {
    loading.value = false
  }
}

// Rediriger si l'utilisateur est déjà connecté
if (authStore.isAuthenticated) {
  navigateTo('/')
}
</script>