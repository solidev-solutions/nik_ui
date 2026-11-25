import type { Component } from 'vue'

const VIEWS = import.meta.glob<Component>('./families/*/*.vue', { import: 'default' })

/** What loads an example's file: the one in its family's folder that has its name. */
export function viewOf(family: string, example: string) {
  const file = `./families/${family}/${example}.vue`
  const view = VIEWS[file]
  if (!view) throw new Error(`An example is declared without its file: ${file}`)
  return view
}
