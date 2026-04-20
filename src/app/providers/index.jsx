import { AuthProvider } from '../../features/auth/contexts/AuthContext'
import { CommerceProvider } from '../../features/commerce/contexts/CommerceContext'

function AppProviders({ children }) {
  return (
    <AuthProvider>
      <CommerceProvider>{children}</CommerceProvider>
    </AuthProvider>
  )
}

export default AppProviders
