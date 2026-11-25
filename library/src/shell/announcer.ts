import { ref } from 'vue'

/** The line of the app's one status element: a screen reader says it when it changes. */
export const announcement = ref('')

let filling: ReturnType<typeof setTimeout> | undefined

export function announce(line: string) {
  // Emptied first and filled a moment later, so that the same line a second time is a change too.
  announcement.value = ''
  clearTimeout(filling)
  filling = setTimeout(() => (announcement.value = line), 100)
}
