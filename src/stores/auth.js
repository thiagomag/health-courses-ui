import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import apiClient from '@/services/api'

const API_URL = 'http://localhost:8080'

export const useAuthStore = defineStore('auth', () => {
  const storedToken = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')

  const token = ref(storedToken || null)
  const user = ref(storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : null)

  if (token.value) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  const isAuthenticated = computed(() => !!token.value)

  async function login(email, password) {
    try {
      // 1. Fazer o login para obter o token
      const loginResponse = await axios.post(`${API_URL}/auth-service/users/login`, {
        email,
        password,
      })

      const responseToken = loginResponse.data.token
      if (!responseToken) {
        throw new Error('Token não recebido na resposta de login.')
      }

      // 2. Guardar o token e configurar o header para a próxima chamada
      token.value = responseToken
      localStorage.setItem('token', responseToken)
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${responseToken}`

      // 3. Chamar o endpoint /me para buscar os dados do utilizador
      const userResponse = await apiClient.get('/auth-service/users/me')
      const responseUser = userResponse.data

      // 4. Guardar os dados do utilizador no estado e no localStorage
      user.value = responseUser
      if (responseUser) {
        localStorage.setItem('user', JSON.stringify(responseUser))
      } else {
        localStorage.removeItem('user')
      }

      return true // Sucesso
    } catch (error) {
      console.error('Erro no processo de login:', error.response?.data || error.message)
      logout() // Garante que tudo é limpo em caso de falha
      return false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete apiClient.defaults.headers.common['Authorization']
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
  }
})
