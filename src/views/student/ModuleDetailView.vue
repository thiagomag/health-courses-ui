<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

// Recebe os dados do curso do componente pai (CourseDetailView)
const props = defineProps({
  course: Object,
})

const route = useRoute()
const courseId = route.params.courseId
const moduleId = computed(() => parseInt(route.params.moduleId))

// Encontra o módulo atual e ordena as suas lições
const currentModule = computed(() => {
  if (!props.course) return null
  const module = props.course.modules.find((m) => m.id === moduleId.value)
  if (module && module.lessons) {
    // Ordena as lições (assumindo que lições também têm uma propriedade 'position')
    module.lessons.sort((a, b) => a.position - b.position)
  }
  return module
})
</script>

<template>
  <div v-if="currentModule">
    <h2>{{ currentModule.title }}</h2>
    <p>{{ currentModule.description }}</p>
    <hr />
    <h3>Lições</h3>
    <ul class="lesson-list">
      <li v-for="lesson in currentModule.lessons" :key="lesson.id">
        <RouterLink :to="`/cursos/${courseId}/modulos/${moduleId}/licoes/${lesson.id}`">
          {{ lesson.title }}
        </RouterLink>
      </li>
    </ul>
  </div>
  <div v-else>
    <p>Módulo não encontrado.</p>
  </div>
</template>

<style scoped>
.lesson-list {
  list-style: none;
  padding: 0;
}
.lesson-list li a {
  display: block;
  padding: 1rem;
  border: 1px solid #eee;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
}
.lesson-list li a:hover {
  background-color: #f9f9f9;
  border-color: #ccc;
}
.lesson-list li a.router-link-exact-active {
  background-color: #e9f2fc;
  border-color: #4a90e2;
  color: #4a90e2;
}
</style>
