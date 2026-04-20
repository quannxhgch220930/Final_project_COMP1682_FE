function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-stone-900 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-200 ${className}`.trim()}
      {...props}
    />
  )
}

export default Input
