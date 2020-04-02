import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeMenu from '../views/HomeMenu.vue'
import CreateGame from '../views/CreateGame.vue'
import JoinGame from '../views/JoinGame.vue'
import Lobby from '../views/Lobby.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'HomeMenu',
    component: HomeMenu
  },
  {
    path: '/create-game',
    name: 'CreateGame',
    component: CreateGame,
  },
  {
    path: '/join-game',
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
