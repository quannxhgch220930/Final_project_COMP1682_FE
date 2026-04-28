import { Typography } from 'antd'
import ChangePasswordForm from '../../auth/components/ChangePasswordForm'

const { Paragraph, Title } = Typography

function ProfilePasswordPage() {
  return (
    <section className="grid gap-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
          Security
        </p>
        <Title level={2} style={{ margin: 0 }}>
          Change your password
        </Title>
        <Paragraph className="mt-2 text-sm text-stone-600">
          Update your password securely using your current credentials.
        </Paragraph>
      </div>

      <ChangePasswordForm />
    </section>
  )
}

export default ProfilePasswordPage
