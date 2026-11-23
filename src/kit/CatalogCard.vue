<!-- SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska -->
<!-- SPDX-License-Identifier: MIT -->

<script setup lang="ts">
import type { LinkProps } from '@nuxt/ui/components/Link.vue'
import ULink from '@nuxt/ui/components/Link.vue'
import { tv } from '@nuxt/ui/utils/tv'

import { catalogCard } from '../theme/kit/catalog-card.js'
import Frame from './Frame.vue'
import FrameDescription from './FrameDescription.vue'
import FrameFooter from './FrameFooter.vue'
import FramePanel from './FramePanel.vue'
import FrameTitle from './FrameTitle.vue'
import IconStack from './IconStack.vue'

const props = defineProps<{
  to: NonNullable<LinkProps['to']>
  /** The link's text, as a third-level heading: the card stands under its section's heading. */
  label: string
  /** What the card leads to, under the label. */
  description?: string
  icon: string
  class?: string
}>()

const styles = tv(catalogCard)()
</script>

<template>
  <div :class="styles.root({ class: props.class })">
    <Frame :class="styles.frame()">
      <FramePanel :class="styles.panel()">
        <IconStack :icon="icon" />
      </FramePanel>
      <FrameFooter>
        <FrameTitle>
          <h3 :class="styles.title()">
            <ULink :to="to" raw :class="styles.link()">{{ label }}</ULink>
          </h3>
        </FrameTitle>
        <FrameDescription v-if="description">{{ description }}</FrameDescription>
      </FrameFooter>
    </Frame>
  </div>
</template>
