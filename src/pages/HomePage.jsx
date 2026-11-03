function Homepage({ setCurrentPage }) {
  return (
    <div className="space-y-8">
      {/* Hero Section - ลองแบ่งให้เพื่อนมาช่วยแต่งสีและข้อความตรงนี้ได้ */}
      <section className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-xs">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          ยินดีต้อนรับสู่โปรเจกต์ฝึก Git (หน้าแรก)
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto mb-6">
          หน้านี้คือไฟล์ <code className="bg-gray-100 px-2 py-0.5 rounded">src/pages/Homepage.jsx</code> สำหรับลองตกแต่งหน้าบ้านด้วย Tailwind CSS
        </p>
        <button
          onClick={() => setCurrentPage('about')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition cursor-pointer"
        >
          ดูข้อมูลสมาชิกในทีม →
        </button>
      </section>

      {/* โซนการ์ดตัวอย่าง 2 ใบ */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">📌 โจทย์ของคนที่ 1</h2>
          <p className="text-gray-600 text-sm">
            ลองตกแต่งหน้า <span className="font-medium">Homepage.jsx</span> หรือ <span className="font-medium">Navbar.jsx</span> ให้สวยงามขึ้น
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">🎨 โจทย์ของคนที่ 2</h2>
          <p className="text-gray-600 text-sm">
            ลองตกแต่งหน้า <span className="font-medium">AboutPage.jsx</span> หรือ <span className="font-medium">Footer.jsx</span> แล้วส่ง Pull Request มา!
          </p>
        </div>
      </section>
    </div>
  )
}

export default Homepage

