<script setup lang="ts">
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'

// @ts-expect-error type definition is missing
import rehypePrism from '@mapbox/rehype-prism'
import 'katex/dist/katex.min.css'

defineOptions({
  name: 'Markdown',
})

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
})

const source = ref('')
const copiedIndex = ref(-1)
const { copied, copy } = useClipboard({ source })

useEventListener(document, 'click', (e) => {
  const el = e.target as HTMLElement
  if (el.matches('div > div.code-copy-btn')) {
    copiedIndex.value = Number.parseInt(el.dataset.index!)
    copy(decodeURIComponent(el.dataset.code!))
  }
  if (el.matches('div > div.code-copy-btn > i') && el.parentElement) {
    copiedIndex.value = Number.parseInt(el.parentElement.dataset.index!)
    copy(decodeURIComponent(el.parentElement.dataset.code!))
  }
})

function parseMarkdown(raw: string) {
  const file = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypePrism, {
      ignoreMissing: true,
    })
    .use(rehypeKatex)
    .use(rehypeStringify)
    .processSync(raw)
  return String(file)
}

function htmlString() {
  const raw = parseMarkdown(props.content)
  // Replace the code block with a custom HTML structure that includes a copy button
  const codeBlockRegex = /<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/g
  let index = 0
  const newHtml = raw.replace(codeBlockRegex, (match) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(match, 'text/html')
    const codeElement = doc.querySelector('code')
    const code = codeElement?.textContent || ''

    const result = `<div class="relative">
        <div data-code=${encodeURIComponent(code)} data-index=${index} class="code-copy-btn group">
          ${copied.value && copiedIndex.value === index ? '<i class="i-carbon-checkmark"></i>' : '<i class="i-carbon-copy"></i>'}
        </div>
        ${match}
      </div>`
    index++
    return result
  })
  return newHtml
}
</script>

<template>
  <div class="max-w-4xl prose prose-neutral dark:prose-invert" v-html="htmlString()" />
</template>
