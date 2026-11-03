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
  Banknote,
  Wallet,
  ScrollText,
  Layers,
  ChevronRight,
  Trash2,
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

// ข้อมูลประเภทธนบัตร 4 มูลค่า (1000, 500, 100, 20)
const DENOMINATIONS = [
  {
    id: '1000',
    value: 1000,
    label: 'แบงก์ 1,000',
    thaiNum: '๑๐๐๐',
    thaiWord: 'หนึ่งพันบาท',
    bgGradient: 'from-amber-900 via-stone-850 to-amber-950',
    borderColor: 'border-amber-400/90',
    badgeBg: 'bg-amber-400/20 text-amber-200 border-amber-400/40',
    accentText: 'text-amber-300',
    foilColor: 'via-amber-300/30',
  },
  {
    id: '500',
    value: 500,
    label: 'แบงก์ 500',
    thaiNum: '๕๐๐',
    thaiWord: 'ห้าร้อยบาท',
    bgGradient: 'from-purple-950 via-purple-900 to-indigo-950',
    borderColor: 'border-purple-400/90',
    badgeBg: 'bg-purple-400/20 text-purple-200 border-purple-400/40',
    accentText: 'text-purple-300',
    foilColor: 'via-purple-300/30',
  },
  {
    id: '100',
    value: 100,
    label: 'แบงก์ 100',
    thaiNum: '๑๐๐',
    thaiWord: 'หนึ่งร้อยบาท',
    bgGradient: 'from-rose-950 via-red-900 to-rose-950',
    borderColor: 'border-rose-400/90',
    badgeBg: 'bg-rose-400/20 text-rose-200 border-rose-400/40',
    accentText: 'text-rose-300',
    foilColor: 'via-rose-300/30',
  },
  {
    id: '20',
    value: 20,
    label: 'แบงก์ 20',
    thaiNum: '๒๐',
    thaiWord: 'ยี่สิบบาท',
    bgGradient: 'from-emerald-950 via-teal-900 to-green-950',
    borderColor: 'border-emerald-400/90',
    badgeBg: 'bg-emerald-400/20 text-emerald-200 border-emerald-400/40',
    accentText: 'text-emerald-300',
    foilColor: 'via-emerald-300/30',
  },
]

// ฟังก์ชันกระจายจำนวนเงินเป็น ธนบัตร (1000, 500, 100, 20) และ เศษเหรียญ ให้สมจริงตามเกมเศรษฐี
function breakdownCash(total) {
  if (total <= 0) return { 1000: 0, 500: 0, 100: 0, 20: 0, coins: 0 }

  let remaining = total

  // คำนวณเศษเหรียญ
  let coins = 0
  if (remaining >= 1000) {
    coins = remaining % 100
    remaining -= coins
  } else {
    coins = remaining % 20
    remaining -= coins
  }

  let n20 = 0
  let n100 = 0
  let n500 = 0
  let n1000 = 0

  if (remaining >= 10000) {
    // สัดส่วนเริ่มต้นมาตรฐาน (เช่น ฿20,000) จะมีครบทุกใบ: แบงก์ 20, 100, 500 และ 1000
    n20 = 20
    remaining -= n20 * 20

    n100 = 15
    remaining -= n100 * 100

    n500 = 8
    remaining -= n500 * 500

    n1000 = Math.floor(remaining / 1000)
    remaining -= n1000 * 1000
  } else if (remaining >= 4000) {
    n20 = 10
    remaining -= n20 * 20

    n100 = 8
    remaining -= n100 * 100

    n500 = 4
    remaining -= n500 * 500

    n1000 = Math.floor(remaining / 1000)
    remaining -= n1000 * 1000
  } else if (remaining >= 1500) {
    n20 = 8
    remaining -= n20 * 20

    n100 = 5
    remaining -= n100 * 100

    n500 = 2
    remaining -= n500 * 500

    n1000 = Math.floor(remaining / 1000)
    remaining -= n1000 * 1000
  } else {
    n1000 = Math.floor(remaining / 1000)
    remaining %= 1000

    n500 = Math.floor(remaining / 500)
    remaining %= 500

    n100 = Math.floor(remaining / 100)
    remaining %= 100

    n20 = Math.floor(remaining / 20)
    remaining %= 20
  }

  // ทอนส่วนที่เหลือลงตามลำดับ
  if (remaining >= 1000) {
    n1000 += Math.floor(remaining / 1000)
    remaining %= 1000
  }
  if (remaining >= 500) {
    n500 += Math.floor(remaining / 500)
    remaining %= 500
  }
  if (remaining >= 100) {
    n100 += Math.floor(remaining / 100)
    remaining %= 100
  }
  if (remaining >= 20) {
    n20 += Math.floor(remaining / 20)
    remaining %= 20
  }
  if (remaining > 0) {
    coins += remaining
    remaining = 0
  }

  return { 1000: n1000, 500: n500, 100: n100, 20: n20, coins }
}

// รายการการ์ดโอกาสและหีบสมบัติ (Chance & Community Chest Cards)
const CHANCE_CARDS = [
  {
    id: 1,
    title: 'เงินปันผลหุ้น',
    desc: 'ตลาดหุ้นคึกคัก! ได้รับเงินปันผลจากกองทุนรวม',
    amount: 1500,
    icon: '📈',
  },
  {
    id: 2,
    title: 'ถูกหวยรางวัลเลขท้าย',
    desc: 'สลากกินแบ่งรัฐบาลถูกรางวัลเลขท้าย 2 ตัว',
    amount: 2000,
    icon: '🎉',
  },
  {
    id: 3,
    title: 'รางวัลผู้ประกอบการ',
    desc: 'ธุรกิจของคุณได้รับรางวัลผู้ประกอบการดาวรุ่งแห่งปี',
    amount: 1200,
    icon: '🏆',
  },
  {
    id: 4,
    title: 'ได้คืนภาษีประจำปี',
    desc: 'ยื่นภาษีถูกต้อง ได้รับเงินคืนภาษีจากกรมสรรพากร',
    amount: 1000,
    icon: '💰',
  },
  {
    id: 5,
    title: 'โบนัสพิเศษปลายปี',
    desc: 'ผลงานโดดเด่น บริษัทจ่ายเงินโบนัสพิเศษก้อนโต',
    amount: 2500,
    icon: '🎁',
  },
  {
    id: 6,
    title: 'ซ่อมแซมอาคารและบ้านพัก',
    desc: 'ท่อน้ำแตกและหลังคารั่ว ต้องจ่ายค่าซ่อมแซมด่วน',
    amount: -800,
    icon: '🛠️',
  },
  {
    id: 7,
    title: 'ค่ารักษาพยาบาลฉุกเฉิน',
    desc: 'เข้าโรงพยาบาลกระทันหันจากอาหารเป็นพิษ',
    amount: -1000,
    icon: '🏥',
  },
  {
    id: 8,
    title: 'ใบสั่งขับรถเร็วเกินกำหนด',
    desc: 'กล้องจับความเร็วบนทางด่วนตรวจพบ โดนใบสั่งค่าปรับ',
    amount: -500,
    icon: '🚔',
  },
  {
    id: 9,
    title: 'จัดงานเลี้ยงฉลองวันเกิด',
    desc: 'เปิดโต๊ะเลี้ยงเพื่อนๆ ฉลองวันเกิดอย่างหรูหรา',
    amount: -1200,
    icon: '🎂',
  },
  {
    id: 10,
    title: 'โทรศัพท์เครื่องใหม่ตกน้ำ',
    desc: 'ทำสมาร์ตโฟนตกน้ำ ประกันไม่คุ้มครอง ต้องซื้อเครื่องใหม่',
    amount: -1500,
    icon: '📱',
  },
]

