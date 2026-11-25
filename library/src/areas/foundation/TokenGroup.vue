<script setup lang="ts">
defineProps<{
  title: string
  /** What holds for the whole group, in one sentence. */
  hint?: string
}>()
defineSlots<{ default: () => unknown }>()
</script>

<template>
  <section class="flex flex-col gap-4">
    <div class="flex flex-col gap-1">
      <h2 class="text-base font-semibold">{{ title }}</h2>
      <p v-if="hint" class="text-toned">{{ hint }}</p>
    </div>
    <!-- The tokens lay themselves out by the width of the page's column, not of the window: the
         navigation beside the page takes from one and not from the other. -->
    <div class="@container">
      <slot />
    </div>
  </section>
</template>
