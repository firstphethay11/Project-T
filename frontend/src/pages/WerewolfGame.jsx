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
  Flame,
  Wand2,
  X,
  Target,
  HeartHandshake,
  Vote,
  Trophy,
  Gavel,
  MessageSquare,
  Send,
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
    glowColor: 'shadow-red-500/40 border-red-500/60',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
    borderColor: 'border-red-500/40',
    cardGradient: 'from-red-950 via-slate-950 to-black',
    desc: 'ตื่นขึ้นมาในตอนกลางคืนร่วมกับฝูงเพื่อเลือกสังหารเหยื่อ 1 คน',
    hasNightAction: true,
    actionPrompt: 'เลือกเหยื่อที่จะสังหารในคืนนี้ 🩸',
    defaultCount: 2,
  },
  {
    id: 'wolf_seer',
    name: 'หมาป่าหยั่งรู้',
    enName: 'Wolf Seer',
    team: 'werewolf',
    teamName: 'ฝ่ายหมาป่า',
    icon: Eye,
    glowColor: 'shadow-rose-500/40 border-rose-500/60',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    borderColor: 'border-rose-500/40',
    cardGradient: 'from-rose-950 via-slate-950 to-black',
    desc: 'หมาป่าพิเศษที่สามารถแอบส่องดูบทบาทของผู้เล่นอื่นได้ 1 คนในเวลากลางคืน',
    hasNightAction: true,
    actionPrompt: 'เลือกผู้เล่นที่ต้องการแอบส่องดูบทบาท 🔮',
    defaultCount: 1,
  },
  {
    id: 'wolf_pup',
    name: 'หมาป่าเด็ก',
    enName: 'Wolf Pup',
    team: 'werewolf',
    teamName: 'ฝ่ายหมาป่า',
    icon: PawPrint,
    glowColor: 'shadow-orange-500/40 border-orange-500/60',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    borderColor: 'border-orange-500/40',
    cardGradient: 'from-orange-950 via-slate-950 to-black',
    desc: 'หากหมาป่าเด็กถูกฆ่าตาย ในคืนถัดไปฝูงหมาป่าจะสามารถสังหารเหยื่อได้ 2 คน!',
    hasNightAction: true,
    actionPrompt: 'ร่วมมือกับฝูงหมาป่าเลือกเหยื่อที่จะสังหาร 🐾',
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
    glowColor: 'shadow-cyan-500/40 border-cyan-500/60',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    borderColor: 'border-cyan-500/40',
    cardGradient: 'from-cyan-950 via-slate-950 to-black',
    desc: 'สามารถเลือกส่องดูบทบาทที่แท้จริงของผู้เล่น 1 คนในแต่ละค่ำคืน',
    hasNightAction: true,
    actionPrompt: 'เลือกผู้เล่นที่ต้องการส่องดูบทบาทจริง 👁️',
    defaultCount: 1,
  },
  {
    id: 'bodyguard',
    name: 'ผู้พิทักษ์',
    enName: 'Bodyguard',
    team: 'villager',
    teamName: 'ฝ่ายชาวบ้าน',
    icon: Shield,
    glowColor: 'shadow-emerald-500/40 border-emerald-500/60',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    borderColor: 'border-emerald-500/40',
    cardGradient: 'from-emerald-950 via-slate-950 to-black',
    desc: 'เลือกปกป้องผู้เล่น 1 คนในแต่ละคืนให้รอดพ้นจากการโจมตีของหมาป่า',
    hasNightAction: true,
    actionPrompt: 'เลือกผู้เล่นที่ต้องการปกป้องในคืนนี้ 🛡️',
    defaultCount: 1,
  },
  {
    id: 'hunter',
    name: 'นายพราน',
    enName: 'Hunter',
    team: 'villager',
    teamName: 'ฝ่ายชาวบ้าน',
    icon: Crosshair,
    glowColor: 'shadow-lime-500/40 border-lime-500/60',
    badgeColor: 'bg-lime-500/20 text-lime-300 border-lime-500/30',
    borderColor: 'border-lime-500/40',
    cardGradient: 'from-lime-950 via-slate-950 to-black',
    desc: 'เมื่อตัวเองตายลง สามารถชักปืนยิงผู้เล่นคนอื่นตายตามไปด้วยได้ 1 คนทันที',
    hasNightAction: false,
    defaultCount: 1,
  },
  {
    id: 'witch',
    name: 'แม่มด',
    enName: 'Witch',
    team: 'villager',
    teamName: 'ฝ่ายชาวบ้าน',
    icon: FlaskConical,
    glowColor: 'shadow-purple-500/40 border-purple-500/60',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    borderColor: 'border-purple-500/40',
    cardGradient: 'from-purple-950 via-slate-950 to-black',
    desc: 'มียาวิเศษ 2 ขวด: ยาชุบชีวิต 1 ครั้ง (ช่วยคนที่โดนฆ่า) และยาพิษ 1 ครั้ง (สั่งตาย)',
    hasNightAction: true,
    actionPrompt: 'เลือกใช้ยาวิเศษชุบชีวิต หรือ ยาพิษสังหาร 🧪',
    defaultCount: 1,
  },
  {
    id: 'villager',
    name: 'ชาวบ้าน',
    enName: 'Villager',
    team: 'villager',
    teamName: 'ฝ่ายชาวบ้าน',
    icon: Users,
    glowColor: 'shadow-amber-500/40 border-amber-500/60',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    borderColor: 'border-amber-500/40',
    cardGradient: 'from-amber-950 via-slate-950 to-black',
    desc: 'ไม่มีพลังพิเศษ ต้องใช้ไหวพริบจับโกหกและโหวตประหารหมาป่าในตอนกลางวัน',
    hasNightAction: false,
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
    glowColor: 'shadow-fuchsia-500/40 border-fuchsia-500/60',
    badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
    borderColor: 'border-fuchsia-500/40',
    cardGradient: 'from-fuchsia-950 via-slate-950 to-black',
    desc: 'เป้าหมายคือทำอย่างไรก็ได้ให้ถูกโหวตประหารในตอนกลางวัน ถ้าถูกประหารจะชนะทันที!',
    hasNightAction: false,
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

  // ป๊อปอัปแจ้งเตือนบทบาทลับตอนเริ่มเกม
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)

  // ช่วงเวลากลางคืนหรือกลางวัน: 'night' (กลางคืนธีมมืด) | 'day' (กลางวัน)
  const [gameCycle, setGameCycle] = useState('night')
  const [roundNumber, setRoundNumber] = useState(1)

  // กำหนดขอบเขตจำนวนผู้เล่น (ผลรวมขั้นต่ำ 5 คน และสูงสุด 12 คน)
  const MIN_PLAYERS = 5
  const MAX_PLAYERS = 12

  // จำนวนของแต่ละบทบาทที่กำหนด
  const [roleCounts, setRoleCounts] = useState(() => {
    const initial = {}
    ALL_ROLES.forEach((r) => {
      initial[r.id] = r.defaultCount || 0
    })
    return initial
  })

  // ข้อมูลผู้เล่นและบอท
  const [roster, setRoster] = useState([])
  const [logs, setLogs] = useState([])

  // ================= สถานะแอ็กชันตอนกลางคืน =================
  const [selectedTargetId, setSelectedTargetId] = useState(null)
  const [seerInspectionResult, setSeerInspectionResult] = useState(null)
  const [hasActedTonight, setHasActedTonight] = useState(false)
  const [witchPotions, setWitchPotions] = useState({ healUsed: false, poisonUsed: false })
  const [witchActionType, setWitchActionType] = useState(null) // 'heal' | 'poison' | null

  // ================= สถานะการโหวตตอนกลางวัน =================
  const [hasVotedToday, setHasVotedToday] = useState(false)
  const [voteTally, setVoteTally] = useState({})
  const [executionResult, setExecutionResult] = useState(null)

  // ================= ระบบสนทนา & ถกเถียงยามเช้าของบอท =================
  const [dayTab, setDayTab] = useState('roster') // 'roster' | 'chat'
  const [morningMessages, setMorningMessages] = useState([])
  const [botThoughts, setBotThoughts] = useState({})
  const [userChatInput, setUserChatInput] = useState('')

  // สรุปเหตุการณ์ยามเช้า (Morning Report) และ จบเกม (Game Over)
  const [morningReport, setMorningReport] = useState(null)
  const [gameOverResult, setGameOverResult] = useState(null)

  const addLog = (msg) => {
    setLogs((prev) => [msg, ...prev.slice(0, 6)])
  }

  // คำนวณจำนวนบทบาทที่จัดไปแล้วทั้งหมด
  const currentTotalAssigned = Object.values(roleCounts).reduce((a, b) => a + b, 0)
  const hasWerewolf =
    (roleCounts.werewolf || 0) + (roleCounts.wolf_seer || 0) + (roleCounts.wolf_pup || 0) > 0
  const isCountBalanced =
    currentTotalAssigned >= MIN_PLAYERS && currentTotalAssigned <= MAX_PLAYERS && hasWerewolf

  // ปรับเพิ่มจำนวนบทบาท
  const handleIncrease = (roleId) => {
    if (currentTotalAssigned >= MAX_PLAYERS) return
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

  // ชุดสมดุลแนะนำตามจำนวนคน (5, 8, 12 คน)
  const handleApplyPreset = (targetCount) => {
    if (targetCount === 5) {
      setRoleCounts({
        werewolf: 1,
        wolf_seer: 0,
        wolf_pup: 0,
        seer: 1,
        bodyguard: 1,
        hunter: 0,
        witch: 0,
        villager: 2,
        madman: 0,
      })
    } else if (targetCount === 8) {
      setRoleCounts({
        werewolf: 2,
        wolf_seer: 0,
        wolf_pup: 0,
        seer: 1,
        bodyguard: 1,
        hunter: 1,
        witch: 0,
        villager: 3,
        madman: 0,
      })
    } else {
      // 12 คน (ชุดเต็ม)
      setRoleCounts({
        werewolf: 2,
        wolf_seer: 1,
        wolf_pup: 1,
        seer: 1,
        bodyguard: 1,
        hunter: 1,
        witch: 1,
        villager: 3,
        madman: 1,
      })
    }
  }

  // สุ่มแจกบทบาทและเริ่มเกม
  const handleStartGame = () => {
    if (!isCountBalanced) return

    const deck = []
    ALL_ROLES.forEach((role) => {
      const count = roleCounts[role.id] || 0
      for (let i = 0; i < count; i++) {
        deck.push(role)
      }
    })

    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[deck[i], deck[j]] = [deck[j], deck[i]]
    }

    const activeBotsCount = currentTotalAssigned - 1
    const activeBotNames = BOT_NAMES.slice(0, activeBotsCount)

    const playerList = [
      {
        id: 0,
        name: 'คุณ (ผู้เล่น)',
        isUser: true,
        role: deck[0],
        isAlive: true,
      },
      ...activeBotNames.map((name, index) => ({
        id: index + 1,
        name: name,
        isUser: false,
        role: deck[index + 1],
        isAlive: true,
      })),
    ]

    setRoster(playerList)
    setPhase('playing')
    setGameCycle('night')
    setRoundNumber(1)
    setSelectedTargetId(null)
    setSeerInspectionResult(null)
    setHasActedTonight(false)
    setMorningReport(null)
    setHasVotedToday(false)
    setVoteTally({})
    setExecutionResult(null)
    setGameOverResult(null)
    setWitchPotions({ healUsed: false, poisonUsed: false })

    setLogs([`🌙 คืนที่ 1: ค่ำคืนแรกมาถึงแล้ว ทุกคนหลับใหล... ผู้มีพลังพิเศษทำหน้าที่ในเงามืด`])
    setIsRoleModalOpen(true)
  }

  const userPlayer = roster.find((p) => p.isUser)
  const isUserNightActor = userPlayer?.role?.hasNightAction && userPlayer?.isAlive
  const isUserWerewolfTeam = userPlayer?.role?.team === 'werewolf'

  // ดำเนินการแอ็กชันกลางคืนของผู้เล่น
  const handlePerformUserAction = () => {
    if (!userPlayer || !userPlayer.isAlive) return
    const targetPlayer = roster.find((p) => p.id === selectedTargetId)

    if (userPlayer.role.id === 'seer' || userPlayer.role.id === 'wolf_seer') {
      if (!targetPlayer) {
        alert('กรุณาเลือกเป้าหมายที่ต้องการส่องดูบทบาทก่อนครับ!')
        return
      }
      setSeerInspectionResult(targetPlayer)
      setHasActedTonight(true)
      addLog(`👁️ คุณได้ส่องดู ${targetPlayer.name} พบว่าเป็น: "${targetPlayer.role.name}" (${targetPlayer.role.teamName})`)
      return
    }

    if (['werewolf', 'wolf_pup'].includes(userPlayer.role.id)) {
      if (!targetPlayer) {
        alert('กรุณาเลือกเหยื่อที่จะสังหารก่อนครับ!')
        return
      }
      setHasActedTonight(true)
      addLog(`🩸 ฝูงหมาป่าของคุณได้ล็อกเป้าหมายไปที่ ${targetPlayer.name}`)
      return
    }

    if (userPlayer.role.id === 'bodyguard') {
      if (!targetPlayer) {
        alert('กรุณาเลือกคนที่ต้องการปกป้องก่อนครับ!')
        return
      }
      setHasActedTonight(true)
      addLog(`🛡️ คุณได้วางกำลังปกป้อง ${targetPlayer.name} ในคืนนี้`)
      return
    }

    if (userPlayer.role.id === 'witch') {
      setHasActedTonight(true)
      addLog(`🧪 แม่มดดำเนินการปรุงยาเสร็จสิ้นในคืนนี้`)
      return
    }

    setHasActedTonight(true)
  }

  // ตรวจสอบเงื่อนไขชัยชนะ
  const checkWinCondition = (currentRoster) => {
    const aliveWolves = currentRoster.filter((p) => p.isAlive && p.role.team === 'werewolf').length
    const aliveVillagers = currentRoster.filter((p) => p.isAlive && p.role.team !== 'werewolf').length

    if (aliveWolves === 0) {
      setGameOverResult({
        winner: 'villager',
        title: '🎉 ฝ่ายชาวบ้านชนะศึก!',
        desc: 'เหล่าหมาป่าทั้งหมดถูกกำจัดสิ้นซากแล้ว ความสงบสุขกลับคืนสู่หมู่บ้านอีกครั้ง!',
      })
      return true
    }

    if (aliveWolves >= aliveVillagers) {
      setGameOverResult({
        winner: 'werewolf',
        title: '🐺 ฝ่ายหมาป่ายึดครองหมู่บ้าน!',
        desc: 'จำนวนหมาป่ามากกว่าหรือเท่ากับชาวบ้านแล้ว หมู่บ้านตกอยู่ใต้เงามืดตลอดกาล!',
      })
      return true
    }

    return false
  }

  // ฟังก์ชันสร้างความคิดและบทสนทนายามเช้าของบอทแบบมีกลยุทธ์ลึกซึ้ง (Challenging & Deceptive Dialogue)
  const generateMorningDiscussions = (currentRoster, deadList, round) => {
    const livingBots = currentRoster.filter((p) => !p.isUser && p.isAlive)
    const livingNonWolves = currentRoster.filter((p) => p.isAlive && p.role.team !== 'werewolf')
    const livingWolves = currentRoster.filter((p) => p.isAlive && p.role.team === 'werewolf')
    const deadName = deadList && deadList.length > 0 ? deadList.map((d) => d.name).join(', ') : null

    const newThoughts = {}
    const newMessages = []

    // ข้อความประกาศเปิดลานสนทนา
    newMessages.push({
      id: `sys-${round}`,
      senderId: -1,
      senderName: '📢 ศาลกลางเมือง',
      isSystem: true,
      text: deadName
        ? `รุ่งอรุณวันที่ ${round} มาถึงแล้ว... เมื่อคืนพบศพ: ${deadName} ขอให้ชาวบ้านทุกคนเปิดการอภิปราย วิเคราะห์เบาะแส และจับพิรุธคนร้ายให้ได้!`
        : `รุ่งอรุณวันที่ ${round} มาถึงแล้ว... เมื่อคืนไม่มีผู้เสียชีวิต ทุกคนปลอดภัยดี แต่สงครามจิตวิทยากำลังจะเริ่มขึ้นในลานประชุม!`,
      time: `เช้า วันที่ ${round}`,
    })

    // สุ่มเลือกหมาป่า 1 ตัวที่มีโอกาสแกล้งเคลมบทบาทเป็น Seer ปลอม (Fake Seer Counter-claim) เพื่อสร้างความสับสน
    const fakeSeerCandidate = livingWolves.find((w) => !w.isUser)
    const willFakeSeerClaim = fakeSeerCandidate && Math.random() > 0.45

    livingBots.forEach((bot) => {
      let speech = ''
      const otherLiving = currentRoster.filter((p) => p.id !== bot.id && p.isAlive)
      const randomOther = otherLiving[Math.floor(Math.random() * otherLiving.length)]

      switch (bot.role.id) {
        case 'seer': {
          // ผู้หยั่งรู้ตัวจริง
          if (livingWolves.length > 0 && Math.random() > 0.35) {
            const foundWolf = livingWolves[Math.floor(Math.random() * livingWolves.length)]
            const seerAccusations = [
              `ทุกคนฟังฉันให้ดี! ฉันคือผู้หยั่งรู้ตัวจริง เมื่อคืนฉันใช้ญาณส่องดู "${foundWolf.name}" พบออร่าหมาป่าชัดเจน! ใครที่พยายามช่วยแก้ต่างให้เขา น่าสงสัยเป็นพวกเดียวกัน! 👁️`,
              `ฉันขอเปิดเผยข้อมูลสำคัญ! เมื่อคืนฉันส่อง "${foundWolf.name}" แล้วพบว่าเป็นหมาป่าแน่นอน ถ้าวันนี้ไม่ประหารเขา คืนนี้หมู่บ้านเราจะสูญเสียหนักแน่!`,
              `ฉันแอบส่องดู "${foundWolf.name}" มา... อย่าปล่อยให้เขาหลอกพวกเราอีกต่อไป โหวตเขาเลย!`,
            ]
            speech = seerAccusations[Math.floor(Math.random() * seerAccusations.length)]
          } else if (livingNonWolves.length > 0) {
            const innocent = livingNonWolves[Math.floor(Math.random() * livingNonWolves.length)]
            const seerClears = [
              `เมื่อคืนฉันส่องดู "${innocent.name}" มาแล้ว ยืนยันว่าเขาเป็นคนดีบริสุทธิ์ 100%! อย่าไปหลงเชื่อคนที่พยายามป้ายสีเขาเด็ดขาด`,
              `ฉันใช้พลังตรวจสอบ "${innocent.name}" แล้ว ปลอดภัยแน่นอน ขอให้ทุกคนพุ่งเป้าไปที่คนที่ยังไม่เปิดเผยตัวตน!`,
            ]
            speech = seerClears[Math.floor(Math.random() * seerClears.length)]
          } else {
            speech = `ฉันกำลังเฝ้าสังเกตพฤติกรรมการชี้นำโหวตของแต่ละคนอย่างใกล้ชิด คืนนี้จะใช้พลังหาตัวหัวหน้าหมาป่าให้เจอ!`
          }
          break
        }

        case 'wolf_seer':
        case 'werewolf':
        case 'wolf_pup': {
          // ฝ่ายหมาป่า: ใช้กลยุทธ์ลึกซึ้ง (Bluff, Fake Claim, Deflection)
          const nonWolfTargets = livingNonWolves.filter((p) => p.id !== bot.id)
          const targetInnocent = nonWolfTargets.length > 0
            ? nonWolfTargets[Math.floor(Math.random() * nonWolfTargets.length)]?.name
            : 'ใครบางคน'

          // กลยุทธ์ 1: สวมรอยเป็น Seer ปลอม (ถ้าได้รับเลือก)
          if (willFakeSeerClaim && bot.id === fakeSeerCandidate?.id) {
            const fakeSeerLines = [
              `ทุกคนอย่าไปฟังคนอื่น! ฉันต่างหากคือผู้หยั่งรู้ตัวจริง! เมื่อคืนฉันส่องดู "${targetInnocent}" แล้วพบว่าเป็นหมาป่า! รีบช่วยกันโหวตประหารด่วน 🔮`,
              `ฉันขอเปิดเผยตัวตนก่อนที่จะสายเกินไป! ฉันคือ Seer และผลการส่องเมื่อคืนชี้ชัดว่า "${targetInnocent}" คือคนร้ายที่แฝงตัวอยู่!`,
            ]
            speech = fakeSeerLines[Math.floor(Math.random() * fakeSeerLines.length)]
          } else {
            // กลยุทธ์ 2: ปั่นกระแส เบี่ยงเบนความสนใจ หรืออ้างเป็นบทบาทป้องกัน
            const wolfDeceptions = [
              `สังเกตมั้ยว่าตอนมีคนเสนอชื่อโหวต "${targetInnocent}" ดูมีท่าทีกระวนกระวายผิดปกติ? ฉันว่าเขากำลังกลัวความจริงเปิดเผย!`,
              `ฉันเป็นแค่ชาวบ้านธรรมดาที่ไม่มีพลังอะไรเลย... ถ้าพวกคุณหลงกลรีบโหวตฉันไป ฝ่ายชาวบ้านจะยิ่งเสียเปรียบนะ! 🥺`,
              `คนที่คอยพูดชี้นำโหวตตั้งแต่เช้าเนี่ยแหละตัวดี! หมาป่ามักจะรีบหาแพะรับบาปเพื่อกลบเกลื่อนร่องรอยตัวเอง`,
              deadName
                ? `ดูจากการที่ "${deadName}" โดนเก็บเมื่อคืน หมาป่าต้องจงใจตัดกำลังคนที่จับพิรุธเก่งแน่ๆ... ฉันสงสัย "${targetInnocent}" มากที่สุด!`
                : `เมื่อคืนที่ไม่มีใครตาย อาจเป็นเพราะผู้พิทักษ์ทำงาน หรือไม่หมาป่าก็จงใจไม่ลงมือเพื่อปั่นหัวพวกเรา!`,
              `ฉันคิดว่ามีคนกำลังแอบอ้างบทบาทเพื่อเอาตัวรอด เราต้องตั้งสติแล้วดูว่าใครพูดจาขัดแย้งกับตัวเองมากที่สุด!`,
            ]
            speech = wolfDeceptions[Math.floor(Math.random() * wolfDeceptions.length)]
          }
          break
        }

        case 'madman': {
          // คนบ้า (Madman): ไม่พูดโต้งๆ ว่าฉันคือหมาป่า แต่แกล้งหลุดปากมีพิรุธอย่างแนบเนียน เพื่อล่อให้ชาวบ้านรุมโหวต!
          const madmindLines = [
            `เอ่อ... เมื่อคืนฉันไม่ได้ยินเสียงเห่าหอนเลยนะ! (เอ๊ะ ทำไมทุกคนมองฉันแบบนั้นล่ะ ฉันไม่ได้หลุดพูดอะไรแปลกๆ ออกไปใช่มั้ย? 😅)`,
            `ฉันว่าการที่ ${deadName || 'คนเมื่อคืน'} ถูกกำจัด มันเป็นการเดินหมากที่ฉลาดมาก... เอ่อ ฉันหมายถึงในมุมมองของคนร้ายน่ะนะ!`,
            `ทุกคนจะโหวตฉันก็ได้นะถ้าคิดว่าฉันคือหมาป่า... แต่ฉันเตือนไว้ก่อนเลยนะว่าถ้าฉันตาย หมู่บ้านจะต้องเสียใจแน่นอน! (แอบยิ้ม)`,
            `ทำไมทุกคนถึงต้องจ้องจับผิดกันขนาดนี้นะ? รีบๆ โหวตฉันไปให้จบๆ เรื่องเลยสิ จะได้รู้กันไปเลย! 🏆`,
            `ฉันมีเบาะแสสำคัญมาก แต่ฉันจะไม่บอกพวกแกหรอก เว้นแต่พวกแกจะกล้าโหวตประหารฉันในวันนี้! 🤪`,
          ]
          speech = madmindLines[Math.floor(Math.random() * madmindLines.length)]
          break
        }

        case 'hunter': {
          const hunterLines = [
            `ขอเตือนทุกคนไว้ตรงนี้เลยนะ! ใครที่คิดจะโหวตประหารฉัน ปืนในมือฉันพร้อมลั่นไกพาคนที่โหวตฉันลงหลุมไปด้วย 1 คนแน่นอน! 🏹`,
            `ฉันกำลังจับตาดูคนที่พยายามโหมกระแสโหวตอยู่ ถ้าฉันถูกประหาร คนที่ชี้นำจะเป็นเป้าหมายแรกที่โดนกระสุนฉัน!`,
          ]
          speech = hunterLines[Math.floor(Math.random() * hunterLines.length)]
          break
        }

        case 'bodyguard': {
          const guardLines = deadList && deadList.length === 0
            ? [
                `เมื่อคืนฉันวางกำลังคุ้มกันอย่างรัดกุม โชคดีจริงๆ ที่ไม่มีใครเสียชีวิตในคืนนี้ ทุกคนตั้งสติแล้วค่อยๆ คิดนะ 🛡️`,
                `โล่งอกที่เช้านี้ทุกคนยังอยู่ครบ ฉันยืนยันได้ว่าคนที่ฉันเฝ้าเมื่อคืนปลอดภัยแน่นอน!`,
              ]
            : [
                `ฉันเสียใจด้วยจริงๆ ที่คุ้มกันไม่ทัน... วันนี้พวกเราต้องสามัคคีกันหาตัวหมาป่าที่แอบซ่อนอยู่ให้เจอ!`,
                `การสูญเสียเมื่อคืนทำให้สถานการณ์บีบคั้นขึ้นมาก เราจะโหวตพลาดอีกไม่ได้แล้ว!`,
              ]
          speech = guardLines[Math.floor(Math.random() * guardLines.length)]
          break
        }

        case 'witch': {
          speech = `กลิ่นอายยาพิษและมนตร์ดำเมื่อคืนรุนแรงมาก... ขวดยาของฉันยังพร้อมทำงานเสมอ ใครที่คิดร้ายต่อหมู่บ้าน ระวังตัวไว้ให้ดี! 🧪`
          break
        }

        default: {
          // ชาวบ้านทั่วไป (Villagers): มีการวิเคราะห์เชิงตรรกะ ตั้งข้อสังเกต
          const suspect = randomOther?.name || 'ใครบางคน'
          const villagerLines = [
            `ตอนนี้เริ่มมีคนพูดจาขัดแย้งกันแล้วนะ... ถ้ามีคนอ้างบทบาทชนกัน เราต้องฟังเหตุผลของทั้งสองฝ่ายก่อนลงมือโหวต!`,
            `ฉันสังเกตดูท่าทีของ "${suspect}" แล้ว ดูเหมือนกำลังพยายามปกป้องใครบางคนอยู่ มีใครคิดเหมือนฉันบ้าง?`,
            deadName
              ? `เสียใจกับ "${deadName}" ด้วย... แต่เราต้องไม่ตื่นตระหนกจนโหวตชาวบ้านด้วยกันเองออกไปนะ!`
              : `โชคดีที่ไม่มีใครตาย แต่สังเกตมั้ยว่า "${suspect}" ดูเงียบผิดปกติจนน่าสงสัย?`,
            `คนที่พูดเยอะเกินไปกับคนที่เงียบผิดปกติ ทั้งสองกลุ่มนี้น่ากลัวพอกัน เราต้องช่วยกันตั้งคำถามไล่ต้อน!`,
            `อย่าเพิ่งรีบร้อนกดโหวตตามใครนะ ถ้าพวกเราชาวบ้านแตกคอกันเอง หมาป่าจะเข้าวินแน่นอน!`,
          ]
          speech = villagerLines[Math.floor(Math.random() * villagerLines.length)]
          break
        }
      }

      newThoughts[bot.id] = speech
      newMessages.push({
        id: `bot-${bot.id}-${round}`,
        senderId: bot.id,
        senderName: bot.name,
        isUser: false,
        role: bot.role,
        text: speech,
        time: `เช้า วันที่ ${round}`,
      })
    })

    setBotThoughts(newThoughts)
    setMorningMessages(newMessages)
  }

  // ส่งข้อความคุยในห้องสนทนาของหมู่บ้าน
  const handleSendChatMessage = (customText = null) => {
    const textToSend = (customText !== null ? customText : userChatInput).trim()
    if (!textToSend || !userPlayer || !userPlayer.isAlive) return

    const userMsg = {
      id: `user-${Date.now()}`,
      senderId: 0,
      senderName: 'คุณ (ผู้เล่น)',
      isUser: true,
      text: textToSend,
      time: `เช้า วันที่ ${roundNumber}`,
    }

    setMorningMessages((prev) => [...prev, userMsg])
    setUserChatInput('')

    // บอทตอบรับแบบสุ่มหรือตามข้อความ
    setTimeout(() => {
      const livingBots = roster.filter((p) => !p.isUser && p.isAlive)
      if (livingBots.length === 0) return

      const mentionedBot = livingBots.find((b) => textToSend.includes(b.name.replace('บอท', '')))
      const responder = mentionedBot || livingBots[Math.floor(Math.random() * livingBots.length)]

      let reply = ''
      if (mentionedBot) {
        if (mentionedBot.role.team === 'werewolf') {
          const wolfDefenses = [
            `คุณ ${userPlayer.name} พยายามป้ายสีฉันทำไม! หรือว่าคุณเองนั่นแหละที่เป็นหมาป่าแล้วกำลังหาแพะรับบาป! 🐺`,
            `ฉันมีเหตุผลของฉัน อย่ามากล่าวหากันลอยๆ ใครที่ร้อนตัวรีบชี้เป้าคนอื่นเนี่ยแหละน่าสงสัยที่สุด!`,
            `อย่าไปหลงเชื่อคุณ ${userPlayer.name} นะทุกคน เขาพยายามชี้นำโหวตเพื่อตัดกำลังชาวบ้าน!`,
          ]
          reply = wolfDefenses[Math.floor(Math.random() * wolfDefenses.length)]
        } else {
          const innocentDefenses = [
            `คุณกล่าวหาฉันแบบนี้มีหลักฐานชัดเจนมั้ย? ฉันเป็นผู้บริสุทธิ์ 100% ถ้าโหวตฉันไปหมู่บ้านจะเสียใจ! 😠`,
            `ฉันแค่กำลังฟังข้อมูลอย่างรอบคอบ ไม่ได้แปลว่าฉันมีพิรุธสักหน่อย อย่ามาใส่ร้ายกันนะ!`,
            `ฉันยินดีให้ตรวจสอบ แต่ขอเตือนว่าถ้ากำจัดฉันไป หมาป่าจะได้เปรียบทันที!`,
          ]
          reply = innocentDefenses[Math.floor(Math.random() * innocentDefenses.length)]
        }
      } else if (textToSend.includes('คนดี') || textToSend.includes('อย่าโหวต') || textToSend.includes('บริสุทธิ์')) {
        const doubtReplies = [
          `ในสถานการณ์ที่บีบคั้นแบบนี้ ใครๆ ก็อ้างว่าตัวเองเป็นคนดีทั้งนั้นแหละ... ต้องดูว่าตอนโหวตจริงคุณจะเลือกใคร!`,
          `คำพูดปากเปล่าเชื่อไม่ได้หรอก เราต้องดูการกระทำและผลการสืบสวน!`,
          `ถ้าคุณเป็นคนดีจริง ลองบอกหน่อยสิว่าในสายตาคุณ ใครน่าสงสัยที่สุดในตอนนี้?`,
        ]
        reply = doubtReplies[Math.floor(Math.random() * doubtReplies.length)]
      } else if (textToSend.includes('สงสัย') || textToSend.includes('โหวต') || textToSend.includes('หมาป่า')) {
        const agreeReplies = [
          `ถ้าคุณมั่นใจในข้อมูลนี้จริง ลองบอกเหตุผลเพิ่มหน่อยสิ ทำไมถึงเจาะจงคนนี้เป็นพิเศษ?`,
          `ข้อสังเกตของคุณน่าสนใจมาก... ฉันจะลองจับตาดูคนนี้ตามที่คุณบอกในรอบโหวตนี้`,
          `อย่าเพิ่งรีบร้อนกดดันให้คนอื่นคล้อยตาม มาฟังคำแก้ต่างของเขาก่อนเถอะ!`,
        ]
        reply = agreeReplies[Math.floor(Math.random() * agreeReplies.length)]
      } else {
        const generalReplies = [
          `อืม บรรยากาศในห้องประชุมเริ่มตึงเครียดขึ้นเรื่อยๆ แล้ว ทุกคนอย่าใช้อารมณ์ตัดสินนะ`,
          `เวลาอภิปรายกำลังจะหมดลงแล้ว ใครมีข้อมูลสุดท้ายรีบพูดออกมาก่อนลงคะแนนประหาร! 🗳️`,
          `สงครามจิตวิทยาในเช้านี้เข้มข้นมาก... เดี๋ยวผลการนับคะแนนจะบอกเองว่าใครโกหก!`,
        ]
        reply = generalReplies[Math.floor(Math.random() * generalReplies.length)]
      }

      setMorningMessages((prev) => [
        ...prev,
        {
          id: `bot-reply-${Date.now()}`,
          senderId: responder.id,
          senderName: responder.name,
          isUser: false,
          role: responder.role,
          text: reply,
          time: `เช้า วันที่ ${roundNumber}`,
        },
      ])
    }, 500)
  }

  // ตัดสินผลค่ำคืนและเข้าสู่เวลากลางวัน (พ้นคืนแรก $\rightarrow$ เช้าเปิดโหวตได้)
  const handleResolveNightToDay = () => {
    // 1. หาว่าหมาป่าฆ่าใคร
    let attackedId = null
    const livingNonWolves = roster.filter((p) => p.isAlive && p.role.team !== 'werewolf')
    const userIsWolf = ['werewolf', 'wolf_seer', 'wolf_pup'].includes(userPlayer?.role?.id)

    if (userIsWolf && userPlayer?.isAlive && selectedTargetId !== null) {
      attackedId = selectedTargetId
    } else {
      if (livingNonWolves.length > 0) {
        const randomVictim = livingNonWolves[Math.floor(Math.random() * livingNonWolves.length)]
        attackedId = randomVictim.id
      }
    }

    // 2. หาว่าผู้พิทักษ์ป้องกันใคร
    let protectedId = null
    const userIsGuard = userPlayer?.role?.id === 'bodyguard'
    if (userIsGuard && userPlayer?.isAlive && selectedTargetId !== null) {
      protectedId = selectedTargetId
    } else {
      const guardBot = roster.find((p) => p.isAlive && !p.isUser && p.role.id === 'bodyguard')
      if (guardBot) {
        const alivePlayers = roster.filter((p) => p.isAlive)
        protectedId = alivePlayers[Math.floor(Math.random() * alivePlayers.length)]?.id
      }
    }

    // 3. แม่มดชุบชีวิต หรือ ใช้ยาพิษ
    let isHealed = false
    let poisonedId = null
    const userIsWitch = userPlayer?.role?.id === 'witch'

    if (userIsWitch && userPlayer?.isAlive) {
      if (witchActionType === 'heal' && !witchPotions.healUsed) {
        isHealed = true
        setWitchPotions((prev) => ({ ...prev, healUsed: true }))
      } else if (witchActionType === 'poison' && selectedTargetId !== null && !witchPotions.poisonUsed) {
        poisonedId = selectedTargetId
        setWitchPotions((prev) => ({ ...prev, poisonUsed: true }))
      }
    } else {
      const witchBot = roster.find((p) => p.isAlive && !p.isUser && p.role.id === 'witch')
      if (witchBot && attackedId !== null && Math.random() > 0.5) {
        isHealed = true
      }
    }

    // รวมรายชื่อผู้เสียชีวิตในคืนนี้
    const deadIds = []
    if (attackedId !== null && attackedId !== protectedId && !isHealed) {
      deadIds.push(attackedId)
    }
    if (poisonedId !== null && !deadIds.includes(poisonedId)) {
      deadIds.push(poisonedId)
    }

    // อัปเดตสถานะใน Roster
    const updatedRoster = roster.map((p) => (deadIds.includes(p.id) ? { ...p, isAlive: false } : p))
    setRoster(updatedRoster)

    // สลับเป็นกลางวัน และรีเซ็ตการโหวตประจำวัน
    setGameCycle('day')
    setSelectedTargetId(null)
    setSeerInspectionResult(null)
    setHasActedTonight(false)
    setWitchActionType(null)
    setHasVotedToday(false)
    setVoteTally({})

    // ข้อมูลสรุปยามเช้า (Morning Report)
    const deadPlayers = roster.filter((p) => deadIds.includes(p.id))
    const reportData = {
      round: roundNumber,
      deadPlayers,
      isPeaceful: deadIds.length === 0,
    }
    setMorningReport(reportData)

    if (deadIds.length === 0) {
      addLog(`☀️ รุ่งอรุณวันที่ ${roundNumber}: พ้นคืนแรกแล้ว! เมื่อคืนไม่มีใครเสียชีวิต ทุกคนปลอดภัย`)
    } else {
      const deadNames = deadPlayers.map((d) => d.name).join(', ')
      addLog(`☀️ รุ่งอรุณวันที่ ${roundNumber}: พ้นคืนแรกแล้ว! พบศพผู้เสียชีวิต: ${deadNames}`)
    }

    // สร้างบทสนทนาและความคิดของบอทยามเช้า (Bot Morning Discussions)
    generateMorningDiscussions(updatedRoster, deadPlayers, roundNumber)
    setDayTab('roster')

    // ตรวจสอบว่ามีฝ่ายใดชนะหรือไม่
    checkWinCondition(updatedRoster)
  }

  // ================= 3. ระบบโหวตประหารในตอนกลางวัน =================
  const handleCastVoteAndExecute = () => {
    if (hasVotedToday) return

    const livingPlayers = roster.filter((p) => p.isAlive)
    if (livingPlayers.length <= 1) return

    // โครงสร้างเก็บคะแนนโหวต { [playerId]: count }
    const tally = {}
    livingPlayers.forEach((p) => {
      tally[p.id] = 0
    })

    // 1. คะแนนของผู้เล่น (ถ้าผู้เล่นยังมีชีวิตอยู่และเลือกเป้าหมาย)
    if (userPlayer?.isAlive && selectedTargetId !== null) {
      tally[selectedTargetId] = (tally[selectedTargetId] || 0) + 1
    }

    // 2. บอททุกคนที่ยังมีชีวิตอยู่สุ่มโหวตผู้ต้องสงสัย
    livingPlayers.forEach((botPlayer) => {
      if (botPlayer.isUser) return

      // บอทจะเลือกโหวตคนอื่นที่ยังมีชีวิตอยู่ (ไม่โหวตตัวเอง)
      let possibleTargets = livingPlayers.filter((p) => p.id !== botPlayer.id)

      // ฝ่ายหมาป่ารู้บทบาทกันและกัน จะร่วมมือกันไม่โหวตเพื่อนร่วมฝูง
      if (botPlayer.role.team === 'werewolf') {
        const nonWolfTargets = possibleTargets.filter((p) => p.role.team !== 'werewolf')
        if (nonWolfTargets.length > 0) {
          possibleTargets = nonWolfTargets
        }
      }

      if (possibleTargets.length > 0) {
        const botVote = possibleTargets[Math.floor(Math.random() * possibleTargets.length)]
        tally[botVote.id] = (tally[botVote.id] || 0) + 1
      }
    })

    setVoteTally(tally)
    setHasVotedToday(true)

    // หาผู้ที่ได้คะแนนโหวตสูงสุด
    let maxVotes = -1
    let executedId = null
    let isTie = false

    Object.entries(tally).forEach(([pid, votes]) => {
      if (votes > maxVotes) {
        maxVotes = votes
        executedId = Number(pid)
        isTie = false
      } else if (votes === maxVotes) {
        isTie = true
      }
    })

    // ถ้าคะแนนเท่ากัน = ไม่มีใครถูกประหาร
    if (isTie || executedId === null) {
      setExecutionResult({
        isTie: true,
        executedPlayer: null,
        votes: tally,
      })
      addLog(`⚖️ ผลโหวตของศาลหมู่บ้าน: คะแนนเสียงเสมอกัน! ไม่มีการประหารชีวิตในวันนี้`)
      return
    }

    const executedPlayer = roster.find((p) => p.id === executedId)

    // กรณีพิเศษ: คนบ้า (Madman) ถูกโหวตประหาร -> คนบ้าชนะเกมเดี่ยวทันที!
    if (executedPlayer.role.id === 'madman') {
      const updatedRoster = roster.map((p) => (p.id === executedId ? { ...p, isAlive: false } : p))
      setRoster(updatedRoster)
      setExecutionResult({
        isTie: false,
        executedPlayer,
        votes: tally,
        isMadmanWin: true,
      })
      setGameOverResult({
        winner: 'madman',
        title: '🤪 คนบ้าชนะเกมเดี่ยว (Solo Win)!',
        desc: `คุณทำตามแผนสำเร็จ! ${executedPlayer.name} หลอกลวงให้หมู่บ้านโหวตประหารตนเอง และคว้าชัยชนะไปเพียงผู้เดียว!`,
      })
      addLog(`🤪 ช็อกทั้งหมู่บ้าน! ${executedPlayer.name} คือ "คนบ้า" และชนะเกมทันที!`)
      return
    }

    // กรณีพิเศษ: นายพราน (Hunter) ถูกประหาร -> ชักปืนยิงคนอื่นตายตามไปด้วย 1 คน
    let hunterShotPlayer = null
    if (executedPlayer.role.id === 'hunter') {
      const remainingLiving = livingPlayers.filter((p) => p.id !== executedId)
      if (remainingLiving.length > 0) {
        hunterShotPlayer = remainingLiving[Math.floor(Math.random() * remainingLiving.length)]
      }
    }

    // ประหารชีวิต
    const deadIds = [executedId]
    if (hunterShotPlayer) deadIds.push(hunterShotPlayer.id)

    const updatedRoster = roster.map((p) => (deadIds.includes(p.id) ? { ...p, isAlive: false } : p))
    setRoster(updatedRoster)

    setExecutionResult({
      isTie: false,
      executedPlayer,
      hunterShotPlayer,
      votes: tally,
    })

    addLog(`⚖️ ผลโหวต: ${executedPlayer.name} ได้รับคะแนนสูงสุด (${maxVotes} เสียง) ถูกประหารชีวิต! (บทบาท: ${executedPlayer.role.name})`)
    if (hunterShotPlayer) {
      addLog(`🏹 นายพรานลั่นไกก่อนสิ้นใจ! ยิง ${hunterShotPlayer.name} ตายตามไปด้วย!`)
    }

    // เช็คเงื่อนไขจบเกม
    checkWinCondition(updatedRoster)
  }

  // ข้ามการโหวตวันนี้
  const handleSkipVote = () => {
    setHasVotedToday(true)
    addLog(`🕊️ หมู่บ้านตัดสินใจยกเว้นการโหวตประหารในวันนี้`)
  }

  // เริ่มต้นค่ำคืนถัดไป
  const handleStartNextNight = () => {
    setMorningReport(null)
    setExecutionResult(null)
    setGameCycle('night')
    setDayTab('roster')
    setRoundNumber((r) => r + 1)
    setSelectedTargetId(null)
    setSeerInspectionResult(null)
    setHasActedTonight(false)
    setWitchActionType(null)
    setHasVotedToday(false)
    setVoteTally({})
    addLog(`🌙 คืนที่ ${roundNumber + 1}: ราตรีมืดมิดกลับมาอีกครั้ง ทุกคนในหมู่บ้านหลับตาลง...`)
  }

  // รีเซ็ตกลับไปหน้าตั้งค่า
  const handleResetToSetup = () => {
    setPhase('setup')
    setIsRoleModalOpen(false)
    setMorningReport(null)
    setExecutionResult(null)
    setGameOverResult(null)
    setMorningMessages([])
    setBotThoughts({})
    setUserChatInput('')
    setDayTab('roster')
  }

  return (
    <div
      className={`flex flex-col h-full max-h-[calc(100vh-85px)] justify-between select-none transition-colors duration-700 ${
        phase === 'playing' && gameCycle === 'night'
          ? 'bg-black text-slate-100'
          : 'bg-transparent text-slate-800'
      }`}
    >
      {/* ================= 0. ป๊อปอัปเด้งแจ้งบทบาทลับตอนเริ่มเกม ================= */}
      {isRoleModalOpen && userPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div
            className={`bg-gradient-to-b ${userPlayer.role.cardGradient} border-2 ${userPlayer.role.glowColor} rounded-3xl max-w-sm w-full p-6 sm:p-7 text-center shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200`}
          >
            <div className="w-20 h-20 mx-auto rounded-3xl ${userPlayer.role.badgeColor} border-2 flex items-center justify-center shadow-xl mb-4 group">
              <userPlayer.role.icon className="w-11 h-11 animate-pulse" />
            </div>

            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">
              บทบาทลับของคุณในเกมนี้
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
              {userPlayer.role.name}
            </h2>
            <p className="text-xs text-indigo-300 font-semibold mb-3">
              {userPlayer.role.enName}
            </p>

            <div className="inline-block mb-4">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${userPlayer.role.badgeColor}`}
              >
                {userPlayer.role.teamName}
              </span>
            </div>

            <div className="bg-black/50 border border-white/10 rounded-2xl p-3.5 text-xs text-slate-300 leading-relaxed text-left mb-4">
              <p className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>หน้าที่ในเกม:</span>
              </p>
              <p>
                {userPlayer.role.hasNightAction
                  ? userPlayer.role.actionPrompt
                  : 'คืนนี้หลับตาลงอย่างสงบ พ้นคืนแรกไปแล้วในตอนเช้าคุณจะได้ร่วมโหวตประหารหมาป่า 🗳️'}
              </p>
            </div>

            {/* ถ้าเป็นฝ่ายเดียวกับหมาป่า จะมองเห็นสมาชิกในฝูงและบทบาทของกันและกันได้ */}
            {userPlayer.role.team === 'werewolf' && (
              <div className="bg-red-950/70 border border-red-500/50 rounded-2xl p-3 text-xs text-left mb-5 shadow-inner">
                <p className="font-bold text-red-300 mb-1.5 flex items-center gap-1.5">
                  <Skull className="w-3.5 h-3.5 text-red-400" />
                  <span>เพื่อนร่วมฝูงหมาป่าของคุณ (มองเห็นกันและกัน):</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {roster
                    .filter((p) => p.role.team === 'werewolf')
                    .map((wolf) => (
                      <span
                        key={wolf.id}
                        className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold flex items-center gap-1 ${
                          wolf.isUser
                            ? 'bg-indigo-950/80 border-indigo-500/50 text-indigo-300'
                            : 'bg-red-900/60 border-red-500/40 text-red-200'
                        }`}
                      >
                        <span>{wolf.isUser ? 'คุณ' : wolf.name}:</span>
                        <span className="text-amber-300 font-extrabold">{wolf.role.name}</span>
                      </span>
                    ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setIsRoleModalOpen(false)}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-black text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition transform hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>รับทราบบทบาท (เข้าสู่เกม)</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= ป๊อปอัปแจ้งผลการตายยามเช้า (Morning Report Modal) ================= */}
      {morningReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-b from-slate-900 to-amber-950/80 border-2 border-amber-500/50 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 mx-auto mb-3 shadow-lg">
              {morningReport.isPeaceful ? (
                <Shield className="w-8 h-8 text-emerald-400" />
              ) : (
                <Skull className="w-8 h-8 text-rose-500" />
              )}
            </div>

            <h3 className="text-2xl font-black text-white mb-1">
              ☀️ รุ่งอรุณวันที่ {morningReport.round} (พ้นคืนแรกแล้ว!)
            </h3>
            <p className="text-xs text-amber-200/80 mb-3">
              ทุกคนตื่นขึ้นมารวมตัวกันที่ลานกลางเมืองเพื่อเริ่มการโหวตประหาร
            </p>

            {morningReport.isPeaceful ? (
              <div className="my-4 p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-emerald-300 text-sm font-semibold">
                🎉 เมื่อคืนนี้ไม่มีใครเสียชีวิต ทุกคนในหมู่บ้านปลอดภัยดี!
              </div>
            ) : (
              <div className="my-4 p-4 bg-rose-950/60 border border-rose-500/40 rounded-2xl text-rose-200 text-xs sm:text-sm text-left space-y-2">
                <p className="font-bold text-rose-300">⚰️ พบศพผู้เสียชีวิตในค่ำคืนนี้:</p>
                {morningReport.deadPlayers.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2 bg-black/40 rounded-xl border border-rose-800/40"
                  >
                    <span className="font-bold text-white">{p.name}</span>
                    <span className="text-xs text-rose-400 font-semibold">
                      (บทบาท: {p.role.name})
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setMorningReport(null)}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-black text-sm rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Gavel className="w-4 h-4" />
              <span>เข้าสู่ลานประชุม & เริ่มโหวตประหารผู้ต้องสงสัย →</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= ป๊อปอัปแจ้งผลการโหวตประหาร (Execution Result Modal) ================= */}
      {executionResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-b from-slate-900 to-indigo-950 border-2 border-amber-500/60 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 mx-auto mb-3">
              <Gavel className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-white mb-2">
              ⚖️ คำตัดสินของศาลหมู่บ้าน
            </h3>

            {executionResult.isTie ? (
              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-slate-300 text-sm mb-4">
                คะแนนเสียงโหวตเสมอกัน! ศาลหมู่บ้านตัดสินยกฟ้อง จึงไม่มีผู้ใดถูกประหารชีวิตในวันนี้
              </div>
            ) : (
              <div className="space-y-3 my-4">
                <div className="p-4 bg-rose-950/70 border border-rose-500/50 rounded-2xl text-left">
                  <p className="text-xs text-rose-300 font-bold uppercase tracking-wider mb-1">
                    ผู้ถูกโหวตประหารชีวิต:
                  </p>
                  <p className="text-lg font-black text-white">
                    {executionResult.executedPlayer.name}
                  </p>
                  <p className="text-xs text-rose-400 font-bold mt-1">
                    บทบาทจริงคือ: "{executionResult.executedPlayer.role.name}" ({executionResult.executedPlayer.role.teamName})
                  </p>
                </div>

                {executionResult.hunterShotPlayer && (
                  <div className="p-3 bg-lime-950/70 border border-lime-500/50 rounded-2xl text-left text-xs text-lime-200">
                    🏹 นายพรานลั่นไกก่อนสิ้นใจ! ยิง <strong>{executionResult.hunterShotPlayer.name}</strong> ({executionResult.hunterShotPlayer.role.name}) เสียชีวิตตามไปด้วย!
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setExecutionResult(null)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-xl shadow-md transition cursor-pointer"
            >
              รับทราบคำตัดสิน (ดำเนินการต่อ)
            </button>
          </div>
        </div>
      )}

      {/* ================= ป๊อปอัปแจ้งผลจบเกม (Game Over Modal) ================= */}
      {gameOverResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 animate-in fade-in duration-300">
          <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border-4 border-amber-400 rounded-3xl max-w-md w-full p-8 text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 mx-auto mb-4 animate-bounce">
              <Trophy className="w-10 h-10" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
              {gameOverResult.title}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {gameOverResult.desc}
            </p>

            <button
              onClick={handleResetToSetup}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-sm rounded-xl shadow-lg transition transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>เล่นใหม่อีกครั้ง</span>
            </button>
          </div>
        </div>
      )}

      {/* แถบหัวด้านบน */}
      <div
        className={`flex flex-wrap items-center justify-between gap-2 px-4 py-2 rounded-xl border shadow-md shrink-0 mb-2 transition-colors duration-500 ${
          phase === 'playing' && gameCycle === 'night'
            ? 'bg-slate-950 border-indigo-950 text-white'
            : 'bg-slate-900 border-slate-800 text-white'
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg text-white transition-colors duration-500 ${
              phase === 'playing' && gameCycle === 'night'
                ? 'bg-indigo-900/90 text-indigo-300 ring-2 ring-indigo-500/40'
                : 'bg-indigo-600'
            }`}
          >
            {phase === 'playing' && gameCycle === 'day' ? (
              <Sun className="w-4 h-4 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-300" />
            )}
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-indigo-300">
              🐺 เกมแวร์วูล์ฟ ({roster.length > 0 ? `${roster.length} คน: บอท ${roster.length - 1} + คุณ` : '5 - 12 คน'})
            </span>
            <span
              className={`ml-2 px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                phase === 'playing' && gameCycle === 'night'
                  ? 'bg-purple-950/80 text-purple-300 border-purple-700'
                  : 'bg-indigo-950 text-indigo-300 border-indigo-700/60'
              }`}
            >
              {phase === 'playing'
                ? gameCycle === 'night'
                  ? `🌙 ค่ำคืนที่ ${roundNumber} (ราตรีมืดมิด)`
                  : `☀️ กลางวันวันที่ ${roundNumber} (เปิดโหวตประหาร)`
                : `ห้อง ${currentTotalAssigned} คน`}
            </span>
          </div>
        </div>

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
          <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">ตั้งค่าจำนวนคนในแต่ละบทบาท</h2>
                <span className="text-xs text-indigo-400 font-semibold">
                  (ขั้นต่ำ 5 คน - สูงสุด 12 คน)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                กดปุ่ม <span className="text-indigo-300 font-bold">[+]</span> หรือ{' '}
                <span className="text-indigo-300 font-bold">[-]</span> เพื่อจัดบทบาทอิสระ (รวมคุณ 1 คน + บอท{' '}
                <span className="text-amber-300 font-bold">{Math.max(0, currentTotalAssigned - 1)}</span> ตัว)
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap justify-end">
              <div
                className={`px-3.5 py-1.5 rounded-xl border text-center font-black ${
                  isCountBalanced
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                    : 'bg-amber-950/80 border-amber-500 text-amber-300'
                }`}
              >
                <div className="text-[9px] uppercase tracking-wider opacity-80">
                  {currentTotalAssigned < MIN_PLAYERS
                    ? `ขาดอีก ${MIN_PLAYERS - currentTotalAssigned} คน`
                    : !hasWerewolf
                    ? 'ต้องมีหมาป่า!'
                    : currentTotalAssigned > MAX_PLAYERS
                    ? 'เกิน 12 คน'
                    : 'ผลรวมผู้เล่น'}
                </div>
                <div className="text-base">
                  {currentTotalAssigned} / 5-12 คน
                </div>
              </div>

              {/* ปุ่มชุดสมดุลแบบด่วน 5, 8, 12 คน */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => handleApplyPreset(5)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-[11px] rounded-lg transition cursor-pointer"
                  title="ชุดแนะนำสำหรับ 5 คน (หมาป่า 1, ตรวจ 1, การ์ด 1, ชาวบ้าน 2)"
                >
                  ⚡ 5 คน
                </button>
                <button
                  onClick={() => handleApplyPreset(8)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-[11px] rounded-lg transition cursor-pointer"
                  title="ชุดแนะนำสำหรับ 8 คน"
                >
                  ⚡ 8 คน
                </button>
                <button
                  onClick={() => handleApplyPreset(12)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-[11px] rounded-lg transition cursor-pointer"
                  title="ชุดแนะนำสำหรับ 12 คน (ชุดเต็มครบทุกบทบาท)"
                >
                  ⚡ 12 คน
                </button>
              </div>

              <button
                onClick={handleStartGame}
                disabled={!isCountBalanced}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>เริ่มเกม ({currentTotalAssigned} คน)!</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {ALL_ROLES.map((role) => {
              const Icon = role.icon
              const count = roleCounts[role.id] || 0

              return (
                <div
                  key={role.id}
                  className={`bg-slate-900/90 border ${role.borderColor} rounded-2xl p-3 flex flex-col justify-between hover:bg-slate-800/60 transition shadow-md`}
                >
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

                  <p className="text-[11px] text-slate-300/90 leading-relaxed mb-3 line-clamp-2">
                    {role.desc}
                  </p>

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
                        disabled={currentTotalAssigned >= MAX_PLAYERS}
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

      {/* ================= 2. หน้าเล่นในห้อง (Playing Phase) ================= */}
      {phase === 'playing' && (
        <div className="flex-1 flex flex-col justify-between overflow-hidden min-h-0 space-y-2">
          {/* แผงควบคุมแอ็กชันยามค่ำคืน (Night Action Panel) */}
          {gameCycle === 'night' && (
            <div className="bg-gradient-to-r from-purple-950 via-slate-950 to-indigo-950 border-2 border-purple-600/50 rounded-2xl p-3 shadow-2xl shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0 animate-pulse">
                  {userPlayer?.role?.icon ? (
                    <userPlayer.role.icon className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-900/80 text-purple-200 border border-purple-500/40">
                      {isUserNightActor ? 'ภารกิจยามค่ำคืนของคุณ' : 'หลับใหลยามค่ำคืน'}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      (บทบาท: {userPlayer?.role?.name})
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-white mt-0.5">
                    {isUserNightActor
                      ? userPlayer.role.actionPrompt
                      : 'คุณไม่มีพลังพิเศษยามค่ำคืน กำลังหลับใหลอย่างสงบ... 💤'}
                  </p>

                  {/* แสดงรายชื่อสมาชิกในฝูงหมาป่า (มองเห็นบทบาทของกันและกัน) */}
                  {isUserWerewolfTeam && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="text-red-400 font-bold flex items-center gap-1">
                        <Skull className="w-3.5 h-3.5 text-red-400" />
                        <span>ฝูงหมาป่าของคุณ:</span>
                      </span>
                      {roster
                        .filter((p) => p.role.team === 'werewolf')
                        .map((wolf) => (
                          <span
                            key={wolf.id}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${
                              wolf.isAlive
                                ? 'bg-red-950/90 text-red-300 border-red-500/50 shadow-xs'
                                : 'bg-slate-900 text-slate-500 border-slate-800 line-through opacity-60'
                            }`}
                          >
                            <span>{wolf.isUser ? 'คุณ' : wolf.name}</span>
                            <span className="text-[9px] text-amber-300">({wolf.role.name})</span>
                            {!wolf.isAlive && <span>💀</span>}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ส่วนเลือกแอ็กชันของผู้เล่น */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {isUserNightActor && !hasActedTonight && (
                  <>
                    {userPlayer.role.id === 'witch' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setWitchActionType('heal')
                            handlePerformUserAction()
                          }}
                          disabled={witchPotions.healUsed}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1 cursor-pointer"
                        >
                          <HeartHandshake className="w-3.5 h-3.5" />
                          <span>ใช้ยาชุบชีวิต {witchPotions.healUsed && '(ใช้แล้ว)'}</span>
                        </button>

                        <button
                          onClick={() => setWitchActionType('poison')}
                          disabled={witchPotions.poisonUsed}
                          className={`px-3 py-1.5 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1 cursor-pointer ${
                            witchActionType === 'poison'
                              ? 'bg-rose-600 text-white ring-2 ring-rose-400'
                              : 'bg-slate-800 text-rose-300 hover:bg-slate-700'
                          }`}
                        >
                          <Skull className="w-3.5 h-3.5" />
                          <span>เลือกใช้ยาพิษ {witchPotions.poisonUsed && '(ใช้แล้ว)'}</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handlePerformUserAction}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer transform active:scale-95"
                      >
                        <Target className="w-4 h-4" />
                        <span>ยืนยันเป้าหมายที่เลือก</span>
                      </button>
                    )}
                  </>
                )}

                {/* สรุปค่ำคืน เข้าสู่เช้าวันถัดไป */}
                <button
                  onClick={handleResolveNightToDay}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Sun className="w-4 h-4" />
                  <span>พ้นคืนแรก & เข้าสู่รุ่งเช้า (เปิดโหวต) ☀️</span>
                </button>
              </div>
            </div>
          )}

          {/* แผงควบคุมการโหวตตอนกลางวัน (Daytime Voting Center) */}
          {gameCycle === 'day' && (
            <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/70 border-2 border-amber-600/50 rounded-2xl p-3 shadow-xl shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-yellow-400 border border-amber-500/40">
                  <Vote className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      พ้นคืนแรกแล้ว! ลานประหารหมู่บ้าน
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      (วันที่ {roundNumber})
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-white mt-0.5">
                    {!hasVotedToday
                      ? 'คลิกเลือกการ์ดผู้เล่นที่ต้องสงสัยเพื่อลงคะแนนโหวตประหาร 🗳️'
                      : 'การโหวตประจำวันเสร็จสิ้นแล้ว สามารถเข้าสู่ค่ำคืนถัดไปได้'}
                  </p>
                </div>
              </div>

              {/* ปุ่มลงคะแนนโหวต & ข้าม */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {!hasVotedToday ? (
                  <>
                    <button
                      onClick={handleCastVoteAndExecute}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer transform active:scale-95"
                    >
                      <Gavel className="w-4 h-4" />
                      <span>
                        {selectedTargetId !== null
                          ? `โหวตประหาร "${roster.find((p) => p.id === selectedTargetId)?.name}"`
                          : 'ยืนยันการโหวตของหมู่บ้าน 🗳️'}
                      </span>
                    </button>

                    <button
                      onClick={handleSkipVote}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition cursor-pointer"
                    >
                      🕊️ ข้ามการโหวตวันนี้
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleStartNextNight}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Moon className="w-4 h-4" />
                    <span>จบการประชุม เข้าสู่คืนถัดไป 🌙</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* แสดงผลการส่องดูของผู้หยั่งรู้ (ถ้ามี) */}
          {seerInspectionResult && (
            <div className="bg-cyan-950/90 border-2 border-cyan-400 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xl animate-in fade-in shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-cyan-900 rounded-xl text-cyan-300">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-cyan-200">
                    ผลการส่องดูบทบาท: <span className="text-white font-black text-sm">{seerInspectionResult.name}</span>
                  </p>
                  <p className="text-sm font-black text-cyan-300">
                    บทบาทจริงคือ: "{seerInspectionResult.role.name}" ({seerInspectionResult.role.teamName})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSeerInspectionResult(null)}
                className="text-cyan-400 hover:text-white text-xs font-bold px-3 py-1 bg-cyan-900/60 rounded-lg cursor-pointer"
              >
                ปิดผลลัพธ์
              </button>
            </div>
          )}

          {/* ผังการ์ดผู้เล่น 12 คนในหมู่บ้าน */}
          <div
            className={`border rounded-2xl p-3 flex-1 flex flex-col justify-between overflow-hidden shadow-inner transition-colors duration-700 ${
              gameCycle === 'night'
                ? 'bg-slate-950/95 border-indigo-950/80'
                : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <div className="flex items-center gap-2">
                {gameCycle === 'day' ? (
                  <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setDayTab('roster')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        dayTab === 'roster'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>ผังผู้เล่น ({roster.length} คน)</span>
                    </button>

                    <button
                      onClick={() => setDayTab('chat')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer relative ${
                        dayTab === 'chat'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
                      <span>💬 ถกเถียงยามเช้า</span>
                      {morningMessages.length > 0 && (
                        <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 font-black text-[9px] rounded-full">
                          {morningMessages.length}
                        </span>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <h4 className="font-bold text-xs sm:text-sm text-white">
                      ผู้เล่นในหมู่บ้าน ({roster.length} คน) —{' '}
                      {isUserNightActor && !hasActedTonight ? (
                        <span className="text-amber-400 animate-pulse">
                          คลิกเลือกผู้เล่นเพื่อใช้พลังพิเศษ 🎯
                        </span>
                      ) : (
                        <span className="text-slate-400">สถานะผู้เล่น</span>
                      )}
                    </h4>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="text-emerald-400">
                  • มีชีวิต: {roster.filter((p) => p.isAlive).length} คน
                </span>
                <span className="text-rose-400">
                  • เสียชีวิต: {roster.filter((p) => !p.isAlive).length} คน
                </span>
              </div>
            </div>

            {/* สลับมุมมอง: ห้องแชทสนทนายามเช้า (Chat) หรือ ผังการ์ดผู้เล่น 12 คน (Roster) */}
            {gameCycle === 'day' && dayTab === 'chat' ? (
              <div className="flex-1 flex flex-col justify-between overflow-hidden min-h-0 bg-slate-950/80 rounded-xl border border-slate-800/80 p-2 sm:p-3">
                {/* กล่องรายการข้อความสนทนา */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[calc(100vh-420px)]">
                  {morningMessages.map((msg) => {
                    if (msg.isSystem) {
                      return (
                        <div
                          key={msg.id}
                          className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs text-center font-medium my-1"
                        >
                          <span className="font-bold text-amber-300 mr-1.5">{msg.senderName}:</span>
                          {msg.text}
                        </div>
                      )
                    }

                    const isTeammateWolf = isUserWerewolfTeam && msg.role?.team === 'werewolf' && !msg.isUser

                    return (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-2 text-xs animate-in fade-in duration-200 ${
                          msg.isUser ? 'flex-row-reverse' : ''
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
                            msg.isUser
                              ? 'bg-indigo-600 text-white border-indigo-400'
                              : isTeammateWolf
                              ? 'bg-red-950 text-red-300 border-red-500/60'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {msg.isUser ? <UserRound className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                        </div>

                        <div className={`max-w-[80%] flex flex-col ${msg.isUser ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-bold text-[11px] text-slate-300">
                              {msg.senderName}
                            </span>
                            {isTeammateWolf && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-red-950 text-red-400 font-bold border border-red-500/40">
                                🐺 {msg.role.name}
                              </span>
                            )}
                            <span className="text-[9px] text-slate-500">{msg.time}</span>
                          </div>

                          <div
                            className={`p-2.5 rounded-2xl leading-relaxed text-xs shadow-sm ${
                              msg.isUser
                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                : isTeammateWolf
                                ? 'bg-red-950/40 text-red-100 border border-red-500/30 rounded-tl-none'
                                : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* ปุ่มลัดพิมพ์ไว & ช่องกรอกข้อความสนทนา */}
                <div className="mt-2 pt-2 border-t border-slate-800 shrink-0 space-y-1.5">
                  {/* ชิปพิมพ์ด่วน */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[10px]">
                    <span className="text-slate-400 font-bold shrink-0">พิมพ์ด่วน:</span>
                    <button
                      onClick={() => handleSendChatMessage('ฉันเป็นคนดีบริสุทธิ์นะ อย่าเพิ่งรีบโหวตฉันเลย!')}
                      className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition shrink-0 cursor-pointer"
                    >
                      🛡️ ฉันเป็นคนดี
                    </button>
                    <button
                      onClick={() => handleSendChatMessage('ฉันสังเกตเห็นบางคนทำตัวเงียบผิดปกติ เช้านี้มีพิรุธจัง!')}
                      className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition shrink-0 cursor-pointer"
                    >
                      👀 มีคนเงียบผิดปกติ
                    </button>
                    <button
                      onClick={() => handleSendChatMessage('ทุกคนอย่าเพิ่งใจร้อนนะ ฟังเหตุผลกันก่อนค่อยตัดสินใจ')}
                      className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition shrink-0 cursor-pointer"
                    >
                      🕊️ อย่าเพิ่งใจร้อน
                    </button>
                    <button
                      onClick={() => handleSendChatMessage('ฉันมั่นใจว่าในหมู่บ้านเรามีหมาป่าซ่อนตัวอยู่แน่นอน!')}
                      className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition shrink-0 cursor-pointer"
                    >
                      🐺 มีหมาป่าซ่อนอยู่
                    </button>
                  </div>

                  {/* ช่องพิมพ์ข้อความคุยกับบอท */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSendChatMessage()
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={userChatInput}
                      onChange={(e) => setUserChatInput(e.target.value)}
                      placeholder={
                        userPlayer?.isAlive
                          ? "พิมพ์ข้อความคุยกับบอทในหมู่บ้าน... (เช่น 'ฉันสงสัยบอทอเล็กซ์')"
                          : "คุณเสียชีวิตแล้ว (วิญญาณกำลังเฝ้าดู 👻)"
                      }
                      disabled={!userPlayer?.isAlive}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50 transition"
                    />
                    <button
                      type="submit"
                      disabled={!userPlayer?.isAlive || !userChatInput.trim()}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>ส่ง</span>
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 overflow-y-auto max-h-[calc(100vh-340px)] p-1">
              {roster.map((player) => {
                const isSelected = selectedTargetId === player.id
                const votesCount = voteTally[player.id] || 0
                const isTeammate = isUserWerewolfTeam && player.role.team === 'werewolf' && !player.isUser

                const canClickNight =
                  gameCycle === 'night' &&
                  isUserNightActor &&
                  !hasActedTonight &&
                  player.isAlive &&
                  (!isUserWerewolfTeam || player.role.team !== 'werewolf')

                const canClickDayVote =
                  gameCycle === 'day' &&
                  !hasVotedToday &&
                  player.isAlive

                const isClickable = canClickNight || canClickDayVote

                return (
                  <div
                    key={player.id}
                    onClick={() => {
                      if (isClickable) setSelectedTargetId(player.id)
                    }}
                    className={`p-2.5 rounded-xl border flex flex-col justify-between text-center transition-all relative overflow-hidden ${
                      !player.isAlive
                        ? 'bg-slate-950/60 border-rose-950 opacity-40 grayscale'
                        : isSelected
                        ? 'bg-purple-950/90 border-amber-400 ring-2 ring-amber-400 scale-[1.03] shadow-lg z-20'
                        : player.isUser
                        ? 'bg-indigo-950/90 border-indigo-400/80 ring-2 ring-indigo-500/60 shadow-lg'
                        : isTeammate
                        ? 'bg-gradient-to-b from-red-950/50 to-slate-900 border-red-500/70 shadow-md shadow-red-950/50 ring-1 ring-red-500/40'
                        : isClickable
                        ? 'bg-slate-900/90 border-slate-700 hover:border-amber-400 hover:scale-[1.02] cursor-pointer'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    {/* ป้ายด้านบน + คะแนนโหวตถ้ามี */}
                    <div className="flex items-center justify-between mb-1.5">
                      {player.isUser ? (
                        <span className="px-1.5 py-0.5 bg-indigo-500 text-[8px] font-black rounded text-white shadow-xs">
                          YOU
                        </span>
                      ) : isTeammate ? (
                        <span className="px-1.5 py-0.5 bg-red-950/90 text-red-300 border border-red-500/50 text-[8px] font-black rounded flex items-center gap-0.5 shadow-xs">
                          <Skull className="w-2.5 h-2.5 text-red-400" />
                          <span>พวกเดียวกัน</span>
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 text-[8px] font-bold rounded flex items-center gap-0.5">
                          <Bot className="w-2.5 h-2.5" />
                          <span>BOT</span>
                        </span>
                      )}

                      {/* คะแนนโหวตที่ได้รับ */}
                      {hasVotedToday && votesCount > 0 && player.isAlive && (
                        <span className="px-1.5 py-0.5 bg-rose-600 text-white font-black text-[9px] rounded-full animate-bounce shadow-xs">
                          {votesCount} เสียง
                        </span>
                      )}

                      {player.isAlive ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-xs" title="มีชีวิต" />
                      ) : (
                        <span className="text-[9px] font-bold text-rose-500">💀 ตาย</span>
                      )}
                    </div>

                    {/* อวาตาร์และชื่อ */}
                    <div className="my-1 flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full border flex items-center justify-center mb-1 transition-colors ${
                          !player.isAlive
                            ? 'bg-slate-900 border-slate-800 text-rose-500'
                            : isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-300'
                            : player.isUser
                            ? 'bg-indigo-600/30 border-indigo-400 text-indigo-300'
                            : isTeammate
                            ? 'bg-red-950/80 border-red-500/70 text-red-300 ring-1 ring-red-500/40 shadow-xs'
                            : 'bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                      >
                        {isSelected ? (
                          gameCycle === 'day' ? (
                            <Gavel className="w-5 h-5 animate-pulse" />
                          ) : (
                            <Target className="w-5 h-5 animate-spin" />
                          )
                        ) : player.isUser ? (
                          <UserRound className="w-4 h-4 text-indigo-300" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                      <p className="font-bold text-xs text-white truncate max-w-full">
                        {player.name}
                      </p>
                    </div>

                    {/* ข้อมูลบทบาทหรือสถานะ */}
                    <div className="mt-1 pt-1 border-t border-slate-800/80 text-[10px]">
                      {player.isUser ? (
                        <span className="font-black text-amber-300 truncate block">
                          {player.role.name}
                        </span>
                      ) : !player.isAlive ? (
                        <span className="text-rose-400 font-bold">{player.role.name}</span>
                      ) : isTeammate ? (
                        <span className="font-black text-red-400 truncate block flex items-center justify-center gap-0.5" title={`พวกเดียวกัน: ${player.role.name}`}>
                          <span>🐺</span>
                          <span className="truncate">{player.role.name}</span>
                        </span>
                      ) : isSelected ? (
                        <span className="text-amber-300 font-bold">
                          {gameCycle === 'day' ? '🗳️ เป้าหมายโหวต' : '🎯 เป้าหมาย'}
                        </span>
                      ) : gameCycle === 'night' ? (
                        <span className="text-slate-500 font-medium">หลับใหล 💤</span>
                      ) : (
                        <span className="text-slate-400 font-medium">รอโหวต 🗳️</span>
                      )}
                    </div>

                    {/* ความคิด/คำพูดของบอทในเช้านี้ */}
                    {gameCycle === 'day' && botThoughts[player.id] && player.isAlive && !player.isUser && (
                      <div
                        className="mt-1 px-1.5 py-0.5 bg-amber-500/10 border border-amber-400/25 rounded text-[8.5px] text-amber-200/90 text-left line-clamp-2 leading-tight"
                        title={botThoughts[player.id]}
                      >
                        <span className="font-bold text-amber-300">💬 </span>
                        "{botThoughts[player.id]}"
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

            {/* บันทึกเหตุการณ์ */}
            <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-indigo-300 font-semibold truncate">
                <span className="text-base">{gameCycle === 'night' ? '🌙' : '☀️'}</span>
                <span className="truncate">
                  {logs[0] || 'เกมกำลังดำเนินไปอย่างตื่นเต้น...'}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsRoleModalOpen(true)}
                  className="px-3 py-1 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/50 text-[11px] font-bold rounded-lg transition cursor-pointer"
                >
                  การ์ดบทบาทลับ 🎴
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
