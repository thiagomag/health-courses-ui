<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getLessonById, updateLesson, getAllModules } from '@/services/courseService'
import '@/assets/admin-forms.css'

const route = useRoute()
const router = useRouter()
const lessonId = route.params.id

const lesson = ref({})
const modules = ref([])
const successMessage = ref('')
const errorMessage = ref('')
const isLoading = ref(true)

onMounted(async () => {
  try {
    const [lessonResponse, modulesResponse] = await Promise.all([
      getLessonById(lessonId),
      getAllModules(),
    ])
    lesson.value = lessonResponse.data
    modules.value = modulesResponse.data
  } catch (error) {
    errorMessage.value = 'Erro ao carregar dados.'
  } finally {
    isLoading.value = false
  }
})

async function handleSubmit() {
  try {
    await updateLesson(lessonId, lesson.value)
    successMessage.value = 'Lição atualizada com sucesso!'
    setTimeout(() => router.push({ name: 'admin-list-lessons' }), 1500)
  } catch (error) {
    errorMessage.value = 'Erro ao atualizar a lição.'
  }
}
</script>

<template>
  <div>
    <h1>Editar Lição (ID: {{ lessonId }})</h1>
    <div v-if="isLoading">A carregar...</div>
    <form v-else @submit.prevent="handleSubmit" class="admin-form">
      <div class="form-group">
        <label for="moduleId">Módulo Associado</label>
        <select v-model="lesson.moduleId" id="moduleId" required>
          <option v-for="mod in modules" :key="mod.id" :value="mod.id">
            {{ mod.title }} (Curso ID: {{ mod.courseId }})
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="title">Título da Lição</label>
        <input type="text" v-model="lesson.title" id="title" required />
      </div>
      <div class="form-group">
        <label for="description">Descrição</label>
        <textarea v-model="lesson.description" id="description" rows="4" required></textarea>
      </div>
      <div class="form-group">
        <label for="videoUrl">URL do Vídeo</label>
        <input type="text" v-model="lesson.videoUrl" id="videoUrl" required />
      </div>
      <div class="form-group">
        <label for="duration">Duração (minutos)</label>
        <input type="number" v-model="lesson.durationInMinutes" id="duration" required min="1" />
      </div>
      <button type="submit" class="submit-btn">Salvar Alterações</button>

      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<style scoped></style>
