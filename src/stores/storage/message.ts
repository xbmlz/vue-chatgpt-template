import { del, entries, get, set, update } from 'idb-keyval'
import { messages } from './db'
import type { MessageInstance } from '~/types/message'

async function setItem(key: string, item: MessageInstance[]) {
  const store = messages.get()
  if (store)
    await set(key, item, store)
}

async function getItem(key: string) {
  const store = messages.get()
  if (store)
    return get<MessageInstance[]>(key, store)
  return null
}

async function updateItem(key: string, item: MessageInstance[]) {
  const store = messages.get()
  if (store)
    await update(key, () => item, store)
}

async function deleteItem(key: string) {
  const store = messages.get()
  if (store)
    await del(key, store)
}

async function exportData() {
  const store = messages.get()
  if (store) {
    const entriesData = await entries(store)
    return Object.fromEntries(entriesData) as Record<string, MessageInstance[]>
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
