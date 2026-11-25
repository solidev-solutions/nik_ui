<script setup lang="ts">
import Frame from '@nichtimkopf/ui/kit/Frame.vue'
import FramePanel from '@nichtimkopf/ui/kit/FramePanel.vue'
import { icon } from '@nichtimkopf/ui/theme'
import UButton from '@nuxt/ui/components/Button.vue'
import UCollapsible from '@nuxt/ui/components/Collapsible.vue'
import ULink from '@nuxt/ui/components/Link.vue'

import { useControlSize } from '../../shell/phone.ts'
import { FAMILIES } from './families.ts'
import type { Guidelines } from './types.ts'

defineProps<{ member: string; guidelines: Guidelines }>()

const size = useControlSize()

/** Where the library shows a part: on its family's page, at the part. */
function pageOf(part: string) {
  const family = FAMILIES.find(({ members }) => members.some((member) => member.name === part))
  return family && { name: 'family', params: { family: family.id }, hash: `#${part}` }
}
</script>

<template>
  <!-- The collapsible's own element takes no room: its button and its content are the frame's two
       parts. The button is the title row: from 640 px as tall as an example's, with the title
       where an example's stands. -->
  <Frame>
    <UCollapsible class="contents">
      <UButton
        label="AI Guidelines"
        :aria-label="`AI Guidelines: ${member}`"
        :trailing-icon="icon.chevronRight"
        variant="ghost"
        block
        :size="size"
        class="group justify-between px-4 font-semibold sm:py-2.5"
        :ui="{
          trailingIcon:
            'text-dimmed transition-transform duration-200 ease-reveal group-data-[state=open]:rotate-90 motion-reduce:transition-none',
        }"
      />
      <template #content>
        <!-- A group under the block's name: a screen reader says with a line whose guidelines it
             stands in. A case and what to take stand side by side where the block is wide enough
             for both, else one under the other, with a colon between them for a screen reader.
             Without the role VoiceOver does not call a list without markers a list. -->
        <FramePanel role="group" :aria-label="`AI Guidelines: ${member}`">
          <dl class="@container flex flex-col gap-4 text-base wrap-anywhere sm:text-sm">
            <div class="grid gap-x-4 gap-y-1 sm:grid-cols-[4rem_1fr]">
              <dt class="font-medium">Use for</dt>
              <dd>
                <ul role="list" class="flex flex-col gap-2">
                  <li v-for="job in guidelines.use" :key="job">{{ job }}</li>
                </ul>
              </dd>
            </div>
            <div class="grid gap-x-4 gap-y-1 sm:grid-cols-[4rem_1fr]">
              <dt class="font-medium">Not for</dt>
              <dd>
                <ul role="list" class="flex flex-col gap-2">
                  <li
                    v-for="{ when, take } in guidelines.instead"
                    :key="when"
                    class="grid gap-x-4 @3xl:grid-cols-[16rem_1fr]"
                  >
                    <span>{{ when }}<span class="sr-only">: </span></span>
                    <span>
                      <ULink v-if="pageOf(take)" :to="pageOf(take)">{{ take }}</ULink>
                      <template v-else>{{ take }}</template>
                    </span>
                  </li>
                </ul>
              </dd>
            </div>
            <div class="grid gap-x-4 gap-y-1 sm:grid-cols-[4rem_1fr]">
              <dt class="font-medium">Rules</dt>
              <dd>
                <ul role="list" class="flex flex-col gap-2">
                  <li
                    v-for="{ when, take } in guidelines.rules"
                    :key="when"
                    class="grid gap-x-4 @3xl:grid-cols-[16rem_1fr]"
                  >
                    <span>{{ when }}<span class="sr-only">: </span></span>
                    <span>
                      <template v-for="(text, at) in take.split('`')" :key="at">
                        <code
                          v-if="at % 2"
                          class="rounded-sm bg-elevated box-decoration-clone px-1 py-px font-mono text-sm sm:text-xs"
                          >{{ text }}</code
                        >
                        <template v-else>{{ text }}</template>
                      </template>
                    </span>
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
        </FramePanel>
      </template>
    </UCollapsible>
  </Frame>
</template>
