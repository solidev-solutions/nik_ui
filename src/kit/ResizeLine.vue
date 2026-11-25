<!-- SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska -->
<!-- SPDX-License-Identifier: MIT -->

<script setup lang="ts">
import UDashboardResizeHandle from '@nuxt/ui/components/DashboardResizeHandle.vue'
import { tv } from '@nuxt/ui/utils/tv'

import { resizeLine } from '../theme/kit/resize-line.js'

const props = defineProps<{
  label: string
  class?: string
}>()
const emit = defineEmits<{ toggle: [] }>()

const styles = tv(resizeLine)()

// A click is a press of the main button that ends on the line without having strayed more than
// 4 px on its way: a drag ends with a release too, and Nuxt UI's touch listener holds back a
// finger's click. The window hears the rest of a press, which may end anywhere.
function pressed(event: PointerEvent) {
  if (event.button !== 0) return
  const line = event.currentTarget as HTMLElement
  const from = event.clientX
  let strayed = false
  const press = new AbortController()
  const during = { signal: press.signal }
  window.addEventListener(
    'pointermove',
    (move) => {
      strayed ||= Math.abs(move.clientX - from) > 4
    },
    during,
  )
  window.addEventListener('pointercancel', () => press.abort(), during)
  window.addEventListener(
    'pointerup',
    (up) => {
      press.abort()
      if (!strayed && up.target instanceof Node && line.contains(up.target)) emit('toggle')
    },
    during,
  )
}
</script>

<template>
  <UDashboardResizeHandle
    aria-orientation="vertical"
    :title="label"
    :class="styles.root({ class: props.class })"
    @pointerdown="pressed"
  >
    <div :class="styles.grip()" />
  </UDashboardResizeHandle>
</template>
