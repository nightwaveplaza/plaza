import Index from '@app/views/Index.vue'
import Reset from '@app/views/Reset.vue'
import Register from '@app/views/Register.vue'
import Donate from '@app/views/Donate.vue'
import DeleteAccount from '@app/views/DeleteAccount.vue'
import PageNotFound from '@app/views/PageNotFound.vue'

export default [
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