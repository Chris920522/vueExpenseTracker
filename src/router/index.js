import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BankView from '../views/BankView.vue'
import CashView from '@/views/CashView.vue'
import App from '../App.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/bank',
    name: 'bank',
    component: BankView
  },
  {
    path: '/cash',
    name: 'cash',
    component: CashView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
