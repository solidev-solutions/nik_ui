<script setup lang="ts">
import { useToast } from '@nuxt/ui/composables'

import { announce } from '../../shell/announcer.ts'

const props = defineProps<{
  /** What a press copies: the name as one types it in code. */
  copy: string
}>()
defineSlots<{ default: () => unknown }>()

const toast = useToast()

async function toClipboard() {
  let title = 'Copied'
  let color: 'error' | undefined
  try {
    await navigator.clipboard.writeText(props.copy)
  } catch {
    title = 'Could not copy'
    color = 'error'
  }
  // The same name a second time makes its toast pulse instead of a second one.
  toast.add({ id: `${title} ${props.copy}`, title, description: props.copy, color })
  // Reka UI 2.11 hides its own announcement of a toast from a screen reader.
  announce(`${title}: ${props.copy}`)
}
</script>

<template>
  <button type="button" :title="`Copy ${copy}`" @click="toClipboard">
    <slot />
  </button>
</template>
