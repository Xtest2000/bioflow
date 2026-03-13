import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/dashboard',
        },
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/index.vue'),
        },
        {
          path: 'tools',
          name: 'Tools',
          component: () => import('@/views/tools/index.vue'),
        },
        {
          path: 'tools/:id',
          name: 'ToolDetail',
          component: () => import('@/views/tools/detail.vue'),
        },
        {
          path: 'tools/:id/submit',
          name: 'ToolSubmit',
          component: () => import('@/views/tools/submit.vue'),
        },
        {
          path: 'tasks',
          name: 'Tasks',
          component: () => import('@/views/tasks/index.vue'),
        },
        {
          path: 'tasks/:id',
          name: 'TaskDetail',
          component: () => import('@/views/tasks/detail.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && userStore.isLoggedIn) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
