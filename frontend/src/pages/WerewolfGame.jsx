import { useState } from 'react'
import {
  Moon,
  Sun,
  Shield,
  Eye,
  Users,
  Skull,
  Play,
  RotateCcw,
  Sparkles,
  Home,
  HelpCircle,
} from 'lucide-react'

// รายการบทบาทตัวละครในเกมแวร์วูล์ฟ
const ROLES = [
  {
    id: 'werewolf',
    name: 'หมาป่า (Werewolf)',
    team: 'ฝ่ายหมาป่า',
    icon: Skull,
    color: 'text-red-400 bg-red-950/60 border-red-500/50',
    desc: 'ตื่นขึ้นมาในตอนกลางคืนเพื่อเลือกกำจัดชาวบ้าน 1 คน',
  },
  {
    id: 'seer',
    name: 'ผู้หยั่งรู้ (Seer)',
    team: 'ฝ่ายชาวบ้าน',
    icon: Eye,
    color: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/50',
    desc: 'สามารถส่องดูบทบาทของผู้เล่นอื่นได้ 1 คนในแต่ละคืน',
  },
  {
    id: 'guard',
    name: 'ผู้พิทักษ์ (Bodyguard)',
    team: 'ฝ่ายชาวบ้าน',
    icon: Shield,
    color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/50',
    desc: 'เลือกปกป้องผู้เล่น 1 คนในแต่ละคืนไม่ให้ถูกหมาป่าโจมตี',
  },
  {
    id: 'villager',
    name: 'ชาวบ้าน (Villager)',
    team: 'ฝ่ายชาวบ้าน',
    icon: Users,
    color: 'text-amber-400 bg-amber-950/60 border-amber-500/50',
    desc: 'ไม่มีพลังพิเศษ ต้องใช้การจับโกหกและโหวตประหารหมาป่าในตอนกลางวัน',
  },
]

function WerewolfGame({ setCurrentPage }) {
  // สถานะเฟสเกม: 'lobby' (หน้าเลือก/เตรียมพร้อม) | 'night' (กลางคืน) | 'day' (กลางวัน)
  const [phase, setPhase] = useState('lobby')
  const [playerCount, setPlayerCount] = useState(6)

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-85px)] justify-between select-none">
      {/* แถบหัวด้านบน */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl border border-slate-800 shadow-md shrink-0 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
            <Moon className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-indigo-300">
              🐺 เกมแวร์วูล์ฟ (Werewolf)
            </span>
            <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/60 rounded-full">
              คืนพระจันทร์เต็มดวง
            </span>
          </div>
        </div>

        {/* ปุ่มกลับหน้าแรก */}
        {setCurrentPage && (
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>กลับหน้าแรก</span>
          </button>
        )}
      </div>

      {/* หน้า Lobby / ตัวเลือกเตรียมเข้าเล่น */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-center shadow-2xl relative overflow-hidden">
          {/* แสงเอฟเฟกต์พระจันทร์ */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* ไอคอนดวงจันทร์และหมาป่า */}
          <div className="w-20 h-20 bg-indigo-900/60 border border-indigo-400/40 rounded-3xl flex items-center justify-center text-amber-300 mx-auto shadow-xl shadow-indigo-950/50 mb-4 animate-pulse">
            <Moon className="w-10 h-10" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white mb-1 tracking-tight">
            ล่าหมาป่าในคืนพระจันทร์เต็มดวง 🐺🌕
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mb-6 max-w-md mx-auto">
            หมู่บ้านอันเงียบสงบกำลังถูกคุกคามด้วยเหล่ามนุษย์หมาป่า จงค้นหาความจริงและกำจัดพวกมันก่อนที่ทุกคนจะตกเป็นเหยื่อ!
          </p>

          {/* ตัวอย่างบทบาท 4 ตัวละคร */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6 text-left">
            {ROLES.map((role) => {
              const Icon = role.icon
              return (
                <div
                  key={role.id}
                  className={`p-3 rounded-2xl border ${role.color} flex flex-col justify-between`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5" />
                    <span className="text-[9px] font-bold opacity-80">{role.team}</span>
                  </div>
                  <div>
                    <p className="font-black text-xs text-white">{role.name}</p>
                    <p className="text-[10px] text-slate-300 line-clamp-2 mt-0.5">
                      {role.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ปุ่มเริ่มเกมและตัวเลือก */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => alert('ปุ่มเริ่มเกมแวร์วูล์ฟถูกกดแล้ว! ระบบการเล่นกำลังได้รับการพัฒนาในขั้นตอนถัดไป 🐺')}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white font-black text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>เริ่มเกมแวร์วูล์ฟ (Start Game)</span>
            </button>

            <button
              onClick={() => {
                if (setCurrentPage) setCurrentPage('game')
              }}
              className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-sm rounded-xl border border-slate-700 transition cursor-pointer"
            >
              🎲 สลับไปเกมเศรษฐี
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WerewolfGame

