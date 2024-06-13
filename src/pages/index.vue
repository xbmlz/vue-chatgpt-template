<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import { buildStores } from '~/stores'
import { conversationMap, currentConversationId } from '~/stores/conversation'
import { conversationMessagesMap } from '~/stores/messages'
import { showConversationSidebar } from '~/stores/ui'

defineOptions({
  name: 'IndexPage',
})

onMounted(() => {
  buildStores()
})

const $conversationMap = useStore(conversationMap)
const $conversationMessagesMap = useStore(conversationMessagesMap)
const $currentConversationId = useStore(currentConversationId)
const $showConversationSidebar = useStore(showConversationSidebar)

const currentConversation = computed(() => {
  return $conversationMap.value[$currentConversationId.value]
})

const currentConversationMessages = computed(() => {
  return $conversationMessagesMap.value[$currentConversationId.value] || []
})

watchEffect(() => {
  const conversation = currentConversation.value
  document.title = conversation ? `${(conversation.name || '')} - UnionChat` : 'UnionChat'
})
</script>

<template>
  <div class="h-full flex flex-col">
    <TheNav />
    <!-- mobile sider -->
    <div
      v-show="$showConversationSidebar"
      class="fixed bottom-0 left-0 top-0 z-999 h-full max-h-screen max-w-screen w-full"
    >
      <div class="absolute bottom-0 left-0 right-0 top-0 -z-1" @click="showConversationSidebar.set(false)" />
      <ConversationList class="transform transition-transform duration-300" />
    </div>
    <div class="flex flex-1 of-y-auto">
      <!-- conversation list -->
      <div class="hidden md:block">
        <ConversationList />
      </div>
      <!-- conversation -->
      <div class="conversation-bg flex flex-1 flex-col of-y-auto dark:bg-#2e2e30">
        <!-- message list -->
        <div class="relative flex flex-1 flex-col of-y-auto">
          <MessageList
            v-if="$currentConversationId && currentConversationMessages.length"
            :conversation-id="$currentConversationId"
            :messages="currentConversationMessages"
          />
          <Welcome v-else />
        </div>
        <!-- message input -->
        <div class="relative p-2 md:(p-4)">
          <MessageInput />
        </div>
      </div>
    </div>
  </div>
</template>
