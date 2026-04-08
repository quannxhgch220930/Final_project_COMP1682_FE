import { useState } from 'react'
import Button from '../../../shared/ui/Button'
import Input from '../../../shared/ui/Input'
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

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validateRegister(formData)
    setErrors(nextErrors)
    setErrorMessage('')

    if (Object.keys(nextErrors).length > 0) {
      setStatus('')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await authClientApi.register(formData)
      setStatus(response.message)
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

  return (
    <form className="auth-card stack" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="register-full-name">Họ tên</label>
        <Input
          id="register-full-name"
          value={formData.fullName}
          onChange={handleChange('fullName')}
          placeholder="Nguyen Van A"
        />
        {errors.fullName ? <p className="error-text">{errors.fullName}</p> : null}
      </div>

      <div className="field">
        <label htmlFor="register-email">Email</label>
        <Input
          id="register-email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          placeholder="you@example.com"
        />
        {errors.email ? <p className="error-text">{errors.email}</p> : null}
      </div>

      <div className="field">
        <label htmlFor="register-password">Mật khẩu</label>
        <Input
          id="register-password"
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          placeholder="Tối thiểu 8 ký tự"
        />
        {errors.password ? <p className="error-text">{errors.password}</p> : null}
      </div>

      <div className="field">
        <label htmlFor="register-confirm-password">Xác nhận mật khẩu</label>
        <Input
          id="register-confirm-password"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          placeholder="Nhập lại mật khẩu"
        />
        {errors.confirmPassword ? (
          <p className="error-text">{errors.confirmPassword}</p>
        ) : null}
      </div>

      <div className="button-row">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </Button>
      </div>

      {status ? <span className="badge">{status}</span> : null}
      {errorMessage ? <p className="error-text">{errorMessage}</p> : null}
    </form>
  )
}

export default RegisterForm
