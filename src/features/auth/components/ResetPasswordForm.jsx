import { useMemo, useState } from 'react'
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
      className="grid gap-5 rounded-2xl border border-amber-200/70 bg-white/70 p-6 shadow-[0_20px_45px_rgba(63,39,18,0.08)] backdrop-blur"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-2">
        <label className="text-sm font-medium text-stone-700" htmlFor="reset-password-new-password">
          New password
        </label>
        <Input
          id="reset-password-new-password"
          className="border-amber-200/80 bg-white/85 text-stone-900 placeholder:text-stone-400 focus:border-amber-300 focus:ring-amber-100"
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
          className="border-amber-200/80 bg-white/85 text-stone-900 placeholder:text-stone-400 focus:border-amber-300 focus:ring-amber-100"
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

      {status ? (
        <div className="grid gap-3">
          <span className="inline-flex w-fit items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
            {status}
          </span>
          <div>
            <Button type="button" variant="secondary" onClick={() => navigateTo(ROUTES.login)}>
              Go to login
            </Button>
          </div>
        </div>
      ) : null}
      {errorMessage ? <p className="text-sm text-rose-600">{errorMessage}</p> : null}
    </form>
  )
}

export default ResetPasswordForm
