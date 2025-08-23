import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layouts
import AdminLayout from '@/layouts/AdminLayout.vue'

// Views
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import CoursesView from '@/views/CoursesView.vue'

// Admin Views
import AdminDashboardView from '@/views/admin/AdminDashboardView.vue'
import CreateCourseView from '@/views/admin/CreateCourseView.vue'
import CreateModuleView from '@/views/admin/CreateModuleView.vue'
import CreateLessonView from '@/views/admin/CreateLessonView.vue'
// Views de Listagem
import AdminCoursesListView from '@/views/admin/lists/AdminCoursesListView.vue'
import AdminModulesListView from '@/views/admin/lists/AdminModulesListView.vue'
import AdminLessonsListView from '@/views/admin/lists/AdminLessonsListView.vue'
// Views de Edição
import EditCourseView from '@/views/admin/edit/EditCourseView.vue'
import EditModuleView from '@/views/admin/edit/EditModuleView.vue'
import EditLessonView from '@/views/admin/edit/EditLessonView.vue'
// Views de Detalhes
import CourseDetailView from '@/views/student/CourseDetailView.vue'
import ModuleDetailView from '@/views/student/ModuleDetailView.vue'
import LessonDetailView from '@/views/student/LessonDetailView.vue'
import CourseWelcomeView from '@/views/student/CourseWelcomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView }, // Adicione a nova rota
    { path: '/', redirect: '/cursos' },
    { path: '/cursos', name: 'courses', component: CoursesView, meta: { requiresAuth: true } },
    {
      path: '/cursos/:courseId',
      component: CourseDetailView, // O componente PAI que terá o menu de módulos
      meta: { requiresAuth: true },
      children: [
        // Rota inicial quando se entra num curso
        { path: '', name: 'course-welcome', component: CourseWelcomeView },
        // Rota para exibir as lições de um módulo específico
        {
          path: 'modulos/:moduleId',
          name: 'module-detail',
          component: ModuleDetailView,
        },
        // Rota para exibir o vídeo de uma lição específica
        {
          path: 'modulos/:moduleId/licoes/:lessonId',
          name: 'lesson-detail',
          component: LessonDetailView,
        },
      ],
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        { path: '', name: 'admin-dashboard', component: AdminDashboardView },
        // Rotas de Criação
        { path: 'cursos/novo', name: 'admin-create-course', component: CreateCourseView },
        { path: 'modulos/novo', name: 'admin-create-module', component: CreateModuleView },
        { path: 'licoes/novo', name: 'admin-create-lesson', component: CreateLessonView },
        // Rotas de Listagem
        { path: 'cursos', name: 'admin-list-courses', component: AdminCoursesListView },
        { path: 'modulos', name: 'admin-list-modules', component: AdminModulesListView },
        { path: 'licoes', name: 'admin-list-lessons', component: AdminLessonsListView },
        // Novas Rotas de Edição
        { path: 'cursos/editar/:id', name: 'admin-edit-course', component: EditCourseView },
        { path: 'modulos/editar/:id', name: 'admin-edit-module', component: EditModuleView },
        { path: 'licoes/editar/:id', name: 'admin-edit-lesson', component: EditLessonView },
      ],
    },
  ],
})

// O guarda de rota (beforeEach) permanece o mesmo

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth
  const requiresAdmin = to.meta.requiresAdmin

  if (requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login' })
  }

  const isAdmin = authStore.user?.role?.some((r) => r.name === 'ROLE_ADMIN')

  if (requiresAdmin && !isAdmin) {
    return next({ name: 'courses' })
  }

  next()
})

export default router
