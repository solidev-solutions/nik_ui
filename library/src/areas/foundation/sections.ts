/** The Foundation's pages in their groups. A page enters the list with the page itself. */
export const GROUPS = [
  {
    label: 'Colors',
    sections: [
      {
        id: 'palettes',
        label: 'Palettes',
        icon: 'i-hugeicons-colors',
        page: () => import('./PalettesSection.vue'),
      },
      {
        id: 'roles',
        label: 'Roles',
        icon: 'i-hugeicons-tag-01',
        page: () => import('./RolesSection.vue'),
      },
    ],
  },
  {
    label: 'Type and icons',
    sections: [
      {
        id: 'typography',
        label: 'Typography',
        icon: 'i-hugeicons-text-font',
        page: () => import('./TypographySection.vue'),
      },
    ],
  },
]

export const SECTIONS = GROUPS.flatMap((group) => group.sections)

export const sectionOf = (id: unknown) => SECTIONS.find((section) => section.id === id)
