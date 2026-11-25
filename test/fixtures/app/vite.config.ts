import { nikTheme } from '@nichtimkopf/ui/theme'
import ui from '@nuxt/ui/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  // The app imports what it uses, and it has no router for a button's link to ask.
  plugins: [vue(), ui({ ...nikTheme, components: false, autoImport: false, router: false })],
})
