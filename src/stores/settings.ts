import { atom } from 'nanostores'

export const globalAbortController = atom<AbortController | null>(null)
