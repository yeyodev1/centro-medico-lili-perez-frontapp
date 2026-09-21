import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { site } from '@/config/site'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: site.name },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Acceso del personal', guestOnly: true },
  },
  {
    path: '/resultados',
    name: 'Results',
    component: () => import('@/views/ResultsView.vue'),
    meta: { title: 'Consulta tus resultados' },
  },
  {
    // El panel lleva su propio layout: App.vue oculta el header y el footer públicos.
    path: '/panel',
    component: () => import('@/layout/PanelLayout.vue'),
    meta: { requiresAuth: true, panel: true },
    children: [
      {
        path: '',
        name: 'Panel',
        component: () => import('@/views/panel/DashboardView.vue'),
        meta: { title: 'Resumen' },
      },
      {
        path: 'pacientes',
        name: 'Patients',
        component: () => import('@/views/panel/PatientsView.vue'),
        meta: { title: 'Pacientes' },
      },
      {
        path: 'pacientes/nuevo',
        name: 'PatientNew',
        component: () => import('@/views/panel/PatientFormView.vue'),
        meta: { title: 'Nuevo paciente' },
      },
      {
        path: 'pacientes/:id',
        name: 'PatientDetail',
        component: () => import('@/views/panel/PatientDetailView.vue'),
        meta: { title: 'Paciente' },
      },
      {
        path: 'pacientes/:id/editar',
        name: 'PatientEdit',
        component: () => import('@/views/panel/PatientFormView.vue'),
        meta: { title: 'Editar paciente' },
      },
      {
        path: 'usuarios',
        name: 'Users',
        component: () => import('@/views/panel/UsersView.vue'),
        meta: { title: 'Usuarios', requiresAdmin: true },
      },
      {
        path: 'cuenta',
        name: 'Account',
        component: () => import('@/views/AccountView.vue'),
        meta: { title: 'Mi cuenta' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Página no encontrada' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Con "atrás" el navegador devuelve la posición guardada; con un hash se
  // baja a la sección; si no, arriba.
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { left: 0, top: 0 }
  },
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth || to.meta.guestOnly) {
    // La sesión se verifica contra el API una sola vez por carga.
    await userStore.restore()
  }

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return { name: 'Login', query: { next: to.fullPath }, replace: true }
  }

  if (to.meta.guestOnly && userStore.isAuthenticated) {
    return { name: 'Panel', replace: true }
  }

  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    return { name: 'Panel', replace: true }
  }
})

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title && title !== site.name ? `${title} — ${site.name}` : site.name
})

export default router
