// SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska
// SPDX-License-Identifier: MIT

import type { NuxtUIOptions } from '@nuxt/ui/vite'

import { icon, icons } from './icons.js'

export const nikTheme = {
  theme: {
    colors: ['primary', 'success', 'info', 'warning', 'error'],
    transitions: false,
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
    icons,
  },
  icon: {
    clientBundle: {
      // The whole registry: Nuxt UI bundles by itself only icons of its default collection, and
      // no scan finds an icon that an app names by its meaning.
      icons: Object.values(icon),
    },
  },
} satisfies NuxtUIOptions

export { icon }
