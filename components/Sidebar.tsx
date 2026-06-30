'use client'

import { ShoppingCart, Package, Users, DollarSign, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/hooks'

interface SidebarProps {
  activeScreen: string
  onScreenChange: (screen: string) => void
}

export default function Sidebar({ activeScreen, onScreenChange }: SidebarProps) {
  const { userRole, logout } = useAuth()

  const menuItems = [
    {
      id: 'pos',
      label: 'POS',
      icon: ShoppingCart,
      roles: ['OWNER', 'EMPLOYEE'],
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Package,
      roles: ['OWNER'],
    },
    {
      id: 'hr',
      label: 'HR',
      icon: Users,
      roles: ['OWNER', 'EMPLOYEE'],
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: DollarSign,
      roles: ['OWNER'],
    },
  ]

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(userRole || ''))

  return (
    <div className="w-64 bg-[#5B7E3C] text-white flex flex-col h-full">
      <div className="p-6 border-b border-[#4a6530]">
        <h2 className="text-xl font-bold">Coffee ERP</h2>
        <p className="text-sm text-green-100 capitalize">{userRole} Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeScreen === item.id
          return (
            <button
              key={item.id}
              onClick={() => onScreenChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive ? 'bg-[#FFD65A] text-[#5B7E3C] font-semibold' : 'hover:bg-[#4a6530] text-white'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <button
        onClick={logout}
        className="m-4 flex items-center gap-2 px-4 py-3 bg-[#EA5252] hover:bg-[#d14545] text-white rounded-lg transition font-semibold"
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  )
}
