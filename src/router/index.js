import Vue from 'vue'
import VueRouter from 'vue-router'
import JoinGame from '../views/JoinGame.vue'
import Lobby from '../views/Lobby.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'JoinGame',
    component: JoinGame,
  },
  {
    path: '/lobby',
    name: 'Lobby',
    component: Lobby
  },
  {
    path: '/game',
    name: 'Game',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Game.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
