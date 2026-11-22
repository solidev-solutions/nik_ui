<!-- SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska -->
<!-- SPDX-License-Identifier: MIT -->

<script setup lang="ts">
import UDashboardGroup from '@nuxt/ui/components/DashboardGroup.vue'
import UDashboardSidebar from '@nuxt/ui/components/DashboardSidebar.vue'
import UDashboardSidebarToggle from '@nuxt/ui/components/DashboardSidebarToggle.vue'
import USidebar from '@nuxt/ui/components/Sidebar.vue'
import { tv } from '@nuxt/ui/utils/tv'

import { appFrame } from '../theme/kit/app-frame.js'
import ResizeLine from './ResizeLine.vue'

const props = defineProps<{
  /** Names the rail. */
  label: string
  /** What the line between navigation and page does, shown once the pointer rests on it. */
  lineLabel: string
  /** The browser keeps the navigation's width, and whether it is folded, under a key that begins with this. */
  storageKey: string
  /** Names the panel beside the page: its title, and the landmark's name. */
  panelLabel?: string
  class?: string
}>()
defineSlots<{
  rail: () => unknown
  navigation?: () => unknown
  /** Stays in view below the navigation, whatever its length. */
  'navigation-footer'?: () => unknown
  menu: () => unknown
  panel?: () => unknown
  default: () => unknown
}>()

const collapsed = defineModel<boolean>('collapsed', { default: false })
const panel = defineModel<boolean>('panel', { default: false })
/** Whether the menu is open, which stands for rail and navigation below 1024 px. */
const menu = defineModel<boolean>('menu', { default: false })

const styles = tv(appFrame)()
</script>

<template>
  <UDashboardGroup
    storage="local"
    :storage-key="storageKey"
    unit="px"
    :class="styles.root({ class: props.class })"
  >
    <aside :class="styles.rail()" :aria-label="label">
      <slot name="rail" />
    </aside>

    <div :class="styles.stage()">
      <div :class="styles.page()">
        <!-- Folded it keeps 1 px: Nuxt UI starts a drag only on a sidebar that has a width. -->
        <UDashboardSidebar
          id="navigation"
          v-model:collapsed="collapsed"
          v-model:open="menu"
          :resizable="Boolean($slots.navigation)"
          collapsible
          :collapsed-size="1"
          :default-size="208"
          :min-size="208"
          :max-size="360"
          :class="styles.navigation({ navigation: Boolean($slots.navigation) })"
          :ui="{ body: styles.navigationContent(), footer: styles.navigationContent() }"
        >
          <slot name="navigation" />

          <template v-if="$slots['navigation-footer']" #footer>
            <slot name="navigation-footer" />
          </template>

          <template #content>
            <div :class="styles.menuHead()">
              <UDashboardSidebarToggle />
            </div>
            <div :class="styles.menu()">
              <slot name="menu" />
            </div>
          </template>

          <template v-if="$slots.navigation" #resize-handle="{ onMouseDown, onTouchStart }">
            <ResizeLine
              :label="lineLabel"
              :class="styles.line()"
              @mousedown="onMouseDown"
              @touchstart="onTouchStart"
              @toggle="collapsed = !collapsed"
            />
          </template>
        </UDashboardSidebar>

        <slot />
      </div>
    </div>

    <!-- Beside the page from 1280 px, where page and panel both keep a working width; below it
         the panel lies over the page. Closed, Nuxt UI only moves it out of view, so `inert` keeps
         the focus and a screen reader out of it. -->
    <USidebar
      v-if="$slots.panel"
      v-model:open="panel"
      :inert="!panel"
      side="right"
      variant="floating"
      breakpoint="xl"
      :title="panelLabel"
      close
      :aria-label="panelLabel"
      :ui="{ container: styles.panel(), inner: styles.panelCard() }"
    >
      <slot name="panel" />
    </USidebar>
  </UDashboardGroup>
</template>
