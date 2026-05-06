import Button from '../../../shared/ui/Button'
import Input from '../../../shared/ui/Input'
import { Alert, Card, Select, Typography } from 'antd'
import { ROUTES } from '../../../shared/constants/routes'
import { navigateTo } from '../../../shared/lib/navigation'
import { formatCurrency } from '../../../shared/utils/formatCurrency'
import { handleApiError } from '../../../shared/utils/handleApiError'
import { useAuth } from '../../auth/hooks/useAuth'
import { useCommerce } from '../hooks/useCommerce'
import { orderApi } from '../api/order.api'
import { vnpayPaymentApi } from '../api/vnpayPayment.api'
import { useEffect, useState } from 'react'
import { addressApi } from '../../user/api/address.api'

const { Paragraph, Title } = Typography

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
    paymentMethod: 'COD',
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
        paymentMethod: checkoutForm.paymentMethod,
      })

      await syncCart()

      if (checkoutForm.paymentMethod === 'VNPAY') {
        const paymentUrl = await vnpayPaymentApi.createPaymentUrl(order.id)
        window.location.href = paymentUrl
      } else {
        navigateTo(ROUTES.orderDetail(order.id))
      }
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
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-stone-700">
            Shopping cart
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
            Your cart is empty
          </h2>
          <p className="mt-2 text-sm font-medium text-stone-700">
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
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-stone-700">
          Shopping cart
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_390px]">
        <div className="grid gap-4">
          {cartItems.map((item) => (
            <Card
            key={item.id}
            className="flex items-center gap-4 rounded-2xl border border-stone-200 p-4 shadow-sm hover:shadow-md transition"
          >
            {/* Image */}
            {item.product.imageUrl ? (
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="h-20 w-20 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-stone-100 text-stone-400">
                <span className="text-xs">No image</span>
              </div>
            )}

            {/* Info */}
            <div className="flex flex-1 flex-col gap-1">
              <button
                onClick={() => navigateTo(ROUTES.productDetail(item.product.id))}
                className="text-left"
              >
                <h3 className="text-base font-semibold text-stone-900 hover:underline">
                  {item.product.name}
                </h3>
              </button>

              <p className="text-xs text-stone-500">
                {item.product.category}
              </p>

              <div className="text-sm font-medium text-stone-700">
                {formatCurrency(item.unitPrice)}
              </div>

              {item.currentPrice !== item.unitPrice && (
                <span className="text-xs text-amber-600">
                  Now: {formatCurrency(item.currentPrice)}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col items-end gap-2">
              {/* Quantity */}
              <div className="flex items-center rounded-lg border border-stone-200">
                <button
                  className="px-2 py-1 text-sm text-stone-600 hover:bg-stone-100"
                  onClick={() =>
                    updateCartItemQuantity(item.id, item.quantity - 1)
                  }
                >
                  -
                </button>

                <span className="px-3 text-sm font-medium">
                  {item.quantity}
                </span>

                <button
                  className="px-2 py-1 text-sm text-stone-600 hover:bg-stone-100"
                  onClick={() =>
                    updateCartItemQuantity(item.id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-sm font-semibold text-stone-900">
                {formatCurrency(item.subtotal)}
              </div>

              {/* Remove */}
              <button
                onClick={() => removeCartItem(item.id)}
                className="text-xs text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          </Card>
          ))}
        </div>

        <Card className="grid gap-5 shadow-[0_24px_55px_rgba(63,39,18,0.09)]">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-stone-700">
              Your order preview
            </p>
          </div>
          <div className="grid gap-3 text-sm font-medium text-stone-700">
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
                <Select
                  id="checkout-address"
                  value={selectedAddressId}
                  onChange={(nextId) => {
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
                  options={[
                    { label: 'Enter address manually', value: '' },
                    ...addresses.map((address) => ({
                      label: `${address.receiverName} - ${address.fullAddress || address.street}`,
                      value: address.id,
                    })),
                  ]}
                />
                {isAddressesLoading ? (
                  <Alert type="info" message="Loading saved addresses..." showIcon />
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
            <div className="grid gap-2">
              <label className="text-sm font-medium text-stone-700" htmlFor="payment-method">
                Payment method
              </label>
              <Select
                id="payment-method"
                value={checkoutForm.paymentMethod}
                onChange={(value) =>
                  setCheckoutForm((current) => ({
                    ...current,
                    paymentMethod: value,
                  }))
                }
                options={[
                  { label: 'Cash on Delivery (COD)', value: 'COD' },
                  { label: 'VNPay', value: 'VNPAY' },
                ]}
              />
            </div>
          </div>
          {!isAuthenticated ? (
            <Alert type="warning" message="Sign in first to place this order." showIcon />
          ) : null}
          {errorMessage ? <Alert type="error" message={errorMessage} showIcon /> : null}
          <div className="flex flex-wrap gap-3">
            <Button type="button" disabled={isSubmitting} onClick={handleCheckout}>
              {isSubmitting ? 'Placing order...' : 'Place order'}
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}

export default CartPage
