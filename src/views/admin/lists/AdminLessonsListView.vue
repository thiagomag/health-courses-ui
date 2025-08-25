<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useToast } from 'vue-toastification'
import { getAllLessons, deleteLesson, getAllModules, getAllCourses } from '@/services/courseService'

import '@/assets/admin-list-forms.css'

const toast = useToast()
const lessons = ref([])
const modules = ref([])
const courses = ref([])
const isLoading = ref(true)

// Mapa para encontrar módulos por ID rapidamente
const moduleMap = computed(() => {
  const map = {}
  for (const module of modules.value) {
    map[module.id] = module
  }
  return map
})

// Mapa para encontrar cursos por ID rapidamente
const courseMap = computed(() => {
  const map = {}
  for (const course of courses.value) {
    map[course.id] = course.name
  }
  return map
})

// Função para obter o nome de um módulo pelo seu ID
function getModuleName(moduleId) {
  return moduleMap.value[moduleId]?.title || 'Módulo não encontrado'
}

// Função para obter o nome do curso a partir do ID do módulo
function getCourseNameByModuleId(moduleId) {
  const module = moduleMap.value[moduleId]
  if (module) {
    return courseMap.value[module.courseId] || 'Curso não encontrado'
  }
  return 'Curso não associado'
}

async function fetchAllData() {
  try {
    // Busca todas as informações necessárias em paralelo
    const [lessonsResponse, modulesResponse, coursesResponse] = await Promise.all([
      getAllLessons(),
      getAllModules(),
      getAllCourses(),
    ])
    lessons.value = lessonsResponse.data
    modules.value = modulesResponse.data
    courses.value = coursesResponse.data
  } catch (error) {
    console.error('Erro ao buscar dados da página de lições:', error)
    toast.error('Não foi possível carregar os dados.')
  } finally {
    isLoading.value = false
  }
}

async function handleDelete(lessonId) {
  toast.warning('Tem a certeza que deseja apagar esta lição?', {
    position: 'top-center',
    timeout: false,
    closeOnClick: false,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: 'button',
    icon: true,
    rtl: false,
    actions: [
      {
        text: 'Confirmar',
        onClick: async (e, toastObject) => {
          try {
            await deleteLesson(lessonId)
            lessons.value = lessons.value.filter((l) => l.id !== lessonId)
            toast.success('Lição apagada com sucesso!')
          } catch (error) {
            console.error('Erro ao apagar lição:', error)
            toast.error('Não foi possível apagar a lição.')
          }
          toastObject.dismiss()
        },
      },
      {
        text: 'Cancelar',
        onClick: (e, toastObject) => {
          toastObject.dismiss()
        },
      },
    ],
  })
}

onMounted(fetchAllData)
</script>

<template>
  <div class="list-page">
    <div class="list-header">
      <h1>Gerir Lições</h1>
      <RouterLink to="/admin/licoes/novo" class="btn-new">Criar Nova Lição</RouterLink>
    </div>

    <div v-if="isLoading">A carregar...</div>
    <table v-else class="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Título da Lição</th>
          <th>Módulo</th>
          <th>Curso</th>
          <th>Duração (min)</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="lesson in lessons" :key="lesson.id">
          <td>{{ lesson.id }}</td>
          <td>{{ lesson.title }}</td>
          <td>{{ getModuleName(lesson.moduleId) }}</td>
          <td>{{ getCourseNameByModuleId(lesson.moduleId) }}</td>
          <td>{{ lesson.duration_in_minutes }}</td>
          <td class="actions">
            <RouterLink :to="`/admin/licoes/editar/${lesson.id}`" class="btn-edit"
              >Editar</RouterLink
            >
            <button @click="handleDelete(lesson.id)" class="btn-delete">Apagar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped></style>
