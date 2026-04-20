import Button from '../../../shared/ui/Button'
import Input from '../../../shared/ui/Input'
import { ROUTES } from '../../../shared/constants/routes'
import { navigateTo } from '../../../shared/lib/navigation'
import { formatCurrency } from '../../../shared/utils/formatCurrency'
import { handleApiError } from '../../../shared/utils/handleApiError'
import { useAuth } from '../../auth/hooks/useAuth'
import { useCommerce } from '../hooks/useCommerce'
import { orderApi } from '../api/order.api'
import { useState } from 'react'

function CartPage() {
  const {
    cartItems,
    cartTotalAmount,
    cartTotalItems,
    removeCartItem,
    syncCart,
    updateCartItemQuantity,
  } = useCommerce()
  const { isAuthenticated } = useAuth()
  const [checkoutForm, setCheckoutForm] = useState({
    couponCode: '',
    note: '',
    receiverAddress: '',
    receiverName: '',
    receiverPhone: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigateTo(ROUTES.login)
      return
    }

    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const order = await orderApi.checkout({
        couponCode: checkoutForm.couponCode || null,
        note: checkoutForm.note,
        receiverAddress: checkoutForm.receiverAddress,
        receiverName: checkoutForm.receiverName,
        receiverPhone: checkoutForm.receiverPhone,
      })

      await syncCart()
      navigateTo(ROUTES.orderDetail(order.id))
    } catch (error) {
      setErrorMessage(handleApiError(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <section className="grid gap-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Shopping cart
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
            Your cart is empty
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Add products from the storefront before checkout.
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
    <section className="grid gap-8">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
          Shopping cart
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
          Review your selected items
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_360px]">
        <div className="grid gap-4">
          {cartItems.map((item) => (
            <article
              key={item.id}
              className="grid gap-4 rounded-2xl border border-stone-200 bg-white/85 p-5 shadow-[0_20px_45px_rgba(63,39,18,0.08)] backdrop-blur md:grid-cols-[96px_minmax(0,1fr)_120px]"
            >
              {item.product.imageUrl ? (
                <img
                  className="aspect-square w-24 rounded-xl object-cover"
                  src={item.product.imageUrl}
                  alt={item.product.name}
                />
              ) : (
                <div className="grid aspect-square w-24 place-items-center rounded-xl bg-stone-100 text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">
                  {item.product.category}
                </div>
              )}

              <div className="grid gap-2">
                <button
                  type="button"
                  className="w-fit text-left"
                  onClick={() => navigateTo(ROUTES.productDetail(item.product.id))}
                >
                  <h3 className="text-lg font-semibold text-stone-900">
                    {item.product.name}
                  </h3>
                </button>
                <p className="text-sm text-stone-500">{item.product.category}</p>
                <p className="text-sm text-stone-600">
                  Unit price: {formatCurrency(item.product.price)}
                </p>
              </div>

              <div className="grid gap-3">
                <Input
                  min="1"
                  type="number"
                  value={String(item.quantity)}
                  onChange={(event) =>
                    updateCartItemQuantity(item.id, event.target.value)
                  }
                />
                <p className="text-sm font-semibold text-stone-900">
                  {formatCurrency(item.subtotal)}
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => removeCartItem(item.id)}
                >
                  Remove
                </Button>
              </div>
            </article>
          ))}
        </div>

        <aside className="grid gap-4 rounded-2xl border border-stone-200 bg-white/85 p-5 shadow-[0_20px_45px_rgba(63,39,18,0.08)] backdrop-blur">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
              Summary
            </p>
            <h3 className="text-2xl font-semibold text-stone-900">Checkout</h3>
          </div>
          <div className="grid gap-3 text-sm text-stone-600">
            <div className="flex items-center justify-between gap-4">
              <span>Items</span>
              <strong className="text-stone-900">{cartTotalItems}</strong>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Subtotal</span>
              <strong className="text-stone-900">{formatCurrency(cartTotalAmount)}</strong>
            </div>
          </div>
          <div className="grid gap-3">
            <Input
              placeholder="Receiver name"
              value={checkoutForm.receiverName}
              onChange={(event) =>
                setCheckoutForm((current) => ({
                  ...current,
                  receiverName: event.target.value,
                }))
              }
            />
            <Input
              placeholder="Receiver phone"
              value={checkoutForm.receiverPhone}
              onChange={(event) =>
                setCheckoutForm((current) => ({
                  ...current,
                  receiverPhone: event.target.value,
                }))
              }
            />
            <Input
              placeholder="Receiver address"
              value={checkoutForm.receiverAddress}
              onChange={(event) =>
                setCheckoutForm((current) => ({
                  ...current,
                  receiverAddress: event.target.value,
                }))
              }
            />
            <Input
              placeholder="Coupon code (optional)"
              value={checkoutForm.couponCode}
              onChange={(event) =>
                setCheckoutForm((current) => ({
                  ...current,
                  couponCode: event.target.value,
                }))
              }
            />
            <Input
              placeholder="Note (optional)"
              value={checkoutForm.note}
              onChange={(event) =>
                setCheckoutForm((current) => ({
                  ...current,
                  note: event.target.value,
                }))
              }
            />
          </div>
          {!isAuthenticated ? (
            <p className="text-sm text-amber-700">
              Sign in first to place this order.
            </p>
          ) : null}
          {errorMessage ? <p className="text-sm text-rose-600">{errorMessage}</p> : null}
          <div className="flex flex-wrap gap-3">
            <Button type="button" disabled={isSubmitting} onClick={handleCheckout}>
              {isSubmitting ? 'Placing order...' : 'Place order'}
            </Button>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default CartPage
