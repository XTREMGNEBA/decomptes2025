<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Organismes</h1>
      <UButton
        v-if="authStore.isAdmin"
        icon="i-heroicons-plus"
        label="Nouvel organisme"
        @click="navigateTo('/organisms/new')"
      />
    </div>

    <!-- Filtres -->
    <UCard class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UFormGroup label="Type">
          <USelect
            v-model="filters.type"
            :options="typeOptions"
            placeholder="Tous les types"
          />
        </UFormGroup>
        <UFormGroup label="Recherche">
          <UInput
            v-model="filters.search"
            icon="i-heroicons-magnifying-glass"
            placeholder="Rechercher un organisme..."
          />
        </UFormGroup>
      </div>
    </UCard>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-500">Total</p>
          <p class="text-2xl font-bold">{{ stats.total }}</p>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-500">Publics</p>
          <p class="text-2xl font-bold text-blue-500">{{ stats.public }}</p>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-500">Privés</p>
          <p class="text-2xl font-bold text-green-500">{{ stats.private }}</p>
        </div>
      </UCard>
    </div>

    <UCard v-if="pending">
      <USkeleton class="h-8 w-full mb-4" v-for="n in 3" :key="n" />
    </UCard>

    <div v-else-if="filteredOrganisms.length" class="grid gap-4">
      <UCard v-for="organism in filteredOrganisms" :key="organism._id" class="relative">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-semibold">{{ organism.name }}</h3>
            <p class="text-sm text-gray-500">{{ organism.type === 'public' ? 'Public' : 'Privé' }}</p>
          </div>
          <UBadge :color="organism.type === 'public' ? 'blue' : 'green'">
            {{ organism.type === 'public' ? 'Public' : 'Privé' }}
          </UBadge>
        </div>
        
        <div class="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Adresse</p>
            <p>{{ organism.address || 'Non spécifiée' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Contact</p>
            <p>{{ organism.contact.email }}</p>
            <p>{{ organism.contact.phone || 'Non spécifié' }}</p>
          </div>
        </div>

        <div class="mt-4 flex gap-2">
          <UButton
            size="sm"
            color="gray"
            variant="soft"
            icon="i-heroicons-eye"
            @click="navigateTo(`/organisms/${organism._id}`)"
          >
            Voir
          </UButton>
          <UButton
            v-if="authStore.isAdmin"
            size="sm"
            color="primary"
            variant="soft"
            icon="i-heroicons-pencil"
            @click="navigateTo(`/organisms/${organism._id}/edit`)"
          >
            Modifier
          </UButton>
        </div>
      </UCard>
    </div>

    <UCard v-else>
      <p class="text-center text-gray-500">Aucun organisme trouvé</p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Organism } from '~/types'

const authStore = useAuthStore()
const { data: organisms, pending } = await useApi<Organism[]>('/api/organisms')

// Filtres
const filters = ref({
  type: '',
  search: ''
})

const typeOptions = [
  { label: 'Public', value: 'public' },
  { label: 'Privé', value: 'private' }
]

// Filtrage des organismes
const filteredOrganisms = computed(() => {
  if (!organisms.value) return []
  
  return organisms.value.filter(organism => {
    if (filters.value.type && organism.type !== filters.value.type) return false
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      return organism.name.toLowerCase().includes(searchTerm) ||
             organism.address?.toLowerCase().includes(searchTerm) ||
             organism.contact.email.toLowerCase().includes(searchTerm)
    }
    return true
  })
})

// Statistiques
const stats = computed(() => {
  if (!organisms.value) return { total: 0, public: 0, private: 0 }
  
  return organisms.value.reduce((acc, organism) => {
    acc.total++
    if (organism.type === 'public') acc.public++
    if (organism.type === 'private') acc.private++
    return acc
  }, { total: 0, public: 0, private: 0 })
})
</script>