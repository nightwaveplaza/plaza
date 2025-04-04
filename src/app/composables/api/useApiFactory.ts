import { type CallResponse, useApi } from '@app/composables/api/useApi.ts'

// Extended API handler with a convenient fetch method
export interface ApiHandler<T, Args extends unknown[] = []> extends CallResponse<T> {
  fetch: (...args: Args) => Promise<T>
}

/**
 * Factory to create pre-configured API handlers
 *
 * Simplifies creating API calls by pre-defining URLs and methods.
 * Args Array of args: [{ pathParams }, { queryOrBodyData }] or [{ queryOrBodyData }]
 * For example DELETE /users/me/favorites/{id} Args would be [{id: number}]
 * Another example POST /users/me/foo/{bar} Args would be [{data: object}, {bar: string}]
 * or [{data: object}] if no {params}
 * Maybe this can be better, but I'm here
 */
export function useApiFactory (): {
  createApiHandler: <T, Args extends unknown[] = []>(url: string, method?: string) => () => ApiHandler<T, Args>
} {
  /**
   * Function creates API handler
   * @param url API endpoint
   * @param method HTTP method
   */
  const createApiHandler = <T, Args extends unknown[] = []> (url: string, method: string = 'GET') => {
    return (): ApiHandler<T, Args> => {
      const instance = useApi<T>()
      const isGet = method.toUpperCase() === 'GET'

      // Check if url has dynamic params (ex. /songs/{id})
      const hasPathParams = /\{\w+}/.test(url)

      // Fetch method that handles params or data based on HTTP method
      const fetch = (...args: Args): Promise<T> => {
        let finalUrl = url

        const [pathParams, requestData] = hasPathParams
          ? [args[0] as Record<string, string | number | boolean>, args[1]]
          : [null, args[0]]

        // If url has dynamic params then replace placeholders in URL
        if (hasPathParams) {
          if (!pathParams) {
            throw new Error('Path parameters are required for this request')
          }

          finalUrl = url.replace(/\{(\w+)}/g, (_, key) => {
            const value = pathParams[key]
            if (value === undefined) {
              throw new Error(`Missing path parameter: ${key}`)
            }
            return encodeURIComponent(value)
          })
        }

        return instance.call({
          method,
          url: finalUrl,
          [isGet ? 'params' : 'data']: requestData,
        })
      }

      return { ...instance, fetch }
    }
  }

  return { createApiHandler }
}
