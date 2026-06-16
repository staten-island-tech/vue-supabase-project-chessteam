import { createRouter, createWebHistory } from 'vue-router'
import ChessView from '../views/chessview.vue'
import PastGamesView from '../views/PastGamesView.vue'
import { supabase } from '../utils/supabase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'chess',
      component: ChessView,
      meta: { requiresAuth: true }  
    },
    {
      path: '/past-games',
      name: 'past-games',
      component: PastGamesView,
      meta: { requiresAuth: true }  
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()

  if (to.meta.requiresAuth && !session) {
    next('/login')      
  } else {
    next()               
  }
})

export default router