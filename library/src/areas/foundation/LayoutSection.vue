<script setup lang="ts">
import TokenGroup from './TokenGroup.vue'
import TokenTile from './TokenTile.vue'

type Side = 'width' | 'height' | 'maxWidth' | 'paddingTop' | 'borderTopLeftRadius'

/**
 * The length, in px, that classes give the side of an element that wears them: 0 where they give
 * none, as for a custom property that is missing. Lengths are shares of the text size a reader has
 * set: the length is theirs at its usual 16 px. Out of the flow, the probe takes no width from the
 * page.
 */
function lengthOf(classes: string, side: Side) {
  const probe = document.body.appendChild(document.createElement('div'))
  probe.className = classes
  probe.style.position = 'absolute'
  const length = parseFloat(getComputedStyle(probe)[side]) || 0
  probe.remove()
  return Math.round((length * 16) / parseFloat(getComputedStyle(document.documentElement).fontSize))
}

// The frame's measures, each read from a class that gives it. Written out: Tailwind makes a class
// only of a name it finds whole.
const FRAME = {
  // The library's own: the frame's rail is as wide as what an app puts in it.
  rail: lengthOf('w-16', 'width'),
  // Between the page's card and the window's edge, and the card's corner.
  gap: lengthOf('p-2', 'paddingTop'),
  radius: lengthOf('rounded-xl', 'borderTopLeftRadius'),
  // Its width before a reader drags it: a prop the frame gives Nuxt UI's sidebar.
  navigation: 208,
  head: lengthOf('h-(--ui-header-height)', 'height'),
  gutter: lengthOf('p-4', 'paddingTop'),
  gutterFromSm: lengthOf('p-6', 'paddingTop'),
  menu: lengthOf('max-w-72', 'maxWidth'),
  // A breakpoint is a custom property, which Tailwind writes out only where a class uses it.
  sm: lengthOf('w-(--breakpoint-sm)', 'width'),
  lg: lengthOf('w-(--breakpoint-lg)', 'width'),
}

const TOKENS = [
  {
    name: 'p-4 sm:p-6',
    value: `${FRAME.gutter} px, ${FRAME.gutterFromSm} px from ${FRAME.sm} px · Gutter`,
  },
  { name: 'h-(--ui-header-height)', value: `${FRAME.head} px · Header` },
  { name: 'lg:', value: `${FRAME.lg} px · Sidebar docks` },
]

// A window the frame is drawn in, and the measures written beside it: where each begins from the
// window's top, and how long it is.
const PLANS = [
  {
    docked: true,
    width: 1920,
    height: 1080,
    label: 'The frame at 1920 px: rail, docked sidebar, header and the page’s content.',
    measures: [
      { name: 'h-(--ui-header-height)', from: FRAME.gap, length: FRAME.head, above: true },
      { name: 'sm:p-6', from: FRAME.gap + FRAME.head, length: FRAME.gutterFromSm },
    ],
  },
  {
    docked: false,
    width: 390,
    height: 720,
    label:
      'The frame at 390 px: the page fills the window, the sidebar lies over it as a slideover.',
    measures: [{ name: 'p-4', from: FRAME.head, length: FRAME.gutter }],
  },
]

/** A length of the frame as the drawing shows it: `--u` is one px of the window drawn. */
const drawn = (length: number) => `calc(${length} * var(--u))`

// What stands in the navigation and in the page; drawn by shares, not to scale.
const NAVIGATION = ['40%', '70%', '55%', '60%', '50%', '75%', '50%']
const ROWS = 30
</script>

