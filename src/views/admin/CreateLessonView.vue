<script setup>
import { ref, onMounted } from 'vue'
import { createLesson } from '@/services/courseService'
// No futuro, você precisará de um método para buscar todos os módulos
import { getAllModules } from '@/services/courseService'

import '@/assets/admin-forms.css'

const lesson = ref({
  title: '',
  description: '',
  videoUrl: '',
  durationInMinutes: 10,
  moduleId: null,
})

const modules = ref([]) // Para popular o select de módulos
const successMessage = ref('')
const errorMessage = ref('')

onMounted(async () => {
  try {
    const modulesResponse = await getAllModules()
    modules.value = modulesResponse.data
  } catch (error) {
    console.error('Erro ao carregar módulos:', error)
  }
})

async function handleSubmit() {
  successMessage.value = ''
  errorMessage.value = ''
  try {
    await createLesson(lesson.value)
    successMessage.value = 'Lição criada com sucesso!'
    lesson.value = {
      title: '',
      description: '',
      videoUrl: '',
      durationInMinutes: 10,
      moduleId: null,
    }
  } catch (error) {
    errorMessage.value = 'Erro ao criar a lição. Tente novamente.'
    console.error(error)
  }
}
</script>

<template>
  <div>
    <h1>Criar Nova Lição</h1>
    <form @submit.prevent="handleSubmit" class="admin-form">
      <!-- Adicionar select para módulo quando tiver o endpoint -->
      <div class="form-group">
        <label for="moduleId">Módulo</label>
        <select v-model="lesson.moduleId" id="moduleId" required>
          <option :value="null" disabled>Selecione um módulo</option>
          <option v-for="module in modules" :key="module.id" :value="module.id">
            {{ module.title }}
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
      <button type="submit" class="submit-btn">Criar Lição</button>

      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<style scoped></style>
