import { createContext, useContext, useEffect, useState } from 'react'
import { authClientApi } from '../api/authClient.api'
import { clearAccessToken, getAccessToken } from '../lib/tokenStorage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    initialized: false,
    isAuthenticated: false,
    user: null,
  })

  useEffect(() => {
    const token = getAccessToken()

    if (!token) {
      setAuthState({
        initialized: true,
        isAuthenticated: false,
        user: null,
      })
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

  const login = async (credentials) => {
    const response = await authClientApi.login(credentials)

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

  return (
    <AuthContext.Provider
      value={{
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

export function useAuthContext() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }

  return context
}
