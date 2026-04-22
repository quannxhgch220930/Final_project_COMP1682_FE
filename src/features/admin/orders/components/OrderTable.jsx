import Button from '../../../../shared/ui/Button'
import Table from '../../../../shared/ui/Table'
import { formatCurrency } from '../../../../shared/utils/formatCurrency'
import { formatDate } from '../../../../shared/utils/formatDate'

const STATUS_OPTIONS = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPING',
  'DELIVERED',
  'CANCELLED',
]

function createColumns({
  actionOrderId,
  onStatusDraftChange,
  onUpdateStatus,
  statusDrafts,
}) {
  return [
    { key: 'id', label: 'Order ID', render: (order) => `#${order.id}` },
    { key: 'shippingName', label: 'Customer' },
    { key: 'shippingPhone', label: 'Phone' },
    {
      key: 'createdAt',
      label: 'Created',
      render: (order) => (order.createdAt ? formatDate(order.createdAt) : 'N/A'),
    },
    {
      key: 'totalQuantity',
      label: 'Items',
      render: (order) => order.totalQuantity,
    },
    {
      key: 'total',
      label: 'Total',
      render: (order) => formatCurrency(order.total),
    },
    { key: 'status', label: 'Current status' },
    {
      key: 'actions',
      label: 'Actions',
      render: (order) => {
        const isBusy = actionOrderId === order.id
        const selectedStatus = statusDrafts[order.id] || order.status

        return (
          <div className="flex min-w-[260px] flex-wrap items-center gap-2">
            <select
              className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
              disabled={isBusy}
              value={selectedStatus}
              onChange={(event) => onStatusDraftChange(order.id, event.target.value)}
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="secondary"
              disabled={isBusy || selectedStatus === order.status}
              onClick={() => onUpdateStatus(order, selectedStatus)}
            >
              {isBusy ? 'Updating...' : 'Update status'}
            </Button>
          </div>
        )
      },
    },
  ]
}

function OrderTable(props) {
  return (
    <Table
      bodyCellClassName="px-3 py-3 align-top text-stone-950"
      columns={createColumns(props)}
      containerClassName="border-amber-200/35 bg-[rgba(250,246,240,0.96)]"
      data={props.orders}
      emptyClassName="px-3 py-6 text-center text-stone-600"
      headCellClassName="px-3 py-3 font-semibold uppercase tracking-[0.14em]"
      headRowClassName="border-b border-stone-300/70 text-stone-700"
      rowClassName="border-b border-stone-200/80 last:border-b-0"
    />
  )
}

export default OrderTable
