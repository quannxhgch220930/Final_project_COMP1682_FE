import Button from '../../../shared/ui/Button'
import { API_ENDPOINTS } from '../../../shared/constants/api'
import { ROUTES } from '../../../shared/constants/routes'
import { API_BASE_URL } from '../../../shared/lib/axios'
import { navigateTo } from '../../../shared/lib/navigation'
import LoginForm from '../components/LoginForm'

function LoginPage() {
  const handleGoogleLogin = () => {
    if (typeof window === 'undefined') {
      return
    }

    window.location.assign(`${API_BASE_URL}${API_ENDPOINTS.auth.googleLogin}`)
  }

  return (
    <section className="grid gap-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
          ACCOUNT ACCESS
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          Use your customer account to continue to the storefront and profile area.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="secondary"
          className="border-stone-300 bg-white text-stone-800 hover:bg-stone-100"
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="border-amber-200 bg-amber-50 text-stone-800 hover:bg-amber-100"
          onClick={() => navigateTo(ROUTES.register)}
        >
          Create account
        </Button>
      </div>

      <LoginForm theme="portal-light" />
    </section>
  )
}

export default LoginPage
