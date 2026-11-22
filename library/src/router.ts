import { createRouter, createWebHistory } from 'vue-router'

import { AREAS } from './areas.ts'
import HomePage from './shell/HomePage.vue'
import LibraryShell from './shell/LibraryShell.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: LibraryShell,
      children: [
        { path: '', name: 'home', component: HomePage },
        ...AREAS.map((area) => ({ path: area.id, name: area.id, component: area.page })),
      ],
    },
  ],
})
