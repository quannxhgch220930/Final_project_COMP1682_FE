import { useEffect, useState } from 'react'
import { Alert, Card } from 'antd'
import Button from '../../../shared/ui/Button'
import Input from '../../../shared/ui/Input'
import { handleApiError } from '../../../shared/utils/handleApiError'

function ProfileForm({ initialValues, onSubmit }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    setFormData({
      fullName: initialValues?.fullName || '',
      email: initialValues?.email || '',
      phone: initialValues?.phone || '',
      dateOfBirth: initialValues?.dateOfBirth || '',
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
      const response = await onSubmit({
        dateOfBirth: formData.dateOfBirth,
        fullName: formData.fullName,
        phone: formData.phone,
      })
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
      className="grid gap-5"
      onSubmit={handleSubmit}
    >
      <Card styles={{ body: { padding: 24 } }}>
        <div className="grid gap-5">
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
            <label className="text-sm font-medium text-stone-700" htmlFor="profile-email">
              Email
            </label>
            <Input
              id="profile-email"
              type="email"
              value={formData.email}
              readOnly
              aria-describedby="profile-email-note"
              className="cursor-not-allowed border-stone-300 bg-stone-100 font-semibold text-stone-700"
            />
            <p id="profile-email-note" className="text-xs font-medium text-stone-700">
              Email is used for account verification and cannot be changed here.
            </p>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-stone-700" htmlFor="profile-phone">
              Phone number
            </label>
            <Input
              id="profile-phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange('phone')}
              placeholder="0912345678"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-stone-700" htmlFor="profile-dob">
              Date of birth
            </label>
            <Input
              id="profile-dob"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange('dateOfBirth')}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save profile'}
            </Button>
          </div>
        </div>
      </Card>

      {status ? <Alert type="success" message={status} showIcon /> : null}
      {errorMessage ? <Alert type="error" message={errorMessage} showIcon /> : null}
    </form>
  )
}

export default ProfileForm
