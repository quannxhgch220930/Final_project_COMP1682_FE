import { Alert, Typography } from 'antd'
import { useEffect } from 'react'
import Button from '../../../shared/ui/Button'
import { ROUTES } from '../../../shared/constants/routes'
import { navigateTo } from '../../../shared/lib/navigation'

const { Title, Paragraph } = Typography

function PaymentResultPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigateTo(ROUTES.orders)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="grid gap-6">
      <div>
        <Title level={2}>Payment Successful</Title>
        <Paragraph className="text-stone-700">
          Thank you for your payment. Your order has been confirmed.
          You will be redirected to the orders page shortly.
        </Paragraph>
      </div>
      <Alert
        type="success"
        message="Please wait for a moment while we are confirming your order"
        showIcon
      />
      <Button type="button" onClick={() => navigateTo(ROUTES.orders)}>
        View My Orders
      </Button>
    </section>
  )
}

export default PaymentResultPage