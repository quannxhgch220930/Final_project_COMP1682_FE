export function normalizeProductResponse(product) {
  if (!product) {
    return null
  }

  const primaryImage = product.images?.[0]
  const imageUrls = (product.images || [])
    .map((image) => image?.imageUrl || image?.url || image?.path || '')
    .filter(Boolean)

  return {
    ...product,
    categoryId: product.category?.id ?? product.categoryId ?? null,
    category:
      product.categoryName ||
      product.category?.name ||
      product.category ||
      'Uncategorized',
    description: product.description || '',
    id: String(product.id),
    imageUrl:
      primaryImage?.imageUrl ||
      primaryImage?.url ||
      primaryImage?.path ||
      '',
    imageUrls,
    isActive: product.isActive ?? true,
    name: product.name || product.productName || 'Unnamed product',
    price: Number(product.price ?? product.minPrice ?? 0),
    ratingAvg: Number(product.ratingAvg ?? 0),
    ratingCount: Number(product.ratingCount ?? 0),
    slug: product.slug || '',
    stock: Number(product.stock ?? 0),
  }
}
