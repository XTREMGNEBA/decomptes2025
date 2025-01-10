<script setup lang="ts">
import { ref } from 'vue'
import type { Organism } from '~/types'

const authStore = useAuthStore()
const notification = useNotification()

const formData = ref({
  title: '',
  reference: '',
  amount: 0,
  currency: 'XOF', // FCFA
  organism: '',
  description: ''
})

const { data: organisms } = await useApi<Organism[]>('/api/organisms')

const organismOptions = computed(() => {
  if (!organisms.value) return []
  return organisms.value.map(org => ({
    label: org.name,
    value: org._id
  }))
})

async function handleSubmit() {
  try {
    const response = await $fetch('/api/decomptes', {
      method: 'POST',
      body: {
        ...formData.value,
        createdBy: authStore.user?.id
      }
    })
    notification.success('Décompte créé avec succès')
    navigateTo(`/decomptes/${response._id}`)
  } catch (error: any) {
    notification.error(error.message || 'Erreur lors de la création du décompte')
  }
}
</script>

<template>
  <div>
    <div class="flex items-center gap-4 mb-6">
      <UButton
        icon="i-heroicons-arrow-left"
        variant="ghost"
        @click="navigateTo('/decomptes')"
      />
      <h1 class="text-2xl font-bold">Nouveau décompte</h1>
    </div>

    <UCard>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormGroup label="Titre" required>
            <UInput
              v-model="formData.title"
              placeholder="Titre du décompte"
              required
            />
          </UFormGroup>

          <UFormGroup label="Référence" required>
            <UInput
              v-model="formData.reference"
              placeholder="Référence unique"
              required
            />
          </UFormGroup>

          <UFormGroup label="Montant (FCFA)" required>
            <UInput
              v-model="formData.amount"
              type="number"
              min="0"
              step="1"
              required
            />
          </UFormGroup>

          <UFormGroup label="Organisme" required>
            <USelect
              v-model="formData.organism"
              :options="organismOptions"
              required
            />
          </UFormGroup>

          <UFormGroup label="Description" class="md:col-span-2">
            <UTextarea
              v-model="formData.description"
              rows="4"
              placeholder="Description détaillée du décompte"
            />
          </UFormGroup>
        </div>

        <div class="flex justify-end gap-4">
          <UButton
            type="button"
            color="gray"
            variant="soft"
            @click="navigateTo('/decomptes')"
          >
            Annuler
          </UButton>
          <UButton
            type="submit"
            color="primary"
          >
            Créer le décompte
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>