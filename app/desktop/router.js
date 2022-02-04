import VueRouter from 'vue-router';
import Index from '@desktop/views/Index';
import Reset from '@desktop/views/Reset';
import Register from '@desktop/views/Register';
import PageNotFound from '@desktop/views/PageNotFound';
import Donate from '@desktop/views/Donate';

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
    path: '*',
    component: PageNotFound,
  },
];

const router = new VueRouter({
  history: true,
  mode: 'history',
  routes,
});

export default router;
