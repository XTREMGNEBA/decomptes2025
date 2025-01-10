<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { formatStatus, formatAmount } from '~/utils/format'
import type { Decompte, Stats } from '~/types'
import { ref } from 'vue'

const authStore = useAuthStore()

// Fetch dashboard stats
const { data: stats } = await useApi<Stats>('/api/dashboard/stats')

// Fetch recent decomptes
const { data: recentDecomptes } = await useApi<Decompte[]>('/api/decomptes?limit=5')

function getStatusColor(status: string): 'gray' | 'yellow' | 'blue' | 'green' | 'red' {
  const colors = {
    draft: 'gray',
    pending: 'yellow',
    validated: 'blue',
    signed: 'green',
    closed: 'gray'
  }
  return (colors[status as keyof typeof colors] || 'gray') as 'gray' | 'yellow' | 'blue' | 'green' | 'red'
}
</script>

<template>
  <div class="bg-cover bg-center min-h-screen">
    <div class="p-6 m-4">
      <div class="mb-1">
        <h1 class="text-3xl font-bold text-gray-800">Tableau de bord administrateur</h1>
        <p class="font-bold text-gray-800">Bienvenue, {{ authStore.user?.firstName }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- Statistiques -->
        <UCard class="bg-gray-800/90 shadow-md">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-document-text" class="text-primary-500" />
              <h3 class="text-lg font-semibold text-gray-50">Décomptes</h3>
            </div>
          </template>
          <div class="text-center">
            <p class="text-3xl font-bold text-primary-500">{{ stats?.decomptes || 0 }}</p>
            <p class="text-sm text-gray-200">Total des décomptes</p>
          </div>
        </UCard>

        <UCard class="bg-gray-800/90 shadow-md">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-building-office" class="text-orange-500" />
              <h3 class="text-lg font-semibold text-gray-50">Organismes</h3>
            </div>
          </template>
          <div class="text-center">
            <p class="text-3xl font-bold text-orange-500">{{ 0 }}</p>
            <p class="text-sm text-gray-200">Organismes enregistrés</p>
          </div>
        </UCard>

        <UCard class="bg-gray-800/90 shadow-md">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-users" class="text-green-500" />
              <h3 class="text-lg font-semibold text-gray-50">Acteurs</h3>
            </div>
          </template>
          <div class="text-center">
            <p class="text-3xl font-bold text-green-500">{{ stats?.users || 0 }}</p>
            <p class="text-sm text-gray-200">Acteurs actifs</p>
          </div>
        </UCard>
      </div>

      <!-- Actions rapides -->
      <UCard class="bg-gray-800/90 shadow-md mb-8">
        <template #header>
          <h3 class="text-lg font-semibold text-gray-50">Actions rapides</h3>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UButton
            block
            color="primary"
            variant="soft"
            icon="i-heroicons-plus"
            to="/decomptes/new"
          >
            Nouveau décompte
          </UButton>
          <UButton
            block
            color="orange"
            variant="soft"
            icon="i-heroicons-building-office-2"
            to="/organisms/new"
          >
            Nouvel organisme
          </UButton>
          <UButton
            block
            color="green"
            variant="soft"
            icon="i-heroicons-user-plus"
            to="/register"
          >
            Nouvel acteur
          </UButton>
        </div>
      </UCard>

      <!-- Derniers décomptes -->
      <UCard class="bg-gray-800/90 shadow-md">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-50">Derniers décomptes</h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-arrow-right"
              to="/decomptes"
            >
              Voir tout
            </UButton>
          </div>
        </template>
        <div v-if="recentDecomptes?.length" class="divide-y divide-gray-700">
          <div v-for="decompte in recentDecomptes" :key="decompte._id" class="py-3">
            <div class="flex justify-between items-center">
              <div>
                <p class="font-medium text-gray-50">{{ decompte.title }}</p>
                <p class="text-sm text-gray-200">{{ decompte.organism?.name }}</p>
              </div>
              <div class="text-right">
                <UBadge :color="getStatusColor(decompte.status)">
                  {{ formatStatus(decompte.status) }}
                </UBadge>
                <p class="text-sm text-gray-200">{{ formatAmount(decompte.amount, decompte.currency) }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-4 text-gray-400">
          Aucun décompte récent
        </div>
      </UCard>
    </div>
  </div>
</template>