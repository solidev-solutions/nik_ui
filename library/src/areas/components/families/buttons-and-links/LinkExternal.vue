<script setup lang="ts">
import ULink from '@nuxt/ui/components/Link.vue'
</script>

<template>
  <dl class="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2">
    <dt class="text-muted">Project</dt>
    <dd>
      <ULink to="/components/buttons-and-links">Website relaunch</ULink>
    </dd>
    <dt class="text-muted">Website</dt>
    <dd>
      <ULink to="https://example.com" target="_blank">example.com</ULink>
    </dd>
  </dl>
</template>
