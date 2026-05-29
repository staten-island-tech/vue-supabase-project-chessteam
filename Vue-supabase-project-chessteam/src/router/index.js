import { createRouter, createWebHistory } from 'vue-router'
import ChessView from '../views/chessview.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'chess',
      component: ChessView,
    },
  ],
})

export default router