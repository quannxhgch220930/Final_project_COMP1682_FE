const ACCESS_TOKEN_KEY = 'access_token'

function getStorage() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function clearAccessToken() {
  getStorage()?.removeItem(ACCESS_TOKEN_KEY)
}

export function getAccessToken() {
  return getStorage()?.getItem(ACCESS_TOKEN_KEY) ?? null
}

export function setAccessToken(token) {
  getStorage()?.setItem(ACCESS_TOKEN_KEY, token)
}
