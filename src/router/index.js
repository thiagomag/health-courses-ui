import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// ... (imports das views e layouts)
import AdminLayout from '@/layouts/AdminLayout.vue'
import LoginView from '@/views/LoginView.vue'
import CoursesView from '@/views/CoursesView.vue'
//import CourseDetailView from '@/views/CourseDetailView.vue'
import AdminDashboardView from '@/views/admin/AdminDashboardView.vue'
import CreateCourseView from '@/views/admin/CreateCourseView.vue'
import CreateModuleView from '@/views/admin/CreateModuleView.vue'
import CreateLessonView from '@/views/admin/CreateLessonView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ... (as suas rotas existentes)
    { path: '/login', name: 'login', component: LoginView },
    { path: '/', redirect: '/cursos' },
    { path: '/cursos', name: 'courses', component: CoursesView, meta: { requiresAuth: true } },
    //    {
    //      path: '/cursos/:id',
    //      name: 'course-detail',
    //      component: CourseDetailView,
    //      meta: { requiresAuth: true },
    //    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        { path: '', name: 'admin-dashboard', component: AdminDashboardView },
        { path: 'cursos/novo', name: 'admin-create-course', component: CreateCourseView },
        { path: 'modulos/novo', name: 'admin-create-module', component: CreateModuleView },
        { path: 'licoes/novo', name: 'admin-create-lesson', component: CreateLessonView },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth
  const requiresAdmin = to.meta.requiresAdmin

  if (requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login' })
  }

  const isAdmin = authStore.user?.role?.some((r) => r.name === 'ROLE_ADMIN')

  if (requiresAdmin && !isAdmin) {
    // Se a rota exige admin e o utilizador não o é, redireciona.
    return next({ name: 'courses' })
  }

  next()
})

export default router
