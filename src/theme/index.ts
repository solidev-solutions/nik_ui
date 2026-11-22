// SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska
// SPDX-License-Identifier: MIT

import type { NuxtUIOptions } from '@nuxt/ui/vite'

export const nikTheme = {
  theme: {
    colors: ['primary', 'success', 'info', 'warning', 'error'],
  },
  ui: {
    // As literals: the plugin's options take `neutral` only by the name of a gray palette.
    colors: {
      primary: 'walnut',
      success: 'green',
      info: 'blue',
      warning: 'orange',
      error: 'red',
      neutral: 'stone',
    } as const,
  },
} satisfies NuxtUIOptions
