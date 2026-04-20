function normalizeOrderItemResponse(item) {
  return {
    id: String(item?.id ?? item?.productId ?? ''),
    lineTotal: Number(item?.subtotal ?? 0),
    product: {
      category: 'Ordered product',
      id: String(item?.productId ?? ''),
      imageUrl: '',
      name: item?.productName || 'Unnamed product',
      price: Number(item?.unitPrice ?? 0),
      slug: '',
    },
    productId: String(item?.productId ?? ''),
    quantity: Number(item?.quantity ?? 0),
    unitPrice: Number(item?.unitPrice ?? 0),
  }
}

function normalizeStatusLogResponse(log) {
  return {
    changedAt: log?.createdAt || null,
    changedBy: log?.changedBy || '',
    note: log?.note || '',
    status: log?.status || '',
  }
}

export function normalizeOrderResponse(order) {
  return {
    couponCode: order?.couponCode || '',
    createdAt: order?.createdAt || null,
    discountAmount: Number(order?.discountAmount ?? 0),
    id: String(order?.id ?? ''),
    items: Array.isArray(order?.items) ? order.items.map(normalizeOrderItemResponse) : [],
    note: order?.note || '',
    shippingAddress: order?.shippingAddress || '',
    shippingName: order?.shippingName || '',
    shippingPhone: order?.shippingPhone || '',
    status: order?.status || 'PENDING',
    statusLogs: Array.isArray(order?.statusLogs)
      ? order.statusLogs.map(normalizeStatusLogResponse)
      : [],
    subtotal: Number(order?.subtotal ?? 0),
    total: Number(order?.total ?? 0),
    totalQuantity: Array.isArray(order?.items)
      ? order.items.reduce((sum, item) => sum + Number(item?.quantity ?? 0), 0)
      : 0,
    updatedAt: order?.updatedAt || null,
  }
}
