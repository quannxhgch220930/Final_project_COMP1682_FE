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
    <form className="auth-card stack" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="old-password">Current password</label>
        <Input
          id="old-password"
          type="password"
          value={formData.oldPassword}
          onChange={handleChange('oldPassword')}
          placeholder="Enter your current password"
        />
        {errors.oldPassword ? <p className="error-text">{errors.oldPassword}</p> : null}
      </div>

      <div className="field">
        <label htmlFor="new-password">New password</label>
        <Input
          id="new-password"
          type="password"
          value={formData.newPassword}
          onChange={handleChange('newPassword')}
          placeholder="At least 8 characters"
        />
        {errors.newPassword ? <p className="error-text">{errors.newPassword}</p> : null}
      </div>

      <div className="field">
        <label htmlFor="confirm-password">Confirm new password</label>
        <Input
          id="confirm-password"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          placeholder="Retype the new password"
        />
        {errors.confirmPassword ? (
          <p className="error-text">{errors.confirmPassword}</p>
        ) : null}
      </div>

      <div className="button-row">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Change password'}
        </Button>
      </div>

      {status ? <span className="badge">{status}</span> : null}
      {errorMessage ? <p className="error-text">{errorMessage}</p> : null}
    </form>
  )
}

export default ChangePasswordForm
