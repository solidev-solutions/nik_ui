export interface Example {
  /** The name of its file in the family's folder, without `.vue`. */
  id: string
  title: string
  /** The ReUI examples it is ported from, by their names there: `c-button-1`. */
  ports?: string[]
}

export interface Member {
  /** A component of Nuxt UI. */
  name: string
  /** The end of the address of its page in Nuxt UI's documentation. */
  docs: string
  examples: Example[]
}

export interface Family {
  /** The name of its folder in `families`, and the end of its page's address. */
  id: string
  label: string
  icon: string
  members: Member[]
}
