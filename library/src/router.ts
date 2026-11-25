import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { type Area, AREAS, LIBRARY } from './areas.ts'
import { sectionOf } from './areas/foundation/sections.ts'
import HomePage from './shell/HomePage.vue'
import LibraryShell from './shell/LibraryShell.vue'

declare module 'vue-router' {
  interface RouteMeta {
    /** The area a page belongs to: its own page and the pages below it. */
    area?: Area
  }
}

/** The pages below an area's own page, by the area. */
const BELOW: Record<string, RouteRecordRaw[]> = {
  foundation: [
    {
      path: ':section',
      name: 'section',
      component: () => import('./areas/foundation/SectionPage.vue'),
      props: true,
    },
  ],
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: LibraryShell,
      children: [
        { path: '', name: 'home', component: HomePage },
        // Nested, so that the rail marks an area as the current one on the pages below it too.
        ...AREAS.map((area) => ({
          path: area.id,
          meta: { area },
          children: [{ path: '', name: area.id, component: area.page }, ...(BELOW[area.id] ?? [])],
        })),
      ],
    },
    { path: '/:unknown(.*)*', redirect: { name: 'home' } },
  ],
})

// For every way into a section's page: a guard of the route would not run where only the
// parameter changes.
router.beforeEach((to) => {
  if (to.name === 'section' && !sectionOf(to.params.section)) return { name: 'foundation' }
})

router.afterEach((to, _from, failure) => {
  if (failure) return
  // The page, then the pages above it.
  const titles = [sectionOf(to.params.section)?.label, to.meta.area?.label, LIBRARY]
  document.title = titles.filter(Boolean).join(' · ')
})
