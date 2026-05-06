import { Card, Tag } from 'antd'
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
    <Card
      hoverable
      className="group h-full overflow-hidden rounded-3xl border-stone-300 bg-white shadow-[0_18px_42px_rgba(63,39,18,0.07)]"
      cover={
        <button
          type="button"
          className="grid w-full gap-4 p-3 text-left"
          onClick={() => navigateTo(ROUTES.productDetail(product.id))}
        >
          <div className="relative overflow-hidden rounded-2xl bg-stone-100">
            {product.imageUrl ? (
              <img
                className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                src={product.imageUrl}
                alt={product.name}
              />
            ) : (
              <div className="grid aspect-square w-full place-items-center bg-[linear-gradient(135deg,#f5f5f4_0%,#d6d3d1_100%)] px-4 text-center font-bold text-stone-700">
                <span>{product.category}</span>
              </div>
            )}
            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
              <Tag className="rounded-full border border-stone-300 bg-white px-3 py-1 text-xs font-bold text-stone-950">
                {product.category}
              </Tag>
              {product.stock > 0 ? (
                <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
                  In stock
                </span>
              ) : (
                <span className="rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white">
                  Sold out
                </span>
              )}
            </div>
          </div>
        </button>
      }
      actions={[
        <div key="actions" className="grid grid-cols-[minmax(0,1fr)_44px] gap-2 px-3 pb-1">
          <Button
            type="button"
            className="min-h-11"
            onClick={() => requireAuth(() => addCartItem(product))}
          >
            Add to cart
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="grid min-h-11 place-items-center px-0"
            onClick={() => requireAuth(() => toggleWishlistItem(product))}
            aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <svg viewBox="0 0 24 24" className={`h-4 w-4 ${saved ? 'fill-current' : 'fill-none stroke-current stroke-[1.8]'}`} aria-hidden="true">
              <path d="M12 20.2 10.84 19.15C6.72 15.42 4 12.95 4 9.92 4 7.45 5.93 5.52 8.4 5.52c1.39 0 2.73.65 3.6 1.67.87-1.02 2.21-1.67 3.6-1.67 2.47 0 4.4 1.93 4.4 4.4 0 3.03-2.72 5.5-6.84 9.24L12 20.2Z" />
            </svg>
          </Button>
        </div>,
      ]}
    >
      <button
        type="button"
        className="grid w-full gap-3 text-left"
        onClick={() => navigateTo(ROUTES.productDetail(product.id))}
      >
        <div className="grid gap-2">
          <h3 className="line-clamp-2 min-h-[48px] text-base font-bold leading-6 text-stone-950">
            {product.name}
          </h3>
          {product.description ? (
            <p className="line-clamp-2 min-h-[44px] text-sm font-medium leading-6 text-stone-700">
              {product.description}
            </p>
          ) : null}
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-stone-300 pt-4">
          <strong className="text-xl leading-none text-stone-950">
            {formatCurrency(product.price)}
          </strong>
          <span className="text-xs font-bold text-stone-700">{product.stock} left</span>
        </div>
      </button>
    </Card>
  )
}

export default ProductCard
