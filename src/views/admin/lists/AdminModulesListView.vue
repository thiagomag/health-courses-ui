<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { getAllModules, deleteModule, getAllCourses } from '@/services/courseService'

import '@/assets/admin-list-forms.css'

const modules = ref([])
const courses = ref([])
const isLoading = ref(true)

const courseMap = computed(() => {
  const map = {}
  for (const course of courses.value) {
    map[course.id] = course.name
  }
  return map
})

function getCourseName(courseId) {
  return courseMap.value[courseId] || 'Curso não encontrado'
}

async function fetchModules() {
  try {
    const [modulesResponse, coursesResponse] = await Promise.all([getAllModules(), getAllCourses()])
    modules.value = modulesResponse.data
    courses.value = coursesResponse.data
  } catch (error) {
    console.error('Erro ao buscar dados:', error)
  } finally {
    isLoading.value = false
  }
}

async function handleDelete(moduleId) {
  if (confirm('Tem a certeza que deseja apagar este modulo? Esta ação não pode ser desfeita.')) {
    try {
      await deleteModule(moduleId)
      // Atualiza a lista removendo o módulo apagado
      modules.value = modules.value.filter((c) => c.id !== moduleId)
    } catch (error) {
      console.error('Erro ao apagar módulo:', error)
      alert('Não foi possível apagar o módulo.')
    }
  }
}

onMounted(fetchModules)
</script>

<template>
  <div class="list-page">
    <div class="list-header">
      <h1>Gerir Módulos</h1>
      <RouterLink to="/admin/modulos/novo" class="btn-new">Criar Novo Módulo</RouterLink>
    </div>

    <div v-if="isLoading">A carregar...</div>
    <table v-else class="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Título do Módulo</th>
          <th>Curso Associado</th>
          <th>Descrição</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="module in modules" :key="module.id">
          <td>{{ module.id }}</td>
          <td>{{ module.title }}</td>
          <td>{{ getCourseName(module.courseId) }}</td>
          <td>{{ module.description }}</td>
          <td class="actions">
            <RouterLink :to="`/admin/modulos/editar/${module.id}`" class="btn-edit"
              >Editar</RouterLink
            >
            <button @click="handleDelete(module.id)" class="btn-delete">Apagar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped></style>
