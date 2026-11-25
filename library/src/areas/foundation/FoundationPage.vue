<script setup lang="ts">
import CatalogCard from '@nichtimkopf/ui/kit/CatalogCard.vue'

import LibraryPage from '../../shell/LibraryPage.vue'
import { GROUPS } from './sections.ts'
</script>

<template>
  <LibraryPage title="Foundation">
    <section v-for="group in GROUPS" :key="group.label" class="flex flex-col gap-4">
      <h2 class="text-base font-semibold">{{ group.label }}</h2>
      <!-- Without the role a screen reader does not call a list without markers a list. As many
           columns as the page has room for, which the navigation beside it shares: a card is
           never narrower than 15rem, where its art would be cut, and the cards of a group share
           the row. -->
      <ul role="list" class="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-6">
        <li v-for="section in group.sections" :key="section.id">
          <CatalogCard
            :to="{ name: 'section', params: { section: section.id } }"
            :label="section.label"
            :icon="section.icon"
          />
        </li>
      </ul>
    </section>
  </LibraryPage>
</template>
