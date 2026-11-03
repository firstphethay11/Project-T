import { GitBranch, Sparkles, BookOpen, ExternalLink } from 'lucide-react'

function Navbar({ currentPage, setCurrentPage }) {
  return (
    <header className="sticky top-0 z-40 h-16 bg-white/85 backdrop-blur-md border-b border-gray-200/80 shadow-xs flex items-center">
      <div className="max-w-7xl w-full mx-auto px-6 flex items-center justify-between">
        {/* โลโก้ + ชื่อโปรเจกต์ (คลิกเพื่อกลับหน้าแรกได้) */}
        <div
          onClick={() => setCurrentPage('home')}
          className="group flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold bg-gradient-to-r from-slate-900 via-blue-700 to-emerald-600 bg-clip-text text-transparent">
                Project-T
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                <Sparkles className="w-2.5 h-2.5" />
                Git Team
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">
              React • Vite • Tailwind CSS
            </p>
          </div>
        </div>

        {/* ด้านขวา: ปุ่มเปิดหน้าแนะนำคู่มือ Git (ไม่ซ้ำกับ Aside ด้านซ้าย) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('guide')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border ${
              currentPage === 'guide'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-md shadow-blue-500/25'
                : 'bg-blue-50/70 text-blue-700 border-blue-200/80 hover:bg-blue-100/80'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>หน้าแนะนำ (Git Guide)</span>
          </button>

          <a
            href="https://github.com/firstphethay11/Project-T"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200/80 transition"
          >
            <span>GitHub Repo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  )
}

export default Navbar
