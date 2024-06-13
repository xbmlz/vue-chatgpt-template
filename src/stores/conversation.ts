import { action, atom, computed, map } from 'nanostores'
import { db } from './storage/conversation'
import { clearMessagesByConversationId } from './messages'
import type { Conversation } from '~/types/conversation'

export const conversationMap = map<Record<string, Conversation>>({})

export const currentConversationId = atom('')

export const currentConversation = computed(currentConversationId, (id) => {
  return id ? conversationMap.get()[id] as Conversation : null
})

export const conversationMapSortList = computed(conversationMap, (map) => {
  return Object.values(map).sort((a, b) => b.lastUseTime - a.lastUseTime)
})

export const addConversation = action(conversationMap, 'addConversation', (map, instance?: Partial<Conversation>) => {
  const instanceId = instance?.id || `id_${Date.now()}`
  const conversation: Conversation = {
    id: instanceId,
    name: instance?.name || '',
    lastUseTime: Date.now(),
  }
  map.setKey(instanceId, conversation)
  db.setItem(instanceId, conversation)
  currentConversationId.set(instanceId)
})

export const updateConversationById = action(conversationMap, 'updateConversationById', (map, id: string, payload: Partial<Conversation>) => {
  const conversation = {
    ...map.get()[id],
    ...payload,
  }
  map.setKey(id, conversation)
  db.updateItem(id, conversation)
})

export const deleteConversationById = action(conversationMap, 'deleteConversationById', (map, id: string) => {
  map.set(Object.fromEntries(Object.entries(map.get()).filter(([key]) => key !== id)))
  db.deleteItem(id)
  clearMessagesByConversationId(id, true)
})

export async function rebuildConversationStore() {
  const data = await db.exportData() || {}
  conversationMap.set(data)
}
