import { type ApiHandler, useApiFactory } from '@app/composables/api/useApiFactory.ts'

export function useReactionsApi (): {
  sendReaction: () => ApiHandler<{ reactions: number }, [{ reaction: number }]>
} {
  const { createApiHandler } = useApiFactory()

  return {
    sendReaction: createApiHandler<{ reactions: number }, [{ reaction: number }]>('v2/reactions', 'POST')
  }
}
