<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { getAllCourses, deleteCourse } from '@/services/courseService'

import '@/assets/admin-list-forms.css'

const courses = ref([])
const isLoading = ref(true)

async function fetchCourses() {
  try {
    const response = await getAllCourses()
    courses.value = response.data
  } catch (error) {
    console.error('Erro ao buscar cursos:', error)
  } finally {
    isLoading.value = false
  }
}

async function handleDelete(courseId) {
  if (confirm('Tem a certeza que deseja apagar este curso? Esta ação não pode ser desfeita.')) {
    try {
      await deleteCourse(courseId)
      // Atualiza a lista removendo o curso apagado
      courses.value = courses.value.filter((c) => c.id !== courseId)
    } catch (error) {
      console.error('Erro ao apagar curso:', error)
      alert('Não foi possível apagar o curso.')
    }
  }
}

onMounted(fetchCourses)
</script>

<template>
  <div class="list-page">
    <div class="list-header">
      <h1>Gerir Cursos</h1>
      <RouterLink to="/admin/cursos/novo" class="btn-new">Criar Novo Curso</RouterLink>
    </div>

    <div v-if="isLoading">A carregar...</div>
    <table v-else class="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Descrição</th>
          <th>Categoria</th>
          <th>Ativo</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="course in courses" :key="course.id">
          <td>{{ course.id }}</td>
          <td>{{ course.name }}</td>
          <td>{{ course.description }}</td>
          <td>{{ course.category }}</td>
          <td>{{ course.active ? 'Sim' : 'Não' }}</td>
          <td class="actions">
            <RouterLink :to="`/admin/cursos/editar/${course.id}`" class="btn-edit"
              >Editar</RouterLink
            >
            <button @click="handleDelete(course.id)" class="btn-delete">Apagar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
