import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Flame,
  Shield,
  Sprout,
  Footprints,
  User,
  Zap,
  Play,
  RotateCcw,
  Trophy,
  HelpCircle,
  Volume2,
  VolumeX,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Sparkles,
  Heart,
  Swords,
  ChevronRight,
  Award,
  CircleDot,
  Radio,
} from 'lucide-react'

// ==========================================
// 🔊 ระบบเสียงสังเคราะห์ Arcade Web Audio API
// ==========================================
class SoundFX {
  constructor() {
    this.ctx = null
    this.muted = false
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) this.ctx = new AudioCtx()
    }
  }

  beep(freq = 440, type = 'sine', duration = 0.1, gainVal = 0.15) {
    if (this.muted) return
    this.init()
    if (!this.ctx) return
    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime)
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + duration)
    } catch {}
  }

  jump() {
    if (this.muted) return
    this.init()
    if (!this.ctx) return
    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(240, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(560, this.ctx.currentTime + 0.18)
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + 0.18)
    } catch {}
  }

  transform() {
    if (this.muted) return
    this.init()
    if (!this.ctx) return
    try {
      const t = this.ctx.currentTime
      const osc1 = this.ctx.createOscillator()
      const osc2 = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc1.type = 'sawtooth'
      osc2.type = 'triangle'
      osc1.frequency.setValueAtTime(160, t)
      osc1.frequency.exponentialRampToValueAtTime(840, t + 0.3)
      osc2.frequency.setValueAtTime(320, t)
      osc2.frequency.exponentialRampToValueAtTime(1100, t + 0.3)
      gain.gain.setValueAtTime(0.25, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35)
      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(this.ctx.destination)
      osc1.start(t)
      osc2.start(t)
      osc1.stop(t + 0.35)
      osc2.stop(t + 0.35)
    } catch {}
  }

  fireball() {
    if (this.muted) return
    this.init()
    if (!this.ctx) return
    try {
      const t = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(550, t)
      osc.frequency.exponentialRampToValueAtTime(130, t + 0.22)
      gain.gain.setValueAtTime(0.25, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(t)
      osc.stop(t + 0.22)
    } catch {}
  }

  smash() {
    if (this.muted) return
    this.init()
    if (!this.ctx) return
    try {
      const t = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(160, t)
      osc.frequency.exponentialRampToValueAtTime(45, t + 0.28)
      gain.gain.setValueAtTime(0.35, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(t)
      osc.stop(t + 0.28)
    } catch {}
  }

  collect() {
    this.beep(587.33, 'triangle', 0.08, 0.2)
    setTimeout(() => this.beep(880, 'triangle', 0.12, 0.2), 65)
  }

  hurt() {
    this.beep(110, 'sawtooth', 0.22, 0.3)
  }

  victory() {
    const notes = [440, 554.37, 659.25, 880]
    notes.forEach((freq, idx) => {
      setTimeout(() => this.beep(freq, 'triangle', 0.2, 0.25), idx * 120)
    })
  }

  gameover() {
    const notes = [440, 370, 311.13, 220]
    notes.forEach((freq, idx) => {
      setTimeout(() => this.beep(freq, 'sawtooth', 0.25, 0.25), idx * 150)
    })
  }
}

const sfx = new SoundFX()

// ==========================================
// 🧬 นิยามฟอร์มเอเลี่ยนทั้ง 4 ตัว + ร่างเบ็น (ปรับสมดุลใหม่: กระโดดนุ่มนวล พลังอยู่นานขึ้น)
// ==========================================
const ALIEN_FORMS = {
  ben: {
    id: 'ben',
    name: 'Ben Tennyson',
    nameTh: 'เบ็น เท็นนีย์สัน (มนุษย์)',
    color: '#10b981',
    bg: 'from-emerald-500 to-green-600',
    icon: User,
    speed: 4.2,
    jumpPower: 9.6, // ปรับลดจาก 11.2 ให้นุ่มนวล ไม่ลอยเร็วเกินไป
    desc: 'คล่องแคล่ว ร่างคนจะฟื้นฟูแบตเตอรี่ Omnitrix คืนอย่างรวดเร็ว!',
    skill: 'ฟื้นฟูพลังงาน Omnitrix เร็วมาก',
  },
  heatblast: {
    id: 'heatblast',
    name: 'Heatblast',
    nameTh: 'ฮีทบลาสท์ (Pyronite)',
    color: '#f97316',
    bg: 'from-amber-500 to-red-600',
    icon: Flame,
    speed: 4.0,
    jumpPower: 9.2,
    desc: 'ยิงลูกไฟระเบิดระยะไกล ทะลวงสิ่งกีดขวางและเผาศัตรู!',
    skill: 'ยิงลูกไฟ (Fireball)',
  },
  cannonbolt: {
    id: 'cannonbolt',
    name: 'Cannonbolt',
    nameTh: 'แคนนอนโบลท์ (Arburian Pelarota)',
    color: '#eab308',
    bg: 'from-yellow-400 to-amber-600',
    icon: Shield,
    speed: 6.5,
    jumpPower: 8.6,
    desc: 'ม้วนตัวเป็นลูกบอลหุ้มเกราะกลิ้งความเร็วสูง บดขยี้ก้อนหินและศัตรู!',
    skill: 'กลิ้งชนหิน & ศัตรู (Hyper Roll)',
  },
  wildvine: {
    id: 'wildvine',
    name: 'Wildvine',
    nameTh: 'ไวล์ดไวน์ (Florauna)',
    color: '#22c55e',
    bg: 'from-green-500 to-emerald-700',
    icon: Sprout,
    speed: 4.1,
    jumpPower: 9.8,
    desc: 'แส้เถาวัลย์หนามยาว ฟาดกวาดศัตรูเป็นวงกว้างในระยะปลอดภัย!',
    skill: 'แส้เถาวัลย์หนาม (Thorn Whip)',
  },
  wildmutt: {
    id: 'wildmutt',
    name: 'Wildmutt',
    nameTh: 'ไวลด์มัตต์ (Vulpimancer)',
    color: '#ea580c',
    bg: 'from-orange-500 to-amber-700',
    icon: Footprints,
    speed: 5.4,
    jumpPower: 11.5, // กระโดดสูงพิเศษแต่นุ่มนวล
    desc: 'อสูรไร้ตา สัมผัสเฉียบคม กระโดดได้สูงเป็นพิเศษ และตะปบระยะประชิด!',
    skill: 'กระโดดสูงพิเศษ & กรงเล็บ (Beast Leap)',
  },
}

export default function Ben10Game({ currentUser }) {
  const [screen, setScreen] = useState('menu')
  const [muted, setMuted] = useState(false)
  const [leaderboard, setLeaderboard] = useState([])
  const [finalScore, setFinalScore] = useState(0)

  // ข้อมูลแสดงบน HUD
  const [hudHp, setHudHp] = useState(100)
  const [hudEnergy, setHudEnergy] = useState(100)
  const [hudLives, setHudLives] = useState(3)
  const [hudScore, setHudScore] = useState(0)
  const [hudCurrentForm, setHudCurrentForm] = useState('ben')
  const [hudProgress, setHudProgress] = useState(0)
  const [isDialOpen, setIsDialOpen] = useState(false)
  const [dialSelection, setDialSelection] = useState('heatblast')

  const canvasRef = useRef(null)
  const animFrameId = useRef(null)

  // เก็บ State ภายในของ Engine
  const engineRef = useRef({
    keys: {
      left: false,
      right: false,
      up: false,
      attack: false,
      dial: false,
    },
    player: {
      x: 180,
      y: 350,
      vx: 0,
      vy: 0,
      w: 40,
      h: 60,
      grounded: false,
      facing: 1,
      form: 'ben',
      hp: 100,
      maxHp: 100,
      energy: 100,
      maxEnergy: 100,
      lives: 3,
      score: 0,
      invulnerable: 0,
      attackCooldown: 0,
      isRolling: false,
      animTick: 0,
    },
    cameraX: 0,
    stageWidth: 4400,
    platforms: [],
    hazards: [],
    boulders: [],
    collectibles: [],
    enemies: [],
    projectiles: [],
    particles: [],
    boss: null,
    goBannerTick: 110,
    running: false,
    dialModalOpen: false,
    screenShake: 0,
  })

  // โหลด Leaderboard จาก API
  const fetchScores = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5001/api/scores?game=ben10')
      if (res.ok) {
        const data = await res.json()
        setLeaderboard(data)
      }
    } catch {}
  }, [])

  useEffect(() => {
    fetchScores()
  }, [fetchScores])

  // บันทึกคะแนน
  const saveScoreToDB = async (scoreToSave) => {
    const uname = currentUser?.username || 'HeroBen10'
    try {
      await fetch('http://localhost:5001/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: uname,
          game_name: 'ben10',
          score: scoreToSave,
        }),
      })
      fetchScores()
    } catch {}
  }

  const toggleMute = () => {
    sfx.muted = !muted
    setMuted(!muted)
  }

  // ==========================================
  // 🗺️ สร้างด่าน (Level Generator)
  // ==========================================
  const initLevel = () => {
    const eng = engineRef.current
    eng.stageWidth = 4400
    eng.cameraX = 0
    eng.goBannerTick = 110
    eng.particles = []
    eng.projectiles = []
    eng.screenShake = 0

    // รีเซ็ตตัวผู้เล่น
    eng.player = {
      x: 180,
      y: 350,
      vx: 0,
      vy: 0,
      w: 40,
      h: 60,
      grounded: false,
      facing: 1,
      form: 'ben',
      hp: 100,
      maxHp: 100,
      energy: 100,
      maxEnergy: 100,
      lives: 3,
      score: 0,
      invulnerable: 0,
      attackCooldown: 0,
      isRolling: false,
      animTick: 0,
    }

    // แพลตฟอร์มพื้นดินและแท่นกระโดด
    eng.platforms = [
      { x: 0, y: 440, w: 900, h: 100, type: 'ground' },
      { x: 980, y: 440, w: 720, h: 100, type: 'ground' },
      { x: 1800, y: 440, w: 920, h: 100, type: 'ground' },
      { x: 2820, y: 440, w: 1580, h: 100, type: 'ground' },

      // แท่นลอยหินโบราณ
      { x: 380, y: 340, w: 140, h: 22, type: 'rock' },
      { x: 580, y: 260, w: 160, h: 22, type: 'rock' },
      { x: 800, y: 320, w: 120, h: 22, type: 'rock' },

      // สะพานไม้ข้ามบ่อกรด
      { x: 900, y: 370, w: 80, h: 16, type: 'wood' },
      { x: 1100, y: 350, w: 180, h: 22, type: 'rock' },
      { x: 1350, y: 280, w: 160, h: 22, type: 'rock' },
      { x: 1560, y: 330, w: 140, h: 22, type: 'rock' },

      // โซนวิหารโบราณ
      { x: 1960, y: 330, w: 160, h: 22, type: 'rock' },
      { x: 2200, y: 250, w: 180, h: 22, type: 'rock' },
      { x: 2440, y: 320, w: 160, h: 22, type: 'rock' },
      { x: 2980, y: 340, w: 200, h: 22, type: 'rock' },
      { x: 3280, y: 270, w: 220, h: 22, type: 'rock' },
      { x: 3580, y: 340, w: 180, h: 22, type: 'rock' },
    ]

    // บ่อกรด / กับดักหนาม
    eng.hazards = [
      { x: 900, y: 460, w: 80, h: 80, type: 'acid' },
      { x: 1700, y: 460, w: 100, h: 80, type: 'acid' },
      { x: 2720, y: 460, w: 100, h: 80, type: 'acid' },
      { x: 1420, y: 420, w: 60, h: 20, type: 'spikes' },
      { x: 2320, y: 420, w: 70, h: 20, type: 'spikes' },
    ]

    // หินก้อนใหญ่ขวางทาง
    eng.boulders = [
      { x: 740, y: 375, w: 45, h: 65, hp: 40, broken: false },
      { x: 1520, y: 375, w: 48, h: 65, hp: 40, broken: false },
      { x: 2560, y: 375, w: 50, h: 65, hp: 40, broken: false },
      { x: 3120, y: 375, w: 50, h: 65, hp: 40, broken: false },
    ]

    // ไอเทมเก็บสะสม
    eng.collectibles = [
      { x: 420, y: 300, type: 'dna', taken: false },
      { x: 640, y: 220, type: 'dna', taken: false },
      { x: 1150, y: 310, type: 'dna', taken: false },
      { x: 1400, y: 240, type: 'dna', taken: false },
      { x: 2020, y: 290, type: 'dna', taken: false },
      { x: 2270, y: 210, type: 'dna', taken: false },
      { x: 3050, y: 300, type: 'dna', taken: false },
      { x: 3350, y: 230, type: 'dna', taken: false },

      { x: 840, y: 270, type: 'card', taken: false },
      { x: 1620, y: 280, type: 'card', taken: false },
      { x: 2490, y: 270, type: 'card', taken: false },
      { x: 3630, y: 290, type: 'card', taken: false },

      { x: 1220, y: 405, type: 'smoothie', taken: false },
      { x: 2120, y: 405, type: 'smoothie', taken: false },
      { x: 3480, y: 405, type: 'smoothie', taken: false },
    ]

    // มอนสเตอร์ศัตรู
    eng.enemies = [
      {
        id: 1,
        type: 'crawler',
        name: 'Root Crawler',
        x: 480,
        y: 395,
        w: 42,
        h: 46,
        vx: 1.1,
        minX: 350,
        maxX: 650,
        hp: 45,
        maxHp: 45,
        alive: true,
      },
      {
        id: 2,
        type: 'flyer',
        name: 'Spore Drone',
        x: 820,
        y: 220,
        w: 36,
        h: 30,
        vx: 1.4,
        minX: 700,
        maxX: 920,
        hp: 30,
        maxHp: 30,
        alive: true,
        baseY: 220,
      },
      {
        id: 3,
        type: 'crawler',
        name: 'Root Crawler',
        x: 1180,
        y: 395,
        w: 42,
        h: 46,
        vx: -1.2,
        minX: 1050,
        maxX: 1350,
        hp: 45,
        maxHp: 45,
        alive: true,
      },
      {
        id: 4,
        type: 'flyer',
        name: 'Spore Drone',
        x: 1450,
        y: 190,
        w: 36,
        h: 30,
        vx: 1.6,
        minX: 1300,
        maxX: 1600,
        hp: 30,
        maxHp: 30,
        alive: true,
        baseY: 190,
      },
      {
        id: 5,
        type: 'crawler',
        name: 'Root Crawler',
        x: 1980,
        y: 395,
        w: 42,
        h: 46,
        vx: 1.3,
        minX: 1850,
        maxX: 2250,
        hp: 55,
        maxHp: 55,
        alive: true,
      },
      {
        id: 6,
        type: 'crawler',
        name: 'Mutant Sentinel',
        x: 2360,
        y: 395,
        w: 46,
        h: 50,
        vx: -1.3,
        minX: 2200,
        maxX: 2520,
        hp: 70,
        maxHp: 70,
        alive: true,
      },
      {
        id: 7,
        type: 'flyer',
        name: 'Spore Drone',
        x: 2900,
        y: 200,
        w: 36,
        h: 30,
        vx: 1.8,
        minX: 2750,
        maxX: 3080,
        hp: 35,
        maxHp: 35,
        alive: true,
        baseY: 200,
      },
      {
        id: 8,
        type: 'crawler',
        name: 'Root Crawler',
        x: 3250,
        y: 395,
        w: 42,
        h: 46,
        vx: 1.4,
        minX: 3100,
        maxX: 3450,
        hp: 55,
        maxHp: 55,
        alive: true,
      },
    ]

    // ==========================================
    // 👑 บอสใหญ่ยกระดับความอึดและการต่อสู้ (HP เพิ่มเป็น 650!)
    // ==========================================
    eng.boss = {
      x: 3980,
      y: 310,
      w: 110,
      h: 130,
      hp: 650, // เพิ่มความอึดเป็น 650 (เดิม 160 ตายไวเกินไป)
      maxHp: 650,
      vx: 1.0,
      minX: 3820,
      maxX: 4260,
      alive: true,
      attackTimer: 0,
      slamCooldown: 0,
      phase: 1, // 1 = ปกติ, 2 = คลั่ง (Enraged) เมื่อเลือดต่ำกว่า 300
      hitFlash: 0,
    }
  }

  const startGame = () => {
    sfx.init()
    sfx.transform()
    initLevel()
    setScreen('playing')
    engineRef.current.running = true
  }

  const triggerTransform = (formKey) => {
    const eng = engineRef.current
    if (eng.player.form === formKey) {
      eng.player.form = 'ben'
      sfx.beep(320, 'sine', 0.15)
    } else {
      eng.player.form = formKey
      sfx.transform()
      for (let i = 0; i < 26; i++) {
        eng.particles.push({
          x: eng.player.x + eng.player.w / 2,
          y: eng.player.y + eng.player.h / 2,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          life: 30,
          maxLife: 30,
          color: '#22c55e',
          size: Math.random() * 5 + 3,
        })
      }
    }
    setIsDialOpen(false)
    eng.dialModalOpen = false
  }

  // ==========================================
  // 🕹️ คีย์บอร์ด
  // ==========================================
  useEffect(() => {
    const handleKeyDown = (e) => {
      const eng = engineRef.current
      if (e.repeat) return

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') eng.keys.left = true
      if (e.code === 'ArrowRight' || e.code === 'KeyD') eng.keys.right = true
      if (e.code === 'ArrowUp' || e.code === 'KeyW') eng.keys.up = true
      if (e.code === 'Space' || e.code === 'KeyX') {
        eng.keys.attack = true
        handleAttackAction()
      }

      if (e.code === 'KeyZ') {
        sfx.beep(520, 'sine', 0.08)
        setIsDialOpen((prev) => {
          eng.dialModalOpen = !prev
          return !prev
        })
      }

      if (eng.dialModalOpen) {
        if (e.code === 'ArrowUp') setDialSelection('heatblast')
        if (e.code === 'ArrowLeft') setDialSelection('wildvine')
        if (e.code === 'ArrowRight') setDialSelection('cannonbolt')
        if (e.code === 'ArrowDown') setDialSelection('wildmutt')
        if (e.code === 'Enter') triggerTransform(dialSelection)
      }
    }

    const handleKeyUp = (e) => {
      const eng = engineRef.current
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') eng.keys.left = false
      if (e.code === 'ArrowRight' || e.code === 'KeyD') eng.keys.right = false
      if (e.code === 'ArrowUp' || e.code === 'KeyW') eng.keys.up = false
      if (e.code === 'Space' || e.code === 'KeyX') eng.keys.attack = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [dialSelection])

  const handleAttackAction = () => {
    const eng = engineRef.current
    if (!eng.running || eng.dialModalOpen) return
    const p = eng.player
    const form = p.form

    if (p.attackCooldown > 0) return

    if (form === 'heatblast') {
      p.attackCooldown = 18
      sfx.fireball()
      eng.projectiles.push({
        x: p.facing > 0 ? p.x + p.w + 6 : p.x - 20,
        y: p.y + p.h * 0.38,
        vx: p.facing * 9.5,
        vy: 0,
        r: 12,
        damage: 24,
        color: '#f97316',
        from: 'player',
        type: 'fireball',
      })
      // เผาผลาญพลังงานเพียงนิดเดียว (1.2) เพื่อให้เล่นได้นาน
      p.energy = Math.max(0, p.energy - 1.2)
    } else if (form === 'cannonbolt') {
      p.isRolling = true
      p.attackCooldown = 32
      sfx.smash()
      p.vx = p.facing * 11
      for (let i = 0; i < 10; i++) {
        eng.particles.push({
          x: p.x + p.w / 2,
          y: p.y + p.h,
          vx: (Math.random() - 0.5) * 5,
          vy: -Math.random() * 3,
          life: 18,
          maxLife: 18,
          color: '#d4d4d8',
          size: Math.random() * 4 + 2,
        })
      }
    } else if (form === 'wildvine') {
      p.attackCooldown = 22
      sfx.beep(350, 'sawtooth', 0.12)
      eng.projectiles.push({
        x: p.facing > 0 ? p.x + p.w : p.x - 80,
        y: p.y + p.h * 0.4,
        vx: p.facing * 4,
        vy: 0,
        w: 80,
        h: 24,
        damage: 26,
        life: 12,
        color: '#22c55e',
        from: 'player',
        type: 'whip',
      })
    } else if (form === 'wildmutt') {
      p.attackCooldown = 15
      sfx.beep(280, 'sawtooth', 0.1)
      p.vx = p.facing * 6
      eng.projectiles.push({
        x: p.facing > 0 ? p.x + p.w : p.x - 35,
        y: p.y + p.h * 0.3,
        vx: 0,
        vy: 0,
        w: 36,
        h: 32,
        damage: 30,
        life: 8,
        color: '#ea580c',
        from: 'player',
        type: 'claw',
      })
    }
  }

  // ==========================================
  // ⚙️ Game Loop & Physics Tuning
  // ==========================================
  useEffect(() => {
    if (screen !== 'playing') return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const updatePhysics = () => {
      const eng = engineRef.current
      if (!eng.running) return
      if (eng.dialModalOpen) return

      const p = eng.player
      const currentStats = ALIEN_FORMS[p.form]

      if (p.attackCooldown > 0) p.attackCooldown--
      if (p.invulnerable > 0) p.invulnerable--
      if (eng.screenShake > 0) eng.screenShake--
      p.animTick++

      // ==========================================
      // 🔋 ปรับจูนพลังงาน Omnitrix ให้อยู่ได้นานขึ้นเกือบ 4 เท่า!
      // ==========================================
      if (p.form === 'ben') {
        // เบ็นร่างคนฟื้นพลังเร็วมาก (+0.38 ต่อเฟรม ~4 วิเต็มหลอด)
        p.energy = Math.min(p.maxEnergy, p.energy + 0.38)
      } else {
        // ร่างเอเลี่ยนลดพลังงานช้าลงเหลือเพียง 0.035 ต่อเฟรม (อยู่ได้เกือบ 50 วินาที!)
        p.energy = Math.max(0, p.energy - 0.035)
        if (p.energy <= 0) {
          p.form = 'ben'
          sfx.hurt()
        }
      }

      if (p.isRolling && Math.abs(p.vx) < 3) {
        p.isRolling = false
      }

      // การเคลื่อนที่แนวนอน
      const moveSpeed = p.isRolling ? 10.5 : currentStats.speed
      if (eng.keys.left) {
        p.vx = -moveSpeed
        p.facing = -1
      } else if (eng.keys.right) {
        p.vx = moveSpeed
        p.facing = 1
      } else {
        p.vx *= 0.78
        if (Math.abs(p.vx) < 0.2) p.vx = 0
      }

      // ==========================================
      // 🦘 ฟิสิกส์การกระโดดที่นุ่มนวลและไม่เร็วเกินไป
      // ==========================================
      if (eng.keys.up && p.grounded) {
        p.vy = -currentStats.jumpPower
        p.grounded = false
        sfx.jump()
      }

      // ปรับแรงโน้มถ่วงให้อ่อนลง (0.34 แทน 0.58) พร้อม Apex Floatiness
      let currentGravity = 0.34
      if (Math.abs(p.vy) < 1.8) {
        currentGravity = 0.18 // ลอยค้างที่จุดสูงสุดอย่างนุ่มนวล
      }
      p.vy += currentGravity
      if (p.vy > 10.5) p.vy = 10.5 // จำกัดความเร็วตกไม่ให้ดิ่งเร็วเกินไป

      p.x += p.vx
      p.y += p.vy

      if (p.x < 10) p.x = 10

      // ชนแพลตฟอร์ม
      p.grounded = false
      for (const plat of eng.platforms) {
        if (
          p.x + p.w > plat.x &&
          p.x < plat.x + plat.w &&
          p.y + p.h >= plat.y &&
          p.y + p.h <= plat.y + 24 &&
          p.vy >= 0
        ) {
          p.y = plat.y - p.h
          p.vy = 0
          p.grounded = true
        }
      }

      // ชนก้อนหิน (Boulders)
      for (const b of eng.boulders) {
        if (b.broken) continue
        if (
          p.x + p.w > b.x &&
          p.x < b.x + b.w &&
          p.y + p.h > b.y &&
          p.y < b.y + b.h
        ) {
          if (p.form === 'cannonbolt' && (p.isRolling || Math.abs(p.vx) > 4)) {
            b.broken = true
            p.score += 250
            sfx.smash()
            for (let i = 0; i < 14; i++) {
              eng.particles.push({
                x: b.x + b.w / 2,
                y: b.y + b.h / 2,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 25,
                maxLife: 25,
                color: '#71717a',
                size: Math.random() * 6 + 3,
              })
            }
          } else {
            if (p.vx > 0) p.x = b.x - p.w
            else if (p.vx < 0) p.x = b.x + b.w
            p.vx = 0
          }
        }
      }

      // ตกเหว
      if (p.y > 560) {
        playerTakeDamage(40, 'กรด/เหวลึก')
        p.x = Math.max(180, p.x - 250)
        p.y = 350
        p.vy = 0
      }

      // ชนกับดัก
      for (const hz of eng.hazards) {
        if (
          p.x + p.w > hz.x &&
          p.x < hz.x + hz.w &&
          p.y + p.h > hz.y &&
          p.y < hz.y + hz.h
        ) {
          if (p.invulnerable <= 0) {
            playerTakeDamage(18, 'กับดักหนาม/กรด')
            p.vy = -6
          }
        }
      }

      // เก็บไอเทม
      for (const col of eng.collectibles) {
        if (col.taken) continue
        if (
          p.x + p.w > col.x - 16 &&
          p.x < col.x + 16 &&
          p.y + p.h > col.y - 16 &&
          p.y < col.y + 16
        ) {
          col.taken = true
          sfx.collect()
          if (col.type === 'dna') {
            p.score += 200
            p.energy = Math.min(p.maxEnergy, p.energy + 40)
          } else if (col.type === 'card') {
            p.score += 500
          } else if (col.type === 'smoothie') {
            p.hp = Math.min(p.maxHp, p.hp + 35)
          }
          for (let i = 0; i < 8; i++) {
            eng.particles.push({
              x: col.x,
              y: col.y,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4,
              life: 20,
              maxLife: 20,
              color: col.type === 'dna' ? '#22c55e' : '#f59e0b',
              size: 4,
            })
          }
        }
      }

      // อัปเดตกระสุนผู้เล่น & ศัตรู
      for (let i = eng.projectiles.length - 1; i >= 0; i--) {
        const pr = eng.projectiles[i]
        pr.x += pr.vx
        pr.y += pr.vy
        if (pr.life !== undefined) {
          pr.life--
          if (pr.life <= 0) {
            eng.projectiles.splice(i, 1)
            continue
          }
        }

        // ลูกไฟชนหิน
        if (pr.type === 'fireball') {
          for (const b of eng.boulders) {
            if (b.broken) continue
            if (
              pr.x + pr.r > b.x &&
              pr.x - pr.r < b.x + b.w &&
              pr.y > b.y &&
              pr.y < b.y + b.h
            ) {
              b.hp -= pr.damage
              eng.projectiles.splice(i, 1)
              sfx.fireball()
              if (b.hp <= 0) {
                b.broken = true
                p.score += 250
                sfx.smash()
              }
              break
            }
          }
        }

        // กระสุนพ้นขอบ
        if (
          pr.x < eng.cameraX - 100 ||
          pr.x > eng.cameraX + 1100 ||
          pr.y > 600
        ) {
          eng.projectiles.splice(i, 1)
          continue
        }

        // ชนศัตรู
        for (const en of eng.enemies) {
          if (!en.alive) continue
          const hit =
            pr.type === 'fireball'
              ? pr.x + pr.r > en.x &&
                pr.x - pr.r < en.x + en.w &&
                pr.y + pr.r > en.y &&
                pr.y - pr.r < en.y + en.h
              : pr.x + pr.w > en.x &&
                pr.x < en.x + en.w &&
                pr.y + pr.h > en.y &&
                pr.y < en.y + en.h

          if (hit) {
            en.hp -= pr.damage
            sfx.hurt()
            if (pr.type === 'fireball') eng.projectiles.splice(i, 1)
            if (en.hp <= 0) {
              en.alive = false
              p.score += en.type === 'crawler' ? 200 : 250
              sfx.smash()
            }
            break
          }
        }

        // ==========================================
        // ⚔️ ชนตัวบอส (ตรวจจับความเสียหายและการต่อสู้บอส)
        // ==========================================
        if (eng.boss && eng.boss.alive && pr.from === 'player') {
          const bs = eng.boss
          const hitBoss =
            pr.type === 'fireball'
              ? pr.x + pr.r > bs.x &&
                pr.x - pr.r < bs.x + bs.w &&
                pr.y > bs.y &&
                pr.y < bs.y + bs.h
              : pr.x + pr.w > bs.x &&
                pr.x < bs.x + bs.w &&
                pr.y + pr.h > bs.y &&
                pr.y < bs.y + bs.h
          if (hitBoss) {
            bs.hp -= pr.damage
            bs.hitFlash = 8 // แฟลชสีขาวเมื่อโดนตี
            sfx.hurt()
            if (pr.type === 'fireball') eng.projectiles.splice(i, 1)

            // เมื่อเลือดบอสลดต่ำกว่า 300 เข้าสู่ Phase 2 (คลั่ง!)
            if (bs.hp <= 300 && bs.phase === 1) {
              bs.phase = 2
              bs.vx *= 1.4
              eng.screenShake = 20
              sfx.smash()
            }

            if (bs.hp <= 0) {
              bs.alive = false
              p.score += 6000
              triggerVictory()
            }
          }
        }

        // กระสุนบอสชนตัวผู้เล่น
        if (pr.from === 'boss') {
          if (
            pr.x + (pr.r || 10) > p.x &&
            pr.x - (pr.r || 10) < p.x + p.w &&
            pr.y > p.y &&
            pr.y < p.y + p.h
          ) {
            if (p.invulnerable <= 0) {
              playerTakeDamage(pr.damage || 20, 'หนามพิษบอส')
              eng.projectiles.splice(i, 1)
            }
          }
        }
      }

      // อัปเดตศัตรู
      for (const en of eng.enemies) {
        if (!en.alive) continue

        if (en.type === 'crawler') {
          en.x += en.vx
          if (en.x <= en.minX || en.x + en.w >= en.maxX) en.vx *= -1
        } else if (en.type === 'flyer') {
          en.x += en.vx
          en.y = en.baseY + Math.sin(p.animTick * 0.08) * 20
          if (en.x <= en.minX || en.x + en.w >= en.maxX) en.vx *= -1
        }

        // ชนตัวผู้เล่น
        if (
          p.x + p.w > en.x &&
          p.x < en.x + en.w &&
          p.y + p.h > en.y &&
          p.y < en.y + en.h
        ) {
          if (p.form === 'cannonbolt' && (p.isRolling || Math.abs(p.vx) > 4)) {
            en.alive = false
            p.score += 250
            sfx.smash()
          } else if (p.invulnerable <= 0) {
            playerTakeDamage(16, en.name)
            p.vx = (p.x - en.x > 0 ? 1 : -1) * 6
            p.vy = -3.5
          }
        }
      }

      // ==========================================
      // 👹 อัปเดตพฤติกรรมบอส (Boss AI & Phase System)
      // ==========================================
      if (eng.boss && eng.boss.alive) {
        const bs = eng.boss
        bs.x += bs.vx
        if (bs.x <= bs.minX || bs.x + bs.w >= bs.maxX) bs.vx *= -1
        bs.attackTimer++
        if (bs.hitFlash > 0) bs.hitFlash--

        // Phase 1: ยิงหนามรากไม้ทุก 2.2 วินาที
        if (bs.phase === 1) {
          if (bs.attackTimer % 130 === 0) {
            eng.projectiles.push({
              x: bs.x,
              y: bs.y + 60,
              vx: -6.0,
              vy: 0,
              r: 12,
              damage: 22,
              color: '#15803d',
              from: 'boss',
              type: 'thorn',
            })
            sfx.beep(170, 'sawtooth', 0.2)
          }
        } else {
          // Phase 2 (Enraged): ยิงหนามกระจาย 3 ทิศทาง และทุบพื้นสร้างคลื่นสั่นสะเทือน!
          if (bs.attackTimer % 100 === 0) {
            // ยิงกระจาย 3 ลูก
            ;[-1.8, 0, 1.8].forEach((vy) => {
              eng.projectiles.push({
                x: bs.x,
                y: bs.y + 55,
                vx: -6.8,
                vy: vy,
                r: 13,
                damage: 24,
                color: '#dc2626',
                from: 'boss',
                type: 'thorn',
              })
            })
            sfx.beep(140, 'sawtooth', 0.25)
          }

          // ทุบพื้นสร้างคลื่นช็อกเวฟ
          if (bs.attackTimer % 220 === 0) {
            eng.screenShake = 14
            sfx.smash()
            eng.projectiles.push({
              x: bs.x,
              y: 430,
              vx: -5.5,
              vy: 0,
              r: 15,
              damage: 28,
              color: '#991b1b',
              from: 'boss',
              type: 'shockwave',
            })
          }
        }

        // ชนตัวบอส
        if (
          p.x + p.w > bs.x &&
          p.x < bs.x + bs.w &&
          p.y + p.h > bs.y &&
          p.y < bs.y + bs.h
        ) {
          if (p.invulnerable <= 0) {
            playerTakeDamage(24, 'บอสยักษ์')
            p.vx = -7
            p.vy = -4
          }
        }
      }

      // อนุภาค
      for (let i = eng.particles.length - 1; i >= 0; i--) {
        const pt = eng.particles[i]
        pt.x += pt.vx
        pt.y += pt.vy
        pt.life--
        if (pt.life <= 0) eng.particles.splice(i, 1)
      }

      // เลื่อนกล้องตามตัวผู้เล่น
      const targetCamX = p.x - 300
      eng.cameraX += (targetCamX - eng.cameraX) * 0.1
      if (eng.cameraX < 0) eng.cameraX = 0
      if (eng.cameraX > eng.stageWidth - 960) eng.cameraX = eng.stageWidth - 960

      setHudHp(Math.round(p.hp))
      setHudEnergy(Math.round(p.energy))
      setHudLives(p.lives)
      setHudScore(p.score)
      setHudCurrentForm(p.form)
      setHudProgress(Math.min(100, Math.round((p.x / eng.stageWidth) * 100)))

      if (eng.goBannerTick > 0) eng.goBannerTick--
    }

    const playerTakeDamage = (amt) => {
      const eng = engineRef.current
      const p = eng.player
      p.hp -= amt
      p.invulnerable = 45
      eng.screenShake = 8
      sfx.hurt()

      if (p.hp <= 0) {
        p.lives--
        if (p.lives <= 0) {
          triggerGameOver()
        } else {
          p.hp = 100
          p.energy = 100
          p.form = 'ben'
          p.x = Math.max(180, p.x - 220)
          p.y = 350
        }
      }
    }

    const triggerGameOver = () => {
      const eng = engineRef.current
      eng.running = false
      setFinalScore(eng.player.score)
      saveScoreToDB(eng.player.score)
      sfx.gameover()
      setScreen('gameover')
    }

    const triggerVictory = () => {
      const eng = engineRef.current
      eng.running = false
      setFinalScore(eng.player.score)
      saveScoreToDB(eng.player.score)
      sfx.victory()
      setScreen('victory')
    }

    // ==========================================
    // 🎨 กราฟิกโมเดลความละเอียดสูง (High-Fidelity Model Drawers)
    // ==========================================

    // 1. รถบ้าน The Rust Bucket สไตล์การ์ตูนคลาสสิกละเอียดสวยงาม
    const drawRustBucket = (x, y) => {
      ctx.save()
      ctx.translate(x, y)

      // ล้อหลังและล้อหน้า (มีขอบยางและกระทะล้อโครเมียม)
      const drawWheel = (wx, wy) => {
        ctx.fillStyle = '#0f172a'
        ctx.beginPath()
        ctx.arc(wx, wy, 20, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#64748b'
        ctx.beginPath()
        ctx.arc(wx, wy, 11, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#f8fafc'
        ctx.beginPath()
        ctx.arc(wx, wy, 5, 0, Math.PI * 2)
        ctx.fill()
      }
      drawWheel(50, 105)
      drawWheel(150, 105)

      // ตัวถังรถสีครีมวินเทจ
      ctx.fillStyle = '#fef3c7'
      ctx.strokeStyle = '#1e293b'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.roundRect(0, 10, 200, 95, [14, 18, 6, 6])
      ctx.fill()
      ctx.stroke()

      // แถบคาดคู่ Red & Royal Blue อันเป็นเอกลักษณ์
      ctx.fillStyle = '#dc2626'
      ctx.fillRect(0, 58, 200, 12)
      ctx.fillStyle = '#2563eb'
      ctx.fillRect(0, 72, 200, 8)

      // กระจกหน้าพาโนรามาและเงาสะท้อน
      ctx.fillStyle = '#0284c7'
      ctx.beginPath()
      ctx.roundRect(145, 22, 50, 32, [0, 10, 0, 0])
      ctx.fill()
      ctx.strokeStyle = '#0f172a'
      ctx.lineWidth = 2
      ctx.stroke()

      // แสงสะท้อนกระจก
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)'
      ctx.beginPath()
      ctx.moveTo(150, 50)
      ctx.lineTo(165, 24)
      ctx.lineTo(175, 24)
      ctx.lineTo(158, 50)
      ctx.fill()

      // กระจกข้างและผ้าม่าน
      ctx.fillStyle = '#38bdf8'
      ctx.fillRect(35, 24, 45, 26)
      ctx.fillRect(90, 24, 45, 26)
      ctx.strokeRect(35, 24, 45, 26)
      ctx.strokeRect(90, 24, 45, 26)

      // กระจังหน้าโครเมียม + ไฟหน้าส่องสว่าง
      ctx.fillStyle = '#475569'
      ctx.fillRect(185, 65, 15, 30)
      ctx.fillStyle = '#fef08a'
      ctx.beginPath()
      ctx.arc(195, 78, 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#1e293b'
      ctx.stroke()

      // เครื่องปรับอากาศบนหลังคารถ + เสาอากาศ
      ctx.fillStyle = '#e2e8f0'
      ctx.fillRect(60, -2, 45, 12)
      ctx.strokeRect(60, -2, 45, 12)
      ctx.strokeStyle = '#475569'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(165, 10)
      ctx.lineTo(170, -20)
      ctx.stroke()

      // ไฟกระพริบเสาอากาศ
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.arc(170, -20, 3, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }

    // 2. โมเดล Ben Tennyson สไตล์อนิเมชันละเอียด มีสัดส่วนและเสื้อลายคาดดำ
    const drawBen = (x, y, facing, animTick, grounded) => {
      ctx.save()
      ctx.translate(x + 20, y + 30)
      ctx.scale(facing, 1)

      const legSwing = grounded ? Math.sin(animTick * 0.25) * 8 : 4

      // ขาและกางเกงทหารสีเขียว
      ctx.strokeStyle = '#14532d'
      ctx.fillStyle = '#3f6212'
      ctx.lineWidth = 2
      // ขาซ้าย
      ctx.fillRect(-12, 10, 10, 18 + legSwing)
      ctx.strokeRect(-12, 10, 10, 18 + legSwing)
      // ขวา
      ctx.fillRect(2, 10, 10, 18 - legSwing)
      ctx.strokeRect(2, 10, 10, 18 - legSwing)

      // รองเท้าผ้าใบสีดำ-ขาว
      ctx.fillStyle = '#18181b'
      ctx.fillRect(-15, 26 + legSwing, 14, 6)
      ctx.fillRect(1, 26 - legSwing, 14, 6)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(-15, 30 + legSwing, 14, 2)
      ctx.fillRect(1, 30 - legSwing, 14, 2)

      // ลำตัวและเสื้อยืดสีขาวลายคาดดำ
      ctx.fillStyle = '#ffffff'
      ctx.strokeStyle = '#18181b'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(-14, -12, 28, 24, [4, 4, 2, 2])
      ctx.fill()
      ctx.stroke()

      // แถบดำกลางเสื้อ
      ctx.fillStyle = '#18181b'
      ctx.fillRect(-4, -12, 8, 24)
      ctx.beginPath()
      ctx.arc(0, -12, 6, 0, Math.PI)
      ctx.fill()

      // นาฬิกา Omnitrix ที่ข้อมือ
      ctx.fillStyle = '#475569'
      ctx.fillRect(12, 0, 7, 7)
      ctx.fillStyle = '#22c55e'
      ctx.beginPath()
      ctx.arc(15.5, 3.5, 3, 0, Math.PI * 2)
      ctx.fill()

      // คอและศีรษะ
      ctx.fillStyle = '#fed7aa'
      ctx.fillRect(-4, -16, 8, 6)
      ctx.beginPath()
      ctx.arc(0, -22, 11, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      // ตาโตสไตล์การ์ตูน Ben 10
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.ellipse(3, -22, 4, 5, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#15803d'
      ctx.beginPath()
      ctx.arc(4, -22, 2.5, 0, Math.PI * 2)
      ctx.fill()

      // ทรงผมสีน้ำตาลปัดข้างมีมิติ
      ctx.fillStyle = '#78350f'
      ctx.beginPath()
      ctx.arc(0, -24, 12, Math.PI, Math.PI * 2)
      ctx.lineTo(10, -20)
      ctx.lineTo(8, -16)
      ctx.lineTo(-4, -26)
      ctx.lineTo(-12, -20)
      ctx.fill()

      ctx.restore()
    }

    // 3. โมเดล Heatblast (ไฟลุกโชน แมกมาแตกสีส้มแดง)
    const drawHeatblast = (x, y, facing, animTick) => {
      ctx.save()
      ctx.translate(x + 20, y + 30)
      ctx.scale(facing, 1)

      // ร่างกายหินภูเขาไฟสีดำชาร์โคล
      ctx.fillStyle = '#292524'
      ctx.strokeStyle = '#f97316'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(-15, -12, 30, 26, 8)
      ctx.fill()
      ctx.stroke()

      // ลวดลายแมกมาร้อนระอุบนหน้าอก
      ctx.fillStyle = '#f59e0b'
      ctx.fillRect(-10, -8, 20, 6)
      ctx.fillStyle = '#ef4444'
      ctx.fillRect(-6, 0, 12, 10)

      // ขาหินแมกมา
      ctx.fillStyle = '#292524'
      ctx.fillRect(-13, 14, 10, 18)
      ctx.fillRect(3, 14, 10, 18)
      ctx.fillStyle = '#f97316'
      ctx.fillRect(-11, 20, 6, 8)
      ctx.fillRect(5, 20, 6, 8)

      // แขนและกำปั้นไฟ
      ctx.fillStyle = '#292524'
      ctx.fillRect(-22, -10, 8, 20)
      ctx.fillRect(14, -10, 8, 20)
      ctx.fillStyle = '#f59e0b'
      ctx.beginPath()
      ctx.arc(18, 10, 6, 0, Math.PI * 2)
      ctx.arc(-18, 10, 6, 0, Math.PI * 2)
      ctx.fill()

      // เปลวเพลิงบนศีรษะ (เคลื่อนไหวสะบัดตามเวลา)
      const flameShift = Math.sin(animTick * 0.3) * 3
      ctx.fillStyle = '#ea580c'
      ctx.beginPath()
      ctx.arc(0, -20, 12, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#facc15'
      ctx.beginPath()
      ctx.moveTo(-10, -22)
      ctx.lineTo(flameShift, -38)
      ctx.lineTo(10, -22)
      ctx.fill()

      // ดวงตาสีเหลืองสว่าง
      ctx.fillStyle = '#fef08a'
      ctx.fillRect(2, -22, 5, 3)

      // โลโก้ Omnitrix ที่หน้าอก
      ctx.fillStyle = '#22c55e'
      ctx.beginPath()
      ctx.arc(0, -3, 4, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }

    // 4. โมเดล Cannonbolt (เกราะกลมหนา หรือ ลูกบอลหมุนความเร็วสูง)
    const drawCannonbolt = (x, y, facing, isRolling, animTick) => {
      ctx.save()
      ctx.translate(x + 20, y + 30)

      if (isRolling) {
        // ลูกบอลกลิ้งเกราะสีเหลืองดำหมุนรอบทิศ
        ctx.rotate(animTick * 0.3 * facing)
        ctx.fillStyle = '#eab308'
        ctx.beginPath()
        ctx.arc(0, 0, 24, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#18181b'
        ctx.lineWidth = 3
        ctx.stroke()

        // แถบคาดเกราะสีดำ
        ctx.fillStyle = '#18181b'
        ctx.fillRect(-24, -8, 48, 16)
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(-24, -4, 48, 8)
      } else {
        ctx.scale(facing, 1)

        // ร่างยืนตัวหนาเกราะขาวตัดเหลือง
        ctx.fillStyle = '#f8fafc'
        ctx.strokeStyle = '#18181b'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.ellipse(0, 0, 22, 26, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()

        // แผ่นเกราะหลังสีเหลือง
        ctx.fillStyle = '#eab308'
        ctx.beginPath()
        ctx.arc(0, -8, 16, Math.PI, Math.PI * 2)
        ctx.fill()
        ctx.stroke()

        // แถบดำกลางอก
        ctx.fillStyle = '#18181b'
        ctx.fillRect(-4, -6, 8, 26)

        // ขาอ้วนหนา
        ctx.fillStyle = '#f8fafc'
        ctx.fillRect(-16, 18, 12, 14)
        ctx.fillRect(4, 18, 12, 14)
        ctx.strokeRect(-16, 18, 12, 14)
        ctx.strokeRect(4, 18, 12, 14)

        // สัญลักษณ์ Omnitrix บนหน้าผาก
        ctx.fillStyle = '#22c55e'
        ctx.beginPath()
        ctx.arc(0, -18, 4, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
    }

    // 5. โมเดล Wildvine (พืชเถาวัลย์ หนาม แส้ยาว และปลอกคอกาบหอยแครง)
    const drawWildvine = (x, y, facing, animTick) => {
      ctx.save()
      ctx.translate(x + 20, y + 30)
      ctx.scale(facing, 1)

      // ร่างกายเถาวัลย์บิดเกลียวสีเขียว
      ctx.fillStyle = '#15803d'
      ctx.strokeStyle = '#14532d'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(-12, -10, 24, 26, 8)
      ctx.fill()
      ctx.stroke()

      // ปลอกคอกาบหอยแครง (Flytrap Petals) สีม่วงแดงอมชมพู
      ctx.fillStyle = '#701a75'
      ctx.beginPath()
      ctx.ellipse(0, -18, 16, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // หัวตาเดียวสีเหลืองเรืองแสง
      ctx.fillStyle = '#16a34a'
      ctx.beginPath()
      ctx.arc(0, -22, 9, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#facc15'
      ctx.beginPath()
      ctx.arc(3, -22, 3.5, 0, Math.PI * 2)
      ctx.fill()

      // ขาเถาวัลย์ 4 แฉก
      const vineWiggle = Math.sin(animTick * 0.2) * 4
      ctx.strokeStyle = '#16a34a'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(-8, 16)
      ctx.lineTo(-12 + vineWiggle, 32)
      ctx.moveTo(8, 16)
      ctx.lineTo(12 - vineWiggle, 32)
      ctx.stroke()

      // สัญลักษณ์ Omnitrix
      ctx.fillStyle = '#22c55e'
      ctx.beginPath()
      ctx.arc(0, -4, 4, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }

    // 6. โมเดล Wildmutt (อสูรส้ม 4 ขา ปากเขี้ยว ก้นกระดก)
    const drawWildmutt = (x, y, facing, animTick) => {
      ctx.save()
      ctx.translate(x + 20, y + 32)
      ctx.scale(facing, 1)

      // ลำตัวกล้ามเนื้อสีส้มทอง
      ctx.fillStyle = '#ea580c'
      ctx.strokeStyle = '#9a3412'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.ellipse(0, 0, 24, 16, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      // สันขนแหลมบนหลัง
      ctx.fillStyle = '#c2410c'
      for (let s = -16; s <= 12; s += 8) {
        ctx.beginPath()
        ctx.moveTo(s, -14)
        ctx.lineTo(s + 4, -20)
        ctx.lineTo(s + 8, -14)
        ctx.fill()
      }

      // หัวไร้ตา จมูกและขากรรไกรเขี้ยวขาว
      ctx.fillStyle = '#ea580c'
      ctx.beginPath()
      ctx.ellipse(18, -4, 12, 10, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      // เขี้ยวคมสีขาว
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.moveTo(18, 2)
      ctx.lineTo(22, 8)
      ctx.lineTo(26, 2)
      ctx.fill()

      // ขาหน้าและขาหลัง
      const pawSwing = Math.sin(animTick * 0.25) * 6
      ctx.fillStyle = '#ea580c'
      ctx.fillRect(-18, 10, 8, 16 + pawSwing)
      ctx.fillRect(10, 10, 8, 16 - pawSwing)

      // ปลอกคอ Omnitrix
      ctx.fillStyle = '#475569'
      ctx.fillRect(4, -10, 6, 6)
      ctx.fillStyle = '#22c55e'
      ctx.beginPath()
      ctx.arc(7, -7, 2.5, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }

    // 7. โมเดลบอสยักษ์ (Giant Bio-Titan) มี 2 เฟส พร้อมเอฟเฟกต์สั่นสะเทือน
    const drawBoss = (bs, cam) => {
      const bx = bs.x - cam
      const by = bs.y

      ctx.save()

      // แฟลชสีขาวเมื่อโดนโจมตี
      if (bs.hitFlash > 0) {
        ctx.fillStyle = '#ffffff'
      } else if (bs.phase === 2) {
        // เฟสคลั่ง: โกเลมแดงอมม่วง
        ctx.fillStyle = '#450a0a'
      } else {
        // เฟสปกติ: เปลือกไม้โบราณเขียวเข้ม
        ctx.fillStyle = '#14532d'
      }

      ctx.strokeStyle = bs.phase === 2 ? '#ef4444' : '#22c55e'
      ctx.lineWidth = 3

      // ลำตัวยักษ์
      ctx.beginPath()
      ctx.roundRect(bx, by + 20, bs.w, bs.h - 20, 20)
      ctx.fill()
      ctx.stroke()

      // เขาไม้โบราณบนหัว
      ctx.fillStyle = '#3f6212'
      ctx.beginPath()
      ctx.moveTo(bx + 15, by + 20)
      ctx.lineTo(bx - 10, by - 15)
      ctx.lineTo(bx + 35, by + 15)
      ctx.moveTo(bx + bs.w - 15, by + 20)
      ctx.lineTo(bx + bs.w + 10, by - 15)
      ctx.lineTo(bx + bs.w - 35, by + 15)
      ctx.fill()
      ctx.stroke()

      // ดวงตาสีส้มแดงหรือเพลิงเพลิงคลั่ง
      ctx.fillStyle = bs.phase === 2 ? '#dc2626' : '#ea580c'
      ctx.beginPath()
      ctx.arc(bx + 32, by + 45, 9, 0, Math.PI * 2)
      ctx.arc(bx + bs.w - 32, by + 45, 9, 0, Math.PI * 2)
      ctx.fill()

      // คอร์พลังงานตรงกลางหน้าอก
      ctx.fillStyle = bs.phase === 2 ? '#f43f5e' : '#84cc16'
      ctx.beginPath()
      ctx.arc(bx + bs.w / 2, by + 80, 16, 0, Math.PI * 2)
      ctx.fill()

      // หลอดเลือดบอสขนาดใหญ่ พร้อมชื่อหัวหน้า
      const hpWidth = (bs.w + 40) * Math.max(0, bs.hp / bs.maxHp)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)'
      ctx.fillRect(bx - 20, by - 36, bs.w + 40, 22)
      ctx.fillStyle = bs.phase === 2 ? '#ef4444' : '#eab308'
      ctx.fillRect(bx - 18, by - 34, hpWidth, 18)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 11px sans-serif'
      ctx.fillText(
        `BOSS: BIO-TITAN (${Math.round(bs.hp)}/${bs.maxHp})`,
        bx - 14,
        by - 21
      )

      ctx.restore()
    }

    // ==========================================
    // 🎨 ฟังก์ชัน Render ภาพรวม
    // ==========================================
    const renderScene = () => {
      const eng = engineRef.current
      const cam = eng.cameraX

      ctx.save()

      // Screen Shake เมื่อโดนดาเมจหรือบอสทุบพื้น
      if (eng.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * eng.screenShake
        const shakeY = (Math.random() - 0.5) * eng.screenShake
        ctx.translate(shakeX, shakeY)
      }

      ctx.clearRect(0, 0, 960, 540)

      // ท้องฟ้า Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 540)
      skyGrad.addColorStop(0, '#7dd3fc')
      skyGrad.addColorStop(0.5, '#bae6fd')
      skyGrad.addColorStop(1, '#dcfce7')
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, 960, 540)

      // ภูเขาหิน Parallax ชั้นไกล
      ctx.fillStyle = '#94a3b8'
      ctx.beginPath()
      ctx.moveTo(0, 360)
      for (let x = 0; x <= 960; x += 120) {
        const h = Math.sin((x + cam * 0.12) * 0.012) * 65 + 270
        ctx.lineTo(x, h)
      }
      ctx.lineTo(960, 540)
      ctx.lineTo(0, 540)
      ctx.fill()

      // หน้าผาหินชั้นกลาง
      ctx.fillStyle = '#64748b'
      ctx.beginPath()
      ctx.moveTo(0, 390)
      for (let x = 0; x <= 960; x += 90) {
        const h = Math.sin((x + cam * 0.28) * 0.018) * 45 + 310
        ctx.lineTo(x, h)
      }
      ctx.lineTo(960, 540)
      ctx.lineTo(0, 540)
      ctx.fill()

      // รถบ้าน The Rust Bucket ละเอียดสวยงาม
      const rustX = 40 - cam
      if (rustX > -260 && rustX < 960) {
        drawRustBucket(rustX, 295)
      }

      // แพลตฟอร์มพื้นดินและหิน
      for (const plat of eng.platforms) {
        const px = plat.x - cam
        if (px + plat.w < 0 || px > 960) continue

        if (plat.type === 'ground') {
          // ดินหินลึก
          ctx.fillStyle = '#78350f'
          ctx.fillRect(px, plat.y, plat.w, plat.h)
          // ชั้นหญ้าเขียวชอุ่มด้านบน
          ctx.fillStyle = '#16a34a'
          ctx.fillRect(px, plat.y, plat.w, 16)
          ctx.fillStyle = '#15803d'
          for (let i = 0; i < plat.w; i += 24) {
            ctx.fillRect(px + i, plat.y + 14, 12, 6)
          }
        } else if (plat.type === 'rock') {
          ctx.fillStyle = '#475569'
          ctx.fillRect(px, plat.y, plat.w, plat.h)
          ctx.fillStyle = '#64748b'
          ctx.fillRect(px, plat.y, plat.w, 6)
        } else if (plat.type === 'wood') {
          ctx.fillStyle = '#b45309'
          ctx.fillRect(px, plat.y, plat.w, plat.h)
        }
      }

      // บ่อกรด / กับดัก
      for (const hz of eng.hazards) {
        const hx = hz.x - cam
        if (hx + hz.w < 0 || hx > 960) continue
        if (hz.type === 'acid') {
          ctx.fillStyle = '#84cc16'
          ctx.fillRect(hx, hz.y, hz.w, hz.h)
          ctx.fillStyle = '#bef264'
          const bubbleY = hz.y + 10 + Math.sin(eng.player.animTick * 0.1) * 6
          ctx.beginPath()
          ctx.arc(hx + hz.w * 0.3, bubbleY, 6, 0, Math.PI * 2)
          ctx.arc(hx + hz.w * 0.7, bubbleY - 2, 8, 0, Math.PI * 2)
          ctx.fill()
        } else if (hz.type === 'spikes') {
          ctx.fillStyle = '#991b1b'
          for (let s = 0; s < hz.w; s += 15) {
            ctx.beginPath()
            ctx.moveTo(hx + s, hz.y + hz.h)
            ctx.lineTo(hx + s + 7, hz.y)
            ctx.lineTo(hx + s + 15, hz.y + hz.h)
            ctx.fill()
          }
        }
      }

      // หินก้อนใหญ่ (Boulders)
      for (const b of eng.boulders) {
        if (b.broken) continue
        const bx = b.x - cam
        if (bx + b.w < 0 || bx > 960) continue
        ctx.fillStyle = '#52525b'
        ctx.beginPath()
        ctx.roundRect(bx, b.y, b.w, b.h, 12)
        ctx.fill()
        ctx.strokeStyle = '#27272a'
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // ไอเทมเก็บสะสม
      for (const col of eng.collectibles) {
        if (col.taken) continue
        const cx = col.x - cam
        if (cx < -20 || cx > 980) continue
        const bob = Math.sin(eng.player.animTick * 0.1 + col.x) * 5

        if (col.type === 'dna') {
          // ลูกแก้ว DNA เรืองแสง
          ctx.shadowColor = '#22c55e'
          ctx.shadowBlur = 14
          ctx.fillStyle = '#22c55e'
          ctx.beginPath()
          ctx.arc(cx, col.y + bob, 14, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#ffffff'
          ctx.beginPath()
          ctx.arc(cx, col.y + bob, 6, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
        } else if (col.type === 'card') {
          ctx.fillStyle = '#f59e0b'
          ctx.fillRect(cx - 10, col.y + bob - 14, 20, 28)
          ctx.fillStyle = '#78350f'
          ctx.fillRect(cx - 7, col.y + bob - 10, 14, 18)
        } else if (col.type === 'smoothie') {
          ctx.fillStyle = '#10b981'
          ctx.fillRect(cx - 8, col.y + bob - 10, 16, 20)
          ctx.fillStyle = '#f43f5e'
          ctx.fillRect(cx - 2, col.y + bob - 16, 4, 8)
        }
      }

      // ศัตรู
      for (const en of eng.enemies) {
        if (!en.alive) continue
        const ex = en.x - cam
        if (ex < -60 || ex > 1020) continue

        if (en.type === 'crawler') {
          ctx.fillStyle = '#15803d'
          ctx.beginPath()
          ctx.roundRect(ex, en.y, en.w, en.h, 10)
          ctx.fill()
          ctx.fillStyle = '#dc2626'
          ctx.fillRect(ex + 6, en.y + 12, en.w - 12, 10)
          ctx.fillStyle = '#facc15'
          ctx.beginPath()
          ctx.arc(ex + (en.vx > 0 ? en.w - 10 : 10), en.y + 8, 4, 0, Math.PI * 2)
          ctx.fill()
        } else if (en.type === 'flyer') {
          ctx.fillStyle = '#854d0e'
          ctx.beginPath()
          ctx.ellipse(ex + 18, en.y + 15, 18, 14, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
          const wingSpread = Math.sin(eng.player.animTick * 0.3) * 12
          ctx.beginPath()
          ctx.ellipse(ex + 18, en.y + 4, 20, 6 + Math.abs(wingSpread), 0, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // บอสยักษ์
      if (eng.boss && eng.boss.alive) {
        drawBoss(eng.boss, cam)
      }

      // กระสุน
      for (const pr of eng.projectiles) {
        const prx = pr.x - cam
        if (pr.type === 'fireball') {
          ctx.shadowColor = '#f97316'
          ctx.shadowBlur = 18
          ctx.fillStyle = '#f97316'
          ctx.beginPath()
          ctx.arc(prx, pr.y, pr.r, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#fef08a'
          ctx.beginPath()
          ctx.arc(prx, pr.y, pr.r * 0.5, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
        } else if (pr.type === 'whip') {
          ctx.fillStyle = '#22c55e'
          ctx.fillRect(prx, pr.y, pr.w, pr.h)
        } else if (pr.type === 'claw') {
          ctx.fillStyle = '#ea580c'
          ctx.fillRect(prx, pr.y, pr.w, pr.h)
        } else if (pr.type === 'thorn' || pr.type === 'shockwave') {
          ctx.fillStyle = pr.color
          ctx.beginPath()
          ctx.arc(prx, pr.y, pr.r, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // ละอองอนุภาค
      for (const pt of eng.particles) {
        ctx.fillStyle = pt.color
        ctx.globalAlpha = pt.life / pt.maxLife
        ctx.beginPath()
        ctx.arc(pt.x - cam, pt.y, pt.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1.0

      // วาดตัวผู้เล่นด้วย Drawer สวยงามตามฟอร์มปัจจุบัน
      const p = eng.player
      const px = p.x - cam

      if (p.invulnerable % 6 < 3) {
        if (p.form === 'ben') {
          drawBen(px, p.y, p.facing, p.animTick, p.grounded)
        } else if (p.form === 'heatblast') {
          drawHeatblast(px, p.y, p.facing, p.animTick)
        } else if (p.form === 'cannonbolt') {
          drawCannonbolt(px, p.y, p.facing, p.isRolling, p.animTick)
        } else if (p.form === 'wildvine') {
          drawWildvine(px, p.y, p.facing, p.animTick)
        } else if (p.form === 'wildmutt') {
          drawWildmutt(px, p.y, p.facing, p.animTick)
        }
      }

      // ป้าย "GO!"
      if (eng.goBannerTick > 0) {
        ctx.save()
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
        ctx.fillRect(400, 180, 260, 60)
        ctx.fillStyle = '#84cc16'
        ctx.fillRect(480, 185, 170, 50)
        ctx.font = '900 48px sans-serif'
        ctx.fillStyle = '#ffffff'
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 6
        ctx.strokeText('GO!', 410, 226)
        ctx.fillText('GO!', 410, 226)
        ctx.restore()
      }

      ctx.restore()
    }

    const loop = () => {
      updatePhysics()
      renderScene()
      animFrameId.current = requestAnimationFrame(loop)
    }

    animFrameId.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animFrameId.current)
  }, [screen])

  return (
    <div className="w-full flex flex-col items-center">
      {/* 🏁 หน้าจอที่ 1: เมนูหลัก */}
      {screen === 'menu' && (
        <div className="w-full max-w-4xl bg-gradient-to-b from-gray-900 via-emerald-950 to-black rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-green-500/50 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-green-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative mb-6 group cursor-pointer">
            <img
              src="/ben10/title.png"
              alt="Ben 10 Savage Pursuit"
              className="max-h-72 object-contain rounded-2xl shadow-2xl border border-green-400/40 hover:scale-[1.02] transition duration-300"
            />
            <div className="absolute inset-0 bg-green-500/10 rounded-2xl pointer-events-none" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-900/60 border border-green-400/60 text-green-300 text-xs sm:text-sm font-semibold mb-4 tracking-wide">
            <Sparkles className="w-4 h-4 text-green-400" />
            OMNITRIX CLASSIC FLASH GAME RETRO REMAKE
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-lime-300 to-emerald-400 tracking-wider mb-3 drop-shadow-md">
            BEN 10: SAVAGE PURSUIT
          </h1>
          <p className="text-gray-300 max-w-xl text-sm sm:text-base leading-relaxed mb-8">
            สวมบทบาทเป็น <strong>Ben Tennyson</strong> พร้อมปลดปล่อยพลังนาฬิกา
            Omnitrix แปลงร่างเป็น 4 เอเลี่ยนระดับตำนาน:{' '}
            <span className="text-orange-400 font-bold">Heatblast</span>,{' '}
            <span className="text-yellow-400 font-bold">Cannonbolt</span>,{' '}
            <span className="text-emerald-400 font-bold">Wildvine</span> และ{' '}
            <span className="text-amber-500 font-bold">Wildmutt</span>{' '}
            เพื่อหยุดยั้งแผนการร้ายของเหล่าอสูรในป่าดึกดำบรรพ์!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-md mb-8">
            <button
              onClick={startGame}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-lime-500 via-green-500 to-emerald-600 hover:from-lime-400 hover:to-emerald-500 text-black font-black text-lg sm:text-xl tracking-wider shadow-[0_0_30px_rgba(34,197,94,0.6)] hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              <Play className="w-6 h-6 fill-current" />
              เริ่มการผจญภัย (PLAY)
            </button>

            <button
              onClick={() => setScreen('instructions')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gray-800 hover:bg-gray-700 text-green-400 border border-green-500/40 font-bold text-base transition cursor-pointer"
            >
              <HelpCircle className="w-5 h-5" />
              วิธีเล่น & แปลงร่าง
            </button>
          </div>

          {leaderboard.length > 0 && (
            <div className="w-full max-w-lg bg-black/60 border border-green-500/30 rounded-2xl p-4 text-left">
              <div className="flex items-center justify-between mb-2 text-green-400 text-xs font-bold tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  ฮีโร่คะแนนสูงสุด (TOP HEROES)
                </span>
                <span>SCORES</span>
              </div>
              <div className="space-y-1.5">
                {leaderboard.slice(0, 3).map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-gray-900/80 text-sm"
                  >
                    <div className="flex items-center gap-2 text-gray-200">
                      <span className="w-5 text-yellow-400 font-bold">
                        #{idx + 1}
                      </span>
                      <span>{item.username}</span>
                    </div>
                    <span className="font-mono text-green-400 font-bold">
                      {Number(item.score).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 📖 หน้าจอที่ 2: วิธีเล่น */}
      {screen === 'instructions' && (
        <div className="w-full max-w-4xl bg-gray-900 rounded-3xl p-6 sm:p-8 border-4 border-green-500/60 shadow-2xl flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-4 mb-4 border-b border-gray-800">
            <h2 className="text-2xl sm:text-3xl font-black text-green-400 flex items-center gap-3">
              <HelpCircle className="w-8 h-8" />
              คู่มือการเล่น (INSTRUCTIONS)
            </h2>
            <button
              onClick={() => setScreen('menu')}
              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-sm transition cursor-pointer"
            >
              กลับหน้าแรก
            </button>
          </div>

          <div className="w-full mb-6 flex justify-center">
            <img
              src="/ben10/instructions.png"
              alt="Instructions Panel"
              className="max-h-72 object-contain rounded-xl border border-green-500/40 shadow-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-left mb-6">
            <div className="bg-gray-800/80 p-4 rounded-2xl border border-gray-700">
              <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                <CircleDot className="w-5 h-5" />
                ปุ่มควบคุมบนคีย์บอร์ด
              </h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>
                  <kbd className="px-2 py-1 bg-gray-700 rounded text-green-300 font-mono">
                    ◀ ▶
                  </kbd>{' '}
                  หรือ{' '}
                  <kbd className="px-2 py-1 bg-gray-700 rounded text-green-300 font-mono">
                    A D
                  </kbd>{' '}
                  : เดินซ้าย / เดินขวา
                </li>
                <li>
                  <kbd className="px-2 py-1 bg-gray-700 rounded text-green-300 font-mono">
                    ▲
                  </kbd>{' '}
                  หรือ{' '}
                  <kbd className="px-2 py-1 bg-gray-700 rounded text-green-300 font-mono">
                    W
                  </kbd>{' '}
                  : กระโดดขึ้น (ปรับให้นุ่มนวล ควบคุมง่าย)
                </li>
                <li>
                  <kbd className="px-2 py-1 bg-gray-700 rounded text-green-300 font-mono">
                    Spacebar
                  </kbd>{' '}
                  หรือ{' '}
                  <kbd className="px-2 py-1 bg-gray-700 rounded text-green-300 font-mono">
                    X
                  </kbd>{' '}
                  : ใช้ท่าโจมตี / สกิลเอเลี่ยน
                </li>
                <li>
                  <kbd className="px-2.5 py-1 bg-green-900 border border-green-400 text-green-300 rounded font-mono font-bold">
                    Z
                  </kbd>{' '}
                  : เปิดหน้าปัด Omnitrix Dial เพื่อแปลงร่าง
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/80 p-4 rounded-2xl border border-gray-700">
              <h3 className="text-green-400 font-bold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                เคล็ดลับนาฬิกา OMNITRIX
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-3">
                แปลงร่างได้นานเกือบ 50 วินาทีต่อครั้ง!
                หากต้องการชาร์จพลังงานคืนเร็วๆ ให้กด [Z] สลับกลับเป็นร่างเด็ก Ben
                และเก็บลูกแก้ว DNA สีเขียวเพื่อเพิ่มพลังงาน
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-orange-950/60 border border-orange-500/40 text-orange-200">
                  <strong>⬆️ Heatblast:</strong> ยิงไฟทำลายสิ่งกีดขวาง
                </div>
                <div className="p-2 rounded bg-yellow-950/60 border border-yellow-500/40 text-yellow-200">
                  <strong>➡️ Cannonbolt:</strong> กลิ้งชนหินแตกทะลุทะลวง
                </div>
                <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-200">
                  <strong>⬅️ Wildvine:</strong> แส้เถาวัลย์กวาดระยะไกล
                </div>
                <div className="p-2 rounded bg-amber-950/60 border border-amber-500/40 text-amber-200">
                  <strong>⬇️ Wildmutt:</strong> กระโดดสูงพิเศษเก็บของลับ
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-400 hover:to-green-500 text-black font-black text-lg shadow-lg hover:scale-105 transition cursor-pointer"
          >
            พร้อมแล้ว! เริ่มเกมเลย (PLAY NOW)
          </button>
        </div>
      )}

      {/* 🎮 หน้าจอที่ 3: Canvas Gameplay & Authentic HUD */}
      {screen === 'playing' && (
        <div className="w-full max-w-5xl flex flex-col items-center select-none">
          {/* HUD ด้านบน */}
          <div className="w-full bg-gradient-to-r from-gray-900 via-black to-gray-900 border-2 border-green-500/80 rounded-t-2xl px-4 py-2.5 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  sfx.beep(520, 'sine', 0.08)
                  setIsDialOpen(!isDialOpen)
                  engineRef.current.dialModalOpen = !isDialOpen
                }}
                title="คลิกเพื่อเปิดหน้าปัด Omnitrix แปลงร่าง (กด Z)"
                className="relative group p-1.5 rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 hover:scale-110 active:scale-95 transition shadow-[0_0_15px_rgba(34,197,94,0.6)] cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-black border-2 border-green-400 flex items-center justify-center">
                  <span className="text-green-400 font-black text-lg tracking-tighter">
                    {hudLives}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 px-1 rounded bg-black text-[9px] text-green-300 font-bold border border-green-500">
                  x{hudLives}
                </div>
              </button>

              <div className="flex flex-col gap-1 w-36 sm:w-48">
                <div className="w-full h-4 bg-gray-950 rounded-sm border border-gray-700 overflow-hidden relative shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-lime-400 to-green-500 transition-all duration-200"
                    style={{ width: `${hudHp}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-black tracking-widest drop-shadow-xs">
                    HP {hudHp}%
                  </span>
                </div>

                <div className="w-full h-3.5 bg-gray-950 rounded-sm border border-gray-700 overflow-hidden relative shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-300 to-amber-500 transition-all duration-200"
                    style={{ width: `${hudEnergy}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-black tracking-widest drop-shadow-xs">
                    OMNITRIX {hudEnergy}%
                  </span>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-800/80 border border-green-500/40 text-xs">
                <span className="text-gray-400">ร่าง:</span>
                <span className="font-bold text-green-400 uppercase">
                  {ALIEN_FORMS[hudCurrentForm]?.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-400 font-semibold tracking-wider">
                  SCORE
                </span>
                <span className="text-xl sm:text-2xl font-mono font-black text-green-400 tracking-wider">
                  {String(hudScore).padStart(7, '0')}
                </span>
              </div>

              <button
                onClick={toggleMute}
                title={muted ? 'เปิดเสียง' : 'ปิดเสียง'}
                className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition cursor-pointer"
              >
                {muted ? (
                  <VolumeX className="w-5 h-5 text-red-400" />
                ) : (
                  <Volume2 className="w-5 h-5 text-green-400" />
                )}
              </button>
            </div>
          </div>

          {/* ผืนผ้าใบ Canvas */}
          <div className="w-full relative bg-black aspect-[16/9] border-x-2 border-green-500/80 overflow-hidden">
            <canvas
              ref={canvasRef}
              width={960}
              height={540}
              className="w-full h-full object-contain block"
            />

            {/* หน้าปัด Omnitrix Dial เมื่อกด Z */}
            {isDialOpen && (
              <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-30 animate-in fade-in duration-200">
                <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full border-4 border-green-400/80 bg-gradient-to-b from-gray-950 via-emerald-950 to-black flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.7)] p-6">
                  <div className="absolute inset-4 rounded-full border border-green-500/30 border-dashed pointer-events-none" />

                  {/* ⬆️ Heatblast */}
                  <button
                    onClick={() => triggerTransform('heatblast')}
                    className={`absolute top-4 flex flex-col items-center gap-1 p-2 rounded-2xl transition cursor-pointer hover:scale-110 ${
                      dialSelection === 'heatblast'
                        ? 'bg-orange-600/50 border-2 border-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.8)]'
                        : 'bg-gray-900/80 border border-gray-700'
                    }`}
                  >
                    <Flame className="w-7 h-7 text-orange-400" />
                    <span className="text-[11px] font-bold text-orange-300">
                      Heatblast (▲)
                    </span>
                  </button>

                  {/* ⬅️ Wildvine */}
                  <button
                    onClick={() => triggerTransform('wildvine')}
                    className={`absolute left-3 flex flex-col items-center gap-1 p-2 rounded-2xl transition cursor-pointer hover:scale-110 ${
                      dialSelection === 'wildvine'
                        ? 'bg-emerald-600/50 border-2 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.8)]'
                        : 'bg-gray-900/80 border border-gray-700'
                    }`}
                  >
                    <Sprout className="w-7 h-7 text-green-400" />
                    <span className="text-[11px] font-bold text-green-300">
                      Wildvine (◀)
                    </span>
                  </button>

                  {/* ➡️ Cannonbolt */}
                  <button
                    onClick={() => triggerTransform('cannonbolt')}
                    className={`absolute right-3 flex flex-col items-center gap-1 p-2 rounded-2xl transition cursor-pointer hover:scale-110 ${
                      dialSelection === 'cannonbolt'
                        ? 'bg-yellow-600/50 border-2 border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.8)]'
                        : 'bg-gray-900/80 border border-gray-700'
                    }`}
                  >
                    <Shield className="w-7 h-7 text-yellow-400" />
                    <span className="text-[11px] font-bold text-yellow-300">
                      Cannonbolt (▶)
                    </span>
                  </button>

                  {/* ⬇️ Wildmutt */}
                  <button
                    onClick={() => triggerTransform('wildmutt')}
                    className={`absolute bottom-4 flex flex-col items-center gap-1 p-2 rounded-2xl transition cursor-pointer hover:scale-110 ${
                      dialSelection === 'wildmutt'
                        ? 'bg-amber-600/50 border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.8)]'
                        : 'bg-gray-900/80 border border-gray-700'
                    }`}
                  >
                    <Footprints className="w-7 h-7 text-amber-500" />
                    <span className="text-[11px] font-bold text-amber-300">
                      Wildmutt (▼)
                    </span>
                  </button>

                  {/* 🔘 ตรงกลาง: คืนร่างเบ็น */}
                  <button
                    onClick={() => triggerTransform('ben')}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 border-4 border-black flex flex-col items-center justify-center shadow-lg hover:scale-110 transition cursor-pointer active:scale-95"
                  >
                    <User className="w-7 h-7 text-black" />
                    <span className="text-[9px] font-black text-black">
                      BEN (คืนร่าง)
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* แถบ Stage Progress Bar ด้านล่าง */}
          <div className="w-full bg-gray-950 border-2 border-t-0 border-green-500/80 rounded-b-2xl p-2.5 flex items-center gap-3">
            <span className="text-[11px] font-bold text-green-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 animate-pulse text-green-400" />
              STAGE PROGRESS
            </span>

            <div className="flex-1 h-3.5 bg-black rounded-full border border-green-500/60 relative overflow-visible">
              <div
                className="h-full bg-gradient-to-r from-lime-500 to-green-400 rounded-full"
                style={{ width: `${hudProgress}%` }}
              />

              <div
                className="absolute -top-2 w-7 h-7 -ml-3.5 rounded-full bg-green-500 border-2 border-white shadow-[0_0_10px_rgba(34,197,94,0.8)] flex items-center justify-center transition-all duration-150"
                style={{ left: `${hudProgress}%` }}
              >
                <User className="w-4 h-4 text-black" />
              </div>

              <div className="absolute -top-1.5 right-0 w-6 h-6 rounded-full bg-red-600 border border-white flex items-center justify-center">
                <Swords className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            <span className="text-xs font-mono text-green-400 font-bold w-12 text-right shrink-0">
              {hudProgress}%
            </span>
          </div>

          {/* ปุ่ม Touch สำหรับมือถือ */}
          <div className="w-full mt-3 p-3 bg-gray-900/90 border border-green-500/40 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2">
              <button
                onMouseDown={() => (engineRef.current.keys.left = true)}
                onMouseUp={() => (engineRef.current.keys.left = false)}
                onTouchStart={() => (engineRef.current.keys.left = true)}
                onTouchEnd={() => (engineRef.current.keys.left = false)}
                className="w-14 h-12 rounded-xl bg-gray-800 active:bg-green-600 border border-gray-700 flex items-center justify-center font-bold text-lg select-none"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <button
                onMouseDown={() => (engineRef.current.keys.right = true)}
                onMouseUp={() => (engineRef.current.keys.right = false)}
                onTouchStart={() => (engineRef.current.keys.right = true)}
                onTouchEnd={() => (engineRef.current.keys.right = false)}
                className="w-14 h-12 rounded-xl bg-gray-800 active:bg-green-600 border border-gray-700 flex items-center justify-center font-bold text-lg select-none"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>

            <button
              onClick={() => {
                sfx.beep(520, 'sine', 0.08)
                setIsDialOpen(!isDialOpen)
                engineRef.current.dialModalOpen = !isDialOpen
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-lime-500 to-emerald-600 active:scale-95 text-black font-black text-sm tracking-wide shadow-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              OMNITRIX DIAL (Z)
            </button>

            <div className="flex items-center gap-2">
              <button
                onMouseDown={() => {
                  engineRef.current.keys.attack = true
                  handleAttackAction()
                }}
                onMouseUp={() => (engineRef.current.keys.attack = false)}
                onTouchStart={() => {
                  engineRef.current.keys.attack = true
                  handleAttackAction()
                }}
                onTouchEnd={() => (engineRef.current.keys.attack = false)}
                className="w-14 h-12 rounded-xl bg-orange-600 active:bg-orange-500 border border-orange-400 flex items-center justify-center font-black text-xs select-none shadow-md"
              >
                ATTACK
              </button>
              <button
                onMouseDown={() => (engineRef.current.keys.up = true)}
                onMouseUp={() => (engineRef.current.keys.up = false)}
                onTouchStart={() => (engineRef.current.keys.up = true)}
                onTouchEnd={() => (engineRef.current.keys.up = false)}
                className="w-14 h-12 rounded-xl bg-blue-600 active:bg-blue-500 border border-blue-400 flex items-center justify-center font-bold text-lg select-none shadow-md"
              >
                <ArrowUp className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🏆 หน้าจอ Game Over / Victory */}
      {(screen === 'gameover' || screen === 'victory') && (
        <div className="w-full max-w-lg bg-gray-900 border-4 border-green-500 rounded-3xl p-6 sm:p-8 text-center shadow-2xl animate-in zoom-in-95 duration-200">
          <div
            className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 ${
              screen === 'victory'
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}
          >
            {screen === 'victory' ? (
              <Trophy className="w-10 h-10" />
            ) : (
              <RotateCcw className="w-10 h-10" />
            )}
          </div>

          <h2
            className={`text-3xl font-black mb-2 ${
              screen === 'victory' ? 'text-yellow-400' : 'text-red-400'
            }`}
          >
            {screen === 'victory' ? 'ภารกิจสำเร็จ! VICTORY!' : 'ภารกิจล้มเหลว! GAME OVER'}
          </h2>

          <p className="text-gray-300 text-sm mb-6">
            {screen === 'victory'
              ? 'คุณสามารถปราบ Bio-Titan ที่กำลังคลั่งลงได้ และปกป้องป่าดึกดำบรรพ์ได้สำเร็จ!'
              : 'พลังงาน Omnitrix หมดลง หรือชีวิตของคุณหมดแล้ว ลองใหม่อีกครั้ง!'}
          </p>

          <div className="bg-black/60 rounded-2xl p-4 border border-green-500/30 mb-6">
            <span className="text-xs text-gray-400 font-semibold">
              คะแนนสุดท้ายของคุณ (FINAL SCORE)
            </span>
            <div className="text-4xl font-mono font-black text-green-400 mt-1">
              {finalScore.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={startGame}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-400 hover:to-green-500 text-black font-black text-base shadow-lg transition cursor-pointer"
            >
              เล่นใหม่อีกครั้ง
            </button>
            <button
              onClick={() => setScreen('menu')}
              className="px-6 py-3.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-sm transition cursor-pointer"
            >
              กลับเมนู
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
