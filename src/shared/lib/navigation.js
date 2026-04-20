import { useSyncExternalStore } from 'react'

const NAVIGATION_EVENT = 'app:navigation-change'

function normalizePath(path) {
  if (!path) {
    return '/'
  }

  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1)
  }

  return path
}

export function getCurrentPath() {
  if (typeof window === 'undefined') {
    return '/'
  }

  return normalizePath(window.location.pathname)
}

function notifyNavigationChange() {
  window.dispatchEvent(new Event(NAVIGATION_EVENT))
}

export function navigateTo(path, options = {}) {
  if (typeof window === 'undefined') {
    return
  }

  const nextPath = normalizePath(path)
  const currentPath = getCurrentPath()

  if (currentPath === nextPath) {
    return
  }

  const method = options.replace ? 'replaceState' : 'pushState'
  window.history[method](null, '', nextPath)
  notifyNavigationChange()
}

function subscribe(onStoreChange) {
  if (typeof window === 'undefined') {
    return () => {}
  }

  window.addEventListener('popstate', onStoreChange)
  window.addEventListener(NAVIGATION_EVENT, onStoreChange)

  return () => {
    window.removeEventListener('popstate', onStoreChange)
    window.removeEventListener(NAVIGATION_EVENT, onStoreChange)
  }
}

export function usePathname() {
  return useSyncExternalStore(subscribe, getCurrentPath, () => '/')
}
