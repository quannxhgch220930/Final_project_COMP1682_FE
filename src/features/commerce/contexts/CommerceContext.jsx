import { useEffect, useState } from 'react'
import { CommerceContext } from './CommerceStateContext'
import { cartApi } from '../api/cart.api'
import { wishlistApi } from '../api/wishlist.api'
import { handleApiError } from '../../../shared/utils/handleApiError'
import { useAuth } from '../../auth/hooks/useAuth'

export function CommerceProvider({ children }) {
  const { isAuthenticated, user } = useAuth()
  const [remoteCartState, setRemoteCartState] = useState({
    cart: null,
    errorMessage: '',
    ownerId: null,
  })
  const [remoteWishlistState, setRemoteWishlistState] = useState({
    errorMessage: '',
    items: [],
    ownerId: null,
  })

  useEffect(() => {
    let mounted = true

    if (!isAuthenticated || !user?.id) {
      return () => {
        mounted = false
      }
    }

    cartApi
      .getCart()
      .then((cart) => {
        if (!mounted) {
          return
        }

        setRemoteCartState({
          cart,
          errorMessage: '',
          ownerId: String(user.id),
        })
      })
      .catch((error) => {
        if (!mounted) {
          return
        }

        setRemoteCartState((currentState) => ({
          ...currentState,
          errorMessage: handleApiError(error),
        }))
      })

    return () => {
      mounted = false
    }
  }, [isAuthenticated, user?.id])

  useEffect(() => {
    let mounted = true

    if (!isAuthenticated || !user?.id) {
      return () => {
        mounted = false
      }
    }

    wishlistApi
      .getList()
      .then((response) => {
        if (!mounted) {
          return
        }

        setRemoteWishlistState({
          errorMessage: '',
          items: response.items,
          ownerId: String(user.id),
        })
      })
      .catch((error) => {
        if (!mounted) {
          return
        }

        setRemoteWishlistState((currentState) => ({
          ...currentState,
          errorMessage: handleApiError(error),
        }))
      })

    return () => {
      mounted = false
    }
  }, [isAuthenticated, user?.id])

  const remoteCart =
    isAuthenticated && remoteCartState.ownerId === String(user?.id)
      ? remoteCartState.cart
      : null

  const cartItems = remoteCart?.items || []
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const remoteWishlistItems =
    isAuthenticated && remoteWishlistState.ownerId === String(user?.id)
      ? remoteWishlistState.items
      : []

  const addCartItem = async (product, quantity = 1) => {
    const nextCart = await cartApi.addItem({
      productId: product.id,
      quantity: Math.max(1, quantity),
    })

    setRemoteCartState({
      cart: nextCart,
      errorMessage: '',
      ownerId: String(user?.id ?? ''),
    })
  }

  const clearCart = async () => {
    await cartApi.clear()
    setRemoteCartState({
      cart: {
        id: remoteCart?.id || '',
        items: [],
        totalAmount: 0,
        totalItems: 0,
      },
      errorMessage: '',
      ownerId: String(user?.id ?? ''),
    })
  }

  const getCartItem = (productId) =>
    cartItems.find((item) => item.product.id === String(productId)) || null

  const syncCart = async () => {
    if (!isAuthenticated || !user?.id) {
      return null
    }

    const cart = await cartApi.getCart()
    setRemoteCartState({
      cart,
      errorMessage: '',
      ownerId: String(user.id),
    })

    return cart
  }

  const isInWishlist = (productId) =>
    remoteWishlistItems.some((item) => item.productId === String(productId))

  const removeCartItem = async (itemId) => {
    const nextCart = await cartApi.removeItem(itemId)
    setRemoteCartState({
      cart: nextCart,
      errorMessage: '',
      ownerId: String(user?.id ?? ''),
    })
  }

  const removeWishlistItem = async (productId) => {
    await wishlistApi.remove(productId)
    setRemoteWishlistState((currentState) => ({
      ...currentState,
      errorMessage: '',
      items: currentState.items.filter(
        (item) => item.productId !== String(productId),
      ),
    }))
  }

  const syncWishlist = async () => {
    if (!isAuthenticated || !user?.id) {
      return []
    }

    const response = await wishlistApi.getList()
    setRemoteWishlistState({
      errorMessage: '',
      items: response.items,
      ownerId: String(user.id),
    })

    return response.items
  }

  const toggleWishlistItem = async (product) => {
    const productId = String(product.id)

    if (isInWishlist(productId)) {
      await removeWishlistItem(productId)
      return
    }

    await wishlistApi.add(productId)
    await syncWishlist()
  }

  const updateCartItemQuantity = async (itemId, quantity) => {
    const normalizedQuantity = Number(quantity)

    if (normalizedQuantity <= 0) {
      await removeCartItem(itemId)
      return
    }

    const nextCart = await cartApi.updateItem(itemId, normalizedQuantity)
    setRemoteCartState({
      cart: nextCart,
      errorMessage: '',
      ownerId: String(user?.id ?? ''),
    })
  }

  const wishlistCount = remoteWishlistItems.length

  return (
    <CommerceContext.Provider
      value={{
        addCartItem,
        cartCount,
        cartItems,
        cartTotalAmount: remoteCart?.totalAmount ?? 0,
        cartTotalItems: remoteCart?.totalItems ?? 0,
        clearCart,
        getCartItem,
        isInWishlist,
        removeCartItem,
        removeWishlistItem,
        syncCart,
        syncWishlist,
        toggleWishlistItem,
        updateCartItemQuantity,
        wishlistCount,
        wishlistItems: remoteWishlistItems,
      }}
    >
      {children}
    </CommerceContext.Provider>
  )
}
