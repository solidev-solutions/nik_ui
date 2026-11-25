<script setup lang="ts">
defineProps<{ label: string }>()
defineSlots<{
  /** The cards, each in a list item. */
  default: () => unknown
}>()
</script>

<template>
  <section class="flex flex-col gap-4">
    <h2 class="text-base font-semibold">{{ label }}</h2>
    <!-- Without the role VoiceOver does not call a list without markers a list. As many columns
         as the page has room for, which the navigation beside it shares: a card is never narrower
         than 15rem, where its art would be cut, and the cards of a group share the row. -->
    <ul role="list" class="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-6">
      <slot />
    </ul>
  </section>
</template>
