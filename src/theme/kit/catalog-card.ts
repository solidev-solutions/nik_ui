// SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska
// SPDX-License-Identifier: MIT

export const catalogCard = {
  slots: {
    // As tall as the tallest card beside it. The pointer's hover sits here, on a part that does
    // not move: a card that rises would otherwise leave a pointer at its lower edge.
    root: 'group/card flex h-full',
    // Still for a reader who asked for less motion.
    frame:
      'flex-1 outline-primary/25 transition-transform duration-200 ease-reveal group-hover/card:shadow-lg motion-safe:group-hover/card:-translate-y-1 has-focus-visible:outline-3',
    // In a card taller than its content the art keeps its shape, and the room is left at the foot.
    panel: 'grid aspect-3/2 grow-0 place-items-center',
    title: 'text-base sm:text-sm',
    // The link is the whole card, its edge included, and the card shows the focus ring. A card
    // that has risen leaves a strip at its foot, which the link reaches down over.
    link: 'after:absolute after:-inset-px focus-visible:outline-none motion-safe:group-hover/card:after:-bottom-1.25',
  },
}
