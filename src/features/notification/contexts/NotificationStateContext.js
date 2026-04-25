import { createContext, useContext } from 'react'

export const NotificationContext = createContext(null)

export function useNotificationContext() {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider')
  }

  return context
}
