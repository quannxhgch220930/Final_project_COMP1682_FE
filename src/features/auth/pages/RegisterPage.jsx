import RegisterForm from '../components/RegisterForm'

function RegisterPage() {
  return (
    <section className="login-page-shell grid gap-6">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl">
          WELCOME TO E_COMMERCE
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          Please enter your name, email and password to sign in
        </p>
      </div>

      <RegisterForm />
    </section>
  )
}

export default RegisterPage
