import { useEffect, useRef, useState } from 'react'
import Button from '../../../shared/ui/Button'
import { ROUTES } from '../../../shared/constants/routes'
import { navigateTo } from '../../../shared/lib/navigation'
import { useAuth } from '../hooks/useAuth'

function getCallbackToken() {
  if (typeof window === 'undefined') {
    return null
  }

  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.get('token')
}

function OAuthCallbackPage() {
  const { authenticateWithToken } = useAuth()
  const callbackToken = getCallbackToken()
  const [errorMessage, setErrorMessage] = useState(
    callbackToken ? '' : 'An Error Occured, Please Try Again',
  )
  const hasStartedRef = useRef(false)

  useEffect(() => {
    if (hasStartedRef.current) {
      return
    }

    hasStartedRef.current = true
    if (!callbackToken) {
      return
    }

    authenticateWithToken(callbackToken)
      .then(() => {
        navigateTo(ROUTES.profile, { replace: true })
      })
      .catch(() => {
        setErrorMessage('An Error Occured, Please Try Again')
      })
  }, [authenticateWithToken, callbackToken])

  return (
    <section className="grid gap-4">
      {errorMessage ? (
        <div className="grid gap-3">
          <p className="text-sm text-rose-600">{errorMessage}</p>
          <div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigateTo(ROUTES.login, { replace: true })}
            >
              Back to login
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
              GOOGLE CALLBACK
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
              Completing sign in
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Your Google account is being linked to the storefront session.
            </p>
          </div>
          <p className="text-sm text-stone-600">Please wait a moment.</p>
        </>
      )}
    </section>
  )
}

export default OAuthCallbackPage
