<script setup lang="ts">
import Frame from '@nichtimkopf/ui/kit/Frame.vue'
import FrameHeader from '@nichtimkopf/ui/kit/FrameHeader.vue'
import FramePanel from '@nichtimkopf/ui/kit/FramePanel.vue'
import FrameTitle from '@nichtimkopf/ui/kit/FrameTitle.vue'
import ULink from '@nuxt/ui/components/Link.vue'
import { computed, defineAsyncComponent, useId } from 'vue'

import type { Example } from './types.ts'
import { viewOf } from './views.ts'

const props = defineProps<{ family: string; example: Example }>()

// A frame stays where a reader moves on to another family.
const view = computed(() => defineAsyncComponent(viewOf(props.family, props.example.id)))
const title = useId()

// ReUI keeps an example under its component: `c-button-group-39` under `button-group`.
const original = (name: string) =>
  `https://reui.io/components/${/^c-(.+)-\d+$/.exec(name)?.[1]}/${name}`
</script>

<template>
  <Frame>
    <FrameHeader class="flex-row flex-wrap items-baseline gap-x-2 gap-y-1">
      <FrameTitle>
        <h3 :id="title" class="text-base sm:text-sm">{{ example.title }}</h3>
      </FrameTitle>
      <ULink
        v-for="name in example.ports"
        :key="name"
        :to="original(name)"
        target="_blank"
        :aria-label="`ReUI: ${name}`"
        class="text-sm sm:text-xs"
      >
        {{ name }}
      </ULink>
    </FrameHeader>
    <!-- A group under the example's title: a screen reader says with a control which example it
         stands in. -->
    <FramePanel role="group" :aria-labelledby="title" class="grid min-h-36 place-items-center">
      <component :is="view" />
    </FramePanel>
  </Frame>
</template>
