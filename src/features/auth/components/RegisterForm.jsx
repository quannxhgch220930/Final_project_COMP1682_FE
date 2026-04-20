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
    <form
      className="grid gap-5 rounded-2xl border border-amber-200/70 bg-white/70 p-6 shadow-[0_20px_45px_rgba(63,39,18,0.08)] backdrop-blur"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-2">
        <label className="text-sm font-medium text-stone-700" htmlFor="register-full-name">
          Full name
        </label>
        <Input
          id="register-full-name"
          className="border-amber-200/80 bg-white/85 text-stone-900 placeholder:text-stone-400 focus:border-amber-300 focus:ring-amber-100"
          value={formData.fullName}
          onChange={handleChange('fullName')}
          placeholder="Nguyen Van A"
        />
        {errors.fullName ? <p className="text-sm text-rose-600">{errors.fullName}</p> : null}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-stone-700" htmlFor="register-email">
          Email
        </label>
        <Input
          id="register-email"
          className="border-amber-200/80 bg-white/85 text-stone-900 placeholder:text-stone-400 focus:border-amber-300 focus:ring-amber-100"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          placeholder="you@example.com"
        />
        {errors.email ? <p className="text-sm text-rose-600">{errors.email}</p> : null}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-stone-700" htmlFor="register-password">
          Password
        </label>
        <Input
          id="register-password"
          className="border-amber-200/80 bg-white/85 text-stone-900 placeholder:text-stone-400 focus:border-amber-300 focus:ring-amber-100"
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          placeholder="At least 8 characters"
        />
        {errors.password ? <p className="text-sm text-rose-600">{errors.password}</p> : null}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-stone-700" htmlFor="register-confirm-password">
          Confirm password
        </label>
        <Input
          id="register-confirm-password"
          className="border-amber-200/80 bg-white/85 text-stone-900 placeholder:text-stone-400 focus:border-amber-300 focus:ring-amber-100"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          placeholder="Retype your password"
        />
        {errors.confirmPassword ? (
          <p className="text-sm text-rose-600">{errors.confirmPassword}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
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

export default RegisterForm
