import { useEffect, useEffectEvent, useState } from 'react'
import { Alert, Typography } from 'antd'
import ProfileForm from '../components/ProfileForm'
import { useProfile } from '../hooks/useProfile'
import { handleApiError } from '../../../shared/utils/handleApiError'
import { useAuth } from '../../auth/hooks/useAuth'

const { Paragraph, Title } = Typography

function ProfileEditPage() {
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
    return <Alert type="info" message="Loading profile..." showIcon />
  }

  if (errorMessage) {
    return <Alert type="error" message={errorMessage} showIcon />
  }

  return (
    <section className="grid gap-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
          Personal information
        </p>
        <Title level={2} style={{ margin: 0 }}>
          Edit your profile
        </Title>
        <Paragraph className="mt-2 text-sm text-stone-600">
          Update your basic account details and contact information.
        </Paragraph>
      </div>

      <ProfileForm initialValues={user} onSubmit={updateProfile} />
    </section>
  )
}

export default ProfileEditPage
