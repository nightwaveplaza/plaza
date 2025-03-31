import { useApi } from '@app/composables/api/useApi.ts'

export function useReactionsApi () {
  const sendReaction = () => {
    const instance = useApi<{ reactions: number }>()
    const send = (reaction: number) => instance.call({
      method: 'POST',
      url: `v2/reactions`,
      data: { reaction }
    })
    return { ...instance, send }
  }

  return {
    sendReaction
  }
}
