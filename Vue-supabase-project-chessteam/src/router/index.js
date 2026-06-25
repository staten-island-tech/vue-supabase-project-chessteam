import { createRouter, createWebHistory } from 'vue-router'
import ChessView from '../views/chessview.vue'
import PastGamesView from '../views/PastGamesView.vue'
import { supabase } from '../utils/supabase.js'

import LoginViews from '../components/LoginViews.vue'
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
  {
    path: '/chess',
    name: 'chess',
    component: ChessView,
    meta: { requiresAuth: true }
  },
  {
    path: '/past-games',
    name: 'past-games',
    component: PastGamesView,
    meta: { requiresAuth: true }
  }
],
})

router.beforeEach(async (to) => {
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (to.meta.requiresAuth && !session) {
    return '/'
  }

  return true
})
export default router