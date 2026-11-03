function Navbar({ currentPage, setCurrentPage }) {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* โลโก้ / ชื่อเว็บ */}
        <div
          onClick={() => setCurrentPage('home')}
          className="text-xl font-bold text-blue-600 cursor-pointer"
        >
          Project-T
        </div>

        {/* เมนูสลับหน้า */}
        <div className="flex gap-4">
          <button
            onClick={() => setCurrentPage('home')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              currentPage === 'home'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            หน้าแรก (Home)
          </button>

          <button
            onClick={() => setCurrentPage('about')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              currentPage === 'about'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            เกี่ยวกับทีม (About)
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

