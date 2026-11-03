import { useState } from 'react'
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
  Gift,
  HelpCircle,
  ReceiptText,
  Train,
  Plane,
  Ship,
  Droplets,
  Zap,
} from 'lucide-react'

// รายการช่องเดินบนกระดาน 40 ช่อง (11 x 11 Grid - ต้นฉบับเกมเศรษฐี)
const INITIAL_TILES = [
  // ด้านซ้าย ล่างขึ้นบน (แถว 11 -> 1, คอลัมน์ 1)
  { id: 0, name: 'จุดเริ่มต้น', type: 'start', price: 0, rent: 0, color: 'bg-emerald-600', icon: Flag, gridPos: 'row-start-11 col-start-1' },
  { id: 1, name: 'ลำปาง', type: 'property', price: 600, rent: 120, color: 'bg-amber-800', group: 'น้ำตาล', gridPos: 'row-start-10 col-start-1' },
  { id: 2, name: 'หีบสมบัติ', type: 'chance', price: 0, rent: 0, color: 'bg-purple-500', icon: Gift, gridPos: 'row-start-9 col-start-1' },
  { id: 3, name: 'พิษณุโลก', type: 'property', price: 800, rent: 160, color: 'bg-amber-800', group: 'น้ำตาล', gridPos: 'row-start-8 col-start-1' },
  { id: 4, name: 'ภาษีรายได้', type: 'tax', price: 500, rent: 0, color: 'bg-rose-500', icon: ReceiptText, gridPos: 'row-start-7 col-start-1' },
  { id: 5, name: 'สถานีบางซื่อ', type: 'transport', price: 2000, rent: 400, color: 'bg-slate-700', icon: Train, gridPos: 'row-start-6 col-start-1' },
  { id: 6, name: 'เชียงราย', type: 'property', price: 1000, rent: 200, color: 'bg-sky-400', group: 'ฟ้าอ่อน', gridPos: 'row-start-5 col-start-1' },
  { id: 7, name: 'การ์ดโอกาส', type: 'chance', price: 0, rent: 0, color: 'bg-orange-500', icon: HelpCircle, gridPos: 'row-start-4 col-start-1' },
  { id: 8, name: 'เชียงใหม่', type: 'property', price: 1200, rent: 250, color: 'bg-sky-400', group: 'ฟ้าอ่อน', gridPos: 'row-start-3 col-start-1' },
  { id: 9, name: 'แม่ฮ่องสอน', type: 'property', price: 1400, rent: 300, color: 'bg-sky-400', group: 'ฟ้าอ่อน', gridPos: 'row-start-2 col-start-1' },
  { id: 10, name: 'เรือนจำ / พัก', type: 'jail', price: 0, rent: 0, color: 'bg-slate-800', icon: ShieldAlert, gridPos: 'row-start-1 col-start-1' },

  // ด้านบน ซ้ายไปขวา (แถว 1, คอลัมน์ 2 -> 11)
  { id: 11, name: 'ชลบุรี', type: 'property', price: 1600, rent: 350, color: 'bg-pink-500', group: 'ชมพู', gridPos: 'row-start-1 col-start-2' },
  { id: 12, name: 'การประปา', type: 'utility', price: 1500, rent: 300, color: 'bg-cyan-600', icon: Droplets, gridPos: 'row-start-1 col-start-3' },
  { id: 13, name: 'พัทยา', type: 'property', price: 1800, rent: 400, color: 'bg-pink-500', group: 'ชมพู', gridPos: 'row-start-1 col-start-4' },
  { id: 14, name: 'ระยอง', type: 'property', price: 2000, rent: 450, color: 'bg-pink-500', group: 'ชมพู', gridPos: 'row-start-1 col-start-5' },
  { id: 15, name: 'สนามบินดอนเมือง', type: 'transport', price: 2000, rent: 400, color: 'bg-slate-700', icon: Plane, gridPos: 'row-start-1 col-start-6' },
  { id: 16, name: 'นครราชสีมา', type: 'property', price: 2200, rent: 500, color: 'bg-amber-500', group: 'ส้ม', gridPos: 'row-start-1 col-start-7' },
  { id: 17, name: 'หีบสมบัติ', type: 'chance', price: 0, rent: 0, color: 'bg-purple-500', icon: Gift, gridPos: 'row-start-1 col-start-8' },
  { id: 18, name: 'ขอนแก่น', type: 'property', price: 2400, rent: 550, color: 'bg-amber-500', group: 'ส้ม', gridPos: 'row-start-1 col-start-9' },
  { id: 19, name: 'อุดรธานี', type: 'property', price: 2600, rent: 600, color: 'bg-amber-500', group: 'ส้ม', gridPos: 'row-start-1 col-start-10' },
  { id: 20, name: 'เกาะพักผ่อน', type: 'rest', price: 0, rent: 0, color: 'bg-teal-600', icon: Palmtree, gridPos: 'row-start-1 col-start-11' },

  // ด้านขวา บนลงล่าง (แถว 2 -> 11, คอลัมน์ 11)
  { id: 21, name: 'กระบี่', type: 'property', price: 2800, rent: 650, color: 'bg-red-500', group: 'แดง', gridPos: 'row-start-2 col-start-11' },
  { id: 22, name: 'การ์ดโอกาส', type: 'chance', price: 0, rent: 0, color: 'bg-orange-500', icon: HelpCircle, gridPos: 'row-start-3 col-start-11' },
  { id: 23, name: 'พังงา', type: 'property', price: 3000, rent: 700, color: 'bg-red-500', group: 'แดง', gridPos: 'row-start-4 col-start-11' },
  { id: 24, name: 'ภูเก็ต', type: 'property', price: 3200, rent: 750, color: 'bg-red-500', group: 'แดง', gridPos: 'row-start-5 col-start-11' },
  { id: 25, name: 'สนามบินสุวรรณภูมิ', type: 'transport', price: 2000, rent: 400, color: 'bg-slate-700', icon: Plane, gridPos: 'row-start-6 col-start-11' },
  { id: 26, name: 'สุราษฎร์ธานี', type: 'property', price: 3400, rent: 800, color: 'bg-yellow-500', group: 'เหลือง', gridPos: 'row-start-7 col-start-11' },
  { id: 27, name: 'เกาะสมุย', type: 'property', price: 3600, rent: 850, color: 'bg-yellow-500', group: 'เหลือง', gridPos: 'row-start-8 col-start-11' },
  { id: 28, name: 'การไฟฟ้า', type: 'utility', price: 1500, rent: 300, color: 'bg-amber-600', icon: Zap, gridPos: 'row-start-9 col-start-11' },
  { id: 29, name: 'หาดใหญ่', type: 'property', price: 3800, rent: 900, color: 'bg-yellow-500', group: 'เหลือง', gridPos: 'row-start-10 col-start-11' },
  { id: 30, name: 'ไปเรือนจำ!', type: 'gotojail', price: 0, rent: 0, color: 'bg-rose-700', icon: ShieldAlert, gridPos: 'row-start-11 col-start-11' },

  // ด้านล่าง ขวาไปซ้าย (แถว 11, คอลัมน์ 10 -> 2)
  { id: 31, name: 'นนทบุรี', type: 'property', price: 4000, rent: 950, color: 'bg-emerald-600', group: 'เขียว', gridPos: 'row-start-11 col-start-10' },
  { id: 32, name: 'ปทุมธานี', type: 'property', price: 4200, rent: 1000, color: 'bg-emerald-600', group: 'เขียว', gridPos: 'row-start-11 col-start-9' },
  { id: 33, name: 'หีบสมบัติ', type: 'chance', price: 0, rent: 0, color: 'bg-purple-500', icon: Gift, gridPos: 'row-start-11 col-start-8' },
  { id: 34, name: 'สมุทรปราการ', type: 'property', price: 4400, rent: 1050, color: 'bg-emerald-600', group: 'เขียว', gridPos: 'row-start-11 col-start-7' },
  { id: 35, name: 'ท่าเรือคลองเตย', type: 'transport', price: 2000, rent: 400, color: 'bg-slate-700', icon: Ship, gridPos: 'row-start-11 col-start-6' },
  { id: 36, name: 'การ์ดโอกาส', type: 'chance', price: 0, rent: 0, color: 'bg-orange-500', icon: HelpCircle, gridPos: 'row-start-11 col-start-5' },
  { id: 37, name: 'สาทร', type: 'property', price: 4800, rent: 1150, color: 'bg-blue-700', group: 'น้ำเงินเข้ม', gridPos: 'row-start-11 col-start-4' },
  { id: 38, name: 'ภาษีฟุ่มเฟือย', type: 'tax', price: 1000, rent: 0, color: 'bg-rose-600', icon: ReceiptText, gridPos: 'row-start-11 col-start-3' },
  { id: 39, name: 'สยามพารากอน', type: 'property', price: 5500, rent: 1400, color: 'bg-blue-700', group: 'น้ำเงินเข้ม', gridPos: 'row-start-11 col-start-2' },
]

