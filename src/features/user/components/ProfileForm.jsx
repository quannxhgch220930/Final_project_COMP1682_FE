import { useEffect, useState } from 'react'
import Button from '../../../shared/ui/Button'
import Input from '../../../shared/ui/Input'
import { handleApiError } from '../../../shared/utils/handleApiError'

function ProfileForm({ initialValues, onSubmit }) {
  const [formData, setFormData] = useState({
    avatarUrl: '',
    fullName: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    setFormData({
      avatarUrl: initialValues?.avatarUrl || '',
      fullName: initialValues?.fullName || '',
    })
  }, [initialValues])

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
      const response = await onSubmit(formData)
      setStatus(response?.message || 'Profile updated successfully')
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
        <label className="text-sm font-medium text-stone-700" htmlFor="profile-full-name">
          Full name
        </label>
        <Input
          id="profile-full-name"
          value={formData.fullName}
          onChange={handleChange('fullName')}
          placeholder="Nguyen Van A"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-stone-700" htmlFor="profile-avatar-url">
          Avatar URL
        </label>
        <Input
          id="profile-avatar-url"
          value={formData.avatarUrl}
          onChange={handleChange('avatarUrl')}
          placeholder="https://example.com/avatar.jpg"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save profile'}
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

export default ProfileForm
