'use client'

import React, { createContext, useState, useCallback, ReactNode } from 'react'

// Types
export interface MenuItem {
  id: string
  name: string
  price: number
  category: string
  image?: string
  soldOut: boolean
  requiresSize: boolean
  
}

export interface CartItem {
  id: string
  menuItemId: string
  quantity: number
  size?: 'HOT' | 'ICE'
  price: number
  name: string
}

export interface InventoryItem {
  id: string
  name: string
  quantity: number
  unit: string
  lowStockThreshold: number
  lastRestocked: string
}

export interface AttendanceLog {
  id: string
  employeeId: string
  employeeName: string
  clockInTime: string
  clockOutTime?: string
  date: string
}

export interface PendingRequest {
  id: string
  employeeId: string
  employeeName: string
  type: 'Izin tidak masuk' | 'Kasbon'
  status: 'TERTUNDA' | 'DISETUJUI' | 'DITOLAK'
  amount?: number
  reason: string
  requestedDate: string
}

export type UserRole = 'OWNER' | 'EMPLOYEE'

// Auth Context
interface AuthContextType {
  isLoggedIn: boolean
  userRole: UserRole | null
  userId: string | null
  login: (pin: string) => boolean
  logout: () => void
  clockIn: () => void
  clockOut: () => void
  isClockedIn: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// POS Context
interface POSContextType {
  cart: CartItem[]
  addToCart: (item: MenuItem, size?: 'HOT' | 'ICE') => void
  removeFromCart: (cartItemId: string) => void
  updateCartQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  cartTotal: number
}

export const POSContext = createContext<POSContextType | undefined>(undefined)

// Inventory Context
interface InventoryContextType {
  inventory: InventoryItem[]
  addStock: (itemId: string, quantity: number) => void
  lowStockAlerts: InventoryItem[]
}

export const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

// HR Context
interface HRContextType {
  attendanceLogs: AttendanceLog[]
  pendingRequests: PendingRequest[]
  approvePendingRequest: (requestId: string) => void
  rejectPendingRequest: (requestId: string) => void
  recordClockIn: (employeeName: string) => void;
  recordClockOut: (employeeName: string) => void;
}

export const HRContext = createContext<HRContextType | undefined>(undefined)

// Finance Context
interface FinanceContextType {
  dailyRevenue: number
  pettyCash: number
  updateDailyRevenue: (amount: number) => void
  updatePettyCash: (amount: number) => void
  closeShift: () => void
  soldItemsLog: any[];
  recordSoldItems: (cartItems: any[]) => void;
}

export const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

// Providers
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isClockedIn, setIsClockedIn] = useState(false)

  const login = useCallback((pin: string): boolean => {
    if (pin === '8888') {
      setIsLoggedIn(true)
      setUserRole('OWNER')
      setUserId('owner-1')
      localStorage.setItem('authSession', JSON.stringify({ role: 'OWNER', userId: 'owner-1' }))
      return true
    } else if (pin === '1111') {
      setIsLoggedIn(true)
      setUserRole('EMPLOYEE')
      setUserId('employee-1')
      localStorage.setItem('authSession', JSON.stringify({ role: 'EMPLOYEE', userId: 'employee-1' }))
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setIsLoggedIn(false)
    setUserRole(null)
    setUserId(null)
    setIsClockedIn(false)
    localStorage.removeItem('authSession')
  }, [])

  const clockIn = useCallback(() => {
    setIsClockedIn(true)
  }, [])

  const clockOut = useCallback(() => {
    setIsClockedIn(false)
  }, [])

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, userId, login, logout, clockIn, clockOut, isClockedIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export function POSProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = useCallback((item: MenuItem, size?: 'HOT' | 'ICE') => {
    setCart((prev) => {
      const existingItem = prev.find((ci) => ci.menuItemId === item.id && ci.size === size)
      if (existingItem) {
        return prev.map((ci) =>
          ci.menuItemId === item.id && ci.size === size ? { ...ci, quantity: ci.quantity + 1 } : ci
        )
      }
      return [
        ...prev,
        {
          id: `${item.id}-${size || 'default'}-${Date.now()}`,
          menuItemId: item.id,
          quantity: 1,
          size,
          price: item.price,
          name: item.name,
        },
      ]
    })
  }, [])

  const removeFromCart = useCallback((cartItemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.id !== cartItemId))
  }, [])

  const updateCartQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId)
    } else {
      setCart((prev) => prev.map((ci) => (ci.id === cartItemId ? { ...ci, quantity } : ci)))
    }
  }, [removeFromCart])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <POSContext.Provider value={{ cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal }}>
      {children}
    </POSContext.Provider>
  )
}

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: '1', name: 'Coffee Beans', quantity: 50, unit: 'kg', lowStockThreshold: 20, lastRestocked: '2026-06-20' },
    { id: '2', name: 'Cup 14oz', quantity: 5, unit: 'box', lowStockThreshold: 10, lastRestocked: '2026-06-15' },
    { id: '3', name: 'Milk', quantity: 100, unit: 'liter', lowStockThreshold: 30, lastRestocked: '2026-06-19' },
    { id: '4', name: 'Sugar', quantity: 200, unit: 'kg', lowStockThreshold: 50, lastRestocked: '2026-06-18' },
  ])

  const addStock = useCallback((itemId: string, quantity: number) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item))
    )
  }, [])

  const lowStockAlerts = inventory.filter((item) => item.quantity <= item.lowStockThreshold)

  return (
    <InventoryContext.Provider value={{ inventory, addStock, lowStockAlerts }}>
      {children}
    </InventoryContext.Provider>
  )
}

