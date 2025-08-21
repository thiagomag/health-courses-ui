<script setup>
import { RouterView, useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

// Verifica se o utilizador tem a role de administrador
const isAdmin = () => {
  return authStore.user?.roles?.some((role) => role.name === 'ROLE_ADMIN')
}
</script>

<template>
  <header v-if="authStore.isAuthenticated" class="main-header">
    <div class="header-content">
      <nav class="main-nav">
        <RouterLink to="/cursos">Cursos</RouterLink>
        <!-- O link só é renderizado se o utilizador for admin -->
        <RouterLink v-if="isAdmin()" to="/admin">Admin</RouterLink>
      </nav>
      <div class="user-actions">
        <span class="welcome-message">Olá, {{ authStore.user?.name || 'Utilizador' }}</span>
        <button @click="handleLogout" class="logout-button">Sair</button>
      </div>
    </div>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style></style>
