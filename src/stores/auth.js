import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import apiClient from '@/services/api'

// A URL base do seu API Gateway
const API_URL = 'http://localhost:8080' // Ou a porta que você configurou

// 'defineStore' é como criar um @Service singleton no Spring
export const useAuthStore = defineStore('auth', () => {
  // Primeiro, obtemos os itens do localStorage de forma segura
  const storedToken = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')

  // Verificamos não só se 'storedUser' existe, mas também se não é a string "undefined".
  const token = ref(storedToken || null)
  const user = ref(storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : null)

  if (token.value) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  // 'computed' é como um getter que deriva seu valor de outros estados.
  const isAuthenticated = computed(() => !!token.value)

  // 'actions' são os métodos que alteram o estado.
  async function login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth-service/users/login`, {
        email,
        password,
      })

      // Extrai o token e os dados do usuário da resposta
      const responseToken = response.data.token
      const responseUser = response.data.user // Assumindo que a API retorna o usuário

      // Atualiza o estado
      token.value = responseToken
      user.value = responseUser

      // Salva no localStorage para persistência
      localStorage.setItem('token', responseToken)

      // Só guardamos o utilizador se ele de facto existir na resposta da API.
      if (responseUser) {
        localStorage.setItem('user', JSON.stringify(responseUser))
      } else {
        // Se não existir, garantimos que qualquer valor antigo seja removido.
        localStorage.removeItem('user')
      }

      apiClient.defaults.headers.common['Authorization'] = `Bearer ${responseToken}`

      return true // Sucesso
    } catch (error) {
      console.error('Erro no login:', error.response?.data || error.message)
      // Limpa o estado em caso de erro
      logout()
      return false // Falha
    }
  }

  function logout() {
    // Limpa o estado
    token.value = null
    user.value = null

    // Remove do localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    delete apiClient.defaults.headers.common['Authorization']
  }

  // O que a store "expõe" para o resto da aplicação
  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
  }
})
