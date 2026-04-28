import { useEffect, useState } from 'react'
import { Alert, Card, Descriptions, Tag, Timeline, Typography } from 'antd'
import Button from '../../../shared/ui/Button'
import { ROUTES } from '../../../shared/constants/routes'
import { navigateTo } from '../../../shared/lib/navigation'
import { formatCurrency } from '../../../shared/utils/formatCurrency'
import { formatDate } from '../../../shared/utils/formatDate'
import { handleApiError } from '../../../shared/utils/handleApiError'
import { orderApi } from '../api/order.api'

const { Paragraph, Title } = Typography

const CANCELLABLE_STATUSES = new Set(['PENDING', 'CONFIRMED'])

function OrderDetailPage({ orderId }) {
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [order, setOrder] = useState(null)

  useEffect(() => {
    let mounted = true

    orderApi
      .getById(orderId)
      .then((response) => {
        if (!mounted) {
          return
        }

        setOrder(response)
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
  }, [orderId])

  const handleCancel = async () => {
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      await orderApi.cancel(orderId)
      const nextOrder = await orderApi.getById(orderId)
      setOrder(nextOrder)
    } catch (error) {
      setErrorMessage(handleApiError(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <Alert type="info" message="Loading order details..." showIcon />
  }

  if (errorMessage && !order) {
    return (
      <section className="grid gap-4">
        <Alert type="error" message={errorMessage} showIcon />
        <div>
          <Button type="button" variant="secondary" onClick={() => navigateTo(ROUTES.orders)}>
            Back to orders
          </Button>
        </div>
      </section>
    )
  }

  if (!order) {
    return (
      <section className="grid gap-4">
        <Alert type="info" message="Order not found." showIcon />
        <div>
          <Button type="button" variant="secondary" onClick={() => navigateTo(ROUTES.orders)}>
            Back to orders
          </Button>
        </div>
      </section>
    )
  }

  const canCancel = CANCELLABLE_STATUSES.has(order.status)

  return (
    <section className="grid gap-8">
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="secondary" onClick={() => navigateTo(ROUTES.orders)}>
          Back to orders
        </Button>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
          #{order.id}
        </p>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
          Order detail
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
          {order.status}
        </h2>
        <p className="mt-2 text-sm text-stone-600">{formatDate(order.createdAt)}</p>
      </div>

      {errorMessage ? <Alert type="error" message={errorMessage} showIcon /> : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_320px]">
        <div className="grid gap-4">
          {order.items.map((item) => (
            <Card
              key={item.id || item.productId}
              className="grid gap-4 shadow-[0_20px_45px_rgba(63,39,18,0.08)] md:grid-cols-[96px_minmax(0,1fr)_140px]"
            >
              {item.product.imageUrl ? (
                <img
                  className="aspect-square w-24 rounded-xl object-cover"
                  src={item.product.imageUrl}
                  alt={item.product.name}
                />
              ) : (
                <div className="grid aspect-square w-24 place-items-center rounded-xl bg-stone-100 text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">
                  {item.product.category}
                </div>
              )}

              <div className="grid gap-2">
                <button
                  type="button"
                  className="w-fit text-left"
                  onClick={() => navigateTo(ROUTES.productDetail(item.productId))}
                >
                  <Title level={4} style={{ margin: 0 }}>{item.product.name}</Title>
                </button>
                <p className="text-sm text-stone-500">{item.product.category}</p>
              </div>

              <div className="grid gap-2 text-sm text-stone-600">
                <p>Qty: {item.quantity}</p>
                <p>Unit: {formatCurrency(item.unitPrice)}</p>
                <p className="font-semibold text-stone-900">
                  {formatCurrency(item.lineTotal)}
                </p>
              </div>
            </Card>
          ))}

          {order.statusLogs.length > 0 ? (
            <Card>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                  Status history
                </p>
                <h3 className="text-xl font-semibold text-stone-900">
                  Order timeline
                </h3>
              </div>

              <Timeline
                items={order.statusLogs.map((log, index) => ({
                  children: (
                    <div key={`${log.status}-${log.changedAt || index}`} className="grid gap-1">
                      <Tag color="gold">{log.status}</Tag>
                      <span className="text-xs text-stone-500">
                        {log.changedAt ? formatDate(log.changedAt) : 'N/A'}
                      </span>
                      {log.changedBy ? <Paragraph className="!mb-0 text-sm text-stone-600">Changed by: {log.changedBy}</Paragraph> : null}
                      {log.note ? <Paragraph className="!mb-0 text-sm text-stone-600">{log.note}</Paragraph> : null}
                    </div>
                  ),
                }))}
              />
            </Card>
          ) : null}
        </div>

        <Card>
          <Descriptions column={1} title="Order summary">
            <Descriptions.Item label="Items">{order.totalQuantity}</Descriptions.Item>
            <Descriptions.Item label="Subtotal">{formatCurrency(order.subtotal)}</Descriptions.Item>
            <Descriptions.Item label="Discount">{formatCurrency(order.discountAmount)}</Descriptions.Item>
            <Descriptions.Item label="Total">{formatCurrency(order.total)}</Descriptions.Item>
            {order.shippingName ? <Descriptions.Item label="Receiver">{order.shippingName}</Descriptions.Item> : null}
            {order.shippingPhone ? <Descriptions.Item label="Phone">{order.shippingPhone}</Descriptions.Item> : null}
            {order.shippingAddress ? <Descriptions.Item label="Address">{order.shippingAddress}</Descriptions.Item> : null}
            {order.note ? <Descriptions.Item label="Note">{order.note}</Descriptions.Item> : null}
            {order.couponCode ? <Descriptions.Item label="Coupon">{order.couponCode}</Descriptions.Item> : null}
          </Descriptions>
          <div className="pt-2">
            <Button
              type="button"
              variant="secondary"
              disabled={isSubmitting || !canCancel}
              onClick={handleCancel}
            >
              {isSubmitting ? 'Cancelling...' : 'Cancel order'}
            </Button>
            {!canCancel ? (
              <Alert
                className="mt-3"
                type="info"
                message="Orders can only be cancelled while they are pending or confirmed."
                showIcon
              />
            ) : null}
          </div>
        </Card>
      </div>
    </section>
  )
}

export default OrderDetailPage
