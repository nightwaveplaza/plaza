import { useAxios } from '@app/composables/api/useAxios.ts'
import type { PaginatedResponse } from '@app/types/types.ts'

interface ReactionsResponse extends PaginatedResponse {
  data: {
    id: string
    artist: string
    title: string
    likes: number
  }[],
}

export enum ReactionsRange {
  OVERTIME = 'overtime',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

export function useReactionsApi () {
  const getReactions = () => {
    const instance = useAxios<ReactionsResponse>()
    const fetch = (range: ReactionsRange, page: number) => instance.call({
      url: `v2/reactions/${range}/?page=${page}`
    })
    return { ...instance, fetch }
  }

  return {
    getReactions
  }
}
