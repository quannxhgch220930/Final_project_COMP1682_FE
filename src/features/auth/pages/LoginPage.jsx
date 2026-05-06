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
    <section className="login-page-shell grid gap-6">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl">
          WELCOME BACK
        </h2>
        <p className="mt-2 text-sm font-medium text-stone-700">
          Please enter your email and password to login
        </p>
      </div>

      <LoginForm
        theme="portal-light"
        cardClassName="login-page-form-card"
        emailLabel="email"
        emailPlaceholder="your email"
        forgotPasswordLabel="forgot password"
        onForgotPasswordClick={() => navigateTo(ROUTES.forgotPassword)}
        passwordLabel="password"
        passwordPlaceholder="your password"
        submitButtonClassName="login-page-submit-button"
        submitLabel="Log In"
        wrapperClassName="login-page-form"
        afterCardContent={
          <div className="grid gap-5">
            <div className="login-page-divider">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="login-page-secondary-button"
              onClick={handleGoogleLogin}
            >
              Login with Google
            </button>

            <div className="flex items-center justify-center gap-2 text-sm font-medium text-stone-700">
              <span>Don't have an account?</span>
              <button
                type="button"
                className="font-semibold text-stone-800 underline underline-offset-4 transition hover:text-stone-950"
                onClick={() => navigateTo(ROUTES.register)}
              >
                Sign Up
              </button>
            </div>
          </div>
        }
      />
    </section>
  )
}

export default LoginPage