// คอมโพเนนต์แสดงแผงคลังธนบัตรและโฉนดที่ดิน (ใช้สำหรับทั้งผู้เล่นและบอท AI)
function AssetsPanel({
  ownerType,
  data,
  propertyLevels,
  getTileRent,
  hoveredTileId,
  setHoveredTileId,
  className = '',
}) {
  const isPlayer = ownerType === 'player'
  const cashBreakdown = breakdownCash(data.money)
  const ownedTiles = INITIAL_TILES.filter((tile) => data.owned.includes(tile.id))

  return (
    <div
      className={`w-full lg:w-72 xl:w-80 shrink-0 bg-white rounded-2xl border border-gray-200 shadow-xs p-3 sm:p-3.5 flex flex-col gap-2.5 h-full max-h-[calc(100vh-150px)] overflow-hidden ${className}`}
    >
      {/* ส่วนหัวการเงิน & โฉนด */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2 shrink-0">
        <div className="flex items-center gap-1.5 text-xs font-black text-gray-800">
          <div
            className={`w-5 h-5 rounded-md flex items-center justify-center ${
              isPlayer ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
            }`}
          >
            {isPlayer ? (
              <UserRound className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : (
              <Bot className="w-3.5 h-3.5 stroke-[2.5]" />
            )}
          </div>
          <span>{isPlayer ? 'เงิน & โฉนดของคุณ' : 'เงิน & โฉนดของบอท AI'}</span>
        </div>

        <span
          className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
            isPlayer
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-blue-50 text-blue-700 border-blue-200'
          }`}
        >
          {isPlayer ? '🔴 คุณ' : '🤖 บอท'}
        </span>
      </div>

      {/* 1. กล่องคลังธนบัตร (Banknotes Stack) */}
      <div className="shrink-0 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <span className="flex items-center gap-1.5 text-gray-800 font-black">
            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
            <span>คลังธนบัตร</span>
          </span>
          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-mono">
            ฿{data.money.toLocaleString()}
          </span>
        </div>

        {/* รายการธนบัตรเรียงลงมาตามลำดับ (1000 -> 500 -> 100 -> 20 -> เหรียญ) */}
        <div className="flex flex-col gap-1 w-full">
          {DENOMINATIONS.map((denom) => {
            const count = cashBreakdown[denom.value] || 0
            const subtotal = count * denom.value

            return (
              <div
                key={denom.id}
                className={`w-full bg-gradient-to-r ${denom.bgGradient} rounded-lg px-2.5 py-1.5 border ${denom.borderColor} shadow-2xs text-white flex items-center justify-between transition-all duration-150 hover:scale-[1.015] hover:shadow-xs select-none relative overflow-hidden`}
              >
                {/* แถบเงาโฮโลแกรม */}
                <div
                  className={`absolute top-0 right-14 w-2.5 h-full bg-gradient-to-r from-transparent ${denom.foilColor} to-transparent skew-x-12 pointer-events-none opacity-30`}
                />

                {/* ฝั่งซ้าย: เลขไทย + มูลค่าแบงก์ */}
                <div className="flex items-center gap-2 z-10">
                  <span
                    className={`w-6 h-6 rounded-md flex items-center justify-center font-black text-[10px] border ${denom.badgeBg} shadow-inner shrink-0`}
                  >
                    {denom.thaiNum}
                  </span>
                  <div className="text-left leading-tight">
                    <div className="flex items-center gap-1">
                      <span className={`text-xs font-mono font-black ${denom.accentText}`}>
                        ฿{denom.value.toLocaleString()}
                      </span>
                      <span className="text-[9px] text-white/70">
                        ({denom.thaiWord})
                      </span>
                    </div>
                  </div>
                </div>

                {/* ฝั่งขวา: จำนวนใบ + ยอดรวม */}
                <div className="flex items-center gap-2 z-10 text-right">
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[9px] font-black border ${denom.badgeBg}`}
                  >
                    {count} ใบ
                  </span>
                  <span className="text-xs font-mono font-bold text-white min-w-[55px]">
                    ฿{subtotal.toLocaleString()}
                  </span>
                </div>
              </div>
            )
          })}

          {/* แถวเหรียญกษาปณ์ */}
          <div className="w-full bg-gradient-to-r from-amber-800 via-yellow-800 to-amber-900 rounded-lg px-2.5 py-1.5 border border-yellow-400/80 shadow-2xs text-white flex items-center justify-between transition-all duration-150 hover:scale-[1.015] hover:shadow-xs select-none relative overflow-hidden">
            <div className="flex items-center gap-2 z-10">
              <div className="w-6 h-6 rounded-full border border-yellow-300/80 bg-gradient-to-br from-yellow-300 to-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-inner shrink-0">
                ฿
              </div>
              <div className="text-left leading-tight">
                <span className="text-xs font-bold text-yellow-200">
                  เหรียญกษาปณ์
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 z-10 text-right">
              <span className="px-1.5 py-0.2 rounded-md text-[9px] font-black border bg-yellow-400/20 text-yellow-200 border-yellow-400/40">
                เศษเหรียญ
              </span>
              <span className="text-xs font-mono font-bold text-yellow-100 min-w-[55px]">
                ฿{cashBreakdown.coins}
              </span>
            </div>
          </div>
        </div>

        {/* แถบสรุปจำนวนธนบัตรทั้งหมด */}
        <div className="bg-amber-50/80 rounded-lg px-2.5 py-1 border border-amber-200/90 text-[10px] flex items-center justify-between font-bold text-amber-950">
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3 text-amber-700" />
            <span>ธนบัตรทั้งหมด:</span>
          </span>
          <span className="font-black text-amber-800 font-mono">
            {cashBreakdown[1000] + cashBreakdown[500] + cashBreakdown[100] + cashBreakdown[20]} ใบ (+ ฿{cashBreakdown.coins})
          </span>
        </div>
      </div>

      {/* 2. รายการโฉนดที่ดินในครอบครอง (พร้อมเอฟเฟกต์เมาส์ชี้แล้วเด้งดึ๋ง) */}
      <div className="flex-1 flex flex-col min-h-0 pt-1 border-t border-gray-100">
        <div className="flex items-center justify-between mb-1.5 shrink-0">
          <span className="text-xs font-black text-gray-800 flex items-center gap-1">
            <Building2 className={`w-3.5 h-3.5 ${isPlayer ? 'text-amber-600' : 'text-blue-600'}`} />
            <span>โฉนดที่ดิน ({ownedTiles.length} แปลง)</span>
          </span>
          <span className="text-[10px] text-gray-400">
            ชี้เมาส์เพื่อดู
          </span>
        </div>

        {/* รายการโฉนด เลื่อนขึ้นลงได้ */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300">
          {ownedTiles.length === 0 ? (
            <div className="py-6 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <Building2 className="w-6 h-6 mx-auto mb-1 text-gray-300" />
              <p className="text-xs font-bold text-gray-500">ยังไม่มีโฉนดที่ดิน</p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {isPlayer
                  ? 'เดินตกที่ดินว่างแล้วกดซื้อเพื่อเริ่มสะสม!'
                  : 'บอทยังไม่ได้ครอบครองที่ดินแปลงใด'}
              </p>
            </div>
          ) : (
            ownedTiles.map((tile) => (
              <div
                key={tile.id}
                onMouseEnter={() => setHoveredTileId(tile.id)}
                onMouseLeave={() => setHoveredTileId(null)}
                className={`bg-white rounded-xl border-2 shadow-2xs hover:shadow-xl p-2.5 transition-all duration-200 transform hover:-translate-y-2 hover:scale-[1.03] hover:z-20 cursor-pointer relative overflow-hidden group ${
                  isPlayer
                    ? 'border-gray-200 hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40'
                    : 'border-gray-200 hover:border-blue-400 hover:ring-2 hover:ring-blue-300/40'
                }`}
              >
                {/* แถบสีหัวโฉนด */}
                <div
                  className={`h-2.5 w-full rounded-md ${tile.color} mb-2 px-1.5 flex items-center justify-between`}
                >
                  <span className="text-[7.5px] font-black text-white uppercase tracking-wider">
                    โฉนดที่ดิน
                  </span>
                  <span className="text-[7.5px] text-white font-bold">
                    {(propertyLevels[tile.id] || 1) === 1
                      ? 'ขั้น 1 (ที่ดิน)'
                      : (propertyLevels[tile.id] || 1) === 2
                      ? '⭐⭐ ขั้น 2 (บ้าน)'
                      : '⭐⭐⭐ ขั้น 3 (ตึกสูงสุด)'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-gray-800 group-hover:text-amber-800 transition-colors">
                    {tile.name}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200 font-mono">
                    ฿{tile.price.toLocaleString()}
                  </span>
                </div>

                <div className="mt-1.5 pt-1 border-t border-gray-100 flex items-center justify-between text-[10px]">
                  <span className="text-gray-500">
                    ระดับ: <b className="text-amber-700">ขั้น {propertyLevels[tile.id] || 1}/3</b>
                  </span>
                  <span className="font-black text-rose-600 font-mono">
                    ค่าเช่า ฿{getTileRent(tile.id).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

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

  // การ์ดโอกาสใบสุดท้ายที่ถูกจั่ว (จะวางข้างๆ กองการ์ดคว่ำ)
  const [lastDrawnCard, setLastDrawnCard] = useState(null)

  // แท็บสำหรับมือถือ/จอเล็ก: 'player' | 'board' | 'bot'
  const [mobileView, setMobileView] = useState('board')

  // ไฮไลต์ช่องบนกระดานเมื่อเอาเมาส์ไปชี้ที่โฉนด
  const [hoveredTileId, setHoveredTileId] = useState(null)

  // ลูกเต๋าคู่
  const [dice1, setDice1] = useState(1)
  const [dice2, setDice2] = useState(1)
  const [isRolling, setIsRolling] = useState(false)
  const [isMoving, setIsMoving] = useState(false)

  // ป้องกันการกดทอยเต๋าซ้ำหลังเดินเสร็จ (จะปลดล็อกเมื่อถึงตาใหม่ หรือได้สิทธิ์ทอยต่อจากดับเบิ้ล)
  const [hasRolled, setHasRolled] = useState(false)

  // สถานะดับเบิ้ล: เมื่อทอยได้เลขคู่ มีโอกาส 50% ได้ทอยต่ออีกรอบ
  const [isDoubleRoll, setIsDoubleRoll] = useState(false)

  // ระดับการอัปเกรดที่ดินแต่ละช่อง { [tileId]: 1 | 2 | 3 } (เมื่อซื้อเริ่มที่ขั้น 1)
  const [propertyLevels, setPropertyLevels] = useState({})

  // ข้อมูลช่องที่ดินของตัวเองที่สามารถอัปเกรดได้ในตานี้
  const [canUpgradeTile, setCanUpgradeTile] = useState(null)

  // คำนวณค่าเช่าตามระดับการอัปเกรด (ขั้น 1: ค่าเช่าปกติ, ขั้น 2: +500, ขั้น 3: +1,500)
  const getTileRent = (tileId, explicitLevel = null) => {
    const tile = INITIAL_TILES[tileId]
    if (!tile || !tile.rent) return 0
    const level = explicitLevel !== null ? explicitLevel : (propertyLevels[tileId] || 1)
    if (level === 2) return tile.rent + 500
    if (level >= 3) return tile.rent + 1500
    return tile.rent
  }

  // จบตาของผู้เล่น หรือให้ทอยต่อหากติดดับเบิ้ล
  const endPlayerTurnOrDouble = (doubleFlag, delay = 1000) => {
    if (doubleFlag) {
      setTimeout(() => {
        setHasRolled(false)
        addLog('🎲 ถึงตาทอยพิเศษดับเบิ้ลของคุณ! กดปุ่มทอยต่อได้เลย')
      }, delay)
    } else {
      setTimeout(() => {
        setTurn('bot')
      }, delay)
    }
  }

  // จบตาของบอท หรือให้บอทเดินต่อหากติดดับเบิ้ล
  const endBotTurn = (doubleFlag, delay = 1000) => {
    if (doubleFlag) {
      setTimeout(() => {
        botRollAndMove()
      }, delay)
    } else {
      setTimeout(() => {
        setTurn('player')
        setHasRolled(false)
        setIsDoubleRoll(false)
      }, delay)
    }
  }

  // ประวัติการเล่น (เก็บบันทึกยาวขึ้นสูงสุด 50 รายการ)
  const [logs, setLogs] = useState([])

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    const text = typeof msg === 'string' ? msg : msg?.text || String(msg)
    setLogs((prev) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        text,
        time,
      },
      ...prev.slice(0, 49),
    ])
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

        const isPair = d1 === d2
        const botDouble = isPair && Math.random() < 0.5
        if (botDouble) {
          addLog(`🤖 บอททอยได้ดับเบิ้ล (${d1} - ${d2})! ได้สิทธิ์เดินต่อ`)
        }

        animateWalking(d1 + d2, 'bot', botDouble)
      }
    }, 70)
  }

  // ================= 3. ผู้เล่นทอยเต๋า =================
  const handlePlayerRoll = () => {
    if (isRolling || isMoving || turn !== 'player' || hasRolled) return
    setIsRolling(true)
    setHasRolled(true)
    setCanUpgradeTile(null)

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

        // ถ้าทอยได้เลขคู่ (แต้มเท่ากัน) มีโอกาส 50% ที่จะติดดับเบิ้ล
        const isPair = d1 === d2
        const doubleSuccess = isPair && Math.random() < 0.5
        if (doubleSuccess) {
          setIsDoubleRoll(true)
          addLog(`🎉 ดับเบิ้ล! แต้มออกคู่ (${d1} - ${d2}) ติดโอกาส 50% คุณได้สิทธิ์ทอยเต๋าอีกครั้ง!`)
        } else {
          setIsDoubleRoll(false)
          if (isPair) {
            addLog(`🎲 แต้มออกคู่ (${d1} - ${d2}) แต่ไม่ติดโบนัสดับเบิ้ล (โอกาส 50%)`)
          }
        }

        animateWalking(d1 + d2, 'player', doubleSuccess)
      }
    }, 70)
  }

  // ================= 4. อนิเมชันเดินทีละช่อง =================
  const animateWalking = (totalSteps, actor, doubleFlag = false) => {
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
        handleLanding(currentPos, actor, doubleFlag)
      }
    }, 200)
  }

  // ================= 5. ตรวจสอบเหตุการณ์ช่องปลายทาง =================
  const handleLanding = (finalPos, actor, doubleFlag = false) => {
    const tile = INITIAL_TILES[finalPos]
    const isPlayer = actor === 'player'

    if (tile.type === 'tax') {
      if (isPlayer) {
        setPlayer((p) => ({ ...p, money: Math.max(0, p.money - tile.price) }))
        addLog(`💸 คุณเสียภาษี ฿${tile.price.toLocaleString()}`)
        endPlayerTurnOrDouble(doubleFlag, 1000)
      } else {
        setBot((b) => ({ ...b, money: Math.max(0, b.money - tile.price) }))
        addLog(`💸 บอทเสียภาษี ฿${tile.price.toLocaleString()}`)
        endBotTurn(doubleFlag, 1000)
      }
      return
    }

    if (tile.type === 'gotojail') {
      addLog(`🚨 ${isPlayer ? 'คุณ' : 'บอท'} โดนตำรวจจับส่งเข้าเรือนจำ!`)
      if (isPlayer) {
        setIsDoubleRoll(false)
        setTimeout(() => {
          setPlayer((p) => ({ ...p, pos: 10 }))
          setTurn('bot')
        }, 800)
      } else {
        setTimeout(() => {
          setBot((b) => ({ ...b, pos: 10 }))
          setTurn('player')
          setHasRolled(false)
        }, 800)
      }
      return
    }

    if (tile.type === 'chance') {
      const randomCard = CHANCE_CARDS[Math.floor(Math.random() * CHANCE_CARDS.length)]
      const drawnInfo = {
        ...randomCard,
        actor,
        tileName: tile.name,
        drawnAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      }
      setLastDrawnCard(drawnInfo)

      if (isPlayer) {
        setPlayer((p) => ({ ...p, money: Math.max(0, p.money + randomCard.amount) }))
        if (randomCard.amount >= 0) {
          addLog(`🎴 คุณเปิดการ์ด "${randomCard.title}": ${randomCard.desc} (ได้รับ +฿${randomCard.amount.toLocaleString()})`)
        } else {
          addLog(`🎴 คุณเปิดการ์ด "${randomCard.title}": ${randomCard.desc} (เสีย ฿${Math.abs(randomCard.amount).toLocaleString()})`)
        }
        endPlayerTurnOrDouble(doubleFlag, 1200)
      } else {
        setBot((b) => ({ ...b, money: Math.max(0, b.money + randomCard.amount) }))
        if (randomCard.amount >= 0) {
          addLog(`🎴 บอทเปิดการ์ด "${randomCard.title}": ${randomCard.desc} (ได้ +฿${randomCard.amount.toLocaleString()})`)
        } else {
          addLog(`🎴 บอทเปิดการ์ด "${randomCard.title}": ${randomCard.desc} (เสีย ฿${Math.abs(randomCard.amount).toLocaleString()})`)
        }
        endBotTurn(doubleFlag, 1200)
      }
      return
    }

    if (['property', 'transport', 'utility'].includes(tile.type)) {
      const isPlayerOwned = player.owned.includes(tile.id)
      const isBotOwned = bot.owned.includes(tile.id)

      if (isPlayer) {
        if (isBotOwned) {
          const rent = getTileRent(tile.id)
          const lvl = propertyLevels[tile.id] || 1
          setPlayer((p) => ({ ...p, money: Math.max(0, p.money - rent) }))
          setBot((b) => ({ ...b, money: b.money + rent }))
          addLog(`💸 คุณตกที่ดินบอท (${tile.name} ขั้น ${lvl}) จ่ายค่าเช่า ฿${rent.toLocaleString()}`)
          endPlayerTurnOrDouble(doubleFlag, 1000)
        } else if (isPlayerOwned) {
          // ตกที่ดินตัวเอง: อัปเกรดได้สูงสุด 3 ขั้น
          const currentLvl = propertyLevels[tile.id] || 1
          if (currentLvl < 3) {
            addLog(`🏰 คุณตกที่ดินของตัวเอง "${tile.name}" (ขั้น ${currentLvl}/3) สามารถอัปเกรดได้!`)
            setCanUpgradeTile(tile)
            return // รอผู้เล่นตัดสินใจ อัปเกรด หรือ ข้าม
          } else {
            addLog(`🏰 คุณตกที่ดินของตัวเอง "${tile.name}" (ระดับสูงสุด ขั้น 3 แล้ว!)`)
            endPlayerTurnOrDouble(doubleFlag, 1000)
          }
        } else {
          // ที่ดินว่าง: รอผู้เล่นตัดสินใจ ซื้อ หรือ ข้าม
          addLog(`🏙️ คุณตกที่ดินว่าง: ${tile.name} (ราคา ฿${tile.price.toLocaleString()})`)
          return
        }
      } else {
        // ตาของบอท AI
        if (isPlayerOwned) {
          const rent = getTileRent(tile.id)
          const lvl = propertyLevels[tile.id] || 1
          setBot((b) => ({ ...b, money: Math.max(0, b.money - rent) }))
          setPlayer((p) => ({ ...p, money: p.money + rent }))
          addLog(`💰 บอทตกที่ดินของคุณ (${tile.name} ขั้น ${lvl}) จ่ายค่าเช่าให้คุณ ฿${rent.toLocaleString()}!`)
          endBotTurn(doubleFlag, 1000)
        } else if (isBotOwned) {
          // บอทตกที่ดินตัวเอง: พิจารณาอัปเกรด
          const bLvl = propertyLevels[tile.id] || 1
          if (bLvl < 3) {
            const upgradeCost = bLvl === 1 ? 700 : 1300
            if (bot.money >= upgradeCost + 2500) {
              setBot((b) => ({ ...b, money: b.money - upgradeCost }))
              setPropertyLevels((prev) => ({ ...prev, [tile.id]: bLvl + 1 }))
              const newRent = getTileRent(tile.id, bLvl + 1)
              addLog(`🤖 บอทอัปเกรด "${tile.name}" เป็นขั้น ${bLvl + 1}! (ค่าเช่าใหม่ ฿${newRent.toLocaleString()})`)
            } else {
              addLog(`🤖 บอทตกที่ดินตัวเอง "${tile.name}" แต่เก็บเงินไว้`)
            }
          } else {
            addLog(`🤖 บอทตกที่ดินตัวเอง "${tile.name}" (ขั้น 3 สูงสุดแล้ว)`)
          }
          endBotTurn(doubleFlag, 1000)
        } else {
          // ที่ดินว่าง: บอทพิจารณาซื้อ
          if (bot.money >= tile.price + 2500) {
            setBot((b) => ({
              ...b,
              money: b.money - tile.price,
              owned: [...b.owned, tile.id],
            }))
            setPropertyLevels((prev) => ({ ...prev, [tile.id]: 1 }))
            addLog(`🤖 บอทตัดสินใจซื้อที่ดิน "${tile.name}" ราคา ฿${tile.price.toLocaleString()} (ขั้น 1)`)
          } else {
            addLog(`🤖 บอทตัดสินใจไม่ซื้อ ${tile.name} (เก็บเงินไว้)`)
          }
          endBotTurn(doubleFlag, 1000)
        }
      }
      return
    }

    // ช่องอื่นๆ (เช่น จุดเริ่มต้น, เกาะพักผ่อน)
    if (isPlayer) {
      endPlayerTurnOrDouble(doubleFlag, 1000)
    } else {
      endBotTurn(doubleFlag, 1000)
    }
  }

  // ผู้เล่นซื้อที่ดิน (เริ่มต้นที่ขั้น 1)
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
    setPropertyLevels((prev) => ({ ...prev, [tile.id]: 1 }))
    addLog(`🎉 คุณได้ซื้อที่ดิน "${tile.name}" ราคา ฿${tile.price.toLocaleString()} (ขั้น 1)`)
    endPlayerTurnOrDouble(isDoubleRoll, 1000)
  }

  // ผู้เล่นข้ามไม่ซื้อที่ดิน
  const handlePlayerSkipBuy = () => {
    addLog(`คุณเลือกไม่ซื้อที่ดิน "${currentTile.name}"`)
    endPlayerTurnOrDouble(isDoubleRoll, 500)
  }

  // ผู้เล่นอัปเกรดที่ดินของตัวเอง (ขั้น 1 -> 2 จ่าย 700 ค่าเช่า +500, ขั้น 2 -> 3 จ่าย 1300 ค่าเช่า +1000)
  const handlePlayerUpgrade = (tile) => {
    const currentLvl = propertyLevels[tile.id] || 1
    const upgradeCost = currentLvl === 1 ? 700 : 1300
    if (player.money < upgradeCost) {
      alert('ยอดเงินไม่เพียงพอสำหรับการอัปเกรดที่ดินนี้!')
      return
    }
    const nextLvl = currentLvl + 1
    setPlayer((p) => ({
      ...p,
      money: p.money - upgradeCost,
    }))
    setPropertyLevels((prev) => ({
      ...prev,
      [tile.id]: nextLvl,
    }))
    const newRent = getTileRent(tile.id, nextLvl)
    addLog(`🏗️ คุณอัปเกรด "${tile.name}" เป็นขั้น ${nextLvl}! ค่าเช่าใหม่คือ ฿${newRent.toLocaleString()}`)
    setCanUpgradeTile(null)
    endPlayerTurnOrDouble(isDoubleRoll, 1000)
  }

  // ผู้เล่นข้ามไม่อัปเกรดที่ดิน
  const handlePlayerSkipUpgrade = () => {
    addLog(`คุณเลือกไม่อัปเกรด "${canUpgradeTile?.name}"`)
    setCanUpgradeTile(null)
    endPlayerTurnOrDouble(isDoubleRoll, 500)
  }

  // รีเซ็ตเริ่มเกมใหม่ (กลับไปหน้าเริ่มต้นถามว่าจะเล่นไหม)
  const handleReset = () => {
    setPlayer({ pos: 0, money: 20000, owned: [] })
    setBot({ pos: 0, money: 20000, owned: [] })
    setPropertyLevels({})
    setHasRolled(false)
    setIsDoubleRoll(false)
    setCanUpgradeTile(null)
    setLastDrawnCard(null)
    setDice1(1)
    setDice2(1)
    setIsRolling(false)
    setIsMoving(false)
    setLogs([])
    setHoveredTileId(null)
    setMobileView('board')
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
            เข้าสู่เกมกระดาน 11 × 11 (40 ช่อง) พร้อมคลังธนบัตร โฉนดที่ดิน และดวลสร้างเมืองกับบอท AI!
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
              <p className="font-bold text-xs text-emerald-900">โฉนด & ธนบัตร</p>
              <p className="text-[10px] text-emerald-700">สะสมที่ดินเก็บค่าเช่า</p>
            </div>
          </div>

          {/* 2 ปุ่ม: เริ่มเล่นเกมเศรษฐี vs กลับหน้าแรก */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {setCurrentPage && (
              <button
                onClick={() => setCurrentPage('home')}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer order-2 sm:order-1"
              >
                <Home className="w-4 h-4 text-gray-500" />
                <span>กลับหน้าแรก</span>
              </button>
            )}

            <button
              onClick={() => setGamePhase('rps')}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer order-1 sm:order-2"
            >
              <span>🎲 เริ่มเล่นเกมเศรษฐี!</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* ทางเลือก: สลับไปเล่นเกมที่ 2 (เกมแวร์วูล์ฟ) */}
          {setCurrentPage && (
            <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl text-left">
              <div>
                <p className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <span>🐺</span>
                  <span>เกมใหม่: เกมแวร์วูล์ฟ (Werewolf)</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  ค้นหาความจริงและจับหมาป่าในคืนพระจันทร์เต็มดวง
                </p>
              </div>
              <button
                onClick={() => setCurrentPage('werewolf')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition shrink-0 cursor-pointer"
              >
                สลับไปเล่นเกมแวร์วูล์ฟ →
              </button>
            </div>
          )}
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

      {/* แถบสลับมุมมองสำหรับหน้าจอมือถือ/แท็บเล็ตเล็ก (< lg) */}
      <div className="flex lg:hidden items-center justify-center gap-1.5 mb-2 shrink-0">
        <button
          onClick={() => setMobileView('player')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
            mobileView === 'player'
              ? 'bg-red-500 text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          🔴 คุณ (เงิน & โฉนด)
        </button>
        <button
          onClick={() => setMobileView('board')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
            mobileView === 'board'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          🎲 กระดาน
        </button>
        <button
          onClick={() => setMobileView('bot')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
            mobileView === 'bot'
              ? 'bg-blue-500 text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          🤖 บอท (เงิน & โฉนด)
        </button>
      </div>

      {/* ================= MAIN CONTAINER: 3 COLUMNS (LEFT: PLAYER, CENTER: BOARD & LOG, RIGHT: BOT AI) ================= */}
      <div className="flex-1 flex flex-col lg:flex-row items-stretch justify-center gap-3 min-h-0 overflow-hidden">
        {/* ================= ฝั่งซ้าย (LEFT PANEL): ผู้เล่น (คุณ) ================= */}
        <AssetsPanel
          ownerType="player"
          data={player}
          propertyLevels={propertyLevels}
          getTileRent={getTileRent}
          hoveredTileId={hoveredTileId}
          setHoveredTileId={setHoveredTileId}
          className={mobileView === 'player' ? 'flex' : 'hidden lg:flex'}
        />

        {/* ================= ตรงกลาง (CENTER PANEL): กระดานเกมเศรษฐี 11x11 ================= */}
        <div
          className={`${
            mobileView === 'board' ? 'flex' : 'hidden'
          } lg:flex flex-1 items-center justify-center min-h-0 min-w-0 h-full`}
        >
          <div
            className="bg-emerald-950 p-1 sm:p-1.5 rounded-2xl shadow-xl border-4 border-amber-600 grid grid-cols-11 grid-rows-11 gap-0.5 sm:gap-1 relative aspect-square w-full h-full max-h-[calc(100vh-150px)] max-w-[calc(100vh-150px)] shrink-0"
          >
            {/* เรนเดอร์ 40 ช่องรอบกระดาน */}
            {INITIAL_TILES.map((tile) => {
              const isPlayerHere = player.pos === tile.id
              const isBotHere = bot.pos === tile.id
              const isPlayerOwned = player.owned.includes(tile.id)
              const isBotOwned = bot.owned.includes(tile.id)
              const isHoveredFromDeed = hoveredTileId === tile.id
              const Icon = tile.icon
              const isCorner = [0, 10, 20, 30].includes(tile.id)

              return (
                <div
                  key={tile.id}
                  className={`${tile.gridPos} ${
                    isCorner ? 'bg-amber-100' : 'bg-amber-50'
                  } rounded-xs sm:rounded-sm p-0.5 flex flex-col justify-between border transition-all duration-200 relative overflow-hidden select-none ${
                    isHoveredFromDeed
                      ? 'border-yellow-400 ring-4 ring-yellow-400 scale-105 z-30 shadow-xl'
                      : isPlayerHere || isBotHere
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
                        {isPlayerOwned
                          ? `🔴 คุณ ${(propertyLevels[tile.id] || 1) === 2 ? '⭐⭐' : (propertyLevels[tile.id] || 1) === 3 ? '⭐⭐⭐' : ''}`
                          : isBotOwned
                          ? `🤖 บอท ${(propertyLevels[tile.id] || 1) === 2 ? '⭐⭐' : (propertyLevels[tile.id] || 1) === 3 ? '⭐⭐⭐' : ''}`
                          : ''}
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
                      <p className="text-[6.5px] sm:text-[7.5px] text-emerald-700 font-bold leading-none mt-0.5 font-mono">
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
            <div className="col-start-2 col-end-11 row-start-2 row-end-11 bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 rounded-xl p-2 sm:p-3 flex flex-col items-center justify-between text-white border-2 border-amber-500/40 shadow-inner relative overflow-hidden">
              
              {/* 1. โลโก้กลางกระดาน และ ตัวบอกตาเดิน */}
              <div className="text-center pt-0.5 shrink-0">
                <span className="text-[8px] sm:text-[9.5px] uppercase tracking-widest text-amber-300/90 font-semibold">
                  Project-T vs BOT AI
                </span>
                <h2 className="text-base sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 drop-shadow-md leading-none">
                  MONOPOLY
                </h2>

                {/* ป้ายแสดงตาเดินปัจจุบัน */}
                <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9.5px] sm:text-[11px] font-bold bg-black/40 border border-white/20">
                  {turn === 'player' ? (
                    <span className="text-red-300 flex items-center gap-1.5 animate-pulse">
                      <UserRound className="w-3 h-3 text-red-400" />
                      <span>ตาของคุณ (กดทอยเต๋า)</span>
                    </span>
                  ) : (
                    <span className="text-blue-300 flex items-center gap-1.5 animate-pulse">
                      <Bot className="w-3 h-3 text-blue-400" />
                      <span>ตาของบอท AI (กำลังดำเนินการ...)</span>
                    </span>
                  )}
                </div>
              </div>

              {/* 2. โซนการ์ดโอกาส (Card Deck Area): กองการ์ดคว่ำ + การ์ดที่จั่วได้วางข้างๆ */}
              <div className="flex items-center justify-center gap-2 sm:gap-4 my-1 shrink-0">
                {/* กองการ์ดคว่ำ 3D Stack */}
                <div className="relative group select-none">
                  <div className="absolute inset-0 bg-amber-700/60 rounded-xl transform translate-x-1 translate-y-1" />
                  <div className="absolute inset-0 bg-amber-600/80 rounded-xl transform translate-x-0.5 translate-y-0.5" />
                  <div className="relative w-20 sm:w-26 h-20 sm:h-24 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 rounded-xl border-2 border-amber-400 p-1.5 flex flex-col items-center justify-between shadow-xl text-center">
                    <div className="w-full flex justify-between items-center text-[6.5px] sm:text-[7.5px] text-amber-300/80 font-bold uppercase tracking-wider">
                      <span>PROJECT-T</span>
                      <span>CHANCE</span>
                    </div>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 flex items-center justify-center font-black text-xs sm:text-sm shadow-inner border border-white/40">
                      ?
                    </div>
                    <div className="leading-tight">
                      <span className="text-[7.5px] sm:text-[8.5px] font-black text-amber-300 block">
                        กองการ์ดโอกาส
                      </span>
                      <span className="text-[6px] sm:text-[7px] text-white/60">
                        คว่ำไว้ (10 ใบ)
                      </span>
                    </div>
                  </div>
                </div>

                {/* สัญลักษณ์ลูกศรระหว่างกองการ์ดคว่ำกับการ์ดที่ถูกจั่ว */}
                <div className="text-amber-300/60 text-xs sm:text-sm font-black animate-pulse select-none">
                  ➔
                </div>

                {/* การ์ดที่ถูกจั่ว วางข้างๆ กองการ์ดคว่ำ */}
                {lastDrawnCard ? (
                  <div className="w-28 sm:w-36 h-20 sm:h-24 rounded-xl border-2 border-amber-300 bg-gradient-to-b from-amber-50 via-white to-amber-100 p-1.5 flex flex-col justify-between shadow-2xl text-gray-900 animate-in fade-in zoom-in-95 duration-200 select-none relative overflow-hidden">
                    {/* หัวการ์ด: ใครจั่ว + เวลา */}
                    <div className="flex items-center justify-between text-[7px] sm:text-[7.5px] font-black pb-0.5 border-b border-amber-200">
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-white font-bold ${
                          lastDrawnCard.actor === 'player' ? 'bg-red-600' : 'bg-blue-600'
                        }`}
                      >
                        {lastDrawnCard.actor === 'player' ? '🔴 คุณจั่วได้' : '🤖 บอทจั่วได้'}
                      </span>
                      <span className="text-gray-400 font-mono text-[6.5px]">{lastDrawnCard.drawnAt}</span>
                    </div>

                    {/* เนื้อหาการ์ด */}
                    <div className="text-center my-auto px-0.5">
                      <span className="text-sm sm:text-base block leading-none mb-0.5">{lastDrawnCard.icon}</span>
                      <h4 className="text-[8.5px] sm:text-[9.5px] font-black text-gray-900 leading-tight">
                        {lastDrawnCard.title}
                      </h4>
                      <p className="text-[6.5px] sm:text-[7.5px] text-gray-600 leading-tight line-clamp-2 mt-0.5">
                        {lastDrawnCard.desc}
                      </p>
                    </div>

                    {/* มูลค่าโบนัส/ค่าปรับ */}
                    <div className="text-center pt-0.5 border-t border-amber-200">
                      <span
                        className={`text-[8.5px] sm:text-[10px] font-black font-mono ${
                          lastDrawnCard.amount >= 0 ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {lastDrawnCard.amount >= 0
                          ? `+฿${lastDrawnCard.amount.toLocaleString()}`
                          : `-฿${Math.abs(lastDrawnCard.amount).toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-28 sm:w-36 h-20 sm:h-24 rounded-xl border-2 border-dashed border-white/20 bg-black/20 flex flex-col items-center justify-center p-1.5 text-center text-white/40">
                    <Layers className="w-4 h-4 mb-0.5 opacity-40" />
                    <span className="text-[7.5px] sm:text-[8.5px] font-bold">การ์ดที่ถูกจั่ว</span>
                    <span className="text-[6px] sm:text-[7px] opacity-70">จะวางข้างๆ เมื่อตกช่องการ์ด</span>
                  </div>
                )}
              </div>

              {/* 3. ส่วนลูกเต๋าและปุ่มตัดสินใจ (เขยิบทอยเต๋าขึ้นไปอีกนิด) */}
              <div className="flex flex-col items-center gap-1.5 w-full px-2 shrink-0">
                {/* ป้ายแจ้งเตือนเมื่อได้สิทธิ์ทอยดับเบิ้ล */}
                {isDoubleRoll && turn === 'player' && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-[9.5px] sm:text-[11px] rounded-full shadow-lg animate-bounce border-2 border-white">
                    <Sparkles className="w-3 h-3 animate-spin" />
                    <span>🎉 ดับเบิ้ล! คุณได้สิทธิ์ทอยเต๋าอีกครั้ง</span>
                  </div>
                )}

                {/* ลูกเต๋าคู่ & ปุ่มทอยเต๋า */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex gap-1.5">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 bg-white text-gray-900 rounded-xl flex items-center justify-center text-sm sm:text-lg font-black shadow-lg border-2 border-amber-300 transition-transform ${
                        isRolling ? 'rotate-180 scale-105' : ''
                      }`}
                    >
                      {dice1}
                    </div>
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 bg-white text-gray-900 rounded-xl flex items-center justify-center text-sm sm:text-lg font-black shadow-lg border-2 border-amber-300 transition-transform ${
                        isRolling ? '-rotate-180 scale-105' : ''
                      }`}
                    >
                      {dice2}
                    </div>
                  </div>

                  {/* ปุ่มทอยเต๋าของผู้เล่น (ปิดการกดทันทีเมื่อทอยเสร็จ หรือเมื่อไม่ใช่ตาของผู้เล่น) */}
                  <button
                    onClick={handlePlayerRoll}
                    disabled={isRolling || isMoving || turn !== 'player' || hasRolled}
                    className={`flex items-center gap-1.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl font-black text-xs sm:text-sm shadow-md transition transform active:scale-95 cursor-pointer ${
                      turn === 'player' && !hasRolled && !isRolling && !isMoving
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 hover:shadow-amber-500/30 ring-2 ring-amber-300/60'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <Dices className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRolling ? 'animate-spin' : ''}`} />
                    <span>
                      {isRolling
                        ? 'กำลังทอย...'
                        : isMoving
                        ? 'กำลังเดิน... 🏃'
                        : turn === 'player' && !hasRolled
                        ? isDoubleRoll
                          ? `ทอยพิเศษดับเบิ้ล! (${dice1 + dice2} แต้ม)`
                          : `ทอยเต๋า (${dice1 + dice2} แต้ม)`
                        : 'ตารอบอทเล่น...'}
                    </span>
                  </button>
                </div>
              </div>

              {/* 4. กล่องบันทึกเหตุการณ์ตรงกลางกระดาน (ข้างใต้ที่ทอยเต๋า) */}
              <div className="w-full max-w-sm sm:max-w-md bg-slate-950/80 backdrop-blur-md rounded-xl border border-white/20 p-2 sm:p-2.5 flex flex-col h-20 sm:h-24 shrink-0">
                <div className="flex items-center justify-between pb-1 mb-1 border-b border-white/10 shrink-0">
                  <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-black text-amber-300">
                    <ScrollText className="w-3 h-3 text-amber-400" />
                    <span>บันทึกเหตุการณ์ ({logs.length})</span>
                  </span>
                  {logs.length > 0 && (
                    <button
                      onClick={() => setLogs([])}
                      className="text-[8px] sm:text-[9px] text-white/50 hover:text-rose-400 flex items-center gap-0.5 cursor-pointer"
                      title="ล้างบันทึก"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                      <span>ล้าง</span>
                    </button>
                  )}
                </div>

                {/* รายการเหตุการณ์เลื่อนดูได้ */}
                <div className="flex-1 overflow-y-auto space-y-1 pr-1 min-h-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/30">
                  {logs.length === 0 ? (
                    <p className="text-[8px] sm:text-[8.5px] text-white/40 text-center py-2">
                      🎲 เริ่มทอยลูกเต๋าเพื่อบันทึกประวัติการเดินและการซื้อขาย
                    </p>
                  ) : (
                    logs.map((log, index) => {
                      const isLatest = index === 0
                      return (
                        <div
                          key={log.id || index}
                          className={`text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded flex items-center justify-between gap-1.5 ${
                            isLatest
                              ? 'bg-amber-400/20 text-amber-200 font-bold border border-amber-400/30'
                              : 'text-white/80 hover:bg-white/5'
                          }`}
                        >
                          <span className="truncate flex-1 text-left">{log.text}</span>
                          <span className="text-[7px] font-mono text-white/40 shrink-0">{log.time}</span>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* 5. ข้อความตำแหน่งปัจจุบัน */}
              <div className="text-center shrink-0">
                <span className="text-[7.5px] sm:text-[8.5px] text-emerald-300/70">
                  📍 ตำแหน่งปัจจุบันของคุณ: <b className="text-white">{currentTile.name}</b>
                </span>
              </div>

              {/* ================= MODAL: ปุ่มซื้อกับปุ่มข้ามขนาดใหญ่และเด่นชัด ================= */}
              {canPlayerBuy && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 z-40 rounded-xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex flex-col items-center gap-2.5 p-4 bg-slate-950/95 backdrop-blur-md rounded-2xl border-2 border-emerald-400/90 shadow-2xl max-w-xs sm:max-w-sm w-full text-center">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 mb-1">
                        <Sparkles className="w-3 h-3 text-emerald-400 animate-spin" />
                        <span>ที่ดินว่างพร้อมซื้อ!</span>
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-white">
                        ซื้อ "{currentTile.name}" หรือไม่?
                      </h3>
                      <p className="text-xs text-emerald-200/80 mt-0.5">
                        ราคา ฿{currentTile.price.toLocaleString()} • ค่าเช่า ฿{currentTile.rent.toLocaleString()}
                      </p>
                    </div>

                    {/* ปุ่มซื้อ และ ปุ่มข้าม ขยายใหญ่ชัดเจน */}
                    <div className="flex items-center gap-2.5 w-full justify-center mt-1">
                      <button
                        onClick={() => handlePlayerBuy(currentTile)}
                        className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-500/40 hover:scale-105 active:scale-95 transition cursor-pointer flex items-center justify-center gap-2 ring-2 ring-emerald-300/50"
                      >
                        <Building2 className="w-4 h-4 shrink-0" />
                        <span>ซื้อ ฿{currentTile.price.toLocaleString()}</span>
                      </button>

                      <button
                        onClick={handlePlayerSkipBuy}
                        className="py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-sm rounded-xl hover:scale-105 active:scale-95 transition cursor-pointer border border-slate-500 shrink-0"
                      >
                        ข้าม
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= MODAL: ปุ่มอัปเกรดที่ดินของตัวเอง (สูงสุด 3 ขั้น) ================= */}
              {canUpgradeTile && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 z-40 rounded-xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex flex-col items-center gap-2.5 p-4 bg-slate-950/95 backdrop-blur-md rounded-2xl border-2 border-amber-400/90 shadow-2xl max-w-xs sm:max-w-sm w-full text-center">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 mb-1">
                        <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                        <span>ตกที่ดินของตัวเอง!</span>
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-white">
                        อัปเกรด "{canUpgradeTile.name}" ขั้น {(propertyLevels[canUpgradeTile.id] || 1) + 1} / 3?
                      </h3>
                      <div className="mt-1 text-[11px] text-amber-200/90 space-y-0.5">
                        <p>
                          ราคาอัปเกรด: <b className="text-white font-mono">฿{((propertyLevels[canUpgradeTile.id] || 1) === 1 ? 700 : 1300).toLocaleString()}</b>
                        </p>
                        <p className="text-emerald-300">
                          ค่าเช่าเพิ่ม: <b>+{((propertyLevels[canUpgradeTile.id] || 1) === 1 ? 500 : 1000).toLocaleString()} บ.</b> (เป็น ฿{getTileRent(canUpgradeTile.id, (propertyLevels[canUpgradeTile.id] || 1) + 1).toLocaleString()})
                        </p>
                      </div>
                    </div>

                    {/* ปุ่มอัปเกรด และ ปุ่มข้าม */}
                    <div className="flex items-center gap-2.5 w-full justify-center mt-1">
                      <button
                        onClick={() => handlePlayerUpgrade(canUpgradeTile)}
                        disabled={player.money < ((propertyLevels[canUpgradeTile.id] || 1) === 1 ? 700 : 1300)}
                        className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                          player.money >= ((propertyLevels[canUpgradeTile.id] || 1) === 1 ? 700 : 1300)
                            ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-yellow-600 text-slate-950 shadow-amber-500/40 hover:scale-105 active:scale-95 ring-2 ring-amber-300/60'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <Building2 className="w-4 h-4 shrink-0" />
                        <span>
                          {player.money >= ((propertyLevels[canUpgradeTile.id] || 1) === 1 ? 700 : 1300)
                            ? `อัปเกรด (฿${((propertyLevels[canUpgradeTile.id] || 1) === 1 ? 700 : 1300).toLocaleString()})`
                            : 'เงินไม่พออัปเกรด'}
                        </span>
                      </button>

                      <button
                        onClick={handlePlayerSkipUpgrade}
                        className="py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs sm:text-sm rounded-xl hover:scale-105 active:scale-95 transition cursor-pointer border border-slate-500 shrink-0"
                      >
                        ข้าม
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= ฝั่งขวา (RIGHT PANEL): บอท AI ================= */}
        <AssetsPanel
          ownerType="bot"
          data={bot}
          propertyLevels={propertyLevels}
          getTileRent={getTileRent}
          hoveredTileId={hoveredTileId}
          setHoveredTileId={setHoveredTileId}
          className={mobileView === 'bot' ? 'flex' : 'hidden lg:flex'}
        />
      </div>
    </div>
  )
}

export default Game
