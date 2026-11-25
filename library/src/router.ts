import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { type Area, AREAS, LIBRARY } from './areas.ts'
import { familyOf } from './areas/components/families.ts'
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
  components: [
    {
      path: ':family',
      name: 'family',
      component: () => import('./areas/components/FamilyPage.vue'),
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

// For every way into a page below an area's own: a guard of the route would not run where only
// the parameter changes.
router.beforeEach((to) => {
  if (to.name === 'section' && !sectionOf(to.params.section)) return { name: 'foundation' }
  if (to.name === 'family' && !familyOf(to.params.family)) return { name: 'components' }
})

router.afterEach((to, _from, failure) => {
  if (failure) return
  // The page, then the pages above it.
  const page = sectionOf(to.params.section) ?? familyOf(to.params.family)
  const titles = [page?.label, to.meta.area?.label, LIBRARY]
  document.title = titles.filter(Boolean).join(' · ')
})
