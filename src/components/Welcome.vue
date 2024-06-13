<script setup lang="ts">
import { suggestPrompt } from '~/stores/ui'

const suggestPrompts = [
  {
    id: 1,
    title: '新闻评论',
    content: '你是一位新闻评论员。请结合小学生群体收集烟卡事件，撰写一篇短评。  事件概述：小学生群体收集烟卡事件  要求： 1. 深入分析该事件的社会背景、原因、影响等。 2. 结合新闻评论员的身份，从新闻角度对该事件进行客观、公正的评论。 3. 短评应包含对事件的评价、看法、建议等，同时注重语言的准确性和流畅性。 4. 短评字数控制在300字以内。',
  },
  {
    id: 2,
    title: '计算机学科问答',
    content: '我是计算机专业的学生，请帮我分析“程序，进程，线程，超线程“之间的联系和区别。',
  },
  {
    id: 3,
    title: '广告片文案',
    content: '请为一款智能扫地机器人产品设计一支广告片的营销文案，要求体现智能控制、省时省力的产品特色',
  },
  {
    id: 4,
    title: '推理选择题',
    content: '下列推理中正确的一项是（　　）。 A.如果堵车，那么他将迟到。现在他迟到了，所以堵车了 B.某中学的一些数学教师获得了硕士学位，这中学的数学教师都是男教师，所以，有些男教师取得了硕士学位 C.如果小李预言的现象发生了，说明他的理论是正确的。现在证明理论是正确的，所以现象一定发生了 D.有些爱唱歌的人也爱跳舞，小红爱唱歌，所以也爱跳舞',
  },
]

function handleClick(content: string) {
  suggestPrompt.set(content)
}
</script>

<template>
  <div class="w-full p-2 md:p-4">
    <div class="max-w-base flex flex-col gap-2 md:(flex flex-row gap-4)">
      <!-- avatar -->
      <div class="h-8 w-8 fcc shrink-0 rounded-md bg-primary">
        <span class="c-white font-semibold">AI</span>
      </div>
      <!-- card -->
      <div class="mt-2 flex-1 rounded p-4 shadow-sm md:mt-0 bg-base">
        <div class="flex flex-col">
          <strong class="mb-2 text-26px font-600 lh-36px">您好，我是卫博士！</strong>
          <p class="mb-6">
            作为你的智能伙伴，我既能写文案、想点子，又能陪你聊天、答疑解惑。
          </p>
          <div class="relative mb-6 h-24px">
            <div class="absolute bottom-0 h-10px w-74px rd-md bg-primary from-[#f5a7b0] to-[#CE283C] bg-gradient-to-r" />
            <span class="absolute text-18px">为您推荐</span>
          </div>

          <div grid="~ md:cols-[1fr_1fr] gap-x-4 gap-y-4">
            <div v-for="item in suggestPrompts" :key="item.id" class="group flex flex-wrap" @click="handleClick(item.content)">
              <div class="cursor-pointer rd-md bg-#f6f8fd p-4 dark:bg-#2e2e30 group-hover:bg-primary/6">
                <div class="mb-4 fc gap-3">
                  <img src="../assets/crown.svg" alt="" class="h-21px w-23px">
                  <span class="lh-21px">{{ item.title }}</span>
                </div>
                <p class="line-clamp-3 break-words">
                  {{ item.content }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
