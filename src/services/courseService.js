import apiClient from './api'

// --- Funções de Leitura ---
export const getAllCourses = () => apiClient.get('/course-service/courses')
export const getCourseById = (id) => apiClient.get(`/course-service/courses/${id}`)

// Adicionada função para buscar todos os módulos
export const getAllModules = () => apiClient.get('/course-service/modules')

// Adicionada função para buscar todos os utilizadores (para o dropdown de instrutores)
// NOTA: Certifique-se de que tem um endpoint GET /users no seu accounts-service
export const getAllUsers = () => apiClient.get('/auth-service/users')

// --- Funções de Escrita ---
export const createCourse = (courseData) => apiClient.post('/course-service/courses', courseData)
export const createModule = (moduleData) => apiClient.post('/course-service/modules', moduleData)
export const createLesson = (lessonData) => apiClient.post('/course-service/lessons', lessonData)
