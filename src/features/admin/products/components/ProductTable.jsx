import Table from '../../../../shared/ui/Table'

const columns = [
  { key: 'sku', label: 'SKU' },
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status' },
]

function ProductTable({ products }) {
  return <Table columns={columns} data={products} />
}

export default ProductTable
