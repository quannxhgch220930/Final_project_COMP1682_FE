function MainLayout({ children }) {
  return (
    <main className="mx-auto max-w-6xl">
      <section className="rounded-[24px] border border-stone-200 bg-[rgba(255,253,248,0.88)] p-7 shadow-[0_20px_45px_rgba(63,39,18,0.08)] backdrop-blur md:p-8">
        {children}
      </section>
    </main>
  )
}

export default MainLayout
