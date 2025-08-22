<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const props = defineProps({
  course: Object,
})

const route = useRoute()
const courseId = route.params.courseId
const moduleId = computed(() => parseInt(route.params.moduleId))

const currentModule = computed(() => {
  if (!props.course) return null
  const module = props.course.modules.find((m) => m.id === moduleId.value)
  if (module && module.lessons) {
    // A ordenação pode ser feita aqui se as lições tiverem uma propriedade 'position'
    module.lessons.sort((a, b) => (a.position || 0) - (b.position || 0))
  }
  return module
})
</script>

<template>
  <div v-if="currentModule" class="module-detail-container">
    <header class="module-header">
      <h1>{{ currentModule.title }}</h1>
      <p class="module-description">{{ currentModule.description }}</p>
    </header>
    <hr />
    <h3 class="lessons-title">Lições do Módulo</h3>
    <ul class="lesson-list">
      <li v-for="lesson in currentModule.lessons" :key="lesson.id" class="lesson-item">
        <RouterLink :to="`/cursos/${courseId}/modulos/${moduleId}/licoes/${lesson.id}`">
          <span class="lesson-title">{{ lesson.title }}</span>
          <span class="lesson-duration">{{ lesson.duration_in_minutes }} min</span>
        </RouterLink>
      </li>
    </ul>
  </div>
  <div v-else>
    <p>Módulo não encontrado.</p>
  </div>
</template>

<style scoped>
.module-header {
  margin-bottom: 2rem;
}

h1 {
  font-size: 2.2rem;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.module-description {
  font-size: 1.1rem;
  color: #555;
}

.lessons-title {
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

.lesson-list {
  list-style: none;
  padding: 0;
}

.lesson-item a {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1.5rem;
  border: 1px solid #e0e0e0;
  margin-bottom: 0.8rem;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  background-color: #fff;
  transition: all 0.2s ease;
}

.lesson-item a:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #4a90e2;
}

.lesson-item a.router-link-exact-active {
  background-color: #4a90e2;
  border-color: #4a90e2;
  color: white;
}

.lesson-title {
  font-size: 1.1rem;
}

.lesson-duration {
  font-size: 0.9rem;
  font-weight: 600;
  color: #777;
}

.lesson-item a.router-link-exact-active .lesson-duration {
  color: white;
}
</style>
