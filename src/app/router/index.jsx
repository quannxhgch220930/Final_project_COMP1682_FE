import { useEffect } from 'react'
import MainLayout from '../layouts/MainLayout'
import AdminLayout from '../layouts/AdminLayout'
import Button from '../../shared/ui/Button'
import ProtectedRoute from '../../shared/components/ProtectedRoute'
import { useAuth } from '../../features/auth/hooks/useAuth'
import ProductListPage from '../../features/product/pages/ProductListPage'
import ProductDetailPage from '../../features/product/pages/ProductDetailPage'
import CartPage from '../../features/commerce/pages/CartPage'
import WishlistPage from '../../features/commerce/pages/WishlistPage'
import OrdersPage from '../../features/commerce/pages/OrdersPage'
import OrderDetailPage from '../../features/commerce/pages/OrderDetailPage'
import NotificationsPage from '../../features/notification/pages/NotificationsPage'
import LoginPage from '../../features/auth/pages/LoginPage'
import ForgotPasswordPage from '../../features/auth/pages/ForgotPasswordPage'
import ResetPasswordPage from '../../features/auth/pages/ResetPasswordPage'
import RegisterPage from '../../features/auth/pages/RegisterPage'
import AdminLoginPage from '../../features/auth/pages/AdminLoginPage'
import OAuthCallbackPage from '../../features/auth/pages/OAuthCallbackPage'
import AdminOrdersPage from '../../features/admin/orders/pages/AdminOrdersPage'
import AdminProductsPage from '../../features/admin/products/pages/AdminProductsPage'
import AdminUsersPage from '../../features/admin/users/pages/AdminUsersPage'
import ProfilePage from '../../features/user/pages/ProfilePage'
import { navigateTo, usePathname } from '../../shared/lib/navigation'
import { ROUTES } from '../../shared/constants/routes'
import { ROLES } from '../../shared/constants/roles'
import { useCommerce } from '../../features/commerce/hooks/useCommerce'
import { useNotifications } from '../../features/notification/hooks/useNotifications'

function getProductIdFromPath(pathname) {
  if (!pathname.startsWith(`${ROUTES.products}/`)) {
    return null
  }

  return pathname.slice(`${ROUTES.products}/`.length) || null
}

function getOrderIdFromPath(pathname) {
  if (!pathname.startsWith(`${ROUTES.orders}/`)) {
    return null
  }

  return pathname.slice(`${ROUTES.orders}/`.length) || null
}

