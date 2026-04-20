const COMMERCE_STORAGE_KEY = 'commerce_state'

function getStorage() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function loadCommerceState() {
  const rawValue = getStorage()?.getItem(COMMERCE_STORAGE_KEY)

  if (!rawValue) {
    return {
      cartItems: [],
      orders: [],
      wishlistItems: [],
    }
  }

  try {
    const parsedValue = JSON.parse(rawValue)

    return {
      cartItems: Array.isArray(parsedValue?.cartItems) ? parsedValue.cartItems : [],
      orders: Array.isArray(parsedValue?.orders) ? parsedValue.orders : [],
      wishlistItems: Array.isArray(parsedValue?.wishlistItems)
        ? parsedValue.wishlistItems
        : [],
    }
  } catch {
    return {
      cartItems: [],
      orders: [],
      wishlistItems: [],
    }
  }
}

export function saveCommerceState(value) {
  getStorage()?.setItem(COMMERCE_STORAGE_KEY, JSON.stringify(value))
}
