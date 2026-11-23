import type { RouteComponent } from 'vue-router'

export const LIBRARY = 'NichtImKopf UI'

interface Area {
  id: string
  label: string
  /** What the area holds, under its name on the start page. */
  description: string
  icon: string
  page: () => Promise<RouteComponent>
}

export const AREAS: Area[] = [
  {
    id: 'foundation',
    label: 'Foundation',
    description: 'Colors, type, icons, shape and space',
    icon: 'i-hugeicons-paint-board',
    page: () => import('./areas/foundation/FoundationPage.vue'),
  },
  {
    id: 'components',
    label: 'Components',
    description: 'The parts, family by family',
    icon: 'i-hugeicons-puzzle',
    page: () => import('./areas/components/ComponentsPage.vue'),
  },
]
