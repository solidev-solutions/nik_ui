<script setup lang="ts">
import Frame from '@nichtimkopf/ui/kit/Frame.vue'
import FrameHeader from '@nichtimkopf/ui/kit/FrameHeader.vue'
import FramePanel from '@nichtimkopf/ui/kit/FramePanel.vue'
import FrameTitle from '@nichtimkopf/ui/kit/FrameTitle.vue'
import { icon } from '@nichtimkopf/ui/theme'
import UButton from '@nuxt/ui/components/Button.vue'
import ULink from '@nuxt/ui/components/Link.vue'
import { useToast } from '@nuxt/ui/composables'
import { computed, defineAsyncComponent, ref, useId, watch } from 'vue'

import { announce } from '../../shell/announcer.ts'
import { useCopy } from '../../shell/clipboard.ts'
import { usePhone } from '../../shell/phone.ts'
import type { Example } from './types.ts'
import { sourceOf, viewOf } from './views.ts'

const props = defineProps<{ family: string; example: Example }>()

// A frame stays where a reader moves on to another family.
const view = computed(() => defineAsyncComponent(viewOf(props.family, props.example.id)))
const source = computed(() => sourceOf(props.family, props.example.id))
const title = useId()
const codePanel = useId()
const phone = usePhone()
const size = computed(() => (phone.value ? 'xl' : 'xs'))
const toast = useToast()
const copy = useCopy()

// The code loads when a reader asks for it. A later press, or a move of the frame to another
// file, overtakes a load on its way: that one shows nothing and says nothing.
const code = ref<string>()
let asked = 0
watch(source, () => {
  asked++
  code.value = undefined
})
async function toggle() {
  const mine = ++asked
  if (code.value !== undefined) {
    code.value = undefined
    return
  }
  try {
    const text = await source.value()
    if (mine === asked) code.value = text
  } catch {
    if (mine !== asked) return
    toast.add({ id: 'code', title: 'Could not load the code', color: 'error' })
    announce('Could not load the code')
  }
}

// ReUI keeps an example under its component: `c-button-group-39` under `button-group`.
const original = (name: string) =>
  `https://reui.io/components/${/^c-(.+)-\d+$/.exec(name)?.[1]}/${name}`
</script>

<template>
  <Frame>
    <FrameHeader class="flex-row flex-wrap items-baseline gap-x-2 gap-y-1">
      <FrameTitle>
        <h3 :id="title" class="text-base sm:text-sm">{{ example.title }}</h3>
      </FrameTitle>
      <ULink
        v-for="name in example.ports"
        :key="name"
        :to="original(name)"
        target="_blank"
        :aria-label="`ReUI: ${name}`"
        class="text-sm sm:text-xs"
      >
        {{ name }}
      </ULink>
      <UButton
        :label="code === undefined ? 'Code' : 'Hide code'"
        :aria-label="`${code === undefined ? 'Code' : 'Hide code'}: ${example.title}`"
        :aria-expanded="code !== undefined"
        :aria-controls="code === undefined ? undefined : codePanel"
        variant="ghost"
        :size="size"
        class="ms-auto"
        @click="toggle"
      />
    </FrameHeader>
    <!-- A group under the example's title: a screen reader says with a control which example it
         stands in. -->
    <FramePanel role="group" :aria-labelledby="title" class="grid min-h-36 place-items-center">
      <component :is="view" />
    </FramePanel>
    <!-- The file's name over its code, with the way to copy it. A long file scrolls in its block,
         which takes the focus so that a keyboard scrolls it too; its ring lies inside the panel's
         edge, which would cut it. -->
    <FramePanel v-if="code !== undefined" :id="codePanel" class="p-0">
      <div class="flex items-center justify-between gap-2 border-b border-default py-1 ps-4 pe-1.5">
        <span class="font-mono text-sm wrap-anywhere text-muted">{{ example.id }}.vue</span>
        <UButton
          label="Copy"
          :aria-label="`Copy code: ${example.title}`"
          :icon="icon.copy"
          variant="ghost"
          :size="size"
          @click="copy(code, `the code of ${example.title}`)"
        />
      </div>
      <pre
        tabindex="0"
        class="max-h-[80vh] overflow-y-auto px-4 py-3 font-mono text-sm/6 wrap-break-word whitespace-pre-wrap -outline-offset-3"
      ><code>{{ code }}</code></pre>
    </FramePanel>
  </Frame>
</template>
