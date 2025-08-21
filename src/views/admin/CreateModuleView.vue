<script setup>
import { ref, onMounted } from 'vue'
import { createModule, getAllCourses } from '@/services/courseService'
// Assumindo que você terá um serviço para buscar utilizadores (instrutores)
// import { getAllInstructors } from '@/services/userService';

import '@/assets/admin-forms.css'

const module = ref({
  title: '',
  description: '',
  position: 1,
  courseId: null,
  instructorId: null, // Adicionar o ID do instrutor
})

const courses = ref([])
// const instructors = ref([]); // Para popular o select de instrutores
const successMessage = ref('')
const errorMessage = ref('')

onMounted(async () => {
  try {
    const coursesResponse = await getAllCourses()
    courses.value = coursesResponse.data
    // const instructorsResponse = await getAllInstructors();
    // instructors.value = instructorsResponse.data;
  } catch (error) {
    console.error('Erro ao carregar dados iniciais:', error)
  }
})

async function handleSubmit() {
  successMessage.value = ''
  errorMessage.value = ''
  try {
    await createModule(module.value)
    successMessage.value = 'Módulo criado com sucesso!'
    module.value = { title: '', description: '', position: 1, courseId: null, instructorId: null }
  } catch (error) {
    errorMessage.value = 'Erro ao criar o módulo. Tente novamente.'
    console.error(error)
  }
}
</script>

<template>
  <div>
    <h1>Criar Novo Módulo</h1>
    <form @submit.prevent="handleSubmit" class="admin-form">
      <div class="form-group">
        <label for="courseId">Curso</label>
        <select v-model="module.courseId" id="courseId" required>
          <option :value="null" disabled>Selecione um curso</option>
          <option v-for="course in courses" :key="course.id" :value="course.id">
            {{ course.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="title">Título do Módulo</label>
        <input type="text" v-model="module.title" id="title" required />
      </div>
      <div class="form-group">
        <label for="description">Descrição</label>
        <textarea v-model="module.description" id="description" rows="4" required></textarea>
      </div>
      <!-- Adicionar select para instrutor quando tiver o endpoint -->
      <!--
      <div class="form-group">
        <label for="instructorId">Instrutor</label>
        <select v-model="module.instructorId" id="instructorId" required>
          <option :value="null" disabled>Selecione um instrutor</option>
          <option v-for="instructor in instructors" :key="instructor.id" :value="instructor.id">{{ instructor.name }}</option>
        </select>
      </div>
      -->
      <div class="form-group">
        <label for="position">Posição</label>
        <input type="number" v-model="module.position" id="position" required min="1" />
      </div>
      <button type="submit" class="submit-btn">Criar Módulo</button>

      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<style scoped></style>
