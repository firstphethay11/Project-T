import { useState, useEffect } from 'react'
import {
  LogIn,
  UserPlus,
  Database,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  User,
  Briefcase,
  RefreshCw,
  ArrowLeft,
  GitBranch,
  Sparkles,
} from 'lucide-react'

const API_BASE = 'http://localhost:5001'

function LoginPage({ currentUser, setCurrentUser, setCurrentPage }) {
  // สลับโหมด 'login' หรือ 'register'
  const [mode, setMode] = useState('login')

  // ข้อมูลฟอร์ม
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('Frontend Developer')

  // สถานะแจ้งผลลัพธ์
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)

  // รายชื่อผู้ใช้จาก MySQL (Port 3307)
  const [dbUsers, setDbUsers] = useState([])

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users`)
      if (res.ok) {
        const data = await res.json()
        setDbUsers(data)
      }
    } catch {
      // กรณีเซิร์ฟเวอร์ Backend ยังไม่ถูกเปิด
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)

    try {
      const endpoint = mode === 'login' ? '/api/login' : '/api/register'
      const payload =
        mode === 'login'
          ? { username, password }
          : { username, password, full_name: fullName, role }

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'เกิดข้อผิดพลาดในการเชื่อมต่อ')
      } else {
        setSuccessMsg(data.message)
        setCurrentUser(data.user)
        setUsername('')
        setPassword('')
        setFullName('')
        fetchUsers()
      }
    } catch {
      setErrorMsg(
        'ไม่สามารถเชื่อมต่อ Backend (พอร์ต 5001) ได้ กรุณาตรวจสอบว่า npm run dev รันอยู่'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-slate-100 flex flex-col font-sans">
      {/* แถบด้านบนของหน้า Login แยกเดี่ยว */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <button
          onClick={() => setCurrentPage('home')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-sm font-medium transition cursor-pointer backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับสู่หน้าหลัก</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
            <GitBranch className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg text-white">Project-T</span>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full">
            <Sparkles className="w-2.5 h-2.5" />
            MySQL Auth
          </span>
        </div>
      </header>

      {/* ส่วนเนื้อหาฟอร์มตรงกลาง */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 pb-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ฝั่งซ้าย: ฟอร์ม Login / Register */}
          <div className="lg:col-span-3 bg-white text-gray-800 rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/10">
            {/* สลับปุ่ม Login / Register */}
            <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('login')
                  setErrorMsg('')
                  setSuccessMsg('')
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>เข้าสู่ระบบ (Login)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('register')
                  setErrorMsg('')
                  setSuccessMsg('')
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>สมัครสมาชิก (Register)</span>
              </button>
            </div>

            {/* แสดงสถานะหากล็อกอินอยู่แล้ว */}
            {currentUser && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-600 text-white rounded-xl">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-950">
                      เข้าสู่ระบบในชื่อ: {currentUser.full_name} (@{currentUser.username})
                    </p>
                    <p className="text-xs text-emerald-700">ตำแหน่ง: {currentUser.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentPage('home')}
                  className="text-xs font-semibold px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition cursor-pointer shrink-0"
                >
                  ไปหน้าแรก →
                </button>
              </div>
            )}

            {/* แจ้งเตือน Error / Success */}
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* ฟอร์มกรอกข้อมูล */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  ชื่อผู้ใช้ (Username)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="เช่น member1"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  รหัสผ่าน (Password)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="รหัสผ่านตัวอย่าง: 1234"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      ชื่อ-นามสกุล (Full Name)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น สมชาย ใจดี"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      ตำแหน่งในทีม (Role)
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="เช่น Frontend Developer"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl text-white font-semibold text-sm shadow-md transition cursor-pointer ${
                  mode === 'login'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
                }`}
              >
                {loading
                  ? 'กำลังประมวลผล...'
                  : mode === 'login'
                  ? 'เข้าสู่ระบบด้วย MySQL'
                  : 'บันทึกข้อมูลลง MySQL'}
              </button>
            </form>
          </div>

          {/* ฝั่งขวา: ตาราง MySQL Data Preview */}
          <div className="lg:col-span-2 bg-slate-800/80 backdrop-blur-md rounded-3xl border border-white/10 p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">
                      ตาราง <code className="text-blue-400">users</code> ใน MySQL
                    </h2>
                    <p className="text-xs text-slate-400">project_t_db (Port 3307)</p>
                  </div>
                </div>

                <button
                  onClick={fetchUsers}
                  title="รีเฟรชข้อมูลจากฐานข้อมูล"
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5">
                {dbUsers.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => {
                      if (mode === 'login') {
                        setUsername(u.username)
                        setPassword('1234')
                      }
                    }}
                    className="p-3.5 rounded-2xl border border-white/10 bg-slate-900/50 hover:bg-blue-500/10 hover:border-blue-400/50 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-200">{u.full_name}</span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                        @{u.username}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{u.role}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-white/10 text-xs text-slate-400">
              💡 คลิกที่ชื่อผู้ใช้เพื่อกรอกรหัสตัวอย่างทันที หรือเพิ่มคนใหม่แล้วดูใน MySQL Workbench ได้เลย
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginPage
