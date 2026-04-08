const productRows = [
  { id: '1', sku: 'TS-001', name: 'Canvas Tote', status: 'Draft' },
  { id: '2', sku: 'LS-002', name: 'Linen Shirt', status: 'Published' },
]

export const adminProductApi = {
  getList: async () => productRows,
}
