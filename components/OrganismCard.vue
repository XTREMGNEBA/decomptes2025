<template>
  <UCard class="p-4 bg-white shadow rounded-md">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-xl font-semibold">{{ organism.name }}</h3>
        <p class="text-sm text-gray-500">
          {{ organism.type === 'public' ? 'Public' : 'Privé' }}
          - {{ organism.address }}
        </p>
        <p class="text-sm text-gray-500">
          Email: {{ organism.contact.email }} | Téléphone: {{ organism.contact.phone }}
        </p>
      </div>
      <div class="flex gap-2">
        <UButton
          size="sm"
          color="gray"
          variant="soft"
          icon="i-heroicons-eye"
          @click="$emit('view')"
        >
          Voir
        </UButton>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Organism } from '~/types'

defineProps<{
  organism: Organism
}>()

defineEmits<{
  view: []
}>()
</script>