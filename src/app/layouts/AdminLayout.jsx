import Button from '../../shared/ui/Button'
import { ROUTES } from '../../shared/constants/routes'
import { navigateTo, usePathname } from '../../shared/lib/navigation'

function AdminLayout({ children, onLogout }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(180,120,58,0.16),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(230,185,118,0.12),transparent_26%),linear-gradient(180deg,#13100d_0%,#201912_100%)] px-5 py-7 text-stone-100 md:px-7">
      <header className="mx-auto mb-6 flex max-w-[1360px] flex-col gap-6 rounded-[24px] border border-amber-200/15 bg-[rgba(31,24,18,0.82)] p-6 shadow-[0_22px_60px_rgba(10,8,5,0.36)] backdrop-blur md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-100/70">
            ADMIN PORTAL
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-stone-50">
            Management workspace
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-stone-300">
            Dedicated dashboard for administrative actions and user control.
          </p>
        </div>

        <nav className="flex flex-wrap gap-3" aria-label="Admin navigation">
          <Button
            type="button"
            className="border-amber-200/15 bg-amber-200/8 text-stone-100 hover:bg-amber-200/14"
            variant={
              pathname === ROUTES.admin || pathname === ROUTES.adminProducts
                ? 'primary'
                : 'secondary'
            }
            onClick={() => navigateTo(ROUTES.adminProducts)}
          >
            Products
          </Button>
          <Button
            type="button"
            className="border-amber-200/15 bg-amber-200/8 text-stone-100 hover:bg-amber-200/14"
            variant={pathname === ROUTES.adminOrders ? 'primary' : 'secondary'}
            onClick={() => navigateTo(ROUTES.adminOrders)}
          >
            Orders
          </Button>
          <Button
            type="button"
            className="border-amber-200/15 bg-amber-200/8 text-stone-100 hover:bg-amber-200/14"
            variant={pathname === ROUTES.adminUsers ? 'primary' : 'secondary'}
            onClick={() => navigateTo(ROUTES.adminUsers)}
          >
            Users
          </Button>
          <Button
            type="button"
            className="bg-[linear-gradient(135deg,#d6a85f_0%,#b8753a_100%)] text-stone-950 hover:bg-[linear-gradient(135deg,#dfb66f_0%,#c78346_100%)]"
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
