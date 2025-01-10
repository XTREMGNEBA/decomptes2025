
<!-- pages\organisms\[id].vue -->
<template>
    <div class="max-h-screen flex items-center justify-center">
      <UCard class="w-full max-w-md">
        <h1 class="text-2xl font-bold text-center mb-6">Ajouter un Organisme</h1>
  
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <UFormGroup label="Nom de l'Organisme">
            <UInput
              v-model="formData.name"
              placeholder="Nom de l'organisme"
              required
            />
          </UFormGroup>
  
          <UFormGroup label="Type d'Organisme">
            <USelect
              v-model="formData.type"
              :options="types"
              required
            />
          </UFormGroup>
  
          <UFormGroup label="Adresse">
            <UInput
              v-model="formData.address"
              placeholder="Adresse de l'organisme"
            />
          </UFormGroup>
  
          <UFormGroup label="Contact Email">
            <UInput
              v-model="formData.contact.email"
              type="email"
              placeholder="Email de contact"
              required
            />
          </UFormGroup>
  
          <UFormGroup label="Contact Téléphone">
            <UInput
              v-model="formData.contact.phone"
              type="tel"
              placeholder="Téléphone de contact"
            />
          </UFormGroup>
  
          <div class="flex justify-between items-center">
            <UButton
              type="submit"
              :loading="loading"
              class="bg-green-600 text-white hover:bg-green-700"
            >
              Ajouter
            </UButton>
          </div>
        </form>
      </UCard>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useAuthStore } from '~/stores/auth'
  import { useRouter } from 'vue-router'
  
  const authStore = useAuthStore()
  const router = useRouter()
  
  const loading = ref(false)
  const formData = ref({
    name: '',
    type: 'public', // Valeur par défaut
    address: '',
    contact: {
      email: '',
      phone: ''
    }
  })
  
  const types = [
    { label: 'Public', value: 'public' },
    { label: 'Private', value: 'private' }
  ]
  

  async function handleSubmit() {
  loading.value = true
  try {
    const response = await $fetch('/api/organisms/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Spécifie que les données sont envoyées en JSON
      },
      body: JSON.stringify(formData.value) // Convertit l'objet en chaîne JSON
    })
    console.log(response)
    router.push('/organisms') // Redirige vers la liste des organismes après ajout réussi
  } catch (error) {
    console.error('Erreur lors de la création de l\'organisme:', error)
  } finally {
    loading.value = false
  }
}

  </script>
  