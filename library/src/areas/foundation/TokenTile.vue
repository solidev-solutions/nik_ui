<script setup lang="ts">
import { useToast } from '@nuxt/ui/composables'

import { announce } from '../../shell/announcer.ts'

const props = defineProps<{
  /** The token's name as it stands under the thing itself. */
  name: string
  /** One value, or one for each theme under the theme's name. */
  value: string | Record<string, string>
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
  <button
    type="button"
    class="group/tile flex w-full min-w-0 flex-col gap-2 rounded-lg text-start"
    :title="`Copy ${copy}`"
    @click="toClipboard"
  >
    <slot />
    <span class="flex flex-col gap-0.5">
      <span class="text-base font-medium wrap-anywhere group-hover/tile:text-primary sm:text-sm">
        {{ name }}
      </span>
      <span class="text-sm wrap-anywhere text-muted sm:text-xs">
        <template v-if="typeof value === 'string'">{{ value }}</template>
        <span v-else class="grid grid-cols-[auto_1fr] gap-x-2">
          <template v-for="(each, theme) in value" :key="theme">
            <span>{{ theme }}</span>
            <span>{{ each }}</span>
          </template>
        </span>
      </span>
    </span>
  </button>
</template>
