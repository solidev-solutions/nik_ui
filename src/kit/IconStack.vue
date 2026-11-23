<!-- SPDX-FileCopyrightText: 2025 Keenthemes Inc -->
<!-- SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska -->
<!-- SPDX-License-Identifier: MIT -->

<script setup lang="ts">
import UIcon from '@nuxt/ui/components/Icon.vue'
import { tv } from '@nuxt/ui/utils/tv'

import { iconStack } from '../theme/kit/icon-stack.js'

const props = defineProps<{ icon: string; class?: string }>()

const styles = tv(iconStack)()

const LAYERS = [
  { opacity: 0.4, strokeOpacity: 0.2, x: 0, y: 0 },
  { opacity: 0.6, strokeOpacity: 0.2, x: 13.65, y: 6.04 },
  { opacity: 0.8, strokeOpacity: 0.3, x: 27.32, y: 12.08 },
]

const PATHS = [
  'M42.2538 2.046C41.4408 1.6325 40.3965 1.6677 39.2612 2.2424L7.9616 18.1934C5.3895 19.5039 3.301 23.1064 3.301 26.2322V64.3226C3.301 66.0677 3.9458 67.2943 4.962 67.8199L1.8363 66.229C0.8201 65.7104 0.1753 64.4771 0.1753 62.732V24.6412C0.1753 21.5085 2.2638 17.913 4.8359 16.6024L36.1355 0.6515C37.2778 0.0698 38.322 0.0416 39.128 0.4551L42.2538 2.046Z',
  'M42.2545 2.0456C43.2707 2.5643 43.9155 3.7979 43.9155 5.543V43.6337C43.9155 46.7665 41.827 50.3616 39.2549 51.6722L7.9554 67.6235C6.813 68.2052 5.7687 68.2331 4.9628 67.8196C3.9465 67.301 3.3018 66.0673 3.3018 64.3222V26.2318C3.3018 23.0991 5.3903 19.5036 7.9624 18.193L39.2619 2.2421C40.4043 1.6604 41.4486 1.6321 42.2545 2.0456Z',
]
</script>

<template>
  <div aria-hidden="true" :class="styles.root({ class: props.class })">
    <svg viewBox="0 0 72 81" :class="styles.art()">
      <!-- Black in both themes: a light shadow would glow in the dark. -->
      <ellipse
        cx="36"
        cy="76"
        rx="30"
        ry="7"
        fill="black"
        fill-opacity="0.05"
        :class="styles.shadow()"
      />
      <g
        v-for="(layer, index) in LAYERS"
        :key="index"
        :opacity="layer.opacity"
        :transform="`translate(${layer.x} ${layer.y})`"
        :class="styles.layer()"
        stroke="currentColor"
        :stroke-opacity="layer.strokeOpacity"
        stroke-width="0.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path v-for="(d, part) in PATHS" :key="part" :d="d" />
      </g>
    </svg>
    <div :class="styles.glyph()">
      <UIcon :name="icon" :class="styles.icon()" />
    </div>
  </div>
</template>
