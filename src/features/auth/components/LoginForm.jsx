import { useState } from 'react'
import Button from '../../../shared/ui/Button'
import Input from '../../../shared/ui/Input'
import { ROUTES } from '../../../shared/constants/routes'
import { navigateTo } from '../../../shared/lib/navigation'
import { handleApiError } from '../../../shared/utils/handleApiError'
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState('')
  const isDarkPortal = theme === 'portal-dark'
  const isLightPortal = theme === 'portal-light'
  const panelClassName = isDarkPortal
    ? 'border-sky-200/20 bg-slate-900/80'
    : isLightPortal
      ? 'border-amber-200/70 bg-white/70'
      : 'border-stone-200 bg-white/85'
  const labelClassName = isDarkPortal ? 'text-slate-100' : 'text-stone-700'
  const inputClassName = isDarkPortal
    ? 'border-sky-200/20 bg-slate-950/70 text-white placeholder:text-slate-400 focus:border-sky-300/40 focus:ring-sky-200/10'
    : isLightPortal
      ? 'border-amber-200/80 bg-white/85 text-stone-900 placeholder:text-stone-400 focus:border-amber-300 focus:ring-amber-100'
      : ''
  const statusClassName = isDarkPortal
    ? 'bg-cyan-400/15 text-cyan-100'
    : 'bg-emerald-100 text-emerald-700'
  const errorClassName = isDarkPortal ? 'text-rose-200' : 'text-rose-600'

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
        <p className={`text-sm ${errorClassName}`}>
          {errorMessage}
        </p>
      ) : null}
    </form>
  )
}

export default LoginForm
