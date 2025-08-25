import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Providers } from './shared/lib/Providers'
import { initializeAuth } from './stores/useAuthStore'
import { MerchantListPage } from './pages/MerchantListPage'
import MerchantDetailPage from './pages/MerchantDetailPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import PaymentFailedPage from './pages/PaymentFailedPage'
import PaymentPendingPage from './pages/PaymentPendingPage'
import './lib/i18n'
import './index.css'

// MSW 워커 시작 (모든 환경에서 활성화)
async function enableMocking() {
  try {
    // 기존 서비스 워커 정리
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations()
      for (const registration of registrations) {
        await registration.unregister()
      }
    }
    
    const { worker } = await import('./shared/api/browser')
    
    // 서비스 워커 시작 (10초 타임아웃)
    const startPromise = worker.start({
      onUnhandledRequest: 'bypass',
    })
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('MSW start timeout after 10 seconds')), 10000)
    })
    
    await Promise.race([startPromise, timeoutPromise])
    
    // MSW 성공 시 재시도 카운터 리셋
    localStorage.removeItem('msw-retry')
    return true
  } catch (error) {
    console.error('[MSW] Failed to start:', error)
    return false
  }
}

enableMocking().then((mswStarted) => {
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
}).catch((error) => {
  console.error('App initialization failed:', error)
  
  // 1번만 자동 새로고침 시도
  const hasRetried = localStorage.getItem('msw-retry')
  if (!hasRetried) {
    localStorage.setItem('msw-retry', 'true')
    window.location.reload()
  } else {
    // 이미 재시도했으면 에러 표시하고 카운터 리셋
    localStorage.removeItem('msw-retry')
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <div style={{ 
          padding: '20px', 
          fontSize: '16px', 
          color: '#d32f2f',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          marginTop: '50px'
        }}>
          <h1>⚠️ 애플리케이션 로드 오류</h1>
          <p>앱을 시작하는 중 문제가 발생했습니다.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              marginTop: '20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            새로고침
          </button>
        </div>
      </React.StrictMode>
    )
  }
})