// SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska
// SPDX-License-Identifier: MIT

export const catalogCard = {
  slots: {
    // As tall as the tallest card beside it. The pointer's hover sits here, on a part that does
    // not move: a card that rises would otherwise leave a pointer at its lower edge.
    root: 'group/card flex h-full',
    // Under the pointer the card rises, its shadow comes with it and its edge darkens. Still for a
    // reader who asked for less motion: there the edge alone tells, also in the dark theme, where
    // a shadow does not show.
    frame:
      'flex-1 outline-primary/25 transition-[translate,box-shadow,border-color] duration-200 ease-reveal group-hover/card:border-accented group-hover/card:shadow-lg has-focus-visible:outline-3 motion-safe:group-hover/card:-translate-y-1 motion-reduce:transition-none',
    // In a card taller than its content the art keeps its shape, and the room is left at the foot.
    panel: 'grid aspect-3/2 grow-0 place-items-center',
    // On a phone, where a section's heading has the same size, the title is the lighter of the two.
    title: 'text-base font-medium sm:text-sm sm:font-semibold',
    // The link is the whole card, its edge included, and the card shows the focus ring. A card
    // that has risen leaves a strip at its foot, which the link reaches down over.
    link: 'after:absolute after:-inset-px focus-visible:outline-none motion-safe:group-hover/card:after:-bottom-1.25',
  },
}
