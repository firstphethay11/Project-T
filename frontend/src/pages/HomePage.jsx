import { useState } from 'react'
import { Pin, Palette, Sparkles, Rocket, Check, ArrowRight } from 'lucide-react'
import realisticHero from '../assets/realistic-hero.jpg'

function Homepage({ setCurrentPage }) {
  // State สำหรับ Checklist งาน ทำให้หน้าเว็บมีการตอบสนอง ไม่นิ่ง (Interactive & Dynamic)
  const [tasks1, setTasks1] = useState([
    { id: 1, text: 'ออกแบบ Hero Banner วิวธรรมชาติภูเขาและสายน้ำ', done: true },
    { id: 2, text: 'เพิ่มเอฟเฟกต์เคลื่อนไหว ละอองแสง และหมอกลอย', done: true },
    { id: 3, text: 'ตกแต่งหน้า Homepage.jsx ให้โมเดิร์นและสมจริง', done: true },
  ])

  const [tasks2, setTasks2] = useState([
    { id: 1, text: 'เพิ่มประวัติและข้อมูลสมาชิกในทีมให้ครบถ้วน', done: true },
    { id: 2, text: 'ปรับแต่งสไตล์และการ์ดสมาชิกใน AboutPage.jsx', done: false },
    { id: 3, text: 'สร้าง Branch ใหม่แล้วส่ง Pull Request', done: false },
  ])

  const toggleTask1 = (id) => {
    setTasks1((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    )
  }

  const toggleTask2 = (id) => {
    setTasks2((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    )
  }

  const progress1 = Math.round(
    (tasks1.filter((t) => t.done).length / tasks1.length) * 100
  )
  const progress2 = Math.round(
    (tasks2.filter((t) => t.done).length / tasks2.length) * 100
  )

  return (
    <div className="space-y-8 pb-12">
      {/* CSS Animation Keyframes สำหรับความเคลื่อนไหว & บรรยากาศสมจริง */}
      <style>{`
        @keyframes kenBurnsSlow {
          0% { transform: scale(1.0) translate(0%, 0%); }
          50% { transform: scale(1.07) translate(-1%, -0.5%); }
          100% { transform: scale(1.0) translate(0%, 0%); }
        }
        @keyframes mistDrift1 {
          0% { transform: translateX(-15%); opacity: 0.35; }
          50% { opacity: 0.65; }
          100% { transform: translateX(20%); opacity: 0.35; }
        }
        @keyframes mistDrift2 {
          0% { transform: translateX(20%); opacity: 0.25; }
          50% { opacity: 0.55; }
          100% { transform: translateX(-20%); opacity: 0.25; }
        }
        @keyframes rayPulse {
          0%, 100% { opacity: 0.25; transform: rotate(-22deg) translateY(0); }
          50% { opacity: 0.6; transform: rotate(-22deg) translateY(-8px); }
        }
        @keyframes floatingParticle {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          30% { opacity: 0.9; }
          80% { opacity: 0.7; }
          100% { transform: translateY(-75px) scale(1.3); opacity: 0; }
        }
        .animate-ken-burns {
          animation: kenBurnsSlow 26s ease-in-out infinite alternate;
        }
        .animate-mist-slow {
          animation: mistDrift1 20s ease-in-out infinite alternate;
        }
        .animate-mist-fast {
          animation: mistDrift2 14s ease-in-out infinite alternate;
        }
        .animate-ray {
          animation: rayPulse 8s ease-in-out infinite;
        }
      `}</style>

      {/* Hero Section: ภาพถ่ายธรรมชาติสมจริงระดับ Cinematic พร้อมระบบ Motion */}
      <section className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-gray-200/80 bg-slate-950 text-white">
        {/* เลเยอร์ที่ 1: ภาพพื้นหลังสมจริง พร้อม Ken Burns Motion ซูมเคลื่อนไหวช้าๆ */}
        <div className="relative w-full h-[380px] sm:h-[460px] md:h-[500px] overflow-hidden">
          <img
            src={realisticHero}
            alt="Cinematic Realistic Alpine Valley & Cascading River"
            className="w-full h-full object-cover object-center animate-ken-burns select-none"
          />

          {/* เลเยอร์ที่ 2: ลำแสงธรรมชาติยามเช้า (Volumetric Sunbeams / Light Rays) จากภาพสเก็ตช์ */}
          <div className="absolute -top-24 left-1/4 w-96 h-[550px] bg-gradient-to-b from-amber-100/40 via-amber-50/15 to-transparent pointer-events-none transform -rotate-22 blur-2xl animate-ray"></div>
          <div
            className="absolute -top-16 left-1/3 w-64 h-[450px] bg-gradient-to-b from-white/30 via-sky-100/10 to-transparent pointer-events-none transform -rotate-20 blur-xl animate-ray"
            style={{ animationDelay: '3s' }}
          ></div>

          {/* เลเยอร์ที่ 3: ละอองหมอกลอยผ่านหุบเขา (Dynamic Atmospheric Mist Layers) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/3 -left-1/4 w-[160%] h-36 bg-gradient-to-r from-transparent via-white/40 to-transparent blur-3xl animate-mist-slow"></div>
            <div className="absolute top-1/2 -right-1/4 w-[150%] h-28 bg-gradient-to-r from-transparent via-sky-100/35 to-transparent blur-2xl animate-mist-fast"></div>
          </div>

          {/* เลเยอร์ที่ 4: ละอองแสงทองลอยขึ้นในอากาศ (Floating Ambient Light Specks) */}
          {[
            { bottom: '20%', left: '18%', delay: '0s', dur: '4.5s' },
            { bottom: '28%', left: '32%', delay: '1.2s', dur: '5.2s' },
            { bottom: '22%', left: '50%', delay: '2.4s', dur: '4.8s' },
            { bottom: '35%', left: '68%', delay: '0.8s', dur: '5.8s' },
            { bottom: '25%', left: '82%', delay: '1.8s', dur: '4.2s' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="absolute w-1.5 h-1.5 rounded-full bg-amber-200/90 pointer-events-none shadow-sm shadow-amber-300"
              style={{
                bottom: item.bottom,
                left: item.left,
                animation: `floatingParticle ${item.dur} ease-in-out infinite`,
                animationDelay: item.delay,
              }}
            />
          ))}

          {/* เลเยอร์ที่ 5: แสงเงา Vignette เพื่อให้ข้อความอ่านง่าย คมชัดทุกมุมมอง */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/20 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-slate-950/50 pointer-events-none"></div>

          {/* เลเยอร์ที่ 6: กล่องเนื้อหาหลัก (Content Overlay) อยู่ในฉากแบบ Glassmorphism สวยหรู */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-12 z-10 max-w-3xl">
            {/* Live Indicator Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/15 text-white text-xs font-semibold w-fit mb-4 shadow-lg">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>Project-T • Realistic Vista Edition</span>
            </div>

            {/* หัวข้อหน้า Home */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-3 drop-shadow-md">
              ยินดีต้อนรับสู่โปรเจกต์ฝึก Git{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-amber-300">
                (หน้าแรก)
              </span>
            </h1>

            {/* คำอธิบาย */}
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl drop-shadow-sm font-light">
              หน้านี้คือไฟล์{' '}
              <code className="bg-slate-900/80 text-sky-300 font-mono text-xs sm:text-sm px-2.5 py-1 rounded-md border border-white/20 backdrop-blur-sm">
                src/pages/Homepage.jsx
              </code>{' '}
              สำหรับลองตกแต่งหน้าบ้านด้วย Tailwind CSS พร้อมบรรยากาศธรรมชาติสมจริง
            </p>

            {/* ปุ่ม Action หลัก */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setCurrentPage('about')}
                className="group bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-medium px-7 py-3.5 rounded-xl shadow-lg shadow-blue-600/40 hover:shadow-blue-500/60 transition-all duration-300 active:scale-95 cursor-pointer flex items-center gap-3 border border-white/20"
              >
                <span>ดูข้อมูลสมาชิกในทีม</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>

              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 bg-slate-900/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                <span>คลิก Checklist ด้านล่างเพื่ออัปเดตงานแบบ Real-time</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* โซนการ์ดภารกิจ 2 ใบ (ตกแต่งใหม่ มีระบบ Interactive คลิกติ๊กถูกได้ มี Motion) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* การ์ดคนที่ 1 */}
        <div className="group bg-white p-6 sm:p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100">
                Front-end & UI Designer
              </span>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1.5">
                <span>{progress1}% เสร็จแล้ว</span>
              </span>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Pin className="w-5 h-5 text-blue-600 shrink-0" />
              <span>โจทย์ของคนที่ 1</span>
            </h2>

            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              ลองตกแต่งหน้า{' '}
              <span className="font-semibold text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded">
                Homepage.jsx
              </span>{' '}
              หรือ{' '}
              <span className="font-semibold text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded">
                Navbar.jsx
              </span>{' '}
              ให้สวยงามขึ้น
            </p>

            {/* แถบความคืบหน้า Progress Bar เคลื่อนไหว */}
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-4">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progress1}%` }}
              ></div>
            </div>

            {/* Interactive Checklist สามารถคลิกติ๊กเพื่อเปลี่ยนสถานะได้จริง */}
            <div className="space-y-2.5 mb-5">
              {tasks1.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask1(task.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all duration-200 select-none ${
                    task.done
                      ? 'bg-blue-50/60 border-blue-200 text-blue-900'
                      : 'bg-gray-50 border-gray-200/80 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                      task.done
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {task.done && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className={task.done ? 'font-medium' : ''}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-gray-400 pt-3 border-t border-gray-100 flex items-center justify-between">
            <span>ไฟล์: src/pages/Homepage.jsx</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {progress1 === 100 ? (
                <>
                  <span>สมบูรณ์แบบ</span>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                </>
              ) : (
                <span>กำลังดำเนินการ</span>
              )}
            </span>
          </div>
        </div>

        {/* การ์ดคนที่ 2 */}
        <div className="group bg-white p-6 sm:p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-100">
                Team Profile & PR
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                <span>{progress2}% เสร็จแล้ว</span>
              </span>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Palette className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>โจทย์ของคนที่ 2</span>
            </h2>

            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              ลองตกแต่งหน้า{' '}
              <span className="font-semibold text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded">
                AboutPage.jsx
              </span>{' '}
              หรือ{' '}
              <span className="font-semibold text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded">
                Footer.jsx
              </span>{' '}
              แล้วส่ง Pull Request มา!
            </p>

            {/* แถบความคืบหน้า Progress Bar เคลื่อนไหว */}
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-4">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progress2}%` }}
              ></div>
            </div>

            {/* Interactive Checklist สามารถคลิกติ๊กเพื่อเปลี่ยนสถานะได้จริง */}
            <div className="space-y-2.5 mb-5">
              {tasks2.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask2(task.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all duration-200 select-none ${
                    task.done
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                      : 'bg-gray-50 border-gray-200/80 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                      task.done
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {task.done && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className={task.done ? 'font-medium' : ''}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-gray-400 pt-3 border-t border-gray-100 flex items-center justify-between">
            <span>ไฟล์: src/pages/AboutPage.jsx</span>
            <span className="text-amber-600 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>รอส่ง Pull Request</span>
              <Rocket className="w-3.5 h-3.5 text-amber-500" />
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Homepage
