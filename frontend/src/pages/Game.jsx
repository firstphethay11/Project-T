import { useState, useEffect } from 'react'
import {
  Dices,
  Coins,
  Building2,
  Flag,
  Sparkles,
  RotateCcw,
  Palmtree,
  ShieldAlert,
  UserRound,
  Bot,
  Gift,
  HelpCircle,
  ReceiptText,
  Train,
  Plane,
  Ship,
  Droplets,
  Zap,
  Swords,
  Trophy,
  ArrowRight,
  Home,
  Gamepad2,
} from 'lucide-react'

// รายการช่องเดินบนกระดาน 40 ช่อง (11 x 11 Grid)
const INITIAL_TILES = [
  // ด้านซ้าย ล่างขึ้นบน (แถว 11 -> 1, คอลัมน์ 1)
  { id: 0, name: 'จุดเริ่มต้น', type: 'start', price: 0, rent: 0, color: 'bg-emerald-600', icon: Flag, gridPos: 'row-start-11 col-start-1' },
  { id: 1, name: 'ลำปาง', type: 'property', price: 600, rent: 150, color: 'bg-amber-800', group: 'น้ำตาล', gridPos: 'row-start-10 col-start-1' },
  { id: 2, name: 'หีบสมบัติ', type: 'chance', price: 0, rent: 0, color: 'bg-purple-500', icon: Gift, gridPos: 'row-start-9 col-start-1' },
  { id: 3, name: 'พิษณุโลก', type: 'property', price: 800, rent: 200, color: 'bg-amber-800', group: 'น้ำตาล', gridPos: 'row-start-8 col-start-1' },
  { id: 4, name: 'ภาษีรายได้', type: 'tax', price: 500, rent: 0, color: 'bg-rose-500', icon: ReceiptText, gridPos: 'row-start-7 col-start-1' },
  { id: 5, name: 'สถานีบางซื่อ', type: 'transport', price: 2000, rent: 400, color: 'bg-slate-700', icon: Train, gridPos: 'row-start-6 col-start-1' },
  { id: 6, name: 'เชียงราย', type: 'property', price: 1000, rent: 250, color: 'bg-sky-400', group: 'ฟ้าอ่อน', gridPos: 'row-start-5 col-start-1' },
  { id: 7, name: 'การ์ดโอกาส', type: 'chance', price: 0, rent: 0, color: 'bg-orange-500', icon: HelpCircle, gridPos: 'row-start-4 col-start-1' },
  { id: 8, name: 'เชียงใหม่', type: 'property', price: 1200, rent: 300, color: 'bg-sky-400', group: 'ฟ้าอ่อน', gridPos: 'row-start-3 col-start-1' },
  { id: 9, name: 'แม่ฮ่องสอน', type: 'property', price: 1400, rent: 350, color: 'bg-sky-400', group: 'ฟ้าอ่อน', gridPos: 'row-start-2 col-start-1' },
  { id: 10, name: 'เรือนจำ / พัก', type: 'jail', price: 0, rent: 0, color: 'bg-slate-800', icon: ShieldAlert, gridPos: 'row-start-1 col-start-1' },

  // ด้านบน ซ้ายไปขวา (แถว 1, คอลัมน์ 2 -> 11)
  { id: 11, name: 'ชลบุรี', type: 'property', price: 1600, rent: 400, color: 'bg-pink-500', group: 'ชมพู', gridPos: 'row-start-1 col-start-2' },
  { id: 12, name: 'การประปา', type: 'utility', price: 1500, rent: 300, color: 'bg-cyan-600', icon: Droplets, gridPos: 'row-start-1 col-start-3' },
  { id: 13, name: 'พัทยา', type: 'property', price: 1800, rent: 450, color: 'bg-pink-500', group: 'ชมพู', gridPos: 'row-start-1 col-start-4' },
  { id: 14, name: 'ระยอง', type: 'property', price: 2000, rent: 500, color: 'bg-pink-500', group: 'ชมพู', gridPos: 'row-start-1 col-start-5' },
  { id: 15, name: 'สนามบินดอนเมือง', type: 'transport', price: 2000, rent: 400, color: 'bg-slate-700', icon: Plane, gridPos: 'row-start-1 col-start-6' },
  { id: 16, name: 'นครราชสีมา', type: 'property', price: 2200, rent: 500, color: 'bg-amber-500', group: 'ส้ม', gridPos: 'row-start-1 col-start-7' },
  { id: 17, name: 'หีบสมบัติ', type: 'chance', price: 0, rent: 0, color: 'bg-purple-500', icon: Gift, gridPos: 'row-start-1 col-start-8' },
  { id: 18, name: 'ขอนแก่น', type: 'property', price: 2400, rent: 550, color: 'bg-amber-500', group: 'ส้ม', gridPos: 'row-start-1 col-start-9' },
  { id: 19, name: 'อุดรธานี', type: 'property', price: 2600, rent: 600, color: 'bg-amber-500', group: 'ส้ม', gridPos: 'row-start-1 col-start-10' },
  { id: 20, name: 'เกาะพักผ่อน', type: 'rest', price: 0, rent: 0, color: 'bg-teal-600', icon: Palmtree, gridPos: 'row-start-1 col-start-11' },

  // ด้านขวา บนลงล่าง (แถว 2 -> 11, คอลัมน์ 11)
  { id: 21, name: 'กระบี่', type: 'property', price: 2800, rent: 700, color: 'bg-red-500', group: 'แดง', gridPos: 'row-start-2 col-start-11' },
  { id: 22, name: 'การ์ดโอกาส', type: 'chance', price: 0, rent: 0, color: 'bg-orange-500', icon: HelpCircle, gridPos: 'row-start-3 col-start-11' },
  { id: 23, name: 'พังงา', type: 'property', price: 3000, rent: 750, color: 'bg-red-500', group: 'แดง', gridPos: 'row-start-4 col-start-11' },
  { id: 24, name: 'ภูเก็ต', type: 'property', price: 3200, rent: 800, color: 'bg-red-500', group: 'แดง', gridPos: 'row-start-5 col-start-11' },
  { id: 25, name: 'สนามบินสุวรรณภูมิ', type: 'transport', price: 2000, rent: 400, color: 'bg-slate-700', icon: Plane, gridPos: 'row-start-6 col-start-11' },
  { id: 26, name: 'สุราษฎร์ธานี', type: 'property', price: 3400, rent: 850, color: 'bg-yellow-500', group: 'เหลือง', gridPos: 'row-start-7 col-start-11' },
  { id: 27, name: 'เกาะสมุย', type: 'property', price: 3600, rent: 900, color: 'bg-yellow-500', group: 'เหลือง', gridPos: 'row-start-8 col-start-11' },
  { id: 28, name: 'การไฟฟ้า', type: 'utility', price: 1500, rent: 300, color: 'bg-amber-600', icon: Zap, gridPos: 'row-start-9 col-start-11' },
  { id: 29, name: 'หาดใหญ่', type: 'property', price: 3800, rent: 950, color: 'bg-yellow-500', group: 'เหลือง', gridPos: 'row-start-10 col-start-11' },
  { id: 30, name: 'ไปเรือนจำ!', type: 'gotojail', price: 0, rent: 0, color: 'bg-rose-700', icon: ShieldAlert, gridPos: 'row-start-11 col-start-11' },

  // ด้านล่าง ขวาไปซ้าย (แถว 11, คอลัมน์ 10 -> 2)
  { id: 31, name: 'นนทบุรี', type: 'property', price: 4000, rent: 1000, color: 'bg-emerald-600', group: 'เขียว', gridPos: 'row-start-11 col-start-10' },
  { id: 32, name: 'ปทุมธานี', type: 'property', price: 4200, rent: 1050, color: 'bg-emerald-600', group: 'เขียว', gridPos: 'row-start-11 col-start-9' },
  { id: 33, name: 'หีบสมบัติ', type: 'chance', price: 0, rent: 0, color: 'bg-purple-500', icon: Gift, gridPos: 'row-start-11 col-start-8' },
  { id: 34, name: 'สมุทรปราการ', type: 'property', price: 4400, rent: 1100, color: 'bg-emerald-600', group: 'เขียว', gridPos: 'row-start-11 col-start-7' },
  { id: 35, name: 'ท่าเรือคลองเตย', type: 'transport', price: 2000, rent: 400, color: 'bg-slate-700', icon: Ship, gridPos: 'row-start-11 col-start-6' },
  { id: 36, name: 'การ์ดโอกาส', type: 'chance', price: 0, rent: 0, color: 'bg-orange-500', icon: HelpCircle, gridPos: 'row-start-11 col-start-5' },
  { id: 37, name: 'สาทร', type: 'property', price: 4800, rent: 1200, color: 'bg-blue-700', group: 'น้ำเงินเข้ม', gridPos: 'row-start-11 col-start-4' },
  { id: 38, name: 'ภาษีฟุ่มเฟือย', type: 'tax', price: 1000, rent: 0, color: 'bg-rose-600', icon: ReceiptText, gridPos: 'row-start-11 col-start-3' },
  { id: 39, name: 'สยามพารากอน', type: 'property', price: 5500, rent: 1500, color: 'bg-blue-700', group: 'น้ำเงินเข้ม', gridPos: 'row-start-11 col-start-2' },
]

