<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Créer un nouvel acteur</h1>
    </div>

    <UCard>
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Nom -->
          <UFormGroup label="Prénom" :error="errors.firstName">
            <UInput
              v-model="actor.firstName"
              placeholder="Prénom de l'acteur"
              required
            />
          </UFormGroup>
          <UFormGroup label="Nom" :error="errors.lastName">
            <UInput
              v-model="actor.lastName"
              placeholder="Nom de l'acteur"
              required
            />
          </UFormGroup>

          <!-- Email et téléphone -->
          <UFormGroup label="Email" :error="errors.email">
            <UInput
              v-model="actor.email"
              type="email"
              placeholder="Email de l'acteur"
              required
            />
          </UFormGroup>
          <UFormGroup label="Téléphone" :error="errors.phoneNumber">
            <UInput
              v-model="actor.phoneNumber"
              type="tel"
              placeholder="Numéro de téléphone"
              required
            />
          </UFormGroup>

          <!-- Rôle -->
          <UFormGroup label="Rôle" :error="errors.role">
            <USelect
              v-model="actor.role"
              :options="roleOptions"
              placeholder="Sélectionner un rôle"
              required
            />
          </UFormGroup>

          <!-- Organisme -->
          <UFormGroup label="Organisme" :error="errors.organism">
            <USelect
              v-model="actor.organism"
              :options="organismOptions"
              placeholder="Sélectionner un organisme"
              required
            />
          </UFormGroup>
        </div>

        <div class="mt-6 flex justify-end">
          <UButton type="submit" color="primary" label="Créer l'acteur" />
        </div>
      </form>
    </UCard>
  </div>
</template>
 

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi' 
import type { User, Organism } from '~/types'

const router = useRouter()

// Définition explicite du type des erreurs
const errors = ref<{
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  role: string,
  organism: string
}>({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  role: '',
  organism: ''
})

// Définition de l'acteur avec les bons types
const actor = ref<User>({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  role: '',
  organism: '',
  _id: '',
  id: '',
  countryCode: null,
})

const roleOptions = [
  { label: 'Validateur', value: 'validator' },
  { label: 'Auditeur', value: 'auditor' },
  { label: 'Signataire', value: 'signer' }
]

const organismOptions = ref<{ label: string; value: string }[]>([])

onMounted(async () => {
  const response = await useApi<{ data: Organism[] }>('/api/organisms')

  console.log('Réponse API:', response)  // Ajouter un log pour voir la réponse

  // Vérifiez si 'response.data' est bien un tableau avant de le traiter
  if (Array.isArray(response.data)) {
    organismOptions.value = response.data.map((org) => ({
      label: org.name,
      value: org._id
    }))
  } else {
    console.error('La réponse de l\'API n\'est pas un tableau', response)
  }
})


function handleSubmit() {
  // Validation simple
  const valid = validateForm()
  if (!valid) return

  // Envoi des données à l'API
  useApi('/api/actors', {
    method: 'POST',
    body: actor.value,
  })
    .then(() => {
      // Redirection après création réussie
      router.push('/actors')
    })
    .catch((error) => {
      console.error(error)
      alert('Erreur lors de la création de l\'acteur.')
    })
}

function validateForm() {
  errors.value = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: '',
    organism: ''
  }

  let isValid = true

  if (!actor.value.firstName) {
    errors.value.firstName = 'Le prénom est requis'
    isValid = false
  }
  if (!actor.value.lastName) {
    errors.value.lastName = 'Le nom est requis'
    isValid = false
  }
  if (!actor.value.email) {
    errors.value.email = 'L\'email est requis'
    isValid = false
  }
  if (!actor.value.phoneNumber) {
    errors.value.phoneNumber = 'Le numéro de téléphone est requis'
    isValid = false
  }
  if (!actor.value.role) {
    errors.value.role = 'Le rôle est requis'
    isValid = false
  }
  if (!actor.value.organism) {
    errors.value.organism = 'L\'organisme est requis'
    isValid = false
  }

  return isValid
}
</script>


<style scoped>
/* Ajoutez vos styles spécifiques ici */
</style>
