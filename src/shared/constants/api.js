export const API_ENDPOINTS = {
  admin: {
    deleteUser: (id) => `/admin/users/${id}`,
    updateLock: (id) => `/admin/users/${id}/lock`,
    updateRole: (id) => `/admin/users/${id}/role`,
    users: '/admin/users',
  },
  cart: {
    addItem: '/cart/items',
    clear: '/cart',
    detail: '/cart',
    removeItem: (itemId) => `/cart/items/${itemId}`,
    updateItem: (itemId) => `/cart/items/${itemId}`,
  },
  auth: {
    adminLogin: '/auth/admin/login',
    changePassword: '/auth/change-password',
    googleLogin: '/oauth2/authorization/google',
    login: '/auth/login',
    register: '/auth/register',
  },
  categories: {
    list: '/categories',
  },
  orders: {
    cancel: (id) => `/orders/${id}/cancel`,
    detail: (id) => `/orders/${id}`,
    list: '/orders',
  },
  products: {
    detail: (id) => `/products/${id}`,
    list: '/products',
  },
  users: {
    me: '/users/me',
  },
  wishlist: {
    add: (productId) => `/wishlist/${productId}`,
    check: (productId) => `/wishlist/check/${productId}`,
    list: '/wishlist',
    remove: (productId) => `/wishlist/${productId}`,
  },
}
