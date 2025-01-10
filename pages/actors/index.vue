<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Acteurs</h1>
      <UButton
        v-if="authStore.isAdmin"
        icon="i-heroicons-plus"
        label="Nouvel acteur"
        @click="navigateTo('/register')"
      />
    </div>

    <!-- Filtres -->
    <UCard class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UFormGroup label="Rôle">
          <USelect
            v-model="filters.role"
            :options="roleOptions"
            placeholder="Tous les rôles"
          />
        </UFormGroup>
        <UFormGroup label="Organisme">
          <USelect
            v-model="filters.organism"
            :options="organismOptions"
            placeholder="Tous les organismes"
          />
        </UFormGroup>
        <UFormGroup label="Recherche">
          <UInput
            v-model="filters.search"
            icon="i-heroicons-magnifying-glass"
            placeholder="Rechercher un acteur..."
          />
        </UFormGroup>
      </div>
    </UCard>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-500">Total</p>
          <p class="text-2xl font-bold">{{ stats.total }}</p>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-500">Validateurs</p>
          <p class="text-2xl font-bold text-blue-500">{{ stats.validators }}</p>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-500">Auditeurs</p>
          <p class="text-2xl font-bold text-green-500">{{ stats.auditors }}</p>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-500">Signataires</p>
          <p class="text-2xl font-bold text-orange-500">{{ stats.signers }}</p>
        </div>
      </UCard>
    </div>

    <UCard v-if="pending">
      <USkeleton class="h-8 w-full mb-4" v-for="n in 3" :key="n" />
    </UCard>

    <div v-else-if="filteredUsers.length" class="grid gap-4">
      <UCard v-for="user in filteredUsers" :key="user._id" class="relative">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-semibold">{{ user.firstName }} {{ user.lastName }}</h3>
            <p class="text-sm text-gray-500">{{ user.email }}</p>
          </div>
          <UBadge :color="getRoleColor(user.role)">
            {{ formatRole(user.role) }}
          </UBadge>
        </div>
        
        <div class="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Organisme</p>
            <p>{{ user.organism?.name || 'Non assigné' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Contact</p>
            <p>{{ user.countryCode }} {{ user.phoneNumber }}</p>
          </div>
        </div>

        <div class="mt-4 flex gap-2">
          <UButton
            v-if="authStore.isAdmin"
            size="sm"
            color="primary"
            variant="soft"
            icon="i-heroicons-pencil"
            @click="navigateTo(`/actors/${user._id}/edit`)"
          >
            Modifier
          </UButton>
        </div>
      </UCard>
    </div>

    <UCard v-else>
      <p class="text-center text-gray-500">Aucun acteur trouvé</p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { User, BadgeColor, Organism } from '~/types'

const authStore = useAuthStore()
const { data: users, pending } = await useApi<User[]>('/api/users')
const { data: organisms } = await useApi<Organism[]>('/api/organisms')

// Filtres
const filters = ref({
  role: '',
  organism: '',
  search: ''
})

const roleOptions = [
  { label: 'Validateur', value: 'validator' },
  { label: 'Auditeur', value: 'auditor' },
  { label: 'Signataire', value: 'signer' }
]

const organismOptions = computed(() => {
  if (!organisms.value) return []
  return organisms.value.map(org => ({
    label: org.name,
    value: org._id
  }))
})

// Filtrage des utilisateurs
const filteredUsers = computed(() => {
  if (!users.value) return []
  
  return users.value.filter(user => {
    if (filters.value.role && user.role !== filters.value.role) return false
    if (filters.value.organism && user.organism?._id !== filters.value.organism) return false
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      return user.firstName?.toLowerCase().includes(searchTerm) ||
             user.lastName?.toLowerCase().includes(searchTerm) ||
             user.email.toLowerCase().includes(searchTerm)
    }
    return true
  })
})

// Statistiques
const stats = computed(() => {
  if (!users.value) return { total: 0, validators: 0, auditors: 0, signers: 0 }
  
  return users.value.reduce((acc, user) => {
    acc.total++
    if (user.role === 'validator') acc.validators++
    if (user.role === 'auditor') acc.auditors++
    if (user.role === 'signer') acc.signers++
    return acc
  }, { total: 0, validators: 0, auditors: 0, signers: 0 })
})

function getRoleColor(role: string): BadgeColor {
  const colors: Record<string, BadgeColor> = {
    validator: 'blue',
    auditor: 'green',
    signer: 'orange',
    admin: 'purple'
  }
  return colors[role] || 'gray'
}

function formatRole(role: string) {
  const labels = {
    validator: 'Validateur',
    auditor: 'Auditeur',
    signer: 'Signataire',
    admin: 'Administrateur'
  }
  return labels[role as keyof typeof labels] || role
}
</script>