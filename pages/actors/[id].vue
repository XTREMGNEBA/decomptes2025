<template>
  <div>
    <UCard v-if="actor">
      <div class="text-center">
        <h1 class="text-2xl font-bold">{{ actor.firstName }} {{ actor.lastName }}</h1>
        <p>{{ actor.email }}</p>
        <p>{{ actor.organism }}</p>
      </div>
      <div class="mt-4">
        <UButton v-if="authStore.isAdmin" size="sm" color="primary" variant="soft" icon="i-heroicons-pencil" @click="editActor">Modifier</UButton>
      </div>
    </UCard>
    <UCard v-else>
      <USkeleton class="h-8 w-full mb-4" />
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useApi } from '~/composables/useApi'
import { useRoute } from 'vue-router'
import type { User } from '~/types'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { data: actor } = await useApi<User>(`/api/actors/${route.params.id}`)
const authStore = useAuthStore()

const editActor = () => {
  router.push(`/actors/${route.params.id}/edit`)
}
</script>
