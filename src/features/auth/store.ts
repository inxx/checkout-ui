import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  setToken: (token: string) => void
  clearToken: () => void
  _hasHydrated: boolean
  setHasHydrated: (hasHydrated: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,
      
      setToken: (token: string) => {
        set({
          token,
          isAuthenticated: true,
        })
      },
      
      clearToken: () => {
        set({
          token: null,
          isAuthenticated: false,
        })
      },
      
      setHasHydrated: (hasHydrated: boolean) => {
        set({ _hasHydrated: hasHydrated })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = !!state.token
          state.setHasHydrated(true)
        }
      },
    }
  )
)