import Index from '@desktop/views/Index'
import Reset from '@desktop/views/Reset'
import Register from '@desktop/views/Register'
import PageNotFound from '@desktop/views/PageNotFound'
import Donate from '@desktop/views/Donate'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index,
  },
  {
    path: '/reset/:token?',
    name: 'reset',
    component: Reset,
    props: true,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/donate',
    name: 'donate',
    component: Donate,
  },
  {
    path: '/:pathMatch(.*)*',
    component: PageNotFound,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
