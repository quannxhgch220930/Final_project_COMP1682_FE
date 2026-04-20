import Button from '../../../shared/ui/Button'
import { ROUTES } from '../../../shared/constants/routes'
import { navigateTo } from '../../../shared/lib/navigation'
import RegisterForm from '../components/RegisterForm'

function RegisterPage() {
  return (
    <section className="grid gap-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
          CUSTOMER SETUP
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          Fill in your basic details to open a storefront account.
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

      <RegisterForm />
    </section>
  )
}

export default RegisterPage
