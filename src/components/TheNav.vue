<script setup lang="ts">
import { showConversationSidebar } from '~/stores/ui'
</script>

<template>
  <nav class="fc gap-1 border-b px4 py3 text-lg border-base">
    <div class="fc gap-4">
      <!-- logo -->
      <RouterLink to="/" title="Union Chat" class="hidden md:block">
        <img src="../assets/logo.svg" alt="logo" class="h-1.5em">
      </RouterLink>
      <div
        class="fcc rounded-md p-2 text-xl md:hidden hv-foreground"
        @click="() => showConversationSidebar.set(true)"
      >
        <div i-carbon-menu />
      </div>
      <div class="flex items-baseline gap-3">
        <span text-lg>卫博士</span>
        <span text-sm>有用、有趣、有温度</span>
      </div>
    </div>

    <div class="flex-auto" />

    <div class="fc gap-4">
      <button icon-btn @click="toggleDark()">
        <div i-carbon-sun dark:i-carbon-moon />
      </button>

      <!-- <a
        i-carbon-user-avatar
        c-primary
        rel="noreferrer"
        href="javascript:void(0)"
        target="_blank"
        title="User"
      /> -->
    </div>
  </nav>
</template>
