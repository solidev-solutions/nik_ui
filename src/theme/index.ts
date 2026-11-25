// SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska
// SPDX-License-Identifier: MIT

import type { NuxtUIOptions } from '@nuxt/ui/vite'

import { button } from './components/button.js'
import { collapsible } from './components/collapsible.js'
import { dashboard } from './components/dashboard.js'
import { kbd } from './components/kbd.js'
import { link } from './components/link.js'
import { navigationMenu } from './components/navigation-menu.js'
import { overlays } from './components/overlays.js'
import { sidebar } from './components/sidebar.js'
import { icon, icons } from './icons.js'

export const nikTheme = {
  // With `experimental.componentDetection` Nuxt UI keeps the looks only of the components it finds
  // in use, and it looks for the ones the kit uses only in a package named here.
  scanPackages: ['@nichtimkopf/ui'],
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
    // An override is the `ui` of plugin options in a file of its own, where `satisfies` checks it.
    // Checked against the options' `ui` alone, it would turn `any` wherever Nuxt UI's generated
    // types do not resolve, as in this package's build.
    ...sidebar,
    ...dashboard,
    ...navigationMenu,
    ...overlays,
    ...button,
    ...link,
    ...kbd,
    ...collapsible,
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
export { nikProps } from './props.js'
