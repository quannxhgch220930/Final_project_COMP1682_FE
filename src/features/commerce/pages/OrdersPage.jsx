import { useEffect, useState } from 'react'
import { Alert, Card, Tag, Typography } from 'antd'
import Button from '../../../shared/ui/Button'
import { ROUTES } from '../../../shared/constants/routes'
import { navigateTo } from '../../../shared/lib/navigation'
import { formatCurrency } from '../../../shared/utils/formatCurrency'
import { formatDate } from '../../../shared/utils/formatDate'
import { handleApiError } from '../../../shared/utils/handleApiError'
import { orderApi } from '../api/order.api'

const { Paragraph, Title } = Typography

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
    return <Alert type="info" message="Loading orders..." showIcon />
  }

  if (errorMessage) {
    return <Alert type="error" message={errorMessage} showIcon />
  }

  if (orders.length === 0) {
    return (
      <section className="grid gap-5">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-stone-700">
            Orders
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
            No orders yet
          </h2>
          <p className="mt-2 text-sm font-medium text-stone-700">
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
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-stone-700">
          Orders
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
          Order history
        </h2>
        <p className="mt-2 text-sm font-medium text-stone-700">
          Track the status and value of every order you have placed.
        </p>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <Card
            key={order.id}
            className="grid gap-4 shadow-[0_22px_50px_rgba(63,39,18,0.08)] md:grid-cols-[minmax(0,1fr)_auto]"
          >
            <div className="grid gap-2">
              <Title level={4} style={{ margin: 0 }}>
                {order.totalQuantity} items
              </Title>
              <Paragraph className="!mb-0 text-sm font-medium text-stone-700">
                {formatDate(order.createdAt)} | {order.status}
              </Paragraph>
              <Paragraph className="!mb-0 text-sm font-medium text-stone-700">
                Total: <strong className="text-stone-900">{formatCurrency(order.total)}</strong>
              </Paragraph>
              <Tag color="gold">{order.status}</Tag>
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
          </Card>
        ))}
      </div>
    </section>
  )
}

export default OrdersPage
