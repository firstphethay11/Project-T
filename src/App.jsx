function App() {
  return (
    <div className="max-w-3xl mx-auto p-8 font-sans">
      {/* ส่วนหัวข้อหลัก */}
      <header className="border-b-2 border-gray-200 pb-4 mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Git Practice Project</h1>
        <p className="text-gray-600 mt-1">โปรเจกต์สำหรับฝึกใช้งาน Git ร่วมกับเพื่อน (React + Tailwind)</p>
      </header>

      {/* ส่วนเนื้อหา แบ่งโซนกันแก้ */}
      <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* โซนของคนที่ 1 */}
        <section className="p-6 border border-gray-300 rounded-xl shadow-sm bg-white">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">สมาชิกคนที่ 1</h2>
          <p className="text-gray-700">ชื่อ: [ใส่ชื่อของคุณ]</p>
          <p className="text-gray-500 mt-1">ข้อความทักทาย: สวัสดีครับ!</p>
        </section>

        {/* โซนของคนที่ 2 */}
        <section className="p-6 border border-gray-300 rounded-xl shadow-sm bg-white">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">สมาชิกคนที่ 2</h2>
          <p className="text-gray-700">ชื่อ: [ใส่ชื่อของเพื่อน]</p>
          <p className="text-gray-500 mt-1">ข้อความทักทาย: ยินดีที่ได้ร่วมงาน!</p>
        </section>
      </main>

      <footer className="mt-12 text-center text-gray-400 text-sm">
        <p>© 2026 Git Team Practice</p>
      </footer>
    </div>
  )
}

export default App