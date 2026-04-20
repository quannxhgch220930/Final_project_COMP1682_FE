import { useAuthContext } from '../contexts/AuthStateContext'

export function useAuth() {
  return useAuthContext()
}
