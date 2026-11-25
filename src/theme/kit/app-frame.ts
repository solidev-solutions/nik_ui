// SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska
// SPDX-License-Identifier: MIT

export const appFrame = {
  slots: {
    root: 'bg-muted',
    rail: 'hidden lg:flex',
    stage: 'flex min-w-0 flex-1 lg:py-2 lg:pe-2',
    page: 'flex min-w-0 flex-1 overflow-hidden bg-default lg:rounded-xl lg:border lg:border-default',
    // Against Nuxt UI's least height and width: the navigation is as tall as the page's card, and
    // folded it leaves no bar of icons but 1 px, where its edge and its line would double the
    // page's border. A peer by name: the line after it takes its color from its state, and no
    // other line in the page does. It folds over 200 ms and is out of reach, for the focus too,
    // once that is over.
    navigation:
      'peer/navigation min-h-0 min-w-0 overflow-hidden transition-[width,visibility] duration-200 ease-linear data-[dragging=true]:transition-none motion-reduce:transition-none data-[collapsed=true]:invisible data-[collapsed=true]:border-e-0',
    // The content keeps the width of the open navigation, less its edge, while the navigation
    // closes around it, and gives it up once those 200 ms are over: it never reflows on the way.
    navigationContent:
      'min-w-[calc(var(--width)-1px)] in-data-[collapsed=true]:transition-[min-width] in-data-[collapsed=true]:delay-200 in-data-[collapsed=true]:duration-0',
    // The line has the primary color while its navigation is dragged. Folded, it lies on the
    // page's edge: it gives up its color there and moves in by 4 px, so that the page does not cut
    // its grip.
    line: 'peer-data-[dragging=true]/navigation:bg-primary peer-data-[collapsed=true]/navigation:translate-x-1 peer-data-[collapsed=true]/navigation:bg-transparent',
    menuHead: 'flex h-(--ui-header-height) shrink-0 items-center justify-end px-4',
    menu: 'flex min-h-0 flex-1',
    // A card beside the page's card: the stage's gutter around it, none toward the page, and the
    // page's radius, surface and edge.
    panel: 'border-s-0 p-2 ps-0',
    panelCard: 'rounded-xl bg-default shadow-none ring-inset',
  },
  variants: {
    navigation: { false: { navigation: 'lg:hidden' } },
  },
}
