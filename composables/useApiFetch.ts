export function useApiFetch(path: string, options: any = {}) {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  
  return useFetch(path, {
    ...options,
    headers: {
      ...options.headers,
      ...(authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {})
    }
  })
}