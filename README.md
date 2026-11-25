# NichtImKopf UI

The theme and components of NichtImKopf, built on Nuxt UI.

Nothing is released yet.

## Usage

The theme is for a Vue app that uses Nuxt UI as its [installation guide for Vue](https://ui.nuxt.com/docs/getting-started/installation/vue) describes.

Add the theme to the options of the Nuxt UI Vite plugin in your `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'
import { nikTheme } from '@nichtimkopf/ui/theme'

export default defineConfig({
  plugins: [vue(), ui({ ...nikTheme })],
})
```

Import the theme after Tailwind CSS and Nuxt UI in your CSS:

```css
@import 'tailwindcss';
@import '@nuxt/ui';
@import '@nichtimkopf/ui/theme.css';
```

## Contributing

Pull requests target the `main` branch. Run `npm ci` and `pre-commit install` once, then the checks run on every commit.

## License

[MIT](LICENSE). Copyright (c) 2026 Solidev - Thomas Liska and contributors. A file in `src/` that is ported from another project names that project's copyright holder in its first lines.
