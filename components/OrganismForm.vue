<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UFormGroup label="Nom de l'organisme" required>
        <UInput
          v-model="formData.name"
          placeholder="Nom de l'organisme"
          required
        />
      </UFormGroup>

      <UFormGroup label="Type d'organisme" required>
        <USelect
          v-model="formData.type"
          :options="typeOptions"
          required
        />
      </UFormGroup>

      <UFormGroup label="Adresse">
        <UInput
          v-model="formData.address"
          placeholder="Adresse complète"
        />
      </UFormGroup>

      <UFormGroup label="Email de contact" required>
        <UInput
          v-model="formData.contact.email"
          type="email"
          placeholder="email@example.com"
          required
        />
      </UFormGroup>

      <UFormGroup label="Téléphone">
        <UInput
          v-model="formData.contact.phone"
          type="tel"
          placeholder="+225 XX XX XX XX"
        />
      </UFormGroup>
    </div>

    <div class="flex justify-end gap-4">
      <UButton
        type="button"
        color="gray"
        variant="soft"
        @click="$emit('cancel')"
      >
        Annuler
      </UButton>
      <UButton
        type="submit"
        color="primary"
        :loading="loading"
      >
        {{ organism ? 'Modifier' : 'Créer' }}
      </UButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Organism } from '~/types'

const props = defineProps<{
  organism?: Organism
}>()

const emit = defineEmits<{
  submit: [data: any]
  cancel: []
}>()

const loading = ref(false)
const formData = ref({
  name: props.organism?.name || '',
  type: props.organism?.type || 'public',
  address: props.organism?.address || '',
  contact: {
    email: props.organism?.contact?.email || '',
    phone: props.organism?.contact?.phone || ''
  }
})

const typeOptions = [
  { label: 'Public', value: 'public' },
  { label: 'Privé', value: 'private' }
]

async function handleSubmit() {
  loading.value = true
  try {
    emit('submit', formData.value)
  } finally {
    loading.value = false
  }
}
</script>