const RPS_CHOICES = [
  { id: 'rock', label: 'ค้อน', icon: '✊' },
  { id: 'paper', label: 'กระดาษ', icon: '✋' },
  { id: 'scissors', label: 'กรรไกร', icon: '✌️' },
]

function Game({ setCurrentPage }) {
  // สถานะเฟสเกม: 'welcome' (หน้าถามว่าจะเล่นไหม) | 'rps' (เป่ายิ้งฉุบ) | 'playing' (เล่นบนกระดาน)
  const [gamePhase, setGamePhase] = useState('welcome')

  // สถานะการเป่ายิ้งฉุบ
  const [rpsResult, setRpsResult] = useState({
    playerChoice: null,
    botChoice: null,
    message: 'เลือกอาวุธของคุณเพื่อชิงสิทธิ์เริ่มก่อน!',
    winner: null,
  })

  // ผู้เล่น (คุณ vs บอท AI)
  const [turn, setTurn] = useState('player') // 'player' | 'bot'
  const [player, setPlayer] = useState({ pos: 0, money: 20000, owned: [] })
  const [bot, setBot] = useState({ pos: 0, money: 20000, owned: [] })

  // ลูกเต๋าคู่
  const [dice1, setDice1] = useState(1)
  const [dice2, setDice2] = useState(1)
  const [isRolling, setIsRolling] = useState(false)
  const [isMoving, setIsMoving] = useState(false)

  // ประวัติการเล่น
  const [logs, setLogs] = useState([])

  const addLog = (msg) => {
    setLogs((prev) => [msg, ...prev.slice(0, 5)])
  }

  // ================= 1. เป่ายิ้งฉุบ (Rock-Paper-Scissors) =================
  const handleRPSPlay = (userChoice) => {
    const botPick = RPS_CHOICES[Math.floor(Math.random() * RPS_CHOICES.length)].id
    const choiceLabels = { rock: '✊ ค้อน', paper: '✋ กระดาษ', scissors: '✌️ กรรไกร' }

    if (userChoice === botPick) {
      setRpsResult({
        playerChoice: userChoice,
        botChoice: botPick,
        message: `เสมอ! คุณออก ${choiceLabels[userChoice]} บอทออก ${choiceLabels[botPick]} (เป่าใหม่อีกรอบ)`,
        winner: 'tie',
      })
      return
    }

    const isUserWin =
      (userChoice === 'rock' && botPick === 'scissors') ||
      (userChoice === 'paper' && botPick === 'rock') ||
      (userChoice === 'scissors' && botPick === 'paper')

    if (isUserWin) {
      setRpsResult({
        playerChoice: userChoice,
        botChoice: botPick,
        message: `🎉 คุณชนะ! (${choiceLabels[userChoice]} ชนะ ${choiceLabels[botPick]}) คุณได้เริ่มก่อน!`,
        winner: 'player',
      })
      setTimeout(() => {
        setTurn('player')
        setGamePhase('playing')
        addLog('🎲 คุณชนะเป่ายิ้งฉุบ ได้สิทธิ์ทอยเต๋าเป็นคนแรก!')
      }, 1500)
    } else {
      setRpsResult({
        playerChoice: userChoice,
        botChoice: botPick,
        message: `🤖 บอทชนะ! (${choiceLabels[botPick]} ชนะ ${choiceLabels[userChoice]}) บอทได้เริ่มก่อน!`,
        winner: 'bot',
      })
      setTimeout(() => {
        setTurn('bot')
        setGamePhase('playing')
        addLog('🤖 บอทชนะเป่ายิ้งฉุบ ได้สิทธิ์เริ่มเดินก่อน!')
      }, 1500)
    }
  }

  // ================= 2. ระบบตาเดินของบอท AI (Bot Turn Automation) =================
  useEffect(() => {
    if (gamePhase !== 'playing' || turn !== 'bot' || isRolling || isMoving) return

    const timer = setTimeout(() => {
      botRollAndMove()
    }, 1100)

    return () => clearTimeout(timer)
  }, [turn, gamePhase])

  // บอททอยเต๋าและเดิน
  const botRollAndMove = () => {
    setIsRolling(true)
    let count = 0
    const interval = setInterval(() => {
      setDice1(Math.floor(Math.random() * 6) + 1)
      setDice2(Math.floor(Math.random() * 6) + 1)
      count++
      if (count > 8) {
        clearInterval(interval)
        const d1 = Math.floor(Math.random() * 6) + 1
        const d2 = Math.floor(Math.random() * 6) + 1
        setDice1(d1)
        setDice2(d2)
        setIsRolling(false)

        animateWalking(d1 + d2, 'bot')
      }
    }, 70)
  }

  // ================= 3. ผู้เล่นทอยเต๋า =================
  const handlePlayerRoll = () => {
    if (isRolling || isMoving || turn !== 'player') return
    setIsRolling(true)

    let count = 0
    const interval = setInterval(() => {
      setDice1(Math.floor(Math.random() * 6) + 1)
      setDice2(Math.floor(Math.random() * 6) + 1)
      count++
      if (count > 8) {
        clearInterval(interval)
        const d1 = Math.floor(Math.random() * 6) + 1
        const d2 = Math.floor(Math.random() * 6) + 1
        setDice1(d1)
        setDice2(d2)
        setIsRolling(false)

        animateWalking(d1 + d2, 'player')
      }
    }, 70)
  }

  // ================= 4. อนิเมชันเดินทีละช่อง =================
  const animateWalking = (totalSteps, actor) => {
    setIsMoving(true)
    let currentStep = 0
    let currentPos = actor === 'player' ? player.pos : bot.pos

    const walkInterval = setInterval(() => {
      currentStep++
      currentPos = (currentPos + 1) % INITIAL_TILES.length

      if (actor === 'player') {
        setPlayer((prev) => {
          let newMoney = prev.money
          if (currentPos === 0) {
            newMoney += 2000
            addLog('🚩 คุณเดินผ่านจุดเริ่มต้น รับโบนัส ฿2,000!')
          }
          return { ...prev, pos: currentPos, money: newMoney }
        })
      } else {
        setBot((prev) => {
          let newMoney = prev.money
          if (currentPos === 0) {
            newMoney += 2000
            addLog('🚩 บอทเดินผ่านจุดเริ่มต้น รับโบนัส ฿2,000!')
          }
          return { ...prev, pos: currentPos, money: newMoney }
        })
      }

      if (currentStep >= totalSteps) {
        clearInterval(walkInterval)
        setIsMoving(false)
        handleLanding(currentPos, actor)
      }
    }, 200)
  }

  // ================= 5. ตรวจสอบเหตุการณ์ช่องปลายทาง =================
  const handleLanding = (finalPos, actor) => {
    const tile = INITIAL_TILES[finalPos]
    const isPlayer = actor === 'player'

    if (tile.type === 'tax') {
      if (isPlayer) {
        setPlayer((p) => ({ ...p, money: Math.max(0, p.money - tile.price) }))
        addLog(`💸 คุณเสียภาษี ฿${tile.price.toLocaleString()}`)
      } else {
        setBot((b) => ({ ...b, money: Math.max(0, b.money - tile.price) }))
        addLog(`💸 บอทเสียภาษี ฿${tile.price.toLocaleString()}`)
      }
    } else if (tile.type === 'gotojail') {
      addLog(`🚨 ${isPlayer ? 'คุณ' : 'บอท'} โดนตำรวจจับส่งเข้าเรือนจำ!`)
      setTimeout(() => {
        if (isPlayer) setPlayer((p) => ({ ...p, pos: 10 }))
        else setBot((b) => ({ ...b, pos: 10 }))
      }, 500)
    } else if (tile.type === 'chance') {
      const reward = Math.random() > 0.5 ? 1200 : -600
      if (isPlayer) {
        setPlayer((p) => ({ ...p, money: Math.max(0, p.money + reward) }))
        addLog(
          reward > 0
            ? `🎁 คุณเปิดการ์ดโชคดี ได้รับ ฿${reward}!`
            : `⚡ คุณเปิดการ์ดโชคร้าย เสีย ฿${Math.abs(reward)}`
        )
      } else {
        setBot((b) => ({ ...b, money: Math.max(0, b.money + reward) }))
        addLog(
          reward > 0
            ? `🎁 บอทเปิดการ์ดโชคดี ได้ ฿${reward}!`
            : `⚡ บอทเปิดการ์ดโชคร้าย เสีย ฿${Math.abs(reward)}`
        )
      }
    } else if (['property', 'transport', 'utility'].includes(tile.type)) {
      const isPlayerOwned = player.owned.includes(tile.id)
      const isBotOwned = bot.owned.includes(tile.id)

      if (isPlayer) {
        if (isBotOwned) {
          const rent = tile.rent
          setPlayer((p) => ({ ...p, money: Math.max(0, p.money - rent) }))
          setBot((b) => ({ ...b, money: b.money + rent }))
          addLog(`💸 คุณตกที่ดินบอท (${tile.name}) จ่ายค่าเช่า ฿${rent.toLocaleString()}`)
        } else if (!isPlayerOwned) {
          addLog(`🏙️ คุณตกที่ดินว่าง: ${tile.name} (ราคา ฿${tile.price.toLocaleString()})`)
          return
        }
      } else {
        if (isPlayerOwned) {
          const rent = tile.rent
          setBot((b) => ({ ...b, money: Math.max(0, b.money - rent) }))
          setPlayer((p) => ({ ...p, money: p.money + rent }))
          addLog(`💰 บอทตกที่ดินของคุณ (${tile.name}) จ่ายค่าเช่าให้คุณ ฿${rent.toLocaleString()}!`)
        } else if (!isBotOwned) {
          if (bot.money >= tile.price + 2500) {
            setBot((b) => ({
              ...b,
              money: b.money - tile.price,
              owned: [...b.owned, tile.id],
            }))
            addLog(`🤖 บอทตัดสินใจซื้อที่ดิน "${tile.name}" ราคา ฿${tile.price.toLocaleString()}`)
          } else {
            addLog(`🤖 บอทตัดสินใจไม่ซื้อ ${tile.name} (เก็บเงินไว้)`)
          }
        }
      }
    }

    if (!isPlayer) {
      setTimeout(() => setTurn('player'), 1000)
    } else {
      setTimeout(() => setTurn('bot'), 1200)
    }
  }

  // ผู้เล่นซื้อที่ดิน
  const handlePlayerBuy = (tile) => {
    if (player.money < tile.price) {
      alert('ยอดเงินไม่เพียงพอสำหรับการซื้อที่ดินนี้!')
      return
    }
    setPlayer((p) => ({
      ...p,
      money: p.money - tile.price,
      owned: [...p.owned, tile.id],
    }))
    addLog(`🎉 คุณได้ซื้อที่ดิน "${tile.name}" ราคา ฿${tile.price.toLocaleString()}`)
    setTimeout(() => setTurn('bot'), 1000)
  }

  // ผู้เล่นข้ามไม่ซื้อที่ดิน
  const handlePlayerSkipBuy = () => {
    addLog(`คุณเลือกไม่ซื้อที่ดินนี้`)
    setTurn('bot')
  }

  // รีเซ็ตเริ่มเกมใหม่ (กลับไปหน้าเริ่มต้นถามว่าจะเล่นไหม)
  const handleReset = () => {
    setPlayer({ pos: 0, money: 20000, owned: [] })
    setBot({ pos: 0, money: 20000, owned: [] })
    setDice1(1)
    setDice2(1)
    setIsRolling(false)
    setIsMoving(false)
    setLogs([])
    setRpsResult({
      playerChoice: null,
      botChoice: null,
      message: 'เลือกอาวุธของคุณเพื่อชิงสิทธิ์เริ่มก่อน!',
      winner: null,
    })
    setGamePhase('welcome')
  }

  const currentTile = INITIAL_TILES[player.pos]
  const canPlayerBuy =
    gamePhase === 'playing' &&
    turn === 'player' &&
    !isMoving &&
    !isRolling &&
    ['property', 'transport', 'utility'].includes(currentTile.type) &&
    !player.owned.includes(currentTile.id) &&
    !bot.owned.includes(currentTile.id) &&
    player.money >= currentTile.price

  const totalBuyable = INITIAL_TILES.filter((t) =>
    ['property', 'transport', 'utility'].includes(t.type)
  ).length

  // ================= 0. หน้าแรกสุด: ถามว่าจะเล่นเกมหรือไม่ =================
  if (gamePhase === 'welcome') {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-140px)] p-4 select-none">
        <div className="bg-white rounded-3xl max-w-lg w-full p-8 text-center shadow-xl border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
          {/* ไอคอนหัวข้อ */}
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-lg shadow-amber-500/30 mb-5">
            <Gamepad2 className="w-10 h-10" />
          </div>

          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-black rounded-full mb-2">
            PROJECT-T MONOPOLY
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800 mb-2">
            คุณต้องการเล่นเกมเศรษฐีหรือไม่?
          </h1>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            เข้าสู่เกมกระดาน 11 × 11 (40 ช่อง) เป่ายิ้งฉุบชิงสิทธิ์เดินก่อน และท้าดวลสร้างเมืองกับบอท AI!
          </p>

          {/* จุดเด่นของเกม 3 ข้อ */}
          <div className="grid grid-cols-3 gap-2.5 mb-8 text-left">
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
              <span className="text-2xl block mb-1">✊</span>
              <p className="font-bold text-xs text-amber-900">เป่ายิ้งฉุบ</p>
              <p className="text-[10px] text-amber-700">ชิงสิทธิ์เริ่มก่อน</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
              <span className="text-2xl block mb-1">🤖</span>
              <p className="font-bold text-xs text-blue-900">ดวลกับบอท</p>
              <p className="text-[10px] text-blue-700">ระบบ AI ทอยเต๋า</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="text-2xl block mb-1">🏙️</span>
              <p className="font-bold text-xs text-emerald-900">40 ช่อง</p>
              <p className="text-[10px] text-emerald-700">ซื้อเมืองเก็บค่าเช่า</p>
            </div>
          </div>

          {/* 2 ปุ่ม: เริ่มเล่น vs กลับหน้าแรก */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {setCurrentPage && (
              <button
                onClick={() => setCurrentPage('home')}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer order-2 sm:order-1"
              >
                <Home className="w-4 h-4 text-gray-500" />
                <span>ยังไม่เล่น (กลับหน้าแรก)</span>
              </button>
            )}

            <button
              onClick={() => setGamePhase('rps')}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer order-1 sm:order-2"
            >
              <span>เริ่มเล่นเกมเลย!</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-85px)] justify-between select-none relative">
      {/* ================= MODAL เป่ายิ้งฉุบก่อนเริ่มเกม ================= */}
      {gamePhase === 'rps' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl border-4 border-amber-400 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center gap-2 mb-2 text-amber-600">
              <Swords className="w-8 h-8 animate-bounce" />
            </div>
            <h2 className="text-2xl font-black text-gray-800">เป่ายิ้งฉุบเลือกคนเริ่มก่อน!</h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-1 mb-6">
              คุณ vs บอท AI ใครชนะจะได้ทอยลูกเต๋าเดินก่อน
            </p>

            {/* แสดงสิ่งที่บอทเลือก (ถ้ามีการเลือกแล้ว) */}
            {rpsResult.botChoice && (
              <div className="mb-4 p-3 bg-amber-50 rounded-2xl border border-amber-200 text-sm font-semibold text-amber-900">
                {rpsResult.message}
              </div>
            )}

            {/* ปุ่ม 3 ตัวเลือก: ค้อน กรรไกร กระดาษ */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {RPS_CHOICES.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleRPSPlay(choice.id)}
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-amber-100 hover:border-amber-400 border-2 border-gray-200 rounded-2xl transition transform hover:scale-105 active:scale-95 cursor-pointer shadow-xs group"
                >
                  <span className="text-4xl sm:text-5xl mb-2 group-hover:scale-110 transition-transform">
                    {choice.icon}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-gray-700">
                    {choice.label}
                  </span>
                </button>
              ))}
            </div>

            <p className="text-[11px] text-gray-400">
              คลิกเลือกสัญลักษณ์ที่ต้องการ เพื่อเริ่มท้าดวลกับบอท
            </p>
          </div>
        </div>
      )}

      {/* แถบหัวด้านบน: สรุปสถานะ 2 ฝั่ง (คุณ vs บอท) */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-2xs shrink-0 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg font-black text-gray-800 tracking-tight">
            🎲 เกมเศรษฐี
          </span>
          <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 rounded-full">
            11 × 11 vs บอท AI
          </span>
        </div>

        {/* แถบสถานะ คุณ vs บอท */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          {/* สถานะผู้เล่น */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold transition-all ${
              turn === 'player'
                ? 'bg-red-50 text-red-800 border-red-300 ring-2 ring-red-400/50'
                : 'bg-gray-50 text-gray-600 border-gray-200 opacity-80'
            }`}
          >
            <UserRound className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span>คุณ: ฿{player.money.toLocaleString()}</span>
            <span className="text-[10px] text-red-600">({player.owned.length} เมือง)</span>
          </div>

          <span className="text-xs font-black text-gray-400">VS</span>

          {/* สถานะบอท */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold transition-all ${
              turn === 'bot'
                ? 'bg-blue-50 text-blue-800 border-blue-300 ring-2 ring-blue-400/50'
                : 'bg-gray-50 text-gray-600 border-gray-200 opacity-80'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>บอท: ฿{bot.money.toLocaleString()}</span>
            <span className="text-[10px] text-blue-600">({bot.owned.length} เมือง)</span>
          </div>
        </div>

        {/* ปุ่มเริ่มใหม่ */}
        <button
          onClick={handleReset}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition cursor-pointer"
          title="เริ่มเกมใหม่ (กลับไปหน้าเริ่มต้น)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>เริ่มใหม่</span>
        </button>
      </div>

      {/* กระดานเกม 11x11 */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div
          style={{
            height: 'min(calc(100vh - 165px), calc(100vw - 320px), 740px)',
            width: 'min(calc(100vh - 165px), calc(100vw - 320px), 740px)',
          }}
          className="bg-emerald-950 p-1 sm:p-1.5 rounded-2xl shadow-xl border-4 border-amber-600 grid grid-cols-11 grid-rows-11 gap-0.5 sm:gap-1 relative aspect-square"
        >
          {/* เรนเดอร์ 40 ช่องรอบกระดาน */}
          {INITIAL_TILES.map((tile) => {
            const isPlayerHere = player.pos === tile.id
            const isBotHere = bot.pos === tile.id
            const isPlayerOwned = player.owned.includes(tile.id)
            const isBotOwned = bot.owned.includes(tile.id)
            const Icon = tile.icon
            const isCorner = [0, 10, 20, 30].includes(tile.id)

            return (
              <div
                key={tile.id}
                className={`${tile.gridPos} ${
                  isCorner ? 'bg-amber-100' : 'bg-amber-50'
                } rounded-xs sm:rounded-sm p-0.5 flex flex-col justify-between border transition-all duration-150 relative overflow-hidden select-none ${
                  isPlayerHere || isBotHere
                    ? 'border-amber-400 ring-2 ring-yellow-400 shadow-md z-20'
                    : isPlayerOwned
                    ? 'border-red-400 bg-red-50/70'
                    : isBotOwned
                    ? 'border-blue-400 bg-blue-50/70'
                    : 'border-amber-200/70'
                }`}
              >
                {/* แถบสีหัวมุมเมือง */}
                {tile.color && !isCorner && (
                  <div
                    className={`h-1 sm:h-1.5 w-full rounded-2xs ${tile.color} mb-0.5 shrink-0 flex items-center justify-between px-0.5`}
                  >
                    <span className="text-[6px] text-white font-black leading-none">
                      {isPlayerOwned ? '🔴 คุณ' : isBotOwned ? '🤖 บอท' : ''}
                    </span>
                  </div>
                )}

                {/* เนื้อหาช่อง */}
                <div className="flex-1 flex flex-col items-center justify-center text-center px-0.5">
                  {Icon && (
                    <div className="text-slate-700 shrink-0">
                      <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </div>
                  )}
                  <p className="text-[7.5px] sm:text-[8.5px] font-bold text-gray-800 leading-tight line-clamp-2">
                    {tile.name}
                  </p>
                  {tile.price > 0 && (
                    <p className="text-[6.5px] sm:text-[7.5px] text-emerald-700 font-bold leading-none mt-0.5">
                      ฿{tile.price >= 1000 ? `${tile.price / 1000}k` : tile.price}
                    </p>
                  )}
                </div>

                {/* ตัวเดินของผู้เล่นและบอทบนช่อง */}
                {(isPlayerHere || isBotHere) && (
                  <div className="absolute inset-0 flex items-center justify-center gap-0.5 bg-black/15 backdrop-blur-[0.5px]">
                    {isPlayerHere && (
                      <div
                        className="bg-red-600 text-white p-0.5 rounded-full shadow-md animate-bounce z-30"
                        title="ตัวคุณ"
                      >
                        <UserRound className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                      </div>
                    )}
                    {isBotHere && (
                      <div
                        className="bg-blue-600 text-white p-0.5 rounded-full shadow-md animate-bounce z-30"
                        title="บอท AI"
                      >
                        <Bot className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {/* โซนตรงกลางกระดาน (Center Area: rows 2-10, cols 2-10) */}
          <div className="col-start-2 col-end-11 row-start-2 row-end-11 bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 rounded-xl p-3 sm:p-5 flex flex-col items-center justify-between text-white border-2 border-amber-500/40 shadow-inner">
            {/* โลโก้กลางกระดาน และ ตัวบอกตาเดิน */}
            <div className="text-center pt-1">
              <span className="text-[9px] sm:text-[11px] uppercase tracking-widest text-amber-300/90 font-semibold">
                Project-T vs BOT AI
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 drop-shadow-md">
                MONOPOLY
              </h2>

              {/* ป้ายแสดงตาเดินปัจจุบัน */}
              <div className="mt-1 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-black/40 border border-white/20">
                {turn === 'player' ? (
                  <span className="text-red-300 flex items-center gap-1.5 animate-pulse">
                    <UserRound className="w-3.5 h-3.5 text-red-400" />
                    <span>ตาของคุณ (กดทอยเต๋า)</span>
                  </span>
                ) : (
                  <span className="text-blue-300 flex items-center gap-1.5 animate-pulse">
                    <Bot className="w-3.5 h-3.5 text-blue-400" />
                    <span>ตาของบอท AI (กำลังดำเนินการ...)</span>
                  </span>
                )}
              </div>
            </div>

            {/* ส่วนทอยลูกเต๋า 2 ลูก & ปุ่มซื้อที่ดิน */}
            <div className="flex flex-col items-center gap-2.5 my-auto">
              <div className="flex items-center gap-3">
                {/* ลูกเต๋าคู่ */}
                <div className="flex gap-1.5">
                  <div
                    className={`w-9 h-9 sm:w-11 sm:h-11 bg-white text-gray-900 rounded-lg flex items-center justify-center text-base sm:text-xl font-black shadow-lg border-2 border-amber-300 transition-transform ${
                      isRolling ? 'rotate-180 scale-105' : ''
                    }`}
                  >
                    {dice1}
                  </div>
                  <div
                    className={`w-9 h-9 sm:w-11 sm:h-11 bg-white text-gray-900 rounded-lg flex items-center justify-center text-base sm:text-xl font-black shadow-lg border-2 border-amber-300 transition-transform ${
                      isRolling ? '-rotate-180 scale-105' : ''
                    }`}
                  >
                    {dice2}
                  </div>
                </div>

                {/* ปุ่มทอยเต๋า (แสดงเฉพาะตาผู้เล่น) */}
                <button
                  onClick={handlePlayerRoll}
                  disabled={isRolling || isMoving || turn !== 'player'}
                  className={`flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-md transition transform active:scale-95 cursor-pointer ${
                    turn === 'player'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 hover:shadow-amber-500/30'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  <Dices className={`w-4 h-4 ${isRolling ? 'animate-spin' : ''}`} />
                  <span>
                    {isRolling
                      ? 'กำลังทอย...'
                      : isMoving
                      ? 'กำลังเดิน... 🏃'
                      : turn === 'player'
                      ? `ทอยเต๋า (${dice1 + dice2} แต้ม)`
                      : 'ตารอบอทเล่น...'}
                  </span>
                </button>
              </div>

              {/* ปุ่มถามซื้อที่ดินเมื่อผู้เล่นตกที่ดินว่าง */}
              {canPlayerBuy && (
                <div className="flex items-center gap-2 animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => handlePlayerBuy(currentTile)}
                    className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg shadow-md transition cursor-pointer flex items-center gap-1"
                  >
                    <span>💰 ซื้อ {currentTile.name} (฿{currentTile.price.toLocaleString()})</span>
                  </button>
                  <button
                    onClick={handlePlayerSkipBuy}
                    className="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white font-semibold text-xs rounded-lg transition cursor-pointer"
                  >
                    ข้าม
                  </button>
                </div>
              )}
            </div>

            {/* กล่องบันทึกประวัติการเล่น */}
            <div className="w-full max-w-md bg-black/40 rounded-lg p-2 sm:p-2.5 border border-white/10 text-left">
              <p className="text-[9px] sm:text-[10px] text-amber-300 font-semibold mb-0.5">
                📜 บันทึกเหตุการณ์:
              </p>
              <div className="h-10 sm:h-12 overflow-y-auto space-y-0.5 text-[9.5px] sm:text-[10.5px] text-emerald-100">
                {logs.map((log, index) => (
                  <p key={index} className="truncate">
                    • {log}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Game
