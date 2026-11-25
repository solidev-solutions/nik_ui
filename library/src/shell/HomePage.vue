<script setup lang="ts">
import CatalogCard from '@nichtimkopf/ui/kit/CatalogCard.vue'

import { AREAS, LIBRARY } from '../areas.ts'
import LibraryPage from './LibraryPage.vue'

const REFERENCES = [
  { name: 'Nuxt UI', use: 'The components. We add our own only where it has none.' },
  {
    name: 'ReUI',
    use: 'The parts Nuxt UI lacks, ported from its MIT components, and the patterns for using them.',
  },
  {
    name: 'Mobbin',
    use: 'Screens of shipped products, to see how a pattern is solved in practice.',
  },
]
</script>

<template>
  <LibraryPage :title="LIBRARY">
    <div class="mx-auto flex w-full max-w-160 flex-col gap-12">
      <section class="flex flex-col gap-4">
        <h2 class="text-base font-semibold">What is {{ LIBRARY }}</h2>
        <p>
          The theme and the component kit of the NichtImKopf products. Every product takes its
          colors, its type and its parts from here, so that all of them look and behave as one.
        </p>
      </section>

      <section class="flex flex-col gap-4">
        <h2 class="text-base font-semibold">The references we build on</h2>
        <p>
          We are not design experts, and most of this library is written with AI agents. So we
          invent no designs. Every part follows a reference that experts have built and tested, and
          each page names its own.
        </p>
        <dl class="divide-y divide-default border-y border-default">
          <div
            v-for="reference in REFERENCES"
            :key="reference.name"
            class="grid gap-x-4 gap-y-1 py-2.5 sm:grid-cols-[4rem_1fr]"
          >
            <dt class="font-medium">{{ reference.name }}</dt>
            <dd>{{ reference.use }}</dd>
          </div>
        </dl>
        <p>
          Each component page carries AI Guidelines: the rules an agent follows when it uses that
          part.
        </p>
      </section>

      <section class="flex flex-col gap-4">
        <h2 class="text-base font-semibold">Quick access</h2>
        <!-- Without the role VoiceOver does not call a list without markers a list. -->
        <ul role="list" class="grid gap-6 sm:grid-cols-2">
          <li v-for="area in AREAS" :key="area.id">
            <CatalogCard
              :to="{ name: area.id }"
              :label="area.label"
              :description="area.description"
              :icon="area.icon"
            />
          </li>
        </ul>
      </section>
    </div>
  </LibraryPage>
</template>
