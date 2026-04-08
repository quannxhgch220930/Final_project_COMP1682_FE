function MainLayout({ children }) {
  return (
    <main className="layout">
      <section className="layout__content">{children}</section>
    </main>
  )
}

export default MainLayout
