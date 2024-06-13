import { createStores, rebuildStores } from './storage/db'

export async function buildStores() {
  await createStores()
  await rebuildStores()
}
