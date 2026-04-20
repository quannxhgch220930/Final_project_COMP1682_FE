import Button from '../../../shared/ui/Button'
import { ROUTES } from '../../../shared/constants/routes'
import { navigateTo } from '../../../shared/lib/navigation'
import { formatCurrency } from '../../../shared/utils/formatCurrency'
import { useCommerce } from '../hooks/useCommerce'

function WishlistPage() {
  const { addCartItem, removeWishlistItem, wishlistItems } = useCommerce()

  if (wishlistItems.length === 0) {
    return (
      <section className="grid gap-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Wishlist
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
            No saved products yet
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Save products from the storefront to compare them later.
          </p>
        </div>
        <div>
          <Button type="button" onClick={() => navigateTo(ROUTES.home)}>
            Browse products
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="grid gap-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
          Wishlist
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
          Saved products
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {wishlistItems.map((product) => (
          <article
            key={product.productId}
            className="grid gap-4 rounded-2xl border border-stone-200 bg-white/85 p-5 shadow-[0_20px_45px_rgba(63,39,18,0.08)] backdrop-blur"
          >
            {product.imageUrl ? (
              <img
                className="aspect-[4/3] w-full rounded-xl object-cover"
                src={product.imageUrl}
                alt={product.name}
              />
            ) : (
              <div className="grid aspect-[4/3] w-full place-items-center rounded-xl bg-stone-100 text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">
                {product.category}
              </div>
            )}

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                {product.category}
              </p>
              <button
                type="button"
                className="text-left"
                onClick={() => navigateTo(ROUTES.productDetail(product.productId))}
              >
                <h3 className="text-xl font-semibold text-stone-900">{product.name}</h3>
              </button>
            </div>

            <p className="text-lg font-semibold text-stone-900">
              {formatCurrency(product.price)}
            </p>

            <div className="flex flex-wrap gap-3">
              <Button type="button" onClick={() => addCartItem(product)}>
                Add to cart
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => removeWishlistItem(product.productId)}
              >
                Remove
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default WishlistPage
