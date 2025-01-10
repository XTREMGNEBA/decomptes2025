import { UseFetchOptions } from 'nuxt/app'

export function useApi<T>(path: string, options: UseFetchOptions<T> = {}) {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const defaults: UseFetchOptions<T> = {
    baseURL: config.public.apiBase,
    key: path,
    headers: {
      ...options.headers,
      ...(authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {})
    }
  }

  return useFetch(path, { ...defaults, ...options })
}