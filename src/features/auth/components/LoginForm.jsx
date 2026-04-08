import { useState } from 'react'
import Button from '../../../shared/ui/Button'
import Input from '../../../shared/ui/Input'
import { handleApiError } from '../../../shared/utils/handleApiError'
import { useAuth } from '../hooks/useAuth'

function LoginForm() {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState('')

  const handleChange = (field) => (event) => {
    setFormData((currentValue) => ({
      ...currentValue,
      [field]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const response = await login(formData)
      setStatus(response?.message || 'Login request completed')
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
        <label htmlFor="email">Email</label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          placeholder="you@example.com"
        />
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          placeholder="Enter your password"
        />
      </div>

      <div className="button-row">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </div>

      {status ? <span className="badge">{status}</span> : null}
      {errorMessage ? <p className="error-text">{errorMessage}</p> : null}
    </form>
  )
}

export default LoginForm
