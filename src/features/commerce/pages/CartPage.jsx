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
        <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
          Review your bag before checkout
        </h2>
        <p className="mt-2 text-sm font-medium text-stone-700">
          Confirm quantities, delivery details, and pricing before placing the
          order.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_390px]">
        <div className="grid gap-4">
          {cartItems.map((item) => (
            <Card
              key={item.id}
              className="grid gap-4 shadow-[0_22px_50px_rgba(63,39,18,0.08)] md:grid-cols-[120px_minmax(0,1fr)_140px]"
            >
              {item.product.imageUrl ? (
                <img
                  className="aspect-square w-28 rounded-2xl object-cover"
                  src={item.product.imageUrl}
                  alt={item.product.name}
                />
              ) : (
                <div className="grid aspect-square w-28 place-items-center rounded-2xl bg-stone-200 text-xs font-bold uppercase tracking-[0.12em] text-stone-800">
                  {item.product.category}
                </div>
              )}

              <div className="grid gap-2">
                <button
                  type="button"
                  className="w-fit text-left"
                  onClick={() => navigateTo(ROUTES.productDetail(item.product.id))}
                >
                  <Title level={4} style={{ margin: 0 }}>{item.product.name}</Title>
                </button>
                <p className="text-sm font-medium text-stone-700">{item.product.category}</p>
                <div className="grid gap-1 text-sm font-medium text-stone-700">
                  <p>Unit price: {formatCurrency(item.unitPrice)}</p>
                  {item.currentPrice !== item.unitPrice ? (
                    <p className="text-xs text-amber-700">
                      Current product price: {formatCurrency(item.currentPrice)}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-3 rounded-[24px] border border-stone-300 bg-white p-4">
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
            </Card>
          ))}
        </div>

        <Card className="grid gap-5 shadow-[0_24px_55px_rgba(63,39,18,0.09)]">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-stone-700">
              Checkout summary
            </p>
            <h3 className="text-2xl font-semibold text-stone-900">Complete your order</h3>
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
