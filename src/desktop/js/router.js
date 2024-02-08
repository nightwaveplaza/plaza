import Index from '@desktop/js/views/Index.vue'
import Reset from '@desktop/js/views/Reset.vue'
import Register from '@desktop/js/views/Register.vue'
import PageNotFound from '@desktop/js/views/PageNotFound.vue'
import Donate from '@desktop/js/views/Donate.vue'
import DeleteAccount from '@desktop/js/views/DeleteAccount.vue'
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
    path: '/delete-account',
    name: 'delete-account',
    component: DeleteAccount,
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
