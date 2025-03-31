import { useAxios } from '@app/composables/api/useAxios.ts'
import {
  type ResultResponse,
  type User,
  type UserEmailForm,
  type UserPasswordForm,
  type UserRegisterForm
} from '@app/types'

export function useUserApi () {
  const get = () => {
    const instance = useAxios<User>()
    const fetch = () => instance.call({
      url: `v2/users/me`
    })
    return { ...instance, fetch }
  }

  const register = () => {
    const instance = useAxios<User>()
    const fetch = (data: UserRegisterForm) => instance.call({
      data,
      method: 'POST',
      url: `v2/users`
    })
    return { ...instance, fetch }
  }

  const updatePassword = () => {
    const instance = useAxios<ResultResponse>()
    const fetch = (data: UserPasswordForm) => instance.call({
      data,
      method: 'POST',
      url: `v2/users/me/password`
    })
    return { ...instance, fetch }
  }

  const updateEmail = () => {
    const instance = useAxios<ResultResponse>()
    const fetch = (data: UserEmailForm) => instance.call({
      data,
      method: 'POST',
      url: `v2/users/me/email`
    })
    return { ...instance, fetch }
  }

  return {
    get, register, updatePassword, updateEmail
  }
}
