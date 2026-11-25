import type { Guidelines } from '../../types.ts'

export default {
  Button: {
    use: [
      'Page, form and dialog actions: save, send, open, delete',
      'Known actions as an icon: search, close, copy, more',
    ],
    instead: [
      { when: 'Related actions joined edge to edge', take: 'FieldGroup' },
      { when: 'A page or an address named in running text', take: 'Link' },
      { when: 'A setting that stays on or off', take: 'Switch' },
    ],
    rules: [
      { when: 'The main action, one per page, form or dialog', take: '`color="primary"`' },
      {
        when: 'Other actions',
        take: '`variant="outline"`; a button is neutral unless it names a color',
      },
      { when: 'Actions in a row of a list or a table', take: '`variant="ghost"`' },
      { when: 'Deleting', take: '`color="error"` `variant="soft"`' },
      { when: 'Icon only', take: '`aria-label` and a tooltip with the same words' },
      { when: 'While it works', take: '`loading-auto`; the click handler returns its promise' },
      { when: 'Submits a form', take: '`type="submit"`; the default is `button`' },
      { when: 'Leads to a page', take: '`to`, not a click handler' },
      {
        when: 'A tool that is on while it stays pressed, such as bold',
        take: '`active` and `aria-pressed`, on a neutral `variant="outline"` or `variant="ghost"`',
      },
      { when: 'Side by side', take: 'one `size`' },
      {
        when: 'Label',
        take: 'what happens, in one or two words: `Save`, `Copy link`; never `OK` or `…`',
      },
    ],
  },
  FieldGroup: {
    use: [
      'A split button: the main action and a menu of related actions',
      'A toolbar of related tools',
    ],
    instead: [
      { when: 'One action alone, or actions with space between them', take: 'Button' },
      { when: 'Views to switch between, one of them current', take: 'Tabs' },
      { when: 'Pages of a list', take: 'Pagination' },
      { when: 'An icon or a text inside a field’s edge', take: 'Input' },
    ],
    rules: [
      { when: 'Size', take: '`size` once on the group, not on each member' },
      {
        when: 'A toolbar',
        take: '`role="group"` and an `aria-label`; Nuxt UI renders a plain `div`',
      },
      { when: 'On a phone', take: 'it does not wrap: no more members than fit in one row' },
    ],
  },
  Link: {
    use: [
      'A record or a page named in running text: a project, an offer',
      'An address outside the app, in a new tab: a map, a data sheet',
    ],
    instead: [
      { when: 'An action such as save or send', take: 'Button' },
      { when: 'Links between the areas of the app', take: 'NavigationMenu' },
      { when: 'The way up from a page to the pages above it', take: 'PageHead' },
    ],
    rules: [
      { when: 'A page of the app', take: '`to` with its route' },
      {
        when: 'Outside the app',
        take: '`target="_blank"`; Nuxt UI adds `rel="noopener noreferrer"`',
      },
      {
        when: 'The current page',
        take: '`exact` on a route link sets `aria-current="page"`; `active` does not',
      },
    ],
  },
} satisfies Record<string, Guidelines>