export function HRProvider({ children }: { children: ReactNode }) {
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([
    {
      id: '1',
      employeeId: 'employee-1',
      employeeName: 'Supardi',
      clockInTime: '2026-06-21T08:00:00',
      clockOutTime: '2026-06-21T16:00:00',
      date: '2026-06-21',
    },
    {
      id: '2',
      employeeId: 'employee-2',
      employeeName: 'Loehoet',
      clockInTime: '2026-06-21T09:00:00',
      date: '2026-06-21',
    },
  ])

  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([
    {
      id: 'req-1',
      employeeId: 'employee-2',
      employeeName: 'Habib Smith',
      type: 'Izin tidak masuk',
      status: 'TERTUNDA',
      reason: 'Kontrol Kesehatan',
      requestedDate: '2026-06-25',
    },
    {
      id: 'req-2',
      employeeId: 'employee-3',
      employeeName: 'Iwan Sumbang',
      type: 'Kasbon',
      status: 'TERTUNDA',
      amount: 200000,
      reason: 'Kebutuhan Mendadak',
      requestedDate: '2026-06-21',
    },
  ])

  // Fungsi buat nambah baris absen baru pas masuk
  const recordClockIn = (employeeName: string) => {
    const now = new Date();
    const newLog = {
      id: Date.now().toString(),
      employeeId: 'employee-temp', // Anggap aja ID sementara
      employeeName: employeeName,
      clockInTime: now.toISOString(),
      date: now.toISOString().split('T')[0], // Ngambil YYYY-MM-DD nya aja
      // clockOutTime dibiarin kosong karena belum pulang
    };
  
    setAttendanceLogs((prev) => [newLog, ...prev]);
  };

  // Fungsi buat ngisi jam pulang
  const recordClockOut = (employeeName: string) => {
    const now = new Date();
    setAttendanceLogs((prev) => 
      prev.map((log) => 
        // Cari log hari ini yang belum ada jam pulangnya
        log.employeeName === employeeName && !log.clockOutTime
          ? { ...log, clockOutTime: now.toISOString() }
          : log
      )
    );
  };

  const approvePendingRequest = useCallback((requestId: string) => {
    setPendingRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: 'DISETUJUI' } : req))
    )
  }, [])

  const rejectPendingRequest = useCallback((requestId: string) => {
    setPendingRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: 'DITOLAK' } : req))
    )
  }, [])

  return (
    <HRContext.Provider value={{ attendanceLogs, pendingRequests,
    approvePendingRequest, rejectPendingRequest, 
    recordClockIn, recordClockOut }}>
      {children}
    </HRContext.Provider>
  )
}

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [dailyRevenue, setDailyRevenue] = useState(0) // Mulai dari 0 setiap shift
  const [pettyCash, setPettyCash] = useState(100)
  const [soldItemsLog, setSoldItemsLog] = useState<any[]>([])

  const recordSoldItems = (cartItems: any[]) => {
    const now = new Date();

    const itemsWithTime = cartItems.map(item => ({
      ...item,
      soldAt: now.toISOString(),
      transactionId: `TRX-${now.getTime()}`
    }));

    setSoldItemsLog(prev => [...itemsWithTime, ...prev]);
  }

  const updateDailyRevenue = useCallback((amount: number) => {
    setDailyRevenue((prev) => prev + amount)
  }, [])

  const updatePettyCash = useCallback((amount: number) => {
    setPettyCash(amount)
  }, [])

  const closeShift = useCallback(() => {
    window.print()
  }, [])

  return (
    <FinanceContext.Provider
      value={{ dailyRevenue, pettyCash, updateDailyRevenue, updatePettyCash, closeShift, soldItemsLog, recordSoldItems }}
    >
      {children}
    </FinanceContext.Provider>
  )
}
