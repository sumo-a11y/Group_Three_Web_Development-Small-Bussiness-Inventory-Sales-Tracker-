import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../views/Landing.vue'
import Login from '../views/Login.vue'
import SignIn from '../views/SignIn.vue'

const routes = [
  { path: '/', name: 'Landing', component: Landing },
  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'SignIn', component: SignIn }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
