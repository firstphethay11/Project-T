import { useState, useEffect, useRef } from 'react'
import {
  Shield,
  Zap,
  Flame,
  Swords,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Volume2,
  VolumeX,
  Play,
  Award,
  ChevronRight,
  Eye,
  Layers,
  Sparkles,
  Info,
  X,
  RefreshCw,
  Move,
} from 'lucide-react'
import { VANGUARD_CARDS, PRESET_DECKS } from '../data/vanguardCards'

// ==========================================
// AUDIO SYNTHESIZER (Web Audio API)
// ==========================================
const playSoundEffect = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    const now = ctx.currentTime
    if (type === 'ride') {
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(220, now)
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.35)
      gain.gain.setValueAtTime(0.3, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35)
      osc.start(now)
      osc.stop(now + 0.35)
    } else if (type === 'attack') {
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(400, now)
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.25)
      gain.gain.setValueAtTime(0.35, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25)
      osc.start(now)
      osc.stop(now + 0.25)
    } else if (type === 'trigger') {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(523.25, now)
      osc.frequency.setValueAtTime(659.25, now + 0.1)
      osc.frequency.setValueAtTime(783.99, now + 0.2)
      osc.frequency.setValueAtTime(1046.5, now + 0.3)
      gain.gain.setValueAtTime(0.4, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5)
      osc.start(now)
      osc.stop(now + 0.5)
    } else if (type === 'damage') {
      osc.type = 'square'
      osc.frequency.setValueAtTime(150, now)
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.3)
      gain.gain.setValueAtTime(0.4, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
      osc.start(now)
      osc.stop(now + 0.3)
    } else if (type === 'guard') {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(300, now)
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.2)
      gain.gain.setValueAtTime(0.25, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25)
      osc.start(now)
      osc.stop(now + 0.25)
    }
  } catch {
    // AudioContext blocked
  }
}

