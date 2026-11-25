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

The icons are Hugeicons, from the peer dependency `@iconify-json/hugeicons`: install it in your app, and its build bundles every icon of the theme. Name an icon by its meaning, `icon.edit`, with `icon` from `@nichtimkopf/ui/theme`.

An option you set beside the theme replaces the theme's, so an app that sets `icon` itself spreads the theme's list into it:

```ts
ui({ ...nikTheme, icon: { clientBundle: { ...nikTheme.icon.clientBundle, scan: true } } })
```

Import a component of the kit by its file, as you import one of Nuxt UI:

```ts
import AppFrame from '@nichtimkopf/ui/kit/AppFrame.vue'
```

The theme's stylesheet brings the component's classes into your CSS, so your app adds no `@source` for it.

## Library

The library is a Vue app in `library/` that shows the theme and the kit page by page. It uses the package by its name, as your app does. Run it with:

```sh
npm run library:dev
```

The command builds the package first, and the library shows what was built: run it again after a change in `src/`.

## Contributing

Pull requests target the `main` branch. Run `npm ci`, `pre-commit install` and `npx playwright install chromium` once, then the checks run on every commit. The browser is the one the library is tested in.

## License

[MIT](LICENSE). Copyright (c) 2026 Solidev - Thomas Liska and contributors. A file in `src/` that is ported from another project names that project's copyright holder in its first lines.

The Inter font files in `src/fonts` are under the [SIL Open Font License 1.1](src/fonts/OFL.txt), whose text ships beside them.
