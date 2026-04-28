import { useMemo, useState } from 'react'
import { Alert, Card } from 'antd'
import Button from '../../../shared/ui/Button'
import Input from '../../../shared/ui/Input'
import { ROUTES } from '../../../shared/constants/routes'
import { navigateTo } from '../../../shared/lib/navigation'
import { handleApiError } from '../../../shared/utils/handleApiError'
import { authClientApi } from '../api/authClient.api'
import { validateResetPassword } from '../validation/auth.validation'

function getResetToken() {
  if (typeof window === 'undefined') {
    return ''
  }

  return new URLSearchParams(window.location.search).get('token') || ''
}

function ResetPasswordForm() {
  const token = useMemo(getResetToken, [])
  const [confirmPassword, setConfirmPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validateResetPassword({ confirmPassword, newPassword })
    setErrors(nextErrors)
    setErrorMessage('')

    if (!token) {
      setStatus('')
      setErrorMessage('Reset token is missing')
      return
    }

    if (Object.keys(nextErrors).length > 0) {
      setStatus('')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await authClientApi.resetPassword({
        confirmPassword,
        newPassword,
        token,
      })
      setStatus(response.message)
    } catch (error) {
      setStatus('')
      setErrorMessage(handleApiError(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      className="grid gap-5"
      onSubmit={handleSubmit}
    >
      <Card className="border-amber-200/70 bg-white/80" styles={{ body: { padding: 24 } }}>
        <div className="grid gap-5">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-stone-700" htmlFor="reset-password-new-password">
              New password
            </label>
            <Input
              id="reset-password-new-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="At least 8 characters"
            />
            {errors.newPassword ? (
              <p className="text-sm text-rose-600">{errors.newPassword}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <label
              className="text-sm font-medium text-stone-700"
              htmlFor="reset-password-confirm-password"
            >
              Confirm password
            </label>
            <Input
              id="reset-password-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Retype your new password"
            />
            {errors.confirmPassword ? (
              <p className="text-sm text-rose-600">{errors.confirmPassword}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Resetting...' : 'Reset password'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="border-amber-200 bg-amber-50 text-stone-800 hover:bg-amber-100"
              onClick={() => navigateTo(ROUTES.login)}
            >
              Back to login
            </Button>
          </div>
        </div>
      </Card>

      {status ? (
        <div className="grid gap-3">
          <Alert type="success" message={status} showIcon />
          <div>
            <Button type="button" variant="secondary" onClick={() => navigateTo(ROUTES.login)}>
              Go to login
            </Button>
          </div>
        </div>
      ) : null}
      {errorMessage ? <Alert type="error" message={errorMessage} showIcon /> : null}
    </form>
  )
}

export default ResetPasswordForm
