/** The Foundation's pages in their groups. A page enters the list with the page itself. */
export const GROUPS = [
  {
    label: 'Colors',
    sections: [{ id: 'palettes', label: 'Palettes', icon: 'i-hugeicons-colors' }],
  },
]

export const SECTIONS = GROUPS.flatMap((group) => group.sections)

export const sectionOf = (id: unknown) => SECTIONS.find((section) => section.id === id)
