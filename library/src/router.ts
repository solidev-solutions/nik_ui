import { createRouter, createWebHistory } from 'vue-router'

import { AREAS, LIBRARY } from './areas.ts'
import HomePage from './shell/HomePage.vue'
import LibraryShell from './shell/LibraryShell.vue'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: LibraryShell,
      children: [
        { path: '', name: 'home', component: HomePage },
        ...AREAS.map((area) => ({
          path: area.id,
          name: area.id,
          component: area.page,
          meta: { title: area.label },
        })),
      ],
    },
  ],
})

router.afterEach((to, _from, failure) => {
  if (failure) return
  document.title = to.meta.title ? `${to.meta.title} · ${LIBRARY}` : LIBRARY
})
