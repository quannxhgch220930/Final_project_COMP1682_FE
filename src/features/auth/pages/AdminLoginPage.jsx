import LoginForm from '../components/LoginForm'

function AdminLoginPage() {
  return (
    <section className="grid gap-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
          ADMIN ACCESS
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          Sign in to the control room
        </h2>
        <p className="mt-2 text-sm text-slate-300">
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
