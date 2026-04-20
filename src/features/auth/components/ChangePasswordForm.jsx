import { useState } from 'react'
import Button from '../../../shared/ui/Button'
import Input from '../../../shared/ui/Input'
import { handleApiError } from '../../../shared/utils/handleApiError'
import { authClientApi } from '../api/authClient.api'

function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    confirmPassword: '',
    newPassword: '',
    oldPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState('')

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

  const validate = () => {
    const nextErrors = {}

    if (!formData.oldPassword) {
      nextErrors.oldPassword = 'Current password is required'
    }

    if (!formData.newPassword) {
      nextErrors.newPassword = 'New password is required'
    } else if (formData.newPassword.length < 8) {
      nextErrors.newPassword = 'New password must be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = 'Password confirmation is required'
    } else if (formData.confirmPassword !== formData.newPassword) {
      nextErrors.confirmPassword = 'Password confirmation does not match'
    }

    return nextErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate()

    setErrors(nextErrors)
    setErrorMessage('')

    if (Object.keys(nextErrors).length > 0) {
      setStatus('')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await authClientApi.changePassword(formData)
      setStatus(response.message)
      setFormData({
        confirmPassword: '',
        newPassword: '',
        oldPassword: '',
      })
    } catch (error) {
      setStatus('')
      setErrorMessage(handleApiError(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      className="grid gap-5 rounded-2xl border border-stone-200 bg-white/85 p-6 shadow-[0_20px_45px_rgba(63,39,18,0.08)] backdrop-blur"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-2">
        <label className="text-sm font-medium text-stone-700" htmlFor="old-password">
          Current password
        </label>
        <Input
          id="old-password"
          type="password"
          value={formData.oldPassword}
          onChange={handleChange('oldPassword')}
          placeholder="Enter your current password"
        />
        {errors.oldPassword ? <p className="text-sm text-rose-600">{errors.oldPassword}</p> : null}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-stone-700" htmlFor="new-password">
          New password
        </label>
        <Input
          id="new-password"
          type="password"
          value={formData.newPassword}
          onChange={handleChange('newPassword')}
          placeholder="At least 8 characters"
        />
        {errors.newPassword ? <p className="text-sm text-rose-600">{errors.newPassword}</p> : null}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-stone-700" htmlFor="confirm-password">
          Confirm new password
        </label>
        <Input
          id="confirm-password"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          placeholder="Retype the new password"
        />
        {errors.confirmPassword ? (
          <p className="text-sm text-rose-600">{errors.confirmPassword}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Change password'}
        </Button>
      </div>

      {status ? (
        <span className="inline-flex w-fit items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
          {status}
        </span>
      ) : null}
      {errorMessage ? <p className="text-sm text-rose-600">{errorMessage}</p> : null}
    </form>
  )
}

export default ChangePasswordForm
