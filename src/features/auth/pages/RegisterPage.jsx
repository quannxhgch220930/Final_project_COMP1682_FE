import RegisterForm from '../components/RegisterForm'

function RegisterPage() {
  return (
    <section className="stack">
      <div className="section-heading">
        <p className="eyebrow">Authentication</p>
        <h2>Register page scaffold</h2>
        <p className="muted">
          Frontend đang gọi trực tiếp endpoint register từ backend Spring của bạn.
        </p>
      </div>

      <RegisterForm />
    </section>
  )
}

export default RegisterPage
