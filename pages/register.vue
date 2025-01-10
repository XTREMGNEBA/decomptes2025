
<!-- pages\register.vue -->
<template>
  <div class="max-h-screen flex items-center justify-center  ">
    <UCard class="w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-6">Inscription</h1>
      
      <form @submit.prevent="handleRegister" class="space-y-4">
        <UFormGroup label="Prénom">
          <UInput
            v-model="formData.firstName"
            placeholder="Votre prénom"
            required
          />
        </UFormGroup>
        
        <UFormGroup label="Nom">
          <UInput
            v-model="formData.lastName"
            placeholder="Votre nom"
            required
          />
        </UFormGroup>
        
        <UFormGroup label="Email">
          <UInput
            v-model="formData.email"
            type="email"
            placeholder="votre@email.com"
            required
          />
        </UFormGroup>
        
        <UFormGroup label="Mot de passe">
          <UInput
            v-model="formData.password"
            type="password"
            required
          />
        </UFormGroup>
        
        <div class="flex justify-between items-center">
          <NuxtLink to="/login" class="text-sm text-gray-600 hover:text-gray-900">
            Déjà inscrit ? Se connecter
          </NuxtLink>
          
          <UButton
            type="submit"
            :loading="loading"
          >
            S'inscrire
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>


<script setup lang="ts">
definePageMeta({
  middleware: 'admin'  // Utilisez le middleware admin que vous avez créé ou modifié
})

import { useAuthStore } from '~/stores/auth'
const authStore = useAuthStore()
const loading = ref(false)
const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})

async function handleRegister() {
  try {
    loading.value = true
    await authStore.register(formData)
  } catch (error: any) {
    console.error('Register error:', error.message)
    // Ajoutez un traitement d'erreur convivial ici, comme l'affichage d'un toast ou d'un message d'erreur
  } finally {
    loading.value = false
  }
}
 
</script>
