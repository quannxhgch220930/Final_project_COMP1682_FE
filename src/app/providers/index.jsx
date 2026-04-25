import { AuthProvider } from '../../features/auth/contexts/AuthContext'
import { CommerceProvider } from '../../features/commerce/contexts/CommerceContext'
import { NotificationProvider } from '../../features/notification/contexts/NotificationContext'

function AppProviders({ children }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <CommerceProvider>{children}</CommerceProvider>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default AppProviders
