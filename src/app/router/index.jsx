import { useEffect } from 'react'
import { Button as AntButton, Dropdown, Input, Tag, Typography } from 'antd'
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
import VerifyEmailPage from '../../features/auth/pages/VerifyEmailPage'
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
import ProfileShell from '../../features/user/components/ProfileShell'
import PaymentResultPage from '../../features/commerce/pages/PaymentResultPage'
import { navigateTo, usePathname, useSearchQuery } from '../../shared/lib/navigation'
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
  const { cartTotalItems, wishlistItems } = useCommerce()
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
    pathname === ROUTES.verifyEmail ||
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

  const handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      handleLogout()
      return
    }

    switch (key) {
      case 'profile':
        navigateTo(ROUTES.profile)
        break
      case 'edit':
        navigateTo(ROUTES.profileEdit)
        break
      case 'address':
        navigateTo(ROUTES.profileAddress)
        break
      case 'password':
        navigateTo(ROUTES.profilePassword)
        break
      default:
        break
    }
  }

  const userMenuItems = [
    { key: 'profile', label: 'My profile' },
    { key: 'edit', label: 'Edit profile' },
    { key: 'address', label: 'Shipping address' },
    { key: 'password', label: 'Change password' },
    { type: 'divider' },
    { key: 'logout', label: 'Logout' },
  ]

  const headerClassName = pathname === ROUTES.profile
    ? 'z-40 mb-8 overflow-hidden rounded-3xl border border-stone-300 bg-white shadow-[0_18px_45px_rgba(63,39,18,0.08)]'
    : 'sticky top-4 z-40 mb-8 overflow-hidden rounded-3xl border border-stone-300 bg-white shadow-[0_18px_45px_rgba(63,39,18,0.08)]'

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
            <ProfileShell>
              <ProfilePage />
            </ProfileShell>
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
            <ProfileShell>
              <ProfileEditPage />
            </ProfileShell>
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
            <ProfileShell>
              <ProfileAddressPage />
            </ProfileShell>
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
            <ProfileShell>
              <ProfilePasswordPage />
            </ProfileShell>
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
            <ProfileShell>
              <CartPage />
            </ProfileShell>
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
            <ProfileShell>
              <WishlistPage />
            </ProfileShell>
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

    if (pathname === ROUTES.paymentResult) {
      return (
        <MainLayout>
          <ProtectedRoute
            allowed={isAuthenticated}
            fallback={<LoginPage />}
            loading={!initialized}
          >
            <PaymentResultPage />
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
          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
            <header className="mb-8 overflow-hidden rounded-[34px] border border-stone-300 bg-white shadow-[0_24px_60px_rgba(63,39,18,0.08)]">
              <div className="flex items-center px-6 py-5">
                <div
                  role="link"
                  tabIndex={0}
                  className="cursor-pointer rounded-xl bg-stone-950 px-4 py-2 text-sm font-bold text-white shadow-[0_8px_20px_rgba(63,39,18,0.06)]"
                  onClick={() => navigateTo(ROUTES.home)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      navigateTo(ROUTES.home)
                    }
                  }}
                >
                  E-COMMERCE
                </div>
              </div>
            </header>
          </div>

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
          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
            <header className="mb-8 overflow-hidden rounded-[34px] border border-stone-300 bg-white shadow-[0_24px_60px_rgba(63,39,18,0.08)]">
              <div className="flex items-center px-6 py-5">
                <div
                  role="link"
                  tabIndex={0}
                  className="cursor-pointer rounded-xl bg-stone-950 px-4 py-2 text-sm font-bold text-white shadow-[0_8px_20px_rgba(63,39,18,0.06)]"
                  onClick={() => navigateTo(ROUTES.home)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      navigateTo(ROUTES.home)
                    }
                  }}
                >
                  E-COMMERCE
                </div>
              </div>
            </header>
          </div>

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
          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
            <header className="mb-8 overflow-hidden rounded-[34px] border border-stone-300 bg-white shadow-[0_24px_60px_rgba(63,39,18,0.08)]">
              <div className="flex items-center px-6 py-5">
                <div
                  role="link"
                  tabIndex={0}
                  className="cursor-pointer rounded-xl bg-stone-950 px-4 py-2 text-sm font-bold text-white shadow-[0_8px_20px_rgba(63,39,18,0.06)]"
                  onClick={() => navigateTo(ROUTES.home)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      navigateTo(ROUTES.home)
                    }
                  }}
                >
                  E-COMMERCE
                </div>
              </div>
            </header>
          </div>

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

    if (pathname === ROUTES.verifyEmail) {
      return (
        <div className="auth-shell auth-shell--user">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
            <header className="mb-8 overflow-hidden rounded-[34px] border border-stone-300 bg-white shadow-[0_24px_60px_rgba(63,39,18,0.08)]">
              <div className="flex items-center px-6 py-5">
                <div
                  role="link"
                  tabIndex={0}
                  className="cursor-pointer rounded-xl bg-stone-950 px-4 py-2 text-sm font-bold text-white shadow-[0_8px_20px_rgba(63,39,18,0.06)]"
                  onClick={() => navigateTo(ROUTES.home)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      navigateTo(ROUTES.home)
                    }
                  }}
                >
                  E-COMMERCE
                </div>
              </div>
            </header>
          </div>

          <div className="auth-panel auth-panel--user">
            <VerifyEmailPage />
          </div>
        </div>
      )
    }

    if (pathname === ROUTES.resetPassword) {
      return (
        <div className="auth-shell auth-shell--user">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
            <header className="mb-8 overflow-hidden rounded-[34px] border border-stone-300 bg-white shadow-[0_24px_60px_rgba(63,39,18,0.08)]">
              <div className="flex items-center px-6 py-5">
                <div
                  role="link"
                  tabIndex={0}
                  className="cursor-pointer rounded-xl bg-stone-950 px-4 py-2 text-sm font-bold text-white shadow-[0_8px_20px_rgba(63,39,18,0.06)]"
                  onClick={() => navigateTo(ROUTES.home)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      navigateTo(ROUTES.home)
                    }
                  }}
                >
                  E-COMMERCE
                </div>
              </div>
            </header>
          </div>

          <div className="auth-panel auth-panel--user">
            <header className="auth-header">
              <Tag color="gold" bordered={false} className="mb-3 rounded-full px-3 py-1 font-semibold">
                Reset password
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
        <div className="grid gap-4 px-4 py-4 md:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div
              role="link"
              tabIndex={0}
              className="w-fit cursor-pointer rounded-2xl bg-stone-950 px-4 py-3 text-sm font-extrabold tracking-normal text-white"
              onClick={() => navigateTo(ROUTES.home)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  navigateTo(ROUTES.home)
                }
              }}
            >
              E-COMMERCE
            </div>

            <nav className="flex flex-wrap items-center gap-2 text-sm font-bold text-stone-800">
              <button
                type="button"
                className={`rounded-full px-4 py-2 transition ${pathname === ROUTES.home || pathname === ROUTES.products ? 'bg-stone-950 text-white' : 'hover:bg-stone-100'}`}
                style={pathname === ROUTES.home || pathname === ROUTES.products ? { color: '#ffffff' } : undefined}
                onClick={() => navigateTo(ROUTES.products)}
              >
                Shop
              </button>
              <button
                type="button"
                className={`rounded-full px-4 py-2 transition ${pathname === ROUTES.orders ? 'bg-stone-950 text-white' : 'hover:bg-stone-100'}`}
                style={pathname === ROUTES.orders ? { color: '#ffffff' } : undefined}
                onClick={() => navigateTo(isAuthenticated ? ROUTES.orders : ROUTES.login)}
              >
                Orders
              </button>
              <button
                type="button"
                className={`rounded-full px-4 py-2 transition ${pathname === ROUTES.profile ? 'bg-stone-950 text-white' : 'hover:bg-stone-100'}`}
                style={pathname === ROUTES.profile ? { color: '#ffffff' } : undefined}
                onClick={() => navigateTo(isAuthenticated ? ROUTES.profile : ROUTES.login)}
              >
                Account
              </button>
            </nav>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <Input
              className="w-full lg:max-w-[520px]"
              placeholder="Search products, categories, or keywords"
              size="large"
              value={headerSearchValue}
              onChange={(event) => handleHeaderSearchChange(event.target.value)}
            />
            <div className="flex flex-wrap items-center gap-2">
              <AntButton size="large" type="button" onClick={() => navigateTo(ROUTES.filter)}>
                Filter
              </AntButton>
              <AntButton
                size="large"
                onClick={() => navigateTo(isAuthenticated ? ROUTES.wishlist : ROUTES.login)}
              >
                Wishlist ({wishlistItems.length})
              </AntButton>
              <AntButton
                size="large"
                type="primary"
                onClick={() => navigateTo(isAuthenticated ? ROUTES.cart : ROUTES.login)}
              >
                Cart ({cartTotalItems})
              </AntButton>
              {isAuthenticated ? (
                <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} trigger={['hover']} placement="bottomRight">
                  <AntButton shape="circle" size="large" aria-label="Account">
                    {userBadgeLabel || 'U'}
                  </AntButton>
                </Dropdown>
              ) : (
                <AntButton
                  size="large"
                  onClick={() => navigateTo(ROUTES.login)}
                >
                  Sign in
                </AntButton>
              )}
              {isAuthenticated ? (
                <AntButton size="large" onClick={handleLogout}>
                  Logout
                </AntButton>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {renderPage()}
    </div>
  )
}

export default AppRouter
