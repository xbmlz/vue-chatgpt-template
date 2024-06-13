<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import type { MessageInstance } from '~/types/message'
import { isScrollBottom } from '~/stores/ui'

defineOptions({
  name: 'MessageList',
})

const porps = defineProps({
  conversationId: {
    type: String,
    required: true,
  },
  messages: {
    type: Array as PropType<readonly MessageInstance[]>,
    required: true,
  },
})

const scrollRef = ref<HTMLDivElement>()
const $isScrollBottom = useStore(isScrollBottom)

const { y } = useScroll(scrollRef)

const instantScrollToBottomThrottle = useThrottleFn(() => {
  if (!scrollRef.value)
    return
  $isScrollBottom.value && scrollRef.value.scrollTo({ top: scrollRef.value.scrollHeight })
}, 250)

watchEffect(() => {
  if (!scrollRef.value)
    return
  isScrollBottom.set(y.value + scrollRef.value.clientHeight >= scrollRef.value.scrollHeight - 100)
})

watch(() => porps.conversationId, () => {
  nextTick(() => {
    instantScrollToBottomThrottle()
  })
})

function handleStreamableTextUpdate() {
  instantScrollToBottomThrottle()
}
</script>

<template>
  <div ref="scrollRef" class="scroll-list relative flex flex-1 of-y-scroll">
    <div class="w-full">
      <div v-for="(item, index) in messages" :key="item.id">
        <MessageItem
          :conversation-id="conversationId"
          :message="item"
          :index="index"
          @handle-streaming="handleStreamableTextUpdate"
        />
      </div>
    </div>
  </div>
</template>
