import { useState } from 'react'
import { Alert, Card } from 'antd'
import Button from '../../../shared/ui/Button'
import Input from '../../../shared/ui/Input'
import { ROUTES } from '../../../shared/constants/routes'
import { navigateTo } from '../../../shared/lib/navigation'
import { handleApiError } from '../../../shared/utils/handleApiError'
import { authClientApi } from '../api/authClient.api'
import { validateRegister } from '../validation/auth.validation'

function RegisterForm() {
  const [formData, setFormData] = useState({
    confirmPassword: '',
    email: '',
    fullName: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [errorMessage, setErrorMessage] = useState('')
  const [lastRegisteredEmail, setLastRegisteredEmail] = useState('')
  const [isResending, setIsResending] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState('')
  const [verifyStatus, setVerifyStatus] = useState('')

  const handleChange = (field) => (event) => {
    setFormData((currentValue) => ({
      ...currentValue,
      [field]: event.target.value,
    }))

    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: '',
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validateRegister(formData)
    setErrors(nextErrors)
    setErrorMessage('')
    setVerifyStatus('')

    if (Object.keys(nextErrors).length > 0) {
      setStatus('')
      return
    }

    setIsSubmitting(true)

    try {
      const submittedEmail = formData.email.trim()
      const response = await authClientApi.register(formData)
      setStatus(response.message)
      setLastRegisteredEmail(submittedEmail)
      setFormData({
        confirmPassword: '',
        email: '',
        fullName: '',
        password: '',
      })
    } catch (error) {
      setStatus('')
      setErrorMessage(handleApiError(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendVerify = async () => {
    if (!lastRegisteredEmail) {
      return
    }

    setErrorMessage('')
    setVerifyStatus('')
    setIsResending(true)

    try {
      const response = await authClientApi.resendVerify(lastRegisteredEmail)
      setVerifyStatus(response.message)
    } catch (error) {
      setErrorMessage(handleApiError(error))
    } finally {
      setIsResending(false)
    }
  }

  return (
    <form
      className="login-page-form grid gap-5"
      onSubmit={handleSubmit}
    >
      <Card className="login-page-form-card" styles={{ body: { padding: 24 } }}>
        <div className="grid gap-5">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-stone-700" htmlFor="register-full-name">
              Full name
            </label>
            <Input
              id="register-full-name"
              value={formData.fullName}
              onChange={handleChange('fullName')}
              placeholder="your full name"
            />
            {errors.fullName ? <p className="text-sm text-rose-600">{errors.fullName}</p> : null}
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-stone-700" htmlFor="register-email">
              Email
            </label>
            <Input
              id="register-email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="your email"
            />
            {errors.email ? <p className="text-sm text-rose-600">{errors.email}</p> : null}
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-stone-700" htmlFor="register-password">
              Password
            </label>
            <Input
              id="register-password"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              placeholder="your password"
            />
            {errors.password ? <p className="text-sm text-rose-600">{errors.password}</p> : null}
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-stone-700" htmlFor="register-confirm-password">
              Confirm password
            </label>
            <Input
              id="register-confirm-password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              placeholder="confirn password"
            />
            {errors.confirmPassword ? (
              <p className="text-sm text-rose-600">{errors.confirmPassword}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              className="login-page-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-center gap-2 text-sm font-medium text-stone-700">
        <span>Already have an account</span>
        <button
          type="button"
          className="font-semibold text-stone-800 underline underline-offset-4 transition hover:text-stone-950"
          onClick={() => navigateTo(ROUTES.login)}
        >
          Log in
        </button>
      </div>

      {status ? (
        <div className="grid gap-3">
          <Alert type="success" message={status} showIcon />
          {lastRegisteredEmail ? (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-medium text-stone-700">
                Didn&apos;t receive the verification email for{' '}
                <strong className="text-stone-900">{lastRegisteredEmail}</strong>?
              </p>
              <Button
                type="button"
                variant="secondary"
                disabled={isResending}
                onClick={handleResendVerify}
              >
                {isResending ? 'Sending...' : 'Resend verification'}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
      {verifyStatus ? (
        <Alert type="warning" message={verifyStatus} showIcon />
      ) : null}
      {errorMessage ? <Alert type="error" message={errorMessage} showIcon /> : null}
    </form>
  )
}

export default RegisterForm
