import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// Cria uma instância do Axios com a URL base do Gateway
const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // A mesma URL base
  headers: {
    'Content-Type': 'application/json',
  },
})

// Este é o Interceptor. Ele "intercepta" cada requisição antes de ela ser enviada.
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.token

    // Se o token existir, adiciona o header 'Authorization'
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Verifica cada resposta da API
apiClient.interceptors.response.use(
  // Se a resposta for bem-sucedida (status 2xx), apenas a retorna
  (response) => {
    return response
  },
  // Se a resposta for um erro...
  (error) => {
    // Obtém a store para poder chamar a ação de logout
    const authStore = useAuthStore()

    // Verifica se o erro é um 401 Unauthorized
    if (error.response && error.response.status === 401) {
      console.error('Erro de autenticação (401). A forçar logout.')
      // Chama a função de logout para limpar o estado e o localStorage
      authStore.logout()
      // Redireciona o utilizador para a página de login
      // Usamos window.location para garantir um recarregamento completo da página
      window.location.href = '/login'
    }

    // Rejeita a promise para que o erro possa ser tratado
    // no local onde a chamada de API foi feita (ex: no CoursesView.vue)
    return Promise.reject(error)
  },
)

export default apiClient
