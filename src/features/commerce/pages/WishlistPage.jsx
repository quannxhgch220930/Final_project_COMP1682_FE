import { Alert, Card, Typography } from 'antd'
import Button from '../../../shared/ui/Button'
import { ROUTES } from '../../../shared/constants/routes'
import { navigateTo } from '../../../shared/lib/navigation'
import { formatCurrency } from '../../../shared/utils/formatCurrency'
import { useCommerce } from '../hooks/useCommerce'

const { Paragraph, Title } = Typography

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
        <p className="mt-2 text-sm text-stone-600">
          Keep an eye on products you may want to compare or buy later.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {wishlistItems.map((product) => (
          <Card
            key={product.productId}
            className="grid gap-4 shadow-[0_22px_50px_rgba(63,39,18,0.08)]"
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
              <Paragraph className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                {product.category}
              </Paragraph>
              <button
                type="button"
                className="text-left"
                onClick={() => navigateTo(ROUTES.productDetail(product.productId))}
              >
                <Title level={4} style={{ margin: 0 }}>{product.name}</Title>
              </button>
            </div>

            <Title level={5} style={{ margin: 0 }}>{formatCurrency(product.price)}</Title>

            <div className="flex flex-wrap gap-3 border-t border-stone-200 pt-4">
              <Button type="button" className="flex-1" onClick={() => addCartItem(product)}>
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
          </Card>
        ))}
      </div>
    </section>
  )
}

export default WishlistPage
