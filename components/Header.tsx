'use client'

import { Clock, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth, useHR } from '@/lib/hooks'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export default function Header() {
  const { userRole, isClockedIn, clockIn, clockOut } = useAuth()

  // State untuk menyimpan waktu saat ini
  const [currentTime, setCurrentTime] = useState(new Date())
  const { recordClockIn, recordClockOut } = useHR()

  // Efek untuk mengupdate waktu setiap 1 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    // Bersihkan timer kalau komponen ditutup biar ga bocor memorinya
    return () => clearInterval(timer)
  }, [])
  
  const handleClockToggle = () => {
  if (isClockedIn) {
    // Karyawan mau pulang (Clock Out)
    MySwal.fire({
      title: 'Yakin mau Clock Out?',
      text: "Pastikan laci kasir sudah sesuai sebelum mengakhiri shift.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Clock Out',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#EA5252', // Merah peringatan
      cancelButtonColor: '#E2E8F0',
      customClass: { 
        popup: 'rounded-2xl',
        cancelButton: 'text-gray-900 font-semibold'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        clockOut() 
        recordClockOut('Loehoet (Kasir)')
        MySwal.fire({
          title: 'Clock Out Berhasil',
          text: 'Terima kasih atas kerja kerasnya hari ini!',
          icon: 'success',
          confirmButtonColor: '#5B7E3C',
          customClass: { popup: 'rounded-2xl' }
        })
      }
    })
  } else {
    // Karyawan baru masuk (Clock In)
    clockIn() 
    recordClockIn('Loehoet (Kasir)')
    MySwal.fire({
      title: 'Berhasil Clock In!',
      text: `Selamat bekerja. Waktu masuk: ${new Date().toLocaleTimeString('id-ID')}`,
      icon: 'success',
      confirmButtonText: 'Siap!',
      confirmButtonColor: '#5B7E3C', 
      customClass: { popup: 'rounded-2xl' }
    })
  }
}

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          <p className="text-sm text-gray-600">Logged in as</p>
          <p className="font-bold text-gray-900 capitalize">{userRole === 'OWNER' ? 'Bos Owner (Admin)' : 'Loehoet (Kasir)'}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
      {/* Bagian Jam Real-time yang Minimalis */}
      <div className="text-right hidden sm:block">
        <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">
          {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <p className="text-xl font-bold text-gray-900 font-mono tracking-tight mt-0.5">
          {currentTime.toLocaleTimeString('id-ID')}
        </p>
      </div>

      {/* TAMPILIN TOMBOL ABSEN HANYA JIKA ROLE ADALAH EMPLOYEE */}
      {userRole === 'EMPLOYEE' && (
        <>
          {/* Garis Pemisah Vertikal (Biar estetik) */}
          <div className="hidden sm:block w-px h-10 bg-gray-300"></div>
          
          <button
            onClick={handleClockToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              isClockedIn
                ? 'bg-[#EA5252] hover:bg-[#d14545] text-white'
                : 'bg-[#5B7E3C] hover:bg-[#4a6530] text-white'
            }`}
          >
            {isClockedIn ? (
              <>
                <LogOut size={18} />
                Clock Out
              </>
            ) : (
              <>
                <Clock size={18} />
                Clock In
              </>
            )}
          </button>
        </>
      )}
    </div>
    </div>
  )
}
