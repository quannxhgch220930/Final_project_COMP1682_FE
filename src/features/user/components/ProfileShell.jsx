import { usePathname, navigateTo } from '../../../shared/lib/navigation'
import { ROUTES } from '../../../shared/constants/routes'

const navigationItems = [
  { key: ROUTES.profile, label: 'Overview' },
  { key: ROUTES.cart, label: 'Cart' },
  { key: ROUTES.wishlist, label: 'Wishlist' },
  { key: ROUTES.orders, label: 'Orders' },
  { key: ROUTES.profileEdit, label: 'Edit profile' },
  { key: ROUTES.profileAddress, label: 'Shipping address' },
  { key: ROUTES.profilePassword, label: 'Change password' },
]

function ProfileShell({ children }) {
  const pathname = usePathname()

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="h-fit overflow-hidden rounded-3xl border border-stone-300 bg-white shadow-[0_18px_45px_rgba(63,39,18,0.07)]">
        <div className="border-b border-stone-800 bg-stone-950 px-5 py-6 text-white">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-300">
            Customer center
          </p>
          <h2 className="mt-2 text-xl font-bold tracking-normal text-white">
            My shopping account
          </h2>
          <p className="mt-2 text-sm font-medium leading-6 text-white">
            Manage cart, saved products, orders, and delivery information.
          </p>
        </div>

        <div className="space-y-2 p-3">
          {navigationItems.map((item) => {
            const isActive = pathname === item.key

            return (
              <button
                key={item.key}
                type="button"
                className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                  isActive
                    ? 'border-stone-950 bg-stone-950 text-white'
                    : 'border-stone-300 bg-white text-stone-800 hover:border-stone-700 hover:bg-stone-50'
                }`}
                style={isActive ? { color: '#ffffff' } : undefined}
                onClick={() => navigateTo(item.key)}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </aside>

      <div>{children}</div>
    </div>
  )
}

export default ProfileShell
