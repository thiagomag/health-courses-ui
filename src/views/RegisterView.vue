<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useToast } from 'vue-toastification'
import { createUser } from '@/services/courseService'

const router = useRouter()
const toast = useToast()

// Estrutura de dados baseada no cURL
const userData = ref({
  fullName: '',
  email: '',
  password: '',
  cpf: '',
  telephones: [
    {
      countryCode: '55',
      areaCode: '',
      number: '',
      type: 'MOBILE', // Valor padrão
    },
  ],
  addresses: [
    {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      country: 'Brasil',
      postalCode: '',
    },
  ],
})

// Opções para o tipo de telefone, baseadas no Enum
const telephoneTypes = ['HOME', 'MOBILE', 'WORK', 'OTHER']

async function handleSubmit() {
  try {
    await createUser(userData.value)
    toast.success('Usuário criado com sucesso! Agora você pode fazer o login.')
    // Redireciona para a página de login após o sucesso
    router.push('/login')
  } catch (error) {
    console.error('Erro ao criar usuário:', error.response?.data || error)
    const errorMessage =
      error.response?.data?.message ||
      'Não foi possível criar o usuário. Verifique os dados e tente novamente.'
    toast.error(errorMessage)
  }
}
</script>

<template>
  <div class="register-container">
    <div class="register-box">
      <h1>Crie a sua Conta</h1>
      <p class="subtitle">Preencha os seus dados para começar a aprender.</p>

      <form @submit.prevent="handleSubmit">
        <fieldset>
          <legend>Dados Pessoais</legend>
          <div class="input-group">
            <label for="fullName">Nome Completo</label>
            <input type="text" id="fullName" v-model="userData.fullName" required />
          </div>
          <div class="input-group">
            <label for="email">E-mail</label>
            <input type="email" id="email" v-model="userData.email" required />
          </div>
          <div class="input-group">
            <label for="password">Senha</label>
            <input type="password" id="password" v-model="userData.password" required />
          </div>
          <div class="input-group">
            <label for="cpf">CPF</label>
            <input type="text" id="cpf" v-model="userData.cpf" required />
          </div>
        </fieldset>

        <fieldset>
          <legend>Contato</legend>
          <div class="grid-3">
            <div class="input-group">
              <label for="countryCode">DDI</label>
              <input
                type="text"
                id="countryCode"
                v-model="userData.telephones[0].countryCode"
                required
              />
            </div>
            <div class="input-group">
              <label for="areaCode">DDD</label>
              <input type="text" id="areaCode" v-model="userData.telephones[0].areaCode" required />
            </div>
            <div class="input-group">
              <label for="number">Número</label>
              <input type="text" id="number" v-model="userData.telephones[0].number" required />
            </div>
          </div>
          <div class="input-group">
            <label for="type">Tipo</label>
            <select id="type" v-model="userData.telephones[0].type" required>
              <option v-for="type in telephoneTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>
        </fieldset>

        <fieldset>
          <legend>Endereço</legend>
          <div class="input-group">
            <label for="postalCode">CEP</label>
            <input
              type="text"
              id="postalCode"
              v-model="userData.addresses[0].postalCode"
              required
            />
          </div>
          <div class="input-group">
            <label for="street">Rua</label>
            <input type="text" id="street" v-model="userData.addresses[0].street" required />
          </div>
          <div class="grid-2">
            <div class="input-group">
              <label for="addressNumber">Número</label>
              <input
                type="text"
                id="addressNumber"
                v-model="userData.addresses[0].number"
                required
              />
            </div>
            <div class="input-group">
              <label for="complement">Complemento</label>
              <input type="text" id="complement" v-model="userData.addresses[0].complement" />
            </div>
          </div>
          <div class="input-group">
            <label for="neighborhood">Bairro</label>
            <input
              type="text"
              id="neighborhood"
              v-model="userData.addresses[0].neighborhood"
              required
            />
          </div>
          <div class="grid-2">
            <div class="input-group">
              <label for="city">Cidade</label>
              <input type="text" id="city" v-model="userData.addresses[0].city" required />
            </div>
            <div class="input-group">
              <label for="state">Estado</label>
              <input type="text" id="state" v-model="userData.addresses[0].state" required />
            </div>
          </div>
        </fieldset>

        <button type="submit" class="register-button">Criar Conta</button>
      </form>
      <p class="login-link">Já tem uma conta? <RouterLink to="/login">Faça o login</RouterLink></p>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 1rem;
  background-color: #f7f8fc;
  min-height: 100vh;
}

.register-box {
  background: white;
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
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

form {
  text-align: left;
}

fieldset {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

legend {
  font-weight: 600;
  color: #4a90e2;
  padding: 0 0.5rem;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
  font-size: 0.9rem;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
}

.input-group input:focus,
.input-group select:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.grid-3 {
  display: grid;
  grid-template-columns: 80px 80px 1fr;
  gap: 1rem;
}

.register-button {
  width: 100%;
  padding: 0.9rem;
  border: none;
  background-color: #27ae60;
  color: white;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 1rem;
}

.register-button:hover {
  background-color: #229954;
}

.login-link {
  margin-top: 1.5rem;
  font-size: 0.9rem;
}
</style>
