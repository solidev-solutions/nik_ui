<script setup lang="ts">
import ULink from '@nuxt/ui/components/Link.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import LibraryPage from '../../shell/LibraryPage.vue'
import PageNeighbors from '../../shell/PageNeighbors.vue'
import ExampleFrame from './ExampleFrame.vue'
import { familyOf } from './families.ts'
import MemberGuidelines from './MemberGuidelines.vue'
import { guidelinesOf } from './views.ts'

const props = defineProps<{ family: string }>()
// The router lets in only a family that exists, and only below its area.
const family = computed(() => familyOf(props.family)!)
const area = useRoute().meta.area!
const parents = [{ label: area.label, to: { name: area.id } }]

const DOCS = 'https://ui.nuxt.com/docs/components/'
</script>

<template>
  <LibraryPage :title="family.label" :parents="parents">
    <section v-for="member in family.members" :key="member.name" class="flex flex-col gap-4">
      <div class="flex flex-wrap items-baseline justify-between gap-x-4">
        <!-- Where a link to the member arrives, with the focus. -->
        <h2 :id="member.name" tabindex="-1" class="text-base font-semibold">{{ member.name }}</h2>
        <ULink
          :to="DOCS + member.docs"
          target="_blank"
          :aria-label="`Nuxt UI docs: ${member.name}`"
          class="text-base sm:text-sm"
        >
          Nuxt UI docs
        </ULink>
      </div>
      <div class="flex flex-col gap-6">
        <MemberGuidelines
          :member="member.name"
          :guidelines="guidelinesOf(family.id, member.name)"
        />
        <ExampleFrame
          v-for="example in member.examples"
          :key="example.id"
          :family="family.id"
          :example="example"
        />
      </div>
    </section>
    <PageNeighbors />
  </LibraryPage>
</template>
