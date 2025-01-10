<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UFormGroup label="Prénom" required>
        <UInput
          v-model="formData.firstName"
          placeholder="Prénom"
          required
        />
      </UFormGroup>

      <UFormGroup label="Nom" required>
        <UInput
          v-model="formData.lastName"
          placeholder="Nom"
          required
        />
      </UFormGroup>

      <UFormGroup label="Email" required>
        <UInput
          v-model="formData.email"
          type="email"
          placeholder="email@example.com"
          required
        />
      </UFormGroup>

      <UFormGroup label="Mot de passe" required>
        <UInput
          v-model="formData.password"
          type="password"
          placeholder="••••••••"
          required
        />
      </UFormGroup>

      <UFormGroup label="Rôle" required>
        <USelect
          v-model="formData.role"
          :options="roleOptions"
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

      <UFormGroup label="Indicatif pays">
        <UInput
          v-model="formData.countryCode"
          placeholder="+225"
        />
      </UFormGroup>

      <UFormGroup label="Téléphone">
        <UInput
          v-model="formData.phoneNumber"
          type="tel"
          placeholder="XX XX XX XX XX"
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
        {{ user ? 'Modifier' : 'Créer' }}
      </UButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { User, Organism } from '~/types'

const props = defineProps<{
  user?: User
  organisms?: Organism[]
}>()

const emit = defineEmits<{
  submit: [data: any]
  cancel: []
}>()

const loading = ref(false)
const formData = ref({
  firstName: props.user?.firstName || '',
  lastName: props.user?.lastName || '',
  email: props.user?.email || '',
  password: '',
  role: props.user?.role || 'validator',
  organism: props.user?.organism || '',
  countryCode: props.user?.countryCode || '+225',
  phoneNumber: props.user?.phoneNumber || ''
})

const roleOptions = [
  { label: 'Validateur', value: 'validator' },
  { label: 'Auditeur', value: 'auditor' },
  { label: 'Signataire', value: 'signer' }
]

const organismOptions = computed(() => {
  return props.organisms?.map(org => ({
    label: org.name,
    value: org._id
  })) || []
})

async function handleSubmit() {
  loading.value = true
  try {
    emit('submit', formData.value)
  } finally {
    loading.value = false
  }
}
</script>