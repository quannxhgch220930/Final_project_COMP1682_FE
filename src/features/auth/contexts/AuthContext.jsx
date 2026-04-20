import { useEffect, useState } from 'react'
import { authClientApi } from '../api/authClient.api'
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from '../lib/tokenStorage'
import { AuthContext } from './AuthStateContext'

function getInitialAuthState() {
  const hasToken = Boolean(getAccessToken())

  return {
    initialized: !hasToken,
    isAuthenticated: false,
    user: null,
  }
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getInitialAuthState)

  useEffect(() => {
    const token = getAccessToken()

    if (!token) {
      return
    }

    authClientApi
      .getCurrentUser()
      .then((user) => {
        setAuthState({
          initialized: true,
          isAuthenticated: true,
          user,
        })
      })
      .catch(() => {
        clearAccessToken()
        setAuthState({
          initialized: true,
          isAuthenticated: false,
          user: null,
        })
      })
  }, [])

  const login = async (credentials, options = {}) => {
    const loginRequest = options.adminOnly
      ? authClientApi.adminLogin
      : authClientApi.login
    const response = await loginRequest(credentials)

    setAuthState({
      initialized: true,
      isAuthenticated: true,
      user: response.data,
    })

    return response
  }

  const logout = () => {
    clearAccessToken()
    setAuthState({
      initialized: true,
      isAuthenticated: false,
      user: null,
    })
  }

  const updateAuthUser = (user) => {
    setAuthState((currentState) => ({
      ...currentState,
      initialized: true,
      isAuthenticated: true,
      user,
    }))
  }

  const authenticateWithToken = async (token) => {
    setAccessToken(token)

    try {
      const user = await authClientApi.getCurrentUser()
      setAuthState({
        initialized: true,
        isAuthenticated: true,
        user,
      })

      return user
    } catch (error) {
      clearAccessToken()
      setAuthState({
        initialized: true,
        isAuthenticated: false,
        user: null,
      })
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        authenticateWithToken,
        ...authState,
        login,
        logout,
        updateAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
