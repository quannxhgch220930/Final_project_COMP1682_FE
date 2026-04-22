const FALLBACK_MESSAGES = {
  400: 'Invalid request',
  401: 'Please sign in again to continue',
  403: 'You do not have permission to perform this action',
  404: 'Requested data was not found',
  500: 'System error. Please try again',
}

function getFirstValidationMessage(payload) {
  const fieldErrors = payload?.data

  if (!fieldErrors || typeof fieldErrors !== 'object' || Array.isArray(fieldErrors)) {
    return ''
  }

  const firstMessage = Object.values(fieldErrors).find(
    (value) => typeof value === 'string' && value.trim(),
  )

  return firstMessage?.trim() || ''
}

export function handleApiError(error) {
  const payload = error?.payload
  const validationMessage = getFirstValidationMessage(payload)

  if (validationMessage) {
    return validationMessage
  }

  if (typeof payload?.message === 'string' && payload.message.trim()) {
    return payload.message.trim()
  }

  if (typeof error?.message === 'string' && error.message.trim()) {
    return error.message.trim()
  }

  if (payload?.code && FALLBACK_MESSAGES[payload.code]) {
    return FALLBACK_MESSAGES[payload.code]
  }

  if (error?.status && FALLBACK_MESSAGES[error.status]) {
    return FALLBACK_MESSAGES[error.status]
  }

  return 'Something went wrong. Please try again'
}
