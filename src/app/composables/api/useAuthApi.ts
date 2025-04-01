import { useApi } from '@app/composables/api/useApi.ts'
import {
  type ResultResponse,
  type UserLoginForm,
  type UserLoginResponse,
  type UserResetConfirmForm,
  type UserResetForm
} from '@app/types'

export function useAuthApi () {
  const csrf = () => {
    const instance = useApi<ResultResponse>()
    const fetch = () => instance.call({
      url: '/auth/csrf-cookie'
    })
    return { ...instance, fetch }

  }

  const login = () => {
    const instance = useApi<UserLoginResponse>()
    const fetch = (data: UserLoginForm) => instance.call({
      method: 'POST',
      data,
      url: `v2/auth/login`
    })
    return { ...instance, fetch }
  }

  const logout = () => {
    const instance = useApi<ResultResponse>()
    const fetch = () => instance.call({
      method: 'POST',
      url: `v2/auth/logout`
    })
    return { ...instance, fetch }
  }

  const resetPassword = () => {
    const instance = useApi<ResultResponse>()
    const fetch = (data: UserResetForm) => instance.call({
      data,
      method: 'POST',
      url: `v2/auth/reset-password`
    })
    return { ...instance, fetch }
  }

  const resetPasswordConfirm = () => {
    const instance = useApi<ResultResponse>()
    const fetch = (data: UserResetConfirmForm) => instance.call({
      data,
      method: 'POST',
      url: `v2/auth/confirm-password`
    })
    return { ...instance, fetch }
  }

  return {
    login, logout, resetPassword, resetPasswordConfirm,  csrf
  }
}
