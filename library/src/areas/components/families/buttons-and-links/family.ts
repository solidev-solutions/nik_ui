import type { Family } from '../../types.ts'

export default {
  id: 'buttons-and-links',
  label: 'Buttons and links',
  icon: 'i-hugeicons-cursor-pointer-01',
  members: [
    {
      name: 'Button',
      docs: 'button',
      examples: [
        {
          id: 'ButtonVariants',
          title: 'Variants',
          ports: ['c-button-1', 'c-button-3', 'c-button-4', 'c-button-6', 'c-button-5'],
        },
        { id: 'ButtonSizes', title: 'Sizes', ports: ['c-button-7', 'c-button-8', 'c-button-9'] },
        {
          id: 'ButtonWithIcon',
          title: 'With an icon',
          ports: ['c-button-14', 'c-button-12', 'c-button-18'],
        },
        { id: 'ButtonIconOnly', title: 'Icon only', ports: ['c-button-11'] },
        { id: 'ButtonLoading', title: 'Loading', ports: ['c-button-13'] },
        { id: 'ButtonCopy', title: 'Copy', ports: ['c-button-41', 'c-button-42'] },
        { id: 'ButtonDisabled', title: 'Disabled' },
      ],
    },
    {
      name: 'FieldGroup',
      docs: 'field-group',
      examples: [{ id: 'FieldGroupIcons', title: 'Icon actions', ports: ['c-button-group-6'] }],
    },
    {
      name: 'Link',
      docs: 'link',
      examples: [
        { id: 'LinkDefault', title: 'In a sentence' },
        { id: 'LinkExternal', title: 'To a page and outside' },
      ],
    },
  ],
} satisfies Family
