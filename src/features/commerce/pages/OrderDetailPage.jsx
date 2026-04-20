import { useEffect, useState } from 'react'
import Button from '../../../shared/ui/Button'
import { ROUTES } from '../../../shared/constants/routes'
import { navigateTo } from '../../../shared/lib/navigation'
import { formatCurrency } from '../../../shared/utils/formatCurrency'
import { formatDate } from '../../../shared/utils/formatDate'
import { handleApiError } from '../../../shared/utils/handleApiError'
import { orderApi } from '../api/order.api'

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
    return <p className="text-sm text-stone-500">Loading order details...</p>
  }

  if (errorMessage && !order) {
    return (
      <section className="grid gap-4">
        <p className="text-sm text-rose-600">{errorMessage}</p>
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
        <p className="text-sm text-stone-500">Order not found.</p>
        <div>
          <Button type="button" variant="secondary" onClick={() => navigateTo(ROUTES.orders)}>
            Back to orders
          </Button>
        </div>
      </section>
    )
  }

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

      {errorMessage ? <p className="text-sm text-rose-600">{errorMessage}</p> : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_320px]">
        <div className="grid gap-4">
          {order.items.map((item) => (
            <article
              key={item.id || item.productId}
              className="grid gap-4 rounded-2xl border border-stone-200 bg-white/85 p-5 shadow-[0_20px_45px_rgba(63,39,18,0.08)] backdrop-blur md:grid-cols-[96px_minmax(0,1fr)_140px]"
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
                  <h3 className="text-lg font-semibold text-stone-900">
                    {item.product.name}
                  </h3>
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
            </article>
          ))}

          {order.statusLogs.length > 0 ? (
            <section className="grid gap-4 rounded-2xl border border-stone-200 bg-white/85 p-5 shadow-[0_20px_45px_rgba(63,39,18,0.08)] backdrop-blur">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                  Status history
                </p>
                <h3 className="text-xl font-semibold text-stone-900">
                  Order timeline
                </h3>
              </div>

              <div className="grid gap-3">
                {order.statusLogs.map((log, index) => (
                  <div
                    key={`${log.status}-${log.changedAt || index}`}
                    className="grid gap-1 rounded-2xl border border-stone-200 bg-stone-50/80 px-4 py-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <strong className="text-sm uppercase tracking-[0.14em] text-stone-900">
                        {log.status}
                      </strong>
                      <span className="text-xs text-stone-500">
                        {log.changedAt ? formatDate(log.changedAt) : 'N/A'}
                      </span>
                    </div>
                    {log.changedBy ? (
                      <p className="text-sm text-stone-600">
                        Changed by: {log.changedBy}
                      </p>
                    ) : null}
                    {log.note ? <p className="text-sm text-stone-600">{log.note}</p> : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="grid gap-3 rounded-2xl border border-stone-200 bg-white/85 p-5 shadow-[0_20px_45px_rgba(63,39,18,0.08)] backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-stone-500">Items</span>
            <strong className="text-stone-900">{order.totalQuantity}</strong>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-stone-500">Subtotal</span>
            <strong className="text-stone-900">{formatCurrency(order.subtotal)}</strong>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-stone-500">Discount</span>
            <strong className="text-stone-900">
              {formatCurrency(order.discountAmount)}
            </strong>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-stone-500">Total</span>
            <strong className="text-stone-900">{formatCurrency(order.total)}</strong>
          </div>
          {order.shippingName ? (
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-stone-500">Receiver</span>
              <strong className="text-stone-900">{order.shippingName}</strong>
            </div>
          ) : null}
          {order.shippingPhone ? (
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-stone-500">Phone</span>
              <strong className="text-stone-900">{order.shippingPhone}</strong>
            </div>
          ) : null}
          {order.shippingAddress ? (
            <div className="grid gap-1">
              <span className="text-sm text-stone-500">Address</span>
              <strong className="text-stone-900">{order.shippingAddress}</strong>
            </div>
          ) : null}
          {order.note ? (
            <div className="grid gap-1">
              <span className="text-sm text-stone-500">Note</span>
              <strong className="text-stone-900">{order.note}</strong>
            </div>
          ) : null}
          {order.couponCode ? (
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-stone-500">Coupon</span>
              <strong className="text-stone-900">{order.couponCode}</strong>
            </div>
          ) : null}
          <div className="pt-2">
            <Button
              type="button"
              variant="secondary"
              disabled={isSubmitting || order.status === 'CANCELLED'}
              onClick={handleCancel}
            >
              {isSubmitting ? 'Cancelling...' : 'Cancel order'}
            </Button>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default OrderDetailPage
