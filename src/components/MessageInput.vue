<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import { addConversation, conversationMap, currentConversationId } from '~/stores/conversation'
import { globalAbortController } from '~/stores/settings'
import { currentErrorMessage, isScrollBottom, scrollController, suggestPrompt } from '~/stores/ui'
import { handlePrompt } from '~/logics/conversation'
import { loadingStateMap, streamsMap } from '~/stores/streams'
import { isMobile } from '~/utils/device'

defineOptions({
  name: 'MessageInput',
})

const prompt = ref()
const inputRef = ref<HTMLTextAreaElement>()

const $suggestPrompt = useStore(suggestPrompt)
const $streamsMap = useStore(streamsMap)
const $conversationMap = useStore(conversationMap)
const $loadingStateMap = useStore(loadingStateMap)
const $currentConversationId = useStore(currentConversationId)
const $globalAbortController = useStore(globalAbortController)
const $isScrollBottom = useStore(isScrollBottom)
const $currentErrorMessage = useStore(currentErrorMessage)

const isStreaming = computed(() => {
  return !!$streamsMap.value[$currentConversationId.value]
})

const isLoading = computed(() => {
  return !!$loadingStateMap.value[$currentConversationId.value]
})

const currentConversation = computed(() => {
  return $conversationMap.value[$currentConversationId.value]
})

const isPC = computed(() => {
  return !isMobile()
})

const btnClass = computed(() => {
  return {
    'btn-disabled': !prompt.value || isStreaming.value || isLoading.value,
  }
})

function clearPrompt() {
  suggestPrompt.set(null)
  prompt.value = ''
}

function handleSend() {
  if (!prompt.value)
    return
  if (!currentConversation.value)
    addConversation()
  // create abort controller
  const controller = new AbortController()
  globalAbortController.set(controller)

  handlePrompt(currentConversation.value, prompt.value, controller.signal)

  clearPrompt()

  nextTick(() => {
    scrollController().scrollToBottom()
  })
}

function handleAbortFetch() {
  $globalAbortController.value?.abort()
  clearPrompt()
}

function scrollToBottom() {
  scrollController().scrollToBottom()
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    if (isLoading.value || isStreaming.value)
      return
    handleSend()
  }
}

function handleRetry() {
  currentErrorMessage.set(null)
  handlePrompt(currentConversation.value, prompt.value, $globalAbortController.value?.signal)
}

watchEffect(() => {
  if ($suggestPrompt.value) {
    prompt.value = $suggestPrompt.value
    inputRef.value?.focus()
  }
})
</script>

<template>
  <div class="flex flex-col">
    <!-- stop -->
    <div v-show="isStreaming || isLoading" class="max-w-base box-border fcc py-2">
      <button
        role="button"
        class="h-8 fcc rd-full bg-primary px-4 py-2 c-white"
        @click="handleAbortFetch"
      >
        <div class="i-carbon-stop-filled-alt h-4 w-4 fcc" />
        <span class="ml-2 truncate text-sm">
          停止回答
        </span>
      </button>
    </div>
    <!-- arrow down -->
    <div v-show="!$isScrollBottom && !isStreaming && $currentConversationId" class="max-w-base box-border fcc py-2">
      <button
        role="button"
        class="h-8 fcc rd-full bg-primary px-4 py-2 c-white"
        @click="scrollToBottom"
      >
        <span class="mr-2 truncate text-sm">
          滚动到底部
        </span>
        <div class="i-carbon-arrow-down h-4 w-4 fcc" />
      </button>
    </div>
    <!-- send -->
    <div class="max-w-base box-border w-full flex-1 md:pl-12">
      <!-- error message -->
      <div
        v-if="$currentErrorMessage"
        class="max-w-base h-full flex flex-col items-end justify-between gap-8 bg-red/8 p-4 text-sm sm:flex-row sm:items-center text-error"
      >
        <div class="w-full flex-1">
          <div class="mb-1 fc gap-0.5">
            <span i-carbon-warning="" />
            <span class="font-semibold">{{ $currentErrorMessage?.code }}</span>
          </div>
          <div>{{ $currentErrorMessage?.message }}</div>
        </div>
        <div class="border rounded-md px-2 py-1 border-error hover:bg-white hv-base" @click="handleRetry()">
          重试
        </div>
      </div>

      <!-- normal -->
      <div
        v-else
        class="flex items-end rd-lg border-base bg-base"
      >
        <textarea
          ref="inputRef"
          v-bind="$attrs"
          v-model="prompt"
          autofocus
          autocomplete="off"
          :placeholder="isPC ? 'Enter 发送，Shift + Enter 换行' : 'Enter 发送'"
          :rows="isPC ? 3 : 1"
          class="box-border h-full min-h-20px flex-1 resize-none rd p-2 shadow-sm outline-none md:(min-h-68px p-5) bg-base"
          @keydown="handleKeyDown"
        />
        <button
          role="button"
          class="mb-1 mr-2 h8 fcc rd-md bg-primary px-4 py-2 c-white md:(mb-4 mr-4 h-8)"
          :class="btnClass"
          @click="handleSend"
        >
          <div v-if="isLoading || isStreaming" class="fcc">
            <div class="i-carbon-renew h-5 w-5 animate-spin" />
            <span class="ml-2 truncate">
              {{ isLoading ? '发送中' : '回答中' }}
            </span>
          </div>
          <div v-else class="fcc">
            <div class="i-carbon-send-alt-filled h-5 w-5" />
            <span class="ml-2 truncate">
              发送
            </span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
