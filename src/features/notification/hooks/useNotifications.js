import { useNotificationContext } from '../contexts/NotificationStateContext'

export function useNotifications() {
  return useNotificationContext()
}
