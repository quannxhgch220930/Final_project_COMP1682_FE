export function handleApiError(error) {
  return error?.message || 'Unexpected error'
}
