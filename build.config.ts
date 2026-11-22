import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    {
      builder: 'mkdist',
      input: 'src',
      ext: 'js',
      // An app's Tailwind reads the stylesheet, so it ships as written.
      postcss: false,
    },
  ],
})
