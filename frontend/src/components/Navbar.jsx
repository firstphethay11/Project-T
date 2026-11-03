import { Dices, Sparkles, BookOpen, LogIn, LogOut, User, Gamepad2 } from 'lucide-react'

function Navbar({ currentPage, setCurrentPage, currentUser, setCurrentUser }) {
  return (
    <header className="sticky top-0 z-40 h-16 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/90 shadow-2xs flex items-center">
      {/* ขยายความกว้างเต็มจอ ชนขอบซ้าย-ขวาอย่างพอดี */}
      <div className="w-full px-5 sm:px-8 flex items-center justify-between">
        {/* ฝั่งซ้าย: โลโก้ บอร์ดเกม เท่ๆ สะอาดตา */}
        <div
          onClick={() => setCurrentPage('home')}
          className="group flex items-center gap-3.5 cursor-pointer select-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-slate-900 group-hover:bg-blue-600 flex items-center justify-center text-white shadow-md shadow-slate-900/15 group-hover:shadow-blue-500/30 transition-all duration-300 transform group-hover:scale-105">
            <Dices className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                บอร์ดเกม
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200/80 rounded-md">
                <Gamepad2 className="w-3 h-3 text-blue-600" />
                <span>BOARD GAME</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              ศูนย์รวมเกมกระดาน & ไพ่ UNO ออนไลน์
            </p>
          </div>
        </div>

        {/* ฝั่งขวา: เมนูคู่มือ + สถานะเข้าสู่ระบบ สะอาดตา */}
        <div className="flex items-center gap-3">
          {/* ปุ่มหน้าแนะนำ */}
          <button
            onClick={() => setCurrentPage('guide')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer border ${
              currentPage === 'guide'
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">คู่มือเกม & Git</span>
          </button>

          {/* สถานะบัญชีผู้ใช้ */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 pl-2 border-l border-gray-200">
              <button
                onClick={() => setCurrentPage('login')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                title="คลิกเพื่อดูโปรไฟล์"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold">{currentUser.username || currentUser.full_name}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </button>

              <button
                onClick={() => setCurrentUser(null)}
                title="ออกจากระบบ"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCurrentPage('login')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer shadow-xs ${
                currentPage === 'login'
                  ? 'bg-blue-600 text-white shadow-blue-500/25'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>เข้าสู่ระบบ</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
