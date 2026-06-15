import { createRouter, createWebHistory } from 'vue-router'
import ChessView from '../views/chessview.vue'
import PastGamesView from '../views/PastGamesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'chess',
      component: ChessView,
      path: '/past-games', name: 'past-games', component: PastGamesView
    },
  ],
})

export default router