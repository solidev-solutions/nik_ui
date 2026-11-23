import { useMediaQuery } from '@vueuse/core'
import { computed } from 'vue'

/**
 * The size of fields and main actions: 40 px on a phone, where a finger has to hit them. A phone
 * ends where Tailwind's `sm:` begins.
 */
export function useControlSize() {
  const phone = useMediaQuery('(width < 40rem)')
  return computed(() => (phone.value ? 'xl' : 'md'))
}
