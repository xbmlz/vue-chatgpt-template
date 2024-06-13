import { atom } from 'nanostores'
import type { ErrorMessage } from '~/types/message'

export const currentErrorMessage = atom<ErrorMessage | null>(null)

export const suggestPrompt = atom<string | null>(null)

export const showConversationSidebar = atom(false)

export const isScrollBottom = atom(false)

export function scrollController() {
  const elementList = () => Array.from(document.getElementsByClassName('scroll-list'))
  return {
    scrollToTop: () => elementList().forEach(element => element.scrollTo({ top: 0, behavior: 'smooth' })),
    scrollToBottom: () => elementList().forEach(element => element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' })),
    instantToBottom: () => elementList().forEach(element => element.scrollTo({ top: element.scrollHeight })),
  }
}
