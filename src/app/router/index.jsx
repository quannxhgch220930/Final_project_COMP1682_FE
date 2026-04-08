import { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import AdminLayout from '../layouts/AdminLayout'
import Button from '../../shared/ui/Button'
import ProtectedRoute from '../../shared/components/ProtectedRoute'
import { useAuth } from '../../features/auth/hooks/useAuth'
import ProductListPage from '../../features/product/pages/ProductListPage'
import LoginPage from '../../features/auth/pages/LoginPage'
import AdminProductsPage from '../../features/admin/products/pages/AdminProductsPage'
import ProfilePage from '../../features/user/pages/ProfilePage'

const TABS = {
  auth: 'auth',
  admin: 'admin',
  profile: 'profile',
  storefront: 'storefront',
}

function AppRouter() {
  const { initialized, isAuthenticated, logout, user } = useAuth()
  const [activeTab, setActiveTab] = useState(TABS.storefront)
  const isAdmin = user?.role === 'ADMIN'

  useEffect(() => {
    if (isAuthenticated && activeTab === TABS.auth) {
      setActiveTab(TABS.profile)
    }
  }, [activeTab, isAuthenticated])

  const handleSelectTab = (nextTab) => {
    if (nextTab === TABS.auth && isAuthenticated) {
      setActiveTab(TABS.profile)
      return
    }

    if (nextTab === TABS.admin && !isAdmin) {
      setActiveTab(TABS.storefront)
      return
    }

    setActiveTab(nextTab)
  }

  const renderPage = () => {
    if (activeTab === TABS.profile) {
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

    if (activeTab === TABS.auth) {
      return (
        <MainLayout>
          <ProtectedRoute
            allowed={!isAuthenticated}
            fallback={<ProfilePage />}
            loading={!initialized}
          >
            <LoginPage />
          </ProtectedRoute>
        </MainLayout>
      )
    }

    if (activeTab === TABS.admin) {
      return (
        <AdminLayout>
          <ProtectedRoute
            allowed={isAdmin}
            fallback={<p className="muted">Admin access required.</p>}
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

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Frontend Architecture Starter</p>
          <h1>Scaffolded feature-first workspace</h1>
        </div>

        <nav className="app-nav" aria-label="Demo sections">
          <Button
            type="button"
            variant={activeTab === TABS.storefront ? 'primary' : 'secondary'}
            onClick={() => handleSelectTab(TABS.storefront)}
          >
            Storefront
          </Button>
          {!isAuthenticated ? (
            <Button
              type="button"
              variant={activeTab === TABS.auth ? 'primary' : 'secondary'}
              onClick={() => handleSelectTab(TABS.auth)}
            >
              Auth
            </Button>
          ) : null}
          {isAuthenticated ? (
            <Button
              type="button"
              variant={activeTab === TABS.profile ? 'primary' : 'secondary'}
              onClick={() => handleSelectTab(TABS.profile)}
            >
              Profile
            </Button>
          ) : null}
          {isAdmin ? (
            <Button
              type="button"
              variant={activeTab === TABS.admin ? 'primary' : 'secondary'}
              onClick={() => handleSelectTab(TABS.admin)}
            >
              Admin
            </Button>
          ) : null}
          {isAuthenticated ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                logout()
                setActiveTab(TABS.storefront)
              }}
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
