import { useEffect, useEffectEvent, useState } from 'react'
import ChangePasswordForm from '../../auth/components/ChangePasswordForm'
import AddressBook from '../components/AddressBook'
import ProfileForm from '../components/ProfileForm'
import { useProfile } from '../hooks/useProfile'
import { formatDate } from '../../../shared/utils/formatDate'
import { handleApiError } from '../../../shared/utils/handleApiError'
import { useAuth } from '../../auth/hooks/useAuth'

function ProfilePage() {
  const { getProfile, updateProfile, user } = useProfile()
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const { logout } = useAuth()

  const loadProfile = useEffectEvent(async (isMounted) => {
    setErrorMessage('')

    try {
      await getProfile()
    } catch (error) {
      if (!isMounted()) {
        return
      }

      setErrorMessage(handleApiError(error))

      if (error?.status === 401) {
        logout()
      }
    } finally {
      if (isMounted()) {
        setIsLoading(false)
      }
    }
  })

  useEffect(() => {
    let mounted = true

    loadProfile(() => mounted)

    return () => {
      mounted = false
    }
  }, [])

  if (isLoading) {
    return <p className="text-sm text-stone-500">Loading profile...</p>
  }

  if (errorMessage) {
    return <p className="text-sm text-rose-600">{errorMessage}</p>
  }

  return (
    <section className="grid gap-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
          My Account
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
          {user?.fullName || 'Profile'}
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          {user?.email || 'No email'} | {user?.role || 'USER'}
        </p>
      </div>

      <div className="grid gap-3 rounded-2xl border border-stone-200 bg-white/85 p-6 text-sm text-stone-700 shadow-[0_20px_45px_rgba(63,39,18,0.08)] backdrop-blur">
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

      <AddressBook />

      <section className="grid gap-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Security
          </p>
          <h3 className="text-2xl font-semibold tracking-tight text-stone-900">
            Change password
          </h3>
          <p className="mt-2 text-sm text-stone-600">
            This action requires your current password.
          </p>
        </div>

        <ChangePasswordForm />
      </section>
    </section>
  )
}

export default ProfilePage
