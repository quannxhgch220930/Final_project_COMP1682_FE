import { useEffect, useState } from 'react'
import Button from '../../../shared/ui/Button'
import { ROUTES } from '../../../shared/constants/routes'
import { navigateTo } from '../../../shared/lib/navigation'
import { formatCurrency } from '../../../shared/utils/formatCurrency'
import { formatDate } from '../../../shared/utils/formatDate'
import { handleApiError } from '../../../shared/utils/handleApiError'
import { orderApi } from '../api/order.api'

function OrdersPage() {
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    let mounted = true

    orderApi
      .getList()
      .then((response) => {
        if (!mounted) {
          return
        }

        setOrders(response.items)
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
  }, [])

  if (isLoading) {
    return <p className="text-sm text-stone-500">Loading orders...</p>
  }

  if (errorMessage) {
    return <p className="text-sm text-rose-600">{errorMessage}</p>
  }

  if (orders.length === 0) {
    return (
      <section className="grid gap-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Orders
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
            No orders yet
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Place your first order from the cart to start building order history.
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
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
          Orders
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
          Order history
        </h2>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <article
            key={order.id}
            className="grid gap-4 rounded-2xl border border-stone-200 bg-white/85 p-5 shadow-[0_20px_45px_rgba(63,39,18,0.08)] backdrop-blur md:grid-cols-[minmax(0,1fr)_auto]"
          >
            <div className="grid gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                #{order.id}
              </p>
              <h3 className="text-xl font-semibold text-stone-900">
                {order.totalQuantity} items
              </h3>
              <p className="text-sm text-stone-600">
                {formatDate(order.createdAt)} | {order.status}
              </p>
              <p className="text-sm text-stone-600">
                Total: <strong className="text-stone-900">{formatCurrency(order.total)}</strong>
              </p>
            </div>

            <div className="flex items-center">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigateTo(ROUTES.orderDetail(order.id))}
              >
                View details
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default OrdersPage
