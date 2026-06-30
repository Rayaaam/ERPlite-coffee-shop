'use client'

import { useState } from 'react'
import { DollarSign, Printer } from 'lucide-react'
import { useFinance } from '@/lib/hooks'

export default function FinanceReport() {
  const { dailyRevenue, pettyCash, updatePettyCash, closeShift, soldItemsLog  } = useFinance()
  const [pettyInput, setPettyInput] = useState(pettyCash.toString())
  const groupedSoldItems = soldItemsLog.reduce((acc: any[], currentItem: any) => {
    const existingItem = acc.find(item => item.name === currentItem.name);
    if (existingItem) {
      existingItem.quantity += currentItem.quantity;
    } else {
      acc.push({
        name: currentItem.name,
        quantity: currentItem.quantity,
        price: currentItem.price
      });
    }
    return acc;
  }, []);

  const handleUpdatePettyCash = () => {
    const amount = parseFloat(pettyInput)
    if (!isNaN(amount) && amount >= 0) {
      updatePettyCash(amount)
    }
  }

  const handleCloseShift = () => {
    if (confirm('Are you sure you want to close the shift and print the report?')) {
      closeShift()
    }
  }

  return (
  <div className="p-6 h-full bg-[#F5F7F8] overflow-y-auto space-y-6">
    
    {/* Grid Atas: Pendapatan & Kas Kecil */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Kotak Pendapatan Hari Ini */}
      <div className="bg-gradient-to-br from-[#5B7E3C] to-[#4a6530] text-white rounded-lg shadow-md p-6 flex flex-col justify-center">
        <div className="flex items-center gap-4 mb-2">
          
          <div>
            <p className="text-sm opacity-90">Pendapatan Hari Ini</p>
            <h2 className="text-4xl font-bold text-white mt-2">
              Rp {dailyRevenue.toLocaleString('id-ID')}
            </h2>
          </div>
        </div>
      </div>

      {/* Kotak Manajemen Kas Kecil */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Manajemen Kas Kecil</h2>
        
        <div className="mb-6 p-4 bg-[#F5F7F8] rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Saldo Kas Saat Ini</p>
          <p className="text-3xl font-bold text-[#5B7E3C]">Rp {pettyCash.toLocaleString('id-ID')}</p>
        </div>

        <div className="mb-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Perbarui Nominal Kas</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={pettyInput}
              onChange={(e) => setPettyInput(e.target.value)}
              placeholder="Masukkan nominal..."
              className="flex-1 px-4 py-3 bg-white text-gray-900 font-semibold border border-gray-300 rounded-lg focus:outline-none focus:border-[#5B7E3C]"
            />
            <button
              onClick={handleUpdatePettyCash}
              className="px-6 py-3 bg-[#5B7E3C] hover:bg-[#4a6530] text-white font-semibold rounded-lg transition"
            >
              Perbarui
            </button>
          </div>
        </div>
      </div>

    </div>

    {/* Ringkasan Shift */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Ringkasan Shift</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between py-2 border-b border-gray-200">
          <span className="text-gray-600 ">Pendapatan Harian:</span>
          <span className="font-semibold text-gray-900">
            Rp {dailyRevenue.toLocaleString('id-ID')}
          </span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-200">
          <span className="text-gray-600">Kas Kecil:</span>
          <span className="font-bold text-gray-900">Rp {pettyCash.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between py-2 bg-[#F5F7F8] px-3 rounded-lg">
          <span className="font-semibold text-gray-900">Total Uang Tunai:</span>
          <span className="font-bold text-[#5B7E3C] text-lg">
            Rp {(dailyRevenue + pettyCash).toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      {/* Tombol Tutup Shift */}
      <button
        onClick={handleCloseShift}
        className="w-full py-4 bg-[#FF9D23] hover:bg-[#e88d1a] text-white font-bold rounded-lg flex items-center justify-center gap-2 transition shadow-md"
      >
        <Printer size={24} />
        Tutup Shift & Cetak Laporan
      </button>
      <p className="text-xs text-gray-500 text-center mt-3">
        Menutup shift akan mencetak laporan keuangan detail untuk arsip operasional.
      </p>
    </div>

    <div className="mt-6 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-[#5B7E3C] p-4">
        <h3 className="text-white font-bold">Rincian Item Terjual Hari Ini</h3>
      </div>
      
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
            <th className="p-4 font-semibold w-16 text-center">No</th>
            <th className="p-4 font-semibold">Nama Item</th>
            <th className="p-4 font-semibold text-center">Total Terjual (Qty)</th>
            <th className="p-4 font-semibold text-right">Total Pendapatan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {groupedSoldItems.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-6 text-center text-gray-500 italic">
                Belum ada penjualan hari ini.
              </td>
            </tr>
          ) : (
            groupedSoldItems.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition">
                {/* Nomor Urut */}
                <td className="p-4 text-center text-sm text-gray-500">{idx + 1}</td>
                
                {/* Nama Menu */}
                <td className="p-4 font-medium text-gray-900">{item.name}</td>
                
                {/* Qty yang udah digabung pekat hitam */}
                <td className="p-4 text-center font-mono text-gray-900 font-bold">
                  {item.quantity}
                </td>
                
                {/* Subtotal Akumulasi */}
                <td className="p-4 text-right font-medium text-[#5B7E3C]">
                  Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

  </div>
  )
}
