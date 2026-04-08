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
    <form className="auth-card stack" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="profile-full-name">Full name</label>
        <Input
          id="profile-full-name"
          value={formData.fullName}
          onChange={handleChange('fullName')}
          placeholder="Nguyen Van A"
        />
      </div>

      <div className="field">
        <label htmlFor="profile-avatar-url">Avatar URL</label>
        <Input
          id="profile-avatar-url"
          value={formData.avatarUrl}
          onChange={handleChange('avatarUrl')}
          placeholder="https://example.com/avatar.jpg"
        />
      </div>

      <div className="button-row">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save profile'}
        </Button>
      </div>

      {status ? <span className="badge">{status}</span> : null}
      {errorMessage ? <p className="error-text">{errorMessage}</p> : null}
    </form>
  )
}

export default ProfileForm
