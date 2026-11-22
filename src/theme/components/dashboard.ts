// SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska
// SPDX-License-Identifier: MIT

export const dashboard = {
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
    base: 'z-1 -ms-px lg:flex w-px shrink-0 cursor-col-resize items-center justify-center bg-accented hover-intent hover:bg-primary peer-data-[dragging=true]:bg-primary',
  },
}
