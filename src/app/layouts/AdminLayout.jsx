import { Button, Typography } from 'antd'
import { ROUTES } from '../../shared/constants/routes'
import { navigateTo, usePathname } from '../../shared/lib/navigation'

const { Paragraph, Title } = Typography

function AdminLayout({ children, onLogout }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(180,120,58,0.16),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(230,185,118,0.12),transparent_26%),linear-gradient(180deg,#13100d_0%,#201912_100%)] px-5 py-7 text-stone-100 md:px-7">
      <header className="mx-auto mb-6 flex max-w-[1360px] flex-col gap-6 rounded-[24px] border border-amber-200/15 bg-[rgba(31,24,18,0.82)] p-6 shadow-[0_22px_60px_rgba(10,8,5,0.36)] backdrop-blur md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-100/70">
            ADMIN PORTAL
          </p>
          <Title level={1} style={{ color: '#fafaf9', margin: 0, fontSize: '2.25rem' }}>
            Management workspace
          </Title>
          <Paragraph
            style={{
              color: '#d6d3d1',
              margin: '8px 0 0',
              maxWidth: '42rem',
            }}
          >
            Dedicated dashboard for administrative actions and user control.
          </Paragraph>
        </div>

        <nav className="flex flex-wrap gap-3" aria-label="Admin navigation">
          <Button
            size="large"
            type={pathname === ROUTES.admin || pathname === ROUTES.adminProducts ? 'primary' : 'default'}
            style={
              pathname === ROUTES.admin || pathname === ROUTES.adminProducts
                ? {
                    background: 'linear-gradient(135deg,#d6a85f 0%,#b8753a 100%)',
                    borderColor: '#d6a85f',
                    color: '#1c1917',
                  }
                : {
                    background: 'rgba(214,168,95,0.08)',
                    borderColor: 'rgba(252,211,153,0.15)',
                    color: '#f5f5f4',
                  }
            }
            onClick={() => navigateTo(ROUTES.adminProducts)}
          >
            Products
          </Button>
          <Button
            size="large"
            type={pathname === ROUTES.adminOrders ? 'primary' : 'default'}
            style={
              pathname === ROUTES.adminOrders
                ? {
                    background: 'linear-gradient(135deg,#d6a85f 0%,#b8753a 100%)',
                    borderColor: '#d6a85f',
                    color: '#1c1917',
                  }
                : {
                    background: 'rgba(214,168,95,0.08)',
                    borderColor: 'rgba(252,211,153,0.15)',
                    color: '#f5f5f4',
                  }
            }
            onClick={() => navigateTo(ROUTES.adminOrders)}
          >
            Orders
          </Button>
          <Button
            size="large"
            type={pathname === ROUTES.adminUsers ? 'primary' : 'default'}
            style={
              pathname === ROUTES.adminUsers
                ? {
                    background: 'linear-gradient(135deg,#d6a85f 0%,#b8753a 100%)',
                    borderColor: '#d6a85f',
                    color: '#1c1917',
                  }
                : {
                    background: 'rgba(214,168,95,0.08)',
                    borderColor: 'rgba(252,211,153,0.15)',
                    color: '#f5f5f4',
                  }
            }
            onClick={() => navigateTo(ROUTES.adminUsers)}
          >
            Users
          </Button>
          <Button
            size="large"
            type="primary"
            danger
            style={{
              background: 'linear-gradient(135deg,#d6a85f 0%,#b8753a 100%)',
              borderColor: '#d6a85f',
              color: '#1c1917',
            }}
            onClick={onLogout}
          >
            Logout
          </Button>
        </nav>
      </header>

      <main className="mx-auto max-w-[1360px]">
        <section className="rounded-[24px] border border-amber-200/15 bg-[rgba(31,24,18,0.82)] p-7 shadow-[0_22px_60px_rgba(10,8,5,0.36)] backdrop-blur md:p-8">
          {children}
        </section>
      </main>
    </div>
  )
}

export default AdminLayout
