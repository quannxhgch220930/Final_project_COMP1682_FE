export function normalizeProductResponse(product) {
  if (!product) {
    return null
  }

  const images = [...(product.images || [])]
    .sort((left, right) => {
      const leftPrimary = left?.isPrimary ? 1 : 0
      const rightPrimary = right?.isPrimary ? 1 : 0

      if (leftPrimary !== rightPrimary) {
        return rightPrimary - leftPrimary
      }

      return Number(left?.sortOrder ?? 0) - Number(right?.sortOrder ?? 0)
    })
    .map((image) => ({
      id: String(image?.id ?? ''),
      isPrimary: Boolean(image?.isPrimary),
      sortOrder: Number(image?.sortOrder ?? 0),
      url: image?.imageUrl || image?.url || image?.path || '',
    }))

  const primaryImage = images[0]
  const imageUrls = images.map((image) => image.url).filter(Boolean)

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
      primaryImage?.url || '',
    images,
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
