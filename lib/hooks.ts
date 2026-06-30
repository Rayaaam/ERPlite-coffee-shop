import { useContext } from 'react'
import {
  AuthContext,
  POSContext,
  InventoryContext,
  HRContext,
  FinanceContext,
  type MenuItem,
} from './context'

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function usePOS() {
  const context = useContext(POSContext)
  if (!context) {
    throw new Error('usePOS must be used within POSProvider')
  }
  return context
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (!context) {
    throw new Error('useInventory must be used within InventoryProvider')
  }
  return context
}

export function useHR() {
  const context = useContext(HRContext)
  if (!context) {
    throw new Error('useHR must be used within HRProvider')
  }
  return context
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider')
  }
  return context
}
