'use client'

import { useState } from 'react'
import { Trash2, Plus, Minus, Lock } from 'lucide-react'
import { usePOS, useFinance, useAuth } from '@/lib/hooks'
import { MenuItem } from '@/lib/context'
import { menuItems, categories } from '@/lib/mockData'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export default function POSScreen() {
  const { cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal } = usePOS()
  const { updateDailyRevenue, recordSoldItems } = useFinance()
  const { isClockedIn,userRole } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('Coffee')
  const filteredItems = menuItems.filter((item) => item.category === selectedCategory)
  

  const handleItemClick = (item: MenuItem) => {
  if (item.soldOut) return

  if (item.requiresSize) {
    // Kalau butuh ukuran (Kopi), keluarin pop-up SweetAlert
    MySwal.fire({
      title: item.name,
      text: 'Pilih varian penyajian:',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Hot',
      denyButtonText: 'Ice',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#FF9D23', // Hijau
      denyButtonColor: '#56B6C6',    // Kuning
      cancelButtonColor: '#FFD65A',  // Abu-abu
      customClass: {
        popup: 'rounded-2xl',
        denyButton: 'text-gray-900 font-semibold', 
        cancelButton: 'text-gray-900 font-semibold'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        addToCart(item, 'HOT')
      } else if (result.isDenied) {
        addToCart(item, 'ICE')
      }
    })
  } else {
    
    addToCart(item)
  }
}

  const handleCheckout = () => {
    if (cart.length === 0) return

    MySwal.fire({
      title: 'Metode Pembayaran',
      html: `
        <p class="text-gray-600 mb-5">Total Tagihan: <span class="font-bold text-gray-900 text-lg">Rp ${cartTotal.toLocaleString('id-ID')}</span></p>

        <div class="grid grid-cols-3 gap-3">
          <div>
            <input type="radio" name="payment" id="pay-cash" value="CASH" class="hidden peer" required>
            <label for="pay-cash" class="flex flex-col items-center justify-center p-3 border-2 border-gray-200 rounded-xl cursor-pointer peer-checked:border-[#5B7E3C] peer-checked:bg-green-50 hover:bg-gray-50 transition">
              <span class="text-3xl mb-1">💵</span>
              <span class="text-xs font-bold text-gray-700">Tunai</span>
            </label>
          </div>

          <div>
            <input type="radio" name="payment" id="pay-qris" value="QRIS" class="hidden peer">
            <label for="pay-qris" class="flex flex-col items-center justify-center p-3 border-2 border-gray-200 rounded-xl cursor-pointer peer-checked:border-[#5B7E3C] peer-checked:bg-green-50 hover:bg-gray-50 transition">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg" alt="QRIS" class="h-8 mb-1 object-contain">
              <span class="text-xs font-bold text-gray-700">QRIS</span>
            </label>
          </div>

          <div>
            <input type="radio" name="payment" id="pay-debit" value="DEBIT" class="hidden peer">
            <label for="pay-debit" class="flex flex-col items-center justify-center p-3 border-2 border-gray-200 rounded-xl cursor-pointer peer-checked:border-[#5B7E3C] peer-checked:bg-green-50 hover:bg-gray-50 transition">
              <span class="text-3xl mb-1">💳</span>
              <span class="text-xs font-bold text-gray-700">Debit</span>
            </label>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Proses',
      confirmButtonColor: '#5B7E3C',
      cancelButtonText: 'Batal',
      customClass: {
        popup: 'rounded-2xl',
        cancelButton: 'text-gray-900 font-semibold bg-gray-200 hover:bg-gray-300'
      },
      // Fungsi ini buat ngecek kotak mana yang diklik kasir
      preConfirm: () => {
        const selected = document.querySelector('input[name="payment"]:checked') as HTMLInputElement
        if (!selected) {
          Swal.showValidationMessage('Pilih metode pembayaran dulu, bro!')
          return false
        }
        return selected.value
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const paymentMethod = result.value

        // LOGIKA JIKA BAYAR PAKAI UANG TUNAI
        if (paymentMethod === 'CASH') {
          MySwal.fire({
            title: 'Pembayaran Tunai',
            text: `Tagihan: Rp ${cartTotal.toLocaleString('id-ID')}`,
            input: 'number',
            inputPlaceholder: 'Masukkan uang pelanggan...',
            confirmButtonText: 'Hitung',
            confirmButtonColor: '#5B7E3C',
            showCancelButton: true,
            cancelButtonText: 'Kembali',
            customClass: { popup: 'rounded-2xl' },
            preConfirm: (cashReceived) => {
              if (!cashReceived || cashReceived < cartTotal) {
                Swal.showValidationMessage('Uang kurang atau belum diisi!')
                return false
              }
              return cashReceived
            }
          }).then((cashResult) => {
            if (cashResult.isConfirmed) {
              const received = cashResult.value
              const change = received - cartTotal

              updateDailyRevenue(cartTotal)
              recordSoldItems(cart)
              clearCart()

              MySwal.fire({
                title: 'Transaksi Sukses!',
                html: `
                  <div class="text-left mt-2">
                    <p>Total Belanja: <b>Rp ${cartTotal.toLocaleString('id-ID')}</b></p>
                    <p>Tunai Diterima: <b>Rp ${Number(received).toLocaleString('id-ID')}</b></p>
                    <hr class="my-3 border-gray-300"/>
                    <p class="text-lg">Kembalian: <b class="text-[#EA5252]">Rp ${change.toLocaleString('id-ID')}</b></p>
                  </div>
                `,
                icon: 'success',
                confirmButtonText: 'Selesai',
                confirmButtonColor: '#5B7E3C',
                customClass: { popup: 'rounded-2xl' }
              })
            }
          })
        } else {
          // LOGIKA JIKA BAYAR PAKAI QRIS / DEBIT
          updateDailyRevenue(cartTotal)
          recordSoldItems(cart)
          clearCart()

          MySwal.fire({
            title: 'Transaksi Sukses!',
            html: `Total: <b>Rp ${cartTotal.toLocaleString('id-ID')}</b><br/>Metode: <b>${paymentMethod}</b>`,
            icon: 'success',
            confirmButtonColor: '#5B7E3C',
            customClass: { popup: 'rounded-2xl' }
          })
        }
      }
    })
  }

  // LOGIKA PENGUNCI LAYAR POS
  if (userRole === 'EMPLOYEE' && !isClockedIn) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#F5F7F8] p-6">
        <div className="bg-white p-10 rounded-2xl shadow-md text-center max-w-md w-full border border-gray-200">
          <div className="bg-red-50 text-[#EA5252] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Lock size={48} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Sistem Terkunci</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            SOP operasional: Silakan <span className="font-bold text-gray-900">Clock In</span> terlebih dahulu untuk memulai shift dan membuka menu pesanan.
          </p>
          <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
            <p className="text-sm font-semibold text-[#5B7E3C]">
              Buka tab HR di menu samping atau klik tombol Clock In di pojok kanan atas.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-4 h-full bg-[#F5F7F8] p-4">
      {/* Categories Sidebar */}
      <div className="w-40 bg-white rounded-lg shadow-md p-4 flex flex-col gap-2 overflow-y-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              selectedCategory === cat
                ? 'bg-[#5B7E3C] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="flex-1 bg-white rounded-lg shadow-md p-4 overflow-y-auto">
        <div className="grid grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              disabled={item.soldOut}
              className={`p-4 rounded-lg border-2 transition text-left ${
                item.soldOut
                  ? 'bg-gray-200 border-gray-300 opacity-50 cursor-not-allowed'
                  : 'border-gray-200 hover:border-[#5B7E3C] bg-white hover:bg-gray-50'
              }`}
              
            >
              <div className="w-full h-28 mb-3 bg-gray-200 rounded-md overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className={`w-full h-full object-cover ${item.soldOut ? 'grayscale opacity-50' : ''}`}
                />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{item.name}</h3>
              <p className="text-lg font-semibold text-[#5B7E3C] mb-2">Rp{item.price.toLocaleString('id-ID')}</p>
              {item.soldOut && (
                <span className="inline-block px-2 py-1 bg-[#EA5252] text-white text-xs font-bold rounded">
                  Sold Out
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-80 bg-white rounded-lg shadow-md p-4 flex flex-col">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Keranjang Pesanan</h2>

        <div className="flex-1 overflow-y-auto mb-4 border border-gray-200 rounded-lg p-3 space-y-2">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Tidak ada Item di Keranjang</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-600">
                    {item.size} - Rp{(item.price * item.quantity).toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="p-1 bg-gray-200 hover:bg-gray-300 rounded text-gray-700"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center font-bold text-sm text-gray-900">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    className="p-1 bg-gray-200 hover:bg-gray-300 rounded text-gray-700"
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 bg-[#EA5252] hover:bg-[#d14545] rounded text-white ml-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between mb-4">
            <span className="font-bold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-[#5B7E3C]">Rp{cartTotal.toLocaleString('id-ID')}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full py-3 bg-[#5B7E3C] hover:bg-[#4a6530] disabled:bg-gray-300 text-white font-bold rounded-lg transition mb-2"
          >
            Checkout
          </button>
          <button
            onClick={clearCart}
            disabled={cart.length === 0}
            className="w-full py-2 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-gray-700 font-semibold rounded-lg transition"
          >
            Ulang Pesanan
          </button>
        </div>
      </div>

    </div>
  )
}
