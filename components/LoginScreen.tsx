'use client'

import { useState } from 'react'
import { LogIn } from 'lucide-react'
import { useAuth } from '@/lib/hooks'

export default function LoginScreen() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      setPin(pin + digit)
    }
  }

  const handleClear = () => {
    setPin('')
    setError('')
  }

  const handleLogin = () => {
    if (pin.length !== 4) {
      setError('PIN must be 4 digits')
      return
    }

    if (login(pin)) {
      setPin('')
      setError('')
    } else {
      setError('Invalid PIN. Try 8888 or 1111')
      setPin('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7F8]">
      <div className="w-full max-w-sm mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#5B7E3C] mb-2">Coffee Shop</h1>
          <p className="text-gray-600">ERP-Lite System</p>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Enter PIN</label>
          <div className="flex gap-2 justify-center mb-6">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-14 h-14 flex items-center justify-center bg-[#F5F7F8] border-2 border-gray-300 rounded-lg text-2xl font-bold text-[#5B7E3C]"
              >
                {'•'.repeat(pin[i] ? 1 : 0)}
              </div>
            ))}
          </div>

          {error && <p className="text-[#EA5252] text-center text-sm mb-4">{error}</p>}

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
              <button
                key={digit}
                onClick={() => handlePinInput(digit.toString())}
                disabled={pin.length >= 4}
                className="h-14 bg-[#5B7E3C] hover:bg-[#4a6530] text-white font-semibold rounded-lg disabled:opacity-50 transition"
              >
                {digit}
              </button>
            ))}
            <button
              onClick={handleClear}
              className="col-span-2 h-14 bg-[#FFD65A] hover:bg-[#FF9D23] text-white font-semibold rounded-lg transition"
            >
              Clear
            </button>
            <button
              onClick={() => handlePinInput('0')}
              disabled={pin.length >= 4}
              className="h-14 bg-[#5B7E3C] hover:bg-[#4a6530] text-white font-semibold rounded-lg disabled:opacity-50 transition"
            >
              0
            </button>
          </div>

          <button
            onClick={handleLogin}
            disabled={pin.length !== 4}
            className="w-full h-12 bg-[#5B7E3C] hover:bg-[#4a6530] disabled:bg-gray-300 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition"
          >
            <LogIn size={20} />
            Login
          </button>
        </div>

        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>Demo PIN:</p>
          <p>Owner: 8888 | Kasir: 1111</p>
        </div>
      </div>
    </div>
  )
}
