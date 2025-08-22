import apiClient from './api'

// --- Funções de Leitura ---
export const getAllCourses = () => apiClient.get('/course-service/courses')
export const getCourseById = (id) => apiClient.get(`/course-service/courses/${id}`)
export const getAllModules = () => apiClient.get('/course-service/modules')
export const getAllLessons = () => apiClient.get('/course-service/lessons')
export const getAllUsers = () => apiClient.get('/auth-service/users')

// --- Funções de Escrita ---
export const createCourse = (courseData) => apiClient.post('/course-service/courses', courseData)
export const createModule = (moduleData) => apiClient.post('/course-service/modules', moduleData)
export const createLesson = (lessonData) => apiClient.post('/course-service/lessons', lessonData)

// --- Funções de Atualização e Deleção (Novas) ---
export const updateCourse = (id, courseData) =>
  apiClient.patch(`/course-service/courses/${id}`, courseData)
export const deleteCourse = (id) => apiClient.delete(`/course-service/courses/${id}`)

// Adicione aqui os métodos para update/delete de Módulos e Lições quando precisar
export const updateModule = (id, moduleData) =>
  apiClient.patch(`/course-service/modules/${id}`, moduleData)
export const deleteModule = (id) => apiClient.delete(`/course-service/modules/${id}`)
export const updateLesson = (id, lessonData) =>
  apiClient.patch(`/course-service/lessons/${id}`, lessonData)
export const deleteLesson = (id) => apiClient.delete(`/course-service/lessons/${id}`)
