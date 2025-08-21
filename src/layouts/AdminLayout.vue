<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <nav>
        <h2>Admin</h2>
        <ul>
          <li><RouterLink to="/admin/cursos/novo">Criar Curso</RouterLink></li>
          <li><RouterLink to="/admin/modulos/novo">Criar Módulo</RouterLink></li>
          <li><RouterLink to="/admin/licoes/novo">Criar Lição</RouterLink></li>
        </ul>
      </nav>
    </aside>
    <main class="admin-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: calc(100vh - 60px); /* Subtrai a altura do header principal */
}

.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  padding: 1.5rem;
}

.sidebar h2 {
  margin-top: 0;
  text-align: center;
  border-bottom: 1px solid #46627f;
  padding-bottom: 1rem;
}

.sidebar nav ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidebar nav li a {
  display: block;
  padding: 0.8rem 1rem;
  color: #bdc3c7;
  text-decoration: none;
  border-radius: 6px;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.sidebar nav li a:hover,
.sidebar nav li a.router-link-exact-active {
  background-color: #34495e;
  color: white;
}

.admin-content {
  flex-grow: 1;
  padding: 2rem;
  background-color: #f7f8fc;
}
</style>
