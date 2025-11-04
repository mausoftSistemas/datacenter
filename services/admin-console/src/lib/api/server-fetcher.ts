export const serverFetcher = async <T>(
  url: string,
  options?: RequestInit & { token?: string },
): Promise<T> => {
  const isAuthDisabled = process.env.NEXT_PUBLIC_AUTH_DISABLED === 'true'
  const disabledEmail = process.env.NEXT_PUBLIC_AUTH_DISABLED_EMAIL || 'tester@example.com'
  const headers = {
    ...(!(options?.body instanceof FormData)
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(options?.token
      ? { Authorization: `Bearer ${options?.token}` }
      : isAuthDisabled
        ? { Authorization: `Bearer ${disabledEmail}` }
        : {}),
    ...(options?.headers || {}),
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = new Error(
      `API Request failed\nURL: ${url}\nStatus: ${response.status} ${response.statusText}`,
      { cause: response.status },
    )
    throw error
  }

  return response.json()
}
