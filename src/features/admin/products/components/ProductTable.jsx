import { Tag } from 'antd'
import Table from '../../../../shared/ui/Table'
import Button from '../../../../shared/ui/Button'
import { formatCurrency } from '../../../../shared/utils/formatCurrency'

function createColumns({ actionProductId, onDelete, onEdit }) {
  return [
    { key: 'name', label: 'Product' },
    { key: 'category', label: 'Category' },
    {
      key: 'price',
      label: 'Price',
      render: (product) => formatCurrency(product.price),
    },
    { key: 'stock', label: 'Stock' },
    {
      key: 'isActive',
      label: 'Status',
      render: (product) => <Tag color={product.isActive ? 'green' : 'default'}>{product.isActive ? 'Active' : 'Inactive'}</Tag>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (product) => {
        const isBusy = actionProductId === product.id

        return (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={isBusy}
              onClick={() => onEdit(product)}
            >
              Edit
            </Button>
            <Button
              type="button"
              disabled={isBusy}
              onClick={() => onDelete(product)}
            >
              Delete
            </Button>
          </div>
        )
      },
    },
  ]
}

function ProductTable(props) {
  return (
    <Table
      bodyCellClassName="px-3 py-3 align-top text-stone-950"
      columns={createColumns(props)}
      containerClassName="border-amber-200/35 bg-[rgba(250,246,240,0.96)]"
      data={props.products}
      emptyClassName="px-3 py-6 text-center text-stone-600"
      headCellClassName="px-3 py-3 font-semibold uppercase tracking-[0.14em]"
      headRowClassName="border-b border-stone-300/70 text-stone-700"
      rowClassName="border-b border-stone-200/80 last:border-b-0"
    />
  )
}

export default ProductTable
