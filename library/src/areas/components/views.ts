import type { Component } from 'vue'

const VIEWS = import.meta.glob<Component>('./families/*/*.vue', { import: 'default' })
const SOURCES = import.meta.glob<string>('./families/*/*.vue', { query: '?raw', import: 'default' })

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
