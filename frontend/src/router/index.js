import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/pages/LandingPage.vue'
import Login from '@/pages/Login.vue'
import SignUp from '@/pages/SignUp.vue'
import BusinessDashboard from '@/pages/BusinessDashboard.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: LandingPage },
    { path: '/login', component: Login },
    { path: '/signup', component: SignUp },
    { path: '/dashboard', component: BusinessDashboard },
  ],
})

export default router
