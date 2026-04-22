import Button from '../../../shared/ui/Button'
import { ROUTES } from '../../../shared/constants/routes'
import { navigateTo } from '../../../shared/lib/navigation'
import ForgotPasswordForm from '../components/ForgotPasswordForm'

function ForgotPasswordPage() {
  return (
    <section className="grid gap-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
          PASSWORD RECOVERY
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
          Forgot your password?
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          Enter your email and the backend will send a password reset instruction.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="secondary"
          className="border-amber-200 bg-amber-50 text-stone-800 hover:bg-amber-100"
          onClick={() => navigateTo(ROUTES.login)}
        >
          Back to login
        </Button>
      </div>

      <ForgotPasswordForm />
    </section>
  )
}

export default ForgotPasswordPage
