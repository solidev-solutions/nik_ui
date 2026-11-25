// SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska
// SPDX-License-Identifier: MIT

import type { NuxtUIOptions } from '@nuxt/ui/vite'

export const { ui: collapsible } = {
  ui: {
    collapsible: {
      slots: {
        // Nuxt UI opens and closes the content by its height, in an animation that
        // `theme.transitions` does not reach. At once for a reader who asked for less motion.
        content:
          'motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none',
      },
    },
  },
} satisfies NuxtUIOptions
