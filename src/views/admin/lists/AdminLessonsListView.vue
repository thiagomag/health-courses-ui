<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { getAllLessons, deleteLesson } from '@/services/courseService'

import '@/assets/admin-list-forms.css'

const lessons = ref([])
const isLoading = ref(true)

async function fetchLessons() {
  try {
    const response = await getAllLessons()
    lessons.value = response.data
  } catch (error) {
    console.error('Erro ao buscar lições:', error)
  } finally {
    isLoading.value = false
  }
}

async function handleDelete(lessonId) {
  if (confirm('Tem a certeza que deseja apagar esta lição? Esta ação não pode ser desfeita.')) {
    try {
      await deleteLesson(lessonId)
      // Atualiza a lista removendo o lição apagado
      lessons.value = lessons.value.filter((c) => c.id !== lessonId)
    } catch (error) {
      console.error('Erro ao apagar lição:', error)
      alert('Não foi possível apagar a lição.')
    }
  }
}

onMounted(fetchLessons)
</script>

<template>
  <div class="list-page">
    <div class="list-header">
      <h1>Gerir Lições</h1>
      <RouterLink to="/admin/licoes/novo" class="btn-new">Criar Novo Módulo</RouterLink>
    </div>

    <div v-if="isLoading">A carregar...</div>
    <table v-else class="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Descrição</th>
          <th>Link Video</th>
          <th>Duração</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="lesson in lessons" :key="lesson.id">
          <td>{{ lesson.id }}</td>
          <td>{{ lesson.title }}</td>
          <td>{{ lesson.description }}</td>
          <td>{{ lesson.video_url }}</td>
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
