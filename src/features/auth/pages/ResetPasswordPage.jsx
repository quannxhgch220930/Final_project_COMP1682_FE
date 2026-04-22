import ResetPasswordForm from '../components/ResetPasswordForm'

function ResetPasswordPage() {
  return (
    <section className="grid gap-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
          RESET PASSWORD
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
          Set a new password
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          Enter your new password to complete the recovery process.
        </p>
      </div>

      <ResetPasswordForm />
    </section>
  )
}

export default ResetPasswordPage
