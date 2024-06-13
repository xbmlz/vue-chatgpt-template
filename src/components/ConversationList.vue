<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import { addConversation, conversationMapSortList, currentConversationId, deleteConversationById } from '~/stores/conversation'
import { showConversationSidebar } from '~/stores/ui'

defineOptions({
  name: 'ConversationList',
})

const $conversationMapSortList = useStore(conversationMapSortList)
const $currentConversationId = useStore(currentConversationId)
const searchText = ref('')

const filterList = computed(() => {
  return $conversationMapSortList.value.filter((item) => {
    return item.name.includes(searchText.value)
  })
})

function handleAdd() {
  addConversation()
}

function handleClick(id: string) {
  currentConversationId.set(id)
  showConversationSidebar.set(false)
}

function handleDelete(e: MouseEvent, id: string) {
  e.stopPropagation()
  currentConversationId.set('')
  deleteConversationById(id)
}
</script>

<template>
  <div class="conversation-list h-full w-300px flex flex-col shadow">
    <!-- search -->
    <div class="mb-2 mt-4 fcc">
      <div class="flex border rd-full border-none bg-#f2f3f5 px-3 outline-none dark:bg-#2e2e30">
        <form action="/" class="flex-auto" role="search" method="get">
          <input
            v-model="searchText"
            aria-label="Search"
            class="m-0 w-full bg-transparent px-4 py-1 text-14px lh-26px outline-none"
            name="s"
            placeholder="搜索历史记录..."
            autocomplete="off"
          >
        </form>
        <div class="m-auto inline-block flex-none lh-1em opacity-60">
          <div class="i-carbon-search h2em c-primary" />
        </div>
      </div>
    </div>

    <div class="flex-1 of-y-auto">
      <div class="px-2 py-4">
        <!-- items -->
        <div class="flex flex-col">
          <div class="px-2">
            <div
              v-for="item in filterList"
              :key="item.id"
              class="group my-0.5 h-12 fc gap-2 rounded-md px-2 hv-primary"
              :class="{
                'bg-primary/6': item.id === $currentConversationId,
              }"
              @click="handleClick(item.id)"
            >
              <div class="h-8 w-8 fcc shrink-0 rounded-full text-xl">
                <div class="i-carbon-chat text-base c-primary" />
              </div>
              <div class="flex-1 truncate text-base group-hover:c-primary">
                {{ item.name || '未命名对话' }}
              </div>
              <div class="hidden group-hover:block">
                <div class="inline-flex items-center gap-1 rounded-md p-2 hv-base" @click="handleDelete($event, item.id)">
                  <div class="i-carbon-trash-can c-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- footer -->
    <div class="flex">
      <div class="h-20 w-300px fcc">
        <div
          class="h-8 w-50 fcc cursor-pointer gap-1 border rounded-md px-2 text-xs c-primary transition-colors border-primary"
          @click="handleAdd"
        >
          <div class="i-carbon-add text-base" />
          <div>新建对话</div>
        </div>
      </div>
    </div>
  </div>
</template>
