<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Pega a instância do router para podermos redirecionar o usuário
const router = useRouter()
// Pega a instância da nossa store de autenticação
const authStore = useAuthStore()

// Cria variáveis reativas para os campos do formulário
// 'ref' faz com que qualquer mudança na variável atualize a interface
const email = ref('')
const password = ref('')
const errorMessage = ref(null) // Para mostrar mensagens de erro

// Função que será chamada quando o formulário for submetido
async function handleLogin() {
  errorMessage.value = null // Limpa erros antigos

  // Chama a ação de login da nossa store
  const success = await authStore.login(email.value, password.value)

  if (success) {
    // Se o login for bem-sucedido, redireciona para a página de cursos
    // (Vamos criar a rota '/cursos' no próximo passo)
    router.push('/cursos')
  } else {
    // Se falhar, mostra uma mensagem de erro
    errorMessage.value = 'E-mail ou senha inválidos. Tente novamente.'
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h1>Acessar Plataforma</h1>
      <p class="subtitle">Bem-vindo(a) de volta!</p>

      <!-- O evento @submit.prevent chama nossa função handleLogin -->
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">E-mail</label>
          <!-- v-model conecta o campo do formulário à nossa variável 'email' -->
          <input type="email" id="email" v-model="email" required placeholder="seu@email.com" />
        </div>

        <div class="input-group">
          <label for="password">Senha</label>
          <input type="password" id="password" v-model="password" required placeholder="********" />
        </div>

        <!-- Mostra a mensagem de erro, se houver -->
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <button type="submit" class="login-button">Entrar</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* 'scoped' significa que este CSS só se aplica a este componente */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #f7f8fc;
}

.login-box {
  background: white;
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

h1 {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.subtitle {
  color: #777;
  margin-bottom: 2rem;
}

.input-group {
  text-align: left;
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.input-group input {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box; /* Garante que padding não aumente a largura */
}

.input-group input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
}

.login-button {
  width: 100%;
  padding: 0.9rem;
  border: none;
  background-color: #4a90e2;
  color: white;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.login-button:hover {
  background-color: #357abd;
}

.error-message {
  color: #e74c3c;
  background-color: #fbe2e0;
  border: 1px solid #e74c3c;
  padding: 0.8rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}
</style>
