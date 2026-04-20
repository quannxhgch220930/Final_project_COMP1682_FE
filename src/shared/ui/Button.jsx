const VARIANT_CLASSES = {
  primary:
    'bg-[linear-gradient(135deg,#99582a_0%,#7f4a22_100%)] text-white shadow-[0_12px_30px_rgba(111,69,24,0.22)] hover:bg-[linear-gradient(135deg,#a35f2d_0%,#874d23_100%)]',
  secondary:
    'border border-stone-300/80 bg-stone-100/85 text-stone-800 shadow-[0_8px_24px_rgba(63,39,18,0.08)] hover:bg-stone-200/90',
}

function Button({ children, className = '', variant = 'primary', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition duration-200 ease-out hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
