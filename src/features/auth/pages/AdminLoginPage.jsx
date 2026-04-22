import LoginForm from '../components/LoginForm'

function AdminLoginPage() {
  return (
    <section className="grid gap-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-100/70">
          ADMIN ACCESS
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-stone-50">
          Sign in to the control room
        </h2>
        <p className="mt-2 text-sm text-stone-300">
          This entry point is reserved for administrator accounts only.
        </p>
      </div>

      <LoginForm
        adminOnly
        theme="portal-dark"
        submitLabel="Access admin"
        submittingLabel="Opening admin..."
      />
    </section>
  )
}

export default AdminLoginPage
