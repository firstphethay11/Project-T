import {
  BookOpen,
  GitBranch,
  GitCommitHorizontal,
  GitPullRequest,
  Download,
  ArrowLeft,
  Terminal,
  CheckCircle2,
} from 'lucide-react'

function GuidePage({ setCurrentPage }) {
  const steps = [
    {
      step: '01',
      title: 'ดึงโค้ดล่าสุดก่อนเริ่มงาน (Fetch & Pull)',
      desc: 'ก่อนเริ่มแก้โค้ดทุกครั้ง ให้กด Fetch origin -> Pull origin ใน GitHub Desktop เพื่ออัปเดตโค้ดล่าสุดของเพื่อนลงเครื่อง',
      icon: Download,
      color: 'from-sky-500 to-blue-600',
      badge: 'ทำทุกครั้งก่อนเริ่มงาน',
    },
    {
      step: '02',
      title: 'แยก Branch ของตัวเอง (Create Branch)',
      desc: 'กดที่ Current branch ด้านบน เลือก New branch แล้วตั้งชื่อฟีเจอร์ที่กำลังทำ เพื่อไม่ให้กระทบโค้ดหลักใน main',
      icon: GitBranch,
      color: 'from-indigo-500 to-purple-600',
      badge: 'ป้องกันโค้ดชนกัน',
    },
    {
      step: '03',
      title: 'บันทึกงานและส่งขึ้น GitHub (Commit & Push)',
      desc: 'เมื่อแต่งหน้าเว็บเสร็จ ให้พิมพ์สรุปสิ่งที่แก้ในช่อง Summary กดปุ่ม Commit แล้วกด Push origin ด้านขวาบน',
      icon: GitCommitHorizontal,
      color: 'from-emerald-500 to-teal-600',
      badge: 'บันทึกความคืบหน้า',
    },
    {
      step: '04',
      title: 'ขอรวมโค้ดเข้าหน้าหลัก (Pull Request & Merge)',
      desc: 'กดปุ่ม Create Pull Request เพื่อให้เพื่อนช่วยตรวจโค้ด แล้วกด Merge pull request เพื่อรวมงานเข้าสู่ main',
      icon: GitPullRequest,
      color: 'from-amber-500 to-orange-600',
      badge: 'รวมงานเข้าด้วยกัน',
    },
  ]

  return (
    <div className="space-y-8 pb-12">
      {/* แบนเนอร์หัวข้อหน้าแนะนำ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-8 sm:p-10 shadow-xl border border-white/10">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Team Onboarding & Git Workflow</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              แนะนำขั้นตอนการทำงานร่วมกันด้วย Git
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              คู่มือสรุปสั้นๆ สำหรับสมาชิกในทีม Project-T เวลาแบ่งกันตกแต่งหน้าบ้านและหลังบ้านผ่าน GitHub Desktop
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('home')}
            className="inline-flex items-center gap-2 self-start sm:self-center px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-sm font-medium transition cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับหน้าแรก</span>
          </button>
        </div>
      </div>

      {/* การ์ด 4 ขั้นตอนหลัก */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.step}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-sm`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                    Step {item.step} • {item.badge}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-gray-800 mb-2">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>รองรับทั้ง GitHub Desktop และ Terminal</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* กล่องคำสั่งรันโปรเจกต์ประจำทีม */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-base">
              คำสั่งรันโปรเจกต์ (Frontend + Backend พร้อมกัน)
            </h3>
            <p className="text-xs text-gray-500">
              ระบบจะตรวจสอบและติดตั้งไลบรารีที่เพื่อนเพิ่มมาใหม่อัตโนมัติทุกครั้งที่รัน
            </p>
          </div>
        </div>

        <div className="bg-slate-900 text-slate-100 font-mono text-sm px-4 py-3 rounded-xl flex items-center justify-between">
          <code>npm run dev</code>
          <span className="text-xs text-emerald-400 font-sans">
            Auto-install enabled
          </span>
        </div>
      </div>
    </div>
  )
}

export default GuidePage

