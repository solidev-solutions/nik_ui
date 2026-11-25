import buttonsAndLinks from './families/buttons-and-links/family.ts'
import type { Family } from './types.ts'

/** The families in their groups. A family enters the list with its folder. */
export const GROUPS: { label: string; families: Family[] }[] = [
  { label: 'Actions', families: [buttonsAndLinks] },
]

export const FAMILIES = GROUPS.flatMap((group) => group.families)

export const familyOf = (id: unknown) => FAMILIES.find((family) => family.id === id)
