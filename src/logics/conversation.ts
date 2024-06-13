import { createParser } from 'eventsource-parser'
import type { ParsedEvent, ReconnectInterval } from 'eventsource-parser'
import { updateConversationById } from '~/stores/conversation'
import { getMessagesByConversationId, pushMessageByConversationId } from '~/stores/messages'
import { setLoadingStateByConversationId, setStreamByConversationId } from '~/stores/streams'
import { currentErrorMessage } from '~/stores/ui'
import type { Conversation } from '~/types/conversation'
import type { ErrorMessage, Message } from '~/types/message'

export interface FetchPayload {
  apiKey: string
  baseUrl: string
  body: Record<string, any>
  signal?: AbortSignal
}

export async function handlePrompt(conversation: Conversation, prompt?: string, signal?: AbortSignal) {
  if (!appSettings.value.apiKey) {
    // eslint-disable-next-line no-alert
    let apiKey = window.prompt('请输入API Key')
    while (apiKey === null || apiKey.trim() === '') {
      // eslint-disable-next-line no-alert
      apiKey = window.prompt('请输入API Key')
    }
    appSettings.value.apiKey = apiKey
  }

  if (prompt) {
    // pusm conversation
    pushMessageByConversationId(conversation.id, {
      id: `${conversation.id}:user:${Date.now()}`,
      role: 'user',
      content: prompt,
      created: new Date().getTime(),
    })
  }

  // set loading state
  setLoadingStateByConversationId(conversation.id, true)

  const allMessages = [
    ...getMessagesByConversationId(conversation.id).map(message => ({
      role: message.role,
      content: message.content,
    })),
  ]

  let messageHistorySize = 5
  let maxTokens = 2048
  const messages: Message[] = []
  while (messageHistorySize > 0) {
    messageHistorySize--
    // Get the last message from the payload
    const m = allMessages.pop()
    if (m === undefined)
      break

    if (maxTokens - m.content.length < 0)
      break

    maxTokens -= m.content.length
    messages.unshift(m)
  }

  const apiKey = `Bearer ${appSettings.value.apiKey}`

  let response
  try {
    response = await fetchChatCompletion({
      baseUrl: import.meta.env.VITE_BASE_URL,
      // apiKey: 'token 148eb236f0db8216c7cdf662fb5f9c039cdf0876',
      // baseUrl: 'https://openkey.cloud/v1',
      apiKey,
      body: {
        model: 'gpt-3.5-turbo',
        messages,
        stream: true,
        max_tokens: 2000,
      },
      signal,
    })
    if (response) {
      if (!response.ok) {
        const responseJson = await response.json()
        console.error('responseJson', responseJson)
        const errMessage = responseJson.error?.message || response.statusText || 'Unknown error'
        throw new Error(errMessage, { cause: responseJson.error })
      }

      // parse stream
      const stream = parseStream(response)
      // push message
      const messageId = `${conversation.id}:assistant:${Date.now()}`
      setStreamByConversationId(conversation.id, {
        messageId,
        stream,
      })

      pushMessageByConversationId(conversation.id, {
        id: messageId,
        role: 'assistant',
        content: '',
        streaming: true,
        created: new Date().getTime(),
      })

      setLoadingStateByConversationId(conversation.id, false)

      // Update conversation title
      updateConversationById(conversation.id, {
        name: prompt?.replace(/^['"\s]+|['"\s]+$/g, ''),
      })
    }
  }
  catch (e) {
    const error = e as Error
    const cause = error?.cause as ErrorMessage
    setLoadingStateByConversationId(conversation.id, false)
    if (error.name !== 'AbortError') {
      currentErrorMessage.set({
        code: cause?.code || 'provider_error',
        message: cause?.message || error.message || 'Unknown error',
      })
    }
  }
}

export async function fetchChatCompletion(payload: FetchPayload) {
  const initOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': payload.apiKey,
      'Accept': 'text/event-stream',
    },
    method: 'POST',
    body: JSON.stringify(payload.body),
    signal: payload.signal,
  }
  return fetch(`${payload.baseUrl}/chat/completions`, initOptions)
}

export function parseStream(rawResponse: Response) {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  const rb = rawResponse.body as ReadableStream
  return new ReadableStream({
    async start(controller) {
      const streamParser = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data

          if (data === '[DONE]') {
            controller.close()
            return
          }
          try {
            const json = JSON.parse(data)
            // const text = json.result || ''
            const text = json.choices[0].delta?.content || ''
            const queue = encoder.encode(text)
            controller.enqueue(queue)
          }
          catch (e) {
            controller.error(e)
          }
        }
      }
      const reader = rb.getReader()
      const parser = createParser(streamParser)
      let done = false
      while (!done) {
        const { done: isDone, value } = await reader.read()
        if (isDone) {
          done = true
          controller.close()
          return
        }
        parser.feed(decoder.decode(value, { stream: true }))
      }
    },
  })
}
