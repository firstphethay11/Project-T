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
  Crosshair,
  FlaskConical,
  PawPrint,
  Laugh,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Bot,
  UserRound,
  EyeOff,
} from 'lucide-react'

// รายชื่อและข้อมูลความสามารถของทั้ง 9 บทบาท
const ALL_ROLES = [
  // ฝ่ายหมาป่า (Werewolf Team)
  {
    id: 'werewolf',
    name: 'หมาป่า',
    enName: 'Werewolf',
    team: 'werewolf',
    teamName: 'ฝ่ายหมาป่า',
    icon: Skull,
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
    borderColor: 'border-red-500/40',
    desc: 'ตื่นขึ้นมาในตอนกลางคืนร่วมกับฝูงเพื่อเลือกสังหารเหยื่อ 1 คน',
    defaultCount: 2,
  },
  {
    id: 'wolf_seer',
    name: 'หมาป่าหยั่งรู้',
    enName: 'Wolf Seer',
    team: 'werewolf',
    teamName: 'ฝ่ายหมาป่า',
    icon: Eye,
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    borderColor: 'border-rose-500/40',
    desc: 'หมาป่าพิเศษที่สามารถแอบส่องดูบทบาทของผู้เล่นอื่นได้ 1 คนในเวลากลางคืน',
    defaultCount: 1,
  },
  {
    id: 'wolf_pup',
    name: 'หมาป่าเด็ก',
    enName: 'Wolf Pup',
    team: 'werewolf',
    teamName: 'ฝ่ายหมาป่า',
    icon: PawPrint,
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    borderColor: 'border-orange-500/40',
    desc: 'หากหมาป่าเด็กถูกฆ่าตาย ในคืนถัดไปฝูงหมาป่าจะสามารถสังหารเหยื่อได้ 2 คน!',
    defaultCount: 1,
  },

  // ฝ่ายชาวบ้าน (Village Team)
  {
    id: 'seer',
    name: 'ผู้หยั่งรู้',
    enName: 'Seer',
    team: 'villager',
    teamName: 'ฝ่ายชาวบ้าน',
    icon: Eye,
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    borderColor: 'border-cyan-500/40',
    desc: 'สามารถเลือกส่องดูบทบาทที่แท้จริงของผู้เล่น 1 คนในแต่ละค่ำคืน',
    defaultCount: 1,
  },
  {
    id: 'bodyguard',
    name: 'ผู้พิทักษ์',
    enName: 'Bodyguard',
    team: 'villager',
    teamName: 'ฝ่ายชาวบ้าน',
    icon: Shield,
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    borderColor: 'border-emerald-500/40',
    desc: 'เลือกปกป้องผู้เล่น 1 คนในแต่ละคืนให้รอดพ้นจากการโจมตีของหมาป่า',
    defaultCount: 1,
  },
  {
    id: 'hunter',
    name: 'นายพราน',
    enName: 'Hunter',
    team: 'villager',
    teamName: 'ฝ่ายชาวบ้าน',
    icon: Crosshair,
    badgeColor: 'bg-lime-500/20 text-lime-300 border-lime-500/30',
    borderColor: 'border-lime-500/40',
    desc: 'เมื่อตัวเองตายลง สามารถชักปืนยิงผู้เล่นคนอื่นตายตามไปด้วยได้ 1 คนทันที',
    defaultCount: 1,
  },
  {
    id: 'witch',
    name: 'แม่มด',
    enName: 'Witch',
    team: 'villager',
    teamName: 'ฝ่ายชาวบ้าน',
    icon: FlaskConical,
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    borderColor: 'border-purple-500/40',
    desc: 'มียาวิเศษ 2 ขวด: ยาชุบชีวิต 1 ครั้ง (ช่วยคนที่โดนฆ่า) และยาพิษ 1 ครั้ง (สั่งตาย)',
    defaultCount: 1,
  },
  {
    id: 'villager',
    name: 'ชาวบ้าน',
    enName: 'Villager',
    team: 'villager',
    teamName: 'ฝ่ายชาวบ้าน',
    icon: Users,
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    borderColor: 'border-amber-500/40',
    desc: 'ไม่มีพลังพิเศษ ต้องใช้ไหวพริบจับโกหกและโหวตประหารหมาป่าในตอนกลางวัน',
    defaultCount: 3,
  },

  // ฝ่ายอิสระ (Neutral Team)
  {
    id: 'madman',
    name: 'คนบ้า',
    enName: 'Fool / Madman',
    team: 'neutral',
    teamName: 'ฝ่ายอิสระ',
    icon: Laugh,
    badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
    borderColor: 'border-fuchsia-500/40',
    desc: 'เป้าหมายคือทำอย่างไรก็ได้ให้ถูกโหวตประหารในตอนกลางวัน ถ้าถูกประหารจะชนะทันที!',
    defaultCount: 1,
  },
]

