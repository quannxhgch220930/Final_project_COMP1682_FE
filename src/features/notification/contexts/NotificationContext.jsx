import { useEffect, useState } from 'react'
import { notificationApi } from '../api/notification.api'
import { NotificationContext } from './NotificationStateContext'
import { useAuth } from '../../auth/hooks/useAuth'

export function NotificationProvider({ children }) {
  const { isAuthenticated, user } = useAuth()
  const [notificationState, setNotificationState] = useState({
    ownerId: null,
    unreadCount: 0,
  })

  useEffect(() => {
    let mounted = true

    if (!isAuthenticated || !user?.id) {
      return () => {
        mounted = false
      }
    }

    notificationApi
      .getUnreadCount()
      .then((count) => {
        if (!mounted) {
          return
        }

        setNotificationState({
          ownerId: String(user.id),
          unreadCount: count,
        })
      })
      .catch(() => {
        if (!mounted) {
          return
        }

        setNotificationState({
          ownerId: String(user.id),
          unreadCount: 0,
        })
      })

    return () => {
      mounted = false
    }
  }, [isAuthenticated, user?.id])

  const syncUnreadCount = async () => {
    if (!isAuthenticated || !user?.id) {
      setNotificationState({
        ownerId: null,
        unreadCount: 0,
      })
      return 0
    }

    const count = await notificationApi.getUnreadCount()
    setNotificationState({
      ownerId: String(user.id),
      unreadCount: count,
    })

    return count
  }

  const markAllNotificationsRead = async () => {
    const response = await notificationApi.markAllRead()

    setNotificationState((current) => ({
      ...current,
      ownerId: String(user?.id ?? ''),
      unreadCount: 0,
    }))

    return response
  }

  const unreadCount =
    isAuthenticated && notificationState.ownerId === String(user?.id)
      ? notificationState.unreadCount
      : 0

  return (
    <NotificationContext.Provider
      value={{
        markAllNotificationsRead,
        syncUnreadCount,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
