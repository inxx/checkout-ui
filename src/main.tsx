import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Providers } from './shared/lib/Providers'
import HomePage from './pages/HomePage'
import MerchantsPage from './pages/MerchantsPage'
import MerchantDetailPage from './pages/MerchantDetailPage'
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
      <Providers>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/merchants" element={<MerchantsPage />} />
            <Route path="/merchants/:id" element={<MerchantDetailPage />} />
          </Routes>
        </BrowserRouter>
      </Providers>
    </React.StrictMode>
  )
})