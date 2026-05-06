import Button from '../../../shared/ui/Button'
import { ROUTES } from '../../../shared/constants/routes'
import { navigateTo } from '../../../shared/lib/navigation'
import ForgotPasswordForm from '../components/ForgotPasswordForm'

function ForgotPasswordPage() {
  return (
    <section className="grid gap-6">
      <div>
        <p className="mt-2 text-sm font-medium text-stone-700">
          Enter your email and we will send you an email to reset your password.
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
