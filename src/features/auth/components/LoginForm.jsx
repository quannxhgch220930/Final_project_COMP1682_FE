import { useState } from 'react'
import Button from '../../../shared/ui/Button'
import Input from '../../../shared/ui/Input'
import { ROUTES } from '../../../shared/constants/routes'
import { navigateTo } from '../../../shared/lib/navigation'
import { handleApiError } from '../../../shared/utils/handleApiError'
import { authClientApi } from '../api/authClient.api'
import { useAuth } from '../hooks/useAuth'

function LoginForm({
  adminOnly = false,
  theme = 'default',
  submitLabel = 'Login',
  submittingLabel = 'Logging in...',
}) {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [isResendingVerify, setIsResendingVerify] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState('')
  const [verifyStatus, setVerifyStatus] = useState('')
  const isDarkPortal = theme === 'portal-dark'
  const isLightPortal = theme === 'portal-light'
  const panelClassName = isDarkPortal
    ? 'border-amber-200/18 bg-[rgba(28,21,15,0.9)] shadow-[0_22px_50px_rgba(10,8,5,0.32)]'
    : isLightPortal
      ? 'border-amber-200/70 bg-white/70'
      : 'border-stone-200 bg-white/85'
  const labelClassName = isDarkPortal ? 'text-amber-50' : 'text-stone-700'
  const inputClassName = isDarkPortal
    ? 'border-amber-200/15 bg-[rgba(19,15,11,0.94)] text-amber-50 placeholder:text-stone-500 focus:border-amber-300/45 focus:ring-amber-200/10'
    : isLightPortal
      ? 'border-amber-200/80 bg-white/85 text-stone-900 placeholder:text-stone-400 focus:border-amber-300 focus:ring-amber-100'
      : ''
  const statusClassName = isDarkPortal
    ? 'bg-amber-300/12 text-amber-100'
    : 'bg-emerald-100 text-emerald-700'
  const errorClassName = isDarkPortal ? 'text-rose-300' : 'text-rose-600'
  const verifyStatusClassName = isDarkPortal
    ? 'bg-amber-300/12 text-amber-100'
    : 'bg-amber-100 text-amber-800'
  const canResendVerify =
    !adminOnly &&
    Boolean(formData.email.trim()) &&
    /verify|verified|verification|xac thuc|xác thực/i.test(errorMessage)

  const handleChange = (field) => (event) => {
    setFormData((currentValue) => ({
      ...currentValue,
      [field]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setVerifyStatus('')
    setIsSubmitting(true)

    try {
      const response = await login(formData, {
        adminOnly,
      })
      setStatus(response?.message || 'Login request completed')

      navigateTo(adminOnly ? ROUTES.admin : ROUTES.profile, {
        replace: true,
      })
    } catch (error) {
      setStatus('')
      setErrorMessage(handleApiError(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendVerify = async () => {
    const email = formData.email.trim()

    if (!email) {
      return
    }

    setErrorMessage('')
    setVerifyStatus('')
    setIsResendingVerify(true)

    try {
      const response = await authClientApi.resendVerify(email)
      setVerifyStatus(response.message)
    } catch (error) {
      setErrorMessage(handleApiError(error))
    } finally {
      setIsResendingVerify(false)
    }
  }

  return (
    <form
      className={`grid gap-5 rounded-2xl border p-6 shadow-[0_20px_45px_rgba(63,39,18,0.08)] backdrop-blur ${panelClassName}`.trim()}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-2">
        <label className={`text-sm font-medium ${labelClassName}`} htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          className={inputClassName}
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          placeholder="you@example.com"
        />
      </div>

      <div className="grid gap-2">
        <label className={`text-sm font-medium ${labelClassName}`} htmlFor="password">
          Password
        </label>
        <Input
          id="password"
          className={inputClassName}
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          placeholder="Enter your password"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </div>

      {status ? (
        <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-medium ${statusClassName}`}>
          {status}
        </span>
      ) : null}
      {errorMessage ? (
        <div className="grid gap-3">
          <p className={`text-sm ${errorClassName}`}>
            {errorMessage}
          </p>
          {canResendVerify ? (
            <div className="flex flex-wrap items-center gap-3">
              <p className={`text-sm ${isDarkPortal ? 'text-stone-300' : 'text-stone-600'}`}>
                This account may still be waiting for email verification.
              </p>
              <Button
                type="button"
                variant="secondary"
                disabled={isResendingVerify}
                onClick={handleResendVerify}
              >
                {isResendingVerify ? 'Sending...' : 'Resend verification'}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
      {verifyStatus ? (
        <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-medium ${verifyStatusClassName}`}>
          {verifyStatus}
        </span>
      ) : null}
    </form>
  )
}

export default LoginForm
