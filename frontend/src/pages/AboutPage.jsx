import { useState } from 'react'
import { UserRound, Plus, X, Trash2, PartyPopper } from 'lucide-react'

function AboutPage() {
  // สถานะเก็บรายชื่อสมาชิก (เริ่มต้นไม่มีกล่อง)
  const [members, setMembers] = useState([])

  // สถานะเปิด/ปิด Modal สำหรับกรอกข้อมูล
  const [isModalOpen, setIsModalOpen] = useState(false)

  // สถานะเก็บข้อมูลในแบบฟอร์ม
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    message: '',
  })

  // สถานะแจ้งเตือนข้อความเด้งขึ้นมา (Toast notification)
  const [toastMessage, setToastMessage] = useState(null)

  // เปิด Modal และรีเซ็ตฟอร์ม
  const handleOpenModal = () => {
    setFormData({ name: '', role: '', message: '' })
    setIsModalOpen(true)
  }

  // ปิด Modal
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  // จัดการเมื่อกดปุ่ม "ตกลง" ใน Modal
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    const newMember = {
      id: Date.now(),
      name: formData.name.trim(),
      role: formData.role.trim() || 'Frontend Developer',
      message: formData.message.trim() || 'สวัสดีครับ ยินดีที่ได้ร่วมงานกัน!',
    }

    // เพิ่มสมาชิกใหม่เข้าไปในกล่อง
    setMembers((prev) => [...prev, newMember])

    // ปิด Modal
    setIsModalOpen(false)

    // แสดงข้อความเด้งแจ้งเตือน "ยินดีต้อนรับ"
    setToastMessage(`ยินดีต้อนรับคุณ ${newMember.name} เข้าสู่ทีม!`)

    // ซ่อนข้อความแจ้งเตือนอัตโนมัติหลัง 3.5 วินาที
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  // ฟังก์ชันลบกล่องสมาชิก
  const handleDeleteMember = (id) => {
    setMembers((prev) => prev.filter((member) => member.id !== id))
  }

  return (
    <div className="space-y-6 relative">
      {/* ป๊อปอัปแจ้งเตือนข้อความเด้งขึ้นมา: ยินดีต้อนรับ */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-blue-600 text-white px-5 py-3.5 rounded-xl shadow-xl transition-all duration-300">
          <PartyPopper className="w-6 h-6 text-yellow-300 shrink-0" />
          <div>
            <p className="font-bold text-sm">ยินดีต้อนรับ!</p>
            <p className="text-xs text-blue-100">{toastMessage}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-blue-200 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ส่วนหัว และ ปุ่มเพิ่มกล่อง */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">เกี่ยวกับสมาชิกในทีม (About Us)</h1>
          <p className="text-gray-600 mt-1 text-sm">
            กดปุ่มเพื่อกรอกข้อมูลและสร้างกล่องสมาชิกใหม่ในทีม
          </p>
        </div>

        {/* ปุ่มเปิดหน้าต่างเพิ่มสมาชิก */}
        <button
          onClick={handleOpenModal}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg transition shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มกล่องสมาชิก</span>
        </button>
      </div>

      {/* กรณีที่ยังไม่มีกล่อง (หน้าเพจเริ่มต้น) */}
      {members.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl bg-white/60">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full inline-flex items-center justify-center">
              <UserRound className="w-10 h-10" />
            </div>
          </div>
          <p className="text-gray-600 font-medium">ยังไม่มีกล่องสมาชิก</p>
          <p className="text-sm text-gray-400 mt-1">
            กดปุ่ม <span className="font-semibold text-blue-600">"+ เพิ่มกล่องสมาชิก"</span> ด้านบนเพื่อเพิ่มข้อมูล
          </p>
        </div>
      )}

      {/* รายการกล่องสมาชิก (แสดงเมื่อกดบันทึกข้อมูล) */}
      {members.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {members.map((member, index) => (
            <div
              key={member.id}
              className="p-6 bg-white border border-gray-200 rounded-xl shadow-xs relative hover:shadow-md transition"
            >
              {/* แถวบน: ลำดับสมาชิก และ ปุ่มลบ */}
              <div className="flex items-center justify-between mb-3">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  Member #{index + 1}
                </span>
                <button
                  onClick={() => handleDeleteMember(member.id)}
                  className="text-gray-400 hover:text-red-500 text-sm font-medium transition flex items-center gap-1 cursor-pointer"
                  title="ลบกล่องนี้"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>ลบ</span>
                </button>
              </div>

              {/* ข้อมูลสมาชิกในกล่อง */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-1">
                  <UserRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{member.name}</h2>
                  <p className="text-gray-600 text-sm mt-0.5">
                    <span className="font-medium text-gray-700">ตำแหน่ง:</span> {member.role}
                  </p>
                </div>
              </div>

              {/* ข้อความทักทาย */}
              <div className="mt-4 bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                💬 {member.message}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal หน้าต่างกรอกข้อมูลสมาชิกใหม่ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            {/* หัวข้อ Modal และปุ่มปิด */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h2 className="text-lg font-bold text-gray-800">เพิ่มกล่องสมาชิกใหม่</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* แบบฟอร์มกรอกข้อมูล */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อ-นามสกุล <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น สมชาย ใจดี"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ตำแหน่ง
                </label>
                <input
                  type="text"
                  placeholder="เช่น Frontend Developer"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ข้อความทักทาย
                </label>
                <textarea
                  rows="3"
                  placeholder="เช่น ยินดีที่ได้ร่วมทีมครับ!"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              {/* ปุ่มกดยกเลิกและตกลง */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-xs cursor-pointer"
                >
                  ตกลง
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AboutPage
