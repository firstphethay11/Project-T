import { PartyPopper, X } from 'lucide-react'

function Toast({ message, onClose, title = 'ยินดีต้อนรับ!' }) {
  // ถ้าไม่มีข้อความ ไม่ต้องแสดง Component
  if (!message) return null

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-blue-600 text-white px-5 py-3.5 rounded-xl shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-top-4">
      <PartyPopper className="w-6 h-6 text-yellow-300 shrink-0" />
      <div>
        <p className="font-bold text-sm">{title}</p>
        <p className="text-xs text-blue-100">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="ml-2 text-blue-200 hover:text-white transition cursor-pointer"
        aria-label="ปิดการแจ้งเตือน"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Toast

