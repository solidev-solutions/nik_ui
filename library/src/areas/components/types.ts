export interface Example {
  /** The name of its file in the family's folder, without `.vue`. */
  id: string
  title: string
  /** The ReUI examples it is ported from, by their names there: `c-button-1`. */
  ports?: string[]
}

/** What an agent follows when it uses a member. It reads every line to the letter. */
export interface Guidelines {
  /** What the member is for. */
  use: string[]
  /** What it is not for, each with the part to take instead, by its name. */
  instead: { when: string; take: string }[]
  /** A case and what to take in it. What stands between backticks there is code. */
  rules: { when: string; take: string }[]
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
