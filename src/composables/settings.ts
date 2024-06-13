import type { Settings } from '~/types/settings'

export const appSettings = useStorage<Settings>('app-settings', {
  apiKey: '',
})
