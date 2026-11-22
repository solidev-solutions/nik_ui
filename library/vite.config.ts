import { nikTheme } from '@nichtimkopf/ui/theme'
import ui from '@nuxt/ui/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    ui({
      ...nikTheme,
      // The app imports what it uses.
      components: false,
      autoImport: false,
      // The library names the areas' icons itself, in a script, not through the theme's registry:
      // the scan finds them there and bundles what the registry does not hold.
      icon: {
        clientBundle: {
          ...nikTheme.icon.clientBundle,
          scan: { globInclude: ['src/**/*.{vue,ts}'] },
        },
      },
    }),
  ],
})
