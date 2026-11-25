import { useToast } from '@nuxt/ui/composables'

import { announce } from './announcer.ts'

/**
 * What copies a text and says whether that worked, in a toast and in the app's status line. Both
 * name the text by `what`: the text itself where it is a name one types.
 */
export function useCopy() {
  const toast = useToast()
  return async function copy(text: string, what = text) {
    let title = 'Copied'
    let color: 'error' | undefined
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      title = 'Could not copy'
      color = 'error'
    }
    // The same text a second time makes its toast pulse instead of a second one.
    toast.add({ id: `${title} ${what}`, title, description: what, color })
    // Reka UI 2.11 hides its own announcement of a toast from a screen reader.
    announce(`${title}: ${what}`)
  }
}
