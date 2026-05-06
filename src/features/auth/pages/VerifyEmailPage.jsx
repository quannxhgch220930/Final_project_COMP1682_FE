import { useEffect, useState } from 'react'
import { Alert, Typography } from 'antd'
import { useSearchQuery } from '../../../shared/lib/navigation'
import { handleApiError } from '../../../shared/utils/handleApiError'
import { authClientApi } from '../api/authClient.api'

const { Paragraph, Title } = Typography

function VerifyEmailPage() {
  const searchQuery = useSearchQuery()
  const token = new URLSearchParams(searchQuery).get('token')
  const [status, setStatus] = useState(token ? 'pending' : 'error')
  const [message, setMessage] = useState(
    token
      ? 'Verifying your email address...'
      : 'Verification token is missing or invalid.',
  )

  useEffect(() => {
    if (!token) {
      return
    }

    const verify = async () => {
      try {
        await authClientApi.verifyEmail(token)
        setStatus('success')
        setMessage('Verification success, You can close this page')
      } catch (error) {
        setStatus('error')
        setMessage(handleApiError(error))
      }
    }

    verify()
  }, [token])

  return (
    <section className="grid gap-5 max-w-xl">
      <div>
        <Title level={2} style={{ margin: 0 }}>
          Email verification
        </Title>
        <Paragraph className="mt-2 text-sm font-medium text-stone-700">
          Please wait while we verify your email address.
        </Paragraph>
      </div>

      {status === 'pending' ? (
        <Alert type="info" message={message} showIcon />
      ) : status === 'success' ? (
        <Alert type="success" message={message} showIcon />
      ) : (
        <Alert type="error" message={message} showIcon />
      )}
    </section>
  )
}

export default VerifyEmailPage
