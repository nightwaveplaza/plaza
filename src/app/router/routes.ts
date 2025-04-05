import Index from '@app/views/Index.vue'
import ResetPassword from '@app/views/ResetPassword.vue'
import UserRegister from '@app/views/UserRegister.vue'
import SupportUs from '@app/views/SupportUs.vue'
import DeleteAccount from '@app/views/DeleteAccount.vue'
import PageNotFound from '@app/views/PageNotFound.vue'

function redirect404 (): void {
  window.location.href = '/404'
}

export default [
  {
    path: '/',
    name: 'index',
    component: Index,
  },
  {
    path: '/reset/:token?',
    name: 'reset',
    component: ResetPassword,
    props: true,
  },
  {
    path: '/register',
    name: 'register',
    component: UserRegister,
  },
  {
    path: '/donate',
    name: 'donate',
    component: SupportUs,
  },
  {
    path: '/delete-account',
    name: 'delete-account',
    component: DeleteAccount,
  },
  {
    path: '/404',
    name: '404',
    component: PageNotFound
  },
  {
    path: '/:pathMatch(.*)*',
    component: PageNotFound,
    beforeEnter: [redirect404]
  }
]
