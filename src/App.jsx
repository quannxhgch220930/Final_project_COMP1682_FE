import AppProviders from './app/providers'
import AppErrorBoundary from './app/components/AppErrorBoundary'
import AppRouter from './app/router'

function App() {
  return (
    <AppErrorBoundary>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </AppErrorBoundary>
  )
}

export default App
