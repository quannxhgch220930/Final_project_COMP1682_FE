import { createContext, useContext } from 'react'

export const CommerceContext = createContext(null)

export function useCommerceContext() {
  const context = useContext(CommerceContext)

  if (!context) {
    throw new Error('useCommerceContext must be used within CommerceProvider')
  }

  return context
}
