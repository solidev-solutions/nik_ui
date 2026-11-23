<script setup lang="ts">
import CopyButton from './CopyButton.vue'

defineProps<{
  /** The token's name as one types it in code, above the thing itself: a press copies it. */
  name: string
  /** One line of value, under the thing itself. */
  value: string
}>()
defineSlots<{ default: () => unknown }>()
</script>

<template>
  <!-- The focus ring lies inside the row's edge: outside it, the next row would cover it. -->
  <CopyButton
    :copy="name"
    class="group/row flex w-full flex-col gap-2.5 rounded-lg px-6 py-5 text-start -outline-offset-3"
  >
    <span class="text-base font-medium wrap-anywhere group-hover/row:text-primary sm:text-sm">
      {{ name }}
    </span>
    <slot />
    <span class="text-sm wrap-anywhere text-muted sm:text-xs">{{ value }}</span>
  </CopyButton>
</template>
