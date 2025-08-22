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
  <div v-if="isLoading">A carregar...</div>
  <div v-else-if="course" class="course-player-layout">
    <aside class="course-sidebar">
      <nav>
        <h2 class="course-title">{{ course.name }}</h2>
        <ul>
          <li v-for="module in sortedModules" :key="module.id" class="module-item">
            <RouterLink :to="`/cursos/${courseId}/modulos/${module.id}`">
              {{ module.title }}
            </RouterLink>
          </li>
        </ul>
      </nav>
    </aside>
    <main class="course-content">
      <!-- As páginas de lições e o player serão renderizados aqui -->
      <RouterView :course="course" />
    </main>
  </div>
</template>

<style scoped>
.course-player-layout {
  display: flex;
  height: calc(100vh - 60px); /* Ocupa a altura total menos o header */
}
.course-sidebar {
  width: 300px;
  background-color: #fff;
  border-right: 1px solid #e0e0e0;
  padding: 1.5rem;
  overflow-y: auto;
}
.course-title {
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
}
.course-sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.module-item a {
  display: block;
  padding: 0.8rem 1rem;
  text-decoration: none;
  color: #333;
  border-radius: 6px;
  font-weight: 500;
}
.module-item a:hover {
  background-color: #f4f4f4;
}
.module-item a.router-link-exact-active {
  background-color: #4a90e2;
  color: white;
}
.course-content {
  flex-grow: 1;
  padding: 2rem;
  overflow-y: auto;
}
</style>
