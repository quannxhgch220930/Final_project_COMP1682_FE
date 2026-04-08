import { useAuth } from '../../auth/hooks/useAuth'
import { userApi } from '../api/user.api'

export function useProfile() {
  const { updateAuthUser, user } = useAuth()

  const getProfile = async () => {
    const response = await userApi.getProfile()
    updateAuthUser(response.data)
    return response
  }

  const updateProfile = async (payload) => {
    const response = await userApi.updateProfile(payload)
    updateAuthUser(response.data)
    return response
  }

  return {
    getProfile,
    updateProfile,
    user,
  }
}
