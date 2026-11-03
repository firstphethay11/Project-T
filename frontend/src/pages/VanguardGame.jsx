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
} from 'lucide-react'
import { VANGUARD_CARDS, PRESET_DECKS } from '../data/vanguardCards'

// ==========================================
// AUDIO SYNTHESIZER (Web Audio API - ไม่มีปัญหาเรื่องโหลดไฟล์เสียง)
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
      // เสียงพุ่งทะยาน ปลดปล่อยพลัง ไรด์การ์ด
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(220, now)
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.35)
      gain.gain.setValueAtTime(0.3, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35)
      osc.start(now)
      osc.stop(now + 0.35)
    } else if (type === 'attack') {
      // เสียงฟันดาบ / ยิงพลัง
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(400, now)
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.25)
      gain.gain.setValueAtTime(0.35, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25)
      osc.start(now)
      osc.stop(now + 0.25)
    } else if (type === 'trigger') {
      // เสียงทริกเกอร์แตก แวววาวตื่นเต้น!
      osc.type = 'sine'
      osc.frequency.setValueAtTime(523.25, now) // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1) // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2) // G5
      osc.frequency.setValueAtTime(1046.5, now + 0.3) // C6
      gain.gain.setValueAtTime(0.4, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5)
      osc.start(now)
      osc.stop(now + 0.5)
    } else if (type === 'damage') {
      // เสียงระเบิดโดนดาเมจ
      osc.type = 'square'
      osc.frequency.setValueAtTime(150, now)
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.3)
      gain.gain.setValueAtTime(0.4, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
      osc.start(now)
      osc.stop(now + 0.3)
    } else if (type === 'guard') {
      // เสียงกางม่านพลังป้องกัน
      osc.type = 'sine'
      osc.frequency.setValueAtTime(300, now)
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.2)
      gain.gain.setValueAtTime(0.25, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25)
      osc.start(now)
      osc.stop(now + 0.25)
    }
  } catch {
    // AudioContext blocked by browser autoplay policy
  }
}

// Helper: ขยายเด็คจาก cardList ให้เป็นอาเรย์ 50 ใบแยกอิสระ
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
  // สับการ์ด (Fisher-Yates Shuffle)
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }
  return cards
}

