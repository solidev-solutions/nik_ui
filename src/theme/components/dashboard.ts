// SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska
// SPDX-License-Identifier: MIT

import type { NuxtUIOptions } from '@nuxt/ui/vite'

export const { ui: dashboard } = {
  ui: {
    dashboardSidebar: {
      slots: {
        body: 'p-2',
        footer: 'px-2',
        // The menu that stands for the sidebar on a small screen: Nuxt UI widens it from 640 px.
        content: 'max-w-72 sm:max-w-72',
      },
    },
    // A line on the sidebar's edge, with what stands in it at its middle.
    dashboardResizeHandle: {
      base: 'z-1 -ms-px lg:flex w-px shrink-0 cursor-col-resize items-center justify-center bg-accented hover-intent hover:bg-primary',
    },
    dashboardPanel: {
      slots: {
        // Nuxt UI makes a panel at least as tall as the screen. From 1024 px the frame's card is
        // shorter than that, and would cut off the foot of the panel's body.
        root: 'min-h-0',
        // What the focus scrolls into view keeps the body's padding from its edge, and with it
        // its focus ring. A page that scrolls stands where one that does not stands.
        body: 'scroll-py-4 scrollbar-gutter-both sm:scroll-py-6',
      },
    },
    // The title would take the size around it, 14 px: a page's title is 16 px.
    dashboardNavbar: { slots: { root: 'sm:px-4', title: 'text-base' } },
  },
} satisfies NuxtUIOptions
