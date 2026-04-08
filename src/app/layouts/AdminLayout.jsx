function AdminLayout({ children }) {
  return (
    <main className="layout">
      <section className="layout__content">
        <div className="section-heading">
          <p className="eyebrow">Admin Area</p>
          <h2>Management workspace</h2>
        </div>
        {children}
      </section>
    </main>
  )
}

export default AdminLayout
