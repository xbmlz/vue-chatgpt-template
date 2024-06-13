import { del, entries, get, set, update } from 'idb-keyval'
import { conversations } from './db'
import type { Conversation } from '~/types/conversation'

async function setItem(key: string, item: Conversation) {
  const store = conversations.get()
  if (store)
    await set(key, item, store)
}

async function getItem(key: string) {
  const store = conversations.get()
  if (store)
    return get<Conversation>(key, store)
  return null
}

async function updateItem(key: string, item: Conversation) {
  const store = conversations.get()
  if (store)
    await update(key, () => item, store)
}

async function deleteItem(key: string) {
  const store = conversations.get()
  if (store)
    await del(key, store)
}

async function exportData() {
  const store = conversations.get()
  if (store) {
    const entriesData = await entries(store)
    return Object.fromEntries(entriesData) as Record<string, Conversation>
  }
  return null
}

export const db = {
  setItem,
  getItem,
  updateItem,
  deleteItem,
  exportData,
}
