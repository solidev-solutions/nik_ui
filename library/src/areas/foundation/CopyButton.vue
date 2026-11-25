<script setup lang="ts">
import { useCopy } from '../../shell/clipboard.ts'

defineProps<{
  /** What a press copies: the name as one types it in code. */
  copy: string
}>()
defineSlots<{ default: () => unknown }>()

const toClipboard = useCopy()
</script>

<template>
  <button type="button" :title="`Copy ${copy}`" @click="toClipboard(copy)">
    <slot />
  </button>
</template>
