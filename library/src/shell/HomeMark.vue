<script setup lang="ts">
import BrandMark from '@nichtimkopf/ui/kit/BrandMark.vue'
import ULink from '@nuxt/ui/components/Link.vue'

import { LIBRARY } from '../areas.ts'
</script>

<template>
  <ULink
    :to="{ name: 'home' }"
    exact
    raw
    class="grid size-8 place-items-center rounded-md hover:bg-hover"
    :aria-label="`${LIBRARY}, home`"
  >
    <BrandMark class="w-5" />
  </ULink>
</template>
