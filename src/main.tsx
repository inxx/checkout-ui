import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// MSW 워커 시작
async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./shared/api/browser')
    
    // 서비스 워커 시작
    return worker.start({
      onUnhandledRequest: 'bypass',
    })
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})