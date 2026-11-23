// SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska
// SPDX-License-Identifier: MIT

import type { ThemeProps } from '@nuxt/ui/components/Theme.vue'

/**
 * The defaults of props, which no class can set: an app hands them to Nuxt UI's `UTheme`. As
 * literals: the published type would otherwise call a toaster's position a string, which `UTheme`
 * does not take.
 */
export const { props: nikProps } = {
  props: {
    slideover: { inset: true },
    toaster: { position: 'bottom-center', progress: false },
    tooltip: { delayDuration: 300, ignoreNonKeyboardFocus: true },
  },
} as const satisfies ThemeProps
