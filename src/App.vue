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
  return authStore.user?.roles?.includes('ROLE_ADMIN')
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

<style>
/* ... (estilos existentes) ... */
.main-header {
  background-color: white;
  padding: 0 2rem;
  height: 60px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.main-nav a {
  text-decoration: none;
  color: #333;
  font-weight: 600;
  margin-right: 1.5rem;
  transition: color 0.2s ease;
}

.main-nav a:hover,
.main-nav a.router-link-exact-active {
  color: #4a90e2;
}

.user-actions {
  display: flex;
  align-items: center;
}

.welcome-message {
  font-weight: 500;
  margin-right: 1.5rem;
}
/* ... (resto dos estilos) ... */
</style>
