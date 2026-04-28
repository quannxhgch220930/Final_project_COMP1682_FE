import { App as AntApp, ConfigProvider } from 'antd'
import { AuthProvider } from '../../features/auth/contexts/AuthContext'
import { CommerceProvider } from '../../features/commerce/contexts/CommerceContext'
import { NotificationProvider } from '../../features/notification/contexts/NotificationContext'

function AppProviders({ children }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 16,
          colorBgBase: '#f7f3ed',
          colorBorder: '#d7c6b6',
          colorError: '#dc2626',
          colorInfo: '#99582a',
          colorPrimary: '#99582a',
          colorSuccess: '#15803d',
          colorText: '#1c1917',
          colorTextSecondary: '#57534e',
          controlHeight: 44,
          fontFamily: "Georgia, 'Times New Roman', serif",
        },
        components: {
          Button: {
            borderRadius: 999,
            controlHeight: 44,
          },
          Card: {
            borderRadiusLG: 24,
          },
          Input: {
            activeBorderColor: '#99582a',
            hoverBorderColor: '#b8753a',
          },
          Select: {
            activeBorderColor: '#99582a',
            hoverBorderColor: '#b8753a',
          },
          Table: {
            borderColor: '#e7dbcf',
            headerBg: '#f5ede4',
            headerColor: '#44403c',
          },
        },
      }}
    >
      <AntApp>
        <AuthProvider>
          <NotificationProvider>
            <CommerceProvider>{children}</CommerceProvider>
          </NotificationProvider>
        </AuthProvider>
      </AntApp>
    </ConfigProvider>
  )
}

export default AppProviders
