import { useState } from 'react'
import { Alert, Card, Typography } from 'antd'
import Button from '../../../shared/ui/Button'
import Input from '../../../shared/ui/Input'
import { ROUTES } from '../../../shared/constants/routes'
import { navigateTo } from '../../../shared/lib/navigation'
import { handleApiError } from '../../../shared/utils/handleApiError'
import { authClientApi } from '../api/authClient.api'
import { useAuth } from '../hooks/useAuth'

const { Paragraph, Text } = Typography

function LoginForm({
  afterCardContent = null,
  adminOnly = false,
  cardClassName = '',
  emailLabel = 'Email',
  emailPlaceholder = 'you@example.com',
  forgotPasswordLabel = '',
  onForgotPasswordClick,
  theme = 'default',
  passwordLabel = 'Password',
  passwordPlaceholder = 'Enter your password',
  submitLabel = 'Login',
  submittingLabel = 'Logging in...',
  submitButtonClassName = '',
  wrapperClassName = '',
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
      ? 'border-amber-300 bg-white'
      : 'border-stone-300 bg-white'
  const labelClassName = isDarkPortal ? 'text-amber-50' : 'text-stone-700'
  const inputClassName = isDarkPortal
    ? 'border-amber-300 bg-stone-950 text-amber-50 placeholder:text-stone-300 focus:border-amber-200 focus:ring-amber-200/20'
    : isLightPortal
      ? 'border-amber-400 bg-white text-stone-950 placeholder:text-stone-700 focus:border-amber-500 focus:ring-amber-100'
      : ''
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

      navigateTo(adminOnly ? ROUTES.admin : ROUTES.home, {
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
      className={`grid gap-5 ${wrapperClassName}`.trim()}
      onSubmit={handleSubmit}
    >
      <Card
        className={`${panelClassName} ${cardClassName}`.trim()}
        styles={{ body: { padding: 24 } }}
      >
        <div className="grid gap-5">
          <div className="grid gap-2">
            <label className={`text-sm font-medium ${labelClassName}`} htmlFor="email">
              {emailLabel}
            </label>
            <Input
              id="email"
              className={inputClassName}
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              placeholder={emailPlaceholder}
            />
          </div>

          <div className="grid gap-2">
            <label className={`text-sm font-medium ${labelClassName}`} htmlFor="password">
              {passwordLabel}
            </label>
            <Input
              id="password"
              className={inputClassName}
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              placeholder={passwordPlaceholder}
            />
          </div>

          {forgotPasswordLabel ? (
            <div className="flex justify-end">
              <button
                type="button"
                className={`text-sm underline-offset-4 transition hover:underline ${isDarkPortal ? 'text-amber-100' : 'text-[#8e4f22]'}`}
                onClick={onForgotPasswordClick}
              >
                {forgotPasswordLabel}
              </button>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              className={submitButtonClassName}
              disabled={isSubmitting}
            >
              {isSubmitting ? submittingLabel : submitLabel}
            </Button>
          </div>

          {status ? <Alert type="success" message={status} showIcon /> : null}
        </div>
      </Card>

      {errorMessage ? (
        <div className="grid gap-3">
          <Alert type="error" message={errorMessage} showIcon />
          {canResendVerify ? (
            <div className="flex flex-wrap items-center gap-3">
              <Paragraph className={`!mb-0 text-sm font-medium ${isDarkPortal ? '!text-stone-200' : '!text-stone-700'}`}>
                This account may still be waiting for email verification.
              </Paragraph>
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
        <Alert
          type="warning"
          message={<Text className={verifyStatusClassName}>{verifyStatus}</Text>}
          showIcon
        />
      ) : null}
      {afterCardContent}
    </form>
  )
}

export default LoginForm
