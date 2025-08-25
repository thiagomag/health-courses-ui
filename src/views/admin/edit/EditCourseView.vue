<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { getCourseById, updateCourse } from '@/services/courseService'
import '@/assets/admin-forms.css'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const courseId = route.params.id

// Inicializa o ref do curso como um objeto vazio para evitar erros de template
const course = ref({})
const successMessage = ref('')
const errorMessage = ref('')
const isLoading = ref(true)
const isSubmitting = ref(false)

// Lista de categorias para o dropdown
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

// onMounted é executado quando o componente é carregado
onMounted(async () => {
  try {
    // Busca os dados do curso específico usando o ID da rota
    const response = await getCourseById(courseId)
    course.value = response.data // Preenche o formulário com os dados existentes
  } catch (error) {
    errorMessage.value = 'Não foi possível carregar os dados do curso.'
    console.error('Erro ao buscar curso:', error)
  } finally {
    isLoading.value = false
  }
})

// Função chamada ao submeter o formulário
async function handleSubmit() {
  if (isSubmitting.value) return
  isSubmitting.value = true
  successMessage.value = ''
  errorMessage.value = ''
  try {
    // Chama o serviço para atualizar o curso com os novos dados
    await updateCourse(courseId, course.value)
    successMessage.value = 'Curso atualizado com sucesso!'
    // Redireciona de volta para a lista após um pequeno atraso para o utilizador ver a mensagem
    setTimeout(() => router.push({ name: 'admin-list-courses' }), 1500)
  } catch (error) {
    errorMessage.value = 'Erro ao atualizar o curso. Tente novamente.'
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div>
    <h1>Editar Curso (ID: {{ courseId }})</h1>

    <!-- Mensagem de carregamento -->
    <div v-if="isLoading">A carregar dados do curso...</div>

    <!-- Formulário de edição, só é mostrado após os dados serem carregados -->
    <div v-if="isLoading">A carregar dados do curso...</div>
    <form v-else-if="course" @submit.prevent="handleSubmit" class="admin-form">
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

      <button type="submit" class="submit-btn" :disabled="isSubmitting">
        {{ isSubmitting ? 'A guardar...' : 'Salvar Alterações' }}
      </button>

      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>

    <!-- Mensagem de erro se o curso não for encontrado -->
    <div v-else class="error-message">
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<style scoped>
/* Os estilos são importados, esta secção pode ficar vazia */
</style>
