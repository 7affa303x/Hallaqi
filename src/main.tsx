import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ensureFreshAppShell } from '@/lib/appShell'
import { isOAuthCallbackUrl } from '@/lib/authRedirect'

declare global {
  interface Window {
    __HALLAQI_AUTH_SHELL_PENDING?: boolean
  }
}

async function waitForAuthShellGate(): Promise<void> {
  if (isOAuthCallbackUrl()) {
    window.__HALLAQI_AUTH_SHELL_PENDING = false
    return
  }
  if (!window.__HALLAQI_AUTH_SHELL_PENDING) return

  // Stale auth-shell may hang on SW/cache APIs — never block boot forever.
  await new Promise<void>(resolve => window.setTimeout(resolve, 2000))
  window.__HALLAQI_AUTH_SHELL_PENDING = false
}

async function boot() {
  await waitForAuthShellGate()

  const reloading = await ensureFreshAppShell()
  if (reloading) return

  try {
    const url = new URL(window.location.href)
    if (url.searchParams.has('hallaqi_refresh')) {
      url.searchParams.delete('hallaqi_refresh')
      window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`)
    }
  } catch { /* ignore */ }

  const { default: App } = await import('./App.tsx')

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void boot()
