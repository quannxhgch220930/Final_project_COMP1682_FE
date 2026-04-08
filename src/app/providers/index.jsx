import { AuthProvider } from '../../features/auth/contexts/AuthContext'

function AppProviders({ children }) {
  return <AuthProvider>{children}</AuthProvider>
}

export default AppProviders
