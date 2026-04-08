function ProtectedRoute({ allowed = true, children, fallback = null, loading = false }) {
  if (loading) {
    return <p className="muted">Loading...</p>
  }

  return allowed ? children : fallback
}

export default ProtectedRoute
