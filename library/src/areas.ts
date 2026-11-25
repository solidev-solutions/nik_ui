import type { RouteComponent } from 'vue-router'

export const LIBRARY = 'NichtImKopf UI'

interface Area {
  id: string
  label: string
  icon: string
  page: () => Promise<RouteComponent>
}

export const AREAS: Area[] = [
  {
    id: 'foundation',
    label: 'Foundation',
    icon: 'i-hugeicons-paint-board',
    page: () => import('./areas/foundation/FoundationPage.vue'),
  },
  {
    id: 'components',
    label: 'Components',
    icon: 'i-hugeicons-puzzle',
    page: () => import('./areas/components/ComponentsPage.vue'),
  },
]
