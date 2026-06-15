import { createRouter, createWebHistory } from 'vue-router'

import LoginViews from '../../components/LoginViews.vue'
import SignupViews from '../views/signupviews.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginViews,
    },
    {
      path: '/signup',
      name: 'Signup',
      component: SignupViews,
    },
  ],
})

export default router