import type { NavigationMenuItem } from '@nuxt/ui/components/NavigationMenu.vue'
import type { RouteComponent } from 'vue-router'

import { GROUPS } from './areas/foundation/sections.ts'

export const LIBRARY = 'NichtImKopf UI'

export interface Area {
  id: string
  label: string
  /** What the area holds, under its name on the start page. */
  description: string
  icon: string
  page: () => Promise<RouteComponent>
  /** The area's pages, in groups under their labels, beside the page. */
  navigation?: NavigationMenuItem[][]
}

export const AREAS: Area[] = [
  {
    id: 'foundation',
    label: 'Foundation',
    description: 'Colors, type, icons, shape and space',
    icon: 'i-hugeicons-paint-board',
    page: () => import('./areas/foundation/FoundationPage.vue'),
    navigation: GROUPS.map((group) => [
      { label: group.label, type: 'label' },
      ...group.sections.map((section) => ({
        label: section.label,
        icon: section.icon,
        to: { name: 'section', params: { section: section.id } },
      })),
    ]),
  },
  {
    id: 'components',
    label: 'Components',
    description: 'The parts, family by family',
    icon: 'i-hugeicons-puzzle',
    page: () => import('./areas/components/ComponentsPage.vue'),
  },
]
