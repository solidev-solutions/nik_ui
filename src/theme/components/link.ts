// SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska
// SPDX-License-Identifier: MIT

import type { NuxtUIOptions } from '@nuxt/ui/vite'

export const { ui: link } = {
  ui: {
    link: {
      base: 'underline decoration-dimmed underline-offset-2 hover:decoration-current',
      variants: {
        // Nuxt UI colors a link by whether it leads to the page it stands on, in this variant,
        // which outranks `base`: either way it takes the color of the text.
        active: { true: 'text-default', false: 'text-default' },
        disabled: { true: 'opacity-50' },
      },
    },
  },
} satisfies NuxtUIOptions
