<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Décomptes</h1>
      <UButton
        v-if="canCreateDecompte"
        icon="i-heroicons-plus"
        label="Nouveau décompte"
        @click="navigateTo('/decomptes/new')"
      />
    </div>

    <!-- Filtres -->
    <UCard class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UFormGroup label="Statut">
          <USelect
            v-model="filters.status"
            :options="statusOptions"
            placeholder="Tous les statuts"
          />
        </UFormGroup>
        <UFormGroup label="Organisme">
          <USelect
            v-model="filters.organism"
            :options="organismOptions"
            placeholder="Tous les organismes"
          />
        </UFormGroup>
        <UFormGroup label="Période">
          <USelect
            v-model="filters.period"
            :options="periodOptions"
            placeholder="Toutes les périodes"
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
          <p class="text-sm text-gray-500">En attente</p>
          <p class="text-2xl font-bold text-yellow-500">{{ stats.pending }}</p>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-500">Validés</p>
          <p class="text-2xl font-bold text-green-500">{{ stats.validated }}</p>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-500">Montant total</p>
          <p class="text-2xl font-bold text-blue-500">{{ formatAmount(stats.totalAmount, 'EUR') }}</p>
        </div>
      </UCard>
    </div>

    <UCard v-if="pending">
      <USkeleton class="h-8 w-full mb-4" v-for="n in 3" :key="n" />
    </UCard>

    <div v-else-if="filteredDecomptes.length" class="grid gap-4">
      <UCard v-for="decompte in filteredDecomptes" :key="decompte._id" class="relative">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-semibold">{{ decompte.title }}</h3>
            <p class="text-sm text-gray-500">Ref: {{ decompte.reference }}</p>
          </div>
          <UBadge :color="getStatusColor(decompte.status)">
            {{ formatStatus(decompte.status) }}
          </UBadge>
        </div>
        
        <div class="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Organisme</p>
            <p>{{ decompte.organism?.name }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Montant</p>
            <p>{{ formatAmount(decompte.amount, decompte.currency) }}</p>
          </div>
        </div>

        <div class="mt-4 flex gap-2">
          <UButton
            size="sm"
            color="gray"
            variant="soft"
            icon="i-heroicons-eye"
            @click="navigateTo(`/decomptes/${decompte._id}`)"
          >
            Voir
          </UButton>
          <UButton
            v-if="canValidate(decompte)"
            size="sm"
            color="primary"
            variant="soft"
            icon="i-heroicons-check"
            @click="handleValidate(decompte)"
          >
            Valider
          </UButton>
          <UButton
            v-if="canSign(decompte)"
            size="sm"
            color="primary"
            variant="soft"
            icon="i-heroicons-pencil"
            @click="handleSign(decompte)"
          >
            Signer
          </UButton>
        </div>
      </UCard>
    </div>

    <UCard v-else>
      <p class="text-center text-gray-500">Aucun décompte trouvé</p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type colors from '#tailwind-config/theme/colors'
import { ref, computed } from 'vue'
import type { BadgeColor, Decompte } from '~/types'
import { formatStatus, formatAmount } from '~/utils/format'

const authStore = useAuthStore()
const { data: decomptes, pending } = await useApi<Decompte[]>('/api/decomptes')

// Permissions
const canCreateDecompte = computed(() => {
  return ['admin', 'validator'].includes(authStore.user?.role || '')
})

// Filtres
const filters = ref({
  status: '',
  organism: '',
  period: ''
})

const statusOptions = [
  { label: 'Brouillon', value: 'draft' },
  { label: 'En attente', value: 'pending' },
  { label: 'Validé', value: 'validated' },
  { label: 'Signé', value: 'signed' },
  { label: 'Clôturé', value: 'closed' }
]

const organismOptions = computed(() => {
  const organisms = new Set(decomptes.value?.map(d => d.organism?.name) || [])
  return Array.from(organisms).map(name => ({ label: name, value: name }))
})

const periodOptions = [
  { label: 'Ce mois', value: 'current_month' },
  { label: 'Ce trimestre', value: 'current_quarter' },
  { label: 'Cette année', value: 'current_year' }
]

// Filtrage des décomptes
const filteredDecomptes = computed(() => {
  if (!decomptes.value) return []
  
  return decomptes.value.filter(decompte => {
    if (filters.value.status && decompte.status !== filters.value.status) return false
    if (filters.value.organism && decompte.organism?.name !== filters.value.organism) return false
    // Ajouter la logique de filtrage par période si nécessaire
    return true
  })
})

// Statistiques
const stats = computed(() => {
  if (!decomptes.value) return { total: 0, pending: 0, validated: 0, totalAmount: 0 }
  
  return decomptes.value.reduce((acc, decompte) => {
    acc.total++
    if (decompte.status === 'pending') acc.pending++
    if (decompte.status === 'validated') acc.validated++
    acc.totalAmount += decompte.amount
    return acc
  }, { total: 0, pending: 0, validated: 0, totalAmount: 0 })
})

function getStatusColor(status: 'draft' | 'pending' | 'validated' | 'signed' | 'closed'): BadgeColor {
  const colors = {
    draft: 'gray',
    pending: 'yellow',
    validated: 'blue',
    signed: 'green',
    closed: 'gray'
  } as const satisfies Record<string, BadgeColor>
  return colors[status]
}

function canValidate(decompte: Decompte) {
  return authStore.user?.role === 'validator' && decompte.status === 'pending'
}

function canSign(decompte: Decompte) {
  return authStore.user?.role === 'signer' && decompte.status === 'validated'
}

async function handleValidate(decompte: Decompte) {
  // Implémenter la logique de validation
}

async function handleSign(decompte: Decompte) {
  // Implémenter la logique de signature
}
</script>