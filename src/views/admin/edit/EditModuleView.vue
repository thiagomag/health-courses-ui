<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getModuleById, updateModule, getAllCourses, getAllUsers } from '@/services/courseService'
import '@/assets/admin-forms.css'

const route = useRoute()
const router = useRouter()
const moduleId = route.params.id

const moduleData = ref({})
const courses = ref([])
const instructors = ref([])
const successMessage = ref('')
const errorMessage = ref('')
const isLoading = ref(true)

onMounted(async () => {
  try {
    const [moduleResponse, coursesResponse, usersResponse] = await Promise.all([
      getModuleById(moduleId),
      getAllCourses(),
      getAllUsers(),
    ])
    moduleData.value = moduleResponse.data
    courses.value = coursesResponse.data
    instructors.value = usersResponse.data
  } catch (error) {
    errorMessage.value = 'Erro ao carregar dados.'
  } finally {
    isLoading.value = false
  }
})

async function handleSubmit() {
  try {
    await updateModule(moduleId, moduleData.value)
    successMessage.value = 'Módulo atualizado com sucesso!'
    setTimeout(() => router.push({ name: 'admin-list-modules' }), 1500)
  } catch (error) {
    errorMessage.value = 'Erro ao atualizar o módulo.'
  }
}
</script>

<template>
  <div>
    <h1>Editar Módulo (ID: {{ moduleId }})</h1>
    <div v-if="isLoading">A carregar...</div>
    <form v-else @submit.prevent="handleSubmit" class="admin-form">
      <div class="form-group">
        <label for="courseId">Curso Associado</label>
        <select v-model="moduleData.courseId" id="courseId" required>
          <option v-for="course in courses" :key="course.id" :value="course.id">
            {{ course.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="title">Título do Módulo</label>
        <input type="text" v-model="moduleData.title" id="title" required />
      </div>
      <div class="form-group">
        <label for="description">Descrição</label>
        <textarea v-model="moduleData.description" id="description" rows="4" required></textarea>
      </div>
      <div class="form-group">
        <label for="instructorId">Instrutor</label>
        <select v-model="moduleData.instructorId" id="instructorId" required>
          <option v-for="instructor in instructors" :key="instructor.id" :value="instructor.id">
            {{ instructor.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="position">Posição (Ordem)</label>
        <input type="number" v-model="moduleData.position" id="position" required min="1" />
      </div>
      <button type="submit" class="submit-btn">Salvar Alterações</button>

      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<style scoped></style>
