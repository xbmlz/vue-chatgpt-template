<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import { UseClipboard } from '@vueuse/components'
import { deleteStreamById, getStreamByConversationId, streamsMap } from '~/stores/streams'
import type { MessageInstance } from '~/types/message'
import { deleteMessageByConversationId, updateMessage } from '~/stores/messages'
import { convertReadableStreamToRef } from '~/logics/stream'
import { conversationMap, currentConversationId } from '~/stores/conversation'
import { globalAbortController } from '~/stores/settings'
import { handlePrompt } from '~/logics/conversation'
import { scrollController } from '~/stores/ui'

defineOptions({
  name: 'MessageItem',
})

const props = defineProps({
  conversationId: {
    type: String,
    required: true,
  },
  message: {
    type: Object as PropType<MessageInstance>,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
})

const emits = defineEmits(['handleStreaming'])

const $streamsMap = useStore(streamsMap)
const $conversationMap = useStore(conversationMap)
const $currentConversationId = useStore(currentConversationId)
const localText = ref('')

const roleClass = {
  system: 'bg-gradient-to-b from-gray-300 via-gray-200 to-gray-300',
  user: 'bg-blue',
  assistant: 'bg-primary',
}

const roleName = {
  system: 'S',
  user: 'U',
  assistant: 'AI',
}

const isStreaming = computed(() => {
  return !!$streamsMap.value[$currentConversationId.value]
})

const currentConversation = computed(() => {
  return $conversationMap.value[$currentConversationId.value]
})

watch(() => localText.value, () => {
  if (props.message.streaming)
    emits('handleStreaming')
})

watchEffect(async () => {
  const text = props.message.content
  if (text) {
    localText.value = text
  }
  else if (props.message.streaming) {
    const streamInstance = getStreamByConversationId(props.conversationId)
    if (props.message.id && streamInstance?.messageId === props.message.id) {
      await convertReadableStreamToRef(streamInstance.stream, localText)

      updateMessage(props.conversationId, props.message.id, {
        content: localText.value,
        streaming: false,
      })
    }
    deleteStreamById(props.conversationId)
  }
  else {
    localText.value = ''
  }
})

function handleRetryMessageItem() {
  const controller = new AbortController()
  globalAbortController.set(controller)
  deleteMessageByConversationId(props.conversationId, props.message)
  // spliceMessageByConversationId(currentConversation.value.id, props.message)

  handlePrompt(currentConversation.value, '', controller.signal)
  // TODO: scrollController seems not working
  scrollController().scrollToBottom()
}
</script>

<template>
  <div class="group relative break-words p-2 md:(p-6)">
    <div class="max-w-base flex flex-col gap-2 md:(flex flex-row gap-4)">
      <!-- avatar -->
      <div :class="`h-8 w-8 fcc shrink-0 rounded ${roleClass[message.role]}`">
        <span class="c-white font-semibold">{{ roleName[message.role] }}</span>
      </div>
      <!-- card -->
      <div class="min-w-0 flex-1">
        <div class="flex flex-col items-end rounded p-2 shadow-sm bg-base md:(p-4)">
          <Markdown :content="localText" class="mb-2 w-full" />
          <div
            v-if="message.role === 'assistant'"
            class="rd-sm bg-[#f6f8fe] px-1 text-10px c-#e2e2ed -mb-2 -mr-2 dark:bg-[#333335] md:(-mb-4 -mr-4)"
          >
            内容由AI生成，仅供参考
          </div>
        </div>
        <!-- actions -->
        <div class="mt-2 flex px-2">
          <div v-show="!isStreaming && message.role === 'assistant'" class="cursor-pointer text-sm c-blue-600" @click="handleRetryMessageItem()">
            重新回答
          </div>
          <div class="relative flex flex-1 justify-end gap-2">
            <!-- <div class="i-carbon-play-outline h-4 w-4 cursor-pointer bg-[#7886a4]" /> -->
            <UseClipboard v-slot="{ copy, copied }" :source="message.content">
              <div :class="`${copied ? 'i-carbon-checkmark' : 'i-carbon-copy'} bg-[#7886a4] h-4 w-4 cursor-pointer`" @click="copy()" />
            </UseClipboard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
