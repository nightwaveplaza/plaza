import { useAxios } from '@app/composables/api/useAxios.ts'
import { type UserFavoritesResponse } from '@app/types'
import type { AxiosResponse } from 'axios'

export function useUserFavoritesApi () {
  const getFavorites = () => {
    const instance = useAxios<UserFavoritesResponse>()
    const fetch = (page: number) => instance.call({
      url: `v2/users/me/favorites/?page=${page}`
    })
    return { ...instance, fetch }
  }

  const addFavorite = () => {
    const instance = useAxios<AxiosResponse>()
    const fetch = (songId: string) => instance.call({
      data: { song_id: songId },
      method: 'POST',
      url: `v2/users/me/favorites`
    })
    return { ...instance, fetch }
  }

  const deleteFavorite = () => {
    const instance = useAxios<AxiosResponse>()
    const fetch = (favoriteId: number) => instance.call({
      method: 'DELETE',
      url: `v2/users/me/favorites/${favoriteId}`
    })
    return { ...instance, fetch }
  }

  return {
    getFavorites, addFavorite, deleteFavorite
  }
}
