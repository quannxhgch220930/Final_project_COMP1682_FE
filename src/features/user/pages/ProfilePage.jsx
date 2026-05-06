import { useEffect, useEffectEvent, useState } from 'react'
import { Alert, Card, Typography } from 'antd'
import { useProfile } from '../hooks/useProfile'
import { handleApiError } from '../../../shared/utils/handleApiError'
import { useAuth } from '../../auth/hooks/useAuth'
import { navigateTo } from '../../../shared/lib/navigation'
import { ROUTES } from '../../../shared/constants/routes'

const { Paragraph, Title } = Typography

function ProfilePage() {
  const { getProfile } = useProfile()
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
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-stone-700">
          Account
        </p>
        <Title level={2} style={{ margin: 0 }}>
          Your profile dashboard
        </Title>
        <Paragraph className="mt-2 text-sm font-medium text-stone-700">
          Choose one of the actions below to manage your account.
        </Paragraph>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card
          className="cursor-pointer border-stone-300 shadow-sm transition hover:border-stone-700 hover:shadow-md"
          onClick={() => navigateTo(ROUTES.profileEdit)}
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-700">
            Personal information
          </p>
          <Title level={4} className="mt-3">
            Edit profile
          </Title>
          <Paragraph className="mt-2 text-sm font-medium text-stone-700">
            Update your name, email, phone number and date of birth.
          </Paragraph>
        </Card>

        <Card
          className="cursor-pointer border-stone-300 shadow-sm transition hover:border-stone-700 hover:shadow-md"
          onClick={() => navigateTo(ROUTES.profileAddress)}
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-700">
            Shipping address
          </p>
          <Title level={4} className="mt-3">
            Manage addresses
          </Title>
          <Paragraph className="mt-2 text-sm font-medium text-stone-700">
            Add or edit your saved delivery addresses.
          </Paragraph>
        </Card>

        <Card
          className="cursor-pointer border-stone-300 shadow-sm transition hover:border-stone-700 hover:shadow-md"
          onClick={() => navigateTo(ROUTES.profilePassword)}
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-700">
            Security
          </p>
          <Title level={4} className="mt-3">
            Change password
          </Title>
          <Paragraph className="mt-2 text-sm font-medium text-stone-700">
            Secure your account by updating your password.
          </Paragraph>
        </Card>
      </div>
    </section>
  )
}

export default ProfilePage
