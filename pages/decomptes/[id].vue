<template>
  <div>
    <div class="flex items-center gap-4 mb-6">
      <UButton
        icon="i-heroicons-arrow-left"
        variant="ghost"
        @click="navigateTo('/decomptes')"
      />
      <h1 class="text-2xl font-bold">Détails du décompte</h1>
    </div>

    <UCard v-if="pending">
      <USkeleton class="h-8 w-full mb-4" v-for="n in 5" :key="n" />
    </UCard>

    <template v-else-if="decompte">
      <UCard class="mb-4">
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-semibold mb-4">Informations générales</h3>
            <dl class="grid grid-cols-2 gap-4">
              <div>
                <dt class="text-sm text-gray-500">Référence</dt>
                <dd>{{ decompte.reference }}</dd>
              </div>
              <div>
                <dt class="text-sm text-gray-500">Statut</dt>
                <dd>
                  <UBadge :color="getStatusColor(decompte.status)">
                    {{ formatStatus(decompte.status) }}
                  </UBadge>
                </dd>
              </div>
              <div>
                <dt class="text-sm text-gray-500">Montant</dt>
                <dd>{{ formatAmount(decompte.amount, decompte.currency) }}</dd>
              </div>
              <div>
                <dt class="text-sm text-gray-500">Créé le</dt>
                <dd>{{ formatDate(decompte.createdAt) }}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 class="font-semibold mb-4">Organisme</h3>
            <dl class="grid gap-4">
              <div>
                <dt class="text-sm text-gray-500">Nom</dt>
                <dd>{{ decompte.organism?.name }}</dd>
              </div>
              <div>
                <dt class="text-sm text-gray-500">Type</dt>
                <dd>{{ decompte.organism?.type === 'public' ? 'Public' : 'Privé' }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </UCard>

      <UCard class="mb-4">
        <h3 class="font-semibold mb-4">Validations</h3>
        <div v-if="decompte.validations?.length" class="space-y-4">
          <div v-for="validation in decompte.validations" :key="validation.date" 
               class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p class="font-medium">{{ validation.user?.firstName }} {{ validation.user?.lastName }}</p>
              <p class="text-sm text-gray-500">{{ formatDate(validation.date) }}</p>
            </div>
            <UBadge :color="validation.status === 'approved' ? 'green' : 'red'">
              {{ validation.status === 'approved' ? 'Approuvé' : 'Rejeté' }}
            </UBadge>
          </div>
        </div>
        <p v-else class="text-center text-gray-500">Aucune validation</p>
      </UCard>

      <UCard>
        <h3 class="font-semibold mb-4">Signatures</h3>
        <div v-if="decompte.signatures?.length" class="space-y-4">
          <div v-for="signature in decompte.signatures" :key="signature.date"
               class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p class="font-medium">{{ signature.user?.firstName }} {{ signature.user?.lastName }}</p>
              <p class="text-sm text-gray-500">{{ formatDate(signature.date) }}</p>
            </div>
            <UIcon name="i-heroicons-check-circle" class="text-green-500 w-6 h-6" />
          </div>
        </div>
        <p v-else class="text-center text-gray-500">Aucune signature</p>
      </UCard>
    </template>

    <UCard v-else>
      <p class="text-center text-gray-500">Décompte non trouvé</p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: decompte, pending } = await useFetch<{
  reference: string;
  status: string;
  amount: number;
  currency: string;
  createdAt: string;
  organism?: {
    name?: string;
    type?: string;
  };
  validations?: Array<{
    user?: {
      firstName?: string;
      lastName?: string;
    };
    date: string;
    status: string;
  }>;
  signatures?: Array<{
    user?: {
      firstName?: string;
      lastName?: string;
    };
    date: string;
  }>;
}>(`/api/decomptes/${route.params.id}`)

type Colors = {
  draft: 'gray';
  pending: 'yellow';
  validated: 'blue';
  signed: 'green';
  closed: 'gray';
}

const colors: Colors = {
  draft: 'gray',
  pending: 'yellow',
  validated: 'blue',
  signed: 'green',
  closed: 'gray'
}

function getStatusColor(status: keyof Colors) {
  return colors[status] || 'gray'
}

function formatStatus(status: keyof typeof labels) {
  const labels = {
    draft: 'Brouillon',
    pending: 'En attente',
    validated: 'Validé',
    signed: 'Signé',
    closed: 'Clôturé'
  }
  return labels[status] || status
}

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency
  }).format(amount)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
</script>