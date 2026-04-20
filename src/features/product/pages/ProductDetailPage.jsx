import { useEffect, useState } from 'react'
import Button from '../../../shared/ui/Button'
import { ROUTES } from '../../../shared/constants/routes'
import { navigateTo } from '../../../shared/lib/navigation'
import { formatCurrency } from '../../../shared/utils/formatCurrency'
import { handleApiError } from '../../../shared/utils/handleApiError'
import { productApi } from '../api/product.api'
import { useCommerce } from '../../commerce/hooks/useCommerce'
import { useAuth } from '../../auth/hooks/useAuth'

function ProductDetailPage({ productId }) {
  const { addCartItem, isInWishlist, toggleWishlistItem } = useCommerce()
  const { isAuthenticated } = useAuth()
  const [activeImageUrl, setActiveImageUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [product, setProduct] = useState(null)

  useEffect(() => {
    let mounted = true

    productApi
      .getById(productId)
      .then((response) => {
        if (!mounted) {
          return
        }

        setProduct(response)
        setActiveImageUrl(response.imageUrl || response.imageUrls?.[0] || '')
      })
      .catch((error) => {
        if (!mounted) {
          return
        }

        setErrorMessage(handleApiError(error))
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [productId])

  if (isLoading) {
    return <p className="text-sm text-stone-500">Loading product details...</p>
  }

  if (errorMessage) {
    return (
      <section className="grid gap-4">
        <p className="text-sm text-rose-600">{errorMessage}</p>
        <div>
          <Button type="button" variant="secondary" onClick={() => navigateTo(ROUTES.home)}>
            Back to storefront
          </Button>
        </div>
      </section>
    )
  }

  if (!product) {
    return (
      <section className="grid gap-4">
        <p className="text-sm text-stone-500">Product not found.</p>
        <div>
          <Button type="button" variant="secondary" onClick={() => navigateTo(ROUTES.home)}>
            Back to storefront
          </Button>
        </div>
      </section>
    )
  }

  const galleryImages = product.imageUrls?.length
    ? product.imageUrls
    : product.imageUrl
      ? [product.imageUrl]
      : []
  const saved = isInWishlist(product.id)
  const requireAuth = (callback) => {
    if (!isAuthenticated) {
      navigateTo(ROUTES.login)
      return
    }

    callback()
  }

  return (
    <section className="grid gap-8">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          className="bg-white/80"
          onClick={() => navigateTo(ROUTES.home)}
        >
          Back to storefront
        </Button>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
          {product.category}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_420px] lg:items-start">
        <div className="grid gap-4">
          {activeImageUrl ? (
            <img
              className="aspect-[4/3] w-full rounded-[32px] border border-stone-200 bg-stone-50 object-cover shadow-[0_20px_45px_rgba(63,39,18,0.08)]"
              src={activeImageUrl}
              alt={product.name}
            />
          ) : (
            <div className="grid aspect-[4/3] w-full place-items-center rounded-[32px] border border-stone-200 bg-[radial-gradient(circle_at_top,rgba(153,88,42,0.16),transparent_26%),linear-gradient(135deg,#f6ecdf_0%,#ead5bc_100%)] p-8 shadow-[0_20px_45px_rgba(63,39,18,0.08)]">
              <div className="grid gap-3 text-center">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                  {product.category}
                </span>
                <span className="text-4xl font-semibold tracking-tight text-[color:var(--color-primary-strong)]">
                  {product.name}
                </span>
                <span className="text-sm text-stone-600">
                  Product image is not available yet.
                </span>
              </div>
            </div>
          )}

          {galleryImages.length > 1 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {galleryImages.map((imageUrl) => (
                <button
                  key={imageUrl}
                  type="button"
                  className={`overflow-hidden rounded-2xl border bg-white shadow-[0_10px_25px_rgba(63,39,18,0.06)] transition ${
                    activeImageUrl === imageUrl
                      ? 'border-stone-900 ring-2 ring-stone-900/10'
                      : 'border-stone-200'
                  }`}
                  onClick={() => setActiveImageUrl(imageUrl)}
                >
                  <img
                    className="aspect-square w-full object-cover"
                    src={imageUrl}
                    alt={`${product.name} preview`}
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="grid gap-5 rounded-[32px] border border-stone-200 bg-white/78 p-6 shadow-[0_24px_55px_rgba(63,39,18,0.08)] backdrop-blur">
          <div className="grid gap-4 border-b border-stone-200 pb-5">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                Product detail
              </p>
              <span
                className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                  product.isActive
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {product.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="grid gap-3">
              <h2 className="text-4xl font-semibold tracking-tight text-stone-900">
                {product.name}
              </h2>
              <p className="text-2xl font-semibold text-[color:var(--color-primary-strong)]">
                {formatCurrency(product.price)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-stone-200 bg-stone-50/80 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.14em] text-stone-500">Rating</p>
                <strong className="mt-1 block text-lg text-stone-900">
                  {product.ratingAvg.toFixed(1)}
                </strong>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-stone-50/80 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.14em] text-stone-500">Reviews</p>
                <strong className="mt-1 block text-lg text-stone-900">
                  {product.ratingCount}
                </strong>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-stone-50/80 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.14em] text-stone-500">Stock</p>
                <strong className="mt-1 block text-lg text-stone-900">
                  {product.stock}
                </strong>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              className="min-w-[160px]"
              onClick={() => requireAuth(() => addCartItem(product))}
            >
              Add to cart
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="min-w-[180px] bg-white"
              onClick={() => requireAuth(() => toggleWishlistItem(product))}
            >
              {saved ? 'Remove from wishlist' : 'Save to wishlist'}
            </Button>
          </div>

          <div className="grid gap-3 rounded-[28px] border border-stone-200 bg-stone-50/70 p-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-stone-500">Category</span>
              <strong className="text-stone-900">{product.category}</strong>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-stone-500">Stock</span>
              <strong className="text-stone-900">{product.stock}</strong>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-stone-500">Rating</span>
              <strong className="text-stone-900">
                {product.ratingAvg.toFixed(1)} / 5 ({product.ratingCount})
              </strong>
            </div>
            {product.slug ? (
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-stone-500">Slug</span>
                <strong className="break-all text-stone-900">{product.slug}</strong>
              </div>
            ) : null}
          </div>

          <div className="grid gap-3">
            <h3 className="text-xl font-semibold text-stone-900">Description</h3>
            <p className="text-sm leading-7 text-stone-600">
              {product.description || 'No description available for this product yet.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductDetailPage
