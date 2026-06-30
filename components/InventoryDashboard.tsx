'use client'

import { useState } from 'react'
import { AlertCircle, Plus, X } from 'lucide-react'
import { useInventory } from '@/lib/hooks'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export default function InventoryDashboard() {
  const { inventory, addStock, lowStockAlerts } = useInventory()

  
  const handleAddStock = (itemId: string, itemName: string) => {
    MySwal.fire({
      title: 'Tambah Stok',
      text: `Berapa banyak stok ${itemName} yang mau ditambah?`,
      input: 'number',
      inputPlaceholder: 'Masukkan jumlah...',
      showCancelButton: true,
      confirmButtonText: 'Tambah Stok',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#5B7E3C', 
      customClass: {
        popup: 'rounded-2xl',
        cancelButton: 'text-gray-900 font-semibold bg-gray-200 hover:bg-gray-300'
      },
      inputValidator: (value) => {
        if (!value || parseInt(value) <= 0) {
          return 'Masukkan angka yang valid (minimal 1) bro!';
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const addedQuantity = parseInt(result.value);
        
        // Manggil fungsi bawaan dari baris 8 lu
        addStock(itemId, addedQuantity);
        
        MySwal.fire({
          title: 'Berhasil!',
          text: `Stok ${itemName} berhasil ditambah sebanyak ${addedQuantity}.`,
          icon: 'success',
          confirmButtonColor: '#5B7E3C',
          customClass: { popup: 'rounded-2xl' }
        });
      }
    });
};

  return (
    <div className="p-6 h-full bg-[#F5F7F8] overflow-y-auto space-y-6">
      {/* Low Stock Alerts */}
      {lowStockAlerts.length > 0 && (
        <div className="bg-[#EA5252] text-white rounded-lg p-4 flex items-start gap-3">
          <AlertCircle size={24} className="flex-shrink-0 mt-1" />
          <div>
            <p className="font-bold mb-2">Peringatan Stok Rendah:</p>
            <ul className="space-y-1 text-sm">
              {lowStockAlerts.map((item) => (
                <li key={item.id}>
                  {item.name} - {item.quantity} {item.unit} Tersisa
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#5B7E3C] text-white">
                <th className="px-6 py-4 text-left font-semibold">Nama Produk</th>
                <th className="px-6 py-4 text-left font-semibold">Jumlah Stok</th>
                <th className="px-6 py-4 text-left font-semibold">Satuan</th>
                <th className="px-6 py-4 text-left font-semibold">Terakhir Stok Ulang</th>
                <th className="px-6 py-4 text-left font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-semibold text-gray-900">{item.name}</td>
                  <td
                    className={`px-6 py-4 font-bold ${
                      item.quantity <= item.lowStockThreshold ? 'text-[#EA5252]' : 'text-[#5B7E3C]'
                    }`}
                  >
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.unit}</td>
                  <td className="px-6 py-4 text-gray-600">{item.lastRestocked}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleAddStock(item.id, item.name)}
                      className="px-4 py-2 bg-[#5B7E3C] hover:bg-[#4a6530] text-white font-semibold rounded-lg flex items-center gap-2 transition"
                    >
                      <Plus size={18} />
                      Tambah Stok
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
