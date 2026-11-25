import type { Component } from 'vue'

import type { Guidelines } from './types.ts'

const VIEWS = import.meta.glob<Component>('./families/*/*.vue', { import: 'default' })
const SOURCES = import.meta.glob<string>('./families/*/*.vue', { query: '?raw', import: 'default' })
// Every family's guidelines come in the family pages' script, not each in a file of its own: they
// are little text, and so a block has no lines to wait for.
const GUIDELINES = import.meta.glob<Record<string, Guidelines>>('./families/*/guidelines.ts', {
  eager: true,
  import: 'default',
})

/** What loads an example's file: the one in its family's folder that has its name. */
function fileOf<T>(files: Record<string, () => Promise<T>>, family: string, example: string) {
  const file = `./families/${family}/${example}.vue`
  const load = files[file]
  if (!load) throw new Error(`An example is declared without its file: ${file}`)
  return load
}

export const viewOf = (family: string, example: string) => fileOf(VIEWS, family, example)

/** What loads an example's file as it is written, to show its code. */
export const sourceOf = (family: string, example: string) => fileOf(SOURCES, family, example)

/** A member's guidelines, from the file of that name in its family's folder. */
export function guidelinesOf(family: string, member: string) {
  const guidelines = GUIDELINES[`./families/${family}/guidelines.ts`]?.[member]
  if (!guidelines) throw new Error(`A member is declared without its guidelines: ${member}`)
  return guidelines
}
