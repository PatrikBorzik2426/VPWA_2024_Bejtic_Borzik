import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/HomePage.vue') }, 
      { path: 'login', component: () => import('pages/MainLogin.vue') }, 
      { path: 'register', component: () => import('pages/MainRegister.vue') },
      { path: 'news', component: () => import('pages/HomeNews.vue') },
      { path: 'faq', component: () => import('pages/HomeFaq.vue') },
      { path: 'aboutus', component: () => import('pages/HomeAboutUs.vue') }
    ],
  },

  // Always leave this as last one, 
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];


export default routes;
