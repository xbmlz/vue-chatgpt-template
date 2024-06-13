export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface MessageInstance extends Message {
  id: string
  created?: number
  streaming?: boolean
}

export interface StreamInstance {
  messageId: string
  stream: ReadableStream
}

export interface ErrorMessage {
  code: string
  message: string
}
