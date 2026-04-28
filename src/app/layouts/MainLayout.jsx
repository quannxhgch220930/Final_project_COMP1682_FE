function MainLayout({ children }) {
  return (
    <main className="mx-auto max-w-7xl">
      <section className="grid gap-8">
        {children}
      </section>
    </main>
  )
}

export default MainLayout
