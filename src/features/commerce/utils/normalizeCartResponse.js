function normalizeCartItemResponse(item) {
  return {
    id: String(item?.id ?? ''),
    product: {
      category: 'Product',
      id: String(item?.productId ?? ''),
      imageUrl: item?.productImage || '',
      name: item?.productName || 'Unnamed product',
      price: Number(item?.currentPrice ?? item?.priceSnap ?? 0),
      slug: item?.productSlug || '',
    },
    productId: String(item?.productId ?? ''),
    quantity: Number(item?.quantity ?? 0),
    subtotal: Number(item?.subtotal ?? 0),
    unitPrice: Number(item?.currentPrice ?? item?.priceSnap ?? 0),
  }
}

export function normalizeCartResponse(response) {
  return {
    id: String(response?.id ?? ''),
    items: Array.isArray(response?.items)
      ? response.items.map(normalizeCartItemResponse)
      : [],
    totalAmount: Number(response?.totalAmount ?? 0),
    totalItems: Number(response?.totalItems ?? 0),
  }
}
