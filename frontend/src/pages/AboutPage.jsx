function AboutPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">เกี่ยวกับสมาชิกในทีม (About Us)</h1>
        <p className="text-gray-600 mt-1">
          แก้ไขข้อมูลในไฟล์ <code className="bg-gray-100 px-2 py-0.5 rounded">src/pages/AboutPage.jsx</code>
        </p>
      </div>

      {/* การ์ดแนะนำตัวสมาชิก */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* การ์ดคนที่ 1 */}
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-xs">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-3">
            Member #1
          </span>
          <h2 className="text-xl font-bold text-gray-800">ชื่อ: [ใส่ชื่อของคุณ]</h2>
          <p className="text-gray-600 mt-2">ตำแหน่ง: Frontend Developer</p>
          <p className="text-gray-500 text-sm mt-2">ข้อความทักทาย: สวัสดีครับ มาฝึกใช้ Git ด้วยกัน!</p>
        </div>

        {/* การ์ดคนที่ 2 */}
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-xs">
          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full mb-3">
            Member #2
          </span>
          <h2 className="text-xl font-bold text-gray-800">ชื่อ: [ใส่ชื่อของเพื่อน]</h2>
          <p className="text-gray-600 mt-2">ตำแหน่ง: UI/UX & Frontend</p>
          <p className="text-gray-500 text-sm mt-2">ข้อความทักทาย: ยินดีที่ได้ร่วมทีมครับ!</p>
        </div>
      </div>
    </div>
  )
}

export default AboutPage

