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
import LoginPage from '../../features/auth/pages/LoginPage'
import RegisterPage from '../../features/auth/pages/RegisterPage'
import AdminLoginPage from '../../features/auth/pages/AdminLoginPage'
import OAuthCallbackPage from '../../features/auth/pages/OAuthCallbackPage'
import AdminProductsPage from '../../features/admin/products/pages/AdminProductsPage'
import ProfilePage from '../../features/user/pages/ProfilePage'
import { navigateTo, usePathname } from '../../shared/lib/navigation'
import { ROUTES } from '../../shared/constants/routes'
import { ROLES } from '../../shared/constants/roles'
import { useCommerce } from '../../features/commerce/hooks/useCommerce'

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
  const isAdmin = user?.role === ROLES.admin
  const productId = getProductIdFromPath(pathname)
  const orderId = getOrderIdFromPath(pathname)
  const isAdminRoute =
    pathname === ROUTES.admin || pathname === ROUTES.adminLogin

  const handleLogout = () => {
    logout()
    navigateTo(ROUTES.home, { replace: true })
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
      (pathname === ROUTES.login || pathname === ROUTES.register) &&
      isAuthenticated
    ) {
      navigateTo(isAdmin ? ROUTES.admin : ROUTES.profile, { replace: true })
      return
    }

    if (pathname === ROUTES.adminLogin && isAdmin) {
      navigateTo(ROUTES.admin, { replace: true })
      return
    }

    if (pathname === ROUTES.oauthCallback && isAuthenticated) {
      navigateTo(isAdmin ? ROUTES.admin : ROUTES.profile, { replace: true })
      return
    }

    if (pathname === ROUTES.admin && !isAdmin) {
      navigateTo(ROUTES.adminLogin, { replace: true })
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
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                RESTRICTED AREA
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-white">Admin login</h1>
              <p className="mt-2 text-sm text-slate-300">
                Use an administrator account to enter the management area.
              </p>
            </header>

            <AdminLoginPage />
          </div>
        </div>
      )
    }

    if (pathname === ROUTES.admin) {
      return (
        <AdminLayout onLogout={handleLogout}>
          <ProtectedRoute
            allowed={isAdmin}
            fallback={<p className="text-sm text-slate-300">Admin access required.</p>}
            loading={!initialized}
          >
            <AdminProductsPage />
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
