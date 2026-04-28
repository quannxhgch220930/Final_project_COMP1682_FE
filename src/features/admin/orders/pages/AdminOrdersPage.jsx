import { useCallback, useEffect, useState } from 'react'
import { Alert, Card, Select } from 'antd'
import Button from '../../../../shared/ui/Button'
import { handleApiError } from '../../../../shared/utils/handleApiError'
import { adminOrderApi } from '../api/adminOrder.api'
import OrderTable from '../components/OrderTable'

function AdminOrdersPage() {
  const [actionOrderId, setActionOrderId] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [pageState, setPageState] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 1,
  })
  const [statusDrafts, setStatusDrafts] = useState({})
  const [statusFilter, setStatusFilter] = useState('')

  const loadOrders = useCallback(
    async (page = pageState.page, filter = statusFilter) => {
      setIsLoading(true)

      try {
        const response = await adminOrderApi.getList({
          page,
          size: pageState.size,
          status: filter,
        })

        setOrders(response.items)
        setPageState({
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
        })
        setErrorMessage('')
      } catch (error) {
        setErrorMessage(handleApiError(error))
      } finally {
        setIsLoading(false)
      }
    },
    [pageState.page, pageState.size, statusFilter],
  )

  useEffect(() => {
    loadOrders(0, statusFilter)
  }, [loadOrders, statusFilter])

  const handleStatusDraftChange = (orderId, status) => {
    setStatusDrafts((current) => ({
      ...current,
      [orderId]: status,
    }))
  }

  const handleUpdateStatus = async (order, nextStatus) => {
    const note = window.prompt(
      `Optional note for order #${order.id} status change to ${nextStatus}:`,
      '',
    )

    if (note === null) {
      return
    }

    setActionOrderId(order.id)

    try {
      await adminOrderApi.updateStatus(order.id, {
        note,
        status: nextStatus,
      })

      await loadOrders(pageState.page, statusFilter)
    } catch (error) {
      setErrorMessage(handleApiError(error))
    } finally {
      setActionOrderId(null)
    }
  }

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="mb-2">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100/70">
            Order Management
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-stone-50">
            Admin orders
          </h2>
          <p className="mt-2 text-sm text-stone-300">
            Review customer orders and update their backend status.
          </p>
          <p className="mt-1 text-sm text-stone-400">
            {pageState.totalElements} orders total, page {pageState.page + 1} /{' '}
            {Math.max(pageState.totalPages, 1)}
          </p>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium text-stone-200" htmlFor="admin-order-status-filter">
            Filter by status
          </label>
          <Select
            id="admin-order-status-filter"
            className="min-w-[220px]"
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value)
              setPageState((current) => ({
                ...current,
                page: 0,
              }))
            }}
            options={[
              { label: 'All statuses', value: '' },
              { label: 'PENDING', value: 'PENDING' },
              { label: 'CONFIRMED', value: 'CONFIRMED' },
              { label: 'PROCESSING', value: 'PROCESSING' },
              { label: 'SHIPPING', value: 'SHIPPING' },
              { label: 'DELIVERED', value: 'DELIVERED' },
              { label: 'CANCELLED', value: 'CANCELLED' },
            ]}
          />
        </div>
      </div>

      {errorMessage ? <Alert type="error" message={errorMessage} showIcon /> : null}
      {isLoading ? <Alert type="info" message="Loading orders..." showIcon /> : null}
      <OrderTable
        actionOrderId={actionOrderId}
        onStatusDraftChange={handleStatusDraftChange}
        onUpdateStatus={handleUpdateStatus}
        orders={orders}
        statusDrafts={statusDrafts}
      />

      <Card>
        <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="secondary"
          className="border-amber-200/15 bg-amber-200/8 text-stone-100 hover:bg-amber-200/14"
          disabled={isLoading || pageState.page === 0}
          onClick={() => loadOrders(pageState.page - 1, statusFilter)}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="border-amber-200/15 bg-amber-200/8 text-stone-100 hover:bg-amber-200/14"
          disabled={
            isLoading || pageState.page >= Math.max(pageState.totalPages - 1, 0)
          }
          onClick={() => loadOrders(pageState.page + 1, statusFilter)}
        >
          Next
        </Button>
        </div>
      </Card>
    </section>
  )
}

export default AdminOrdersPage
