import { atom } from 'nanostores'
import { createStore } from 'idb-keyval'
import type { UseStore } from 'idb-keyval'
import { rebuildConversationStore } from '../conversation'
import { rebuildMessagesStore } from '../messages'

export const conversations = atom<UseStore | null>(null)
export const messages = atom<UseStore | null>(null)
export const settings = atom<UseStore | null>(null)

export function createStores() {
  conversations.set(createStore('conversations', 'keyval'))
  messages.set(createStore('messages', 'keyval'))
}

export async function rebuildStores() {
  await rebuildConversationStore()
  await rebuildMessagesStore()
}
