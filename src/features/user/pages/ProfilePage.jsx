import { useEffect, useState } from 'react'
import ChangePasswordForm from '../../auth/components/ChangePasswordForm'
import ProfileForm from '../components/ProfileForm'
import { useProfile } from '../hooks/useProfile'
import { formatDate } from '../../../shared/utils/formatDate'

function ProfilePage() {
  const { getProfile, updateProfile, user } = useProfile()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getProfile().finally(() => {
      setIsLoading(false)
    })
  }, [])

  if (isLoading) {
    return <p className="muted">Loading profile...</p>
  }

  return (
    <section className="stack">
      <div className="section-heading">
        <p className="eyebrow">My Account</p>
        <h2>{user?.fullName || 'Profile'}</h2>
        <p className="muted">
          {user?.email || 'No email'} | {user?.role || 'USER'}
        </p>
      </div>

      <div className="card stack">
        <p>
          <strong>Verified:</strong> {user?.isVerified ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Locked:</strong> {user?.isLocked ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Provider:</strong> {user?.provider || 'LOCAL'}
        </p>
        <p>
          <strong>Created at:</strong>{' '}
          {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
        </p>
      </div>

      <ProfileForm initialValues={user} onSubmit={updateProfile} />

      <section className="stack">
        <div className="section-heading">
          <p className="eyebrow">Security</p>
          <h3>Change password</h3>
          <p className="muted">This action requires your current password.</p>
        </div>

        <ChangePasswordForm />
      </section>
    </section>
  )
}

export default ProfilePage
