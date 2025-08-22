<script setup>
import { ref, onMounted } from 'vue'
import { getAllCourses } from '@/services/courseService'

const courses = ref([])
const isLoading = ref(true)
const errorMessage = ref(null)

onMounted(async () => {
  try {
    const response = await getAllCourses()
    courses.value = response.data
  } catch (error) {
    console.error('Erro ao buscar cursos:', error)
    if (error.response && error.response.status === 403) {
      errorMessage.value = 'A sua assinatura não está ativa. Por favor, contacte o suporte.'
    } else {
      errorMessage.value = 'Não foi possível carregar os cursos. Tente novamente mais tarde.'
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="courses-page">
    <h1>Catálogo de Cursos</h1>
    <div v-if="isLoading" class="loading-message">
      <p>A carregar cursos...</p>
    </div>
    <div v-else-if="errorMessage" class="error-message">
      <p>{{ errorMessage }}</p>
    </div>
    <div v-else-if="courses.length > 0" class="courses-grid">
      <router-link
        v-for="course in courses"
        :key="course.id"
        :to="`/cursos/${course.id}`"
        class="course-card-link"
      >
        <div class="course-card">
          <div class="card-content">
            <h2 class="course-title">{{ course.name }}</h2>
            <p class="course-category">{{ course.category }}</p>
            <p class="course-description">{{ course.description }}</p>
          </div>
        </div>
      </router-link>
    </div>
    <div v-else class="no-courses-message">
      <p>Nenhum curso encontrado no momento.</p>
    </div>
  </div>
</template>

<style scoped>
.courses-page {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
}
h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  color: #333;
}
.loading-message,
.no-courses-message,
.error-message {
  text-align: center;
  font-size: 1.2rem;
  color: #777;
  padding: 2rem;
}
.error-message {
  color: #e74c3c;
  background-color: #fbe2e0;
  border: 1px solid #e74c3c;
  border-radius: 8px;
}
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
.course-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}
.card-content {
  padding: 1.5rem;
}
.course-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}
.course-category {
  font-size: 0.9rem;
  color: #4a90e2;
  font-weight: 500;
  margin-bottom: 1rem;
}
.course-description {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
}
</style>
