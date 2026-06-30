'use client'

import { AuthProvider } from '@/lib/context'
import { POSProvider } from '@/lib/context'
import { InventoryProvider } from '@/lib/context'
import { HRProvider } from '@/lib/context'
import { FinanceProvider } from '@/lib/context'
import LoginScreen from '@/components/LoginScreen'
import MainLayout from '@/components/MainLayout'
import { useAuth } from '@/lib/hooks'

function AppContent() {
  const { isLoggedIn } = useAuth()

  return isLoggedIn ? <MainLayout /> : <LoginScreen />
}

export default function Page() {
  return (
    <AuthProvider>
      <POSProvider>
        <InventoryProvider>
          <HRProvider>
            <FinanceProvider>
              <AppContent />
            </FinanceProvider>
          </HRProvider>
        </InventoryProvider>
      </POSProvider>
    </AuthProvider>
  )
}