function AppRouter() {
  const pathname = usePathname()
  const { initialized, isAuthenticated, logout, user } = useAuth()
  const { cartCount, wishlistCount } = useCommerce()
  const { unreadCount } = useNotifications()
  const isAdmin = user?.role === ROLES.admin
  const productId = getProductIdFromPath(pathname)
  const orderId = getOrderIdFromPath(pathname)
  const isAdminRoute =
    pathname === ROUTES.admin ||
    pathname === ROUTES.adminLogin ||
    pathname === ROUTES.adminOrders ||
    pathname === ROUTES.adminProducts ||
    pathname === ROUTES.adminUsers

  const handleLogout = () => {
    logout()
    navigateTo(ROUTES.home, { replace: true })
  }

  const handleAdminLogout = () => {
    logout()
    navigateTo(ROUTES.adminLogin, { replace: true })
  }

  useEffect(() => {
    if (!initialized) {
      return
    }

    if (isAdmin && !isAdminRoute) {
      navigateTo(ROUTES.admin, { replace: true })
      return
    }

    if (
      (
        pathname === ROUTES.login ||
        pathname === ROUTES.register ||
        pathname === ROUTES.forgotPassword ||
        pathname === ROUTES.resetPassword
      ) &&
      isAuthenticated
    ) {
      navigateTo(isAdmin ? ROUTES.admin : ROUTES.profile, { replace: true })
      return
    }

    if (pathname === ROUTES.adminLogin && isAdmin) {
      navigateTo(ROUTES.adminProducts, { replace: true })
      return
    }

    if (pathname === ROUTES.oauthCallback && isAuthenticated) {
      navigateTo(isAdmin ? ROUTES.admin : ROUTES.profile, { replace: true })
      return
    }

    if (pathname === ROUTES.admin && !isAdmin) {
      navigateTo(ROUTES.adminLogin, { replace: true })
      return
    }

    if (pathname === ROUTES.admin) {
      navigateTo(ROUTES.adminProducts, { replace: true })
    }
  }, [initialized, isAdmin, isAdminRoute, isAuthenticated, pathname])

  const renderPage = () => {
    if (pathname === ROUTES.profile) {
      return (
        <MainLayout>
          <ProtectedRoute
            allowed={isAuthenticated}
            fallback={<LoginPage />}
            loading={!initialized}
          >
            <ProfilePage />
          </ProtectedRoute>
        </MainLayout>
      )
    }

    if (pathname === ROUTES.cart) {
      return (
        <MainLayout>
          <ProtectedRoute
            allowed={isAuthenticated}
            fallback={<LoginPage />}
            loading={!initialized}
          >
            <CartPage />
          </ProtectedRoute>
        </MainLayout>
      )
    }

    if (pathname === ROUTES.wishlist) {
      return (
        <MainLayout>
          <ProtectedRoute
            allowed={isAuthenticated}
            fallback={<LoginPage />}
            loading={!initialized}
          >
            <WishlistPage />
          </ProtectedRoute>
        </MainLayout>
      )
    }

    if (pathname === ROUTES.orders) {
      return (
        <MainLayout>
          <ProtectedRoute
            allowed={isAuthenticated}
            fallback={<LoginPage />}
            loading={!initialized}
          >
            <OrdersPage />
          </ProtectedRoute>
        </MainLayout>
      )
    }

    if (pathname === ROUTES.notifications) {
      return (
        <MainLayout>
          <ProtectedRoute
            allowed={isAuthenticated}
            fallback={<LoginPage />}
            loading={!initialized}
          >
            <NotificationsPage />
          </ProtectedRoute>
        </MainLayout>
      )
    }

    if (orderId) {
      return (
        <MainLayout>
          <ProtectedRoute
            allowed={isAuthenticated}
            fallback={<LoginPage />}
            loading={!initialized}
          >
            <OrderDetailPage orderId={orderId} />
          </ProtectedRoute>
        </MainLayout>
      )
    }

    if (productId) {
      return (
        <MainLayout>
          <ProductDetailPage key={productId} productId={productId} />
        </MainLayout>
      )
    }

    if (pathname === ROUTES.login) {
      return (
        <div className="auth-shell auth-shell--user">
          <div className="auth-panel auth-panel--user"> 
          <ProtectedRoute
            allowed={!isAuthenticated}
            fallback={<ProfilePage />}
            loading={!initialized}
          >
            <LoginPage />
          </ProtectedRoute>
          </div>
        </div>
      )
    }

    if (pathname === ROUTES.forgotPassword) {
      return (
        <div className="auth-shell auth-shell--user">
          <div className="auth-panel auth-panel--user">
            <header className="auth-header">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                RECOVERY PORTAL
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-stone-900">
                Forgot password
              </h1>
              <p className="mt-2 text-sm text-stone-600">
                Request a password reset email to recover your account access.
              </p>
            </header>
            <ProtectedRoute
              allowed={!isAuthenticated}
              fallback={<ProfilePage />}
              loading={!initialized}
            >
              <ForgotPasswordPage />
            </ProtectedRoute>
          </div>
        </div>
      )
    }

    if (pathname === ROUTES.register) {
      return (
        <div className="auth-shell auth-shell--user">
          <div className="auth-panel auth-panel--user">
          <ProtectedRoute
            allowed={!isAuthenticated}
            fallback={<ProfilePage />}
            loading={!initialized}
          >
            <RegisterPage />
          </ProtectedRoute>
          </div>
        </div>
      )
    }

    if (pathname === ROUTES.resetPassword) {
      return (
        <div className="auth-shell auth-shell--user">
          <div className="auth-panel auth-panel--user">
            <header className="auth-header">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                RECOVERY PORTAL
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-stone-900">
                Reset password
              </h1>
              <p className="mt-2 text-sm text-stone-600">
                Complete the password recovery by submitting your new password.
              </p>
            </header>
            <ProtectedRoute
              allowed={!isAuthenticated}
              fallback={<ProfilePage />}
              loading={!initialized}
            >
              <ResetPasswordPage />
            </ProtectedRoute>
          </div>
        </div>
      )
    }

    if (pathname === ROUTES.oauthCallback) {
      return (
        <div className="auth-shell auth-shell--user">
          <div className="auth-panel auth-panel--user">
            <OAuthCallbackPage />
          </div>
        </div>
      )
    }

    if (pathname === ROUTES.adminLogin) {
      return (
        <div className="auth-shell admin-auth-shell">
          <div className="auth-panel admin-auth-panel">
            <header className="auth-header admin-auth-header">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-100/70">
                RESTRICTED AREA
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-stone-50">Admin login</h1>
              <p className="mt-2 text-sm text-stone-300">
                Use an administrator account to enter the management area.
              </p>
            </header>

            <AdminLoginPage />
          </div>
        </div>
      )
    }

    if (pathname === ROUTES.adminProducts) {
      return (
        <AdminLayout onLogout={handleAdminLogout}>
          <ProtectedRoute
            allowed={isAdmin}
            fallback={<p className="text-sm text-stone-300">Admin access required.</p>}
            loading={!initialized}
          >
            <AdminProductsPage />
          </ProtectedRoute>
        </AdminLayout>
      )
    }

    if (pathname === ROUTES.adminOrders) {
      return (
        <AdminLayout onLogout={handleAdminLogout}>
          <ProtectedRoute
            allowed={isAdmin}
            fallback={<p className="text-sm text-stone-300">Admin access required.</p>}
            loading={!initialized}
          >
            <AdminOrdersPage />
          </ProtectedRoute>
        </AdminLayout>
      )
    }

    if (pathname === ROUTES.adminUsers) {
      return (
        <AdminLayout onLogout={handleAdminLogout}>
          <ProtectedRoute
            allowed={isAdmin}
            fallback={<p className="text-sm text-stone-300">Admin access required.</p>}
            loading={!initialized}
          >
            <AdminUsersPage />
          </ProtectedRoute>
        </AdminLayout>
      )
    }

    return (
      <MainLayout>
        <ProductListPage />
      </MainLayout>
    )
  }

  if (isAdminRoute) {
    return renderPage()
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 md:px-6 md:py-10">
      <header className="mb-6 flex flex-col gap-6 rounded-[24px] border border-stone-200 bg-[rgba(255,253,248,0.88)] p-6 shadow-[0_20px_45px_rgba(63,39,18,0.08)] backdrop-blur md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Frontend Architecture Starter
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-stone-900">
            Scaffolded feature-first workspace
          </h1>
        </div>

        <nav className="flex flex-wrap gap-3" aria-label="Demo sections">
          <Button
            type="button"
            variant={pathname === ROUTES.home ? 'primary' : 'secondary'}
            onClick={() => navigateTo(ROUTES.home)}
          >
            Storefront
          </Button>
          {!isAuthenticated && !isAdmin ? (
            <Button
              type="button"
              variant={pathname === ROUTES.login ? 'primary' : 'secondary'}
              onClick={() => navigateTo(ROUTES.login)}
            >
              Login
            </Button>
          ) : null}
          {!isAdmin ? (
            <Button
              type="button"
              variant={pathname === ROUTES.wishlist ? 'primary' : 'secondary'}
              onClick={() => navigateTo(ROUTES.wishlist)}
            >
              Wishlist ({wishlistCount})
            </Button>
          ) : null}
          {!isAdmin ? (
            <Button
              type="button"
              variant={pathname === ROUTES.cart ? 'primary' : 'secondary'}
              onClick={() => navigateTo(ROUTES.cart)}
            >
              Cart ({cartCount})
            </Button>
          ) : null}
          {isAuthenticated && !isAdmin ? (
            <Button
              type="button"
              variant={pathname === ROUTES.notifications ? 'primary' : 'secondary'}
              onClick={() => navigateTo(ROUTES.notifications)}
            >
              Notifications ({unreadCount})
            </Button>
          ) : null}
          {isAuthenticated && !isAdmin ? (
            <Button
              type="button"
              variant={pathname === ROUTES.orders ? 'primary' : 'secondary'}
              onClick={() => navigateTo(ROUTES.orders)}
            >
              Orders
            </Button>
          ) : null}
          {isAuthenticated && !isAdmin ? (
            <Button
              type="button"
              variant={pathname === ROUTES.profile ? 'primary' : 'secondary'}
              onClick={() => navigateTo(ROUTES.profile)}
            >
              Profile
            </Button>
          ) : null}
          {isAuthenticated ? (
            <Button
              type="button"
              variant="secondary"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : null}
        </nav>
      </header>

      {renderPage()}
    </div>
  )
}

export default AppRouter
