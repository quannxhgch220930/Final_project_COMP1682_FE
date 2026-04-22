import Button from '../../../shared/ui/Button'
import Input from '../../../shared/ui/Input'
import { ROUTES } from '../../../shared/constants/routes'
import { navigateTo } from '../../../shared/lib/navigation'
import { formatCurrency } from '../../../shared/utils/formatCurrency'
import { handleApiError } from '../../../shared/utils/handleApiError'
import { useAuth } from '../../auth/hooks/useAuth'
import { useCommerce } from '../hooks/useCommerce'
import { orderApi } from '../api/order.api'
import { useEffect, useState } from 'react'
import { addressApi } from '../../user/api/address.api'

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
  const [addresses, setAddresses] = useState([])
  const [isAddressesLoading, setIsAddressesLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState('')

  useEffect(() => {
    let mounted = true

    if (!isAuthenticated) {
      setAddresses([])
      setSelectedAddressId('')
      return () => {
        mounted = false
      }
    }

    setIsAddressesLoading(true)

    addressApi
      .getList()
      .then((response) => {
        if (!mounted) {
          return
        }

        setAddresses(response.items)
      })
      .catch((error) => {
        if (!mounted) {
          return
        }

        setErrorMessage(handleApiError(error))
      })
      .finally(() => {
        if (mounted) {
          setIsAddressesLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [isAuthenticated])

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
                <div className="grid gap-1 text-sm text-stone-600">
                  <p>Unit price: {formatCurrency(item.unitPrice)}</p>
                  {item.currentPrice !== item.unitPrice ? (
                    <p className="text-xs text-amber-700">
                      Current product price: {formatCurrency(item.currentPrice)}
                    </p>
                  ) : null}
                </div>
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
            {isAuthenticated ? (
              <div className="grid gap-2">
                <label className="text-sm font-medium text-stone-700" htmlFor="checkout-address">
                  Saved address
                </label>
                <select
                  id="checkout-address"
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-stone-900 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
                  value={selectedAddressId}
                  onChange={(event) => {
                    const nextId = event.target.value
                    const selectedAddress =
                      addresses.find((address) => address.id === nextId) || null

                    setSelectedAddressId(nextId)

                    if (!selectedAddress) {
                      return
                    }

                    setCheckoutForm((current) => ({
                      ...current,
                      receiverAddress:
                        selectedAddress.fullAddress ||
                        [
                          selectedAddress.street,
                          selectedAddress.ward,
                          selectedAddress.district,
                          selectedAddress.province,
                        ]
                          .filter(Boolean)
                          .join(', '),
                      receiverName: selectedAddress.receiverName,
                      receiverPhone: selectedAddress.receiverPhone,
                    }))
                  }}
                >
                  <option value="">Enter address manually</option>
                  {addresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {`${address.receiverName} - ${address.fullAddress || address.street}`}
                    </option>
                  ))}
                </select>
                {isAddressesLoading ? (
                  <p className="text-sm text-stone-500">Loading saved addresses...</p>
                ) : null}
              </div>
            ) : null}
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
