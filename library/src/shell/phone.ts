import { useMediaQuery } from '@vueuse/core'
import { computed } from 'vue'

/** Whether the screen is a phone's: a phone ends where Tailwind's `sm:` begins. */
export const usePhone = () => useMediaQuery('(width < 40rem)')

/** The size of fields and main actions: 40 px on a phone, where a finger has to hit them. */
export function useControlSize() {
  const phone = usePhone()
  return computed(() => (phone.value ? 'xl' : 'md'))
}
