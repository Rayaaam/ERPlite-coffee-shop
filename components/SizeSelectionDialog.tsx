'use client'

import { X } from 'lucide-react'
import { MenuItem } from '@/lib/context'

interface SizeSelectionDialogProps {
  item: MenuItem | null
  onClose: () => void
  onSelectSize: (size: 'HOT' | 'ICE') => void
}

export default function SizeSelectionDialog({ item, onClose, onSelectSize }: SizeSelectionDialogProps) {
  if (!item) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
            aria-label="Close"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <p className="text-gray-600 mb-6">Select size:</p>

        <div className="space-y-3">
          <button
            onClick={() => {
              onSelectSize('HOT')
              onClose()
            }}
            className="w-full py-3 bg-[#5B7E3C] hover:bg-[#4a6530] text-white font-semibold rounded-lg transition"
          >
            Hot
          </button>
          <button
            onClick={() => {
              onSelectSize('ICE')
              onClose()
            }}
            className="w-full py-3 bg-[#FFD65A] hover:bg-[#e8c14d] text-[#5B7E3C] font-semibold rounded-lg transition"
          >
            Ice
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
