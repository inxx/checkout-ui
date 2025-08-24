import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Providers } from './shared/lib/Providers'
import { initializeAuth } from './stores/useAuthStore'
import { MerchantListPage } from './features/merchants/MerchantListPage'
import MerchantDetailPage from './pages/MerchantDetailPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import PaymentFailedPage from './pages/PaymentFailedPage'
import PaymentPendingPage from './pages/PaymentPendingPage'
import './lib/i18n'
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
  // 인증 시스템 초기화
  initializeAuth()
  
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Providers>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MerchantListPage />} />
            <Route path="/merchants" element={<Navigate to="/" replace />} />
            <Route path="/merchants/:id" element={<MerchantDetailPage />} />
            <Route path="/payment/result/paid" element={<PaymentSuccessPage />} />
            <Route path="/payment/result/declined" element={<PaymentFailedPage />} />
            <Route path="/payment/result/pending" element={<PaymentPendingPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </Providers>
    </React.StrictMode>
  )
})