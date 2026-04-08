import { useState } from 'react'
import Button from '../../../shared/ui/Button'
import LoginForm from '../components/LoginForm'
import RegisterPage from './RegisterPage'

const AUTH_VIEWS = {
  login: 'login',
  register: 'register',
}

function LoginPage() {
  const [activeView, setActiveView] = useState(AUTH_VIEWS.login)

  if (activeView === AUTH_VIEWS.register) {
    return (
      <section className="stack">
        <div className="button-row">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setActiveView(AUTH_VIEWS.login)}
          >
            Back to login
          </Button>
        </div>
        <RegisterPage />
      </section>
    )
  }

  return (
    <section className="stack">
      <div className="section-heading">
        <p className="eyebrow">Authentication</p>
        <h2>Login page scaffold</h2>
        <p className="muted">
          Feature folders are ready for real API, validation, and state logic.
        </p>
      </div>

      <div className="button-row">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setActiveView(AUTH_VIEWS.register)}
        >
          Create account
        </Button>
      </div>

      <LoginForm />
    </section>
  )
}

export default LoginPage
