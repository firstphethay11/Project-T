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
  Plus,
  Minus,
  Users,
  Play,
  Settings,
  X,
  Zap,
} from 'lucide-react'

// สีหลัก 4 สีของ UNO
const COLORS = [
  { id: 'red', name: 'สีแดง', bg: 'bg-red-600', border: 'border-red-500', text: 'text-red-500', glow: 'shadow-red-500/50' },
  { id: 'blue', name: 'สีน้ำเงิน', bg: 'bg-blue-600', border: 'border-blue-500', text: 'text-blue-500', glow: 'shadow-blue-500/50' },
  { id: 'green', name: 'สีเขียว', bg: 'bg-emerald-600', border: 'border-emerald-500', text: 'text-emerald-500', glow: 'shadow-emerald-500/50' },
  { id: 'yellow', name: 'สีเหลือง', bg: 'bg-amber-400', border: 'border-amber-400', text: 'text-amber-500', glow: 'shadow-amber-400/50' },
]

// โปรไฟล์บอท 4 ตัว
const BOT_PROFILES = [
  { id: 'bot_1', name: 'บอทอเล็กซ์', avatar: '🤖', bgGradient: 'from-blue-600 to-indigo-700', badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/30' },
  { id: 'bot_2', name: 'บอทเอเลน่า', avatar: '🦊', bgGradient: 'from-purple-600 to-pink-700', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/30' },
  { id: 'bot_3', name: 'บอทจอห์น', avatar: '🦁', bgGradient: 'from-amber-600 to-orange-700', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30' },
  { id: 'bot_4', name: 'บอทซาร่า', avatar: '🐼', bgGradient: 'from-emerald-600 to-teal-700', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' },
]

// สร้างสำรับไพ่ UNO มาตรฐาน 108 ใบ
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

    // การ์ดแอ็กชันพิเศษ (+2, ข้าม Skip, ย้อนกลับ Reverse) สีละ 2 ชุด
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

function UnoGame({ setCurrentPage }) {
  // สถานะเฟสเกม: 'setup' (ตั้งค่าบอทก่อนเริ่ม) | 'playing' (กำลังเล่น)
  const [gamePhase, setGamePhase] = useState('setup')

  // จำนวนบอทคู่ต่อสู้: 1 ถึง 4 คน (ผลรวม 2 ถึง 5 คน)
  const [botCount, setBotCount] = useState(3)

  // ข้อมูลเกม
  const [deck, setDeck] = useState([])
  const [hands, setHands] = useState({}) // { player: Card[], bot_1: Card[], ... }
  const [discardPile, setDiscardPile] = useState([])
  const [currentColor, setCurrentColor] = useState('red')
  const [currentTurnId, setCurrentTurnId] = useState('player')
  const [direction, setDirection] = useState(1) // 1 = ตามเข็มนาฬิกา, -1 = ทวนเข็มนาฬิกา
  const [gameStatus, setGameStatus] = useState('playing') // 'playing' | 'game_over'
  // ลำดับการจบเกม (ตารางอันดับ Leaderboard):
  // [{ id, name, rank, isUser, avatar, isLoser }]
  const [finishedRankings, setFinishedRankings] = useState([])

  // การเลือกลงไพ่ (สามารถเลือกลงได้สูงสุด 2 ใบ)
  const [selectedCardIds, setSelectedCardIds] = useState([])

  // สถานะหน้าต่างเลือกสี Wild
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [pendingPlayCards, setPendingPlayCards] = useState(null)

  const [hasDrawnThisTurn, setHasDrawnThisTurn] = useState(false)
  const [unoShout, setUnoShout] = useState(null) // แจ้งเตือน UNO!
  const [logs, setLogs] = useState([])

  // โทษจั่วสะสม (+2 / +4 Stacking) เมื่อมีคนลง +2 หรือ +4 สามารถลงหลบให้คนถัดไปโดนแทน และบวกเพิ่มไปเรื่อยๆ
  const [drawStack, setDrawStack] = useState(0)

  const addLog = (msg) => {
    setLogs((prev) => [msg, ...prev.slice(0, 7)])
  }

  // รายชื่อผู้เล่นทั้งหมดในเกมปัจจุบัน (ผู้เล่น + บอท 1..botCount)
  const allPlayers = [
    { id: 'player', name: 'คุณ (ผู้เล่น)', isUser: true, avatar: '👤' },
    ...BOT_PROFILES.slice(0, botCount).map((b) => ({
      id: b.id,
      name: b.name,
      isUser: false,
      avatar: b.avatar,
      bgGradient: b.bgGradient,
      badgeColor: b.badgeColor,
    })),
  ]

  // รายชื่อผู้เล่นที่ยังคงแข่งขันอยู่บนโต๊ะ (ยังไม่ทิ้งไพ่จนหมด)
  const activePlayers = allPlayers.filter((p) => !finishedRankings.some((r) => r.id === p.id))

  // คำนวณผู้เล่นคนถัดไปตามทิศทาง โดยข้ามผู้เล่นที่ทิ้งไพ่หมดมือไปแล้ว
  const getNextActivePlayerId = (
    fromId,
    stepCount = 1,
    customDir = direction,
    currentFinished = finishedRankings
  ) => {
    const active = allPlayers.filter((p) => !currentFinished.some((r) => r.id === p.id))
    if (active.length <= 1) return active[0]?.id || null

    let currentIdx = allPlayers.findIndex((p) => p.id === fromId)
    if (currentIdx === -1) currentIdx = 0

    let stepsFound = 0
    let searchIdx = currentIdx
    const total = allPlayers.length

    while (stepsFound < stepCount) {
      searchIdx = (searchIdx + customDir + total * 100) % total
      const candidate = allPlayers[searchIdx]
      if (!currentFinished.some((r) => r.id === candidate.id)) {
        stepsFound++
      }
    }

    return allPlayers[searchIdx].id
  }

  // เริ่มเกมใหม่ แจกไพ่คนละ 7 ใบ
  const initGame = (customBotCount = botCount) => {
    const fullDeck = generateDeck()
    const newHands = {}

    // แจกผู้เล่น 7 ใบ
    newHands['player'] = fullDeck.slice(0, 7)
    let pointer = 7

    // แจกบอทคนละ 7 ใบ
    for (let i = 0; i < customBotCount; i++) {
      const bId = BOT_PROFILES[i].id
      newHands[bId] = fullDeck.slice(pointer, pointer + 7)
      pointer += 7
    }

    let remain = fullDeck.slice(pointer)

    // หาไพ่เปิดใบแรกที่เป็นไพ่ตัวเลขธรรมดา
    let startCardIndex = remain.findIndex((c) => c.type === 'number')
    if (startCardIndex === -1) startCardIndex = 0
    const startCard = remain[startCardIndex]
    remain.splice(startCardIndex, 1)

    setDeck(remain)
    setHands(newHands)
    setDiscardPile([startCard])
    setCurrentColor(startCard.color)
    setCurrentTurnId('player')
    setDirection(1)
    setGameStatus('playing')
    setFinishedRankings([])
    setSelectedCardIds([])
    setHasDrawnThisTurn(false)
    setColorPickerOpen(false)
    setPendingPlayCards(null)
    setUnoShout(null)
    setDrawStack(0)
    setGamePhase('playing')
    setLogs([
      `🃏 เริ่มเกมใหม่! (คุณ + บอท ${customBotCount} คน รวม ${customBotCount + 1} คน)`,
      `ไพ่เริ่มต้นบนกระดานคือ [${getColorName(startCard.color)} ${startCard.label}]`,
    ])
  }

  const currentTopCard = discardPile[discardPile.length - 1]

  // ตรวจสอบว่าไพ่ใบแรกสามารถลงบนกองทิ้งได้หรือไม่
  const canPlayFirstCard = (card, topCard = currentTopCard, activeColor = currentColor, activeStack = drawStack) => {
    // หากมีโทษจั่วสะสมอยู่ (+2 / +4 Stacking) ต้องลงเฉพาะการ์ด +2 หรือ +4 เพื่อหลบเท่านั้น
    if (activeStack > 0) {
      return card.value === 'draw2' || card.value === 'wild4'
    }

    if (!topCard) return true
    if (card.color === 'wild') return true
    if (card.color === activeColor) return true
    if (card.value === topCard.value) return true
    return false
  }

  // ตรวจสอบว่าไพ่ใบที่สองสามารถเข้าคู่กับใบแรกได้หรือไม่ (กฎลงไพ่ได้เยอะสุด 2 ใบ)
  // กฎ: ทุกเลขที่สีต่างแต่เลขเหมือนกัน (เช่น 2 เขียว กับ 2 แดง)
  const canPlaySecondCard = (secondCard, firstCard) => {
    if (!firstCard || !secondCard) return false
    if (secondCard.id === firstCard.id) return false
    return secondCard.value === firstCard.value
  }

  // ผู้เล่นคลิกเลือกการ์ดในมือ (รองรับการเลือกสูงสุด 2 ใบ)
  const handleCardClick = (card) => {
    if (currentTurnId !== 'player' || gameStatus !== 'playing') return

    // ถ้ากดการ์ดที่เลือกไว้อยู่แล้ว -> ยกเลิกการเลือก
    if (selectedCardIds.includes(card.id)) {
      setSelectedCardIds((prev) => prev.filter((id) => id !== card.id))
      return
    }

    // กรณีเลือกใบแรก
    if (selectedCardIds.length === 0) {
      if (canPlayFirstCard(card, currentTopCard, currentColor, drawStack)) {
        setSelectedCardIds([card.id])
        return
      }

      // ถ้าการ์ดใบนี้ลงเดี่ยวไม่ได้ แต่ในมือมีไพ่เลขเดียวกันที่ลงได้
      // ช่วยจับคู่ให้ทันที (เช่น มี 2 เขียว กับ 2 แดง แล้วเผลอกด 2 แดงก่อน)
      const currentHand = hands['player'] || []
      const partner = currentHand.find(
        (c) => c.id !== card.id && c.value === card.value && canPlayFirstCard(c, currentTopCard, currentColor, drawStack)
      )

      if (partner) {
        setSelectedCardIds([partner.id, card.id])
        addLog(`💡 จับคู่ [${getColorName(partner.color)} ${partner.label}] (ใบแรก) กับ [${getColorName(card.color)} ${card.label}] (ใบที่สอง) ให้อัตโนมัติ! 🔥`)
        return
      }

      if (drawStack > 0) {
        addLog(`⚠️ กำลังโดนโทษสะสม +${drawStack} ใบ! ต้องเลือกลงการ์ด [+2] หรือ [+4] เพื่อหลบเท่านั้น`)
      } else {
        addLog(`⚠️ การ์ด [${getColorName(card.color)} ${card.label}] ลงไม่ได้ (ไม่ตรงสีหรือเลขบนกระดาน)`)
      }
      return
    }

    // กรณีเลือกใบที่สอง (ลงได้เยอะสุด 2 ใบ เลขเดียวกันแม้คนละสี)
    if (selectedCardIds.length === 1) {
      const firstCard = (hands['player'] || []).find((c) => c.id === selectedCardIds[0])
      if (!firstCard) {
        setSelectedCardIds([card.id])
        return
      }

      if (canPlaySecondCard(card, firstCard)) {
        setSelectedCardIds([firstCard.id, card.id])
      } else {
        // ถ้าใบที่สองไม่เข้าคู่ ให้สลับไปเลือกใบนี้เป็นใบแรกแทนถ้าลงได้
        if (canPlayFirstCard(card, currentTopCard, currentColor, drawStack)) {
          setSelectedCardIds([card.id])
        } else {
          addLog(`⚠️ การ์ดใบที่ 2 ต้องมีเลขหรือสัญลักษณ์เดียวกันกับการ์ดใบแรก (เช่น ${firstCard.label})`)
        }
      }
    }
  }

  // ผู้เล่นกดยืนยันลงการ์ดที่เลือก (1 ใบ หรือ 2 ใบ)
  const handleConfirmPlaySelected = () => {
    if (currentTurnId !== 'player' || gameStatus !== 'playing') return
    if (selectedCardIds.length === 0) return

    const playerHand = hands['player'] || []
    const cardsToPlay = selectedCardIds
      .map((id) => playerHand.find((c) => c.id === id))
      .filter(Boolean)

    if (cardsToPlay.length === 0) return

    // ตรวจสอบว่าในการ์ดที่จะลง มีการ์ด Wild หรือไม่
    const lastCard = cardsToPlay[cardsToPlay.length - 1]
    const hasWild = cardsToPlay.some((c) => c.color === 'wild')

    if (hasWild || lastCard.color === 'wild') {
      setPendingPlayCards(cardsToPlay)
      setColorPickerOpen(true)
      return
    }

    executePlayCards(cardsToPlay, lastCard.color, 'player')
    setSelectedCardIds([])
  }

  // ยืนยันสีเมื่อลงการ์ด Wild
  const handleSelectWildColor = (colorId) => {
    if (!pendingPlayCards || pendingPlayCards.length === 0) return
    setColorPickerOpen(false)
    executePlayCards(pendingPlayCards, colorId, 'player')
    setPendingPlayCards(null)
    setSelectedCardIds([])
  }

  // ดำเนินการลงการ์ดจริง (รองรับทั้ง 1 ใบ และ 2 ใบ) และคำนวณเอฟเฟกต์
  const executePlayCards = (cards, chosenColor, whoId) => {
    const isUser = whoId === 'player'
    const whoName = activePlayers.find((p) => p.id === whoId)?.name || whoId
    const currentHand = hands[whoId] || []
    const playedIds = cards.map((c) => c.id)
    const nextHand = currentHand.filter((c) => !playedIds.includes(c.id))

    // อัปเดตไพ่ในมือ
    setHands((prev) => ({ ...prev, [whoId]: nextHand }))
    setDiscardPile((prev) => [...prev, ...cards])
    setCurrentColor(chosenColor)

    // บันทึก Log การลงไพ่
    if (cards.length === 1) {
      addLog(`${isUser ? '👤 คุณ' : `🤖 ${whoName}`} ลงไพ่ [${getColorName(chosenColor)} ${cards[0].label}]`)
    } else {
      addLog(
        `${isUser ? '👤 คุณ' : `🤖 ${whoName}`} ลงไพ่คู่ 2 ใบ! 🔥 [${cards[0].label}] & [${cards[1].label}] (สี: ${getColorName(chosenColor)})`
      )
    }

    // ตรวจสอบผู้เล่นที่ทิ้งไพ่จนหมดมือ
    if (nextHand.length === 0) {
      const newRank = finishedRankings.length + 1
      const pProfile = allPlayers.find((p) => p.id === whoId)
      const finishedEntry = {
        id: whoId,
        name: whoName,
        rank: newRank,
        isUser,
        avatar: pProfile?.avatar || (isUser ? '👤' : '🤖'),
      }
      const updatedFinished = [...finishedRankings, finishedEntry]
      setFinishedRankings(updatedFinished)

      const remainingPlayers = allPlayers.filter((p) => !updatedFinished.some((r) => r.id === p.id))

      // หากเหลือผู้เล่นคนสุดท้ายเพียงคนเดียว -> จบเกมทันทีและบันทึกผู้แพ้คนสุดท้าย!
      if (remainingPlayers.length <= 1) {
        if (remainingPlayers.length === 1) {
          const loser = remainingPlayers[0]
          const loserEntry = {
            id: loser.id,
            name: loser.name,
            rank: updatedFinished.length + 1,
            isUser: loser.isUser,
            avatar: loser.avatar,
            isLoser: true,
          }
          setFinishedRankings([...updatedFinished, loserEntry])
          addLog(`💀 ${loser.name} เหลือไพ่ในมือเป็นคนสุดท้าย จึงเป็นผู้แพ้ในเกมนี้!`)
        }
        setGameStatus('game_over')
        addLog(`🏆 ${whoName} ทิ้งไพ่หมดมือ คว้าอันดับที่ ${newRank}!`)
        return
      }

      // หากยังเหลือผู้เล่นมากกว่า 1 คน -> แข่งขันต่อจนกว่าจะเหลือคนสุดท้าย!
      addLog(`🎉 ${whoName} ทิ้งไพ่หมดมือ คว้าอันดับที่ ${newRank}! 🏆 (เหลืออีก ${remainingPlayers.length} คน แข่งต่อจนกว่าจะเหลือคนสุดท้าย)`)

      // คำนวณเอฟเฟกต์การ์ดที่เพิ่งลง และส่งต่อให้ผู้เล่นที่ยังอยู่บนโต๊ะ
      applyCombinedCardEffects(cards, whoId, chosenColor, updatedFinished)
      return
    }

    // ตะโกน UNO เมื่อเหลือไพ่ 1 ใบ
    if (nextHand.length === 1) {
      setUnoShout(`${whoName} ตะโกน: UNO! (เหลือไพ่ใบสุดท้าย)`)
      setTimeout(() => setUnoShout(null), 3000)
    }

    // คำนวณเอฟเฟกต์จากการ์ดที่ลง (คิดผลจากการ์ดทั้งหมดที่ลง)
    applyCombinedCardEffects(cards, whoId, chosenColor)
  }

  // คำนวณเอฟเฟกต์การ์ดพิเศษ: Skip, Reverse, +2, +4
  const applyCombinedCardEffects = (cards, whoId, chosenColor, currentFinished = finishedRankings) => {
    setHasDrawnThisTurn(false)
    let totalDrawPenalty = 0
    let skipCount = 0
    let reverseCount = 0

    cards.forEach((c) => {
      if (c.value === 'draw2') totalDrawPenalty += 2
      if (c.value === 'wild4') totalDrawPenalty += 4
      if (c.value === 'skip') skipCount++
      if (c.value === 'reverse') reverseCount++
    })

    let currentDir = direction
    const remainingActive = allPlayers.filter((p) => !currentFinished.some((r) => r.id === p.id))

    // กรณีมีการ์ด Reverse 🔄
    if (reverseCount % 2 === 1) {
      currentDir = direction * -1
      setDirection(currentDir)
      if (remainingActive.length > 2) {
        addLog(`🔄 ทิศทางการเล่นเปลี่ยนเป็น: ${currentDir === 1 ? 'ตามเข็มนาฬิกา ↻' : 'ทวนเข็มนาฬิกา ↺'}`)
      } else {
        // ในกรณีเหลือ 2 คน Reverse มีผลเหมือนการข้ามตา
        skipCount++
      }
    }

    // กรณีมีโทษจั่ว +2 หรือ +4 -> ซ้อนโทษจั่ว (Stacking) และส่งต่อให้คนถัดไปหลบ
    if (totalDrawPenalty > 0) {
      const nextVictimId = getNextActivePlayerId(whoId, 1, currentDir, currentFinished)
      const nextVictimName = allPlayers.find((p) => p.id === nextVictimId)?.name || nextVictimId
      const newStack = drawStack + totalDrawPenalty
      setDrawStack(newStack)
      addLog(`⚡ โทษจั่วสะสมทบเป็น +${newStack} ใบ! ตาของ ${nextVictimName} (เลือกลง +2/+4 เพื่อหลบ หรือจั่วรับโทษ)`)
      if (nextVictimId) setCurrentTurnId(nextVictimId)
      return
    }

    // กรณีมีการ์ดข้าม Skip 🚫
    if (skipCount > 0) {
      const skippedId = getNextActivePlayerId(whoId, 1, currentDir, currentFinished)
      const skippedName = allPlayers.find((p) => p.id === skippedId)?.name || skippedId
      addLog(`🚫 ${skippedName} โดนข้ามตาเล่น!`)
      const nextId = getNextActivePlayerId(whoId, 1 + skipCount, currentDir, currentFinished)
      if (nextId) setCurrentTurnId(nextId)
      return
    }

    // เทิร์นปกติ เลื่อนไปยังผู้เล่นคนถัดไป 1 ตำแหน่ง
    const nextPlayerId = getNextActivePlayerId(whoId, 1, currentDir, currentFinished)
    if (nextPlayerId) setCurrentTurnId(nextPlayerId)
  }

  // จั่วการ์ด N ใบให้ผู้เล่นหรือบอท
  const drawCardsFor = (targetId, count) => {
    let currentDeck = [...deck]
    let drawn = []

    for (let i = 0; i < count; i++) {
      if (currentDeck.length === 0) {
        currentDeck = generateDeck().slice(0, 40)
      }
      drawn.push(currentDeck.pop())
    }

    setDeck(currentDeck)
    setHands((prev) => ({
      ...prev,
      [targetId]: [...(prev[targetId] || []), ...drawn],
    }))
  }

  // ผู้เล่นกดจั่วการ์ดจากกอง
  const handlePlayerDraw = () => {
    if (currentTurnId !== 'player' || gameStatus !== 'playing') return

    // หากกำลังโดนโทษจั่วสะสม (+2 / +4 Stacking) แล้วไม่มีไพ่หลบ หรือเลือกจั่วรับโทษ
    if (drawStack > 0) {
      drawCardsFor('player', drawStack)
      addLog(`💥 คุณจั่วรับโทษสะสม +${drawStack} ใบเต็มจำนวน! (และเสียตาเล่น)`)
      const nextId = getNextActivePlayerId('player', 1)
      setDrawStack(0)
      setHasDrawnThisTurn(false)
      setSelectedCardIds([])
      if (nextId) setCurrentTurnId(nextId)
      return
    }

    if (hasDrawnThisTurn) return

    let currentDeck = [...deck]
    if (currentDeck.length === 0) {
      currentDeck = generateDeck().slice(0, 40)
    }

    const card = currentDeck.pop()
    setDeck(currentDeck)
    setHands((prev) => ({
      ...prev,
      player: [...(prev.player || []), card],
    }))
    setHasDrawnThisTurn(true)
    addLog(`📥 คุณจั่วการ์ด 1 ใบเข้าสู่มือ`)
  }

  // ผู้เล่นกดผ่านตา (หลังจั่วแล้วยังลงไม่ได้)
  const handlePlayerPass = () => {
    if (currentTurnId !== 'player' || !hasDrawnThisTurn || drawStack > 0) return
    setHasDrawnThisTurn(false)
    setSelectedCardIds([])
    const nextId = getNextActivePlayerId('player', 1)
    const nextName = allPlayers.find((p) => p.id === nextId)?.name || nextId
    addLog(`คุณผ่านตาไปยัง ${nextName}`)
    if (nextId) setCurrentTurnId(nextId)
  }

  // ระบบการเล่นอัตโนมัติของบอท AI (รองรับบอทหลายตัว, เล่นจนเหลือคนสุดท้าย, ซ้อนหลบไพ่ +2/+4)
  useEffect(() => {
    if (currentTurnId === 'player' || gameStatus !== 'playing' || gamePhase !== 'playing') return

    // หากผู้เล่นคนนี้จบการแข่งขันไปแล้ว ให้ส่งตาต่อไปยังผู้เล่นที่ยังอยู่
    if (finishedRankings.some((r) => r.id === currentTurnId)) {
      const nextId = getNextActivePlayerId(currentTurnId, 1)
      if (nextId) setCurrentTurnId(nextId)
      return
    }

    const timer = setTimeout(() => {
      botPlayTurn(currentTurnId)
    }, 1000)

    return () => clearTimeout(timer)
  }, [currentTurnId, gameStatus, gamePhase, currentColor, discardPile, drawStack, finishedRankings])

  const botPlayTurn = (botId) => {
    const botHand = hands[botId] || []
    const botName = allPlayers.find((p) => p.id === botId)?.name || botId

    // 0. หากมีโทษจั่วสะสมอยู่ (+2 / +4 Stacking) บอทต้องหาไพ่ +2 หรือ +4 มาหลบ
    if (drawStack > 0) {
      const deflectingCards = botHand.filter((c) => c.value === 'draw2' || c.value === 'wild4')

      if (deflectingCards.length > 0) {
        // ตรวจสอบว่ามีไพ่คู่เหมือนกันเป๊ะ (เลขและสีเดียวกัน) เพื่อลงคู่ 2 ใบหรือไม่
        let pairToPlay = null
        for (const c1 of deflectingCards) {
          const match2 = deflectingCards.find((c2) => c2.id !== c1.id && canPlaySecondCard(c2, c1))
          if (match2) {
            pairToPlay = [c1, match2]
            break
          }
        }

        if (pairToPlay) {
          const lastC = pairToPlay[1]
          let chosenColor = lastC.color === 'wild' ? pickBestColorForBot(botHand) : lastC.color
          addLog(`🤖 ${botName} ลงไพ่คู่ 2 ใบ หลบโทษและสะสมต่อ! 🔥`)
          executePlayCards(pairToPlay, chosenColor, botId)
          return
        }

        // ถ้าไม่มีคู่ ให้ลงใบเดี่ยว 1 ใบ
        const chosen = deflectingCards[0]
        let chosenColor = chosen.color === 'wild' ? pickBestColorForBot(botHand) : chosen.color
        addLog(`🤖 ${botName} ลงไพ่ [${chosen.label}] หลบโทษและสะสมต่อ! 🛡️`)
        executePlayCards([chosen], chosenColor, botId)
        return
      }

      // ถ้าไม่มีไพ่ +2 หรือ +4 บอทต้องจั่วรับโทษสะสมและเสียตาเล่น
      addLog(`💥 🤖 ${botName} ไม่มีไพ่ +2 หรือ +4 มาหลบ จึงต้องจั่วรับโทษสะสม +${drawStack} ใบ!`)
      drawCardsFor(botId, drawStack)
      const nextId = getNextActivePlayerId(botId, 1)
      setDrawStack(0)
      if (nextId) setCurrentTurnId(nextId)
      return
    }

    // 1. เทิร์นปกติ: ตรวจสอบว่าบอทมีคอมโบ 2 ใบที่ลงได้หรือไม่ (เลขและสีเดียวกันเป๊ะๆ)
    const playableSingles = botHand.filter((c) => canPlayFirstCard(c, currentTopCard, currentColor, 0))

    let bestPair = null
    for (const c1 of playableSingles) {
      const match2 = botHand.find((c2) => c2.id !== c1.id && canPlaySecondCard(c2, c1))
      if (match2) {
        bestPair = [c1, match2]
        break
      }
    }

    // ถ้ามีคอมโบ 2 ใบ ให้ลงคู่ 2 ใบเลย!
    if (bestPair) {
      const lastC = bestPair[1]
      let chosenColor = lastC.color
      if (lastC.color === 'wild' || bestPair[0].color === 'wild') {
        chosenColor = pickBestColorForBot(botHand)
      }
      executePlayCards(bestPair, chosenColor, botId)
      return
    }

    // 2. ถ้าไม่มีคอมโบ 2 ใบ แต่มีไพ่เดี่ยว 1 ใบที่ลงได้
    if (playableSingles.length > 0) {
      const chosen = playableSingles[Math.floor(Math.random() * playableSingles.length)]
      let chosenColor = chosen.color
      if (chosen.color === 'wild') {
        chosenColor = pickBestColorForBot(botHand)
      }
      executePlayCards([chosen], chosenColor, botId)
      return
    }

    // 3. ถ้าไม่มีไพ่ลง บอทต้องจั่วการ์ด 1 ใบ
    let currentDeck = [...deck]
    if (currentDeck.length === 0) {
      currentDeck = generateDeck().slice(0, 40)
    }
    const newCard = currentDeck.pop()
    setDeck(currentDeck)
    addLog(`🤖 ${botName} ไม่มีไพ่ลง จึงจั่วการ์ด 1 ใบ`)

    // ตรวจสอบว่าไพ่ที่จั่วขึ้นมาสามารถลงได้เลยหรือไม่
    if (canPlayFirstCard(newCard, currentTopCard, currentColor, 0)) {
      setTimeout(() => {
        let chosenColor = newCard.color
        if (newCard.color === 'wild') {
          chosenColor = pickBestColorForBot(botHand)
        }
        executePlayCards([newCard], chosenColor, botId)
      }, 700)
    } else {
      setHands((prev) => ({
        ...prev,
        [botId]: [...(prev[botId] || []), newCard],
      }))
      const nextId = getNextActivePlayerId(botId, 1)
      if (nextId) setCurrentTurnId(nextId)
    }
  }

  // จำลองผลการแข่งขันของบอทที่เหลือให้จบลงทันที (สำหรับกรณีผู้เล่นชนะไปแล้วและไม่อยากนั่งรอนาน)
  const handleInstantFinishRemaining = () => {
    let currentHands = { ...hands }
    let currentFinished = [...finishedRankings]
    let remaining = allPlayers.filter((p) => !currentFinished.some((r) => r.id === p.id))

    // เรียงบอทที่เหลือตามจำนวนไพ่ในมือน้อยสุด -> มากสุด เพื่อตัดสินอันดับอย่างเป็นธรรม
    remaining.sort((a, b) => (currentHands[a.id]?.length || 0) - (currentHands[b.id]?.length || 0))

    while (remaining.length > 1) {
      const winnerBot = remaining.shift()
      currentFinished.push({
        id: winnerBot.id,
        name: winnerBot.name,
        rank: currentFinished.length + 1,
        isUser: false,
        avatar: winnerBot.avatar,
      })
    }

    // คนสุดท้ายที่เหลือคือผู้แพ้
    if (remaining.length === 1) {
      const loserBot = remaining[0]
      currentFinished.push({
        id: loserBot.id,
        name: loserBot.name,
        rank: currentFinished.length + 1,
        isUser: false,
        avatar: loserBot.avatar,
        isLoser: true,
      })
    }

    setFinishedRankings(currentFinished)
    setGameStatus('game_over')
  }

  // บอทเลือกสีที่ดีที่สุดตามจำนวนไพ่ในมือ
  const pickBestColorForBot = (botHand) => {
    const counts = { red: 0, blue: 0, green: 0, yellow: 0 }
    botHand.forEach((c) => {
      if (c.color !== 'wild' && counts[c.color] !== undefined) counts[c.color]++
    })
    return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b))
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

  const playerHand = hands['player'] || []

  // ================= 0. หน้าล็อบบี้ / ตั้งค่าบอทก่อนเริ่มเกม (SETUP PHASE) =================
  if (gamePhase === 'setup') {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-140px)] p-4 select-none animate-in fade-in">
        <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl max-w-lg w-full p-6 sm:p-8 text-center shadow-2xl border-2 border-amber-500/60 relative overflow-hidden">
          {/* หัวเรื่องเกม UNO */}
          <div className="w-20 h-20 bg-gradient-to-tr from-red-500 via-amber-400 to-blue-500 rounded-3xl flex items-center justify-center text-white text-3xl font-black mx-auto shadow-xl shadow-red-500/30 mb-4 animate-bounce">
            U
          </div>

          <span className="inline-block px-3 py-1 bg-amber-400/20 text-amber-300 text-xs font-black rounded-full border border-amber-400/40 mb-2">
            UNO ARENA • ปาร์ตี้การ์ดเกม
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
            ตั้งค่าผู้เล่นก่อนเริ่มเกม
          </h1>
          <p className="text-xs text-slate-400 mb-6">
            คุณสามารถเพิ่มบอทได้สูงสุด 4 คน และในเกมสามารถเลือกลงไพ่ได้มากสุด 2 ใบ!
          </p>

          {/* แผงปรับจำนวนบอท (1 - 4 คน) */}
          <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-4 sm:p-5 mb-5 shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-400" />
                <span>จำนวนบอทคู่ต่อสู้:</span>
              </span>
              <span className="text-xs font-black text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/30">
                รวมผู้เล่นทั้งหมด {botCount + 1} คน
              </span>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setBotCount((prev) => Math.max(1, prev - 1))}
                disabled={botCount <= 1}
                className="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white font-black text-xl flex items-center justify-center transition cursor-pointer border border-white/10 active:scale-95"
                title="ลดจำนวนบอท"
              >
                <Minus className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center px-4">
                <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 font-mono">
                  {botCount}
                </span>
                <span className="text-[11px] text-slate-400 font-semibold mt-0.5">บอท AI (สูงสุด 4 คน)</span>
              </div>

              <button
                onClick={() => setBotCount((prev) => Math.min(4, prev + 1))}
                disabled={botCount >= 4}
                className="w-12 h-12 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-slate-950 font-black text-xl flex items-center justify-center transition cursor-pointer active:scale-95 shadow-md"
                title="เพิ่มจำนวนบอท (สูงสุด 4 คน)"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* รายชื่อผู้เล่นที่จะเข้าร่วมโต๊ะนี้ */}
          <div className="mb-6 text-left">
            <span className="text-[11px] font-bold text-slate-400 block mb-2">
              สมาชิกในรอบนี้ ({botCount + 1} คน):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs font-bold text-emerald-300 flex items-center gap-2">
                <span className="text-base">👤</span>
                <span className="truncate">คุณ (ผู้เล่น)</span>
              </div>
              {BOT_PROFILES.slice(0, botCount).map((b) => (
                <div
                  key={b.id}
                  className="p-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-2"
                >
                  <span className="text-base">{b.avatar}</span>
                  <span className="truncate">{b.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* กฎการเล่นพิเศษ */}
          <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl p-3 text-xs text-amber-200/90 text-left mb-6 space-y-1">
            <p className="font-black text-amber-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>กฎพิเศษ UNO ประจำห้อง:</span>
            </p>
            <p className="text-[11px] leading-relaxed">
              • สามารถเลือกลงไพ่ได้<strong>เยอะสุด 2 ใบ</strong> (ลงไพ่<strong>เลขเดียวกัน แม้สีจะต่างกัน</strong> เช่น 2 เขียว แล้วตามด้วย 2 แดง)
            </p>
            <p className="text-[11px] leading-relaxed">
              • <strong>ระบบซ้อนโทษจั่ว (+2 / +4 Stacking)</strong>: เมื่อมีคนลง +2 หรือ +4 สามารถลงการ์ด +2 หรือ +4 เพื่อหลบให้คนถัดไปโดนแทน และโทษจั่วจะบวกสะสมทบไปเรื่อยๆ (เช่น โดน +2 ลง +2 ทบเป็น +4)!
            </p>
            <p className="text-[11px] leading-relaxed">
              • <strong>เล่นจนเหลือคนสุดท้าย</strong>: หากมีผู้เล่นมากกว่า 2 คน เกมจะเล่นต่อจนกว่าจะเหลือคนสุดท้าย (คนที่ทิ้งไพ่หมดก่อนจะได้อันดับ 1, 2, 3... และคนที่เหลือไพ่คนสุดท้ายจะเป็นผู้แพ้!)
            </p>
          </div>

          {/* ปุ่มเริ่มเล่นเกม */}
          <button
            onClick={() => initGame(botCount)}
            className="w-full py-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-amber-500/30 transition transform hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>เริ่มเล่นเกม UNO ({botCount + 1} คน)</span>
          </button>
        </div>
      </div>
    )
  }

  // ================= 1. หน้าจอหลักของเกม UNO (PLAYING PHASE) =================
  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col justify-between select-none relative font-sans text-slate-100 animate-in fade-in">
      {/* ================= MODAL แจ้งผลการแข่งขัน & ตารางอันดับสรุปผล ================= */}
      {gameStatus === 'game_over' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 text-center border-4 border-amber-400 shadow-2xl animate-in zoom-in-95 text-white">
            {/* หัวข้อแสดงผลตามอันดับของผู้เล่น */}
            {(() => {
              const userRanking = finishedRankings.find((r) => r.isUser)
              const userRank = userRanking?.rank || 1
              const isUserWinner = userRank === 1
              const isUserLoser = userRanking?.isLoser

              return (
                <div>
                  <div className="w-18 h-18 mx-auto rounded-3xl flex items-center justify-center text-4xl mb-3 bg-amber-400/20 text-amber-400 animate-bounce">
                    {isUserWinner ? '🏆' : isUserLoser ? '💀' : '🎖️'}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black mb-1">
                    {isUserWinner
                      ? '🎉 คุณคือแชมป์ UNO!'
                      : isUserLoser
                      ? '💀 คุณแพ้ในเกมนี้ (คนสุดท้าย)'
                      : `คุณจบในอันดับที่ ${userRank}!`}
                  </h2>
                  <p className="text-xs text-slate-400 mb-5">
                    {isUserWinner
                      ? 'คุณทิ้งไพ่หมดมือเป็นคนแรกและคว้าอันดับที่ 1 ไปครอง!'
                      : isUserLoser
                      ? 'คุณเหลือไพ่เป็นคนสุดท้าย จึงต้องยอมรับความพ่ายแพ้ในรอบนี้'
                      : `การแข่งขันดุเดือด! คุณทำผลงานได้ในอันดับที่ ${userRank}`}
                  </p>
                </div>
              )
            })()}

            {/* ตารางสรุปอันดับผู้เล่นทุกคน (Rank 1 -> Last) */}
            <div className="bg-slate-950/80 rounded-2xl border border-white/10 p-3 mb-6 space-y-2 text-left">
              <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                <Trophy className="w-3.5 h-3.5" />
                <span>ตารางสรุปอันดับการแข่งขัน:</span>
              </span>

              {finishedRankings.map((entry) => {
                const isFirst = entry.rank === 1
                const isSecond = entry.rank === 2
                const isThird = entry.rank === 3
                const isLoser = entry.isLoser

                return (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                      entry.isUser
                        ? isFirst
                          ? 'bg-amber-400/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/40 font-black'
                          : isLoser
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 ring-2 ring-rose-500/40 font-black'
                          : 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-400/40 font-black'
                        : isFirst
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                        : isLoser
                        ? 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                        : 'bg-slate-900 border-white/10 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base font-black w-6 text-center">
                        {isFirst ? '🥇' : isSecond ? '🥈' : isThird ? '🥉' : isLoser ? '💀' : `${entry.rank}`}
                      </span>
                      <span className="text-base">{entry.avatar}</span>
                      <span className="font-bold truncate max-w-[150px]">
                        {entry.name} {entry.isUser && '(คุณ)'}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                        isFirst
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs'
                          : isLoser
                          ? 'bg-rose-600 text-white border-rose-400'
                          : 'bg-white/10 text-slate-200 border-white/20'
                      }`}
                    >
                      {isFirst ? 'ชนะเลิศ 🏆' : isLoser ? 'แพ้ (คนสุดท้าย)' : `อันดับที่ ${entry.rank}`}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* ปุ่มกดเล่นใหม่ หรือตั้งค่าใหม่ */}
            <div className="flex gap-2">
              <button
                onClick={() => setGamePhase('setup')}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer"
              >
                ⚙️ ตั้งค่าบอทใหม่
              </button>
              <button
                onClick={() => initGame(botCount)}
                className="flex-1 py-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-400/30 transition transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                🔄 เล่นใหม่อีกครั้ง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL เลือกสีสำหรับไพ่ WILD ================= */}
      {colorPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-slate-900 border-2 border-white/20 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">🌈 เลือกสีที่คุณต้องการเปลี่ยน</h3>
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
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white font-black text-sm px-6 py-2.5 rounded-full shadow-2xl animate-bounce border-2 border-yellow-300">
          🔥 {unoShout}
        </div>
      )}

      {/* แถบด้านบน: หัวเรื่อง + สถานะเทิร์น + ทิศทาง */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 px-4 sm:px-5 py-3 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-500 via-amber-400 to-blue-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-red-500/20">
            U
          </div>
          <div>
            <h1 className="font-black text-base sm:text-lg text-white leading-none flex items-center gap-2">
              <span>UNO ARENA</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                เหลือแข่ง {activePlayers.length} / {allPlayers.length} คน
              </span>
            </h1>
            <p className="text-[10.5px] text-slate-400 mt-1">
              ทิศทาง: <b className="text-amber-300">{direction === 1 ? 'ตามเข็มนาฬิกา ↻' : 'ทวนเข็มนาฬิกา ↺'}</b> • กฎ: แข่งจนเหลือคนสุดท้าย 💀
            </p>
          </div>
        </div>

        {/* ตัวบอกตาเดิน & ปุ่มควบคุม */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              currentTurnId === 'player'
                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300 ring-2 ring-emerald-400/30'
                : 'bg-blue-500/20 border-blue-400/40 text-blue-300 ring-2 ring-blue-400/30'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-current animate-ping"></span>
            <span>
              {finishedRankings.some((r) => r.isUser)
                ? `ตาของ ${allPlayers.find((p) => p.id === currentTurnId)?.name || 'บอท'} ⚡ (คุณได้อันดับที่ ${finishedRankings.find((r) => r.isUser)?.rank})`
                : currentTurnId === 'player'
                ? 'ตาของคุณ (เลือกลง 1-2 ใบ)'
                : `ตาของ ${allPlayers.find((p) => p.id === currentTurnId)?.name} ⚡`}
            </span>
          </div>

          <button
            onClick={() => setGamePhase('setup')}
            title="ตั้งค่าบอทใหม่"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ตั้งค่าบอท</span>
          </button>

          <button
            onClick={() => initGame(botCount)}
            title="เริ่มเกมใหม่"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ================= 3 คอลัมน์หลัก: ฝั่งซ้าย (บอท 1-4 คน) | ตรงกลาง (กระดาน) | ฝั่งขวา (ไพ่เรา) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-0">
        {/* ================= 1. ฝั่งซ้าย: แผงแสดงบอท 1 ถึง 4 คน (ไพ่คว่ำหน้า) ================= */}
        <div className="lg:col-span-3 bg-slate-900/80 backdrop-blur-md rounded-3xl border border-white/10 p-3 sm:p-4 flex flex-col justify-between shadow-xl min-h-0 overflow-hidden">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5 shrink-0">
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-blue-400" />
                <span>คู่ต่อสู้ AI ({botCount} คน)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                ทิศ {direction === 1 ? '↻' : '↺'}
              </span>
            </div>

            {/* รายชื่อการ์ดของแต่ละบอท (เรียงลงมาอย่างสวยงาม) */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/20">
              {BOT_PROFILES.slice(0, botCount).map((b) => {
                const bHand = hands[b.id] || []
                const isThisBotTurn = currentTurnId === b.id
                const finishedInfo = finishedRankings.find((r) => r.id === b.id)
                const isFinished = !!finishedInfo

                return (
                  <div
                    key={b.id}
                    className={`p-2.5 rounded-2xl border transition-all ${
                      isFinished
                        ? 'bg-amber-950/30 border-amber-500/30 opacity-80'
                        : isThisBotTurn
                        ? 'bg-blue-950/70 border-blue-400/80 ring-2 ring-blue-400/40 shadow-md'
                        : 'bg-slate-950/50 border-white/10 opacity-90'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{b.avatar}</span>
                        <div>
                          <p className="font-bold text-xs text-white leading-tight">{b.name}</p>
                          <p className="text-[9.5px] text-slate-400">
                            {isFinished
                              ? `🏆 จบอันดับที่ ${finishedInfo.rank}`
                              : isThisBotTurn
                              ? '⚡ กำลังวิเคราะห์ไพ่...'
                              : '💤 รอตาเดิน'}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                          isFinished
                            ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                            : bHand.length === 1
                            ? 'bg-rose-500/20 text-rose-300 border-rose-400 animate-pulse font-extrabold'
                            : 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                        }`}
                      >
                        {isFinished
                          ? `${finishedInfo.rank === 1 ? '🥇 อันดับ 1' : finishedInfo.rank === 2 ? '🥈 อันดับ 2' : finishedInfo.rank === 3 ? '🥉 อันดับ 3' : `อันดับ ${finishedInfo.rank}`}`
                          : `${bHand.length} ใบ ${bHand.length === 1 ? '🔥' : ''}`}
                      </span>
                    </div>

                    {/* ไพ่คว่ำหน้าของบอท หรือ ป้ายจบเกม */}
                    {isFinished ? (
                      <div className="py-1 px-2 rounded-lg bg-black/40 text-[10px] text-amber-300/80 font-bold flex items-center justify-between">
                        <span>ทิ้งไพ่หมดแล้ว 🎉</span>
                        <span>{finishedInfo.rank === 1 ? 'แชมป์ 🥇' : `อันดับ ${finishedInfo.rank}`}</span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1 items-center">
                        {bHand.slice(0, 10).map((c, i) => (
                          <div
                            key={c.id || i}
                            className="w-5 h-7 rounded bg-gradient-to-br from-red-700 via-slate-900 to-black border border-amber-400/50 flex items-center justify-center text-[7px] text-amber-400 font-bold rotate-2 shadow-2xs"
                          >
                            U
                          </div>
                        ))}
                        {bHand.length > 10 && (
                          <span className="text-[9px] text-slate-400 font-mono pl-1">
                            +{bHand.length - 10}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 text-center shrink-0">
            <span className="text-[10.5px] text-slate-400">
              💡 บอทสามารถลงไพ่คู่ 2 ใบได้เช่นเดียวกัน
            </span>
          </div>
        </div>

        {/* ================= 2. ตรงกลาง: กระดานโต๊ะเล่น UNO (กองจั่ว + กองทิ้ง + สีปัจจุบัน) ================= */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-emerald-950/60 to-slate-900 rounded-3xl border-2 border-emerald-500/30 p-4 sm:p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden min-h-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* แถบตัวบอกสีปัจจุบัน และ กฎ 2 ใบ */}
          <div className="flex items-center justify-between bg-slate-950/70 border border-white/10 px-3.5 py-2 rounded-2xl backdrop-blur-sm z-10 shrink-0">
            <span className="text-[11px] text-slate-300 font-medium">สีที่ต้องลงตาม:</span>
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

          {/* ป้ายเตือนโทษจั่วสะสม (+2 / +4 Stacking) */}
          {drawStack > 0 && (
            <div className="z-10 bg-gradient-to-r from-rose-600 via-orange-600 to-amber-500 border-2 border-white/40 px-3.5 py-1.5 rounded-2xl shadow-xl flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-1.5 text-white font-black text-xs">
                <Zap className="w-4 h-4 text-yellow-300 animate-spin" />
                <span>โทษจั่วสะสม: +{drawStack} ใบ! 🔥</span>
              </div>
              <span className="text-[10px] text-yellow-100 font-bold">
                {currentTurnId === 'player'
                  ? '🛡️ เลือกลง +2/+4 เพื่อหลบ หรือคลิกจั่วรับโทษ'
                  : 'กำลังรอการหลบของบอท...'}
              </span>
            </div>
          )}

          {/* ตรงกลาง: กองการ์ดจั่ว vs กองการ์ดทิ้ง */}
          <div className="my-auto py-3 flex items-center justify-center gap-6 sm:gap-8 z-10 shrink-0">
            {/* กองการ์ดจั่ว (Draw Pile) */}
            <div className="flex flex-col items-center">
              <button
                onClick={handlePlayerDraw}
                disabled={currentTurnId !== 'player' || (drawStack === 0 && hasDrawnThisTurn)}
                className={`w-20 h-32 sm:w-24 sm:h-36 rounded-2xl bg-gradient-to-br from-red-600 via-slate-900 to-black border-2 ${
                  drawStack > 0 ? 'border-rose-400 ring-4 ring-rose-500/60 shadow-rose-500/50' : 'border-amber-400'
                } shadow-2xl flex flex-col items-center justify-center transition-all transform duration-200 relative group cursor-pointer ${
                  currentTurnId === 'player' && (drawStack > 0 || !hasDrawnThisTurn)
                    ? 'hover:scale-105 hover:-translate-y-1 ring-4 ring-amber-400/40'
                    : 'opacity-70 cursor-not-allowed'
                }`}
              >
                <div className="w-16 h-26 sm:w-18 sm:h-30 rounded-xl border border-white/20 flex flex-col items-center justify-center bg-black/50">
                  {drawStack > 0 ? (
                    <>
                      <span className="font-black text-rose-400 text-xs animate-bounce">
                        รับโทษ
                      </span>
                      <span className="text-base sm:text-lg font-black text-white font-mono mt-0.5">
                        +{drawStack}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="font-black text-amber-400 text-sm sm:text-base tracking-widest rotate-45">
                        UNO
                      </span>
                      <span className="text-[9.5px] text-slate-300 mt-2 font-mono">
                        {deck.length} ใบ
                      </span>
                    </>
                  )}
                </div>
              </button>
              <span className={`text-[11px] font-bold mt-1.5 ${drawStack > 0 ? 'text-rose-400 font-black' : 'text-amber-300'}`}>
                {drawStack > 0 ? `จั่วรับโทษ +${drawStack} ใบ` : 'กองจั่วการ์ด'}
              </span>
            </div>

            {/* กองการ์ดทิ้ง (Active Discard Pile) */}
            <div className="flex flex-col items-center">
              {currentTopCard ? (
                <div
                  className={`w-20 h-32 sm:w-24 sm:h-36 rounded-2xl ${getCardColorClass(
                    currentTopCard.color === 'wild' ? currentColor : currentTopCard.color
                  )} border-2 border-white/40 shadow-2xl flex flex-col justify-between p-2.5 transform rotate-2 animate-in zoom-in-95 duration-200 relative`}
                >
                  <span className="text-xs font-black self-start">
                    {currentTopCard.label}
                  </span>
                  <div className="text-center my-auto">
                    <span className="text-2xl sm:text-3xl font-black drop-shadow-md">
                      {currentTopCard.label}
                    </span>
                  </div>
                  <span className="text-xs font-black self-end transform rotate-180">
                    {currentTopCard.label}
                  </span>
                </div>
              ) : (
                <div className="w-20 h-32 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center text-xs text-slate-500">
                  ว่างเปล่า
                </div>
              )}
              <span className="text-[11px] text-slate-300 font-bold mt-1.5">ไพ่บนกระดาน</span>
            </div>
          </div>

          {/* ด้านล่างโต๊ะ: ผ่านตา & ประวัติเหตุการณ์ */}
          <div className="z-10 space-y-2 shrink-0">
            {currentTurnId === 'player' && hasDrawnThisTurn && (
              <button
                onClick={handlePlayerPass}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-amber-400/40 shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>ไม่มีไพ่ลง ➔ ผ่านตา</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* กล่องบันทึกเหตุการณ์เกม */}
            <div className="bg-black/50 border border-white/10 rounded-2xl p-2.5 text-left">
              <p className="text-[10px] text-amber-300 font-bold mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>ประวัติการลงไพ่:</span>
              </p>
              <div className="h-12 overflow-y-auto space-y-0.5 text-[10.5px] text-slate-300 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/20">
                {logs.map((log, idx) => (
                  <p key={idx} className="truncate">
                    • {log}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= 3. ฝั่งขวา: ไพ่ในมือของเรา (รองรับการเลือกลง 1-2 ใบ) ================= */}
        <div className="lg:col-span-4 bg-slate-900/80 backdrop-blur-md rounded-3xl border border-white/10 p-3 sm:p-4 flex flex-col justify-between shadow-xl min-h-0">
          {finishedRankings.some((r) => r.isUser) ? (
            // ผู้เล่นวางไพ่หมดมือเรียบร้อยแล้ว ได้อันดับไปแล้ว
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
              <div className="w-16 h-16 rounded-3xl bg-amber-400/20 text-amber-400 flex items-center justify-center text-3xl mb-3 shadow-lg animate-bounce">
                {finishedRankings.find((r) => r.isUser)?.rank === 1 ? '🥇' : '🎉'}
              </div>
              <h3 className="text-xl font-black text-white mb-1">
                คุณทิ้งไพ่หมดมือแล้ว!
              </h3>
              <p className="text-xs text-amber-300 font-bold mb-3">
                คว้าอันดับที่ {finishedRankings.find((r) => r.isUser)?.rank} ไปครองเรียบร้อย 🏆
              </p>
              <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-3.5 max-w-xs w-full text-xs text-slate-300 space-y-1 mb-4">
                <p className="font-semibold text-emerald-400 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>กำลังรับชมบอท AI แข่งขันต่อ</span>
                </p>
                <p className="text-[11px] text-slate-400">
                  เกมจะดำเนินต่อไปจนกว่าจะเหลือคนสุดท้ายที่จะเป็นผู้แพ้
                </p>
              </div>

              {/* ปุ่มข้ามไปดูผลลัพธ์ทันที */}
              <button
                onClick={handleInstantFinishRemaining}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>จำลองผลที่เหลือ & ดูผลลัพธ์ทันที</span>
              </button>
            </div>
          ) : (
            <>
              <div>
                {/* ส่วนหัวฝั่งผู้เล่น */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-bold text-xs sm:text-sm text-white">ไพ่ในมือของคุณ</h2>
                      <p className="text-[10px] text-emerald-300 font-mono">
                        {currentTurnId === 'player' ? '👉 ตาของคุณ (คลิกเพื่อเลือก)' : '⏳ รอตากลยุทธ์ของบอท'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold font-mono">
                    {playerHand.length} ใบ
                  </span>
                </div>

                {/* แถบการเลือกไพ่ (เลือกลงได้ 1-2 ใบ) */}
                <div className="bg-slate-950/70 border border-amber-500/40 rounded-2xl p-2.5 mb-2.5 shadow-md flex items-center justify-between gap-2">
                  <div className="text-left">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                      เลือกไว้: {selectedCardIds.length} / 2 ใบ
                    </span>
                    <span className="text-xs font-black text-amber-300">
                      {drawStack > 0
                        ? `⚠️ โดนโทษสะสม +${drawStack} ใบ! ลง +2 หรือ +4 เพื่อหลบ หรือคลิกจั่วรับโทษ`
                        : selectedCardIds.length === 0
                        ? 'คลิกไพ่ในมือเพื่อเลือกลง (สูงสุด 2 ใบ)'
                        : selectedCardIds.length === 1
                        ? 'เลือกแล้ว 1 ใบ (คลิกอีกใบที่เลขเหมือนกันเพื่อลงคู่)'
                        : 'เลือกครบ 2 ใบแล้ว! พร้อมลงคู่ 🔥'}
                    </span>
                  </div>

                  {selectedCardIds.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedCardIds([])}
                        className="p-1 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-white/5 transition"
                        title="ล้างที่เลือก"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <button
                        onClick={handleConfirmPlaySelected}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black shadow-lg transition transform active:scale-95 cursor-pointer flex items-center gap-1 ${
                          selectedCardIds.length === 2
                            ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 hover:from-amber-500 hover:to-yellow-600 ring-2 ring-yellow-300'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        <span>
                          {drawStack > 0
                            ? selectedCardIds.length === 2
                              ? 'ลงคู่หลบโทษ 🔥'
                              : 'ลงหลบโทษ 🛡️'
                            : selectedCardIds.length === 2
                            ? 'ลงคู่ 2 ใบ 🔥'
                            : 'ลง 1 ใบ'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* แสดงการ์ดในมือของผู้เล่น */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[320px] overflow-y-auto p-1.5 bg-slate-950/40 rounded-2xl border border-white/5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/20">
                  {playerHand.map((card) => {
                    const isSelected = selectedCardIds.includes(card.id)
                    const isFirstCard = selectedCardIds[0] === card.id

                    // คำนวณว่าการ์ดนี้คลิกได้ไหม
                    let isClickable = false
                    if (currentTurnId === 'player') {
                      if (isSelected) {
                        isClickable = true
                      } else if (selectedCardIds.length === 0) {
                        const canPlayDirect = canPlayFirstCard(card, currentTopCard, currentColor, drawStack)
                        const hasPlayablePartner = playerHand.some(
                          (c) => c.id !== card.id && c.value === card.value && canPlayFirstCard(c, currentTopCard, currentColor, drawStack)
                        )
                        isClickable = canPlayDirect || hasPlayablePartner
                      } else if (selectedCardIds.length === 1) {
                        const firstCard = playerHand.find((c) => c.id === selectedCardIds[0])
                        isClickable = canPlaySecondCard(card, firstCard) || canPlayFirstCard(card, currentTopCard, currentColor, drawStack)
                      }
                    }

                    return (
                      <button
                        key={card.id}
                        onClick={() => handleCardClick(card)}
                        disabled={!isClickable}
                        className={`w-full h-22 sm:h-26 rounded-xl ${getCardColorClass(
                          card.color
                        )} flex flex-col justify-between p-1.5 transition-all duration-200 transform relative select-none ${
                          isSelected
                            ? '-translate-y-2 ring-4 ring-amber-300 shadow-2xl scale-105 z-20'
                            : isClickable
                            ? 'hover:-translate-y-1 hover:scale-102 ring-1 ring-white/60 shadow-md cursor-pointer'
                            : 'opacity-40 grayscale-[40%] cursor-not-allowed'
                        }`}
                      >
                        {/* ป้ายลำดับที่เลือก (1 หรือ 2) */}
                        {isSelected && (
                          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-md border border-white">
                            {isFirstCard ? '1' : '2'}
                          </span>
                        )}

                        <span className="text-[10px] font-black self-start leading-none">
                          {card.label}
                        </span>
                        <span className="text-xl font-black mx-auto drop-shadow-sm leading-none">
                          {card.label}
                        </span>
                        <span className="text-[10px] font-black self-end transform rotate-180 leading-none">
                          {card.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* สรุปด้านล่าง: ปุ่มช่วยจั่วการ์ด */}
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between shrink-0">
                <span className="text-[11px] text-slate-400">
                  {playerHand.length === 1 ? '🔥 UNO! เหลือไพ่ใบสุดท้ายแล้ว!' : `เหลืออีก ${playerHand.length} ใบ`}
                </span>

                {currentTurnId === 'player' && (
                  drawStack > 0 ? (
                    <button
                      onClick={handlePlayerDraw}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-black rounded-lg border border-rose-400/80 shadow-lg transition cursor-pointer flex items-center gap-1.5 animate-pulse"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>จั่วรับโทษสะสม (+{drawStack} ใบ)</span>
                    </button>
                  ) : !hasDrawnThisTurn && (
                    <button
                      onClick={handlePlayerDraw}
                      className="px-3 py-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-xs font-bold rounded-lg border border-amber-400/40 transition cursor-pointer"
                    >
                      + จั่วการ์ด 1 ใบ
                    </button>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default UnoGame
