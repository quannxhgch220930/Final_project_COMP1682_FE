import { Card, Tag, Typography } from 'antd'
import { formatCurrency } from '../../../shared/utils/formatCurrency'
import { ROUTES } from '../../../shared/constants/routes'
import { navigateTo } from '../../../shared/lib/navigation'
import Button from '../../../shared/ui/Button'
import { useCommerce } from '../../commerce/hooks/useCommerce'
import { useAuth } from '../../auth/hooks/useAuth'

const { Paragraph, Title, Text } = Typography

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
      className="group overflow-hidden shadow-[0_24px_55px_rgba(63,39,18,0.08)]"
      cover={
        <button
          type="button"
          className="grid w-full gap-5 p-5 text-left"
          onClick={() => navigateTo(ROUTES.productDetail(product.id))}
        >
          <div className="relative overflow-hidden rounded-[24px]">
            {product.imageUrl ? (
              <img
                className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                src={product.imageUrl}
                alt={product.name}
              />
            ) : (
              <div className="grid aspect-[4/3] w-full place-items-center bg-[radial-gradient(circle_at_top,rgba(153,88,42,0.22),transparent_26%),linear-gradient(135deg,#f6ecdf_0%,#ead5bc_100%)] font-semibold text-[color:var(--color-primary-strong)]">
                <span>{product.category}</span>
              </div>
            )}
            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
              <Tag>{product.category}</Tag>
            </div>
          </div>
        </button>
      }
      actions={[
        <div key="actions" className="flex gap-3 px-4">
          <Button
            type="button"
            className="flex-1"
            onClick={() => requireAuth(() => addCartItem(product))}
          >
            Add to cart
          </Button>,
          <Button
            type="button"
            variant="secondary"
            className="min-w-[128px]"
            onClick={() => requireAuth(() => toggleWishlistItem(product))}
          >
            {saved ? 'Saved' : 'Wishlist'}
          </Button>,
        </div>,
      ]}
    >
      <button
        type="button"
        className="grid w-full gap-5 text-left"
        onClick={() => navigateTo(ROUTES.productDetail(product.id))}
      >
        <div className="grid gap-3">
          <Title level={4} style={{ margin: 0 }}>
            {product.name}
          </Title>
          {product.description ? (
            <Paragraph className="line-clamp-3 !mb-0 text-sm leading-6 !text-stone-600">
              {product.description}
            </Paragraph>
          ) : null}
        </div>

        <div className="grid gap-3 border-t border-stone-200 pt-4">
          <Text strong className="!text-2xl !leading-none !text-stone-900">
            {formatCurrency(product.price)}
          </Text>
        </div>
      </button>
    </Card>
  )
}

export default ProductCard
