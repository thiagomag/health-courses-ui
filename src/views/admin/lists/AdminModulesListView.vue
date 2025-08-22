<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { getAllModules, deleteModule } from '@/services/courseService'

import '@/assets/admin-list-forms.css'

const modules = ref([])
const isLoading = ref(true)

async function fetchModules() {
  try {
    const response = await getAllModules()
    modules.value = response.data
  } catch (error) {
    console.error('Erro ao buscar módulos:', error)
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
          <th>Título</th>
          <th>Descrição</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="module in modules" :key="module.id">
          <td>{{ module.id }}</td>
          <td>{{ module.title }}</td>
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
