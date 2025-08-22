<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, RouterView, RouterLink } from 'vue-router'
import { getCourseById } from '@/services/courseService'

const route = useRoute()
const course = ref(null)
const isLoading = ref(true)
const courseId = route.params.courseId

// Ordena os módulos pela propriedade 'position'
const sortedModules = computed(() => {
  if (!course.value || !course.value.modules) return []
  return [...course.value.modules].sort((a, b) => a.position - b.position)
})

onMounted(async () => {
  try {
    const response = await getCourseById(courseId)
    course.value = response.data
  } catch (error) {
    console.error('Erro ao carregar detalhes do curso:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div v-if="isLoading" class="loading-container">A carregar...</div>
  <div v-else-if="course" class="course-player-layout">
    <aside class="course-sidebar">
      <div class="sidebar-header">
        <RouterLink to="/cursos" class="back-link">← Voltar para Cursos</RouterLink>
        <h2 class="course-title">{{ course.name }}</h2>
        <p class="course-description-sidebar">{{ course.description }}</p>
      </div>
      <nav class="module-nav">
        <ul>
          <li v-for="module in sortedModules" :key="module.id" class="module-item">
            <RouterLink :to="`/cursos/${courseId}/modulos/${module.id}`">
              <span class="module-title">{{ module.title }}</span>
            </RouterLink>
          </li>
        </ul>
      </nav>
    </aside>
    <main class="course-content">
      <RouterView :course="course" />
    </main>
  </div>
  <div v-else class="error-container">
    <p>Curso não encontrado.</p>
  </div>
</template>

<style scoped>
.course-player-layout {
  display: flex;
  height: calc(100vh - 60px); /* Ocupa a altura total menos o header */
  background-color: #f7f8fc;
}

.course-sidebar {
  width: 320px;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.back-link {
  font-size: 0.9rem;
  color: #4a90e2;
  text-decoration: none;
  margin-bottom: 1rem;
  display: inline-block;
}

.course-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.course-description-sidebar {
  font-size: 0.9rem;
  color: #777;
  line-height: 1.5;
}

.module-nav {
  padding: 1rem;
  flex-grow: 1;
}

.module-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.module-item a {
  display: block;
  padding: 1rem 1.2rem;
  text-decoration: none;
  color: #333;
  border-radius: 8px;
  font-weight: 600;
  margin-bottom: 0.5rem;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
  border: 1px solid transparent;
}

.module-item a:hover {
  background-color: #f4f6f8;
}

.module-item a.router-link-exact-active {
  background-color: #e9f2fc;
  color: #357abd;
  border-color: #4a90e2;
}

.course-content {
  flex-grow: 1;
  padding: 2.5rem;
  overflow-y: auto;
}

.loading-container,
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 60px);
  font-size: 1.2rem;
  color: #777;
}
</style>
