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
const CREATED_ORDER_NOTES = new Set([
  'Order has been created',
  'Order created',
])

function getOrderTimelineNote(log) {
  if (!log?.note) {
    return ''
  }

  if (CREATED_ORDER_NOTES.has(log.note) && log.status === 'PENDING') {
    return 'Please wait for a moment while we confirming your order'
  }

  return log.note
}

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
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-stone-700">
          Order detail
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
          {order.status}
        </h2>
      </div>

      {errorMessage ? <Alert type="error" message={errorMessage} showIcon /> : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_320px]">
        <div className="grid gap-4">
          {order.items.map((item) => (
            <Card
            key={item.id || item.productId}
            className="shadow-[0_12px_30px_rgba(0,0,0,0.06)] rounded-2xl"
            bodyStyle={{ padding: '16px' }}
          >
            <div className="flex gap-4">

              {/* IMAGE */}
              <div className="w-20 h-20 flex-shrink-0">
                {item.product.imageUrl ? (
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-stone-200 rounded-xl text-xs font-semibold text-stone-600 text-center px-1">
                    {item.product.category}
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="flex flex-1 justify-between gap-4 min-w-0">

                {/* LEFT */}
                <div className="flex flex-col gap-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => navigateTo(ROUTES.productDetail(item.productId))}
                    className="text-left"
                  >
                    <Title level={5} className="!mb-0 truncate">
                      {item.product.name}
                    </Title>
                  </button>

                  <span className="text-sm text-stone-500">
                    {item.product.category}
                  </span>

                  <span className="text-sm text-stone-600">
                    Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                  </span>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col justify-between items-end">
                  <span className="text-base font-semibold text-stone-900 whitespace-nowrap">
                    {formatCurrency(item.lineTotal)}
                  </span>
                </div>

              </div>
            </div>
          </Card>
          ))}

          {order.statusLogs.length > 0 ? (
            <Card>
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-stone-700">
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
                      <span className="text-xs font-medium text-stone-700">
                        {log.changedAt ? formatDate(log.changedAt) : 'N/A'}
                      </span>
                      {log.changedBy ? <Paragraph className="!mb-0 text-sm font-medium text-stone-700">Changed by: {log.changedBy}</Paragraph> : null}
                      {getOrderTimelineNote(log) ? <Paragraph className="!mb-0 text-sm font-medium text-stone-700">{getOrderTimelineNote(log)}</Paragraph> : null}
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
            {order.paymentMethod ? <Descriptions.Item label="Payment Method">{order.paymentMethod}</Descriptions.Item> : null}
            {order.paymentStatus ? <Descriptions.Item label="Payment Status">{order.paymentStatus}</Descriptions.Item> : null}
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
          </div>
        </Card>
      </div>
    </section>
  )
}

export default OrderDetailPage