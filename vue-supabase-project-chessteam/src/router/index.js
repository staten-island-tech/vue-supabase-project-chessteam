import { createRouter, createWebHistory } from 'vue-router'
import LoginViews from '../viewss/LoginViews.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginViews,
    },
  ],
})

export default router
