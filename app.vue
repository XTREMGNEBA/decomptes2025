<template>
  <div id="app" class="  bg-center min-h-screen">
    <!-- En-tête global -->
    <AppHeader />

    <!-- Contenu principal -->
    <div class="bg-white/40  p-6 rounded-lg shadow-lg m-4">
      <main class="container mx-auto">
        <NuxtPage />

      </main>
    </div>
  </div>
</template>

<script setup>
// Le composant AppHeader est automatiquement importé grâce à l'auto-import de Nuxt
</script>

<style>
/* Ajoutez des ajustements de style globaux si nécessaire */
</style>
