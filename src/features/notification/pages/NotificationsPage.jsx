import { useEffect, useState } from 'react'
import Button from '../../../shared/ui/Button'
import { ROUTES } from '../../../shared/constants/routes'
import { navigateTo } from '../../../shared/lib/navigation'
import { formatDate } from '../../../shared/utils/formatDate'
import { handleApiError } from '../../../shared/utils/handleApiError'
import { notificationApi } from '../api/notification.api'
import { useNotifications } from '../hooks/useNotifications'

function getNotificationTypeLabel(type) {
  switch (type) {
    case 'ORDER':
      return 'Order'
    case 'COUPON':
      return 'Coupon'
    case 'WISHLIST':
      return 'Wishlist'
    case 'SYSTEM':
      return 'System'
    default:
      return type || 'Notification'
  }
}

function getNotificationAction(notification) {
  switch (notification.type) {
    case 'ORDER':
      return notification.refId
        ? {
            label: 'View order',
            target: ROUTES.orderDetail(notification.refId),
          }
        : null
    case 'COUPON':
      return {
        label: 'Open cart',
        target: ROUTES.cart,
      }
    case 'WISHLIST':
      return {
        label: 'Open wishlist',
        target: ROUTES.wishlist,
      }
    default:
      return null
  }
}

function NotificationsPage() {
  const { markAllNotificationsRead, syncUnreadCount, unreadCount } = useNotifications()
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    let mounted = true

    notificationApi
      .getList()
      .then((response) => {
        if (!mounted) {
          return
        }

        setNotifications(response.items)
        syncUnreadCount().catch(() => {})
      })
      .catch((error) => {
        if (!mounted) {
          return
        }

        setErrorMessage(handleApiError(error))
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [syncUnreadCount])

  const handleMarkAllRead = async () => {
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await markAllNotificationsRead()
      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      )
    } catch (error) {
      setErrorMessage(handleApiError(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const openNotificationTarget = (notification) => {
    const action = getNotificationAction(notification)

    if (action?.target) {
      navigateTo(action.target)
    }
  }

  if (isLoading) {
    return <p className="text-sm text-stone-500">Loading notifications...</p>
  }

  if (errorMessage) {
    return <p className="text-sm text-rose-600">{errorMessage}</p>
  }

  if (notifications.length === 0) {
    return (
      <section className="grid gap-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Notifications
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
            No notifications yet
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Notifications from orders and account activity will appear here.
          </p>
        </div>
        <div>
          <Button type="button" onClick={() => navigateTo(ROUTES.home)}>
            Browse products
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Notifications
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
            Inbox
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}.
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          disabled={isSubmitting || unreadCount === 0}
          onClick={handleMarkAllRead}
        >
          {isSubmitting ? 'Updating...' : 'Mark all as read'}
        </Button>
      </div>

      <div className="grid gap-4">
        {notifications.map((notification) => {
          const action = getNotificationAction(notification)

          return (
            <article
              key={notification.id}
              className={`grid gap-3 rounded-2xl border p-5 shadow-[0_20px_45px_rgba(63,39,18,0.08)] backdrop-blur ${
                notification.isRead
                  ? 'border-stone-200 bg-white/80'
                  : 'border-amber-200 bg-amber-50/90'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="grid gap-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                    {getNotificationTypeLabel(notification.type)}
                  </p>
                  <h3 className="text-xl font-semibold text-stone-900">
                    {notification.title}
                  </h3>
                </div>
                <span className="text-sm text-stone-500">
                  {notification.createdAt ? formatDate(notification.createdAt) : 'N/A'}
                </span>
              </div>

              <p className="text-sm text-stone-700">{notification.body}</p>

              {action ? (
                <div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => openNotificationTarget(notification)}
                  >
                    {action.label}
                  </Button>
                </div>
              ) : null}
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default NotificationsPage