// Helper: สร้างเด็ค 50 ใบพร้อมสับ
const buildFullDeckArray = (preset) => {
  const cards = []
  preset.cardList.forEach((item) => {
    const cardData = VANGUARD_CARDS.find((c) => c.id === item.cardId)
    if (cardData) {
      for (let i = 0; i < item.count; i++) {
        cards.push({
          ...cardData,
          instanceId: `${cardData.id}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          tempPowerBonus: 0,
          tempCritBonus: 0,
          isRest: false,
        })
      }
    }
  })
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }
  return cards
}

export default function VanguardGame({ currentUser }) {
  const [activeTab, setActiveTab] = useState('arena')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [hoveredCard, setHoveredCard] = useState(null)

  // ==========================================
  // DECK BUILDER STATE
  // ==========================================
  const [selectedClan, setSelectedClan] = useState('Royal Paladin')
  const [filterGrade, setFilterGrade] = useState('all')
  const [customDeckCards, setCustomDeckCards] = useState(() => {
    return [...PRESET_DECKS.royal_paladin.cardList]
  })

  const deckStats = {
    totalCards: customDeckCards.reduce((acc, c) => acc + c.count, 0),
    triggers: customDeckCards.reduce((acc, c) => {
      const card = VANGUARD_CARDS.find((x) => x.id === c.cardId)
      return card && card.triggerType ? acc + c.count : acc
    }, 0),
    healTriggers: customDeckCards.reduce((acc, c) => {
      const card = VANGUARD_CARDS.find((x) => x.id === c.cardId)
      return card && card.triggerType === 'Heal' ? acc + c.count : acc
    }, 0),
    grade0: customDeckCards.reduce((acc, c) => {
      const card = VANGUARD_CARDS.find((x) => x.id === c.cardId)
      return card && card.grade === 0 ? acc + c.count : acc
    }, 0),
    grade1: customDeckCards.reduce((acc, c) => {
      const card = VANGUARD_CARDS.find((x) => x.id === c.cardId)
      return card && card.grade === 1 ? acc + c.count : acc
    }, 0),
    grade2: customDeckCards.reduce((acc, c) => {
      const card = VANGUARD_CARDS.find((x) => x.id === c.cardId)
      return card && card.grade === 2 ? acc + c.count : acc
    }, 0),
    grade3: customDeckCards.reduce((acc, c) => {
      const card = VANGUARD_CARDS.find((x) => x.id === c.cardId)
      return card && card.grade === 3 ? acc + c.count : acc
    }, 0),
  }

  const isDeckValid =
    deckStats.totalCards === 50 &&
    deckStats.triggers === 16 &&
    deckStats.healTriggers <= 4

  const handleAddCardToDeck = (cardId) => {
    const existing = customDeckCards.find((c) => c.cardId === cardId)
    const cardData = VANGUARD_CARDS.find((c) => c.id === cardId)

    if (deckStats.totalCards >= 50) {
      alert('เด็คครบ 50 ใบแล้ว')
      return
    }
    if (existing && existing.count >= 4) {
      alert('การ์ดชื่อเดียวกันใส่ได้ไม่เกิน 4 ใบ')
      return
    }
    if (cardData.triggerType === 'Heal' && deckStats.healTriggers >= 4) {
      alert('Heal Trigger ใส่ได้สูงสุด 4 ใบ')
      return
    }
    if (cardData.triggerType && deckStats.triggers >= 16) {
      alert('Trigger ใส่ได้ไม่เกิน 16 ใบพอดี')
      return
    }

    if (existing) {
      setCustomDeckCards(
        customDeckCards.map((c) =>
          c.cardId === cardId ? { ...c, count: c.count + 1 } : c
        )
      )
    } else {
      setCustomDeckCards([...customDeckCards, { cardId, count: 1 }])
    }
  }

  const handleRemoveCardFromDeck = (cardId) => {
    const existing = customDeckCards.find((c) => c.cardId === cardId)
    if (!existing) return
    if (existing.count > 1) {
      setCustomDeckCards(
        customDeckCards.map((c) =>
          c.cardId === cardId ? { ...c, count: c.count - 1 } : c
        )
      )
    } else {
      setCustomDeckCards(customDeckCards.filter((c) => c.cardId !== cardId))
    }
  }

  const handleLoadPreset = (key) => {
    const preset = PRESET_DECKS[key]
    if (preset) {
      setSelectedClan(preset.clan)
      setCustomDeckCards([...preset.cardList])
    }
  }

  // ==========================================
  // BATTLE ARENA ENGINE (V-Series Official Rules)
  // ==========================================
  const [matchStatus, setMatchStatus] = useState('idle')
  const [turnPlayer, setTurnPlayer] = useState('player')
  const [turnCount, setTurnCount] = useState(1)
  const [currentPhase, setCurrentPhase] = useState('STAND')

  // Combat Log
  const [battleLogs, setBattleLogs] = useState([])
  const logBattle = (msg) => {
    setBattleLogs((prev) => [
      `[T${turnCount} ${currentPhase}] ${msg}`,
      ...prev.slice(0, 40),
    ])
  }

  // Drag and Drop State
  const [draggedCard, setDraggedCard] = useState(null)
  const [dragOverCircle, setDragOverCircle] = useState(null)

  // Player State
  const [playerDeck, setPlayerDeck] = useState([])
  const [playerHand, setPlayerHand] = useState([])
  const [playerDrop, setPlayerDrop] = useState([])
  const [playerDamage, setPlayerDamage] = useState([])
  const [playerSoul, setPlayerSoul] = useState([])
  const [playerVanguard, setPlayerVanguard] = useState(null)
  const [playerRearguards, setPlayerRearguards] = useState({
    fl: null, // Front-Left
    fr: null, // Front-Right
    bl: null, // Back-Left
    bc: null, // Back-Center
    br: null, // Back-Right
  })
  const [playerGuardian, setPlayerGuardian] = useState([])
  const [playerGiftCount, setPlayerGiftCount] = useState(0)
  const [playerTriggerZone, setPlayerTriggerZone] = useState(null)

  // Opponent (AI) State
  const [oppDeck, setOppDeck] = useState([])
  const [oppHand, setOppHand] = useState([])
  const [oppDrop, setOppDrop] = useState([])
  const [oppDamage, setOppDamage] = useState([])
  const [oppSoul, setOppSoul] = useState([])
  const [oppVanguard, setOppVanguard] = useState(null)
  const [oppRearguards, setOppRearguards] = useState({
    fl: null,
    fr: null,
    bl: null,
    bc: null,
    br: null,
  })
  const [oppGuardian, setOppGuardian] = useState([])
  const [oppGiftCount, setOppGiftCount] = useState(0)
  const [oppTriggerZone, setOppTriggerZone] = useState(null)

  // Combat Targeting
  const [selectedAttackerCircle, setSelectedAttackerCircle] = useState(null)
  const [selectedTargetCircle, setSelectedTargetCircle] = useState(null)

  // เริ่มแมตช์ใหม่
  const handleStartGame = (playerPresetKey = 'royal_paladin', oppPresetKey = 'kagero') => {
    const pDeck = buildFullDeckArray(PRESET_DECKS[playerPresetKey])
    const oDeck = buildFullDeckArray(PRESET_DECKS[oppPresetKey])

    const pFVIndex = pDeck.findIndex((c) => c.cardType === 'First Vanguard' || c.grade === 0)
    const oFVIndex = oDeck.findIndex((c) => c.cardType === 'First Vanguard' || c.grade === 0)

    const pFV = pDeck.splice(pFVIndex >= 0 ? pFVIndex : 0, 1)[0]
    const oFV = oDeck.splice(oFVIndex >= 0 ? oFVIndex : 0, 1)[0]

    const pHand = pDeck.splice(0, 5)
    const oHand = oDeck.splice(0, 5)

    setPlayerVanguard(pFV)
    setOppVanguard(oFV)
    setPlayerDeck(pDeck)
    setOppDeck(oDeck)
    setPlayerHand(pHand)
    setOppHand(oHand)
    setPlayerDrop([])
    setOppDrop([])
    setPlayerDamage([])
    setOppDamage([])
    setPlayerSoul([])
    setOppSoul([])
    setPlayerGuardian([])
    setOppGuardian([])
    setPlayerGiftCount(0)
    setOppGiftCount(0)
    setPlayerRearguards({ fl: null, fr: null, bl: null, bc: null, br: null })
    setOppRearguards({ fl: null, fr: null, bl: null, bc: null, br: null })
    setPlayerTriggerZone(null)
    setOppTriggerZone(null)

    setTurnPlayer('player')
    setTurnCount(1)
    setCurrentPhase('MAIN')
    setMatchStatus('playing')
    setBattleLogs([
      '⚔️ สแตนด์อัพ! เดอะ แวนการ์ด! (Stand Up! The Vanguard!)',
      '💡 คำแนะนำ: ลากการ์ดจากมือมาวางที่วงกลมเพื่อไรด์ (VC) หรือคอลเรียร์การ์ด (ทุกช่อง หน้า-หลัง)',
      `👤 ฝ่ายคุณ: ${pFV.nameTh} (G${pFV.grade})`,
      `🤖 ฝ่ายศัตรู: ${oFV.nameTh} (G${oFV.grade})`,
    ])

    if (soundEnabled) playSoundEffect('ride')
  }

  // เช็กจบเกม
  useEffect(() => {
    if (matchStatus === 'playing') {
      if (playerDamage.length >= 6) {
        setMatchStatus('defeat')
        logBattle('💀 คุณโดนดาเมจครบ 6 แดม พ่ายแพ้การประลอง!')
      } else if (oppDamage.length >= 6) {
        setMatchStatus('victory')
        logBattle('🏆 ยินดีด้วย! คุณทำดาเมจศัตรูครบ 6 แดม คว้าชัยชนะ!')
      } else if (playerDeck.length === 0) {
        setMatchStatus('defeat')
        logBattle('💀 กองการ์ดของคุณหมด (Deck Out) พ่ายแพ้!')
      } else if (oppDeck.length === 0) {
        setMatchStatus('victory')
        logBattle('🏆 กองการ์ดของศัตรูหมด (Deck Out) คุณชนะ!')
      }
    }
  }, [playerDamage, oppDamage, playerDeck, oppDeck, matchStatus])

  // คำนวณพลังรวม
  const getCirclePower = (circleKey) => {
    let unit = circleKey === 'vc' ? playerVanguard : playerRearguards[circleKey]
    if (!unit) return 0
    let total = unit.power + (unit.tempPowerBonus || 0)
    if (circleKey === 'vc' && playerGiftCount > 0) {
      total += playerGiftCount * 10000
    }
    return total
  }

  const getOppCirclePower = (circleKey) => {
    let unit = circleKey === 'vc' ? oppVanguard : oppRearguards[circleKey]
    if (!unit) return 0
    let total = unit.power + (unit.tempPowerBonus || 0)
    if (circleKey === 'vc' && oppGiftCount > 0) {
      total += oppGiftCount * 10000
    }
    return total
  }

  // ==========================================
  // DRAG & DROP LOGIC (ลากการ์ดจากมือลงสนาม)
  // ==========================================
  const handleDragStart = (e, card, index) => {
    setDraggedCard({ ...card, handIndex: index })
    e.dataTransfer.setData('text/plain', JSON.stringify({ cardId: card.id, handIndex: index }))
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, circleKey) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverCircle !== circleKey) {
      setDragOverCircle(circleKey)
    }
  }

  const handleDragLeave = (e) => {
    setDragOverCircle(null)
  }

  const handleDropOnCircle = (e, circleKey) => {
    e.preventDefault()
    setDragOverCircle(null)
    if (!draggedCard) return

    const card = draggedCard
    const handIndex = draggedCard.handIndex

    if (circleKey === 'vc') {
      // ทำการ RIDE ลงช่อง Vanguard
      handleExecuteRide(card, handIndex)
    } else if (circleKey === 'gc') {
      // วางป้องกันในช่อง GUARD
      handleExecuteGuard(card, handIndex)
    } else if (['fl', 'fr', 'bl', 'bc', 'br'].includes(circleKey)) {
      // ทำการ CALL ลงช่อง Rear-Guard (ทั้งแถวหน้า FL, FR และแถวหลัง BL, BC, BR!)
      handleExecuteCall(card, handIndex, circleKey)
    }
    setDraggedCard(null)
  }

  // ดำเนินการ RIDE
  const handleExecuteRide = (card, handIndex) => {
    if (turnPlayer !== 'player') return
    const currentGrade = playerVanguard ? playerVanguard.grade : 0

    if (card.grade !== currentGrade && card.grade !== currentGrade + 1) {
      alert(
        `ไม่สามารถไรด์ได้! เกรดของการ์ดต้องเป็นเกรดเดิม (${currentGrade}) หรือสูงกว่า 1 เกรด (${currentGrade + 1})`
      )
      return
    }

    const newHand = [...playerHand]
    newHand.splice(handIndex, 1)
    setPlayerHand(newHand)

    if (playerVanguard) {
      setPlayerSoul((prev) => [playerVanguard, ...prev])
    }

    const newVG = { ...card, isRest: false, tempPowerBonus: 0, tempCritBonus: 0 }
    setPlayerVanguard(newVG)

    if (newVG.grade === 3 && newVG.gift === 'Force') {
      setPlayerGiftCount((prev) => prev + 1)
      logBattle(`🎁 ได้รับ Imaginary Gift: Force I! ช่อง Vanguard ได้รับ Power +10,000 ถาวร!`)
    }

    logBattle(`✨ ไรด์! [${newVG.nameTh}] (Grade ${newVG.grade}) สู่ช่องแวนการ์ด!`)
    if (soundEnabled) playSoundEffect('ride')
  }

  // ดำเนินการ CALL ลงเรียร์การ์ด (ทั้ง 5 ช่อง: หน้า 2 หลัง 3)
  const handleExecuteCall = (card, handIndex, circleKey) => {
    if (turnPlayer !== 'player') return
    const currentVGGrade = playerVanguard ? playerVanguard.grade : 0

    if (card.grade > currentVGGrade) {
      alert(
        `ไม่สามารถคอลเกรด ${card.grade} ได้ เพราะเกรดของแวนการ์ดในตอนนี้คือเกรด ${currentVGGrade}`
      )
      return
    }

    const newHand = [...playerHand]
    newHand.splice(handIndex, 1)
    setPlayerHand(newHand)

    const existingUnit = playerRearguards[circleKey]
    if (existingUnit) {
      setPlayerDrop((prev) => [existingUnit, ...prev])
      logBattle(`🪦 ส่ง [${existingUnit.nameTh}] ลง Drop zone เพื่อคอลตัวใหม่`)
    }

    const newUnit = {
      ...card,
      isRest: false,
      tempPowerBonus: 0,
      tempCritBonus: 0,
    }

    setPlayerRearguards((prev) => ({
      ...prev,
      [circleKey]: newUnit,
    }))

    const circleName = {
      fl: 'แถวหน้า-ซ้าย (Front-Left)',
      fr: 'แถวหน้า-ขวา (Front-Right)',
      bl: 'แถวหลัง-ซ้าย (Back-Left)',
      bc: 'แถวหลัง-กลาง (Back-Center)',
      br: 'แถวหลัง-ขวา (Back-Right)',
    }[circleKey]

    logBattle(`⚔️ คอล [${newUnit.nameTh}] (G${newUnit.grade}) ลงช่อง ${circleName}!`)
    if (soundEnabled) playSoundEffect('attack')
  }

  // ดำเนินการ GUARD
  const handleExecuteGuard = (card, handIndex) => {
    const newHand = [...playerHand]
    newHand.splice(handIndex, 1)
    setPlayerHand(newHand)
    setPlayerDrop((prev) => [card, ...prev])
    logBattle(`🛡️ ใช้ [${card.nameTh}] การ์ดป้องกัน (+${(card.shield || 5000) / 1000}k Shield)!`)
    if (soundEnabled) playSoundEffect('guard')
  }

  // สั่งโจมตี
  const handleDeclareAttack = (attackerKey) => {
    if (turnPlayer !== 'player' || currentPhase !== 'BATTLE') return

    const attacker = attackerKey === 'vc' ? playerVanguard : playerRearguards[attackerKey]
    if (!attacker) return
    if (attacker.isRest) {
      alert('ยูนิตนี้โจมตีไปแล้วในเทิร์นนี้ (Rest อยู่)')
      return
    }

    if (attackerKey !== 'vc' && attackerKey !== 'fl' && attackerKey !== 'fr') {
      alert('ยูนิตแถวหลังทำหน้าที่บูสต์ (Boost) ให้แถวหน้าเท่านั้น ไม่สามารถสั่งโจมตีเดี่ยวได้')
      return
    }

    setSelectedAttackerCircle(attackerKey)
    logBattle(
      `🎯 เลือก [${attacker.nameTh}] เตรียมโจมตี! คลิกเลือกเป้าหมายฝั่งศัตรู (VG หรือ RG หน้า)`
    )
  }

  // เลือกเป้าหมายและตัดสินผล
  const handleSelectTarget = (targetKey) => {
    if (!selectedAttackerCircle) return

    const attacker =
      selectedAttackerCircle === 'vc'
        ? playerVanguard
        : playerRearguards[selectedAttackerCircle]

    if (selectedAttackerCircle === 'vc') {
      setPlayerVanguard((prev) => ({ ...prev, isRest: true }))
    } else {
      setPlayerRearguards((prev) => ({
        ...prev,
        [selectedAttackerCircle]: {
          ...prev[selectedAttackerCircle],
          isRest: true,
        },
      }))
    }

    setSelectedTargetCircle(targetKey)

    let totalAtk = getCirclePower(selectedAttackerCircle)

    // บูสต์จากแถวหลังอัตโนมัติ
    let boostUnit = null
    if (selectedAttackerCircle === 'vc' && playerRearguards.bc && !playerRearguards.bc.isRest) {
      boostUnit = playerRearguards.bc
      setPlayerRearguards((prev) => ({ ...prev, bc: { ...prev.bc, isRest: true } }))
    } else if (selectedAttackerCircle === 'fl' && playerRearguards.bl && !playerRearguards.bl.isRest) {
      boostUnit = playerRearguards.bl
      setPlayerRearguards((prev) => ({ ...prev, bl: { ...prev.bl, isRest: true } }))
    } else if (selectedAttackerCircle === 'fr' && playerRearguards.br && !playerRearguards.br.isRest) {
      boostUnit = playerRearguards.br
      setPlayerRearguards((prev) => ({ ...prev, br: { ...prev.br, isRest: true } }))
    }

    if (boostUnit) {
      totalAtk += boostUnit.power
      logBattle(
        `⚡ ได้รับการบูสต์จาก [${boostUnit.nameTh}] (+${boostUnit.power})! พลังรวม: ${totalAtk}`
      )
    }

    if (soundEnabled) playSoundEffect('attack')
    logBattle(
      `💥 [${attacker.nameTh}] โจมตี [${targetKey === 'opp-vc' ? 'แวนการ์ดศัตรู' : 'เรียร์การ์ดศัตรู'}]! (พลัง: ${totalAtk})`
    )

    if (selectedAttackerCircle === 'vc') {
      const driveCount = attacker.skillType === 'Twin Drive' ? 2 : 1
      logBattle(`🎲 แวนการ์ดโจมตี! Drive Check (${driveCount} ครั้ง)!`)
      performDriveCheck(driveCount, totalAtk, targetKey)
    } else {
      resolveDamageStep(totalAtk, targetKey, attacker.critical || 1)
    }
  }

  // Drive Check
  const performDriveCheck = (drivesRemaining, currentAtk, targetKey) => {
    if (playerDeck.length === 0) return

    const newDeck = [...playerDeck]
    const checkCard = newDeck.shift()
    setPlayerDeck(newDeck)
    setPlayerTriggerZone(checkCard)
    setPlayerHand((prev) => [...prev, checkCard])

    let updatedAtk = currentAtk
    let addedCrit = 0

    if (checkCard.triggerType) {
      if (soundEnabled) playSoundEffect('trigger')
      logBattle(`🌟 TRIGGER CHECK!! [${checkCard.triggerType.toUpperCase()} TRIGGER] จาก ${checkCard.nameTh}!`)

      if (checkCard.triggerType === 'Critical') {
        updatedAtk += 10000
        addedCrit += 1
        logBattle(`🔥 Critical Trigger: Power +10,000 & Critical +1!`)
      } else if (checkCard.triggerType === 'Draw') {
        updatedAtk += 10000
        if (newDeck.length > 0) {
          const drawCard = newDeck.shift()
          setPlayerDeck(newDeck)
          setPlayerHand((prev) => [...prev, drawCard])
          logBattle(`🃏 Draw Trigger: Power +10,000 & จั่วการ์ด 1 ใบ!`)
        }
      } else if (checkCard.triggerType === 'Heal') {
        updatedAtk += 10000
        if (playerDamage.length >= oppDamage.length && playerDamage.length > 0) {
          const healed = playerDamage.pop()
          setPlayerDrop((prev) => [healed, ...prev])
          setPlayerDamage([...playerDamage])
          logBattle(`💚 Heal Trigger: Power +10,000 & ฟื้นฟู 1 ดาเมจ!`)
        }
      }
    } else {
      logBattle(`⚪ Drive Check: [${checkCard.nameTh}] (ไม่มีทริกเกอร์)`)
    }

    if (drivesRemaining > 1) {
      setTimeout(() => {
        performDriveCheck(drivesRemaining - 1, updatedAtk, targetKey)
      }, 1100)
    } else {
      setTimeout(() => {
        resolveDamageStep(updatedAtk, targetKey, (playerVanguard.critical || 1) + addedCrit)
      }, 900)
    }
  }

  // Damage Step
  const resolveDamageStep = (attackerPower, targetKey, critCount) => {
    let defenderPower = 0
    if (targetKey === 'opp-vc') defenderPower = getOppCirclePower('vc')
    else if (targetKey === 'opp-fl') defenderPower = getOppCirclePower('fl')
    else if (targetKey === 'opp-fr') defenderPower = getOppCirclePower('fr')

    logBattle(`⚔️ วัดพลัง: ฝ่ายรุก ${attackerPower} VS ฝ่ายรับ ${defenderPower}`)

    if (attackerPower >= defenderPower) {
      if (soundEnabled) playSoundEffect('damage')
      if (targetKey === 'opp-vc') {
        logBattle(`💥 HIT! แวนการ์ดศัตรูได้รับ ${critCount} ดาเมจ!`)
        performOppDamageCheck(critCount)
      } else {
        const circle = targetKey.replace('opp-', '')
        const retired = oppRearguards[circle]
        if (retired) {
          setOppDrop((prev) => [retired, ...prev])
          setOppRearguards((prev) => ({ ...prev, [circle]: null }))
          logBattle(`💀 ทำลาย (Retire) [${retired.nameTh}] ของศัตรูลง Drop Zone!`)
        }
      }
    } else {
      if (soundEnabled) playSoundEffect('guard')
      logBattle(`🛡️ โจมตีไม่สำเร็จ! พลังป้องกันของศัตรูสูงกว่า`)
    }

    setSelectedAttackerCircle(null)
    setSelectedTargetCircle(null)
  }

  const performOppDamageCheck = (damagesRemaining) => {
    if (damagesRemaining <= 0 || oppDeck.length === 0) return

    const newDeck = [...oppDeck]
    const damCard = newDeck.shift()
    setOppDeck(newDeck)
    setOppTriggerZone(damCard)
    setOppDamage((prev) => [...prev, { ...damCard, isFaceDown: false }])

    if (damCard.triggerType) {
      if (soundEnabled) playSoundEffect('trigger')
      logBattle(`🚨 ศัตรูเปิดพบ [${damCard.triggerType.toUpperCase()} TRIGGER] จากดาเมจเช็ก!`)
    }

    if (damagesRemaining > 1) {
      setTimeout(() => {
        performOppDamageCheck(damagesRemaining - 1)
      }, 1000)
    }
  }

  // เปลี่ยนเฟส
  const handleNextPhase = () => {
    if (turnPlayer !== 'player') return

    if (currentPhase === 'STAND') {
      if (playerVanguard) setPlayerVanguard((prev) => ({ ...prev, isRest: false }))
      setPlayerRearguards((prev) => {
        const next = { ...prev }
        Object.keys(next).forEach((k) => {
          if (next[k]) next[k] = { ...next[k], isRest: false }
        })
        return next
      })
      setCurrentPhase('DRAW')
      logBattle('🔄 Stand Phase: สแตนด์ยูนิตทุกใบในแนวตั้ง')
    } else if (currentPhase === 'DRAW') {
      if (playerDeck.length > 0) {
        const newDeck = [...playerDeck]
        const drawn = newDeck.shift()
        setPlayerDeck(newDeck)
        setPlayerHand((prev) => [...prev, drawn])
        logBattle(`📥 Draw Phase: จั่ว [${drawn.nameTh}] ขึ้นมือ`)
      }
      setCurrentPhase('MAIN')
    } else if (currentPhase === 'MAIN') {
      setCurrentPhase('BATTLE')
      logBattle('⚔️ Battle Phase: สั่งแถวหน้าโจมตีศัตรู!')
    } else if (currentPhase === 'BATTLE') {
      setCurrentPhase('END')
      logBattle('🏁 End Phase: จบเทิร์นของผู้เล่น สลับสู่เทิร์นศัตรู')
      setTimeout(() => {
        handleAITurn()
      }, 1000)
    }
  }

  // AI Turn
  const handleAITurn = () => {
    setTurnPlayer('opponent')
    logBattle('🤖 เริ่มต้นเทิร์นของคู่ต่อสู้ (AI Turn)...')

    // Stand
    setOppVanguard((prev) => (prev ? { ...prev, isRest: false } : prev))
    setOppRearguards((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((k) => {
        if (next[k]) next[k] = { ...next[k], isRest: false }
      })
      return next
    })

    // Draw
    let newOppDeck = [...oppDeck]
    let newOppHand = [...oppHand]
    if (newOppDeck.length > 0) {
      const drawn = newOppDeck.shift()
      newOppHand.push(drawn)
      setOppDeck(newOppDeck)
      setOppHand(newOppHand)
      logBattle(`🤖 ศัตรูจั่วการ์ด 1 ใบ`)
    }

    // Ride Check
    setTimeout(() => {
      const curGrade = oppVanguard ? oppVanguard.grade : 0
      const rideCandidateIndex = newOppHand.findIndex((c) => c.grade === curGrade + 1)
      if (rideCandidateIndex >= 0) {
        const cardToRide = newOppHand.splice(rideCandidateIndex, 1)[0]
        setOppSoul((prev) => (oppVanguard ? [oppVanguard, ...prev] : prev))
        const newVG = { ...cardToRide, isRest: false }
        setOppVanguard(newVG)
        setOppHand([...newOppHand])
        if (newVG.grade === 3) {
          setOppGiftCount((prev) => prev + 1)
          logBattle(`🎁 ศัตรูได้รับ Imaginary Gift: Force I!`)
        }
        logBattle(`✨ ศัตรูทำการไรด์ [${newVG.nameTh}] (G${newVG.grade})!`)
        if (soundEnabled) playSoundEffect('ride')
      }

      // Call Check (AI calls front and back)
      const callCandidates = newOppHand.filter(
        (c) => c.grade <= (oppVanguard ? oppVanguard.grade : 1) && !c.triggerType
      )
      if (callCandidates.length > 0 && !oppRearguards.fl) {
        const toCall = callCandidates[0]
        const cIdx = newOppHand.findIndex((c) => c.instanceId === toCall.instanceId)
        newOppHand.splice(cIdx, 1)
        setOppHand([...newOppHand])
        setOppRearguards((prev) => ({
          ...prev,
          fl: { ...toCall, isRest: false },
        }))
        logBattle(`⚔️ ศัตรูคอล [${toCall.nameTh}] ลงช่องแถวหน้า`)
      }

      // Attack
      setTimeout(() => {
        logBattle(`💥 แวนการ์ดศัตรู [${oppVanguard ? oppVanguard.nameTh : 'VG'}] บุกโจมตีแวนการ์ดของคุณ!`)
        setOppVanguard((prev) => (prev ? { ...prev, isRest: true } : prev))

        if (newOppDeck.length > 0) {
          const driveCard = newOppDeck.shift()
          setOppDeck([...newOppDeck])
          setOppTriggerZone(driveCard)
          setOppHand((prev) => [...prev, driveCard])
          logBattle(`🎲 ศัตรู Drive Check: [${driveCard.nameTh}]`)
        }

        setTimeout(() => {
          if (playerDeck.length > 0) {
            const pDeck = [...playerDeck]
            const pDamCard = pDeck.shift()
            setPlayerDeck(pDeck)
            setPlayerTriggerZone(pDamCard)
            setPlayerDamage((prev) => [...prev, { ...pDamCard, isFaceDown: false }])

            if (soundEnabled) playSoundEffect('damage')
            logBattle(`💔 แวนการ์ดของคุณได้รับ 1 ดาเมจ! Damage Check: [${pDamCard.nameTh}]`)
          }

          setTimeout(() => {
            setTurnPlayer('player')
            setTurnCount((c) => c + 1)
            setCurrentPhase('STAND')
            logBattle('🟢 จบเทิร์นศัตรู! กลับสู่เทิร์นของผู้เล่น กด "เปลี่ยนเฟส" เพื่อ Stand')
          }, 1000)
        }, 1200)
      }, 1400)
    }, 1200)
  }

  const toggleDamageFaceDown = (index) => {
    setPlayerDamage((prev) =>
      prev.map((card, i) => (i === index ? { ...card, isFaceDown: !card.isFaceDown } : card))
    )
  }

  // Component เรนเดอร์การ์ดขนาดเล็กพร้อมรูปการ์ดจริง
  const RenderCardItem = ({ card, isRest, showPower = true, isDragging = false }) => {
    if (!card) return null
    return (
      <div
        className={`w-full h-full relative rounded-xl overflow-hidden shadow-md flex flex-col justify-between transition-transform duration-200 select-none ${
          isRest ? 'rotate-90 scale-90' : ''
        } ${isDragging ? 'opacity-40' : ''}`}
        onMouseEnter={() => setHoveredCard(card)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        {/* รูปภาพการ์ดจริง (Official Card Art) */}
        <img
          src={card.artUrl}
          alt={card.nameTh}
          className="w-full h-full object-cover object-top absolute inset-0 rounded-xl pointer-events-none"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = '/vanguard/card-back.png'
          }}
        />

        {/* แถบ Overlay สรุปเกรดและพลัง (เพื่อให้มองเห็นชัดในสนาม) */}
        <div className="relative z-10 p-1 flex justify-between items-center bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <span className="w-5 h-5 rounded-full bg-cyan-950/90 border border-cyan-400 text-cyan-200 font-black text-[10px] flex items-center justify-center shadow">
            {card.grade}
          </span>
          {card.shield > 0 && (
            <span className="px-1 py-0.2 rounded bg-amber-950/80 border border-amber-400 text-amber-200 font-bold text-[9px]">
              +{card.shield / 1000}k
            </span>
          )}
        </div>

        {showPower && (
          <div className="relative z-10 p-1 flex justify-between items-center bg-gradient-to-t from-black/90 via-black/50 to-transparent">
            <span className="text-[10px] font-black text-yellow-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              {card.power + (card.tempPowerBonus || 0)}
            </span>
            <span className="text-[9px] text-slate-200 font-bold truncate max-w-[55px]">
              {card.nameTh}
            </span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* ======================================================== */}
      {/* TOP HEADER                                               */}
      {/* ======================================================== */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-cyan-800/40 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-cyan-500/20 shadow-lg border border-cyan-400/40">
            <Swords className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">
                Cardfight!! Vanguard
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-cyan-950 text-cyan-400 border border-cyan-700/60">
                V-Series
              </span>
            </div>
            <p className="text-xs text-slate-400">
              ลากการ์ดจากมือลงช่องเพื่อไรด์ (VC) หรือคอล (RC ทั้งแถวหน้าและแถวหลัง)
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('arena')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'arena'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Swords className="w-4 h-4" />
            <span>สนามประลอง (Playmat)</span>
          </button>
          <button
            onClick={() => setActiveTab('deckbuilder')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'deckbuilder'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>ระบบจัดเด็ค (Deck Builder)</span>
          </button>
          <button
            onClick={() => setActiveTab('rulebook')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'rulebook'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>กติกาการเล่น (Rules)</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700 cursor-pointer"
            title={soundEnabled ? 'ปิดเสียง' : 'เปิดเสียง'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* TAB 1: BATTLE ARENA (PLAYMAT ACCORDING TO REFERENCE)      */}
      {/* ======================================================== */}
      {activeTab === 'arena' && (
        <div className="flex-1 flex flex-col p-2 sm:p-3 gap-2 max-w-[1580px] mx-auto w-full">
          {/* Phase Control Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">สถานะ:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                  matchStatus === 'playing'
                    ? turnPlayer === 'player'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {matchStatus === 'playing'
                  ? turnPlayer === 'player'
                    ? `เทิร์นของคุณ (Turn ${turnCount})`
                    : `เทิร์นของคู่ต่อสู้ (AI)`
                  : 'ยังไม่ได้เริ่มเกม'}
              </span>

              <div className="hidden md:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                {['STAND', 'DRAW', 'MAIN', 'BATTLE', 'END'].map((p) => (
                  <span
                    key={p}
                    className={`px-2 py-0.5 rounded-md font-bold transition ${
                      currentPhase === p
                        ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-400'
                        : 'text-slate-500'
                    }`}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {matchStatus === 'playing' ? (
                <>
                  {turnPlayer === 'player' && (
                    <button
                      onClick={handleNextPhase}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs hover:from-cyan-400 hover:to-blue-500 transition shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>ถัดไป: {currentPhase === 'BATTLE' ? 'จบเทิร์น' : 'เปลี่ยนเฟส'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleStartGame('royal_paladin', 'kagero')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 transition flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>เริ่มใหม่</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleStartGame('royal_paladin', 'kagero')}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-black text-sm hover:scale-105 transition shadow-lg shadow-cyan-500/25 cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>เริ่มแบทเทิล (Royal Paladin VS Kagero)</span>
                </button>
              )}
            </div>
          </div>

          {/* PLAYMAT MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1">
            {/* THE ARENA BOARD (9 COLUMNS) */}
            <div className="lg:col-span-9 bg-black/95 border border-slate-800/80 rounded-3xl p-3 sm:p-4 flex flex-col justify-between shadow-2xl relative overflow-hidden min-h-[740px]">
              {/* Sci-Fi Grid Background Lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none"></div>

              {/* ---------------------------------------------------- */}
              {/* 1. OPPONENT FIELD (สนามศัตรู)                         */}
              {/* ---------------------------------------------------- */}
              <div className="relative z-10 border-b border-slate-800/60 pb-2">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 px-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-red-400">🤖 ศัตรู (Kagero)</span>
                    <span className="px-2 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-800/40 text-[10px]">
                      Damage: {oppDamage.length}/6
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Deck: {oppDeck.length} ใบ | Hand: {oppHand.length} ใบ
                    </span>
                  </div>
                  {oppGiftCount > 0 && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                      🎁 Force I x{oppGiftCount} (+{oppGiftCount * 10000} Atk)
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-center gap-3 sm:gap-6">
                  {/* Opponent FL RG */}
                  <div
                    onClick={() => selectedAttackerCircle && handleSelectTarget('opp-fl')}
                    className={`w-20 h-28 sm:w-24 sm:h-34 rounded-xl border-2 flex items-center justify-center relative transition ${
                      selectedAttackerCircle
                        ? 'border-yellow-400 shadow-lg shadow-yellow-500/30 cursor-pointer animate-pulse'
                        : 'border-slate-800 bg-slate-900/60'
                    }`}
                  >
                    {oppRearguards.fl ? (
                      <RenderCardItem card={oppRearguards.fl} isRest={oppRearguards.fl.isRest} />
                    ) : (
                      <span className="text-[10px] text-slate-600">RG (Front)</span>
                    )}
                  </div>

                  {/* Opponent Vanguard (VC) */}
                  <div
                    onClick={() => selectedAttackerCircle && handleSelectTarget('opp-vc')}
                    className={`w-24 h-34 sm:w-28 sm:h-40 rounded-xl border-2 flex items-center justify-center relative transition ${
                      selectedAttackerCircle
                        ? 'border-red-500 shadow-xl shadow-red-500/50 cursor-pointer animate-bounce'
                        : 'border-red-700/60 bg-red-950/30'
                    }`}
                  >
                    {oppVanguard ? (
                      <RenderCardItem card={oppVanguard} isRest={oppVanguard.isRest} />
                    ) : (
                      <span className="text-xs text-red-500 font-bold">VANGUARD</span>
                    )}
                  </div>

                  {/* Opponent FR RG */}
                  <div
                    onClick={() => selectedAttackerCircle && handleSelectTarget('opp-fr')}
                    className={`w-20 h-28 sm:w-24 sm:h-34 rounded-xl border-2 flex items-center justify-center relative transition ${
                      selectedAttackerCircle
                        ? 'border-yellow-400 shadow-lg shadow-yellow-500/30 cursor-pointer animate-pulse'
                        : 'border-slate-800 bg-slate-900/60'
                    }`}
                  >
                    {oppRearguards.fr ? (
                      <RenderCardItem card={oppRearguards.fr} isRest={oppRearguards.fr.isRest} />
                    ) : (
                      <span className="text-[10px] text-slate-600">RG (Front)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* 2. PLAYER PLAYMAT (ตามรูปถ่าย V-SERIES เป๊ะ 100%)       */}
              {/* ---------------------------------------------------- */}
              <div className="relative z-10 grid grid-cols-12 gap-2 sm:gap-3 py-2 items-center">
                {/* 2.1 LEFT COLUMN: GIFT (TOP) + DAMAGE ZONE (VERTICAL) */}
                <div className="col-span-2 flex flex-col items-center gap-2">
                  {/* 🎁 GIFT ZONE (ซ้ายบน ตามรูป) */}
                  <div
                    className="w-16 h-22 sm:w-20 sm:h-28 rounded-xl border border-cyan-500/50 bg-slate-950 flex flex-col items-center justify-between p-1 relative shadow-cyan-500/20 shadow-md overflow-hidden"
                    title="Imaginary Gift: Force"
                  >
                    <img
                      src="/vanguard/gift-back.png"
                      alt="Gift Back"
                      className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
                    />
                    <span className="relative z-10 text-[9px] font-black text-cyan-300 uppercase">
                      Gift
                    </span>
                    <span className="relative z-10 text-xs font-black text-white px-2 py-0.5 rounded-full bg-cyan-900/80 border border-cyan-400">
                      x{playerGiftCount}
                    </span>
                    <span className="relative z-10 text-[8px] text-cyan-300 font-bold">
                      Force I
                    </span>
                  </div>

                  {/* 🩸 DAMAGE ZONE (ซ้ายแนวตั้ง 6 สเต็ป ตามรูป) */}
                  <div className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-1.5 flex flex-col gap-1 items-center">
                    <span className="text-[9px] font-black uppercase text-red-400 tracking-wider">
                      Damage Zone
                    </span>
                    <div className="w-full flex flex-col gap-1">
                      {[0, 1, 2, 3, 4, 5].map((slotIdx) => {
                        const card = playerDamage[slotIdx]
                        return (
                          <div
                            key={slotIdx}
                            onClick={() => card && toggleDamageFaceDown(slotIdx)}
                            className={`h-7 rounded-lg border text-[10px] flex items-center justify-between px-1.5 cursor-pointer transition overflow-hidden relative ${
                              card
                                ? card.isFaceDown
                                  ? 'bg-slate-900 border-slate-700 text-slate-500'
                                  : 'bg-red-950/80 border-red-500/70 text-red-200 font-bold shadow-sm'
                                : 'bg-slate-900/40 border-slate-800/60 text-slate-700 justify-center'
                            }`}
                            title={
                              card
                                ? `${card.nameTh} (${card.isFaceDown ? 'คว่ำหน้า CB จ่ายแล้ว' : 'หงายหน้า คลิกเพื่อคว่ำจ่าย CB'})`
                                : `ดาเมจช่องที่ ${slotIdx + 1}`
                            }
                          >
                            {card ? (
                              <>
                                <img
                                  src={card.artUrl}
                                  alt=""
                                  className={`w-5 h-6 object-cover rounded shrink-0 mr-1 ${
                                    card.isFaceDown ? 'grayscale opacity-40' : ''
                                  }`}
                                />
                                <span className={`truncate text-[9px] flex-1 ${card.isFaceDown ? 'line-through text-slate-500' : ''}`}>
                                  {card.nameTh}
                                </span>
                                <span className="text-[8px] px-1 rounded bg-black/60 shrink-0 ml-1">
                                  {card.isFaceDown ? 'CB' : 'Act'}
                                </span>
                              </>
                            ) : (
                              <span>{slotIdx + 1}</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* 2.2 CENTER COLUMN: GUARD (TOP) + 6 FIELD CIRCLES */}
                <div className="col-span-8 flex flex-col items-center gap-2">
                  {/* 🛡️ GUARDIAN CIRCLE (วงเวทย์สีฟ้าตรงกลางบน ตามรูป) */}
                  <div
                    onDragOver={(e) => handleDragOver(e, 'gc')}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDropOnCircle(e, 'gc')}
                    className={`w-22 h-22 sm:w-26 sm:h-26 rounded-full border-2 flex flex-col items-center justify-center relative transition-all backdrop-blur-sm ${
                      dragOverCircle === 'gc'
                        ? 'border-cyan-300 bg-cyan-900/50 scale-110 shadow-cyan-400 shadow-2xl animate-pulse'
                        : 'border-cyan-400/80 bg-cyan-950/30 shadow-cyan-400/30 shadow-xl'
                    }`}
                  >
                    <div className="absolute inset-1 rounded-full border border-dashed border-cyan-300/40 animate-[spin_18s_linear_infinite] pointer-events-none"></div>
                    <Shield className="w-5 h-5 text-cyan-300 mb-0.5" />
                    <span className="text-[10px] font-black text-cyan-200 tracking-wider">
                      GUARD
                    </span>
                    <span className="text-[8px] text-cyan-300/80">
                      {dragOverCircle === 'gc' ? 'ปล่อยเพื่อวางกัน' : 'ลากมาป้องกัน'}
                    </span>
                  </div>

                  {/* 6 CIRCLES GRID */}
                  <div className="w-full flex flex-col gap-2.5">
                    {/* FRONT ROW: [FL] - [VC] - [FR] */}
                    <div className="flex items-center justify-center gap-3 sm:gap-6">
                      {/* 🟢 FRONT-LEFT REARGUARD (FL) */}
                      <div
                        onDragOver={(e) => handleDragOver(e, 'fl')}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDropOnCircle(e, 'fl')}
                        onClick={() => handleDeclareAttack('fl')}
                        className={`w-22 h-30 sm:w-26 sm:h-36 rounded-2xl border-2 flex items-center justify-center relative transition-all ${
                          dragOverCircle === 'fl'
                            ? 'border-yellow-300 bg-emerald-900/60 scale-105 shadow-yellow-400 shadow-xl'
                            : playerRearguards.fl
                            ? 'border-emerald-500 bg-emerald-950/40 shadow-emerald-500/20 shadow-lg cursor-pointer'
                            : 'border-emerald-800/60 bg-emerald-950/20'
                        }`}
                      >
                        {playerRearguards.fl ? (
                          <RenderCardItem
                            card={playerRearguards.fl}
                            isRest={playerRearguards.fl.isRest}
                          />
                        ) : (
                          <div className="flex flex-col items-center pointer-events-none">
                            <div className="w-10 h-10 rounded-full border border-emerald-500/40 flex items-center justify-center mb-1">
                              <span className="text-emerald-400 font-black text-sm">R</span>
                            </div>
                            <span className="text-[9px] font-bold text-emerald-400">REAR (FL)</span>
                            <span className="text-[8px] text-slate-500">ลากการ์ดมาคอล</span>
                          </div>
                        )}
                      </div>

                      {/* ⚔️ VANGUARD CIRCLE (VC วงเวทย์สีแดง วางตัวเอก ตรงกลาง ตามรูป) */}
                      <div
                        onDragOver={(e) => handleDragOver(e, 'vc')}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDropOnCircle(e, 'vc')}
                        onClick={() => handleDeclareAttack('vc')}
                        className={`w-26 h-36 sm:w-30 sm:h-42 rounded-2xl border-2 flex items-center justify-center relative transition-all ${
                          dragOverCircle === 'vc'
                            ? 'border-yellow-300 bg-red-900/70 scale-105 shadow-yellow-400 shadow-2xl'
                            : playerVanguard
                            ? 'border-red-500 bg-gradient-to-b from-red-950/60 to-slate-950 shadow-red-500/40 shadow-2xl cursor-pointer'
                            : 'border-red-700/60 bg-red-950/20'
                        }`}
                      >
                        {playerVanguard ? (
                          <div className="w-full h-full relative">
                            <RenderCardItem
                              card={playerVanguard}
                              isRest={playerVanguard.isRest}
                            />
                            {/* Soul Indicator Badge */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                alert(
                                  `Soul ปัจจุบัน (${playerSoul.length} ใบ):\n` +
                                    playerSoul.map((s, i) => `${i + 1}. ${s.nameTh}`).join('\n')
                                )
                              }}
                              className="absolute top-1 right-1 z-20 px-1.5 py-0.2 rounded bg-purple-900/90 border border-purple-400 text-purple-200 text-[9px] font-black hover:bg-purple-800"
                              title="คลิกเพื่อดูการ์ดใน Soul"
                            >
                              Soul: {playerSoul.length}
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center pointer-events-none">
                            <div className="w-12 h-12 rounded-full border border-red-500/60 flex items-center justify-center mb-1">
                              <span className="text-red-400 font-black text-base">V</span>
                            </div>
                            <span className="text-[10px] font-black text-red-400">VANGUARD</span>
                            <span className="text-[8px] text-red-300">ลากการ์ดมา RIDE</span>
                          </div>
                        )}
                      </div>

                      {/* 🟢 FRONT-RIGHT REARGUARD (FR) */}
                      <div
                        onDragOver={(e) => handleDragOver(e, 'fr')}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDropOnCircle(e, 'fr')}
                        onClick={() => handleDeclareAttack('fr')}
                        className={`w-22 h-30 sm:w-26 sm:h-36 rounded-2xl border-2 flex items-center justify-center relative transition-all ${
                          dragOverCircle === 'fr'
                            ? 'border-yellow-300 bg-emerald-900/60 scale-105 shadow-yellow-400 shadow-xl'
                            : playerRearguards.fr
                            ? 'border-emerald-500 bg-emerald-950/40 shadow-emerald-500/20 shadow-lg cursor-pointer'
                            : 'border-emerald-800/60 bg-emerald-950/20'
                        }`}
                      >
                        {playerRearguards.fr ? (
                          <RenderCardItem
                            card={playerRearguards.fr}
                            isRest={playerRearguards.fr.isRest}
                          />
                        ) : (
                          <div className="flex flex-col items-center pointer-events-none">
                            <div className="w-10 h-10 rounded-full border border-emerald-500/40 flex items-center justify-center mb-1">
                              <span className="text-emerald-400 font-black text-sm">R</span>
                            </div>
                            <span className="text-[9px] font-bold text-emerald-400">REAR (FR)</span>
                            <span className="text-[8px] text-slate-500">ลากการ์ดมาคอล</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* BACK ROW: [BL] - [BC] - [BR] (แถวหลัง คอลได้อิสระ!) */}
                    <div className="flex items-center justify-center gap-3 sm:gap-6">
                      {['bl', 'bc', 'br'].map((key) => {
                        const unit = playerRearguards[key]
                        const label = { bl: 'REAR (BL)', bc: 'REAR (BC)', br: 'REAR (BR)' }[key]

                        return (
                          <div
                            key={key}
                            onDragOver={(e) => handleDragOver(e, key)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDropOnCircle(e, key)}
                            className={`w-20 h-28 sm:w-24 sm:h-32 rounded-2xl border-2 flex items-center justify-center relative transition-all ${
                              dragOverCircle === key
                                ? 'border-yellow-300 bg-emerald-900/60 scale-105 shadow-yellow-400 shadow-lg'
                                : unit
                                ? 'border-emerald-500/80 bg-emerald-950/40 shadow-md'
                                : 'border-emerald-800/50 bg-emerald-950/15'
                            }`}
                          >
                            {unit ? (
                              <RenderCardItem card={unit} isRest={unit.isRest} />
                            ) : (
                              <div className="flex flex-col items-center pointer-events-none">
                                <div className="w-8 h-8 rounded-full border border-emerald-500/30 flex items-center justify-center mb-1">
                                  <span className="text-emerald-400 font-bold text-xs">R</span>
                                </div>
                                <span className="text-[9px] font-bold text-emerald-400 uppercase">
                                  {label}
                                </span>
                                <span className="text-[8px] text-slate-500">ลากมาคอลแถวหลัง</span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* 2.3 RIGHT COLUMN: TRIGGER (TOP), DECK (MID), DROP (BOTTOM) */}
                <div className="col-span-2 flex flex-col items-center justify-between h-full py-1 gap-2">
                  {/* ✨ TRIGGER ZONE (ขวาบน ตามรูป) */}
                  <div className="w-18 h-26 sm:w-22 sm:h-30 rounded-xl border border-slate-700 bg-slate-900/80 flex flex-col items-center justify-center p-1 relative shadow-lg overflow-hidden">
                    <span className="text-[9px] font-black uppercase text-amber-400 tracking-wider mb-0.5">
                      Trigger
                    </span>
                    {playerTriggerZone ? (
                      <div className="w-full h-full relative rounded-lg overflow-hidden animate-pulse">
                        <img
                          src={playerTriggerZone.artUrl}
                          alt=""
                          className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-black/80 text-center py-0.5">
                          <span className="text-[9px] font-black text-amber-300">
                            {playerTriggerZone.triggerType || 'NORMAL'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-[9px] text-slate-600 font-bold">READY</span>
                    )}
                  </div>

                  {/* 🎴 DECK (ขวากลาง ตามรูป) */}
                  <div
                    onClick={() => {
                      if (currentPhase === 'DRAW') handleNextPhase()
                    }}
                    className="w-18 h-26 sm:w-22 sm:h-30 rounded-xl border-2 border-indigo-500/40 bg-slate-950 flex flex-col items-center justify-between p-1.5 relative shadow-lg cursor-pointer hover:border-indigo-400 transition overflow-hidden"
                  >
                    <img
                      src="/vanguard/card-back.png"
                      alt="Deck Back"
                      className="absolute inset-0 w-full h-full object-cover opacity-70 pointer-events-none"
                    />
                    <span className="relative z-10 text-[9px] font-black uppercase text-indigo-200">
                      Deck
                    </span>
                    <div className="relative z-10 text-xl font-black text-white px-2 py-0.5 rounded bg-black/70 border border-indigo-400">
                      {playerDeck.length}
                    </div>
                    <span className="relative z-10 text-[8px] text-indigo-300 font-bold">
                      {currentPhase === 'DRAW' ? 'คลิกเพื่อจั่ว' : 'การ์ดในกอง'}
                    </span>
                  </div>

                  {/* 🪦 DROP ZONE (ขวาล่าง ตามรูป) */}
                  <div
                    onClick={() => {
                      if (playerDrop.length > 0) {
                        alert(
                          `การ์ดใน Drop Zone (${playerDrop.length} ใบ):\n` +
                            playerDrop.map((c, i) => `${i + 1}. ${c.nameTh}`).join('\n')
                        )
                      }
                    }}
                    className="w-18 h-24 sm:w-22 sm:h-28 rounded-xl border border-slate-800 bg-slate-950 flex flex-col items-center justify-center p-1 relative cursor-pointer hover:bg-slate-900 transition overflow-hidden"
                  >
                    {playerDrop.length > 0 ? (
                      <div className="w-full h-full relative">
                        <img
                          src={playerDrop[0].artUrl}
                          alt=""
                          className="w-full h-full object-cover opacity-60 rounded-lg"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                          <span className="text-[8px] text-slate-400 uppercase">Drop</span>
                          <span className="text-sm font-black text-white">{playerDrop.length}</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="text-[9px] font-black uppercase text-slate-500 mb-1">
                          Drop
                        </span>
                        <span className="text-base font-black text-slate-400">0</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* 3. PLAYER HAND CARDS (มือผู้เล่น ลากไปวางได้เลย!)       */}
              {/* ---------------------------------------------------- */}
              <div className="relative z-10 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 px-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                      <Move className="w-3.5 h-3.5" />
                      <span>การ์ดบนมือ ({playerHand.length} ใบ)</span>
                    </span>
                    <span className="text-[10px] text-amber-300 font-semibold">
                      👉 ลากการ์ดขึ้นไปวางบนช่องที่ต้องการ (VC = ไรด์, RC ทุกช่อง หน้า-หลัง = คอล)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700 min-h-[140px]">
                  {playerHand.map((card, idx) => (
                    <div
                      key={card.instanceId}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, card, idx)}
                      onMouseEnter={() => setHoveredCard(card)}
                      onMouseLeave={() => setHoveredCard(null)}
                      className="w-22 h-32 sm:w-24 sm:h-36 shrink-0 rounded-xl overflow-hidden border-2 border-slate-700 hover:border-cyan-400 hover:-translate-y-2 hover:shadow-cyan-500/30 hover:shadow-xl transition-all cursor-grab active:cursor-grabbing relative group"
                    >
                      <img
                        src={card.artUrl}
                        alt={card.nameTh}
                        className="w-full h-full object-cover object-top pointer-events-none"
                      />
                      {/* Gradient Badge Header */}
                      <div className="absolute top-0 inset-x-0 p-1 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                        <span className="w-4 h-4 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-200 font-bold text-[9px] flex items-center justify-center">
                          {card.grade}
                        </span>
                        {card.shield > 0 && (
                          <span className="text-[8px] font-bold text-emerald-300 bg-black/60 px-1 rounded">
                            +{card.shield / 1000}k
                          </span>
                        )}
                      </div>

                      {/* Power and Name Footer */}
                      <div className="absolute bottom-0 inset-x-0 p-1 bg-gradient-to-t from-black/90 to-transparent flex justify-between items-center">
                        <span className="text-[9px] font-black text-yellow-300">
                          {card.power}
                        </span>
                        <span className="text-[8px] text-slate-200 truncate max-w-[55px]">
                          {card.nameTh}
                        </span>
                      </div>
                    </div>
                  ))}
                  {playerHand.length === 0 && (
                    <div className="w-full text-center py-6 text-slate-600 text-xs">
                      ไม่มีการ์ดบนมือ
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SIDEBAR: PREVIEW & BATTLE LOGS (3 COLUMNS) */}
            <div className="lg:col-span-3 flex flex-col gap-3">
              {/* Card Hover Detail Preview */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-lg flex flex-col gap-2">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>ดูรายละเอียดการ์ด (Card Preview)</span>
                </span>
                {hoveredCard ? (
                  <div className="flex gap-2.5 items-start">
                    <img
                      src={hoveredCard.artUrl}
                      alt=""
                      className="w-20 h-28 object-cover rounded-xl border border-slate-700 shrink-0 shadow-md"
                    />
                    <div className="text-xs space-y-1 flex-1">
                      <h4 className="font-black text-white">{hoveredCard.nameTh}</h4>
                      <div className="text-[10px] text-slate-400">{hoveredCard.nameEn}</div>
                      <div className="flex flex-wrap gap-1 text-[9px]">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold">
                          เกรด {hoveredCard.grade}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-yellow-400 font-bold">
                          {hoveredCard.power} Power
                        </span>
                        {hoveredCard.shield > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold">
                            +{hoveredCard.shield} Shield
                          </span>
                        )}
                        {hoveredCard.triggerType && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-bold">
                            [{hoveredCard.triggerType} Trigger]
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-300 leading-tight pt-1">
                        {hoveredCard.skills?.[0]?.desc || hoveredCard.flavor || 'ไม่มีสกิล'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-600 text-xs">
                    ชี้เมาส์ที่การ์ดเพื่อดูรูปใหญ่และรายละเอียดสกิล
                  </div>
                )}
              </div>

              {/* Battle Logs */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col flex-1 shadow-lg">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Info className="w-4 h-4" />
                    <span>บันทึกการประลอง (Combat Log)</span>
                  </span>
                  <button
                    onClick={() => setBattleLogs([])}
                    className="text-[10px] text-slate-500 hover:text-slate-400"
                  >
                    ล้าง
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1 text-xs text-slate-300 font-mono pr-1 max-h-[380px]">
                  {battleLogs.map((log, i) => (
                    <div
                      key={i}
                      className={`p-1.5 rounded-lg text-[10px] leading-tight ${
                        log.includes('TRIGGER')
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-600/30 font-bold'
                          : log.includes('ไรด์') || log.includes('Stand Up')
                          ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/30'
                          : log.includes('ดาเมจ') || log.includes('Retire')
                          ? 'bg-red-950/60 text-red-300 border border-red-800/30'
                          : 'bg-slate-950/40 text-slate-300'
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                  {battleLogs.length === 0 && (
                    <div className="text-center text-slate-600 py-8 text-xs">
                      กดปุ่ม "เริ่มแบทเทิล" เพื่อเข้าสู่การประลอง
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: DECK BUILDER                                      */}
      {/* ======================================================== */}
      {activeTab === 'deckbuilder' && (
        <div className="flex-1 flex flex-col p-4 max-w-7xl mx-auto w-full gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div>
              <h2 className="text-base font-black text-white">ระบบจัดเด็คการ์ดอิสระ</h2>
              <p className="text-xs text-slate-400">
                สร้างเด็คตามกฎ Official (50 ใบพอดี / ทริกเกอร์ 16 ใบพอดี / Heal ไม่เกิน 4 ใบ)
              </p>
            </div>

            <div
              className={`px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 border ${
                isDeckValid
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-600/50'
                  : 'bg-amber-950/80 text-amber-400 border-amber-600/50'
              }`}
            >
              {isDeckValid ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>เด็คสมบูรณ์ พร้อมลงสนามแข่ง</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>เด็คยังไม่ถูกต้องตามกฎ ({deckStats.totalCards}/50 ใบ)</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleLoadPreset('royal_paladin')}
                className="px-3 py-1.5 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-blue-200 text-xs font-bold transition border border-blue-600/40 cursor-pointer"
              >
                โหลด V-TD01 (Royal Paladin)
              </button>
              <button
                onClick={() => handleLoadPreset('kagero')}
                className="px-3 py-1.5 rounded-xl bg-red-900/60 hover:bg-red-800 text-red-200 text-xs font-bold transition border border-red-600/40 cursor-pointer"
              >
                โหลด V-TD02 (Kagero)
              </button>
              <button
                onClick={() => setCustomDeckCards([])}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
              >
                ล้างเด็ค
              </button>
            </div>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-slate-400 block font-semibold">จำนวนรวม</span>
              <span
                className={`text-lg font-black ${
                  deckStats.totalCards === 50 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {deckStats.totalCards} / 50
              </span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-slate-400 block font-semibold">ทริกเกอร์รวม</span>
              <span
                className={`text-lg font-black ${
                  deckStats.triggers === 16 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {deckStats.triggers} / 16
              </span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-slate-400 block font-semibold">Heal Trigger</span>
              <span
                className={`text-lg font-black ${
                  deckStats.healTriggers <= 4 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {deckStats.healTriggers} / 4
              </span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-slate-400 block font-semibold">เกรด 3</span>
              <span className="text-lg font-black text-cyan-400">{deckStats.grade3} ใบ</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-slate-400 block font-semibold">เกรด 2</span>
              <span className="text-lg font-black text-blue-400">{deckStats.grade2} ใบ</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-slate-400 block font-semibold">เกรด 1</span>
              <span className="text-lg font-black text-indigo-400">{deckStats.grade1} ใบ</span>
            </div>
          </div>

          {/* Catalog & Deck List */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
            <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedClan('Royal Paladin')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      selectedClan === 'Royal Paladin'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Royal Paladin
                  </button>
                  <button
                    onClick={() => setSelectedClan('Kagero')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      selectedClan === 'Kagero'
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Kagero
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  {['all', '3', '2', '1', '0'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setFilterGrade(g)}
                      className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                        filterGrade === g
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {g === 'all' ? 'ทุกเกรด' : `เกรด ${g}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Catalog With Images */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 overflow-y-auto max-h-[560px] pr-1">
                {VANGUARD_CARDS.filter(
                  (c) =>
                    c.clan === selectedClan &&
                    (filterGrade === 'all' || c.grade.toString() === filterGrade)
                ).map((card) => {
                  const inDeck = customDeckCards.find((x) => x.cardId === card.id)
                  const countInDeck = inDeck ? inDeck.count : 0

                  return (
                    <div
                      key={card.id}
                      className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-cyan-500 transition shadow-md group relative"
                    >
                      <div className="w-full h-44 relative overflow-hidden">
                        <img
                          src={card.artUrl}
                          alt={card.nameTh}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-cyan-300 font-bold text-[10px]">
                          G{card.grade}
                        </div>
                        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-yellow-300 font-bold text-[10px]">
                          {card.power} Power
                        </div>
                      </div>

                      <div className="p-2 space-y-1.5">
                        <h4 className="text-xs font-black text-white truncate">{card.nameTh}</h4>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>{card.triggerType ? `[${card.triggerType}]` : card.skillType}</span>
                          <span>ในเด็ค: {countInDeck}/4</span>
                        </div>
                        <button
                          onClick={() => handleAddCardToDeck(card.id)}
                          disabled={countInDeck >= 4}
                          className={`w-full py-1 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                            countInDeck >= 4
                              ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                              : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 cursor-pointer'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>ใส่เด็ค</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Current Deck Column */}
            <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-xl">
              <div>
                <h3 className="text-sm font-black text-white mb-2 flex items-center justify-between">
                  <span>การ์ดในเด็ค ({deckStats.totalCards}/50 ใบ)</span>
                  <span className="text-xs text-cyan-400">{selectedClan}</span>
                </h3>

                <div className="overflow-y-auto max-h-[500px] space-y-1.5 pr-1">
                  {customDeckCards.map((item) => {
                    const card = VANGUARD_CARDS.find((c) => c.id === item.cardId)
                    if (!card) return null

                    return (
                      <div
                        key={item.cardId}
                        className="bg-slate-950 border border-slate-800/80 rounded-xl p-1.5 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={card.artUrl}
                            alt=""
                            className="w-8 h-10 object-cover rounded-md shrink-0"
                          />
                          <div>
                            <div className="font-bold text-white truncate max-w-[130px]">
                              {card.nameTh}
                            </div>
                            <span className="text-[10px] text-slate-400">
                              G{card.grade} | {card.triggerType ? `[${card.triggerType}]` : `${card.power} Power`}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-black text-cyan-400">x{item.count}</span>
                          <button
                            onClick={() => handleRemoveCardFromDeck(item.cardId)}
                            className="p-1 rounded bg-slate-800 hover:bg-red-950 hover:text-red-400 text-slate-400 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <button
                disabled={!isDeckValid}
                onClick={() => {
                  setActiveTab('arena')
                  handleStartGame(
                    selectedClan === 'Royal Paladin' ? 'royal_paladin' : 'kagero',
                    selectedClan === 'Royal Paladin' ? 'kagero' : 'royal_paladin'
                  )
                }}
                className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition shadow-lg ${
                  isDeckValid
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/25 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isDeckValid ? 'นำเด็คนี้เข้าสู่สนามแข่ง (Start Battle)' : 'เด็คยังไม่ครบ 50 ใบ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: RULEBOOK                                          */}
      {/* ======================================================== */}
      {activeTab === 'rulebook' && (
        <div className="flex-1 p-4 max-w-4xl mx-auto w-full space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
              คู่มือกติกาการเล่น Cardfight!! Vanguard V-Series (ฉบับเข้าใจง่าย)
            </h2>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <h3 className="font-bold text-cyan-400 text-sm mb-1">1. ลำดับเฟสของแต่ละเทิร์น (Turn Sequence)</h3>
                <ol className="list-decimal pl-4 space-y-1">
                  <li><strong>Stand Phase:</strong> สแตนด์การ์ดทุกใบที่นอนอยู่ (Rest) ให้กลับมาเป็นแนวตั้ง</li>
                  <li><strong>Draw Phase:</strong> จั่วการ์ด 1 ใบจากกอง</li>
                  <li><strong>Ride Phase / Main Phase:</strong> <strong>ลากการ์ดจากมือไปวางบน Vanguard (VC)</strong> เพื่อไรด์ หรือลากไปวางบน <strong>Rear-guard (RC ทั้งแถวหน้า FL, FR และแถวหลัง BL, BC, BR)</strong></li>
                  <li><strong>Battle Phase:</strong> สั่งยูนิตแถวหน้าโจมตี, สั่งแถวหลังบูสต์, ลากการ์ดเข้าช่อง Guard ป้องกัน, ทำ Drive Check / Damage Check</li>
                  <li><strong>End Phase:</strong> ส่งการ์เดี้ยนลง Drop Zone, สลับเทิร์นให้คู่ต่อสู้</li>
                </ol>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <h3 className="font-bold text-amber-400 text-sm mb-1">2. ทริกเกอร์ทั้ง 4 ประเภท (Triggers)</h3>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Critical Trigger (สีแดง):</strong> พลัง +10,000 และเพิ่มค่าคริติคอล +1 (โจมตีเข้าโดน 2 ดาเมจ!)</li>
                  <li><strong>Draw Trigger (สีส้ม):</strong> พลัง +10,000 และจั่วการ์ด 1 ใบขึ้นมือทันที</li>
                  <li><strong>Heal Trigger (สีเขียว):</strong> พลัง +10,000 และรักษาดาเมจ 1 เม็ดลง Drop Zone (ต้องมีดาเมจ $\ge$ คู่ต่อสู้)</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <h3 className="font-bold text-purple-400 text-sm mb-1">3. Imaginary Gift: Force (เฉพาะ V-Series)</h3>
                <p>
                  เมื่อทำการไรด์ยูนิตเกรด 3 ที่มีสัญลักษณ์ <strong>Force</strong> คุณจะได้รับมาร์กเกอร์ Force วางลงบนช่อง Vanguard Circle ซึ่งจะมอบพลังโจมตี <strong>+10,000 ตลอดทั้งเกม</strong> ในเทิร์นของคุณ!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
