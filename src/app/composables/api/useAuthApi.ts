import { useAxios } from '@app/composables/api/useAxios.ts'
import { type ResultResponse, type UserLoginForm, type UserLoginResponse } from '@app/types'

export function useAuthApi () {
  const login = () => {
    const instance = useAxios<UserLoginResponse>()
    const fetch = (data: UserLoginForm) => instance.call({
      data,
      url: `v2/auth/login`
    })
    return { ...instance, fetch }
  }

  const logout = () => {
    const instance = useAxios<ResultResponse>()
    const fetch = () => instance.call({
      method: 'POST',
      url: `v2/auth/logout`
    })
    return { ...instance, fetch }
  }

  return {
    login, logout
  }
}
