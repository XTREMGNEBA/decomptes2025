<template>
  <div class="max-h-screen flex items-center justify-center">
    <UCard class="w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-6">Inscription</h1>
      
      <form @submit.prevent="handleRegister" class="space-y-4">
        <UFormGroup label="Prénom">
          <UInput
            v-model="formData.firstName"
            type="text"  
            placeholder="Votre prénom"
            required
          />
        </UFormGroup>
        
        <UFormGroup label="Nom">
          <UInput
            v-model="formData.lastName"
            placeholder="Votre nom"
            required
          />
        </UFormGroup>
        
        <UFormGroup label="Email">
          <UInput
            v-model="formData.email"
            type="email"
            placeholder="votre@email.com"
            required
          />
        </UFormGroup>
        
        <UFormGroup label="Mot de passe">
          <UInput
            v-model="formData.password"
            type="password"
            required
          />
        </UFormGroup>
        
        <UFormGroup label="Rôle">
          <USelect
            v-model="formData.role"
            :options="roles"
            placeholder="Sélectionner un rôle"
            required
          />
        </UFormGroup>
        
        <div class="flex justify-between items-center">
          <NuxtLink to="/login" class="text-sm text-gray-600 hover:text-gray-900">
            Déjà inscrit ? Se connecter
          </NuxtLink>
          
          <UButton
            type="submit"
            :loading="loading"
          >
            S'inscrire
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { toRaw } from 'vue'  // Importation de Vue pour traiter les données brutes
import { toast } from 'vue3-toastify'  // Importation de vue3-toastify pour les notifications

  

const authStore = useAuthStore()
const loading = ref(false)

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: ''  // Ajout du rôle dans le formulaire
})

// Liste des rôles possibles, tu peux l'adapter selon ton besoin
const roles = [
  { label: 'Admin', value: 'admin' },
  { label: 'Utilisateur', value: 'user' }
]

async function handleRegister() {
  try {
    console.log('Form data to send:', formData); // Afficher les données avant envoi

    loading.value = true;
    
    // Convertir formData en objet brut (sans Proxy)
    const dataToSend = toRaw(formData);

    // Appel à la méthode d'enregistrement
    const response = await authStore.register(dataToSend);

    // Si l'inscription réussit, afficher un toast de succès
    toast.success('Inscription réussie ! Vous pouvez maintenant vous connecter.');

  } catch (error: any) {
    console.error('Registration error:', error.message);  // Afficher l'erreur dans la console pour débogage

    // Affichage d'une erreur conviviale avec toast
    toast.error(`Erreur lors de l'inscription: ${error.message}`);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Tu peux ajouter des styles supplémentaires ici si nécessaire */
</style>
