import Button from '../../shared/ui/Button'
import { ROUTES } from '../../shared/constants/routes'
import { navigateTo } from '../../shared/lib/navigation'

function AdminLayout({ children, onLogout }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(74,144,226,0.18),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(0,214,201,0.14),transparent_24%),linear-gradient(180deg,#0b1220_0%,#111b2e_100%)] px-5 py-7 text-slate-50 md:px-7">
      <header className="mx-auto mb-6 flex max-w-[1360px] flex-col gap-6 rounded-[24px] border border-sky-200/20 bg-slate-900/80 p-6 shadow-[0_22px_60px_rgba(2,8,23,0.32)] backdrop-blur md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
            ADMIN PORTAL
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            Management workspace
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Dedicated dashboard for administrative actions and user control.
          </p>
        </div>

        <nav className="flex flex-wrap gap-3" aria-label="Admin navigation">
          <Button
            type="button"
            className="border-sky-200/20 bg-sky-300/10 text-slate-50 hover:bg-sky-300/20"
            variant="secondary"
            onClick={() => navigateTo(ROUTES.admin)}
          >
            Dashboard
          </Button>
          <Button type="button" className="bg-[linear-gradient(135deg,#4a90e2_0%,#00d6c9_100%)] text-slate-950 hover:bg-[linear-gradient(135deg,#5b9df1_0%,#16e0d3_100%)]" onClick={onLogout}>
            Logout
          </Button>
        </nav>
      </header>

      <main className="mx-auto max-w-[1360px]">
        <section className="rounded-[24px] border border-sky-200/20 bg-slate-900/80 p-7 shadow-[0_22px_60px_rgba(2,8,23,0.32)] backdrop-blur md:p-8">
          {children}
        </section>
      </main>
    </div>
  )
}

export default AdminLayout
