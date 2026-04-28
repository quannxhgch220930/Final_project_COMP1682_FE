import { useEffect } from 'react'
import { Button as AntButton, Input, Tag, Typography } from 'antd'
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
import FilterPage from '../../features/product/pages/FilterPage'
import ProfilePage from '../../features/user/pages/ProfilePage'
import ProfileEditPage from '../../features/user/pages/ProfileEditPage'
import ProfileAddressPage from '../../features/user/pages/ProfileAddressPage'
import ProfilePasswordPage from '../../features/user/pages/ProfilePasswordPage'
import { navigateTo, usePathname, useSearchQuery } from '../../shared/lib/navigation'
import { ROUTES } from '../../shared/constants/routes'
import { ROLES } from '../../shared/constants/roles'

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

function getUserBadgeLabel(user) {
  const fullName = user?.fullName?.trim()

  if (!fullName) {
    return ''
  }

  const parts = fullName.split(/\s+/).filter(Boolean)
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() || '').join('')

  return initials.slice(0, 2)
}

function AppRouter() {
  const { Title, Paragraph } = Typography
  const pathname = usePathname()
  const searchQuery = useSearchQuery()
  const headerSearchValue = new URLSearchParams(searchQuery).get('search') || ''
  const { initialized, isAuthenticated, logout, user } = useAuth()
  const isAdmin = user?.role === ROLES.admin
  const productId = getProductIdFromPath(pathname)
  const orderId = getOrderIdFromPath(pathname)
  const isAdminRoute =
    pathname === ROUTES.admin ||
    pathname === ROUTES.adminLogin ||
    pathname === ROUTES.adminOrders ||
    pathname === ROUTES.adminProducts ||
    pathname === ROUTES.adminUsers
  const isAuthRoute =
    pathname === ROUTES.login ||
    pathname === ROUTES.register ||
    pathname === ROUTES.forgotPassword ||
    pathname === ROUTES.resetPassword ||
    pathname === ROUTES.oauthCallback
  const userBadgeLabel = getUserBadgeLabel(user)

  const handleLogout = () => {
    logout()
    navigateTo(ROUTES.home, { replace: true })
  }

  const handleAdminLogout = () => {
    logout()
    navigateTo(ROUTES.adminLogin, { replace: true })
  }

  const handleHeaderSearchChange = (value) => {
    const params = new URLSearchParams()

    if (value) {
      params.set('search', value)
    }

    navigateTo(`${ROUTES.products}${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const headerClassName = pathname === ROUTES.profile
    ? 'z-40 mb-8 overflow-hidden rounded-[34px] border border-stone-200 bg-[radial-gradient(circle_at_top_left,rgba(153,88,42,0.16),transparent_26%),linear-gradient(135deg,rgba(255,252,246,0.95)_0%,rgba(252,244,234,0.92)_100%)] shadow-[0_24px_60px_rgba(63,39,18,0.08)] backdrop-blur'
    : 'sticky top-4 z-40 mb-8 overflow-hidden rounded-[34px] border border-stone-200 bg-[radial-gradient(circle_at_top_left,rgba(153,88,42,0.16),transparent_26%),linear-gradient(135deg,rgba(255,252,246,0.95)_0%,rgba(252,244,234,0.92)_100%)] shadow-[0_24px_60px_rgba(63,39,18,0.08)] backdrop-blur'

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

    if (pathname === ROUTES.profileEdit) {
      return (
        <MainLayout>
          <ProtectedRoute
            allowed={isAuthenticated}
            fallback={<LoginPage />}
            loading={!initialized}
          >
            <ProfileEditPage />
          </ProtectedRoute>
        </MainLayout>
      )
    }

    if (pathname === ROUTES.profileAddress) {
      return (
        <MainLayout>
          <ProtectedRoute
            allowed={isAuthenticated}
            fallback={<LoginPage />}
            loading={!initialized}
          >
            <ProfileAddressPage />
          </ProtectedRoute>
        </MainLayout>
      )
    }

    if (pathname === ROUTES.profilePassword) {
      return (
        <MainLayout>
          <ProtectedRoute
            allowed={isAuthenticated}
            fallback={<LoginPage />}
            loading={!initialized}
          >
            <ProfilePasswordPage />
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
              <Tag color="gold" bordered={false} className="mb-3 rounded-full px-3 py-1 font-semibold">
                RECOVERY PORTAL
              </Tag>
              <Title level={1} style={{ color: '#1c1917', margin: 0, fontSize: '2.25rem' }}>
                Forgot password
              </Title>
              <Paragraph style={{ color: '#57534e', margin: '8px 0 0' }}>
                Request a password reset email to recover your account access.
              </Paragraph>
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
              <Tag color="gold" bordered={false} className="mb-3 rounded-full px-3 py-1 font-semibold">
                RECOVERY PORTAL
              </Tag>
              <Title level={1} style={{ color: '#1c1917', margin: 0, fontSize: '2.25rem' }}>
                Reset password
              </Title>
              <Paragraph style={{ color: '#57534e', margin: '8px 0 0' }}>
                Complete the password recovery by submitting your new password.
              </Paragraph>
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
              <Tag color="gold" bordered={false} className="mb-3 rounded-full px-3 py-1 font-semibold">
                RESTRICTED AREA
              </Tag>
              <Title level={1} style={{ color: '#fafaf9', margin: 0, fontSize: '2.25rem' }}>
                Admin login
              </Title>
              <Paragraph style={{ color: '#d6d3d1', margin: '8px 0 0' }}>
                Use an administrator account to enter the management area.
              </Paragraph>
            </header>

            <AdminLoginPage />
          </div>
        </div>
      )
    }

    if (pathname === ROUTES.admin) {
      return (
        <div className="auth-shell admin-auth-shell">
          <div className="auth-panel admin-auth-panel">
            <p className="text-sm text-stone-300">Checking admin access and redirecting...</p>
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

    if (pathname === ROUTES.filter) {
      return (
        <MainLayout>
          <FilterPage />
        </MainLayout>
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

  if (isAuthRoute) {
    return renderPage()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <header className={headerClassName}>
        <div className="flex flex-col gap-5 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-xl border border-stone-300 bg-white/78 text-sm font-semibold text-stone-700 shadow-[0_8px_20px_rgba(63,39,18,0.06)]"
              onClick={() => navigateTo(ROUTES.home)}
            >
              L
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Input
              className="md:w-[240px]"
              placeholder="Search the storefront"
              size="large"
              value={headerSearchValue}
              onChange={(event) => handleHeaderSearchChange(event.target.value)}
            />
            <AntButton size="large" type="button" onClick={() => navigateTo(ROUTES.filter)}>
              Filter
            </AntButton>
            {isAuthenticated ? (
              <AntButton size="large" onClick={handleLogout}>
                Logout
              </AntButton>
            ) : null}
            <AntButton
              shape="circle"
              size="large"
              onClick={() => navigateTo(isAuthenticated ? ROUTES.wishlist : ROUTES.login)}
              aria-label="Wishlist"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M12 2.75 14.84 8.5l6.35.92-4.6 4.48 1.09 6.32L12 17.24 6.32 20.22l1.09-6.32-4.6-4.48 6.35-.92L12 2.75Z" />
              </svg>
            </AntButton>
            <AntButton
              shape="circle"
              size="large"
              onClick={() => navigateTo(isAuthenticated ? ROUTES.cart : ROUTES.login)}
              aria-label="Cart"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.8]" aria-hidden="true">
                <circle cx="9" cy="19" r="1.6" />
                <circle cx="18" cy="19" r="1.6" />
                <path d="M3 4h2.2l2.1 9.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.76L20 7H7.1" />
              </svg>
            </AntButton>
            <AntButton
              shape="circle"
              size="large"
              onClick={() => navigateTo(isAuthenticated ? ROUTES.profile : ROUTES.login)}
              aria-label={isAuthenticated ? 'Account' : 'Sign in'}
            >
              {isAuthenticated ? (
                userBadgeLabel || 'U'
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M12 12.2a4.1 4.1 0 1 0 0-8.2 4.1 4.1 0 0 0 0 8.2Zm0 2.05c-4.34 0-7.86 2.35-7.86 5.25 0 .28.22.5.5.5h14.72c.28 0 .5-.22.5-.5 0-2.9-3.52-5.25-7.86-5.25Z" />
                </svg>
              )}
            </AntButton>
          </div>
        </div>
      </header>

      {renderPage()}
    </div>
  )
}

export default AppRouter
