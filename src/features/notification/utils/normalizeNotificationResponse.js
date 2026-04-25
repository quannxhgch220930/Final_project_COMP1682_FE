export function normalizeNotificationResponse(notification) {
  return {
    body: notification?.body || '',
    createdAt: notification?.createdAt || null,
    id: String(notification?.id ?? ''),
    isRead: Boolean(notification?.isRead),
    refId:
      notification?.refId === null || notification?.refId === undefined
        ? ''
        : String(notification.refId),
    title: notification?.title || 'Notification',
    type: notification?.type || 'GENERAL',
  }
}