export default function VanguardGame({ currentUser }) {
  // Navigation Tabs: 'arena' (สนามประลอง), 'deckbuilder' (ระบบจัดเด็ค), 'rulebook' (กติกา V-Series)
  const [activeTab, setActiveTab] = useState('arena')

  // Sound Mute Toggle
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Card detail modal
  const [inspectedCard, setInspectedCard] = useState(null)

  // ==========================================
  // DECK BUILDER STATE
  // ==========================================
  const [selectedClan, setSelectedClan] = useState('Royal Paladin')
  const [filterGrade, setFilterGrade] = useState('all')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [customDeckCards, setCustomDeckCards] = useState(() => {
    // ค่าเริ่มต้นเป็น Royal Paladin V-TD01
    return [...PRESET_DECKS.royal_paladin.cardList]
  })

  // คำนวณสถิติของเด็คปัจจุบัน
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

  // เพิ่มการ์ดเข้าเด็ค
  const handleAddCardToDeck = (cardId) => {
    const existing = customDeckCards.find((c) => c.cardId === cardId)
    const cardData = VANGUARD_CARDS.find((c) => c.id === cardId)

    if (deckStats.totalCards >= 50) {
      alert('เด็คครบ 50 ใบแล้ว ไม่สามารถเพิ่มได้อีก')
      return
    }
    if (existing && existing.count >= 4) {
      alert('การ์ดชื่อเดียวกันใส่ได้ไม่เกิน 4 ใบตามกฎ Official')
      return
    }
    if (cardData.triggerType === 'Heal' && deckStats.healTriggers >= 4) {
      alert('Heal Trigger ใส่ได้สูงสุด 4 ใบเท่านั้น')
      return
    }
    if (cardData.triggerType && deckStats.triggers >= 16) {
      alert('Trigger ใส่ได้รวมกันไม่เกิน 16 ใบพอดี')
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

  // ลดการ์ดออกจากเด็ค
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

  // โหลดพรีเซ็ตเด็ค
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
  const [matchStatus, setMatchStatus] = useState('idle') // 'idle', 'playing', 'victory', 'defeat'
  const [turnPlayer, setTurnPlayer] = useState('player') // 'player', 'opponent'
  const [turnCount, setTurnCount] = useState(1)
  const [currentPhase, setCurrentPhase] = useState('STAND') // 'STAND', 'DRAW', 'RIDE', 'MAIN', 'BATTLE', 'END'

  // Log ข้อความความเคลื่อนไหวในสนาม
  const [battleLogs, setBattleLogs] = useState([])
  const logBattle = (msg) => {
    setBattleLogs((prev) => [
      `[T${turnCount} ${currentPhase}] ${msg}`,
      ...prev.slice(0, 40),
    ])
  }

  // ผู้เล่น (Player) State
  const [playerDeck, setPlayerDeck] = useState([])
  const [playerHand, setPlayerHand] = useState([])
  const [playerDrop, setPlayerDrop] = useState([])
  const [playerDamage, setPlayerDamage] = useState([]) // Array of cards in damage zone { ...card, isFaceDown: false }
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
  const [playerGiftCount, setPlayerGiftCount] = useState(0) // Imaginary Gift: Force markers
  const [playerTriggerZone, setPlayerTriggerZone] = useState(null) // การ์ดที่เปิดแสดงตอนเช็กทริกเกอร์

  // คู่ต่อสู้ (AI Opponent) State
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

  // Combat State
  const [selectedAttackerCircle, setSelectedAttackerCircle] = useState(null) // 'vc', 'fl', 'fr'
  const [selectedTargetCircle, setSelectedTargetCircle] = useState(null) // 'opp-vc', 'opp-fl', 'opp-fr'
  const [boostedCircle, setBoostedCircle] = useState(null) // 'bc', 'bl', 'br'
  const [combatStep, setCombatStep] = useState('none') // 'none', 'attacking', 'guarding', 'driveCheck', 'damageCheck'
  const [triggerEffectTarget, setTriggerEffectTarget] = useState(null)

  // เริ่มต้นแมตช์ใหม่ (Start New Game)
  const handleStartGame = (playerPresetKey = 'royal_paladin', oppPresetKey = 'kagero') => {
    const pDeck = buildFullDeckArray(PRESET_DECKS[playerPresetKey])
    const oDeck = buildFullDeckArray(PRESET_DECKS[oppPresetKey])

    // ค้นหา First Vanguard (G0) เพื่อวางคว่ำหน้าในช่อง VG ก่อนเริ่มเกม
    const pFVIndex = pDeck.findIndex((c) => c.cardType === 'First Vanguard' || c.grade === 0)
    const oFVIndex = oDeck.findIndex((c) => c.cardType === 'First Vanguard' || c.grade === 0)

    const pFV = pDeck.splice(pFVIndex >= 0 ? pFVIndex : 0, 1)[0]
    const oFV = oDeck.splice(oFVIndex >= 0 ? oFVIndex : 0, 1)[0]

    // จั่วการ์ดเริ่มต้นคนละ 5 ใบ
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
    setCurrentPhase('MAIN') // เทิร์นแรกเริ่มต้นที่ Main Phase
    setMatchStatus('playing')
    setBattleLogs([
      '⚔️ สแตนด์อัพ! เดอะ แวนการ์ด! (Stand Up! The Vanguard!)',
      `👤 ฝ่ายคุณ: ${pFV.nameTh} (Grade ${pFV.grade})`,
      `🤖 ฝ่ายศัตรู: ${oFV.nameTh} (Grade ${oFV.grade})`,
    ])

    if (soundEnabled) playSoundEffect('ride')
  }

  // ตรวจสอบเงื่อนไขจบเกม
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
        logBattle('💀 การ์ดในกองของคุณหมด (Deck Out) พ่ายแพ้การประลอง!')
      } else if (oppDeck.length === 0) {
        setMatchStatus('victory')
        logBattle('🏆 กองการ์ดของศัตรูหมด (Deck Out) คุณชนะ!')
      }
    }
  }, [playerDamage, oppDamage, playerDeck, oppDeck, matchStatus])

  // คำนวณพลังรวมของช่อง Player
  const getCirclePower = (circleKey) => {
    let unit = null
    let isVG = false
    if (circleKey === 'vc') {
      unit = playerVanguard
      isVG = true
    } else {
      unit = playerRearguards[circleKey]
    }
    if (!unit) return 0

    let total = unit.power + (unit.tempPowerBonus || 0)
    // ถ้ามี Force Gift อยู่ที่ช่องนี้ +10,000 ต่อ 1 มาร์กเกอร์
    if (isVG && playerGiftCount > 0) {
      total += playerGiftCount * 10000
    }
    return total
  }

  // คำนวณพลังรวมของช่อง Opponent
  const getOppCirclePower = (circleKey) => {
    let unit = null
    let isVG = false
    if (circleKey === 'vc') {
      unit = oppVanguard
      isVG = true
    } else {
      unit = oppRearguards[circleKey]
    }
    if (!unit) return 0

    let total = unit.power + (unit.tempPowerBonus || 0)
    if (isVG && oppGiftCount > 0) {
      total += oppGiftCount * 10000
    }
    return total
  }

  // ไรด์ยูนิตทับแวนการ์ด (Ride)
  const handleRide = (card, handIndex) => {
    if (turnPlayer !== 'player') return
    if (currentPhase !== 'RIDE' && currentPhase !== 'MAIN') {
      alert('คุณสามารถไรด์การ์ดได้ใน Ride Phase หรือ Main Phase เท่านั้น')
      return
    }

    const currentGrade = playerVanguard ? playerVanguard.grade : 0
    if (card.grade !== currentGrade && card.grade !== currentGrade + 1) {
      alert(
        `ไม่สามารถไรด์ได้! เกรดต้องเป็นเกรดเดิม (${currentGrade}) หรือสูงกว่า 1 เกรด (${currentGrade + 1})`
      )
      return
    }

    // เอาการ์ดออกจากมือ
    const newHand = [...playerHand]
    newHand.splice(handIndex, 1)
    setPlayerHand(newHand)

    // ตัวเดิมลงไปเป็น Soul
    if (playerVanguard) {
      setPlayerSoul((prev) => [playerVanguard, ...prev])
    }

    // สวมใส่การ์ดใหม่เป็นแวนการ์ด
    const newVG = { ...card, isRest: false, tempPowerBonus: 0, tempCritBonus: 0 }
    setPlayerVanguard(newVG)

    // ถ้าไรด์เกรด 3 ได้รับ Imaginary Gift: Force ทันที!
    if (newVG.grade === 3 && newVG.gift === 'Force') {
      setPlayerGiftCount((prev) => prev + 1)
      logBattle(
        `🎁 ได้รับ Imaginary Gift: Force I! ช่อง Vanguard ได้รับ Power +10,000 ถาวร!`
      )
    }

    logBattle(`✨ ไรด์! ${newVG.nameTh} (Grade ${newVG.grade}) สู่ช่องแวนการ์ด!`)
    if (soundEnabled) playSoundEffect('ride')
  }

  // คอลการ์ดลงช่องเรียร์การ์ด (Call to Rearguard)
  const handleCallToRear = (card, handIndex, circleKey) => {
    if (turnPlayer !== 'player') return
    if (currentPhase !== 'MAIN') {
      alert('สามารถคอลยูนิตลงสนามได้ใน Main Phase เท่านั้น')
      return
    }
    const currentVGGrade = playerVanguard ? playerVanguard.grade : 0
    if (card.grade > currentVGGrade) {
      alert(
        `ไม่สามารถคอลเกรด ${card.grade} ได้ เพราะเกรดของแวนการ์ดคือเกรด ${currentVGGrade}`
      )
      return
    }

    // นำการ์ดออกจากมือ
    const newHand = [...playerHand]
    newHand.splice(handIndex, 1)
    setPlayerHand(newHand)

    // ถ้ามีตัวเดิมอยู่ตรงนั้น ส่งลง Drop Zone
    const existingUnit = playerRearguards[circleKey]
    if (existingUnit) {
      setPlayerDrop((prev) => [existingUnit, ...prev])
      logBattle(`🪦 ส่ง ${existingUnit.nameTh} ลง Drop zone เพื่อคอลตัวใหม่`)
    }

    // คอลตัวใหม่ลงช่อง
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

    logBattle(`⚔️ คอล ${newUnit.nameTh} (G${newUnit.grade}) ลงช่อง ${circleKey.toUpperCase()}`)
    if (soundEnabled) playSoundEffect('attack')
  }

  // การสั่งโจมตี (Declare Attack)
  const handleDeclareAttack = (attackerKey) => {
    if (turnPlayer !== 'player' || currentPhase !== 'BATTLE') return

    const attacker =
      attackerKey === 'vc' ? playerVanguard : playerRearguards[attackerKey]
    if (!attacker) return
    if (attacker.isRest) {
      alert('ยูนิตนี้โจมตีไปแล้วในเทิร์นนี้ (Rest อยู่)')
      return
    }

    // เฉพาะแถวหน้า (VC, FL, FR) เท่านั้นที่ตีได้
    if (attackerKey !== 'vc' && attackerKey !== 'fl' && attackerKey !== 'fr') {
      alert('ยูนิตแถวหลังไม่สามารถโจมตีได้ ทำหน้าที่ได้แค่บูสต์ (Boost)')
      return
    }

    setSelectedAttackerCircle(attackerKey)
    logBattle(
      `🎯 เลือก [${attacker.nameTh}] เตรียมโจมตี! คลิกเลือกเป้าหมายฝั่งศัตรู (VG หรือ RG หน้า)`
    )
  }

  // เลือกเป้าหมายและเริ่มคอมแบท (Execute Combat)
  const handleSelectTarget = (targetKey) => {
    if (!selectedAttackerCircle) return

    const attacker =
      selectedAttackerCircle === 'vc'
        ? playerVanguard
        : playerRearguards[selectedAttackerCircle]

    // ตั้งค่า Rest ใหักับตัวตี
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
    setCombatStep('driveCheck')

    let totalAtk = getCirclePower(selectedAttackerCircle)
    // ตรวจสอบตัวบูสต์ข้างหลัง
    let boostUnit = null
    if (selectedAttackerCircle === 'vc' && playerRearguards.bc && !playerRearguards.bc.isRest) {
      boostUnit = playerRearguards.bc
      setPlayerRearguards((prev) => ({
        ...prev,
        bc: { ...prev.bc, isRest: true },
      }))
    } else if (selectedAttackerCircle === 'fl' && playerRearguards.bl && !playerRearguards.bl.isRest) {
      boostUnit = playerRearguards.bl
      setPlayerRearguards((prev) => ({
        ...prev,
        bl: { ...prev.bl, isRest: true },
      }))
    } else if (selectedAttackerCircle === 'fr' && playerRearguards.br && !playerRearguards.br.isRest) {
      boostUnit = playerRearguards.br
      setPlayerRearguards((prev) => ({
        ...prev,
        br: { ...prev.br, isRest: true },
      }))
    }

    if (boostUnit) {
      totalAtk += boostUnit.power
      logBattle(
        `⚡ ได้รับการบูสต์จาก [${boostUnit.nameTh}] (+${boostUnit.power})! พลังโจมตีรวม: ${totalAtk}`
      )
    }

    if (soundEnabled) playSoundEffect('attack')
    logBattle(
      `💥 [${attacker.nameTh}] บุกโจมตี [${targetKey === 'opp-vc' ? 'แวนการ์ดศัตรู' : 'เรียร์การ์ดศัตรู'}]! (พลังโจมตี: ${totalAtk})`
    )

    // ถ้าตัวตีคือแวนการ์ด ทำ Drive Check ทันที!
    if (selectedAttackerCircle === 'vc') {
      const driveCount = attacker.skillType === 'Twin Drive' ? 2 : 1
      logBattle(`🎲 แวนการ์ดโจมตี! ทำการ Drive Check (${driveCount} ครั้ง)!`)
      performDriveCheck(driveCount, totalAtk, targetKey)
    } else {
      // เรียร์การ์ดตี ไม่มีไดร์ฟเช็ก ข้ามไปคิดดาเมจ
      resolveDamageStep(totalAtk, targetKey, attacker.critical || 1)
    }
  }

  // ระบบ Drive Check
  const performDriveCheck = (drivesRemaining, currentAtk, targetKey) => {
    if (playerDeck.length === 0) return

    const newDeck = [...playerDeck]
    const checkCard = newDeck.shift()
    setPlayerDeck(newDeck)
    setPlayerTriggerZone(checkCard)

    // เพิ่มการ์ดเข้ามือหลังไดร์ฟเช็ก
    setPlayerHand((prev) => [...prev, checkCard])

    let updatedAtk = currentAtk
    let addedCrit = 0

    if (checkCard.triggerType) {
      if (soundEnabled) playSoundEffect('trigger')
      logBattle(
        `🌟 TRIGGER CHECKED!! พบ [${checkCard.triggerType.toUpperCase()} TRIGGER] จาก ${checkCard.nameTh}!`
      )

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
          logBattle(`💚 Heal Trigger: Power +10,000 & ฟื้นฟู 1 ดาเมจลง Drop Zone!`)
        } else {
          logBattle(`💚 Heal Trigger: Power +10,000 (ดาเมจไม่มากกว่าศัตรู ไม่ฮีล)`)
        }
      }
    } else {
      logBattle(`⚪ Drive Check: ${checkCard.nameTh} (ไม่มีทริกเกอร์)`)
    }

    if (drivesRemaining > 1) {
      setTimeout(() => {
        performDriveCheck(drivesRemaining - 1, updatedAtk, targetKey)
      }, 1100)
    } else {
      setTimeout(() => {
        resolveDamageStep(
          updatedAtk,
          targetKey,
          (playerVanguard.critical || 1) + addedCrit
        )
      }, 900)
    }
  }

  // ตัดสินผลดาเมจ (Damage Step)
  const resolveDamageStep = (attackerPower, targetKey, critCount) => {
    let defenderPower = 0
    if (targetKey === 'opp-vc') {
      defenderPower = getOppCirclePower('vc')
    } else if (targetKey === 'opp-fl') {
      defenderPower = getOppCirclePower('fl')
    } else if (targetKey === 'opp-fr') {
      defenderPower = getOppCirclePower('fr')
    }

    logBattle(
      `⚔️ วัดพลัง: ฝ่ายรุก ${attackerPower} VS ฝ่ายรับ ${defenderPower}`
    )

    if (attackerPower >= defenderPower) {
      if (soundEnabled) playSoundEffect('damage')

      if (targetKey === 'opp-vc') {
        logBattle(
          `💥 โจมตีสำเร็จ (HIT)! แวนการ์ดศัตรูได้รับ ${critCount} ดาเมจ!`
        )
        // ศัตรูเปิด Damage Check
        performOppDamageCheck(critCount)
      } else {
        // ทำลายเรียร์การ์ดศัตรู (Retire)
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

    // รีเซ็ตสถานะการโจมตี
    setSelectedAttackerCircle(null)
    setSelectedTargetCircle(null)
    setCombatStep('none')
  }

  // ศัตรูเปิด Damage Check
  const performOppDamageCheck = (damagesRemaining) => {
    if (damagesRemaining <= 0 || oppDeck.length === 0) return

    const newDeck = [...oppDeck]
    const damCard = newDeck.shift()
    setOppDeck(newDeck)
    setOppTriggerZone(damCard)

    setOppDamage((prev) => [...prev, { ...damCard, isFaceDown: false }])

    if (damCard.triggerType) {
      if (soundEnabled) playSoundEffect('trigger')
      logBattle(
        `🚨 ศัตรูเปิดพบ [${damCard.triggerType.toUpperCase()} TRIGGER] จากดาเมจเช็ก!`
      )
      if (damCard.triggerType === 'Heal' && oppDamage.length >= playerDamage.length) {
        logBattle(`💚 ศัตรูฮีล 1 ดาเมจ!`)
      }
    }

    if (damagesRemaining > 1) {
      setTimeout(() => {
        performOppDamageCheck(damagesRemaining - 1)
      }, 1000)
    }
  }

  // เปลี่ยนเฟส (Next Phase)
  const handleNextPhase = () => {
    if (turnPlayer !== 'player') return

    if (currentPhase === 'STAND') {
      // สแตนด์การ์ดทุกใบ
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
      // จั่วการ์ด 1 ใบ
      if (playerDeck.length > 0) {
        const newDeck = [...playerDeck]
        const drawn = newDeck.shift()
        setPlayerDeck(newDeck)
        setPlayerHand((prev) => [...prev, drawn])
        logBattle(`📥 Draw Phase: จั่ว [${drawn.nameTh}] ขึ้นมือ`)
      }
      setCurrentPhase('RIDE')
    } else if (currentPhase === 'RIDE') {
      setCurrentPhase('MAIN')
      logBattle('⚙️ Main Phase: คอลเรียร์การ์ด หรือจัดตำแหน่งยูนิต')
    } else if (currentPhase === 'MAIN') {
      setCurrentPhase('BATTLE')
      logBattle('⚔️ Battle Phase: สั่งแถวหน้าโจมตีศัตรู!')
    } else if (currentPhase === 'BATTLE') {
      // จบเทิร์น ส่งต่อให้ AI
      setCurrentPhase('END')
      logBattle('🏁 End Phase: จบเทิร์นของผู้เล่น สลับสู่เทิร์นศัตรู')
      setTimeout(() => {
        handleAITurn()
      }, 1000)
    }
  }

  // บอท AI เล่นอัตโนมัติ (AI Opponent Turn Simulation)
  const handleAITurn = () => {
    setTurnPlayer('opponent')
    logBattle('🤖 เริ่มต้นเทิร์นของคู่ต่อสู้ (AI Turn)...')

    // 1. Stand
    setOppVanguard((prev) => (prev ? { ...prev, isRest: false } : prev))
    setOppRearguards((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((k) => {
        if (next[k]) next[k] = { ...next[k], isRest: false }
      })
      return next
    })

    // 2. Draw
    let newOppDeck = [...oppDeck]
    let newOppHand = [...oppHand]
    if (newOppDeck.length > 0) {
      const drawn = newOppDeck.shift()
      newOppHand.push(drawn)
      setOppDeck(newOppDeck)
      setOppHand(newOppHand)
      logBattle(`🤖 ศัตรูจั่วการ์ด 1 ใบ`)
    }

    // 3. Ride Check
    setTimeout(() => {
      const curGrade = oppVanguard ? oppVanguard.grade : 0
      const rideCandidateIndex = newOppHand.findIndex(
        (c) => c.grade === curGrade + 1
      )
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

      // 4. Call Check
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
        logBattle(`⚔️ ศัตรูคอล [${toCall.nameTh}] ลงช่องหน้าซ้าย`)
      }

      // 5. AI Attack Step
      setTimeout(() => {
        logBattle(`💥 แวนการ์ดศัตรู [${oppVanguard ? oppVanguard.nameTh : 'VG'}] บุกโจมตีแวนการ์ดของคุณ!`)
        setOppVanguard((prev) => (prev ? { ...prev, isRest: true } : prev))

        // AI Drive Check
        if (newOppDeck.length > 0) {
          const driveCard = newOppDeck.shift()
          setOppDeck([...newOppDeck])
          setOppTriggerZone(driveCard)
          setOppHand((prev) => [...prev, driveCard])
          logBattle(`🎲 ศัตรู Drive Check: ${driveCard.nameTh}`)

          if (driveCard.triggerType) {
            if (soundEnabled) playSoundEffect('trigger')
            logBattle(`🚨 ศัตรูติด [${driveCard.triggerType.toUpperCase()} TRIGGER]!`)
          }
        }

        // ผู้เล่นรับดาเมจ 1 แดม
        setTimeout(() => {
          if (playerDeck.length > 0) {
            const pDeck = [...playerDeck]
            const pDamCard = pDeck.shift()
            setPlayerDeck(pDeck)
            setPlayerTriggerZone(pDamCard)
            setPlayerDamage((prev) => [
              ...prev,
              { ...pDamCard, isFaceDown: false },
            ])

            if (soundEnabled) playSoundEffect('damage')
            logBattle(
              `💔 แวนการ์ดของคุณได้รับ 1 ดาเมจ! เปิด Damage Check: [${pDamCard.nameTh}]`
            )

            if (pDamCard.triggerType) {
              if (soundEnabled) playSoundEffect('trigger')
              logBattle(
                `🌟 คุณเปิดพบ [${pDamCard.triggerType.toUpperCase()} TRIGGER] ในดาเมจเช็ก!`
              )
            }
          }

          // คืนสิทธิ์ให้ผู้เล่น
          setTimeout(() => {
            setTurnPlayer('player')
            setTurnCount((c) => c + 1)
            setCurrentPhase('STAND')
            logBattle('🟢 จบเทิร์นศัตรู! กลับสู่เทิร์นของผู้เล่น กด "เปลี่ยนเฟส" เพื่อ Stand')
          }, 1000)
        }, 1200)
      }, 1500)
    }, 1200)
  }

  // คว่ำ / หงาย การ์ดดาเมจสำหรับจ่าย Counter Blast (CB)
  const toggleDamageFaceDown = (index) => {
    setPlayerDamage((prev) =>
      prev.map((card, i) =>
        i === index ? { ...card, isFaceDown: !card.isFaceDown } : card
      )
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* ======================================================== */}
      {/* TOP HEADER: NAVIGATION & STATUS BAR                     */}
      {/* ======================================================== */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-cyan-800/40 px-4 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30 shadow-lg">
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
              ระบบจำลองการเล่นและการจัดเด็คการ์ดแวนการ์ดสมจริง (Official Rules)
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
            <span>สนามประลอง (Battle Arena)</span>
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

        {/* Audio Mute & Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700 cursor-pointer"
            title={soundEnabled ? 'ปิดเสียงเอฟเฟกต์' : 'เปิดเสียงเอฟเฟกต์'}
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
      {/* TAB 1: BATTLE ARENA (PLAYMAT FOLLOWING REFERENCE IMAGE)   */}
      {/* ======================================================== */}
      {activeTab === 'arena' && (
        <div className="flex-1 flex flex-col p-2 sm:p-4 gap-3 max-w-[1550px] mx-auto w-full">
          {/* Status & Phase Controller Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">สถานะแมตช์:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
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

              {/* Phase Indicators */}
              <div className="hidden md:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                {['STAND', 'DRAW', 'RIDE', 'MAIN', 'BATTLE', 'END'].map((p) => (
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartGame('royal_paladin', 'kagero')}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-black text-sm hover:scale-105 transition shadow-lg shadow-cyan-500/25 cursor-pointer flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>เริ่มแบทเทิล (Royal Paladin VS Kagero)</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* MAIN ARENA GRID: 2 COLUMNS (LEFT = PLAYMAT ACCORDING TO USER'S IMAGE, RIGHT = LOGS & DECK STATS) */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1">
            {/* ======================================================== */}
            {/* THE PLAYMAT (ตามรูปถ่าย V-SERIES ของผู้ใช้ 100%)           */}
            {/* ======================================================== */}
            <div className="lg:col-span-3 bg-black/90 border border-slate-800/80 rounded-3xl p-3 sm:p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden min-h-[720px]">
              {/* Sci-Fi Grid Background Lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>

              {/* ---------------------------------------------------- */}
              {/* OPPONENT MINI FIELD (สนามศัตรูด้านบน)                  */}
              {/* ---------------------------------------------------- */}
              <div className="relative z-10 border-b border-slate-800/60 pb-3 mb-2">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-red-400">🤖 ศัตรู (Kagero / Toshiki Kai)</span>
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

                {/* Opponent Circles Row */}
                <div className="flex items-center justify-center gap-3 sm:gap-6">
                  {/* Opponent Left Front RG */}
                  <div
                    onClick={() => selectedAttackerCircle && handleSelectTarget('opp-fl')}
                    className={`w-20 h-28 sm:w-24 sm:h-32 rounded-xl border-2 flex flex-col items-center justify-center relative transition ${
                      selectedAttackerCircle
                        ? 'border-yellow-400 shadow-lg shadow-yellow-500/30 cursor-pointer animate-pulse'
                        : 'border-slate-800 bg-slate-900/60'
                    }`}
                  >
                    {oppRearguards.fl ? (
                      <div className="w-full h-full p-1 flex flex-col justify-between text-[10px]">
                        <span className="font-bold truncate text-slate-200">
                          {oppRearguards.fl.nameTh}
                        </span>
                        <div className="text-center font-black text-yellow-400">
                          {getOppCirclePower('fl')}
                        </div>
                        <span className="text-[9px] text-slate-400">G{oppRearguards.fl.grade} RG</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-600">RG (Front)</span>
                    )}
                  </div>

                  {/* Opponent Vanguard (Red Circle) */}
                  <div
                    onClick={() => selectedAttackerCircle && handleSelectTarget('opp-vc')}
                    className={`w-24 h-32 sm:w-28 sm:h-36 rounded-xl border-2 flex flex-col items-center justify-center relative transition ${
                      selectedAttackerCircle
                        ? 'border-red-500 shadow-xl shadow-red-500/50 cursor-pointer animate-bounce'
                        : 'border-red-700/60 bg-red-950/30'
                    }`}
                  >
                    {oppVanguard ? (
                      <div className="w-full h-full p-1.5 flex flex-col justify-between text-xs">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="px-1.5 py-0.5 rounded bg-red-900 text-red-200 font-bold">
                            G{oppVanguard.grade}
                          </span>
                          <span className="text-slate-400">VG</span>
                        </div>
                        <div className="text-center font-black text-red-400 text-sm">
                          {getOppCirclePower('vc')}
                        </div>
                        <span className="font-bold text-[10px] truncate text-slate-200">
                          {oppVanguard.nameTh}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-red-500 font-bold">VANGUARD</span>
                    )}
                  </div>

                  {/* Opponent Right Front RG */}
                  <div
                    onClick={() => selectedAttackerCircle && handleSelectTarget('opp-fr')}
                    className={`w-20 h-28 sm:w-24 sm:h-32 rounded-xl border-2 flex flex-col items-center justify-center relative transition ${
                      selectedAttackerCircle
                        ? 'border-yellow-400 shadow-lg shadow-yellow-500/30 cursor-pointer animate-pulse'
                        : 'border-slate-800 bg-slate-900/60'
                    }`}
                  >
                    {oppRearguards.fr ? (
                      <div className="w-full h-full p-1 flex flex-col justify-between text-[10px]">
                        <span className="font-bold truncate text-slate-200">
                          {oppRearguards.fr.nameTh}
                        </span>
                        <div className="text-center font-black text-yellow-400">
                          {getOppCirclePower('fr')}
                        </div>
                        <span className="text-[9px] text-slate-400">G{oppRearguards.fr.grade} RG</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-600">RG (Front)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* PLAYER V-SERIES PLAYMAT (ตรงตามรูปที่ผู้ใช้ส่งมาเป๊ะ!)   */}
              {/* ---------------------------------------------------- */}
              <div className="relative z-10 flex-1 grid grid-cols-12 gap-2 sm:gap-3 py-2 items-center">
                {/* 1. LEFT COLUMN: GIFT ZONE (TOP) + DAMAGE ZONE (VERTICAL 6 SLOTS) */}
                <div className="col-span-2 flex flex-col items-center gap-2">
                  {/* 🎁 GIFT ZONE (ตามรูปซ้ายบน) */}
                  <div
                    className="w-16 h-22 sm:w-20 sm:h-26 rounded-xl border border-cyan-500/50 bg-gradient-to-b from-cyan-950/80 to-blue-950/80 flex flex-col items-center justify-center p-1 relative shadow-cyan-500/20 shadow-md"
                    title="Imaginary Gift Zone"
                  >
                    <span className="text-[10px] font-black text-cyan-400 tracking-wider">
                      Gift
                    </span>
                    <Sparkles className="w-4 h-4 text-cyan-300 my-1 animate-spin" />
                    <span className="text-xs font-black text-white">
                      x{playerGiftCount}
                    </span>
                    <span className="text-[9px] text-cyan-300 font-semibold text-center">
                      Force I
                    </span>
                  </div>

                  {/* 🩸 DAMAGE ZONE (ตามรูปซ้ายแถวแนวตั้ง 6 สเต็ป) */}
                  <div className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-1.5 flex flex-col gap-1 items-center">
                    <span className="text-[10px] font-black uppercase text-red-400 tracking-wider">
                      Damage Zone
                    </span>
                    <div className="w-full flex flex-col gap-1">
                      {[0, 1, 2, 3, 4, 5].map((slotIdx) => {
                        const card = playerDamage[slotIdx]
                        return (
                          <div
                            key={slotIdx}
                            onClick={() => card && toggleDamageFaceDown(slotIdx)}
                            className={`h-7 rounded-lg border text-[10px] flex items-center justify-between px-2 cursor-pointer transition ${
                              card
                                ? card.isFaceDown
                                ? 'bg-slate-900 border-slate-700 text-slate-500 line-through'
                                : 'bg-red-950/70 border-red-600/60 text-red-200 font-bold shadow-sm'
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
                                <span className="truncate max-w-[80px]">
                                  {card.nameTh}
                                </span>
                                <span className="text-[9px]">
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

                {/* 2. CENTER AREA: GUARD CIRCLE (TOP) + 6 CIRCLES (VG & 5 RG) */}
                <div className="col-span-8 flex flex-col items-center gap-3">
                  {/* 🛡️ GUARDIAN CIRCLE (วงเวทย์สีฟ้าตรงกลางด้านบน ตามรูป) */}
                  <div className="relative flex flex-col items-center">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-cyan-400/80 bg-cyan-950/30 flex flex-col items-center justify-center shadow-cyan-400/30 shadow-xl relative backdrop-blur-sm">
                      {/* วงแหวนเวทย์มนตร์ GUARD */}
                      <div className="absolute inset-1 rounded-full border border-dashed border-cyan-300/40 animate-[spin_18s_linear_infinite]"></div>
                      <div className="absolute inset-3 rounded-full border border-cyan-500/30"></div>
                      <Shield className="w-6 h-6 text-cyan-300 mb-0.5" />
                      <span className="text-[11px] font-black text-cyan-200 tracking-wider">
                        GUARD
                      </span>
                    </div>
                  </div>

                  {/* FIELD GRID: 2 ROWS (FRONT ROW = REAR / VANGUARD / REAR) & (BACK ROW = 3 REARS) */}
                  <div className="w-full flex flex-col gap-3">
                    {/* FRONT ROW: [REAR LEFT] - [VANGUARD RED] - [REAR RIGHT] */}
                    <div className="flex items-center justify-center gap-3 sm:gap-6">
                      {/* 🟢 Front-Left Rear-Guard Circle */}
                      <div
                        onClick={() => handleDeclareAttack('fl')}
                        className={`w-24 h-32 sm:w-28 sm:h-38 rounded-2xl border-2 flex flex-col items-center justify-center relative transition ${
                          playerRearguards.fl
                            ? playerRearguards.fl.isRest
                              ? 'rotate-12 opacity-80 border-slate-700 bg-slate-900/60'
                              : 'border-emerald-500 bg-emerald-950/40 shadow-emerald-500/20 shadow-lg cursor-pointer hover:scale-105'
                            : 'border-emerald-800/50 bg-emerald-950/10'
                        }`}
                      >
                        {playerRearguards.fl ? (
                          <div className="w-full h-full p-2 flex flex-col justify-between text-xs">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-200 font-bold">
                                G{playerRearguards.fl.grade}
                              </span>
                              <span className="text-emerald-400">FL</span>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-black text-emerald-300">
                                {getCirclePower('fl')}
                              </div>
                              <div className="text-[10px] text-slate-300 font-medium truncate">
                                {playerRearguards.fl.nameTh}
                              </div>
                            </div>
                            <div className="flex justify-between items-center text-[9px] text-slate-400">
                              <span>RG Front</span>
                              <span>Atk</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full border border-emerald-500/40 flex items-center justify-center mb-1">
                              <span className="text-emerald-400 font-black text-sm">R</span>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-400">REAR</span>
                          </div>
                        )}
                      </div>

                      {/* ⚔️ VANGUARD CIRCLE (วงเวทย์สีแดง วางตัวเอก ตรงกลาง ตามรูป) */}
                      <div
                        onClick={() => handleDeclareAttack('vc')}
                        className={`w-28 h-36 sm:w-32 sm:h-44 rounded-2xl border-2 flex flex-col items-center justify-between p-2 relative transition ${
                          playerVanguard
                            ? playerVanguard.isRest
                              ? 'rotate-12 border-slate-700 bg-slate-900/60 opacity-80'
                              : 'border-red-500 bg-gradient-to-b from-red-950/60 to-slate-950 shadow-red-500/40 shadow-2xl cursor-pointer hover:scale-105'
                            : 'border-red-700/60 bg-red-950/20'
                        }`}
                      >
                        {playerVanguard ? (
                          <>
                            {/* Card Header */}
                            <div className="w-full flex justify-between items-center text-xs">
                              <span className="px-2 py-0.5 rounded-md bg-red-900/80 text-red-200 font-black border border-red-600/40">
                                G{playerVanguard.grade}
                              </span>
                              <span className="text-[10px] font-black uppercase text-red-400">
                                Vanguard
                              </span>
                            </div>

                            {/* Power Display */}
                            <div className="text-center my-auto">
                              <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-300 to-yellow-300">
                                {getCirclePower('vc')}
                              </div>
                              <div className="text-xs font-bold text-slate-200 truncate max-w-[110px]">
                                {playerVanguard.nameTh}
                              </div>
                              <div className="text-[10px] text-red-300 mt-0.5">
                                {playerVanguard.skillType}
                              </div>
                            </div>

                            {/* Card Footer: Soul Count & Status */}
                            <div className="w-full flex justify-between items-center text-[10px] pt-1 border-t border-red-800/40">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  alert(
                                    `Soul ปัจจุบัน (${playerSoul.length} ใบ):\n` +
                                      playerSoul.map((s, i) => `${i + 1}. ${s.nameTh}`).join('\n')
                                  )
                                }}
                                className="px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-200 font-bold hover:bg-purple-800"
                              >
                                Soul: {playerSoul.length}
                              </button>
                              <span className="text-yellow-400 font-bold">
                                Crit {playerVanguard.critical || 1}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center my-auto">
                            <div className="w-14 h-14 rounded-full border border-red-500/60 flex items-center justify-center mb-1">
                              <span className="text-red-400 font-black text-lg">V</span>
                            </div>
                            <span className="text-xs font-black text-red-400">VANGUARD</span>
                          </div>
                        )}
                      </div>

                      {/* 🟢 Front-Right Rear-Guard Circle */}
                      <div
                        onClick={() => handleDeclareAttack('fr')}
                        className={`w-24 h-32 sm:w-28 sm:h-38 rounded-2xl border-2 flex flex-col items-center justify-center relative transition ${
                          playerRearguards.fr
                            ? playerRearguards.fr.isRest
                              ? 'rotate-12 opacity-80 border-slate-700 bg-slate-900/60'
                              : 'border-emerald-500 bg-emerald-950/40 shadow-emerald-500/20 shadow-lg cursor-pointer hover:scale-105'
                            : 'border-emerald-800/50 bg-emerald-950/10'
                        }`}
                      >
                        {playerRearguards.fr ? (
                          <div className="w-full h-full p-2 flex flex-col justify-between text-xs">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-200 font-bold">
                                G{playerRearguards.fr.grade}
                              </span>
                              <span className="text-emerald-400">FR</span>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-black text-emerald-300">
                                {getCirclePower('fr')}
                              </div>
                              <div className="text-[10px] text-slate-300 font-medium truncate">
                                {playerRearguards.fr.nameTh}
                              </div>
                            </div>
                            <div className="flex justify-between items-center text-[9px] text-slate-400">
                              <span>RG Front</span>
                              <span>Atk</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full border border-emerald-500/40 flex items-center justify-center mb-1">
                              <span className="text-emerald-400 font-black text-sm">R</span>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-400">REAR</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* BACK ROW: [REAR BACK-LEFT] - [REAR BACK-CENTER] - [REAR BACK-RIGHT] */}
                    <div className="flex items-center justify-center gap-3 sm:gap-6">
                      {['bl', 'bc', 'br'].map((key) => {
                        const unit = playerRearguards[key]
                        return (
                          <div
                            key={key}
                            className={`w-20 h-28 sm:w-24 sm:h-32 rounded-2xl border-2 flex flex-col items-center justify-center relative transition ${
                              unit
                                ? unit.isRest
                                  ? 'rotate-12 opacity-80 border-slate-700 bg-slate-900/60'
                                  : 'border-emerald-500/80 bg-emerald-950/30 shadow-md'
                                : 'border-emerald-800/40 bg-emerald-950/10'
                            }`}
                          >
                            {unit ? (
                              <div className="w-full h-full p-2 flex flex-col justify-between text-[10px]">
                                <div className="flex justify-between items-center">
                                  <span className="px-1 py-0.5 rounded bg-emerald-900 text-emerald-200 font-bold">
                                    G{unit.grade}
                                  </span>
                                  <span className="text-emerald-400 uppercase">{key}</span>
                                </div>
                                <div className="text-center">
                                  <div className="text-base font-black text-emerald-300">
                                    {unit.power}
                                  </div>
                                  <div className="truncate text-slate-300 font-medium">
                                    {unit.nameTh}
                                  </div>
                                </div>
                                <span className="text-[9px] text-slate-400 text-center">
                                  Boost {unit.skillType}
                                </span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full border border-emerald-500/30 flex items-center justify-center mb-1">
                                  <span className="text-emerald-400 font-bold text-xs">R</span>
                                </div>
                                <span className="text-[9px] font-bold text-emerald-400 uppercase">
                                  REAR ({key})
                                </span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. RIGHT COLUMN: TRIGGER ZONE (TOP), DECK (MID), DROP ZONE (BOTTOM) */}
                <div className="col-span-2 flex flex-col items-center justify-between h-full py-1 gap-2">
                  {/* ✨ TRIGGER ZONE (ขวาบน ตามรูป) */}
                  <div className="w-20 h-28 sm:w-24 sm:h-32 rounded-xl border border-slate-700 bg-slate-900/80 flex flex-col items-center justify-center p-1.5 relative shadow-lg">
                    <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider mb-1">
                      Trigger
                    </span>
                    {playerTriggerZone ? (
                      <div className="w-full h-full flex flex-col items-center justify-between text-center animate-pulse">
                        <span className="text-[10px] font-black text-amber-300">
                          {playerTriggerZone.triggerType || 'NORMAL'}
                        </span>
                        <div className="text-xs font-black text-white truncate max-w-[80px]">
                          {playerTriggerZone.nameTh}
                        </div>
                        <span className="text-[9px] text-slate-400">
                          Power {playerTriggerZone.power}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-600 font-bold">READY</span>
                    )}
                  </div>

                  {/* 🎴 DECK (ขวากลาง ตามรูป) */}
                  <div
                    onClick={() => {
                      if (currentPhase === 'DRAW') handleNextPhase()
                    }}
                    className="w-20 h-28 sm:w-24 sm:h-32 rounded-xl border-2 border-indigo-500/40 bg-gradient-to-br from-indigo-950 via-slate-950 to-blue-950 flex flex-col items-center justify-between p-2 relative shadow-lg cursor-pointer hover:border-indigo-400 transition"
                  >
                    <span className="text-[10px] font-black uppercase text-indigo-300 tracking-wider">
                      Deck
                    </span>
                    <div className="text-2xl font-black text-white">{playerDeck.length}</div>
                    <span className="text-[9px] text-indigo-400 font-semibold">ใบ</span>
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
                    className="w-20 h-26 sm:w-24 sm:h-30 rounded-xl border border-slate-800 bg-slate-950 flex flex-col items-center justify-center p-1.5 relative cursor-pointer hover:bg-slate-900 transition"
                  >
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                      Drop Zone
                    </span>
                    <span className="text-lg font-black text-slate-400">
                      {playerDrop.length}
                    </span>
                    <span className="text-[9px] text-slate-600">คลิกเพื่อดู</span>
                  </div>
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* PLAYER HAND CARDS (มือผู้เล่นด้านล่าง)                  */}
              {/* ---------------------------------------------------- */}
              <div className="relative z-10 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-400">
                      🎴 การ์ดบนมือของคุณ ({playerHand.length} ใบ)
                    </span>
                    <span className="text-[10px] text-slate-500">
                      คลิกการ์ดเพื่อไรด์ (Ride) หรือคอล (Call) ลงเรียร์การ์ด
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
                  {playerHand.map((card, idx) => (
                    <div
                      key={card.instanceId}
                      className="w-24 h-36 shrink-0 rounded-xl bg-slate-900 border border-slate-700 p-2 flex flex-col justify-between hover:border-cyan-400 hover:-translate-y-2 transition-all cursor-pointer shadow-md group relative"
                    >
                      {/* Card Header */}
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold">
                          G{card.grade}
                        </span>
                        {card.shield > 0 && (
                          <span className="text-emerald-400 font-bold">
                            +{card.shield / 1000}k
                          </span>
                        )}
                      </div>

                      {/* Card Center */}
                      <div className="text-center my-auto">
                        <div className="text-xs font-black text-white truncate group-hover:text-cyan-300">
                          {card.nameTh}
                        </div>
                        <div className="text-[10px] font-bold text-yellow-400">
                          {card.power}
                        </div>
                        {card.triggerType && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-amber-950 text-amber-300 font-bold">
                            {card.triggerType}
                          </span>
                        )}
                      </div>

                      {/* Action Menu On Hover */}
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleRide(card, idx)}
                          className="w-full py-0.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-[9px] uppercase"
                        >
                          ไรด์ (Ride)
                        </button>
                        <div className="grid grid-cols-2 gap-1 text-[8px]">
                          <button
                            onClick={() => handleCallToRear(card, idx, 'fl')}
                            className="py-0.5 rounded bg-slate-800 hover:bg-emerald-600 text-slate-200"
                          >
                            คอล FL
                          </button>
                          <button
                            onClick={() => handleCallToRear(card, idx, 'fr')}
                            className="py-0.5 rounded bg-slate-800 hover:bg-emerald-600 text-slate-200"
                          >
                            คอล FR
                          </button>
                        </div>
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

            {/* ======================================================== */}
            {/* SIDEBAR: BATTLE LOGS & QUICK ACTIONS                     */}
            {/* ======================================================== */}
            <div className="flex flex-col gap-3">
              {/* Battle Log Box */}
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
                <div className="flex-1 overflow-y-auto space-y-1.5 text-xs text-slate-300 font-mono pr-1 max-h-[460px]">
                  {battleLogs.map((log, i) => (
                    <div
                      key={i}
                      className={`p-1.5 rounded-lg text-[11px] leading-tight ${
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
                    <div className="text-center text-slate-600 py-10 text-xs">
                      กดปุ่ม "เริ่มแบทเทิล" เพื่อเข้าสู่การประลอง
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Game Rules Reference Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-slate-400 space-y-1.5">
                <span className="font-bold text-cyan-400 block mb-1">
                  ⚡ สรุปกติกาสำคัญ (V-Series):
                </span>
                <p>• <strong>สแตนด์:</strong> หมุนการ์ดกลับเป็นแนวตั้งทุกต้นเทิร์น</p>
                <p>• <strong>ไรด์:</strong> สวมการ์ดเกรดเดิมหรือ +1 ทับแวนการ์ด (ไรด์ G3 ได้มาร์กเกอร์ Force I +10,000 พลัง)</p>
                <p>• <strong>โจมตี:</strong> สั่งแถวหน้าโจมตี แถวหลังบูสต์พลังเพิ่มได้</p>
                <p>• <strong>Drive Check:</strong> แวนการ์ดตีได้เปิดการ์ดทริกเกอร์เข้ามือ</p>
                <p>• <strong>เงื่อนไขแพ้-ชนะ:</strong> โดน 6 ดาเมจ หรือการ์ดหมดกอง = แพ้</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: DECK BUILDER (จัดเด็คอิสระตามกฎจริง)             */}
      {/* ======================================================== */}
      {activeTab === 'deckbuilder' && (
        <div className="flex-1 flex flex-col p-4 max-w-7xl mx-auto w-full gap-4">
          {/* Deck Stats & Validation Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <h2 className="text-base font-black text-white">ระบบจัดเด็คการ์ดอิสระ</h2>
                <p className="text-xs text-slate-400">
                  สร้างเด็คตามกฎ Official (50 ใบพอดี / ทริกเกอร์ 16 ใบพอดี / การ์ดชื่อซ้ำไม่เกิน 4 ใบ)
                </p>
              </div>

              {/* Status Badge */}
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
            </div>

            {/* Starter Deck Preset Buttons */}
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

          {/* Deck Breakdown Indicators */}
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
              <span className="text-[10px] text-slate-400 block font-semibold">เกรด 3 (Twin Drive)</span>
              <span className="text-lg font-black text-cyan-400">{deckStats.grade3} ใบ</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-slate-400 block font-semibold">เกรด 2 (Intercept)</span>
              <span className="text-lg font-black text-blue-400">{deckStats.grade2} ใบ</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-slate-400 block font-semibold">เกรด 1 (Boost)</span>
              <span className="text-lg font-black text-indigo-400">{deckStats.grade1} ใบ</span>
            </div>
          </div>

          {/* TWO COLUMNS: LEFT = CARD POOL (FILTER & ADD), RIGHT = CURRENT DECK LIST */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
            {/* Card Pool Catalog */}
            <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
              {/* Filter Controls */}
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

              {/* Cards Grid */}
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
                      className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between hover:border-cyan-500 transition shadow-md group relative"
                    >
                      <div>
                        <div className="flex justify-between items-center text-[10px] mb-1">
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 font-bold text-cyan-300">
                            Grade {card.grade}
                          </span>
                          <span className="text-yellow-400 font-bold">
                            {card.power} Atk
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-white truncate mb-1">
                          {card.nameTh}
                        </h4>
                        <div className="text-[10px] text-slate-400 truncate mb-2">
                          {card.nameEn}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>โล่: {card.shield ? `+${card.shield / 1000}k` : '-'}</span>
                          <span>{card.triggerType ? `[${card.triggerType}]` : card.skillType}</span>
                        </div>
                        <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800">
                          <button
                            onClick={() => handleAddCardToDeck(card.id)}
                            disabled={countInDeck >= 4}
                            className={`flex-1 py-1 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                              countInDeck >= 4
                                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 cursor-pointer'
                            }`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>ใส่เด็ค ({countInDeck}/4)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Current Deck Roster */}
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
                        className="bg-slate-950 border border-slate-800/80 rounded-xl p-2 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-slate-800 text-cyan-300 font-bold flex items-center justify-center text-[10px]">
                            G{card.grade}
                          </span>
                          <div>
                            <div className="font-bold text-white truncate max-w-[130px]">
                              {card.nameTh}
                            </div>
                            <span className="text-[10px] text-slate-500">
                              {card.triggerType ? `[${card.triggerType}]` : `${card.power} Atk`}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-black text-cyan-400">x{item.count}</span>
                          <button
                            onClick={() => handleRemoveCardFromDeck(item.cardId)}
                            className="p-1 rounded bg-slate-800 hover:bg-red-950 hover:text-red-400 text-slate-400 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                  {customDeckCards.length === 0 && (
                    <div className="text-center py-12 text-slate-600 text-xs">
                      ยังไม่มีการ์ดในเด็ค คลิกปุ่ม "ใส่เด็ค" เพื่อเพิ่มการ์ด
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button: Apply Deck to Battle */}
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
      {/* TAB 3: RULEBOOK (กติกาการเล่นอย่างละเอียด)                 */}
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
                  <li><strong>Ride Phase:</strong> ไรด์ยูนิตเกรดเดิมหรือเกรด +1 ทับแวนการ์ด (ยูนิตเดิมจะลงไปอยู่ใน Soul)</li>
                  <li><strong>Main Phase:</strong> คอลเรียร์การ์ดลงช่อง RG (เกรดต้องไม่เกินแวนการ์ด), สั่งใช้สกิล ACT</li>
                  <li><strong>Battle Phase:</strong> สั่งยูนิตแถวหน้าโจมตี, สั่งแถวหลังบูสต์, ฝ่ายรับกางการ์ดป้องกัน, ทำ Drive Check / Damage Check</li>
                  <li><strong>End Phase:</strong> ส่งการ์เดี้ยนลง Drop Zone, คืนค่าพลังที่บวกในเทิร์น, สลับเทิร์นให้คู่ต่อสู้</li>
                </ol>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <h3 className="font-bold text-amber-400 text-sm mb-1">2. ทริกเกอร์ทั้ง 4 ประเภท (Triggers)</h3>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Critical Trigger (สีแดง):</strong> พลัง +10,000 และเพิ่มค่าคริติคอล +1 (โจมตีเข้าโดน 2 ดาเมจ!)</li>
                  <li><strong>Draw Trigger (สีส้ม):</strong> พลัง +10,000 และจั่วการ์ด 1 ใบขึ้นมือทันที</li>
                  <li><strong>Heal Trigger (สีเขียว):</strong> พลัง +10,000 และรักษาดาเมจ 1 เม็ดลง Drop Zone (ต้องมีดาเมจ $\ge$ คู่ต่อสู้)</li>
                  <li><strong>Front Trigger (สีชมพู):</strong> เพิ่มพลัง +10,000 ให้กับยูนิตแถวหน้าทั้งหมดของคุณ</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <h3 className="font-bold text-purple-400 text-sm mb-1">3. Imaginary Gift: Force (เฉพาะ V-Series)</h3>
                <p>
                  เมื่อทำการไรด์ยูนิตเกรด 3 ที่มีสัญลักษณ์ <strong>Force</strong> คุณจะได้รับมาร์กเกอร์ Force วางลงบนช่องวงกลม (Vanguard Circle) ซึ่งจะมอบพลังโจมตี <strong>+10,000 ตลอดทั้งเกม</strong> ในเทิร์นของคุณ!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
