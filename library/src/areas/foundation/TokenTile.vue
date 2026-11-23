<script setup lang="ts">
import CopyButton from './CopyButton.vue'

defineProps<{
  /** The token's name as it stands under the thing itself. */
  name: string
  /** One value, or one for each theme under the theme's name. */
  value: string | Record<string, string>
  /** What a press copies: the name as one types it in code. */
  copy: string
}>()
defineSlots<{ default: () => unknown }>()
</script>

<template>
  <CopyButton
    :copy="copy"
    class="group/tile flex w-full min-w-0 flex-col gap-2 rounded-lg text-start"
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
  </CopyButton>
</template>
