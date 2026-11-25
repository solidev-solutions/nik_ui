<script setup lang="ts">
import TokenGroup from './TokenGroup.vue'
import TokenRow from './TokenRow.vue'
import TokenTile from './TokenTile.vue'

// A family and a style by the classes one types for them. Written out: Tailwind makes a class
// only of a name it finds whole, and the page takes a style's values from its classes.
const FAMILIES = ['font-sans', 'font-mono']

const GROUPS = [
  {
    title: 'Title',
    hint: 'Names a page, a chapter or a section. Figures that stand as a title take tabular numbers.',
    styles: [
      { classes: 'text-xl font-semibold', specimen: 'Open requests', use: 'Chapter, key figure' },
      {
        classes: 'text-base font-semibold',
        specimen: 'Tasks this week',
        use: 'Page, section and dialog title',
      },
    ],
  },
  {
    title: 'Label',
    hint: 'One line that names a row, a control or a state. On a phone each steps up one size.',
    styles: [
      { classes: 'text-sm font-medium', specimen: 'Review the draft', use: 'Row title, control' },
      { classes: 'text-xs font-medium', specimen: 'Overdue', use: 'Badge' },
    ],
  },
  {
    title: 'Paragraph',
    hint: 'Text that runs over lines, and the facts beside a title. On a phone each steps up one size.',
    styles: [
      {
        classes: 'text-sm',
        specimen:
          'Please check the figures before you send the report. The client reads it on Monday.',
        use: 'Body',
      },
      { classes: 'text-xs', specimen: 'Due Fri, Nov 6 · P-2417', use: 'Meta' },
    ],
  },
]

// What the weights the styles take are called; another weight shows as its number.
const WEIGHTS: Record<string, string> = { 400: 'Regular', 500: 'Medium', 600: 'Semibold' }

/** What classes come to on an element that wears them: the family they name, size and weight. */
function typeOf(classes: string) {
  const probe = document.body.appendChild(document.createElement('span'))
  probe.className = classes
  const { fontFamily, fontSize, lineHeight, fontWeight } = getComputedStyle(probe)
  probe.remove()
  // Sizes are shares of the text size a reader has set: the measure is theirs at its usual 16 px.
  const share = 16 / parseFloat(getComputedStyle(document.documentElement).fontSize)
  const px = (length: string) => Math.round(parseFloat(length) * share * 100) / 100
  return {
    // The first of the families the class names, without its quotes.
    family: fontFamily.split(',')[0]!.replace(/["']/g, ''),
    measure: `${px(fontSize)}/${px(lineHeight)}`,
    weight: WEIGHTS[fontWeight] ?? fontWeight,
  }
}

const tokens = {
  families: FAMILIES.map((name) => ({ name, family: typeOf(name).family })),
  groups: GROUPS.map((group) => ({
    ...group,
    styles: group.styles.map((style) => {
      const { measure, weight } = typeOf(style.classes)
      return { ...style, value: `${measure} · ${weight} · ${style.use}` }
    }),
  })),
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <TokenGroup title="Families">
      <!-- Without the role VoiceOver does not call a list without markers a list. -->
      <ul role="list" class="grid grid-cols-2 gap-x-3">
        <li v-for="{ name, family } in tokens.families" :key="name">
          <TokenTile :name="name" :value="family" :copy="name">
            <span
              class="grid h-15 place-items-center rounded-lg bg-muted text-2xl font-medium ring ring-default ring-inset"
              :class="name"
            >
              Aa 0
            </span>
          </TokenTile>
        </li>
      </ul>
    </TokenGroup>

    <TokenGroup
      v-for="{ title, hint, styles } in tokens.groups"
      :key="title"
      :title="title"
      :hint="hint"
    >
      <!-- One field for a group's rows, with a line between two; it cuts the corners of a row's
           focus ring to its own. Without the role VoiceOver does not call a list without markers
           a list. -->
      <ul
        role="list"
        class="divide-y divide-default overflow-hidden rounded-xl border border-default bg-muted"
      >
        <li v-for="{ classes, specimen, value } in styles" :key="classes">
          <TokenRow :name="classes" :value="value">
            <span class="wrap-anywhere" :class="classes">{{ specimen }}</span>
          </TokenRow>
        </li>
      </ul>
    </TokenGroup>
  </div>
</template>
