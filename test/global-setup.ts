import { execSync } from 'node:child_process'
import { mkdirSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// From this file, not from where the tests are started.
const root = fileURLToPath(new URL('..', import.meta.url))
const scope = `${root}test/fixtures/app/node_modules/@nichtimkopf`

// The fixture app gets the package the way a product does: the published files, unpacked into its
// node_modules. Its own package.json keeps Node from resolving the package's name to this checkout.
// Scripts are switched on because a release builds in `prepack`, and a user's npm config may turn
// them off.
export default function setup() {
  rmSync(scope, { recursive: true, force: true })
  mkdirSync(`${scope}/ui`, { recursive: true })
  execSync(`npm pack --ignore-scripts=false --pack-destination ${scope}`, {
    cwd: root,
    stdio: 'pipe',
  })
  execSync(`tar -xzf ${scope}/*.tgz -C ${scope}/ui --strip-components=1`)
}