<template>
  <TokenGroup
    title="Frame"
    hint="This library’s frame at two window widths, each drawn to its own scale. From lg the sidebar docks beside the page; below it, it opens as a slideover."
  >
    <div class="flex flex-col gap-8">
      <!-- Side by side from a column of 28rem, each as wide for its height as its window: the two
           windows stand equally tall. Below it each takes the column's width. A plan keeps room
           at its end for the measures' names. -->
      <div class="flex flex-col gap-6 @md:flex-row">
        <figure
          v-for="plan in PLANS"
          :key="plan.width"
          class="@container flex min-w-0 flex-col gap-3 @md:basis-0"
          :class="plan.docked ? 'pe-18 pt-7' : 'pe-14 @md:pt-7'"
          :style="{ flexGrow: plan.width / plan.height }"
        >
          <div
            role="img"
            :aria-label="plan.label"
            class="relative rounded-md ring ring-accented"
            :class="plan.docked ? 'bg-muted' : 'bg-default'"
            :style="{ '--u': `calc(100cqw / ${plan.width})`, height: drawn(plan.height) }"
          >
            <template v-if="plan.docked">
              <div
                class="absolute inset-y-0 start-0 flex flex-col items-center gap-1 pt-2"
                :style="{ width: drawn(FRAME.rail) }"
              >
                <span class="mb-1 flex w-1/3 gap-px">
                  <span class="aspect-square flex-1 rounded-full bg-primary" />
                  <span class="aspect-square flex-1 rounded-full bg-primary" />
                </span>
                <span class="aspect-square w-1/2 rounded-[20%] bg-accented" />
                <span class="aspect-square w-1/2 rounded-[20%] bg-elevated" />
              </div>
              <div
                class="absolute flex bg-default ring ring-default ring-inset"
                :style="{
                  insetBlock: drawn(FRAME.gap),
                  insetInline: `${drawn(FRAME.rail)} ${drawn(FRAME.gap)}`,
                  borderRadius: drawn(FRAME.radius),
                }"
              >
                <div
                  class="flex shrink-0 flex-col gap-1 border-e border-default p-1.5"
                  :style="{ width: drawn(FRAME.navigation) }"
                >
                  <span
                    v-for="(width, at) in NAVIGATION"
                    :key="at"
                    class="h-0.5 rounded-full bg-accented"
                    :style="{ width }"
                  />
                </div>
                <div class="flex min-w-0 flex-1 flex-col">
                  <div
                    class="flex shrink-0 items-center gap-1 border-b border-default px-1.5"
                    :style="{ height: drawn(FRAME.head) }"
                  >
                    <span class="aspect-square h-1/3 rounded-[20%] bg-accented" />
                    <span class="h-0.5 w-[8%] rounded-full bg-accented" />
                    <span class="h-0.5 w-[5%] rounded-full bg-(--ui-text-dimmed)" />
                  </div>
                  <div
                    class="flex min-h-0 flex-1"
                    :style="{
                      padding: `${drawn(FRAME.gutterFromSm)} ${drawn(FRAME.gutterFromSm)} 0`,
                    }"
                  >
                    <div class="flex min-w-0 flex-1 flex-col gap-1.5 overflow-hidden">
                      <span class="h-1 w-1/5 shrink-0 rounded-full bg-(--ui-text-dimmed)" />
                      <span
                        v-for="row in ROWS"
                        :key="row"
                        class="h-2.5 shrink-0 rounded-xs ring ring-default ring-inset"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <template v-else>
              <div class="absolute inset-0 flex flex-col overflow-hidden rounded-md">
                <div
                  class="flex shrink-0 items-center gap-1.5 border-b border-default px-2"
                  :style="{ height: drawn(FRAME.head) }"
                >
                  <span class="aspect-square h-1/3 rounded-[20%] bg-accented" />
                  <span class="h-0.5 w-1/4 rounded-full bg-(--ui-text-dimmed)" />
                </div>
                <div
                  class="flex min-h-0 flex-1"
                  :style="{ padding: `${drawn(FRAME.gutter)} ${drawn(FRAME.gutter)} 0` }"
                >
                  <div class="flex min-w-0 flex-1 flex-col gap-1.5 overflow-hidden">
                    <span class="h-1 w-2/5 shrink-0 rounded-full bg-(--ui-text-dimmed)" />
                    <span
                      v-for="row in ROWS"
                      :key="row"
                      class="h-2.5 shrink-0 rounded-xs ring ring-default ring-inset"
                    />
                  </div>
                </div>
              </div>
              <div class="absolute inset-0 rounded-md bg-overlay" />
              <div
                class="absolute inset-y-0 start-0 flex flex-col rounded-s-md bg-raised"
                :style="{ width: drawn(FRAME.menu) }"
              >
                <div
                  class="flex shrink-0 items-center justify-end border-b border-default px-2"
                  :style="{ height: drawn(FRAME.head) }"
                >
                  <span class="aspect-square h-1/3 rounded-[20%] bg-accented" />
                </div>
                <div class="flex min-h-0 flex-1">
                  <div
                    class="flex shrink-0 flex-col items-center gap-1 rounded-es-md border-e border-default bg-muted pt-2"
                    :style="{ width: drawn(FRAME.rail) }"
                  >
                    <span class="mb-1 flex w-1/3 gap-px">
                      <span class="aspect-square flex-1 rounded-full bg-primary" />
                      <span class="aspect-square flex-1 rounded-full bg-primary" />
                    </span>
                    <span class="aspect-square w-1/2 rounded-[20%] bg-accented" />
                    <span class="aspect-square w-1/2 rounded-[20%] bg-elevated" />
                  </div>
                  <div class="flex min-w-0 flex-1 flex-col gap-1.5 p-2">
                    <span
                      v-for="(width, at) in NAVIGATION"
                      :key="at"
                      class="h-0.5 rounded-full bg-accented"
                      :style="{ width }"
                    />
                  </div>
                </div>
              </div>
            </template>

            <!-- A measure beside the window, with its name beside it or, where that is long,
                 above the window. -->
            <span
              v-for="{ name, from, length, above } in plan.measures"
              :key="name"
              aria-hidden="true"
              class="absolute start-[calc(100%+0.625rem)] flex w-2.5 justify-center border-y border-primary"
              :style="{ top: drawn(from), height: drawn(length) }"
            >
              <span class="w-px bg-primary" />
              <template v-if="above">
                <span
                  class="absolute bottom-full w-px bg-primary"
                  :style="{ height: `calc(${drawn(from)} + 0.5rem)` }"
                />
                <span
                  class="absolute end-0 font-mono text-xs font-medium whitespace-nowrap text-primary"
                  :style="{ bottom: `calc(100% + ${drawn(from)} + 0.5rem)` }"
                >
                  {{ name }}
                </span>
              </template>
              <span
                v-else
                class="absolute start-[calc(100%+0.375rem)] top-1/2 -translate-y-1/2 font-mono text-xs font-medium whitespace-nowrap text-primary"
              >
                {{ name }}
              </span>
            </span>
          </div>
          <figcaption class="font-mono text-xs text-muted">
            {{ plan.docked ? 'From' : 'Below' }}
            <span class="font-medium text-primary">lg</span>
            · drawn at {{ plan.width }}&nbsp;px
          </figcaption>
        </figure>
      </div>

      <!-- Without the role VoiceOver does not call a list without markers a list. -->
      <ul role="list" class="divide-y divide-default border-b border-default">
        <li v-for="{ name, value } in TOKENS" :key="name">
          <TokenTile :name="name" :value="value" :copy="name" class="py-3" />
        </li>
      </ul>
    </div>
  </TokenGroup>
</template>
