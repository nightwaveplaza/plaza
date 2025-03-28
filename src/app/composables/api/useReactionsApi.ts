import { useAxios } from '@app/composables/api/useAxios.ts'

export function useReactionsApi () {
  const sendReaction = () => {
    const instance = useAxios<{ reactions: number }>()
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
