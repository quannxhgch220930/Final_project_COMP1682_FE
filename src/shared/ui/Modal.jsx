function Modal({ title, description, open }) {
  if (!open) {
    return null
  }

  return (
    <div className="card" role="dialog" aria-modal="true" aria-label={title}>
      <h3>{title}</h3>
      <p className="muted">{description}</p>
    </div>
  )
}

export default Modal
