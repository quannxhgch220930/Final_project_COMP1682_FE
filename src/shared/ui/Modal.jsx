function Modal({ title, description, open }) {
  if (!open) {
    return null
  }

  return (
    <div
      className="grid gap-3 rounded-2xl border border-stone-200 bg-white/90 p-5 shadow-[0_20px_45px_rgba(63,39,18,0.08)] backdrop-blur"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <h3 className="text-xl font-semibold text-stone-900">{title}</h3>
      <p className="text-sm text-stone-600">{description}</p>
    </div>
  )
}

export default Modal
