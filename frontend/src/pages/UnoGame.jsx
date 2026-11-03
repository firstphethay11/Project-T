import { useState, useEffect } from 'react'
import {
  Flame,
  RotateCcw,
  Bot,
  User,
  HelpCircle,
  Trophy,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Layers,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'

// สีหลัก 4 สีของ UNO
const COLORS = [
  { id: 'red', name: 'สีแดง', bg: 'bg-red-600', border: 'border-red-500', text: 'text-red-500', glow: 'shadow-red-500/50' },
  { id: 'blue', name: 'สีน้ำเงิน', bg: 'bg-blue-600', border: 'border-blue-500', text: 'text-blue-500', glow: 'shadow-blue-500/50' },
  { id: 'green', name: 'สีเขียว', bg: 'bg-emerald-600', border: 'border-emerald-500', text: 'text-emerald-500', glow: 'shadow-emerald-500/50' },
  { id: 'yellow', name: 'สีเหลือง', bg: 'bg-amber-400', border: 'border-amber-400', text: 'text-amber-500', glow: 'shadow-amber-400/50' },
]

// สร้างสำรับไพ่ UNO มาตรฐาน
function generateDeck() {
  let deck = []
  let cardId = 1

  COLORS.forEach((color) => {
    // เลข 0 มีสีละ 1 ใบ
    deck.push({ id: cardId++, color: color.id, value: '0', type: 'number', label: '0' })

    // เลข 1-9 มีสีละ 2 ใบ
    for (let i = 1; i <= 9; i++) {
      deck.push({ id: cardId++, color: color.id, value: `${i}`, type: 'number', label: `${i}` })
      deck.push({ id: cardId++, color: color.id, value: `${i}`, type: 'number', label: `${i}` })
    }

    // การ์ดแอคชั่นพิเศษ (+2, ข้าม Skip, ย้อนกลับ Reverse)
    for (let j = 0; j < 2; j++) {
      deck.push({ id: cardId++, color: color.id, value: 'skip', type: 'action', label: '🚫' })
      deck.push({ id: cardId++, color: color.id, value: 'reverse', type: 'action', label: '🔄' })
      deck.push({ id: cardId++, color: color.id, value: 'draw2', type: 'action', label: '+2' })
    }
  })

  // การ์ดเปลี่ยนสี (Wild) 4 ใบ และ การ์ด +4 (Wild Draw 4) 4 ใบ
  for (let k = 0; k < 4; k++) {
    deck.push({ id: cardId++, color: 'wild', value: 'wild', type: 'wild', label: '🌈' })
    deck.push({ id: cardId++, color: 'wild', value: 'wild4', type: 'wild', label: '+4' })
  }

  // สลับไพ่แบบสุ่ม (Shuffle)
  return deck.sort(() => Math.random() - 0.5)
}

function UnoGame() {
  const [deck, setDeck] = useState([])
  const [playerHand, setPlayerHand] = useState([])
  const [botHand, setBotHand] = useState([])
  const [discardPile, setDiscardPile] = useState([])
  const [currentColor, setCurrentColor] = useState('red')
  const [turn, setTurn] = useState('player') // 'player' | 'bot'
  const [gameStatus, setGameStatus] = useState('playing') // 'playing' | 'player_win' | 'bot_win'
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [pendingWildCard, setPendingWildCard] = useState(null)
  const [hasDrawnThisTurn, setHasDrawnThisTurn] = useState(false)
  const [unoShout, setUnoShout] = useState(null) // แจ้งเตือน UNO!
  const [logs, setLogs] = useState([])

  const addLog = (msg) => {
    setLogs((prev) => [msg, ...prev.slice(0, 6)])
  }

  // เริ่มเกมใหม่ แจกไพ่คนละ 7 ใบ
  const initGame = () => {
    const fullDeck = generateDeck()
    const pHand = fullDeck.slice(0, 7)
    const bHand = fullDeck.slice(7, 14)
    let remain = fullDeck.slice(14)

    // หาไพ่เปิดใบแรกที่เป็นไพ่ตัวเลขธรรมดา
    let startCardIndex = remain.findIndex((c) => c.type === 'number')
    if (startCardIndex === -1) startCardIndex = 0
    const startCard = remain[startCardIndex]
    remain.splice(startCardIndex, 1)

    setDeck(remain)
    setPlayerHand(pHand)
    setBotHand(bHand)
    setDiscardPile([startCard])
    setCurrentColor(startCard.color)
    setTurn('player')
    setGameStatus('playing')
    setHasDrawnThisTurn(false)
    setColorPickerOpen(false)
    setUnoShout(null)
    setLogs([`🃏 เริ่มเกมใหม่! ไพ่เริ่มต้นคือ ${getColorName(startCard.color)} ${startCard.label}`])
  }

  useEffect(() => {
    initGame()
  }, [])

  const currentTopCard = discardPile[discardPile.length - 1]

  // ตรวจสอบว่าไพ่ใบนี้สามารถลงได้หรือไม่
  const canPlayCard = (card) => {
    if (!currentTopCard) return false
    if (card.color === 'wild') return true
    if (card.color === currentColor) return true
    if (card.value === currentTopCard.value) return true
    return false
  }

  // ผู้เล่นทิ้งไพ่
  const handlePlayerPlayCard = (card) => {
    if (turn !== 'player' || gameStatus !== 'playing') return
    if (!canPlayCard(card)) return

    // ถ้าเป็นการ์ด Wild (+4 หรือเปลี่ยนสี) ต้องเปิดหน้าต่างให้เลือกสี
    if (card.color === 'wild') {
      setPendingWildCard(card)
      setColorPickerOpen(true)
      return
    }

    executePlayCard(card, card.color, 'player')
  }

  // ดำเนินการทิ้งไพ่ และคำนวณเอฟเฟกต์การ์ด
  const executePlayCard = (card, chosenColor, who) => {
    if (who === 'player') {
      const nextHand = playerHand.filter((c) => c.id !== card.id)
      setPlayerHand(nextHand)
      setDiscardPile((prev) => [...prev, card])
      setCurrentColor(chosenColor)
      addLog(`👤 คุณทิ้งไพ่ [${getColorName(chosenColor)} ${card.label}]`)

      // ตรวจสอบชนะ
      if (nextHand.length === 0) {
        setGameStatus('player_win')
        addLog('🏆 คุณชนะเกม UNO!')
        return
      }

      if (nextHand.length === 1) {
        setUnoShout('คุณตะโกน: UNO! (เหลือไพ่ 1 ใบ)')
      }

      applyCardEffect(card, 'bot')
    } else {
      const nextHand = botHand.filter((c) => c.id !== card.id)
      setBotHand(nextHand)
      setDiscardPile((prev) => [...prev, card])
      setCurrentColor(chosenColor)
      addLog(`🤖 บอททิ้งไพ่ [${getColorName(chosenColor)} ${card.label}]`)

      // ตรวจสอบบอทชนะ
      if (nextHand.length === 0) {
        setGameStatus('bot_win')
        addLog('💀 บอทชนะเกม UNO!')
        return
      }

      if (nextHand.length === 1) {
        setUnoShout('บอทตะโกน: UNO! (เหลือไพ่ 1 ใบ)')
      }

      applyCardEffect(card, 'player')
    }
  }

  // เอฟเฟกต์การ์ดพิเศษ: Skip, Reverse, +2, +4
  const applyCardEffect = (card, target) => {
    setHasDrawnThisTurn(false)

    if (card.value === 'skip' || card.value === 'reverse') {
      addLog(`🚫 ${target === 'bot' ? 'บอท' : 'คุณ'} โดนข้ามตา!`)
      // ข้ามตา = ผู้เล่นคนเดิมได้เล่นต่อ
      if (target === 'bot') {
        setTurn('player')
      } else {
        setTurn('bot')
      }
      return
    }

    if (card.value === 'draw2') {
      addLog(`💥 ${target === 'bot' ? 'บอท' : 'คุณ'} โดน +2 จั่ว 2 ใบและเสียตา!`)
      drawCardsFor(target, 2)
      return
    }

    if (card.value === 'wild4') {
      addLog(`🔥 ${target === 'bot' ? 'บอท' : 'คุณ'} โดน Wild +4 จั่ว 4 ใบและเสียตา!`)
      drawCardsFor(target, 4)
      return
    }

    // ไพ่ตัวเลขธรรมดา สลับตา
    setTurn(target)
  }

  // จั่วการ์ด N ใบให้ผู้เล่น/บอท
  const drawCardsFor = (target, count) => {
    let currentDeck = [...deck]
    let drawn = []

    for (let i = 0; i < count; i++) {
      if (currentDeck.length === 0) {
        // ถ้ารีไซเคิลสำรับ
        currentDeck = generateDeck().slice(0, 30)
      }
      drawn.push(currentDeck.pop())
    }

    setDeck(currentDeck)

    if (target === 'player') {
      setPlayerHand((prev) => [...prev, ...drawn])
      // โดน +2 / +4 จะเสียตา ให้ตาเป็นของบอทต่อ
      setTurn('bot')
    } else {
      setBotHand((prev) => [...prev, ...drawn])
      // บอทโดน +2 / +4 ตาจะกลับมาเป็นของคุณ
      setTurn('player')
    }
  }

  // ผู้เล่นกดจั่วการ์ดเองจากกอง
  const handlePlayerDraw = () => {
    if (turn !== 'player' || gameStatus !== 'playing' || hasDrawnThisTurn) return

    let currentDeck = [...deck]
    if (currentDeck.length === 0) {
      currentDeck = generateDeck().slice(0, 30)
    }

    const card = currentDeck.pop()
    setDeck(currentDeck)
    setPlayerHand((prev) => [...prev, card])
    setHasDrawnThisTurn(true)
    addLog(`📥 คุณจั่วการ์ด 1 ใบ`)
  }

  // ผู้เล่นกดผ่านตา (หลังจากจั่วแล้วยังไม่มีไพ่ลง)
  const handlePlayerPass = () => {
    if (turn !== 'player' || !hasDrawnThisTurn) return
    setHasDrawnThisTurn(false)
    addLog(`คุณผ่านตาไปยังบอท`)
    setTurn('bot')
  }

  // ยืนยันการเลือกสีการ์ด Wild
  const handleSelectWildColor = (colorId) => {
    if (!pendingWildCard) return
    setColorPickerOpen(false)
    executePlayCard(pendingWildCard, colorId, 'player')
    setPendingWildCard(null)
  }

  // บอทเล่นอัตโนมัติ (AI Bot Logic)
  useEffect(() => {
    if (turn !== 'bot' || gameStatus !== 'playing') return

    const timer = setTimeout(() => {
      botPlayTurn()
    }, 1300)

    return () => clearTimeout(timer)
  }, [turn, gameStatus, currentColor, discardPile])

  const botPlayTurn = () => {
    // หาการ์ดที่บอทลงได้
    const playableCards = botHand.filter((c) => canPlayCard(c))

    if (playableCards.length > 0) {
      // กลยุทธ์บอท: เลือกไพ่พิเศษหรือไพ่ตัวเลขก่อน
      const chosen = playableCards[Math.floor(Math.random() * playableCards.length)]

      if (chosen.color === 'wild') {
        // บอทสุ่มเลือกสีที่ดีที่สุด (สีที่มีในมือมากที่สุด)
        const colorCounts = { red: 0, blue: 0, green: 0, yellow: 0 }
        botHand.forEach((c) => {
          if (c.color !== 'wild') colorCounts[c.color]++
        })
        const bestColor = Object.keys(colorCounts).reduce((a, b) =>
          colorCounts[a] > colorCounts[b] ? a : b
        )
        executePlayCard(chosen, bestColor, 'bot')
      } else {
        executePlayCard(chosen, chosen.color, 'bot')
      }
    } else {
      // บอทไม่มีไพ่ลง ต้องจั่วการ์ด
      let currentDeck = [...deck]
      if (currentDeck.length === 0) {
        currentDeck = generateDeck().slice(0, 30)
      }
      const newCard = currentDeck.pop()
      setDeck(currentDeck)
      addLog(`🤖 บอทไม่มีไพ่ลง จึงจั่วการ์ด 1 ใบ`)

      // ตรวจสอบว่าไพ่ที่บอทจั่วขึ้นมาลงได้เลยไหม
      if (canPlayCard(newCard)) {
        setTimeout(() => {
          if (newCard.color === 'wild') {
            executePlayCard(newCard, 'blue', 'bot')
          } else {
            executePlayCard(newCard, newCard.color, 'bot')
          }
        }, 700)
      } else {
        setBotHand((prev) => [...prev, newCard])
        setTurn('player')
      }
    }
  }

  function getColorName(c) {
    if (c === 'red') return 'แดง'
    if (c === 'blue') return 'น้ำเงิน'
    if (c === 'green') return 'เขียว'
    if (c === 'yellow') return 'เหลือง'
    return 'เปลี่ยนสี'
  }

  function getCardColorClass(c) {
    if (c === 'red') return 'bg-gradient-to-br from-red-500 to-rose-700 text-white'
    if (c === 'blue') return 'bg-gradient-to-br from-blue-500 to-indigo-700 text-white'
    if (c === 'green') return 'bg-gradient-to-br from-emerald-500 to-green-700 text-white'
    if (c === 'yellow') return 'bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 font-black'
    return 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-950 text-white border-2 border-amber-400'
  }

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col justify-between select-none relative font-sans text-slate-100">
      {/* ================= MODAL แจ้งผลแพ้/ชนะ ================= */}
      {gameStatus !== 'playing' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-8 text-center border-4 border-amber-400 shadow-2xl">
            <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl mb-4 bg-amber-400/20 text-amber-400">
              {gameStatus === 'player_win' ? '🏆' : '💀'}
            </div>
            <h2 className="text-3xl font-black mb-2">
              {gameStatus === 'player_win' ? 'คุณชนะเกม UNO!' : 'บอทเป็นฝ่ายชนะ!'}
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              {gameStatus === 'player_win'
                ? 'ยินดีด้วย! คุณวางไพ่จนหมดมือเป็นคนแรก!'
                : 'บอททิ้งไพ่จนหมดมือแล้ว ลองแก้มือใหม่อีกครั้ง!'}
            </p>
            <button
              onClick={initGame}
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-400/30 transition transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              🔄 เล่นใหม่อีกครั้ง
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL เลือกสีสำหรับไพ่ WILD ================= */}
      {colorPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-slate-900 border-2 border-white/20 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">เลือกสีที่คุณต้องการเปลี่ยน</h3>
            <p className="text-xs text-slate-400 mb-6">คลิกสีที่ต้องการให้ผู้เล่นคนถัดไปต้องลงตาม</p>
            <div className="grid grid-cols-2 gap-3">
              {COLORS.map((col) => (
                <button
                  key={col.id}
                  onClick={() => handleSelectWildColor(col.id)}
                  className={`${col.bg} py-4 rounded-2xl text-white font-bold text-base shadow-lg transition transform hover:scale-105 active:scale-95 cursor-pointer border border-white/20`}
                >
                  {col.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ป้ายเตือน UNO กลางหน้าจอ */}
      {unoShout && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white font-black text-sm px-6 py-2 rounded-full shadow-2xl animate-bounce border-2 border-yellow-300">
          🔥 {unoShout}
        </div>
      )}

      {/* แถบด้านบน: หัวเรื่อง + สถานะเทิร์น */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 px-5 py-3 rounded-2xl shadow-md flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-500 via-amber-400 to-blue-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-red-500/20">
            U
          </div>
          <div>
            <h1 className="font-black text-lg text-white leading-none flex items-center gap-2">
              <span>UNO ARENA</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                1 vs 1 BOT
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5">
              ตรงกลางกระดาน • ฝั่งซ้ายบอท (คว่ำหน้า) • ฝั่งขวาไพ่ของคุณ
            </p>
          </div>
        </div>

        {/* ตัวบอกตาเดิน */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
              turn === 'player'
                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300 ring-2 ring-emerald-400/30'
                : 'bg-blue-500/20 border-blue-400/40 text-blue-300 ring-2 ring-blue-400/30'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-current animate-ping"></span>
            <span>{turn === 'player' ? 'ตาของคุณ (เลือกไพ่ที่ลงได้)' : 'ตาของบอท AI (กำลังคิด...)'}</span>
          </div>

          <button
            onClick={initGame}
            title="เริ่มเกมใหม่"
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition cursor-pointer text-slate-300 hover:text-white"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= 3 คอลัมน์หลัก: ฝั่งซ้าย (บอท) | ตรงกลาง (กระดาน) | ฝั่งขวา (ไพ่เรา) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* ================= 1. ฝั่งซ้าย: บอท AI (ไพ่คว่ำหน้า มองไม่เห็นใบ) ================= */}
        <div className="lg:col-span-3 bg-slate-900/70 backdrop-blur-md rounded-3xl border border-white/10 p-5 flex flex-col justify-between shadow-xl">
          <div>
            {/* หัวข้อบอท */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-white">บอท AI (คู่ต่อสู้)</h2>
                  <p className="text-[11px] text-blue-300 font-mono">
                    {turn === 'bot' ? '⚡ กำลังวิเคราะห์ไพ่...' : '💤 รอตากลยุทธ์'}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold">
                {botHand.length} ใบ
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mb-3 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
              <span>ไพ่ฝั่งตรงข้ามถูกซ่อนไว้ (โหมดออนไลน์)</span>
            </p>

            {/* แสดงการ์ดบอทแบบคว่ำหน้า (ซ้อนกันสวยงาม) */}
            <div className="flex flex-wrap gap-2 justify-center max-h-[360px] overflow-y-auto p-2 bg-slate-950/40 rounded-2xl border border-white/5">
              {botHand.map((c, i) => (
                <div
                  key={c.id || i}
                  className="w-14 h-20 sm:w-16 sm:h-24 rounded-xl bg-gradient-to-br from-red-700 via-slate-900 to-black border-2 border-amber-400/60 shadow-md flex flex-col items-center justify-center transform -rotate-1 hover:rotate-0 transition-transform duration-200 select-none relative group"
                >
                  <div className="w-10 h-16 sm:w-12 sm:h-20 rounded-lg border border-white/20 flex items-center justify-center bg-black/40">
                    <span className="font-black text-amber-400 text-xs tracking-widest rotate-45">
                      UNO
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-center">
            <span className="text-xs text-slate-400">
              {botHand.length === 1 ? '⚠️ บอทเหลือไพ่เพียง 1 ใบแล้ว!' : `เหลืออีก ${botHand.length} ใบก่อนชนะ`}
            </span>
          </div>
        </div>

        {/* ================= 2. ตรงกลาง: กระดานโต๊ะเล่น UNO (กองจั่ว + กองทิ้ง) ================= */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-emerald-950/60 to-slate-900 rounded-3xl border-2 border-emerald-500/30 p-5 sm:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          {/* แสงเรืองวงกลมตรงกลางโต๊ะ */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* แถวบน: ตัวบอกสีปัจจุบันที่ต้องลงตาม */}
          <div className="flex items-center justify-between bg-slate-950/70 border border-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-sm z-10">
            <span className="text-xs text-slate-300 font-medium">สีที่ต้องลงตามปัจจุบัน:</span>
            <div className="flex items-center gap-2">
              <span
                className={`w-3.5 h-3.5 rounded-full ${
                  currentColor === 'red'
                    ? 'bg-red-500 shadow-md shadow-red-500'
                    : currentColor === 'blue'
                    ? 'bg-blue-500 shadow-md shadow-blue-500'
                    : currentColor === 'green'
                    ? 'bg-emerald-500 shadow-md shadow-emerald-500'
                    : 'bg-amber-400 shadow-md shadow-amber-400'
                }`}
              ></span>
              <span className="text-xs font-black uppercase text-white tracking-wider">
                {getColorName(currentColor)}
              </span>
            </div>
          </div>

          {/* ตรงกลาง: กองการ์ดจั่ว (ซ้าย) vs กองการ์ดทิ้ง (ขวา) */}
          <div className="my-auto py-6 flex items-center justify-center gap-6 sm:gap-10 z-10">
            {/* กองการ์ดจั่ว (Draw Pile) */}
            <div className="flex flex-col items-center">
              <button
                onClick={handlePlayerDraw}
                disabled={turn !== 'player' || hasDrawnThisTurn}
                className={`w-24 h-36 sm:w-28 sm:h-40 rounded-2xl bg-gradient-to-br from-red-600 via-slate-900 to-black border-2 border-amber-400 shadow-2xl flex flex-col items-center justify-center transition-all transform duration-200 relative group cursor-pointer ${
                  turn === 'player' && !hasDrawnThisTurn
                    ? 'hover:scale-105 hover:-translate-y-1 ring-4 ring-amber-400/40'
                    : 'opacity-75 cursor-not-allowed'
                }`}
              >
                <div className="w-18 h-30 sm:w-20 sm:h-32 rounded-xl border border-white/20 flex flex-col items-center justify-center bg-black/50">
                  <span className="font-black text-amber-400 text-base sm:text-lg tracking-widest rotate-45">
                    UNO
                  </span>
                  <span className="text-[10px] text-slate-300 mt-2 font-mono">
                    {deck.length} ใบ
                  </span>
                </div>
              </button>
              <span className="text-xs text-amber-300 font-bold mt-2">กองจั่วการ์ด</span>
            </div>

            {/* กองการ์ดทิ้ง (Active Discard Pile) */}
            <div className="flex flex-col items-center">
              {currentTopCard ? (
                <div
                  className={`w-24 h-36 sm:w-28 sm:h-40 rounded-2xl ${getCardColorClass(
                    currentTopCard.color === 'wild' ? currentColor : currentTopCard.color
                  )} border-2 border-white/40 shadow-2xl flex flex-col justify-between p-3 transform rotate-2 animate-in zoom-in-95 duration-200 relative`}
                >
                  <span className="text-xs sm:text-sm font-black self-start">
                    {currentTopCard.label}
                  </span>
                  <div className="text-center my-auto">
                    <span className="text-3xl sm:text-4xl font-black drop-shadow-md">
                      {currentTopCard.label}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-black self-end transform rotate-180">
                    {currentTopCard.label}
                  </span>
                </div>
              ) : (
                <div className="w-24 h-36 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center text-xs text-slate-500">
                  ว่างเปล่า
                </div>
              )}
              <span className="text-xs text-slate-300 font-bold mt-2">ไพ่บนกระดาน</span>
            </div>
          </div>

          {/* ปุ่มควบคุมด้านล่างโต๊ะ: ผ่านตา (เมื่อจั่วแล้วยังลงไม่ได้) */}
          <div className="z-10 space-y-3">
            {turn === 'player' && hasDrawnThisTurn && (
              <button
                onClick={handlePlayerPass}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-amber-400/40 shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>ไม่มีไพ่ลง ➔ ผ่านตาไปยังบอท</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {/* กล่องบันทึกเหตุการณ์เกม */}
            <div className="bg-black/50 border border-white/10 rounded-2xl p-3 text-left">
              <p className="text-[10px] text-amber-300 font-bold mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>ประวัติการลงไพ่:</span>
              </p>
              <div className="h-14 overflow-y-auto space-y-0.5 text-[11px] text-slate-300">
                {logs.map((log, idx) => (
                  <p key={idx} className="truncate">
                    • {log}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= 3. ฝั่งขวา: ไพ่ของเรา (หงายหน้า คลิกทิ้งได้) ================= */}
        <div className="lg:col-span-4 bg-slate-900/70 backdrop-blur-md rounded-3xl border border-white/10 p-5 flex flex-col justify-between shadow-xl">
          <div>
            {/* หัวข้อผู้เล่น */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-white">ไพ่ในมือของคุณ</h2>
                  <p className="text-[11px] text-emerald-300 font-mono">
                    {turn === 'player' ? '👉 ตาของคุณ (คลิกการ์ดเพื่อลง)' : '⏳ รอตากลยุทธ์ของบอท'}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
                {playerHand.length} ใบ
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mb-3">
              คลิกที่การ์ดที่มีขอบสว่าง เพื่อทิ้งลงกระดาน
            </p>

            {/* แสดงไพ่ในมือของเราแบบหงายหน้า */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[380px] overflow-y-auto p-2 bg-slate-950/40 rounded-2xl border border-white/5">
              {playerHand.map((card) => {
                const playable = turn === 'player' && canPlayCard(card)

                return (
                  <button
                    key={card.id}
                    onClick={() => handlePlayerPlayCard(card)}
                    disabled={!playable}
                    className={`w-full h-24 sm:h-28 rounded-xl ${getCardColorClass(
                      card.color
                    )} flex flex-col justify-between p-1.5 sm:p-2 transition-all duration-200 transform relative select-none ${
                      playable
                        ? 'hover:-translate-y-2 hover:scale-105 shadow-xl ring-2 ring-white cursor-pointer'
                        : 'opacity-40 grayscale-[40%] cursor-not-allowed'
                    }`}
                  >
                    <span className="text-[10px] sm:text-xs font-black self-start">
                      {card.label}
                    </span>
                    <span className="text-xl sm:text-2xl font-black mx-auto drop-shadow-sm">
                      {card.label}
                    </span>
                    <span className="text-[10px] sm:text-xs font-black self-end transform rotate-180">
                      {card.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* สรุปด้านล่าง: ปุ่มช่วยจั่วการ์ดกรณีไม่มีไพ่ */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {playerHand.length === 1 ? '🔥 UNO! เหลือไพ่ใบสุดท้ายแล้ว!' : `เหลืออีก ${playerHand.length} ใบ`}
            </span>

            {turn === 'player' && !hasDrawnThisTurn && (
              <button
                onClick={handlePlayerDraw}
                className="px-3 py-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-xs font-bold rounded-lg border border-amber-400/40 transition cursor-pointer"
              >
                + จั่วการ์ด 1 ใบ
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UnoGame

