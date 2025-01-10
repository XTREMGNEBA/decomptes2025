<!-- // pages/protected.vue -->
<template>
  <div>
    <h1>Protected Page</h1>
    <p>Welcome, {{ user.firstName }}!</p>
  </div>
</template>

<script setup>
const { auth } = useAuth() // Utilisez votre système d'authentification
const user = auth.value
</script>