// รายชื่อบอททั้ง 11 ตัว
const BOT_NAMES = [
  'บอทอเล็กซ์',
  'บอทเอเลน่า',
  'บอทจอห์น',
  'บอทซาร่า',
  'บอทไมเคิล',
  'บอทลินดา',
  'บอทแจ็ค',
  'บอทเอ็มม่า',
  'บอทริว',
  'บอทมิเกล',
  'บอทเคน',
]

function WerewolfGame({ setCurrentPage }) {
  // สถานะเฟสเกม: 'setup' (ตั้งค่าบทบาท) | 'playing' (เริ่มเล่นในห้อง)
  const [phase, setPhase] = useState('setup')

  // จำนวนบอท (ค่าเริ่มต้น 11 ตัว + คุณ 1 คน = 12 คน)
  const botCount = 11
  const totalPlayers = botCount + 1

  // จำนวนของแต่ละบทบาทที่ผู้เล่นกำหนด
  const [roleCounts, setRoleCounts] = useState(() => {
    const initial = {}
    ALL_ROLES.forEach((r) => {
      initial[r.id] = r.defaultCount || 0
    })
    return initial
  })

  // ข้อมูลผู้เล่นและบอทหลังแจกบทบาท
  const [roster, setRoster] = useState([])
  const [isSecretRevealed, setIsSecretRevealed] = useState(false)
  const [gameCycle, setGameCycle] = useState('night') // 'night' | 'day'
  const [roundNumber, setRoundNumber] = useState(1)

  // คำนวณจำนวนบทบาทที่จัดไปแล้วทั้งหมด
  const currentTotalAssigned = Object.values(roleCounts).reduce((a, b) => a + b, 0)
  const isCountBalanced = currentTotalAssigned === totalPlayers

  // ปรับเพิ่มจำนวนบทบาท
  const handleIncrease = (roleId) => {
    if (currentTotalAssigned >= totalPlayers) return
    setRoleCounts((prev) => ({
      ...prev,
      [roleId]: (prev[roleId] || 0) + 1,
    }))
  }

  // ปรับลดจำนวนบทบาท
  const handleDecrease = (roleId) => {
    if ((roleCounts[roleId] || 0) <= 0) return
    setRoleCounts((prev) => ({
      ...prev,
      [roleId]: prev[roleId] - 1,
    }))
  }

  // รีเซ็ตเป็นค่าแนะนำสมดุลสำหรับ 12 คน
  const handleAutoBalance = () => {
    const balanced = {
      werewolf: 2,
      wolf_seer: 1,
      wolf_pup: 1,
      seer: 1,
      bodyguard: 1,
      hunter: 1,
      witch: 1,
      villager: 3,
      madman: 1,
    }
    setRoleCounts(balanced)
  }

  // สุ่มแจกบทบาทและเริ่มเกม
  const handleStartGame = () => {
    if (!isCountBalanced) return

    // สร้าง Deck ของการ์ดบทบาทตามจำนวนที่กำหนดไว้
    const deck = []
    ALL_ROLES.forEach((role) => {
      const count = roleCounts[role.id] || 0
      for (let i = 0; i < count; i++) {
        deck.push(role)
      }
    })

    // สลับไพ่แบบสุ่ม (Shuffle)
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[deck[i], deck[j]] = [deck[j], deck[i]]
    }

    // สร้างรายชื่อผู้เล่นทั้งหมด: คุณ 1 คน + บอท 12 ตัว
    const playerList = [
      {
        id: 0,
        name: 'คุณ (ผู้เล่น)',
        isUser: true,
        role: deck[0],
        isAlive: true,
      },
      ...BOT_NAMES.map((name, index) => ({
        id: index + 1,
        name: name,
        isUser: false,
        role: deck[index + 1],
        isAlive: true,
      })),
    ]

    setRoster(playerList)
    setIsSecretRevealed(true)
    setPhase('playing')
    setGameCycle('night')
    setRoundNumber(1)
  }

  // รีเซ็ตกลับไปหน้าตั้งค่า
  const handleResetToSetup = () => {
    setPhase('setup')
    setIsSecretRevealed(false)
  }

  const userPlayer = roster.find((p) => p.isUser)

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-85px)] justify-between select-none">
      {/* แถบหัวด้านบน */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl border border-slate-800 shadow-md shrink-0 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
            <Moon className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-indigo-300">
              🐺 เกมแวร์วูล์ฟ (11 บอท + คุณ)
            </span>
            <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/60 rounded-full">
              ห้อง 12 ผู้เล่น
            </span>
          </div>
        </div>

        {/* ปุ่มกลับหน้าแรก / สลับไปเกมเศรษฐี */}
        <div className="flex items-center gap-2">
          {setCurrentPage && (
            <button
              onClick={() => setCurrentPage('game')}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-300 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-600/40 rounded-lg transition cursor-pointer"
            >
              <span>🎲 สลับไปเกมเศรษฐี</span>
            </button>
          )}

          {setCurrentPage && (
            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>หน้าแรก</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= 1. หน้าตั้งค่าบทบาท (Setup Phase) ================= */}
      {phase === 'setup' && (
        <div className="flex-1 overflow-y-auto pr-1 min-h-0 space-y-3">
          {/* การ์ดสรุปยอดการจัดบทบาท */}
          <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">ตั้งค่าจำนวนคนในแต่ละบทบาท</h2>
                <span className="text-xs text-indigo-400 font-semibold">
                  (บอท 11 ตัว + คุณ = รวม 12 คน)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                กดปุ่ม <span className="text-indigo-300 font-bold">[+]</span> หรือ{' '}
                <span className="text-indigo-300 font-bold">[-]</span>{' '}
                เพื่อปรับจำนวนคนของแต่ละบทบาทให้ครบ 12 คนพอดี
              </p>
            </div>

            {/* สรุปยอดและปุ่มเริ่ม */}
            <div className="flex items-center gap-3">
              <div
                className={`px-4 py-2 rounded-xl border text-center font-black ${
                  isCountBalanced
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                    : 'bg-amber-950/80 border-amber-500 text-amber-300'
                }`}
              >
                <div className="text-[10px] uppercase tracking-wider opacity-80">จัดบทบาทแล้ว</div>
                <div className="text-lg">
                  {currentTotalAssigned} / {totalPlayers} คน
                </div>
              </div>

              <button
                onClick={handleAutoBalance}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs rounded-xl border border-slate-700 transition cursor-pointer"
                title="ตั้งค่าชุดสมดุล 12 คนให้อัตโนมัติ"
              >
                ⚡ ชุดสมดุล
              </button>

              <button
                onClick={handleStartGame}
                disabled={!isCountBalanced}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>สุ่มแจกบทบาท & เริ่มเกม!</span>
              </button>
            </div>
          </div>

          {/* รายการการ์ดปรับจำนวนของทั้ง 9 บทบาท */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {ALL_ROLES.map((role) => {
              const Icon = role.icon
              const count = roleCounts[role.id] || 0

              return (
                <div
                  key={role.id}
                  className={`bg-slate-900/90 border ${role.borderColor} rounded-2xl p-3 flex flex-col justify-between hover:bg-slate-800/60 transition shadow-md`}
                >
                  {/* แถวบน: ไอคอน ชื่อ และ ป้ายฝ่าย */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl ${role.badgeColor} shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white">{role.name}</h3>
                        <p className="text-[10px] text-slate-400 font-medium">{role.enName}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${role.badgeColor}`}
                    >
                      {role.teamName}
                    </span>
                  </div>

                  {/* คำอธิบายความสามารถ */}
                  <p className="text-[11px] text-slate-300/90 leading-relaxed mb-3 line-clamp-2">
                    {role.desc}
                  </p>

                  {/* ตัวปรับจำนวน [+] และ [-] */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-xs text-slate-400 font-medium">จำนวนในเกม:</span>
                    <div className="flex items-center gap-2 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800">
                      <button
                        onClick={() => handleDecrease(role.id)}
                        disabled={count <= 0}
                        className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="w-6 text-center font-black text-sm text-amber-300">
                        {count}
                      </span>

                      <button
                        onClick={() => handleIncrease(role.id)}
                        disabled={currentTotalAssigned >= totalPlayers}
                        className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ================= 2. หน้าเล่นในห้อง (Playing Phase: 13 Players) ================= */}
      {phase === 'playing' && (
        <div className="flex-1 flex flex-col justify-between overflow-hidden min-h-0 space-y-2">
          {/* การ์ดบทบาทลับของผู้เล่น (Secret Role Card) */}
          {userPlayer && (
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/50 rounded-2xl p-3 flex items-center justify-between gap-4 shadow-xl shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-amber-300 shrink-0">
                  {isSecretRevealed ? (
                    <userPlayer.role.icon className="w-6 h-6" />
                  ) : (
                    <HelpCircle className="w-6 h-6 text-slate-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider">
                      บทบาทลับของคุณ:
                    </span>
                    {isSecretRevealed && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${userPlayer.role.badgeColor}`}
                      >
                        {userPlayer.role.teamName}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {isSecretRevealed
                      ? `${userPlayer.role.name} (${userPlayer.role.enName})`
                      : '•••••••••••••••• (คลิกเปิดดู)'}
                  </h3>
                  {isSecretRevealed && (
                    <p className="text-[11px] text-slate-300 line-clamp-1">
                      {userPlayer.role.desc}
                    </p>
                  )}
                </div>
              </div>

              {/* ปุ่มเปิด/ปิดตาดูการ์ดลับ */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsSecretRevealed(!isSecretRevealed)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  {isSecretRevealed ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>ซ่อนบทบาท</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>เปิดดูบทบาท</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleResetToSetup}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700 font-semibold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>จัดบทบาทใหม่</span>
                </button>
              </div>
            </div>
          )}

          {/* ตารางผู้เล่น 12 คนในห้อง (คุณ + 11 บอท) */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex-1 flex flex-col justify-between overflow-hidden shadow-inner">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <h4 className="font-bold text-xs sm:text-sm text-white">
                  รายชื่อผู้เล่นในหมู่บ้าน (12 คน)
                </h4>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="text-emerald-400">
                  • มีชีวิต: {roster.filter((p) => p.isAlive).length} คน
                </span>
                <span className="text-slate-500">
                  • เสียชีวิต: {roster.filter((p) => !p.isAlive).length} คน
                </span>
              </div>
            </div>

            {/* การ์ดผู้เล่น 12 คน (แถวละ 6 คน พอดี 2 แถว) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 overflow-y-auto max-h-[calc(100vh-320px)] p-1">
              {roster.map((player) => (
                <div
                  key={player.id}
                  className={`p-2.5 rounded-xl border flex flex-col justify-between text-center transition relative overflow-hidden ${
                    player.isUser
                      ? 'bg-indigo-950/80 border-indigo-400/60 ring-2 ring-indigo-500/50 shadow-md'
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  {/* แถบหัวบอกว่าเป็นผู้เล่นหรือบอท */}
                  <div className="flex items-center justify-between mb-1.5">
                    {player.isUser ? (
                      <span className="px-1.5 py-0.5 bg-indigo-500 text-[8px] font-black rounded text-white">
                        YOU
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 text-[8px] font-bold rounded flex items-center gap-0.5">
                        <Bot className="w-2.5 h-2.5" />
                        <span>BOT</span>
                      </span>
                    )}

                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-xs" title="มีชีวิต" />
                  </div>

                  {/* รูปและชื่อ */}
                  <div className="my-1 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 mb-1">
                      {player.isUser ? (
                        <UserRound className="w-4 h-4 text-indigo-300" />
                      ) : (
                        <Bot className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <p className="font-bold text-xs text-white truncate max-w-full">
                      {player.name}
                    </p>
                  </div>

                  {/* บทบาท (เปิดเผยเฉพาะของคุณ หรือเมื่อบอทตาย) */}
                  <div className="mt-1 pt-1 border-t border-slate-800/80 text-[10px]">
                    {player.isUser ? (
                      <span className="font-bold text-amber-300">
                        {isSecretRevealed ? player.role.name : '••••••'}
                      </span>
                    ) : (
                      <span className="text-slate-500 font-medium">ซ่อนบทบาท ❓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* กล่องควบคุมดำเนินเกมยามค่ำคืน */}
            <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>คืนที่ {roundNumber}: ชาวบ้านทุกคนกำลังหลับใหล... 🌙</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('ฟังก์ชันดำเนินคืนแรกและระบบโหวตกำลังได้รับการพัฒนาในขั้นตอนถัดไป 🐺')}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-md cursor-pointer"
                >
                  เริ่มเวลากลางคืน (Night Phase) →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WerewolfGame
