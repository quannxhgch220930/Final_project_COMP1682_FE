function normalizeWishlistItemResponse(item) {
  return {
    addedAt: item?.addedAt || null,
    category: 'Saved product',
    id: String(item?.productId ?? item?.id ?? ''),
    imageUrl: item?.productImage || '',
    isActive: item?.isActive ?? true,
    name: item?.productName || 'Unnamed product',
    price: Number(item?.price ?? 0),
    productId: String(item?.productId ?? ''),
    slug: item?.productSlug || '',
    stock: Number(item?.stock ?? 0),
  }
}

export function normalizeWishlistListResponse(response) {
  const items = Array.isArray(response?.content) ? response.content : []

  return {
    items: items.map(normalizeWishlistItemResponse),
    page: response?.page ?? 0,
    size: response?.size ?? items.length,
    totalElements: response?.totalElements ?? items.length,
    totalPages: response?.totalPages ?? 1,
  }
}
