import VueRouter from 'vue-router';
import Index from '@desktop/js/pages/Index';
import Reset from '@desktop/js/pages/Reset';
import Register from '@desktop/js/pages/Register';

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
    props: true
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  }
];

const router = new VueRouter({
  history: true,
  mode: 'history',
  routes,
});

export default router;
