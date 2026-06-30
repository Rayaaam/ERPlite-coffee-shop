'use client'

import { Check, X } from 'lucide-react'
import { useHR, useAuth } from '@/lib/hooks'

export default function HRManagement() {
  const { attendanceLogs, pendingRequests, approvePendingRequest, rejectPendingRequest } = useHR()
  const { userRole } = useAuth()
  const isOwner = userRole === 'OWNER'


  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }

 // Fungsi baru untuk menghitung durasi jam kerja otomatis
  const calculateDuration = (inTime: string, outTime: string | null | undefined) => {
  if (!outTime) return '-';
  const diffMs = new Date(outTime).getTime() - new Date(inTime).getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  return `${diffHrs} Jam`;
  }

  return (
    <div className="p-6 h-full bg-[#F5F7F8] overflow-y-auto space-y-6">
      {/* Attendance Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {isOwner ? 'Attendance Logs' : 'My Absences'}
        </h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#5B7E3C] text-white">
                  {isOwner && <th className="px-6 py-4 text-left font-semibold">Karyawan</th>}
                  <th className="px-6 py-4 text-left font-semibold">Tanggal</th>
                  <th className="px-6 py-4 text-left font-semibold">Clock In</th>
                  <th className="px-6 py-4 text-left font-semibold">Clock Out</th>
                  <th className="px-6 py-4 text-left font-semibold">Total Jam</th>
                  <th className="px-6 py-4 text-left font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attendanceLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition">
                    {isOwner && <td className="px-6 py-4 font-semibold text-gray-900">{log.employeeName}</td>}
                    
                    {/* Format tanggal rapi khas Indonesia */}
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(log.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    
                    {/* Jam dibikin font-mono biar angkanya sejajar lurus ke bawah */}
                    <td className="px-6 py-4 text-gray-900 font-mono font-medium">{formatTime(log.clockInTime)}</td>
                    <td className="px-6 py-4 text-gray-900 font-mono font-medium">
                      {log.clockOutTime ? formatTime(log.clockOutTime) : '-'}
                    </td>
                    
                    {/* Hasil kalkulasi jam kerja */}
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {calculateDuration(log.clockInTime, log.clockOutTime)}
                    </td>
                    
                    {/* Badge Status Interaktif */}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        log.clockOutTime
                          ? 'bg-green-100 text-green-800' // Hijau kalau udah Clock Out
                          : 'bg-amber-100 text-red-800 animate-pulse' // Kuning kedip kalau masih kerja
                      }`}>
                        {log.clockOutTime ? 'Selesai' : 'Sedang Berjalan'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pending Requests Section (Owner Only) */}
      {isOwner && pendingRequests.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pending Requests</h2>
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className={`p-4 rounded-lg border-l-4 ${
                  request.status === 'TERTUNDA'
                    ? 'bg-[#FFF4E6] border-[#FF9D23]'
                    : request.status === 'DISETUJUI'
                      ? 'bg-[#E6F7E6] border-[#5B7E3C]'
                      : 'bg-[#F5E6E6] border-[#EA5252]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{request.employeeName}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-semibold">{request.type}</span>
                      {request.amount && ` - Rp ${request.amount}`}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Alasan: {request.reason}</p>
                    <p className="text-xs text-gray-500 mt-2">Diminta: {request.requestedDate}</p>
                  </div>
                  {request.status === 'TERTUNDA' && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => approvePendingRequest(request.id)}
                        className="px-3 py-2 bg-[#5B7E3C] hover:bg-[#4a6530] text-white rounded-lg flex items-center gap-1 transition font-semibold text-sm"
                      >
                        <Check size={16} />
                        Setujui
                      </button>
                      <button
                        onClick={() => rejectPendingRequest(request.id)}
                        className="px-3 py-2 bg-[#EA5252] hover:bg-[#d14545] text-white rounded-lg flex items-center gap-1 transition font-semibold text-sm"
                      >
                        <X size={16} />
                        Tolak
                      </button>
                    </div>
                  )}
                  {request.status !== 'TERTUNDA' && (
                    <span
                      className={`px-3 py-1 rounded-lg font-semibold text-sm ${
                        request.status === 'DISETUJUI'
                          ? 'bg-[#5B7E3C] text-white'
                          : 'bg-[#EA5252] text-white'
                      }`}
                    >
                      {request.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingRequests.length === 0 && isOwner && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">No pending requests</p>
        </div>
      )}
    </div>
  )
}