function Game() {
  // สถานะผู้เล่น
  const [playerPos, setPlayerPos] = useState(0)
  const [money, setMoney] = useState(20000)
  const [ownedTiles, setOwnedTiles] = useState([]) // รหัสช่องที่ซื้อแล้ว

  // สถานะลูกเต๋า (ลูกเต๋าคู่ 2 ลูก)
  const [dice1, setDice1] = useState(1)
  const [dice2, setDice2] = useState(1)
  const [isRolling, setIsRolling] = useState(false)

  // ประวัติการเล่น
  const [logs, setLogs] = useState([
    'ยินดีต้อนรับสู่เกมเศรษฐี 40 ช่อง (11x11 Grid)! ทอยเต๋าเพื่อเริ่มเล่น',
  ])

  // ฟังก์ชันทอยลูกเต๋า 2 ลูก
  const handleRollDice = () => {
    if (isRolling) return
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
        movePlayer(d1 + d2)
      }
    }, 70)
  }

  // คำนวณการเดิน
  const movePlayer = (steps) => {
    const nextPos = (playerPos + steps) % INITIAL_TILES.length
    const passedStart = playerPos + steps >= INITIAL_TILES.length
    const currentTile = INITIAL_TILES[nextPos]

    setPlayerPos(nextPos)

    let newMoney = money
    if (passedStart && nextPos !== 0) {
      newMoney += 2000
      addLog(`🚩 เดินผ่านจุดเริ่มต้น รับโบนัส ฿2,000`)
    }

    if (currentTile.type === 'start') {
      newMoney += 2000
      addLog(`🚩 ตกที่จุดเริ่มต้น รับเงิน ฿2,000!`)
    } else if (currentTile.type === 'tax') {
      newMoney = Math.max(0, newMoney - currentTile.price)
      addLog(`💸 เสียภาษี จ่ายเงิน ฿${currentTile.price}`)
    } else if (currentTile.type === 'gotojail') {
      setPlayerPos(10)
      addLog(`🚨 ตำรวจจับส่งเข้าเรือนจำ!`)
    } else if (currentTile.type === 'chance') {
      const reward = Math.random() > 0.5 ? 1200 : -600
      newMoney = Math.max(0, newMoney + reward)
      addLog(
        reward > 0
          ? `🎁 เปิดการ์ดโชคดี ได้รับ ฿${reward}!`
          : `⚡ เปิดการ์ดโชคร้าย เสียค่าปรับ ฿${Math.abs(reward)}`
      )
    } else if (['property', 'transport', 'utility'].includes(currentTile.type)) {
      const isOwned = ownedTiles.includes(currentTile.id)
      if (isOwned) {
        addLog(`🏠 ตกช่องของคุณ: ${currentTile.name}`)
      } else {
        addLog(`🏙️ ตกที่ดินว่าง: ${currentTile.name} (฿${currentTile.price.toLocaleString()})`)
      }
    } else {
      addLog(`🌴 ตกที่ ${currentTile.name}`)
    }

    setMoney(newMoney)
  }

  // ซื้อที่ดิน
  const handleBuyProperty = (tile) => {
    if (money < tile.price) {
      alert('ยอดเงินไม่เพียงพอสำหรับการซื้อที่ดินนี้!')
      return
    }
    setMoney((prev) => prev - tile.price)
    setOwnedTiles((prev) => [...prev, tile.id])
    addLog(`🎉 ซื้อที่ดิน "${tile.name}" ราคา ฿${tile.price.toLocaleString()}`)
  }

  // เพิ่มบันทึก
  const addLog = (msg) => {
    setLogs((prev) => [msg, ...prev.slice(0, 5)])
  }

  // รีเซ็ตเกม
  const handleReset = () => {
    setPlayerPos(0)
    setMoney(20000)
    setOwnedTiles([])
    setDice1(1)
    setDice2(1)
    setLogs(['เริ่มเกมใหม่แล้ว! เงินตั้งต้น ฿20,000'])
  }

  const currentLandingTile = INITIAL_TILES[playerPos]
  const canBuyCurrent =
    ['property', 'transport', 'utility'].includes(currentLandingTile.type) &&
    !ownedTiles.includes(currentLandingTile.id) &&
    money >= currentLandingTile.price

  const totalBuyable = INITIAL_TILES.filter((t) =>
    ['property', 'transport', 'utility'].includes(t.type)
  ).length

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-85px)] justify-between select-none">
      {/* แถบหัวด้านบนแบบกะทัดรัด (Title + Stats + Reset Button) */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-2xs shrink-0 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg font-black text-gray-800 tracking-tight">
            🎲 เกมเศรษฐี
          </span>
          <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 rounded-full">
            11 × 11 (40 ช่อง)
          </span>
        </div>

        {/* แถบสรุปสถานะแนวนอน */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold">
            <Coins className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>฿{money.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-blue-50 text-blue-800 px-2.5 py-1 rounded-lg border border-blue-200 font-bold">
            <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>{ownedTiles.length}/{totalBuyable} ที่ดิน</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-purple-50 text-purple-800 px-2.5 py-1 rounded-lg border border-purple-200 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span className="max-w-[130px] truncate">{currentLandingTile.name}</span>
          </div>
        </div>

        {/* ปุ่มเริ่มใหม่ */}
        <button
          onClick={handleReset}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition cursor-pointer"
          title="เริ่มเกมใหม่"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>เริ่มใหม่</span>
        </button>
      </div>

      {/* กระดานเกม 11x11 คำนวณความสูงให้ฟิต 1 หน้าจอ */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div
          style={{
            height: 'min(calc(100vh - 165px), calc(100vw - 320px), 740px)',
            width: 'min(calc(100vh - 165px), calc(100vw - 320px), 740px)',
          }}
          className="bg-emerald-950 p-1 sm:p-1.5 rounded-2xl shadow-xl border-4 border-amber-600 grid grid-cols-11 grid-rows-11 gap-0.5 sm:gap-1 relative aspect-square"
        >
          {/* เรนเดอร์ 40 ช่องรอบกระดาน 11x11 */}
          {INITIAL_TILES.map((tile) => {
            const isPlayerHere = playerPos === tile.id
            const isOwned = ownedTiles.includes(tile.id)
            const Icon = tile.icon
            const isCorner = [0, 10, 20, 30].includes(tile.id)

            return (
              <div
                key={tile.id}
                className={`${tile.gridPos} ${
                  isCorner ? 'bg-amber-100' : 'bg-amber-50'
                } rounded-xs sm:rounded-sm p-0.5 flex flex-col justify-between border transition-all relative overflow-hidden select-none ${
                  isPlayerHere
                    ? 'border-red-500 ring-2 sm:ring-3 ring-red-400/60 shadow-md scale-[1.05] z-30'
                    : isOwned
                    ? 'border-blue-500 bg-blue-50/70'
                    : 'border-amber-200/70'
                }`}
              >
                {/* แถบสีหัวมุมเมือง */}
                {tile.color && !isCorner && (
                  <div
                    className={`h-1 sm:h-1.5 w-full rounded-2xs ${tile.color} mb-0.5 shrink-0 flex items-center justify-end px-0.5`}
                  >
                    {isOwned && (
                      <span className="text-[6px] text-white font-black leading-none">✓</span>
                    )}
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

                {/* ตัวเดินของผู้เล่น */}
                {isPlayerHere && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500/25 backdrop-blur-[0.5px]">
                    <div className="bg-red-600 text-white p-0.5 rounded-full shadow-md animate-bounce">
                      <UserRound className="w-3 h-3 sm:w-4 sm:h-4 stroke-[2.5]" />
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* โซนตรงกลางกระดาน (Center Area: rows 2-10, cols 2-10 -> 9x9 พื้นที่ใหญ่) */}
          <div className="col-start-2 col-end-11 row-start-2 row-end-11 bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 rounded-xl p-3 sm:p-5 flex flex-col items-center justify-between text-white border-2 border-amber-500/40 shadow-inner">
            {/* โลโก้กลางกระดาน */}
            <div className="text-center pt-1">
              <span className="text-[9px] sm:text-[11px] uppercase tracking-widest text-amber-300/90 font-semibold">
                Project-T Classic Edition
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 drop-shadow-md">
                MONOPOLY
              </h2>
              <p className="text-[10px] text-emerald-200 hidden sm:block">
                กระดานเกมเศรษฐี 40 ช่อง • ซื้อที่ดิน • สร้างเมือง
              </p>
            </div>

            {/* ส่วนทอยลูกเต๋า 2 ลูก & ซื้อที่ดิน */}
            <div className="flex flex-col items-center gap-2.5 my-auto">
              <div className="flex items-center gap-3">
                {/* ลูกเต๋าคู่ (2 ลูก) */}
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

                {/* ปุ่มทอยเต๋า */}
                <button
                  onClick={handleRollDice}
                  disabled={isRolling}
                  className="flex items-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs sm:text-sm shadow-md hover:shadow-amber-500/30 transition transform active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Dices className={`w-4 h-4 ${isRolling ? 'animate-spin' : ''}`} />
                  <span>
                    {isRolling ? 'กำลังทอย...' : `ทอยเต๋า (${dice1 + dice2} แต้ม)`}
                  </span>
                </button>
              </div>

              {/* ปุ่มถามซื้อที่ดินเมื่อตกช่องที่ดินว่าง */}
              {canBuyCurrent && (
                <button
                  onClick={() => handleBuyProperty(currentLandingTile)}
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg shadow-md transition animate-pulse cursor-pointer flex items-center gap-1.5"
                >
                  <span>💰</span>
                  <span>
                    ซื้อ {currentLandingTile.name} (฿{currentLandingTile.price.toLocaleString()})
                  </span>
                </button>
              )}
            </div>

            {/* กล่องบันทึกประวัติการเล่นในกระดาน */}
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
