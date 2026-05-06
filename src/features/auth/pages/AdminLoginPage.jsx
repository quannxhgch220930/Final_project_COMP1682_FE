import LoginForm from '../components/LoginForm'

function AdminLoginPage() {
  return (
    <section className="grid gap-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-stone-50">
          WELCOME ADMIN
        </h2>
        <p className="mt-2 text-sm text-stone-300">
          use your admin Access account to manage the dashboard
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
