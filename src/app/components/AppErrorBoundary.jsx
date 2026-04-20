import { Component } from 'react'

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
    }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error) {
    console.error('Application render failed:', error)
  }

  render() {
    if (this.state.error) {
      return (
        <main className="mx-auto max-w-4xl px-5 py-10">
          <section className="grid gap-4 rounded-[24px] border border-stone-200 bg-white/90 p-8 shadow-[0_20px_45px_rgba(63,39,18,0.08)] backdrop-blur">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                Application Error
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
                Something went wrong while starting the app
              </h2>
              <p className="mt-2 text-sm text-stone-600">
                A runtime error prevented the UI from rendering normally.
              </p>
            </div>

            <p className="text-sm text-rose-600">
              {this.state.error?.message || 'Unexpected startup error'}
            </p>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}

export default AppErrorBoundary
