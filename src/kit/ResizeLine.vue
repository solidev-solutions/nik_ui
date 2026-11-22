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

// Only a release within 4 px of a press of the main button is a click: a drag ends with a release
// too, and Nuxt UI's touch listener holds back a finger's click.
let pressedAt: number | undefined
const pressed = (event: PointerEvent) => {
  pressedAt = event.button === 0 ? event.clientX : undefined
}
const released = (event: PointerEvent) => {
  if (pressedAt !== undefined && Math.abs(event.clientX - pressedAt) <= 4) emit('toggle')
  pressedAt = undefined
}
</script>

<template>
  <UDashboardResizeHandle
    aria-orientation="vertical"
    :title="label"
    :class="styles.root({ class: props.class })"
    @pointerdown="pressed"
    @pointerup="released"
  >
    <div :class="styles.grip()" />
  </UDashboardResizeHandle>
</template>
