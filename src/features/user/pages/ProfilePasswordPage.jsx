import { Typography } from 'antd'
import ChangePasswordForm from '../../auth/components/ChangePasswordForm'

const { Paragraph, Title } = Typography

function ProfilePasswordPage() {
  return (
    <section className="grid gap-6">
      <ChangePasswordForm />
    </section>
  )
}

export default ProfilePasswordPage
