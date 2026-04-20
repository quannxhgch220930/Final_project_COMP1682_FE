import { formatCurrency } from '../../../shared/utils/formatCurrency'
import { ROUTES } from '../../../shared/constants/routes'
import { navigateTo } from '../../../shared/lib/navigation'
import Button from '../../../shared/ui/Button'
import { useCommerce } from '../../commerce/hooks/useCommerce'
import { useAuth } from '../../auth/hooks/useAuth'

function ProductCard({ product }) {
  const { addCartItem, isInWishlist, toggleWishlistItem } = useCommerce()
  const { isAuthenticated } = useAuth()
  const saved = isInWishlist(product.id)
  const requireAuth = (callback) => {
    if (!isAuthenticated) {
      navigateTo(ROUTES.login)
      return
    }

    callback()
  }

  return (
    <article className="rounded-2xl border border-stone-200 bg-white/85 shadow-[0_20px_45px_rgba(63,39,18,0.08)] backdrop-blur transition duration-200 hover:-translate-y-1">
      <button
        type="button"
        className="grid w-full gap-4 p-5 text-left"
        onClick={() => navigateTo(ROUTES.productDetail(product.id))}
      >
        {product.imageUrl ? (
          <img
            className="aspect-[4/3] w-full rounded-xl object-cover"
            src={product.imageUrl}
            alt={product.name}
          />
        ) : (
          <div className="grid aspect-[4/3] w-full place-items-center rounded-xl bg-[linear-gradient(135deg,rgba(153,88,42,0.18),rgba(111,69,24,0.08)),#f1e5d2] font-semibold text-[color:var(--color-primary-strong)]">
            <span>{product.category}</span>
          </div>
        )}

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
            {product.category}
          </p>
          <h3 className="text-xl font-semibold text-stone-900">{product.name}</h3>
          {product.description ? (
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-stone-600">
              {product.description}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <strong className="text-lg text-stone-900">{formatCurrency(product.price)}</strong>
          <p className="text-sm text-stone-500">
            Rating: {product.ratingAvg.toFixed(1)} ({product.ratingCount})
          </p>
        </div>
      </button>

      <div className="flex flex-wrap gap-3 px-5 pb-5">
        <Button type="button" onClick={() => requireAuth(() => addCartItem(product))}>
          Add to cart
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => requireAuth(() => toggleWishlistItem(product))}
        >
          {saved ? 'Saved' : 'Wishlist'}
        </Button>
      </div>
    </article>
  )
}

export default ProductCard
