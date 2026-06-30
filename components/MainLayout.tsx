'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import POSScreen from './POSScreen'
import InventoryDashboard from './InventoryDashboard'
import HRManagement from './HRManagement'
import FinanceReport from './FinanceReport'

export default function MainLayout() {
  const [activeScreen, setActiveScreen] = useState('pos')

  const renderScreen = () => {
    switch (activeScreen) {
      case 'pos':
        return <POSScreen />
      case 'inventory':
        return <InventoryDashboard />
      case 'hr':
        return <HRManagement />
      case 'finance':
        return <FinanceReport />
      default:
        return <POSScreen />
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeScreen={activeScreen} onScreenChange={setActiveScreen} />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 overflow-hidden">{renderScreen()}</div>
      </div>
    </div>
  )
}
