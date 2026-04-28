import { useState } from 'react'
import { Alert, Card } from 'antd'
import Button from '../../../shared/ui/Button'
import Input from '../../../shared/ui/Input'
import { handleApiError } from '../../../shared/utils/handleApiError'
import { authClientApi } from '../api/authClient.api'
import { validateForgotPassword } from '../validation/auth.validation'

function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validateForgotPassword({ email })
    setErrors(nextErrors)
    setErrorMessage('')

    if (Object.keys(nextErrors).length > 0) {
      setStatus('')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await authClientApi.forgotPassword({ email })
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
            <label className="text-sm font-medium text-stone-700" htmlFor="forgot-password-email">
              Email
            </label>
            <Input
              id="forgot-password-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
            {errors.email ? <p className="text-sm text-rose-600">{errors.email}</p> : null}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send reset email'}
            </Button>
          </div>
        </div>
      </Card>

      {status ? <Alert type="success" message={status} showIcon /> : null}
      {errorMessage ? <Alert type="error" message={errorMessage} showIcon /> : null}
    </form>
  )
}

export default ForgotPasswordForm
