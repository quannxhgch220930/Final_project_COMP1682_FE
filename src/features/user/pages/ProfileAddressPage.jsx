import { Typography } from 'antd'
import AddressBook from '../components/AddressBook'

const { Paragraph, Title } = Typography

function ProfileAddressPage() {
  return (
    <section className="grid gap-6">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-stone-700">
          Shipping address
        </p>
        <Title level={2} style={{ margin: 0 }}>
          Manage your shipping addresses
        </Title>
        <Paragraph className="mt-2 text-sm font-medium text-stone-700">
          Add, edit, and remove saved addresses for faster checkout.
        </Paragraph>
      </div>

      <AddressBook />
    </section>
  )
}

export default ProfileAddressPage
