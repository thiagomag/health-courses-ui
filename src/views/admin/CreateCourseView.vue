<script setup>
import { ref } from 'vue'
import { createCourse } from '@/services/courseService'

import '@/assets/admin-forms.css'

const course = ref({
  name: '',
  description: '',
  category: null,
  active: true,
})

const successMessage = ref('')
const errorMessage = ref('')

// As categorias vêm do seu Enum no backend
const categories = [
  'Urgência e Emergência',
  'Terapia Intensiva (UTI)',
  'Saúde da Mulher e Obstetrícia',
  'Pediatria e Neonatologia',
  'Centro Cirúrgico e CME',
  'Cardiologia e Hemodinâmica',
  'Oncologia',
  'Feridas e Curativos',
  'Fundamentos de Enfermagem',
  'Farmacologia Aplicada',
  'Semiologia e Semiotécnica',
  'Gestão e Liderança em Saúde',
  'Legislação, Ética e Bioética',
  'Auditoria em Enfermagem',
]

async function handleSubmit() {
  successMessage.value = ''
  errorMessage.value = ''
  try {
    await createCourse(course.value)
    successMessage.value = 'Curso criado com sucesso!'
    // Limpar formulário
    course.value = { name: '', description: '', category: null, active: true }
  } catch (error) {
    errorMessage.value = 'Erro ao criar o curso. Tente novamente.'
    console.error(error)
  }
}
</script>

<template>
  <div>
    <h1>Criar Novo Curso</h1>
    <form @submit.prevent="handleSubmit" class="admin-form">
      <div class="form-group">
        <label for="name">Nome do Curso</label>
        <input type="text" v-model="course.name" id="name" required />
      </div>
      <div class="form-group">
        <label for="description">Descrição</label>
        <textarea v-model="course.description" id="description" rows="4" required></textarea>
      </div>
      <div class="form-group">
        <label for="category">Categoria</label>
        <select v-model="course.category" id="category" required>
          <option :value="null" disabled>Selecione uma categoria</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
      <div class="form-group-checkbox">
        <input type="checkbox" v-model="course.active" id="active" />
        <label for="active">Curso Ativo</label>
      </div>
      <button type="submit" class="submit-btn">Criar Curso</button>

      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<style scoped></style>
