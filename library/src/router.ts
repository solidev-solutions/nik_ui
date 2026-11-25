import { createRouter, createWebHistory } from 'vue-router'

import HomePage from './shell/HomePage.vue'
import LibraryShell from './shell/LibraryShell.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: LibraryShell, children: [{ path: '', component: HomePage }] }],
})
