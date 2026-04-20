function ProtectedRoute({ allowed = true, children, fallback = null, loading = false }) {
  if (loading) {
    return <p className="text-sm text-stone-500">Loading...</p>
  }

  return allowed ? children : fallback
}

export default ProtectedRoute
