import { createRouter, createWebHashHistory } from 'vue-router'
import AccountView from '@/views/AccountView.vue'

const routes = [
  {
    path: '/',
    name: 'AccountView',
    component: AccountView
  },
  {
    path: '/account/:accountId?',
    name: 'account',
    component: AccountView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
