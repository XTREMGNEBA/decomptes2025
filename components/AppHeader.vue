<template>
  <header class="bg-gradient-to-r from-green-500 to-green-700 shadow">
    <nav class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo et nom de l'application -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center">
            <img src="../public/logo.png" alt="Logo" class="h-8 mr-2" />
            <h1 class="text-xl font-bold text-white">decomptes2025</h1>
          </NuxtLink>
        </div>

        <!-- Navigation principale -->
        <div class="hidden md:flex items-center space-x-4">
          <!-- Liens pour utilisateurs authentifiés -->
          <template v-if="authStore.isAuthenticated">
            <!-- Liens pour admin -->
            <template v-if="authStore.isAdmin">
              <NuxtLink 
                v-for="link in adminLinks" 
                :key="link.to"
                :to="link.to"
                class="text-white hover:text-green-300 px-3 py-2 rounded-md text-sm font-medium"
              >
                {{ link.label }}
              </NuxtLink>
            </template>
            
            <!-- Liens pour autres utilisateurs -->
            <template v-else>
              <NuxtLink 
                v-for="link in userLinks" 
                :key="link.to"
                :to="link.to"
                class="text-white hover:text-green-300 px-3 py-2 rounded-md text-sm font-medium"
              >
                {{ link.label }}
              </NuxtLink>
            </template>
          </template>

          <!-- Liens pour utilisateurs non authentifiés -->
          <template v-else>
            <NuxtLink 
              to="/login"
              class="text-white hover:text-green-300 px-3 py-2 rounded-md text-sm font-medium"
            >
              Connexion
            </NuxtLink>
          </template>
        </div>

        <!-- Menu utilisateur -->
        <div v-if="authStore.isAuthenticated" class="flex items-center">
          <UDropdown :items="userMenuItems">
            <UButton
              class="bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-400"
              variant="solid"
              :label="authStore.user?.firstName || 'Menu'"
              trailing-icon="i-heroicons-chevron-down"
            />
          </UDropdown>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

// Liens pour administrateurs
const adminLinks = [
  { label: 'Dashboard', to: '/' },
  { label: 'Décomptes', to: '/decomptes' },
  { label: 'Organismes', to: '/organisms' },
  { label: 'Acteurs', to: '/actors' },
]

// Sous-menu spécifique pour administrateurs
const userMenuItems = computed(() => {
  const items = [
    [
      {
        label: 'Mon Profil',
        icon: 'i-heroicons-user-circle',
        to: '/profile',
        color: 'gray'
      },
      {
        label: 'Paramètres',
        icon: 'i-heroicons-cog-6-tooth',
        to: '/settings',
        color: 'gray'
      }
    ],
    [
      // Ajouter User uniquement pour les administrateurs
      ...(authStore.isAdmin
        ? [{
            label: 'Nouvel Acteur',
            icon: 'i-heroicons-user-plus',
            to: '/register',
            color: 'green'
          }]
        : [])
    ],
    [
      {
        label: 'Déconnexion',
        icon: 'i-heroicons-arrow-right-on-rectangle',
        click: () => authStore.logout(),
        color: 'red'
      }
    ]
  ];
  return items.filter(group => group.length > 0);
});

// Liens pour utilisateurs standards
const userLinks = [
  { label: 'Mes Décomptes', to: '/decomptes' },
  { label: 'Nouveau Décompte', to: '/decomptes/new' },
]
</script>