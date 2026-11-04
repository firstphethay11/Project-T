import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Flame,
  Shield,
  Sprout,
  Footprints,
  User,
  RotateCcw,
  Trophy,
  HelpCircle,
  Volume2,
  VolumeX,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Sparkles,
  Swords,
  CircleDot,
  Radio,
  AlertTriangle,
  Mountain,
} from 'lucide-react'

// ==========================================
// 🔊 ระบบเสียงสังเคราะห์ Arcade Web Audio API (พร้อมเสียงเตือนหมดเวลาสีแดง & เสียงบอสคำราม)
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
      osc.frequency.setValueAtTime(220, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(480, this.ctx.currentTime + 0.22)
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + 0.22)
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
      osc1.frequency.exponentialRampToValueAtTime(840, t + 0.32)
      osc2.frequency.setValueAtTime(320, t)
      osc2.frequency.exponentialRampToValueAtTime(1100, t + 0.32)
      gain.gain.setValueAtTime(0.25, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.36)
      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(this.ctx.destination)
      osc1.start(t)
      osc2.start(t)
      osc1.stop(t + 0.36)
      osc2.stop(t + 0.36)
    } catch {}
  }

  bossRoar() {
    if (this.muted) return
    this.init()
    if (!this.ctx) return
    try {
      const t = this.ctx.currentTime
      const osc1 = this.ctx.createOscillator()
      const osc2 = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc1.type = 'sawtooth'
      osc2.type = 'square'
      osc1.frequency.setValueAtTime(140, t)
      osc1.frequency.exponentialRampToValueAtTime(42, t + 0.65)
      osc2.frequency.setValueAtTime(95, t)
      osc2.frequency.exponentialRampToValueAtTime(32, t + 0.65)
      gain.gain.setValueAtTime(0.38, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.68)
      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(this.ctx.destination)
      osc1.start(t)
      osc2.start(t)
      osc1.stop(t + 0.68)
      osc2.stop(t + 0.68)
    } catch {}
  }

  timeoutWarning() {
    this.beep(880, 'sine', 0.06, 0.18)
    setTimeout(() => this.beep(880, 'sine', 0.06, 0.18), 90)
  }

  redTimeout() {
    if (this.muted) return
    this.init()
    if (!this.ctx) return
    try {
      const t = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(450, t)
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.42)
      gain.gain.setValueAtTime(0.32, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.42)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(t)
      osc.stop(t + 0.42)
    } catch {}
  }

  recharged() {
    const notes = [330, 440, 660, 880]
    notes.forEach((freq, idx) => {
      setTimeout(() => this.beep(freq, 'triangle', 0.1, 0.2), idx * 85)
    })
  }

  lockedBuzz() {
    this.beep(95, 'sawtooth', 0.24, 0.3)
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
      osc.frequency.setValueAtTime(520, t)
      osc.frequency.exponentialRampToValueAtTime(130, t + 0.24)
      gain.gain.setValueAtTime(0.24, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(t)
      osc.stop(t + 0.24)
    } catch {}
  }

  laser() {
    if (this.muted) return
    this.init()
    if (!this.ctx) return
    try {
      const t = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(880, t)
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.16)
      gain.gain.setValueAtTime(0.24, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(t)
      osc.stop(t + 0.16)
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
      gain.gain.setValueAtTime(0.32, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(t)
      osc.stop(t + 0.28)
    } catch {}
  }

  collect() {
    this.beep(587.33, 'triangle', 0.08, 0.2)
    setTimeout(() => this.beep(880, 'triangle', 0.12, 0.2), 70)
  }

  hurt() {
    this.beep(110, 'sawtooth', 0.22, 0.28)
  }

  victory() {
    const notes = [440, 554.37, 659.25, 880]
    notes.forEach((freq, idx) => {
      setTimeout(() => this.beep(freq, 'triangle', 0.2, 0.25), idx * 130)
    })
  }

  gameover() {
    const notes = [440, 370, 311.13, 220]
    notes.forEach((freq, idx) => {
      setTimeout(() => this.beep(freq, 'sawtooth', 0.25, 0.25), idx * 160)
    })
  }
}

const sfx = new SoundFX()

// ==========================================
// 🧬 นิยามฟอร์มเอเลี่ยนทั้ง 4 ตัว + ร่างเบ็น (ปรับความเร็วและอนิเมชั่นให้นุ่มนวล ไม่เร็วเกินไป)
// ==========================================
const ALIEN_FORMS = {
  ben: {
    id: 'ben',
    name: 'Ben Tennyson',
    nameTh: 'เบ็น เท็นนีย์สัน (มนุษย์)',
    color: '#10b981',
    bg: 'from-emerald-500 to-green-600',
    icon: User,
    speed: 2.6,
    jumpPower: 7.8,
    desc: 'คล่องแคล่ว ควบคุมง่าย ร่างคนจะช่วยให้ระบบ Omnitrix ค่อยๆ ระบายความร้อนและรีชาร์จพลังงาน!',
    skill: 'หมัดฮีโร่ (Hero Punch)',
  },
  heatblast: {
    id: 'heatblast',
    name: 'Heatblast',
    nameTh: 'ฮีทบลาสท์ (Pyronite)',
    color: '#f97316',
    bg: 'from-amber-500 to-red-600',
    icon: Flame,
    speed: 2.5,
    jumpPower: 7.6,
    desc: 'ยิงลูกไฟระเบิดจากฝ่ามือระยะไกล ทะลวงสิ่งกีดขวางและเผาเกราะบอส!',
    skill: 'พ่นลูกไฟเพลิง (Fireball Blast)',
  },
  cannonbolt: {
    id: 'cannonbolt',
    name: 'Cannonbolt',
    nameTh: 'แคนนอนโบลท์ (Arburian Pelarota)',
    color: '#eab308',
    bg: 'from-yellow-400 to-amber-600',
    icon: Shield,
    speed: 2.2,
    jumpPower: 7.2,
    desc: 'ม้วนตัวเป็นลูกบอลหุ้มเกราะกลิ้งบดขยี้ก้อนหินยักษ์และศัตรูอย่างนุ่มนวล!',
    skill: 'กลิ้งชนหิน & ศัตรู (Ball Mode)',
  },
  wildvine: {
    id: 'wildvine',
    name: 'Wildvine',
    nameTh: 'ไวล์ดไวน์ (Florauna)',
    color: '#22c55e',
    bg: 'from-green-500 to-emerald-700',
    icon: Sprout,
    speed: 2.5,
    jumpPower: 7.9,
    desc: 'ขว้างเมล็ดพันธุ์ระเบิดหนาม (Explosive Seeds) กระจาย 3 ทิศทาง โจมตีบอสได้รุนแรง!',
    skill: 'ปาเมล็ดพันธุ์ระเบิด (Explosive Seeds)',
  },
  wildmutt: {
    id: 'wildmutt',
    name: 'Wildmutt',
    nameTh: 'ไวลด์มัตต์ (Vulpimancer)',
    color: '#ea580c',
    bg: 'from-orange-500 to-amber-700',
    icon: Footprints,
    speed: 3.1,
    jumpPower: 8.8,
    desc: 'อสูรไร้ตา ปล่อยคลื่นเรดาร์โซนาร์ กระโดดสูงหลบการพุ่งชนของบอสและตะปบประชิด!',
    skill: 'คลื่นเรดาร์ & ตะปบ (Sonar Sense)',
  },
}

// ==========================================
// 🔘 ปุ่มกดสไตล์แท้ Ben 10 Savage Pursuit (ปุ่มหกเหลี่ยมขอบดำ มีไฟ Omnitrix แท้ 100%)
// ==========================================
function SavagePursuitButton({
  label = 'PLAY',
  sublabel = null,
  onClick,
  size = 'lg',
}) {
  const isLg = size === 'lg'
  return (
    <button
      onClick={onClick}
      className="group relative cursor-pointer select-none transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none flex flex-col items-center"
    >
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 240 76"
          className={`${
            isLg ? 'w-56 sm:w-64' : 'w-44 sm:w-52'
          } h-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_0_28px_rgba(74,222,128,0.95)] transition-all duration-300`}
        >
          <defs>
            <linearGradient id={`btnMetalGrad_${label}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8c9735" />
              <stop offset="16%" stopColor="#6e7826" />
              <stop offset="65%" stopColor="#485016" />
              <stop offset="100%" stopColor="#252a0a" />
            </linearGradient>
            <linearGradient id={`btnHighlight_${label}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#b5c448" />
              <stop offset="50%" stopColor="#7a852a" />
              <stop offset="100%" stopColor="#1a1d06" />
            </linearGradient>
          </defs>

          <polygon
            points="28,8 212,8 232,38 212,68 28,68 8,38"
            fill="#000000"
            stroke="#000000"
            strokeWidth="8"
            strokeLinejoin="round"
          />

          <polygon
            points="30,11 210,11 228,38 210,65 30,65 12,38"
            fill={`url(#btnMetalGrad_${label})`}
            stroke={`url(#btnHighlight_${label})`}
            strokeWidth="3"
            strokeLinejoin="round"
          />

          <line x1="32" y1="62" x2="208" y2="62" stroke="#161805" strokeWidth="2.5" />

          <g transform="translate(26, 50)">
            <circle cx="0" cy="0" r="10" fill="#000000" />
            <circle
              cx="0"
              cy="0"
              r="7.5"
              fill="#a3e635"
              className="group-hover:fill-lime-300 group-hover:drop-shadow-[0_0_10px_#4ade80] transition-colors"
            />
            <circle cx="0" cy="0" r="4.5" fill="#18181b" />
            <circle cx="0" cy="0" r="2" fill="#ffffff" />
          </g>

          <text
            x="126"
            y="49"
            textAnchor="middle"
            className="font-black italic tracking-widest text-[34px] select-none"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="5"
            paintOrder="stroke fill"
            style={{
              fontFamily: "'Impact', 'Arial Black', sans-serif",
              letterSpacing: '0.08em',
              filter: 'drop-shadow(0px 3px 0px #000000)',
            }}
          >
            {label}
          </text>
        </svg>
      </div>

      {sublabel && (
        <span className="block mt-1 text-[11px] text-green-300 font-bold tracking-wide uppercase opacity-85 group-hover:opacity-100 transition-opacity">
          {sublabel}
        </span>
      )}
    </button>
  )
}

// ==========================================
// ?? ???????????????????? 3 ???? (3 UNIQUE STAGES & BOSSES)
// ==========================================
const STAGE_CONFIG = {
  1: {
    id: 1,
    name: 'STAGE 1: SAVAGE CANYON',
    nameTh: '???? 1: ???????????????? & ????????????',
    subtitle: '???????????????? ??. ???????? ???????????????????????',
    bossName: 'DR. ALOYSIUS ANIMO',
    bossNameTh: '??. ???????? (Dr. Animo)',
    bossRole: '??????????????????????? ?????????? Transmodulator ?????????????????????',
    bossHp: 1800,
    bossSpriteKey: 'bossAnimo',
    bossWidth: 110,
    bossHeight: 125,
    bgKey: 'bgShipwreck',
    bgTheme: 'shipwreck',
    accentColor: '#22c55e',
    badgeText: 'STAGE 1: DR. ANIMO',
    clearBonus: 5000,
  },
  2: {
    id: 2,
    name: 'STAGE 2: VOLCANIC CAVERN',
    nameTh: '???? 2: ???????????????????',
    subtitle: '??? ????? 11 ?????????????????????????? Omnitrix ????????????',
    bossName: 'KEVIN 11 (THE AMALGAM)',
    bossNameTh: '????? 11 (Kevin Levin)',
    bossRole: '????????????????????????????? Heatblast, Diamondhead, Four Arms, Stinkfly',
    bossHp: 2600,
    bossSpriteKey: 'bossKevin11',
    bossWidth: 125,
    bossHeight: 140,
    bgKey: 'bgLava',
    bgTheme: 'lava',
    accentColor: '#f97316',
    badgeText: 'STAGE 2: KEVIN 11',
    clearBonus: 10000,
  },
  3: {
    id: 3,
    name: 'STAGE 3: CHIMERIAN HAMMER',
    nameTh: '???? 3: ??????????????? ????????? ????????',
    subtitle: '?????????????????! ???????????? ????? ????????? ?????????????????? Omnitrix',
    bossName: 'LORD VILGAX (THE CONQUEROR)',
    bossNameTh: '????? ????????? (Vilgax)',
    bossRole: '???????????????????????? ???????? 10 ???? ???????????????????????????????',
    bossHp: 3800,
    bossSpriteKey: 'bossVilgax',
    bossWidth: 135,
    bossHeight: 155,
    bgKey: 'bgVilgax',
    bgTheme: 'vilgax',
    accentColor: '#ef4444',
    badgeText: 'FINAL BOSS: VILGAX',
    clearBonus: 25000,
  },
}

// ==========================================
// ??? ?????????????????????? (Stage 1: ????????????, Stage 2: ???????, Stage 3: ??????????????)
// ==========================================
function drawAuthenticSWFBackground(ctx, cam, sp, stageNum, animTick) {
  const drawTiledLayer = (img, parallax = 0.32, alpha = 1) => {
    if (!img) return
    ctx.save()
    ctx.globalAlpha = alpha
    const tileW = 680
    const tileH = 450
    const scrollX = Math.max(0, cam * parallax)
    const firstTile = Math.floor(scrollX / tileW)
    const offsetX = -(scrollX % tileW)

    for (let i = -1; i <= 2; i++) {
      const tileIdx = firstTile + i
      const drawX = offsetX + i * tileW
      ctx.save()
      if (Math.abs(tileIdx) % 2 === 1) {
        ctx.translate(drawX + tileW, 0)
        ctx.scale(-1, 1)
        ctx.drawImage(img, 0, 0, tileW, tileH)
      } else {
        ctx.drawImage(img, drawX, 0, tileW, tileH)
      }
      ctx.restore()
    }
    ctx.restore()
  }

  if (stageNum === 1) {
    // Stage 1: Ancient Shipwreck & Savage Canyon
    const canyonGrad = ctx.createLinearGradient(0, 0, 0, 540)
    canyonGrad.addColorStop(0, '#422006')
    canyonGrad.addColorStop(1, '#78350f')
    ctx.fillStyle = canyonGrad
    ctx.fillRect(0, 0, 960, 540)

    if (sp.bgShipwreck) {
      drawTiledLayer(sp.bgShipwreck, 0.32, 1)
    }

    // ????????????????????
    const bushSpan = 260
    const bushOffset = -((cam * 1.0) % bushSpan)
    for (let bx = bushOffset - bushSpan; bx < 960 + bushSpan; bx += bushSpan) {
      const bImg =
        Math.abs(Math.round((bx + cam) / bushSpan)) % 2 === 0
          ? sp.bush1
          : sp.bush2
      if (bImg) {
        ctx.drawImage(bImg, bx + 95, 396, 42, 42)
      }
    }
  } else if (stageNum === 2) {
    // Stage 2: Volcanic Magma Cavern
    const lavaGrad = ctx.createLinearGradient(0, 0, 0, 540)
    lavaGrad.addColorStop(0, '#27171c')
    lavaGrad.addColorStop(1, '#451a03')
    ctx.fillStyle = lavaGrad
    ctx.fillRect(0, 0, 960, 540)

    if (sp.bgLava) {
      drawTiledLayer(sp.bgLava, 0.32, 1)
    }

    // ???????????????????
    ctx.save()
    ctx.globalAlpha = 0.85
    for (let i = 0; i < 22; i++) {
      const ex =
        (((i * 97 + animTick * (0.4 + (i % 3) * 0.2) - cam * 0.5) % 960) + 960) %
        960
      const ey = 430 - ((animTick * (0.75 + (i % 4) * 0.22) + i * 45) % 390)
      const r = 2 + (i % 3) * 1.5
      ctx.fillStyle = i % 2 === 0 ? '#fde047' : '#f97316'
      ctx.beginPath()
      ctx.arc(ex, ey, r, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  } else {
    // Stage 3: Chimerian Hammer (Vilgax Dreadnought Warship)
    const warshipGrad = ctx.createLinearGradient(0, 0, 0, 540)
    warshipGrad.addColorStop(0, '#09090b')
    warshipGrad.addColorStop(0.5, '#18181b')
    warshipGrad.addColorStop(1, '#450a0a')
    ctx.fillStyle = warshipGrad
    ctx.fillRect(0, 0, 960, 540)

    if (sp.bgVilgax) {
      drawTiledLayer(sp.bgVilgax, 0.28, 1)
    } else if (sp.bgLava) {
      drawTiledLayer(sp.bgLava, 0.28, 0.5)
    }

    // ????????????????????????????????????????????????
    ctx.save()
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.18)'
    ctx.lineWidth = 1
    for (let gy = 80; gy < 440; gy += 60) {
      ctx.beginPath()
      ctx.moveTo(0, gy)
      ctx.lineTo(960, gy)
      ctx.stroke()
    }
    for (let i = 0; i < 18; i++) {
      const cx = (((i * 123 + animTick * 0.6 - cam * 0.4) % 960) + 960) % 960
      const cy = 420 - ((animTick * 0.8 + i * 55) % 380)
      ctx.fillStyle = i % 2 === 0 ? '#ef4444' : '#f43f5e'
      ctx.shadowColor = '#ef4444'
      ctx.shadowBlur = 6
      ctx.beginPath()
      ctx.arc(cx, cy, 2 + (i % 2), 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }
}

// ????????????????????????
function drawBossEnergyShield(ctx, cx, cy, radius, color, animTick, isHex = false) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 3
  ctx.shadowColor = color
  ctx.shadowBlur = 16
  ctx.fillStyle = `${color}25`

  ctx.beginPath()
  if (isHex) {
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 + animTick * 0.02
      const x = cx + radius * Math.cos(angle)
      const y = cy + radius * Math.sin(angle)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
  } else {
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  }
  ctx.fill()
  ctx.stroke()
  ctx.restore()
}

// ?? 1. ?????????? 1: ??. ???????? (Dr. Aloysius Animo)
function drawDrAnimo(ctx, bs, cam, animTick, sp) {
  const bx = bs.x - cam
  const by = bs.y
  const cx = bx + bs.w / 2
  const cy = by + bs.h / 2
  const breathe = Math.sin(animTick * 0.08) * 3
  const isTelegraph = bs.chargeState === 'windup'
  const isCharging = bs.chargeState === 'charging'

  ctx.save()

  // ??????????
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)'
  ctx.beginPath()
  ctx.ellipse(cx, 438, bs.w * 0.45, 10, 0, 0, Math.PI * 2)
  ctx.fill()

  // ?????????? Transmodulator (?????????????????????????)
  const auraRad = 70 + Math.sin(animTick * 0.2) * 8
  const aura = ctx.createRadialGradient(cx, cy, 15, cx, cy, auraRad)
  if (bs.phase === 2 || isTelegraph) {
    aura.addColorStop(0, 'rgba(132, 204, 22, 0.7)')
    aura.addColorStop(0.6, 'rgba(34, 197, 94, 0.35)')
    aura.addColorStop(1, 'rgba(21, 128, 61, 0)')
  } else {
    aura.addColorStop(0, 'rgba(74, 222, 128, 0.4)')
    aura.addColorStop(1, 'rgba(74, 222, 128, 0)')
  }
  ctx.fillStyle = aura
  ctx.beginPath()
  ctx.arc(cx, cy, auraRad, 0, Math.PI * 2)
  ctx.fill()

  ctx.translate(cx, cy + breathe)
  const dir = bs.facing || -1
  ctx.scale(dir, 1)

  if (sp.bossAnimo) {
    if (bs.hitFlash > 0) {
      ctx.filter = 'brightness(3) contrast(200%) drop-shadow(0 0 10px #22c55e)'
    }
    ctx.drawImage(sp.bossAnimo, -bs.w / 2, -bs.h / 2, bs.w, bs.h)
    ctx.filter = 'none'
  } else {
    ctx.fillStyle = '#84cc16'
    ctx.fillRect(-bs.w / 2, -bs.h / 2, bs.w, bs.h)
  }

  // ??????????????????????????? Transmodulator
  ctx.strokeStyle = '#a3e635'
  ctx.lineWidth = 2.5
  for (let i = 0; i < 3; i++) {
    const angle = (animTick * 0.15 + i * 2) % (Math.PI * 2)
    const arcX = Math.cos(angle) * 22
    const arcY = -bs.h / 2 + 10 + Math.sin(angle) * 14
    ctx.beginPath()
    ctx.moveTo(0, -bs.h / 2 + 15)
    ctx.lineTo(arcX, arcY)
    ctx.stroke()
  }

  ctx.restore()

  if (bs.shieldTimer > 0) {
    drawBossEnergyShield(ctx, cx, cy, bs.w * 0.75, '#22c55e', animTick)
  }
}

// ?? 2. ?????????? 2: ????? 11 (Kevin Levin - Mutant Alien Amalgam)
function drawKevin11(ctx, bs, cam, animTick, sp) {
  const bx = bs.x - cam
  const by = bs.y
  const cx = bx + bs.w / 2
  const cy = by + bs.h / 2
  const breathe = Math.sin(animTick * 0.08) * 3
  const isTelegraph = bs.chargeState === 'windup'
  const isCharging = bs.chargeState === 'charging'

  ctx.save()

  // ??????????
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)'
  ctx.beginPath()
  ctx.ellipse(cx, 438, bs.w * 0.48, 11, 0, 0, Math.PI * 2)
  ctx.fill()

  // ??????????????????????? (?? Heatblast + ??????? Diamondhead)
  const auraRad = 85 + Math.sin(animTick * 0.18) * 10
  const aura = ctx.createRadialGradient(cx, cy, 20, cx, cy, auraRad)
  if (bs.phase === 2 || isCharging) {
    aura.addColorStop(0, 'rgba(239, 68, 68, 0.7)')
    aura.addColorStop(0.5, 'rgba(249, 115, 22, 0.4)')
    aura.addColorStop(1, 'rgba(6, 182, 212, 0)')
  } else {
    aura.addColorStop(0, 'rgba(249, 115, 22, 0.45)')
    aura.addColorStop(0.6, 'rgba(6, 182, 212, 0.25)')
    aura.addColorStop(1, 'rgba(249, 115, 22, 0)')
  }
  ctx.fillStyle = aura
  ctx.beginPath()
  ctx.arc(cx, cy, auraRad, 0, Math.PI * 2)
  ctx.fill()

  ctx.translate(cx, cy + breathe)
  const dir = bs.facing || -1
  ctx.scale(dir, 1)

  if (sp.bossKevin11) {
    if (bs.hitFlash > 0) {
      ctx.filter = 'brightness(3) contrast(200%) drop-shadow(0 0 12px #f97316)'
    }
    ctx.drawImage(sp.bossKevin11, -bs.w / 2, -bs.h / 2, bs.w, bs.h)
    ctx.filter = 'none'
  } else {
    ctx.fillStyle = '#f97316'
    ctx.fillRect(-bs.w / 2, -bs.h / 2, bs.w, bs.h)
  }

  // ????????????? Heatblast ???????????????????????? Diamondhead
  ctx.fillStyle = '#fde047'
  for (let i = 0; i < 4; i++) {
    const fx = -bs.w / 2 + 10 + (Math.sin(animTick * 0.2 + i) * 6)
    const fy = -bs.h / 4 + (Math.cos(animTick * 0.2 + i * 1.5) * 8)
    ctx.beginPath()
    ctx.arc(fx, fy, 2.5, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.fillStyle = '#67e8f9'
  for (let i = 0; i < 4; i++) {
    const cx2 = bs.w / 2 - 10 + (Math.cos(animTick * 0.2 + i) * 6)
    const cy2 = -bs.h / 4 + (Math.sin(animTick * 0.2 + i * 1.5) * 8)
    ctx.beginPath()
    ctx.arc(cx2, cy2, 2.5, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()

  if (bs.shieldTimer > 0) {
    drawBossEnergyShield(ctx, cx, cy, bs.w * 0.8, '#f97316', animTick)
  }
}

// ?? 3. ?????????? 3: ????? ????????? (Lord Vilgax - Conqueror of 10 Worlds)
function drawVilgax(ctx, bs, cam, animTick, sp) {
  const bx = bs.x - cam
  const by = bs.y
  const cx = bx + bs.w / 2
  const cy = by + bs.h / 2
  const breathe = Math.sin(animTick * 0.07) * 3.5
  const isTelegraph = bs.chargeState === 'windup'
  const isCharging = bs.chargeState === 'charging'

  ctx.save()

  // ??????????????????
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)'
  ctx.beginPath()
  ctx.ellipse(cx, 438, bs.w * 0.55, 13, 0, 0, Math.PI * 2)
  ctx.fill()

  // ??????????????????????????????????? (Crimson Cybernetic Dreadnought Aura)
  const auraRad = 95 + Math.sin(animTick * 0.16) * 12
  const aura = ctx.createRadialGradient(cx, cy, 25, cx, cy, auraRad)
  if (bs.phase === 3 || isCharging) {
    aura.addColorStop(0, 'rgba(220, 38, 38, 0.75)')
    aura.addColorStop(0.5, 'rgba(153, 27, 27, 0.45)')
    aura.addColorStop(1, 'rgba(0, 0, 0, 0)')
  } else {
    aura.addColorStop(0, 'rgba(239, 68, 68, 0.5)')
    aura.addColorStop(1, 'rgba(239, 68, 68, 0)')
  }
  ctx.fillStyle = aura
  ctx.beginPath()
  ctx.arc(cx, cy, auraRad, 0, Math.PI * 2)
  ctx.fill()

  ctx.translate(cx, cy + breathe)
  const dir = bs.facing || -1
  ctx.scale(dir, 1)

  if (sp.bossVilgax) {
    if (bs.hitFlash > 0) {
      ctx.filter = 'brightness(3) contrast(200%) drop-shadow(0 0 15px #ef4444)'
    }
    ctx.drawImage(sp.bossVilgax, -bs.w / 2, -bs.h / 2, bs.w, bs.h)
    ctx.filter = 'none'
  } else {
    ctx.fillStyle = '#dc2626'
    ctx.fillRect(-bs.w / 2, -bs.h / 2, bs.w, bs.h)
  }

  // ????????????????????????????????????????????
  const eyeGlow = 3 + Math.sin(animTick * 0.3) * 1.5
  ctx.fillStyle = '#ff0033'
  ctx.shadowColor = '#ff0033'
  ctx.shadowBlur = 8
  ctx.beginPath()
  ctx.arc(-14, -bs.h / 2 + 38, eyeGlow, 0, Math.PI * 2)
  ctx.arc(10, -bs.h / 2 + 38, eyeGlow, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0

  ctx.restore()

  if (bs.shieldTimer > 0) {
    drawBossEnergyShield(ctx, cx, cy, bs.w * 0.85, '#ef4444', animTick, true)
  }
}

// ==========================================
// 🚐 วาดรถบ้าน The Rust Bucket ของปู่แม็กซ์ สไตล์การ์ตูนคมชัด
// ==========================================
function drawRustBucketRV(ctx, x, y) {
  ctx.save()
  ctx.translate(x, y)

  ctx.fillStyle = 'rgba(0, 0, 0, 0.38)'
  ctx.beginPath()
  ctx.ellipse(105, 162, 98, 12, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#d6d1be'
  ctx.strokeStyle = '#1f1d18'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.roundRect(36, 6, 56, 16, 4)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = '#e8dfc8'
  ctx.strokeStyle = '#18181b'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(8, 22)
  ctx.lineTo(162, 22)
  ctx.lineTo(196, 85)
  ctx.lineTo(202, 138)
  ctx.lineTo(8, 138)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = '#c2410c'
  ctx.fillRect(10, 84, 186, 9)
  ctx.fillStyle = '#3b82f6'
  ctx.fillRect(10, 94, 188, 5)

  ctx.fillStyle = '#334155'
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.roundRect(16, 34, 42, 42, 4)
  ctx.fill()
  ctx.stroke()

  ctx.beginPath()
  ctx.roundRect(68, 34, 34, 42, 4)
  ctx.fill()
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(110, 32)
  ctx.lineTo(156, 32)
  ctx.lineTo(184, 78)
  ctx.lineTo(110, 78)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(124, 38)
  ctx.lineTo(142, 72)
  ctx.moveTo(148, 38)
  ctx.lineTo(166, 72)
  ctx.stroke()

  ctx.strokeStyle = '#27272a'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(96, 22)
  ctx.lineTo(96, -8)
  ctx.moveTo(175, 32)
  ctx.lineTo(177, 2)
  ctx.stroke()
  ctx.fillStyle = '#ea580c'
  ctx.beginPath()
  ctx.arc(96, -8, 3, 0, Math.PI * 2)
  ctx.arc(177, 2, 3, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#18181b'
  ctx.strokeStyle = '#52525b'
  ctx.lineWidth = 2
  ctx.fillRect(142, 102, 48, 24)
  ctx.strokeRect(142, 102, 48, 24)
  ctx.strokeStyle = '#71717a'
  ctx.beginPath()
  ctx.moveTo(144, 110)
  ctx.lineTo(188, 110)
  ctx.moveTo(144, 118)
  ctx.lineTo(188, 118)
  ctx.stroke()

  ctx.fillStyle = '#fde047'
  ctx.fillRect(128, 105, 11, 16)
  ctx.fillRect(191, 105, 9, 16)

  ctx.fillStyle = '#a1a1aa'
  ctx.strokeStyle = '#18181b'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.roundRect(120, 128, 86, 14, 4)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = '#09090b'
  ctx.beginPath()
  ctx.arc(76, 138, 26, Math.PI, 0)
  ctx.fill()

  ctx.fillStyle = '#27272a'
  ctx.strokeStyle = '#09090b'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(76, 142, 21, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = '#9ca3af'
  ctx.beginPath()
  ctx.arc(76, 142, 10, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  ctx.restore()
}

export default function Ben10Game({ currentUser }) {
  const [screen, setScreen] = useState('menu')
  const [instructionPage, setInstructionPage] = useState(1)
  const [muted, setMuted] = useState(false)
  const [bgTheme, setBgTheme] = useState('auto') // 'auto' | 'lava' | 'shipwreck'
  const [leaderboard, setLeaderboard] = useState([])
  const [finalScore, setFinalScore] = useState(0)
  const [currentStage, setCurrentStage] = useState(1)
  const currentStageRef = useRef(1)
  const [stageClearedInfo, setStageClearedInfo] = useState(null)

  // ข้อมูลแสดงบน HUD
  const [hudHp, setHudHp] = useState(100)
  const [hudEnergy, setHudEnergy] = useState(100)
  const [hudLives, setHudLives] = useState(3)
  const [hudScore, setHudScore] = useState(0)
  const [hudCurrentForm, setHudCurrentForm] = useState('ben')
  const [hudProgress, setHudProgress] = useState(0)
  const [isDialOpen, setIsDialOpen] = useState(false)
  const [dialSelection, setDialSelection] = useState('heatblast')

  // สถานะ Omnitrix Timeout (สีแดง และ คูลดาวน์)
  const [isOmnitrixRed, setIsOmnitrixRed] = useState(false)
  const [redCooldownSec, setRedCooldownSec] = useState(0)
  const [warningToast, setWarningToast] = useState(null)

  const canvasRef = useRef(null)
  const animFrameId = useRef(null)
  const bgThemeRef = useRef('auto')

  useEffect(() => {
    bgThemeRef.current = bgTheme
  }, [bgTheme])

  // ภาพ Sprite ของแท้จากไฟล์เกม SWF
  const spritesRef = useRef({
    bgShipwreck: null,
    bgLava: null,
    bgVilgax: null,
    bossAnimo: null,
    bossKevin11: null,
    bossKevinHuman: null,
    bossVilgax: null,
    volcanicGround: null,
    volcanicWall: null,
    boulderSprite: null,
    bush1: null,
    bush2: null,
    rockGround: null,
    stoneWall: null,
    benHead: null,
    benStand: null,
    benWalk: null,
    benJump: null,
    benPunch: null,
    heatblastStand: null,
    heatblastBlast: null,
    cannonboltStand: null,
    cannonboltBall: null,
    wildmutt: null,
    wildvine: null,
    loaded: false,
  })

  // โหลดภาพสไปรท์และฉากหลังของแท้ทั้งหมด
  useEffect(() => {
    const list = [
      ['bgShipwreck', '/ben10/sprites/lossless_2022.png'],
      ['bgLava', '/ben10/sprites/lossless_259.png'],
      ['bgVilgax', '/ben10/sprites/bg_stage3_vilgax.png'],
      ['bossAnimo', '/ben10/sprites/boss_animo.png'],
      ['bossKevin11', '/ben10/sprites/boss_kevin11.png'],
      ['bossKevinHuman', '/ben10/sprites/boss_kevin_human.png'],
      ['bossVilgax', '/ben10/sprites/boss_vilgax.png'],
      ['volcanicGround', '/ben10/sprites/lossless_263.png'],
      ['volcanicWall', '/ben10/sprites/lossless_265.png'],
      ['boulderSprite', '/ben10/sprites/clean_boulder.png'],
      ['bush1', '/ben10/sprites/clean_bush1.png'],
      ['bush2', '/ben10/sprites/clean_bush2.png'],
      ['rockGround', '/ben10/sprites/clean_rock_ground.png'],
      ['stoneWall', '/ben10/sprites/clean_stone_wall.png'],
      ['benHead', '/ben10/sprites/real_ben_head.png'],
      ['benStand', '/ben10/sprites/clean_ben_stand.png'],
      ['benWalk', '/ben10/sprites/clean_ben_walk.png'],
      ['benJump', '/ben10/sprites/clean_ben_jump.png'],
      ['benPunch', '/ben10/sprites/clean_ben_punch.png'],
      ['heatblastStand', '/ben10/sprites/clean_heatblast_stand.png'],
      ['heatblastBlast', '/ben10/sprites/clean_heatblast_blast.png'],
      ['cannonboltStand', '/ben10/sprites/clean_cannonbolt_stand.png'],
      ['cannonboltBall', '/ben10/sprites/clean_cannonbolt_ball.png'],
      ['wildmutt', '/ben10/sprites/clean_wildmutt.png'],
      ['wildvine', '/ben10/sprites/clean_wildvine.png'],
    ]

    let loadedCount = 0
    list.forEach(([key, src]) => {
      const img = new Image()
      img.src = src
      img.onload = () => {
        spritesRef.current[key] = img
        loadedCount++
        if (loadedCount === list.length) {
          spritesRef.current.loaded = true
        }
      }
    })
  }, [])

  // State เครื่องยนต์เกม
  const engineRef = useRef({
    keys: {
      left: false,
      right: false,
      up: false,
      attack: false,
      dial: false,
    },
    player: {
      x: 210,
      y: 350,
      vx: 0,
      vy: 0,
      w: 42,
      h: 60,
      grounded: false,
      facing: 1,
      form: 'ben',
      hp: 100,
      maxHp: 100,
      energy: 100,
      maxEnergy: 100,
      isTimedOut: false,
      redCooldown: 0,
      lives: 3,
      score: 0,
      invulnerable: 0,
      attackCooldown: 0,
      isAttacking: false,
      isRolling: false,
      animTick: 0,
      sonarWaves: [],
    },
    cameraX: 0,
    stageWidth: 4400,
    platforms: [],
    hazards: [],
    boulders: [],
    collectibles: [],
    enemies: [],
    projectiles: [],
    meteors: [],
    particles: [],
    boss: null,
    goBannerTick: 120,
    redShockwave: 0,
    running: false,
    dialModalOpen: false,
    screenShake: 0,
  })

  // โหลด Leaderboard
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

  const cycleBgTheme = () => {
    setBgTheme((prev) => {
      const next =
        prev === 'auto' ? 'lava' : prev === 'lava' ? 'shipwreck' : 'auto'
      const label =
        next === 'auto'
          ? '🏞️ ฉากหลัง: เปลี่ยนอัตโนมัติตามโซน (ซากเรือ ➔ ถ้ำลาวา)'
          : next === 'lava'
          ? '🌋 ฉากหลัง: ถ้ำลาวานรก (Lava Cavern)'
          : '⚓ ฉากหลัง: หุบเขาซากเรือโบราณ (Shipwreck Canyon)'
      showToast(label)
      return next
    })
  }

  const showToast = (msg) => {
    setWarningToast(msg)
    setTimeout(() => setWarningToast(null), 2800)
  }

  // ==========================================
  // 🗺️ สร้างฉากระดับโลกและบอสใหญ่ 3 เฟส (2,500 HP)
  // ==========================================
  const initLevel = (stageNum = 1) => {
    const eng = engineRef.current
    eng.currentStage = stageNum
    setCurrentStage(stageNum)
    currentStageRef.current = stageNum
    eng.stageWidth = 4400
    eng.cameraX = 0
    eng.goBannerTick = 120
    eng.redShockwave = 0
    eng.particles = []
    eng.projectiles = []
    eng.meteors = []
    eng.screenShake = 0

    eng.player = {
      x: 210,
      y: 350,
      vx: 0,
      vy: 0,
      w: 42,
      h: 60,
      grounded: false,
      facing: 1,
      form: 'ben',
      hp: 100,
      maxHp: 100,
      energy: 100,
      maxEnergy: 100,
      isTimedOut: false,
      redCooldown: 0,
      lives: 3,
      score: stageNum === 1 ? 0 : (eng.player ? eng.player.score : 0),
      invulnerable: 0,
      attackCooldown: 0,
      isAttacking: false,
      isRolling: false,
      animTick: 0,
      sonarWaves: [],
    }

    setIsOmnitrixRed(false)
    setRedCooldownSec(0)

    eng.platforms = [
      { x: 0, y: 440, w: 900, h: 100, type: 'ground' },
      { x: 980, y: 440, w: 720, h: 100, type: 'ground' },
      { x: 1800, y: 440, w: 920, h: 100, type: 'ground' },
      { x: 2820, y: 440, w: 1580, h: 100, type: 'ground' },

      { x: 380, y: 345, w: 145, h: 22, type: 'rock' },
      { x: 580, y: 270, w: 160, h: 22, type: 'rock' },
      { x: 800, y: 325, w: 120, h: 22, type: 'rock' },

      { x: 900, y: 375, w: 80, h: 18, type: 'wood' },
      { x: 1100, y: 350, w: 180, h: 22, type: 'rock' },
      { x: 1350, y: 280, w: 160, h: 22, type: 'rock' },
      { x: 1560, y: 335, w: 140, h: 22, type: 'rock' },

      { x: 1960, y: 335, w: 160, h: 22, type: 'rock' },
      { x: 2200, y: 260, w: 180, h: 22, type: 'rock' },
      { x: 2440, y: 325, w: 160, h: 22, type: 'rock' },
      { x: 2980, y: 345, w: 200, h: 22, type: 'rock' },
      { x: 3280, y: 275, w: 220, h: 22, type: 'rock' },
      // แท่นหินในโซนบอสเพื่อใช้กระโดดหลบการพุ่งชนและคลื่นกระแทกของบอส
      { x: 3580, y: 340, w: 160, h: 22, type: 'rock' },
      { x: 3830, y: 255, w: 170, h: 22, type: 'rock' },
      { x: 4090, y: 335, w: 160, h: 22, type: 'rock' },
    ]

    eng.hazards = [
      { x: 900, y: 465, w: 80, h: 75, type: 'acid' },
      { x: 1700, y: 465, w: 100, h: 75, type: 'acid' },
      { x: 2720, y: 465, w: 100, h: 75, type: 'acid' },
      { x: 1420, y: 422, w: 60, h: 18, type: 'spikes' },
      { x: 2320, y: 422, w: 70, h: 18, type: 'spikes' },
    ]

    eng.boulders = [
      { x: 730, y: 365, w: 74, h: 75, hp: 40, broken: false },
      { x: 1510, y: 365, w: 74, h: 75, hp: 40, broken: false },
      { x: 2550, y: 365, w: 76, h: 75, hp: 40, broken: false },
      { x: 3110, y: 365, w: 76, h: 75, hp: 40, broken: false },
    ]

    eng.collectibles = [
      { x: 420, y: 305, type: 'dna', taken: false },
      { x: 640, y: 230, type: 'dna', taken: false },
      { x: 1150, y: 310, type: 'dna', taken: false },
      { x: 1400, y: 240, type: 'dna', taken: false },
      { x: 2020, y: 295, type: 'dna', taken: false },
      { x: 2270, y: 220, type: 'dna', taken: false },
      { x: 3050, y: 305, type: 'dna', taken: false },
      { x: 3350, y: 235, type: 'dna', taken: false },
      { x: 3910, y: 210, type: 'dna', taken: false },

      { x: 840, y: 275, type: 'card', taken: false },
      { x: 1620, y: 285, type: 'card', taken: false },
      { x: 2490, y: 275, type: 'card', taken: false },
      { x: 3630, y: 295, type: 'card', taken: false },

      { x: 1220, y: 405, type: 'smoothie', taken: false },
      { x: 2120, y: 405, type: 'smoothie', taken: false },
      { x: 3480, y: 405, type: 'smoothie', taken: false },
      { x: 3660, y: 295, type: 'smoothie', taken: false },
      { x: 4160, y: 290, type: 'smoothie', taken: false },
    ]

    eng.enemies = [
      {
        id: 1,
        type: 'crawler',
        name: 'Root Crawler',
        x: 480,
        y: 395,
        w: 42,
        h: 46,
        vx: 0.65,
        minX: 360,
        maxX: 640,
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
        vx: 0.75,
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
        vx: -0.7,
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
        vx: 0.8,
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
        vx: 0.7,
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
        vx: -0.75,
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
        vx: 0.85,
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
        vx: 0.75,
        minX: 3100,
        maxX: 3450,
        hp: 55,
        maxHp: 55,
        alive: true,
      },
    ]

    // 👹 บอสใหญ่สุดโหด 3 เฟส: เลือด 2,500 HP + เกราะสะท้อน + พุ่งชน + อุกกาบาตลาวา!
    eng.boss = {
      name: 'MUTANT BIO-TITAN OVERLORD',
      x: 4020,
      y: 290,
      baseY: 290,
      vy: 0,
      w: 135,
      h: 150,
      hp: 2500,
      maxHp: 2500,
      vx: 0.7,
      facing: -1,
      minX: 3540,
      maxX: 4250,
      alive: true,
      attackTimer: 0,
      phase: 1,
      hitFlash: 0,
      shieldTimer: 0,
      chargeState: 'idle', // 'idle' | 'windup' | 'charging'
      chargeTimer: 0,
      jumping: false,
    }
  }

  const startGame = () => {
    sfx.init()
    sfx.transform()
    initLevel()
    setScreen('playing')
    engineRef.current.running = true
  }

  // แปลงร่าง (เช็คสถานะสีแดง Omnitrix Timeout)
  const triggerTransform = (formKey) => {
    const eng = engineRef.current
    const p = eng.player

    if (p.isTimedOut) {
      sfx.lockedBuzz()
      showToast('⚠️ OMNITRIX TIMEOUT! นาฬิกากำลังระบายความร้อน (โหมดสีแดง)')
      return
    }

    if (p.form === formKey) {
      p.form = 'ben'
      p.isRolling = false
      sfx.beep(320, 'sine', 0.15)
    } else {
      p.form = formKey
      p.isRolling = false
      sfx.transform()
      for (let i = 0; i < 22; i++) {
        eng.particles.push({
          x: p.x + p.w / 2,
          y: p.y + p.h / 2,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          life: 32,
          maxLife: 32,
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
        if (eng.player.isTimedOut) {
          sfx.lockedBuzz()
          showToast('⚠️ OMNITRIX TIMEOUT! นาฬิกาเป็นสีแดง กำลังระบายความร้อน')
        } else {
          sfx.beep(520, 'sine', 0.08)
          setIsDialOpen((prev) => {
            eng.dialModalOpen = !prev
            return !prev
          })
        }
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

  // การโจมตีของผู้เล่น
  const handleAttackAction = () => {
    const eng = engineRef.current
    if (!eng.running || eng.dialModalOpen) return
    const p = eng.player
    const form = p.form

    if (p.attackCooldown > 0) return

    p.isAttacking = true
    setTimeout(() => {
      p.isAttacking = false
    }, 380)

    if (form === 'ben') {
      p.attackCooldown = 22
      sfx.beep(300, 'triangle', 0.1)
      p.vx = p.facing * 2.5
      eng.projectiles.push({
        x: p.facing > 0 ? p.x + p.w : p.x - 30,
        y: p.y + p.h * 0.35,
        vx: 0,
        vy: 0,
        w: 32,
        h: 24,
        damage: 18,
        life: 14,
        color: '#22c55e',
        from: 'player',
        type: 'punch',
      })
    } else if (form === 'heatblast') {
      p.attackCooldown = 24
      sfx.fireball()
      eng.projectiles.push({
        x: p.facing > 0 ? p.x + p.w + 6 : p.x - 20,
        y: p.y + p.h * 0.35,
        vx: p.facing * 5.8,
        vy: 0,
        r: 13,
        damage: 28,
        color: '#f97316',
        from: 'player',
        type: 'fireball',
      })
      p.energy = Math.max(0, p.energy - 1.0)
    } else if (form === 'cannonbolt') {
      // แคนนอนโบลท์เข้าสู่ Ball Mode กลิ้งด้วยความเร็วนุ่มนวล ไม่พุ่งเร็วเกินไป
      p.isRolling = !p.isRolling
      p.attackCooldown = 36
      sfx.smash()
      if (p.isRolling) {
        p.vx = p.facing * 3.1
      }
      for (let i = 0; i < 6; i++) {
        eng.particles.push({
          x: p.x + p.w / 2,
          y: p.y + p.h,
          vx: (Math.random() - 0.5) * 2.5,
          vy: -Math.random() * 1.8,
          life: 22,
          maxLife: 22,
          color: '#d4d4d8',
          size: Math.random() * 4 + 2,
        })
      }
    } else if (form === 'wildvine') {
      p.attackCooldown = 28
      sfx.beep(420, 'sawtooth', 0.12)
      ;[-0.85, 0, 0.85].forEach((vy) => {
        eng.projectiles.push({
          x: p.facing > 0 ? p.x + p.w : p.x - 10,
          y: p.y + p.h * 0.3,
          vx: p.facing * 4.8,
          vy: vy,
          r: 7,
          damage: 26,
          life: 52,
          color: '#22c55e',
          from: 'player',
          type: 'seed',
        })
      })
    } else if (form === 'wildmutt') {
      p.attackCooldown = 22
      sfx.beep(280, 'sine', 0.12)
      p.vx = p.facing * 3.6
      p.sonarWaves.push({ r: 10, maxR: 60, alpha: 1.0 })
      eng.projectiles.push({
        x: p.facing > 0 ? p.x + p.w : p.x - 35,
        y: p.y + p.h * 0.3,
        vx: 0,
        vy: 0,
        w: 36,
        h: 32,
        damage: 34,
        life: 14,
        color: '#ea580c',
        from: 'player',
        type: 'claw',
      })
    }
  }

  // ==========================================
  // ⚙️ Game Loop, Omnitrix Red Timeout & 3-Phase Boss AI
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
      if (eng.redShockwave > 0) eng.redShockwave--
      p.animTick++

      // ==========================================
      // 🔴 ระบบ Omnitrix Timeout: หมดเวลาแล้วเป็นสีแดง! (รีชาร์จช้าลง 18 วินาที)
      // ==========================================
      if (p.isTimedOut) {
        p.redCooldown--
        const secRemaining = Math.ceil(p.redCooldown / 60)
        setRedCooldownSec(secRemaining)

        p.energy = Math.min(100, 100 - (p.redCooldown / 1080) * 100)

        if (p.redCooldown <= 0) {
          p.isTimedOut = false
          p.energy = 100
          setIsOmnitrixRed(false)
          sfx.recharged()
          showToast('⚡ OMNITRIX ชาร์จเต็มแล้ว! พร้อมแปลงร่าง (สีเขียว)')
        }
      } else {
        if (p.form === 'ben') {
          p.energy = Math.min(p.maxEnergy, p.energy + 0.065)
        } else {
          p.energy = Math.max(0, p.energy - 0.055)

          if (p.energy <= 20 && p.animTick % 45 === 0) {
            sfx.timeoutWarning()
          }

          if (p.energy <= 0) {
            p.form = 'ben'
            p.isRolling = false
            p.isTimedOut = true
            p.redCooldown = 1080
            eng.redShockwave = 36
            setIsOmnitrixRed(true)
            sfx.redTimeout()
            showToast(
              '🚨 OMNITRIX TIMEOUT! นาฬิกาหมดเวลาและกลายเป็นสีแดง (รอรีชาร์จ 18 วินาที)!'
            )
          }
        }
      }

      // คลื่นโซนาร์ของ Wildmutt
      for (let i = p.sonarWaves.length - 1; i >= 0; i--) {
        const sw = p.sonarWaves[i]
        sw.r += 1.4
        sw.alpha -= 0.024
        if (sw.alpha <= 0) p.sonarWaves.splice(i, 1)
      }

      // การเดินและสกิลกลิ้งของตัวบอล (Cannonbolt) ความเร็ว 3.1 นุ่มนวล
      const moveSpeed = p.isRolling ? 3.1 : currentStats.speed
      if (eng.keys.left) {
        p.vx = -moveSpeed
        p.facing = -1
      } else if (eng.keys.right) {
        p.vx = moveSpeed
        p.facing = 1
      } else {
        if (p.isRolling) {
          p.vx *= 0.88
          if (Math.abs(p.vx) < 0.5) p.isRolling = false
        } else {
          p.vx *= 0.78
          if (Math.abs(p.vx) < 0.15) p.vx = 0
        }
      }

      if (eng.keys.up && p.grounded) {
        p.vy = -currentStats.jumpPower
        p.grounded = false
        sfx.jump()
      }

      let currentGravity = 0.21
      if (Math.abs(p.vy) < 1.5) {
        currentGravity = 0.11
      }
      p.vy += currentGravity
      if (p.vy > 6.2) p.vy = 6.2

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
          p.y + p.h <= plat.y + 22 &&
          p.vy >= 0
        ) {
          p.y = plat.y - p.h
          p.vy = 0
          p.grounded = true
        }
      }

      // ชนหินก้อนใหญ่
      for (const b of eng.boulders) {
        if (b.broken) continue
        if (
          p.x + p.w > b.x &&
          p.x < b.x + b.w &&
          p.y + p.h > b.y &&
          p.y < b.y + b.h
        ) {
          if (p.form === 'cannonbolt' && (p.isRolling || Math.abs(p.vx) > 1.8)) {
            b.broken = true
            p.score += 250
            sfx.smash()
            for (let i = 0; i < 12; i++) {
              eng.particles.push({
                x: b.x + b.w / 2,
                y: b.y + b.h / 2,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                life: 28,
                maxLife: 28,
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
        playerTakeDamage(35)
        p.x = Math.max(210, p.x - 240)
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
            playerTakeDamage(16)
            p.vy = -5
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
            p.energy = Math.min(p.maxEnergy, p.energy + 20)
          } else if (col.type === 'card') {
            p.score += 500
          } else if (col.type === 'smoothie') {
            p.hp = Math.min(p.maxHp, p.hp + 40)
          }
        }
      }

      // อัปเดตกระสุน
      for (let i = eng.projectiles.length - 1; i >= 0; i--) {
        const pr = eng.projectiles[i]
        pr.x += pr.vx
        pr.y += pr.vy

        // ???????????????????? ??.????????
        if (pr.type === 'mutagen_flask') {
          pr.vy += 0.22
          if (pr.y >= 435) {
            for (let k = 0; k < 12; k++) {
              eng.particles.push({
                x: pr.x,
                y: 435,
                vx: (Math.random() - 0.5) * 5,
                vy: -Math.random() * 3.5,
                life: 20,
                maxLife: 20,
                color: '#22c55e',
                size: 4 + Math.random() * 3,
              })
            }
            if (Math.abs(p.x - pr.x) < 45 && p.y > 360 && p.invulnerable <= 0) {
              playerTakeDamage(pr.damage || 20)
            }
            eng.projectiles.splice(i, 1)
            continue
          }
        }

        if (pr.life !== undefined) {
          pr.life--
          if (pr.life <= 0) {
            eng.projectiles.splice(i, 1)
            continue
          }
        }

        // ชนหิน
        if (pr.type === 'fireball' || pr.type === 'seed') {
          for (const b of eng.boulders) {
            if (b.broken) continue
            if (
              pr.x + (pr.r || 10) > b.x &&
              pr.x - (pr.r || 10) < b.x + b.w &&
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

        if (
          pr.x < eng.cameraX - 150 ||
          pr.x > eng.cameraX + 1150 ||
          pr.y > 600
        ) {
          eng.projectiles.splice(i, 1)
          continue
        }

        // ชนศัตรู
        for (const en of eng.enemies) {
          if (!en.alive) continue
          const hit =
            pr.r !== undefined
              ? pr.x + pr.r > en.x &&
                pr.x - pr.r < en.x + en.w &&
                pr.y + pr.r > en.y &&
                pr.y - pr.r < en.y + en.h
              : pr.x + pr.w > en.x &&
                pr.x < en.x + en.w &&
                pr.y + pr.h > en.y &&
                pr.y < en.y + en.h

          if (hit && pr.from === 'player') {
            en.hp -= pr.damage
            sfx.hurt()
            if (pr.type === 'fireball' || pr.type === 'seed') {
              eng.projectiles.splice(i, 1)
            }
            if (en.hp <= 0) {
              en.alive = false
              p.score += en.type === 'crawler' ? 200 : 250
              sfx.smash()
            }
            break
          }
        }

        // ชนบอสใหญ่ (มีระบบเกราะลดดาเมจและเปลี่ยน 3 เฟส)
        if (eng.boss && eng.boss.alive && pr.from === 'player') {
          const bs = eng.boss
          const hitBoss =
            pr.r !== undefined
              ? pr.x + pr.r > bs.x &&
                pr.x - pr.r < bs.x + bs.w &&
                pr.y > bs.y &&
                pr.y < bs.y + bs.h
              : pr.x + pr.w > bs.x &&
                pr.x < bs.x + bs.w &&
                pr.y + pr.h > bs.y &&
                pr.y < bs.y + bs.h
          if (hitBoss) {
            // หากเกราะพลังงานของบอสทำงาน จะลดดาเมจลง 80%
            const dmgMultiplier = bs.shieldTimer > 0 ? 0.2 : 0.85
            const actualDmg = Math.max(2, Math.round(pr.damage * dmgMultiplier))
            bs.hp -= actualDmg
            bs.hitFlash = 6
            sfx.hurt()

            if (pr.type === 'fireball' || pr.type === 'seed') {
              eng.projectiles.splice(i, 1)
            }

            // การเปลี่ยนเฟสของบอสแต่ละตัวตามด่านที่เล่น
            if (eng.currentStage === 1) {
              // Stage 1: ดร. แอนนีโม่ (1,800 HP) -> Phase 2 เมื่อเลือด <= 900
              if (bs.hp <= 900 && bs.phase === 1) {
                bs.phase = 2
                bs.shieldTimer = 160
                eng.screenShake = 20
                sfx.bossRoar()
                showToast(
                  '⚡ DR. ANIMO OVERLOAD: หมวก Transmodulator โอเวอร์คล็อก ปล่อยกระแสประสาทคลั่ง!'
                )
              }
            } else if (eng.currentStage === 2) {
              // Stage 2: เควิน 11 (2,600 HP) -> Phase 2 เมื่อเลือด <= 1,300
              if (bs.hp <= 1300 && bs.phase === 1) {
                bs.phase = 2
                bs.shieldTimer = 180
                eng.screenShake = 24
                sfx.bossRoar()
                showToast(
                  '🔥 KEVIN 11 FURY: พลังเอเลี่ยนผสมปะทุ! ระวังพายุคริสตัลและลูกไฟลาวา!'
                )
              }
            } else {
              // Stage 3: วิวแก๊กซ์ (3,800 HP) -> Phase 2 เมื่อ <= 2,400, Phase 3 เมื่อ <= 1,100
              if (bs.hp <= 2400 && bs.phase === 1) {
                bs.phase = 2
                bs.shieldTimer = 200
                eng.screenShake = 22
                sfx.bossRoar()
                showToast(
                  '🛡️ VILGAX CYBER BARRIER: เกราะไซบอร์กเปิดใช้งาน! ระวังการกวาดลำแสงเลเซอร์ทับทิม!'
                )
              } else if (bs.hp <= 1100 && bs.phase === 2) {
                bs.phase = 3
                bs.shieldTimer = 220
                eng.screenShake = 30
                sfx.bossRoar()
                showToast(
                  '🚀 VILGAX FINAL OVERDRIVE: "THE OMNITRIX IS MINE!" ระวังการยิงถล่มจากวงโคจร!'
                )
              }
            }

            if (bs.hp <= 0) {
              handleBossDefeated()
            }
          }
        }

        // กระสุนบอสชนตัวผู้เล่น
        if (pr.from === 'boss') {
          if (
            pr.x + (pr.r || 10) > p.x &&
            pr.x - (pr.r || 10) < p.x + p.w &&
            pr.y + (pr.r || 10) > p.y &&
            pr.y - (pr.r || 10) < p.y + p.h
          ) {
            if (p.invulnerable <= 0) {
              playerTakeDamage(pr.damage || 18)
              eng.projectiles.splice(i, 1)
            }
          }
        }
      }

      // อัปเดตอุกกาบาตลาวาของบอส (Phase 3 Meteor Shower)
      for (let i = eng.meteors.length - 1; i >= 0; i--) {
        const mt = eng.meteors[i]
        if (mt.warningTimer > 0) {
          mt.warningTimer--
        } else {
          mt.y += mt.vy
          mt.vy += 0.18
          // ชนผู้เล่น
          if (
            mt.x + mt.r > p.x &&
            mt.x - mt.r < p.x + p.w &&
            mt.y + mt.r > p.y &&
            mt.y - mt.r < p.y + p.h
          ) {
            if (p.invulnerable <= 0) {
              playerTakeDamage(24)
            }
            eng.meteors.splice(i, 1)
            continue
          }
          // ตกถึงพื้นระเบิดเป็นสะเก็ดไฟ
          if (mt.y >= 435) {
            sfx.smash()
            eng.screenShake = 6
            for (let k = 0; k < 10; k++) {
              eng.particles.push({
                x: mt.x,
                y: 432,
                vx: (Math.random() - 0.5) * 6,
                vy: -Math.random() * 5,
                life: 24,
                maxLife: 24,
                color: '#f97316',
                size: Math.random() * 5 + 3,
              })
            }
            eng.meteors.splice(i, 1)
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
          en.y = en.baseY + Math.sin(p.animTick * 0.045) * 14
          if (en.x <= en.minX || en.x + en.w >= en.maxX) en.vx *= -1
        }

        if (
          p.x + p.w > en.x &&
          p.x < en.x + en.w &&
          p.y + p.h > en.y &&
          p.y < en.y + en.h
        ) {
          if (p.form === 'cannonbolt' && (p.isRolling || Math.abs(p.vx) > 1.8)) {
            en.alive = false
            p.score += 250
            sfx.smash()
          } else if (p.invulnerable <= 0) {
            playerTakeDamage(15)
            p.vx = (p.x - en.x > 0 ? 1 : -1) * 4.2
            p.vy = -3.2
          }
        }
      }

      // ==========================================
      // 👹 AI บอสใหญ่สุดโหด 3 เฟส (Mutant Bio-Titan Overlord)
      // ==========================================
      if (eng.boss && eng.boss.alive) {
        const bs = eng.boss
        bs.attackTimer++
        if (bs.hitFlash > 0) bs.hitFlash--
        if (bs.shieldTimer > 0) bs.shieldTimer--

        // หันหน้าเข้าหาผู้เล่นเมื่อไม่ได้พุ่งชน
        if (bs.chargeState !== 'charging') {
          bs.facing = p.x < bs.x ? -1 : 1
        }

        // ระบบกระโดดทุบพื้นของบอส (Titan Jump Slam)
        if (bs.jumping) {
          bs.y += bs.vy
          bs.vy += 0.28
          if (bs.y >= bs.baseY) {
            bs.y = bs.baseY
            bs.vy = 0
            bs.jumping = false
            eng.screenShake = 18
            sfx.smash()
            // ปล่อยคลื่นกระแทกเลียดพื้นซ้าย-ขวา
            ;[-4.5, 4.5].forEach((svx) => {
              eng.projectiles.push({
                x: bs.x + bs.w / 2,
                y: 425,
                vx: svx,
                vy: 0,
                r: 16,
                damage: 24,
                color: '#ef4444',
                from: 'boss',
                type: 'shockwave',
              })
            })
          }
        }

        // ระบบชาร์จพุ่งชน (Berserk Bull Charge)
        if (bs.chargeState === 'windup') {
          bs.chargeTimer--
          if (bs.chargeTimer <= 0) {
            bs.chargeState = 'charging'
            bs.chargeTimer = 65
            bs.vx = bs.facing * (bs.phase === 3 ? 4.8 : 4.1)
            sfx.bossRoar()
          }
        } else if (bs.chargeState === 'charging') {
          bs.x += bs.vx
          bs.chargeTimer--
          // ทิ้งสะเก็ดไฟขณะพุ่งชน
          if (bs.chargeTimer % 4 === 0) {
            eng.particles.push({
              x: bs.x + bs.w / 2,
              y: bs.y + bs.h - 10,
              vx: -bs.vx * 0.4,
              vy: -Math.random() * 3,
              life: 18,
              maxLife: 18,
              color: '#f97316',
              size: 6,
            })
          }
          if (bs.x <= bs.minX) {
            bs.x = bs.minX
            bs.chargeState = 'idle'
            eng.screenShake = 12
            sfx.smash()
          } else if (bs.x + bs.w >= bs.maxX) {
            bs.x = bs.maxX - bs.w
            bs.chargeState = 'idle'
            eng.screenShake = 12
            sfx.smash()
          } else if (bs.chargeTimer <= 0) {
            bs.chargeState = 'idle'
          }
        } else {
          // เดินปกติในโซนบอส
          const patrolSpeed =
            bs.phase === 3 ? 1.15 : bs.phase === 2 ? 0.9 : 0.65
          bs.x += Math.sign(bs.vx || 1) * patrolSpeed
          if (bs.x <= bs.minX) bs.vx = patrolSpeed
          if (bs.x + bs.w >= bs.maxX) bs.vx = -patrolSpeed
        }

        // รูปแบบการโจมตีตามเฟส (ทำงานเมื่อผู้เล่นเข้ามาในระยะโซนบอส)
        // รูปแบบการโจมตีของบอสแต่ละด่าน (ดร.แอนนีโม่, เควิน 11, ลอร์ด วิวแก๊กซ์)
        if (Math.abs(p.x - bs.x) < 920) {
          const spawnX = bs.facing > 0 ? bs.x + bs.w : bs.x

          // 🧬 ด่าน 1: AI บอส ดร. แอนนีโม่ (Dr. Aloysius Animo)
          if (eng.currentStage === 1) {
            const beamInterval = bs.phase === 2 ? 80 : 120
            if (bs.attackTimer % beamInterval === 0 && bs.chargeState === 'idle') {
              const baseVx = bs.facing * (bs.phase === 2 ? 5.2 : 4.4)
              eng.projectiles.push({
                x: spawnX,
                y: bs.y + 35,
                vx: baseVx,
                vy: (Math.random() - 0.5) * 0.6,
                r: 12,
                damage: 18,
                color: '#84cc16',
                from: 'boss',
                type: 'animo_beam',
              })
              sfx.laser()
            }

            const flaskInterval = bs.phase === 2 ? 140 : 200
            if (bs.attackTimer % flaskInterval === 0 && bs.chargeState === 'idle') {
              const flaskCount = bs.phase === 2 ? 3 : 1
              for (let f = 0; f < flaskCount; f++) {
                const spreadVy = -4.5 - f * 0.8
                const spreadVx = bs.facing * (3.0 + f * 1.2)
                eng.projectiles.push({
                  x: spawnX,
                  y: bs.y + 30,
                  vx: spreadVx,
                  vy: spreadVy,
                  r: 10,
                  damage: 22,
                  color: '#22c55e',
                  from: 'boss',
                  type: 'mutagen_flask',
                })
              }
              sfx.beep(280, 'sawtooth', 0.15)
            }

            if (bs.phase === 2 && bs.attackTimer % 280 === 0 && bs.chargeState === 'idle') {
              bs.chargeState = 'windup'
              bs.chargeTimer = 45
              bs.facing = p.x < bs.x ? -1 : 1
              sfx.timeoutWarning()
            }

            if (bs.phase === 2 && bs.attackTimer % 440 === 0) {
              bs.shieldTimer = 140
              sfx.transform()
            }
          }

          // 💎 ด่าน 2: AI บอส เควิน 11 (Kevin Levin - Alien Amalgam)
          else if (eng.currentStage === 2) {
            const shardInterval = bs.phase === 2 ? 85 : 125
            if (bs.attackTimer % shardInterval === 0 && bs.chargeState === 'idle') {
              const baseVx = bs.facing * (bs.phase === 2 ? 5.4 : 4.6)
              const angles = bs.phase === 2 ? [-1.6, -0.8, 0, 0.8, 1.6] : [-1.0, 0, 1.0]
              angles.forEach((vy) => {
                eng.projectiles.push({
                  x: spawnX,
                  y: bs.y + 45,
                  vx: baseVx,
                  vy: vy,
                  r: 10,
                  damage: 20,
                  color: '#06b6d4',
                  from: 'boss',
                  type: 'crystal_shard',
                })
              })
              sfx.beep(420, 'triangle', 0.12)
            }

            if (bs.attackTimer % 180 === 0 && bs.chargeState === 'idle') {
              const baseVx = bs.facing * 4.8
              eng.projectiles.push({
                x: spawnX,
                y: bs.y + 50,
                vx: baseVx,
                vy: 0,
                r: 15,
                damage: 24,
                color: '#f97316',
                from: 'boss',
                type: 'heatblast_fire',
              })
              sfx.fireball()
            }

            if (bs.attackTimer % 230 === 0 && !bs.jumping && bs.chargeState === 'idle') {
              bs.jumping = true
              bs.vy = -8.5
              sfx.jump()
            }

            if (bs.phase === 2 && bs.attackTimer % 270 === 0 && bs.chargeState === 'idle') {
              bs.chargeState = 'windup'
              bs.chargeTimer = 45
              bs.facing = p.x < bs.x ? -1 : 1
              sfx.timeoutWarning()
            }

            if (bs.phase === 2 && bs.attackTimer % 420 === 0) {
              bs.shieldTimer = 150
              sfx.transform()
            }
          }

          // 👑 ด่าน 3: AI บอสใหญ่ ลอร์ด วิวแก๊กซ์ (Lord Vilgax)
          else {
            const laserInterval = bs.phase === 3 ? 75 : bs.phase === 2 ? 95 : 120
            if (bs.attackTimer % laserInterval === 0 && bs.chargeState === 'idle') {
              const baseVx = bs.facing * (bs.phase === 3 ? 6.2 : 5.2)
              ;[-0.5, 0.5].forEach((vy) => {
                eng.projectiles.push({
                  x: spawnX,
                  y: bs.y + 40,
                  vx: baseVx,
                  vy: vy,
                  r: 13,
                  damage: 25,
                  color: '#ef4444',
                  from: 'boss',
                  type: 'ruby_laser',
                })
              })
              sfx.laser()
            }

            if (bs.attackTimer % 210 === 0 && !bs.jumping && bs.chargeState === 'idle') {
              bs.jumping = true
              bs.vy = -8.2
              sfx.jump()
            }

            if (bs.attackTimer % 260 === 0 && bs.chargeState === 'idle' && !bs.jumping) {
              bs.chargeState = 'windup'
              bs.chargeTimer = 44
              bs.facing = p.x < bs.x ? -1 : 1
              sfx.timeoutWarning()
            }

            if (bs.phase >= 2 && bs.attackTimer % 360 === 0) {
              bs.shieldTimer = 160
              sfx.transform()
            }

            if (bs.phase === 3 && bs.attackTimer % 190 === 0) {
              sfx.bossRoar()
              for (let m = 0; m < 5; m++) {
                const targetX =
                  Math.max(3520, Math.min(4320, p.x + (m - 2) * 120))
                eng.meteors.push({
                  x: targetX,
                  y: -30 - m * 40,
                  vy: 3.5,
                  r: 18,
                  warningTimer: 42,
                })
              }
            }
          }
        }

        // บอสชนตัวผู้เล่นโดยตรง
        if (
          p.x + p.w > bs.x + 10 &&
          p.x < bs.x + bs.w - 10 &&
          p.y + p.h > bs.y + 10 &&
          p.y < bs.y + bs.h
        ) {
          if (p.form === 'cannonbolt' && p.isRolling && bs.shieldTimer <= 0) {
            bs.hp -= 25
            bs.hp -= 22
            bs.hitFlash = 6
            p.vx = -p.facing * 4.5
            p.vy = -4.0
            p.invulnerable = 25
            if (bs.hp <= 0) {
              handleBossDefeated()
            }
            sfx.smash()
          } else if (p.invulnerable <= 0) {
            const contactDmg = bs.chargeState === 'charging' ? 30 : 22
            playerTakeDamage(contactDmg)
            p.vx = (p.x < bs.x ? -1 : 1) * 5.5
            p.vy = -4.2
          }
        }
      }

      for (let i = eng.particles.length - 1; i >= 0; i--) {
        const pt = eng.particles[i]
        pt.x += pt.vx
        pt.y += pt.vy
        pt.life--
        if (pt.life <= 0) eng.particles.splice(i, 1)
      }

      const targetCamX = p.x - 300
      eng.cameraX += (targetCamX - eng.cameraX) * 0.08
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
      p.invulnerable = 55
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
          p.isRolling = false
          p.x = Math.max(210, p.x - 220)
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
    // 🎨 ฟังก์ชันวาดฉากด้วยพื้นหลังแท้ lossless_2022 & lossless_259 และบอส 3 เฟส
    // ==========================================
    const renderScene = () => {
      const eng = engineRef.current
      const cam = eng.cameraX
      const sp = spritesRef.current
      const currentTheme = bgThemeRef.current

      ctx.save()

      if (eng.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * eng.screenShake
        const shakeY = (Math.random() - 0.5) * eng.screenShake
        ctx.translate(shakeX, shakeY)
      }

      ctx.clearRect(0, 0, 960, 540)

      // 1. วาดฉากหลังจากภาพแท้ lossless_2022 (ซากเรือโบราณ) และ lossless_259 (ถ้ำลาวา)
      drawAuthenticSWFBackground(
        ctx,
        cam,
        sp,
        eng.currentStage || 1,
        eng.player.animTick
      )

      // 2. รถบ้าน The Rust Bucket ของปู่แม็กซ์ จอดที่จุดเริ่มต้น
      const rustX = 18 - cam
      if (rustX > -240 && rustX < 960) {
        drawRustBucketRV(ctx, rustX, 276)
      }

      // 3. แพลตฟอร์มพื้นดินหินและพื้นถ้ำลาวาของแท้
      for (const plat of eng.platforms) {
        const px = plat.x - cam
        if (px + plat.w < 0 || px > 960) continue

        const isVolcanicPlat =
          currentTheme === 'lava' ||
          (currentTheme === 'auto' && plat.x >= 1800)
        const stageNum = eng.currentStage || 1
        if (plat.type === 'ground') {
          ctx.save()
          ctx.beginPath()
          ctx.rect(px, plat.y - 12, plat.w, plat.h + 16)
          ctx.clip()

          if (stageNum === 3) {
            // พื้นไทเทเนียมไซไฟบนยานรบ Chimerian Hammer
            ctx.fillStyle = '#0f172a'
            ctx.fillRect(px, plat.y - 10, plat.w, plat.h + 20)
            ctx.fillStyle = '#1e293b'
            ctx.fillRect(px, plat.y + 16, plat.w, plat.h)

            ctx.strokeStyle = '#ef4444'
            ctx.lineWidth = 3
            ctx.shadowColor = '#ef4444'
            ctx.shadowBlur = 8
            ctx.beginPath()
            ctx.moveTo(px, plat.y - 10)
            ctx.lineTo(px + plat.w, plat.y - 10)
            ctx.stroke()
            ctx.shadowBlur = 0

            ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)'
            ctx.lineWidth = 1.5
            for (let tx = 0; tx < plat.w; tx += 30) {
              ctx.beginPath()
              ctx.moveTo(px + tx, plat.y - 8)
              ctx.lineTo(px + tx + 14, plat.y + 12)
              ctx.stroke()
            }
          } else if (stageNum === 2 && sp.volcanicGround && sp.volcanicWall) {
            const vTileW = 100
            for (let tx = 0; tx < plat.w; tx += vTileW) {
              ctx.drawImage(sp.volcanicWall, px + tx, plat.y + 30, vTileW, 80)
              ctx.drawImage(sp.volcanicGround, px + tx, plat.y - 10, vTileW, 44)
            }
          } else {
            const tileW = 420
            if (sp.stoneWall) {
              for (let tx = 0; tx < plat.w; tx += tileW) {
                ctx.drawImage(sp.stoneWall, px + tx, plat.y + 34, tileW, 74)
              }
            } else {
              ctx.fillStyle = '#3f4726'
              ctx.fillRect(px, plat.y + 34, plat.w, 74)
            }

            if (sp.rockGround) {
              for (let tx = 0; tx < plat.w; tx += tileW) {
                ctx.drawImage(sp.rockGround, px + tx, plat.y - 10, tileW, 48)
              }
            } else {
              ctx.fillStyle = '#d4b46a'
              ctx.fillRect(px, plat.y - 10, plat.w, 48)
            }
          }

          ctx.strokeStyle = stageNum === 3 ? '#ef4444' : '#1c1917'
          ctx.lineWidth = 2.5
          ctx.beginPath()
          ctx.moveTo(px, plat.y - 10)
          ctx.lineTo(px + plat.w, plat.y - 10)
          ctx.stroke()
          ctx.restore()
        } else if (plat.type === 'rock') {
          const isCyber = stageNum === 3
          const isLava = stageNum === 2
          ctx.fillStyle = isCyber ? '#1e293b' : isLava ? '#7c2d12' : '#78716c'
          ctx.strokeStyle = isCyber ? '#ef4444' : '#1c1917'
          ctx.lineWidth = 2.5
          ctx.beginPath()
          ctx.roundRect(px, plat.y, plat.w, plat.h, 6)
          ctx.fill()
          ctx.stroke()

          ctx.fillStyle = isCyber ? '#ef4444' : isLava ? '#f97316' : '#d6d3d1'
          ctx.fillRect(px + 4, plat.y + 2, plat.w - 8, 4)
                } else if (plat.type === 'wood') {
          ctx.fillStyle = '#92400e'
          ctx.strokeStyle = '#271705'
          ctx.lineWidth = 2.5
          ctx.beginPath()
          ctx.roundRect(px, plat.y, plat.w, plat.h, 4)
          ctx.fill()
          ctx.stroke()
        }
      }

      // 4. บ่อกรด / บ่อลาวา / กับดักหนาม
      for (const hz of eng.hazards) {
        const hx = hz.x - cam
        if (hx + hz.w < 0 || hx > 960) continue
        const isLavaPit =
          currentTheme === 'lava' || (currentTheme === 'auto' && hz.x >= 1700)
        if (hz.type === 'acid') {
          ctx.fillStyle = isLavaPit ? '#dc2626' : '#65a30d'
          ctx.fillRect(hx, hz.y, hz.w, hz.h)
          ctx.fillStyle = isLavaPit ? '#f97316' : '#a3e635'
          ctx.fillRect(hx, hz.y, hz.w, 8)
          ctx.fillStyle = isLavaPit ? '#fde047' : '#d9f99d'
          const bubbleY = hz.y + 12 + Math.sin(eng.player.animTick * 0.05) * 4
          ctx.beginPath()
          ctx.arc(hx + hz.w * 0.3, bubbleY, 5, 0, Math.PI * 2)
          ctx.arc(hx + hz.w * 0.7, bubbleY - 2, 7, 0, Math.PI * 2)
          ctx.fill()
        } else if (hz.type === 'spikes') {
          ctx.fillStyle = '#991b1b'
          ctx.strokeStyle = '#18181b'
          ctx.lineWidth = 1.5
          for (let s = 0; s < hz.w; s += 15) {
            ctx.beginPath()
            ctx.moveTo(hx + s, hz.y + hz.h)
            ctx.lineTo(hx + s + 7, hz.y)
            ctx.lineTo(hx + s + 15, hz.y + hz.h)
            ctx.closePath()
            ctx.fill()
            ctx.stroke()
          }
        }
      }

      // 5. กองหินพังทลายได้ของแท้ (clean_boulder.png)
      for (const b of eng.boulders) {
        if (b.broken) continue
        const bx = b.x - cam
        if (bx + b.w < 0 || bx > 960) continue
        if (sp.boulderSprite) {
          ctx.drawImage(sp.boulderSprite, bx - 6, b.y - 6, b.w + 12, b.h + 12)
        } else {
          ctx.fillStyle = '#78716c'
          ctx.beginPath()
          ctx.roundRect(bx, b.y, b.w, b.h, 12)
          ctx.fill()
        }
      }

      // 6. ไอเทมเก็บสะสม
      for (const col of eng.collectibles) {
        if (col.taken) continue
        const cx = col.x - cam
        if (cx < -20 || cx > 980) continue
        const bob = Math.sin(eng.player.animTick * 0.05 + col.x) * 4

        if (col.type === 'dna') {
          ctx.shadowColor = '#22c55e'
          ctx.shadowBlur = 12
          ctx.fillStyle = '#22c55e'
          ctx.strokeStyle = '#052e16'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(cx, col.y + bob, 13, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
          ctx.fillStyle = '#ffffff'
          ctx.beginPath()
          ctx.arc(cx, col.y + bob, 5, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
        } else if (col.type === 'card') {
          ctx.fillStyle = '#f59e0b'
          ctx.strokeStyle = '#451a03'
          ctx.lineWidth = 2
          ctx.fillRect(cx - 10, col.y + bob - 14, 20, 28)
          ctx.strokeRect(cx - 10, col.y + bob - 14, 20, 28)
          ctx.fillStyle = '#78350f'
          ctx.fillRect(cx - 6, col.y + bob - 9, 12, 16)
        } else if (col.type === 'smoothie') {
          ctx.fillStyle = '#10b981'
          ctx.strokeStyle = '#064e3b'
          ctx.lineWidth = 2
          ctx.fillRect(cx - 8, col.y + bob - 10, 16, 20)
          ctx.strokeRect(cx - 8, col.y + bob - 10, 16, 20)
          ctx.fillStyle = '#f43f5e'
          ctx.fillRect(cx - 2, col.y + bob - 16, 4, 8)
        }
      }

      // 7. มอนสเตอร์ศัตรู
      for (const en of eng.enemies) {
        if (!en.alive) continue
        const ex = en.x - cam
        if (ex < -60 || ex > 1020) continue

        if (en.type === 'crawler') {
          const stepBob = Math.sin(eng.player.animTick * 0.1 + en.id) * 2
          ctx.fillStyle = '#15803d'
          ctx.strokeStyle = '#052e16'
          ctx.lineWidth = 2.5
          ctx.beginPath()
          ctx.roundRect(ex, en.y + stepBob, en.w, en.h - stepBob, 10)
          ctx.fill()
          ctx.stroke()
          ctx.fillStyle = '#dc2626'
          ctx.fillRect(ex + 6, en.y + 12 + stepBob, en.w - 12, 10)
          ctx.fillStyle = '#facc15'
          ctx.beginPath()
          ctx.arc(
            ex + (en.vx > 0 ? en.w - 10 : 10),
            en.y + 8 + stepBob,
            4,
            0,
            Math.PI * 2
          )
          ctx.fill()
        } else if (en.type === 'flyer') {
          ctx.fillStyle = '#854d0e'
          ctx.strokeStyle = '#271503'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.ellipse(ex + 18, en.y + 15, 18, 14, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)'
          const wingSpread = Math.sin(eng.player.animTick * 0.14) * 9
          ctx.beginPath()
          ctx.ellipse(
            ex + 18,
            en.y + 4,
            19,
            5 + Math.abs(wingSpread),
            0,
            0,
            Math.PI * 2
          )
          ctx.fill()
        }
      }

      // 8. วาดบอสประจำด่าน (Stage 1: Dr. Animo, Stage 2: Kevin 11, Stage 3: Lord Vilgax)
      if (eng.boss && eng.boss.alive) {
        if (eng.currentStage === 1) {
          drawDrAnimo(ctx, eng.boss, cam, eng.player.animTick, sp)
        } else if (eng.currentStage === 2) {
          drawKevin11(ctx, eng.boss, cam, eng.player.animTick, sp)
        } else {
          drawVilgax(ctx, eng.boss, cam, eng.player.animTick, sp)
        }
      }

      // 9. วาดอุกกาบาตลาวาและเป้าเตือนสีแดงบนพื้น (Phase 3 Meteor Shower)
      for (const mt of eng.meteors) {
        const mx = mt.x - cam
        if (mt.warningTimer > 0) {
          // วงกลมเป้าเตือนบนพื้นและเส้นเล็งแนวตั้ง
          ctx.save()
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)'
          ctx.fillStyle = 'rgba(239, 68, 68, 0.25)'
          ctx.lineWidth = 2.5
          ctx.beginPath()
          ctx.ellipse(mx, 434, 26, 8, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()

          ctx.setLineDash([6, 6])
          ctx.beginPath()
          ctx.moveTo(mx, 0)
          ctx.lineTo(mx, 434)
          ctx.stroke()
          ctx.restore()
        } else {
          ctx.save()
          ctx.shadowColor = '#ef4444'
          ctx.shadowBlur = 18
          ctx.fillStyle = '#dc2626'
          ctx.beginPath()
          ctx.arc(mx, mt.y, mt.r, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#fde047'
          ctx.beginPath()
          ctx.arc(mx, mt.y - 3, mt.r * 0.55, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      }

      // 10. กระสุน / พลังพิเศษ
      for (const pr of eng.projectiles) {
        const prx = pr.x - cam
        if (pr.type === 'fireball') {
          ctx.shadowColor = '#f97316'
          ctx.shadowBlur = 16
          ctx.fillStyle = '#f97316'
          ctx.beginPath()
          ctx.arc(prx, pr.y, pr.r, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#fef08a'
          ctx.beginPath()
          ctx.arc(prx, pr.y, pr.r * 0.5, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
        } else if (pr.type === 'seed') {
          ctx.fillStyle = '#22c55e'
          ctx.strokeStyle = '#052e16'
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.arc(prx, pr.y, pr.r, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
          ctx.fillStyle = '#86efac'
          ctx.beginPath()
          ctx.arc(prx, pr.y, pr.r * 0.45, 0, Math.PI * 2)
          ctx.fill()
        } else if (pr.type === 'punch') {
          ctx.strokeStyle = '#4ade80'
          ctx.lineWidth = 4
          ctx.beginPath()
          ctx.arc(prx + 10, pr.y + 12, 16, -Math.PI * 0.4, Math.PI * 0.4)
          ctx.stroke()
        } else if (pr.type === 'claw') {
          ctx.strokeStyle = '#f97316'
          ctx.lineWidth = 3.5
          ctx.beginPath()
          ctx.moveTo(prx + 4, pr.y + 2)
          ctx.lineTo(prx + 28, pr.y + 18)
          ctx.moveTo(prx + 4, pr.y + 12)
          ctx.lineTo(prx + 28, pr.y + 28)
          ctx.stroke()
        } else if (pr.type === 'animo_beam') {
          ctx.save()
          ctx.shadowColor = '#84cc16'
          ctx.shadowBlur = 14
          ctx.strokeStyle = '#a3e635'
          ctx.lineWidth = 4
          ctx.beginPath()
          ctx.moveTo(prx, pr.y)
          ctx.lineTo(prx - pr.vx * 3.5, pr.y - (pr.vy || 0) * 3.5)
          ctx.stroke()
          ctx.fillStyle = '#ffffff'
          ctx.beginPath()
          ctx.arc(prx, pr.y, 4, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        } else if (pr.type === 'mutagen_flask') {
          ctx.save()
          ctx.fillStyle = '#22c55e'
          ctx.strokeStyle = '#ffffff'
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.arc(prx, pr.y, 9, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
          ctx.fillStyle = '#cbd5e1'
          ctx.fillRect(prx - 3, pr.y - 13, 6, 4)
          ctx.restore()
        } else if (pr.type === 'crystal_shard') {
          ctx.save()
          ctx.shadowColor = '#06b6d4'
          ctx.shadowBlur = 12
          ctx.fillStyle = '#67e8f9'
          ctx.strokeStyle = '#0891b2'
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.moveTo(prx + 12, pr.y)
          ctx.lineTo(prx - 8, pr.y - 6)
          ctx.lineTo(prx - 14, pr.y)
          ctx.lineTo(prx - 8, pr.y + 6)
          ctx.closePath()
          ctx.fill()
          ctx.stroke()
          ctx.restore()
        } else if (pr.type === 'ruby_laser') {
          ctx.save()
          ctx.shadowColor = '#ef4444'
          ctx.shadowBlur = 16
          ctx.strokeStyle = '#ef4444'
          ctx.lineWidth = 5
          ctx.beginPath()
          ctx.moveTo(prx, pr.y)
          ctx.lineTo(prx - pr.vx * 4, pr.y)
          ctx.stroke()
          ctx.strokeStyle = '#fef08a'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(prx, pr.y)
          ctx.lineTo(prx - pr.vx * 3, pr.y)
          ctx.stroke()
          ctx.restore()
        } else if (pr.type === 'thorn' || pr.type === 'shockwave') {
          ctx.save()
          ctx.shadowColor = pr.color
          ctx.shadowBlur = 12
          ctx.fillStyle = pr.color
          ctx.strokeStyle = '#09090b'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(prx, pr.y, pr.r, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
          ctx.fillStyle = '#fef08a'
          ctx.beginPath()
          ctx.arc(prx, pr.y, pr.r * 0.4, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      }

      // 11. วาดตัวผู้เล่นด้วย Sprite แท้ที่คลีนแล้ว
      const p = eng.player
      const px = p.x - cam
      const isMoving = Math.abs(p.vx) > 0.2 && p.grounded
      const walkBob = isMoving
        ? Math.sin(p.animTick * 0.14) * 2.2
        : Math.sin(p.animTick * 0.05) * 1.0
      const walkStepFrame = Math.floor(p.animTick / 14) % 2 === 1

      if (p.form === 'wildmutt') {
        p.sonarWaves.forEach((sw) => {
          ctx.strokeStyle = `rgba(74, 222, 128, ${sw.alpha})`
          ctx.lineWidth = 2.5
          ctx.beginPath()
          ctx.arc(
            px + (p.facing > 0 ? 52 : -12),
            p.y + 22,
            sw.r,
            0,
            Math.PI * 2
          )
          ctx.stroke()
        })
      }

      if (p.invulnerable % 8 < 4) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.32)'
        ctx.beginPath()
        ctx.ellipse(px + 21, p.y + p.h - 2, 18, 5, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.save()
        ctx.translate(px + 21, p.y + 30 + walkBob)
        ctx.scale(p.facing, 1)

        if (p.form === 'ben') {
          let benImg = sp.benStand
          if (p.isAttacking && sp.benPunch) {
            benImg = sp.benPunch
          } else if (!p.grounded && sp.benJump) {
            benImg = sp.benJump
          } else if (isMoving && walkStepFrame && sp.benWalk) {
            benImg = sp.benWalk
          }

          if (benImg) {
            ctx.drawImage(benImg, -24, -32, 48, 62)
          }
        } else if (p.form === 'heatblast') {
          let hbImg = sp.heatblastStand
          if (p.isAttacking && sp.heatblastBlast) {
            hbImg = sp.heatblastBlast
          }
          if (isMoving && !p.isAttacking) {
            ctx.rotate(Math.sin(p.animTick * 0.12) * 0.04)
          }
          if (hbImg) {
            ctx.drawImage(hbImg, -30, -36, 60, 68)
          }
        } else if (p.form === 'cannonbolt') {
          if (p.isRolling && sp.cannonboltBall) {
            ctx.rotate(p.animTick * 0.05)
            ctx.drawImage(sp.cannonboltBall, -27, -27, 54, 54)
          } else if (sp.cannonboltStand) {
            if (isMoving) {
              ctx.rotate(Math.sin(p.animTick * 0.11) * 0.04)
            }
            ctx.drawImage(sp.cannonboltStand, -34, -35, 68, 68)
          }
        } else if (p.form === 'wildvine') {
          if (isMoving) {
            ctx.rotate(Math.sin(p.animTick * 0.12) * 0.045)
          }
          if (sp.wildvine) {
            ctx.drawImage(sp.wildvine, -28, -36, 56, 68)
          }
        } else if (p.form === 'wildmutt') {
          if (isMoving) {
            ctx.rotate(Math.sin(p.animTick * 0.13) * 0.05)
          }
          if (sp.wildmutt) {
            ctx.drawImage(sp.wildmutt, -34, -26, 68, 56)
          }
        }

        ctx.restore()
      }

      // 12. อนุภาคเอฟเฟกต์
      for (const pt of eng.particles) {
        const ptx = pt.x - cam
        ctx.fillStyle = pt.color
        ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife)
        ctx.beginPath()
        ctx.arc(ptx, pt.y, pt.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // 13. แถบเลือดบอสใหญ่ด้านบนหน้าจอเมื่อเข้าสู่โซนบอส (Boss Health HUD Bar)
      if (eng.boss && eng.boss.alive && p.x > 3150) {
        const bs = eng.boss
        ctx.save()
        const barW = 460
        const barH = 22
        const barX = (960 - barW) / 2
        const barY = 18

        ctx.fillStyle = 'rgba(9, 9, 11, 0.88)'
        ctx.strokeStyle =
          bs.phase === 3
            ? '#ef4444'
            : bs.phase === 2
            ? '#f97316'
            : '#22c55e'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.roundRect(barX - 8, barY - 6, barW + 16, barH + 30, 12)
        ctx.fill()
        ctx.stroke()

        const hpRatio = Math.max(0, bs.hp / bs.maxHp)
        const fillGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0)
        if (bs.phase === 3) {
          fillGrad.addColorStop(0, '#991b1b')
          fillGrad.addColorStop(1, '#ef4444')
        } else if (bs.phase === 2) {
          fillGrad.addColorStop(0, '#c2410c')
          fillGrad.addColorStop(1, '#facc15')
        } else {
          fillGrad.addColorStop(0, '#15803d')
          fillGrad.addColorStop(1, '#84cc16')
        }

        ctx.fillStyle = '#27272a'
        ctx.fillRect(barX, barY + 16, barW, barH - 4)
        ctx.fillStyle = fillGrad
        ctx.fillRect(barX, barY + 16, barW * hpRatio, barH - 4)

        ctx.fillStyle = '#ffffff'
        ctx.font = '900 12px sans-serif'
        ctx.textAlign = 'center'
        const phaseTitle =
          eng.currentStage === 1
            ? bs.phase === 2
              ? '⚡ PHASE 2: TRANSMODULATOR OVERLOAD'
              : '🧪 PHASE 1: MUTAGENIC SCIENTIST'
            : eng.currentStage === 2
            ? bs.phase === 2
              ? '🔥 PHASE 2: QUAD-ALIEN FUSION'
              : '💎 PHASE 1: THE MUTANT AMALGAM'
            : bs.phase === 3
            ? '🚀 PHASE 3: ORBITAL ANNIHILATION'
            : bs.phase === 2
            ? '🛡️ PHASE 2: CYBER FORCEFIELD'
            : '💀 PHASE 1: CHIMERA SUI GENERIS'
        ctx.fillText(
          `${bs.nameTh || bs.name} [${phaseTitle}] — ${Math.round(bs.hp)} / ${bs.maxHp} HP`,
          480,
          barY + 10
        )
        ctx.restore()
      }

      // 14. ระเบิดแสงสีแดงเมื่อ Omnitrix หมดเวลา (Red Timeout Flash)
      if (eng.redShockwave > 0) {
        ctx.save()
        ctx.fillStyle = `rgba(239, 68, 68, ${(eng.redShockwave / 36) * 0.45})`
        ctx.fillRect(0, 0, 960, 540)
        ctx.restore()
      }

      // 15. ป้ายลูกศร "GO!" ตอนเริ่มเกม
      if (eng.goBannerTick > 0) {
        ctx.save()
        const alpha = Math.min(1, eng.goBannerTick / 25)
        ctx.globalAlpha = alpha
        ctx.translate(420, 175)

        ctx.fillStyle = '#000000'
        ctx.beginPath()
        ctx.moveTo(65, 16)
        ctx.lineTo(245, 16)
        ctx.lineTo(272, 52)
        ctx.lineTo(245, 88)
        ctx.lineTo(65, 88)
        ctx.lineTo(45, 52)
        ctx.closePath()
        ctx.fill()

        ctx.fillStyle = '#9aa822'
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(60, 10)
        ctx.lineTo(238, 10)
        ctx.lineTo(264, 45)
        ctx.lineTo(238, 80)
        ctx.lineTo(60, 80)
        ctx.lineTo(40, 45)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        ctx.font = "900 italic 64px 'Impact', 'Arial Black', sans-serif"
        ctx.fillStyle = '#ffffff'
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 10
        ctx.strokeText('GO!', -35, 64)
        ctx.fillText('GO!', -35, 64)
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
      {/* Toast แจ้งเตือนสถานะ Omnitrix & บอส */}
      {warningToast && (
        <div className="fixed top-20 z-50 px-5 py-3 rounded-2xl bg-black/90 border-2 border-red-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(239,68,68,0.7)] flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-200">
          <AlertTriangle className="w-5 h-5 text-red-500 animate-bounce" />
          <span>{warningToast}</span>
        </div>
      )}

      {/* 🏁 หน้าจอที่ 1: เมนูหลัก */}
      {screen === 'menu' && (
        <div className="w-full max-w-4xl bg-gradient-to-b from-gray-900 via-emerald-950 to-black rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-green-500/50 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-green-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <div
            onClick={startGame}
            title="คลิกเพื่อเริ่มเกม!"
            className="relative mb-6 group cursor-pointer"
          >
            <img
              src="/ben10/clean_title_nobtn.png"
              alt="Ben 10 Savage Pursuit"
              className="max-h-72 object-contain rounded-2xl shadow-2xl border-2 border-green-400/50 hover:scale-[1.02] transition duration-300"
            />
            <div className="absolute inset-0 bg-green-500/5 rounded-2xl pointer-events-none" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-900/60 border border-green-400/60 text-green-300 text-xs sm:text-sm font-semibold mb-4 tracking-wide">
            <Sparkles className="w-4 h-4 text-green-400" />
            OMNITRIX CLASSIC FLASH GAME RETRO REMAKE
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-lime-300 to-emerald-400 tracking-wider mb-3 drop-shadow-md">
            BEN 10: SAVAGE PURSUIT
          </h1>
          <p className="text-gray-300 max-w-xl text-sm sm:text-base leading-relaxed mb-6">
            สวมบทบาทเป็น <strong>Ben Tennyson</strong> พร้อมฉากหลังแท้จากเกม
            (หุบเขาซากเรือโบราณ & ถ้ำลาวานรก) และปะทะบอสใหญ่{' '}
            สวมบทบาทเป็น <strong>Ben Tennyson</strong> พร้อมระบบนาฬิกา Omnitrix ของแท้
            ผจญภัยผ่าน 3 ด่านมหากาพย์ (หุบเขาซากเรือ, ถ้ำลาวา, ยานรบ Chimerian Hammer)
            และปะทะ 3 บอสตัวจริง: <strong>ดร. แอนนีโม่, เควิน 11</strong> และศึกชี้ชะตากับ <strong>ลอร์ด วิวแก๊กซ์!</strong>
          </p>

          {/* เลือกด่านการผจญภัย (3 UNIQUE STAGES SELECT) */}
          <div className="w-full max-w-2xl mb-7">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Swords className="w-4 h-4 text-green-400" />
              <span className="text-xs sm:text-sm font-black text-green-300 uppercase tracking-widest">
                เลือกด่านการผจญภัย (SELECT MISSION STAGE)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* ด่าน 1 */}
              <div
                onClick={() => startStage(1)}
                className="group relative bg-gradient-to-b from-gray-900/90 to-black border-2 border-emerald-500/50 hover:border-emerald-400 rounded-2xl p-3.5 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              >
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/40">
                  STAGE 1
                </div>
                <div className="w-20 h-20 my-2 flex items-center justify-center">
                  <img
                    src="/ben10/sprites/boss_animo.png"
                    alt="Dr. Animo"
                    className="max-h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform"
                  />
                </div>
                <h3 className="text-sm font-black text-emerald-300">ดร. แอนนีโม่</h3>
                <span className="text-[10px] text-gray-400 font-semibold">Dr. Aloysius Animo</span>
                <p className="text-[11px] text-gray-300 mt-1">
                  หุบเขาดึกดำบรรพ์ & ซากเรือ (1,800 HP)
                </p>
                <span className="mt-2.5 px-3 py-1 rounded-lg bg-emerald-600/30 group-hover:bg-emerald-500 group-hover:text-black text-emerald-300 text-[11px] font-bold transition">
                  เริ่มด่าน 1 ▶
                </span>
              </div>

              {/* ด่าน 2 */}
              <div
                onClick={() => startStage(2)}
                className="group relative bg-gradient-to-b from-gray-900/90 to-black border-2 border-orange-500/50 hover:border-orange-400 rounded-2xl p-3.5 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]"
              >
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-orange-950 text-orange-300 text-[10px] font-mono font-bold border border-orange-500/40">
                  STAGE 2
                </div>
                <div className="w-20 h-20 my-2 flex items-center justify-center">
                  <img
                    src="/ben10/sprites/boss_kevin11.png"
                    alt="Kevin 11"
                    className="max-h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform"
                  />
                </div>
                <h3 className="text-sm font-black text-orange-400">เควิน 11</h3>
                <span className="text-[10px] text-gray-400 font-semibold">Kevin Levin (Amalgam)</span>
                <p className="text-[11px] text-gray-300 mt-1">
                  ถ้ำลาวาภูเขาไฟเดือด (2,600 HP)
                </p>
                <span className="mt-2.5 px-3 py-1 rounded-lg bg-orange-600/30 group-hover:bg-orange-500 group-hover:text-black text-orange-300 text-[11px] font-bold transition">
                  เริ่มด่าน 2 ▶
                </span>
              </div>

              {/* ด่าน 3 */}
              <div
                onClick={() => startStage(3)}
                className="group relative bg-gradient-to-b from-gray-900/90 to-black border-2 border-red-500/50 hover:border-red-400 rounded-2xl p-3.5 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
              >
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-red-950 text-red-300 text-[10px] font-mono font-bold border border-red-500/40">
                  STAGE 3
                </div>
                <div className="w-20 h-20 my-2 flex items-center justify-center">
                  <img
                    src="/ben10/sprites/boss_vilgax.png"
                    alt="Lord Vilgax"
                    className="max-h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform"
                  />
                </div>
                <h3 className="text-sm font-black text-red-400">ลอร์ด วิวแก๊กซ์</h3>
                <span className="text-[10px] text-gray-400 font-semibold">Lord Vilgax (Warlord)</span>
                <p className="text-[11px] text-gray-300 mt-1">
                  ยานพิฆาต Chimerian Hammer (3,800 HP)
                </p>
                <span className="mt-2.5 px-3 py-1 rounded-lg bg-red-600/30 group-hover:bg-red-500 group-hover:text-black text-red-300 text-[11px] font-bold transition">
                  เริ่มด่าน 3 ▶
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 w-full max-w-lg mb-8">
            <SavagePursuitButton
              label="PLAY"
              sublabel="เริ่มการผจญภัย"
              size="lg"
              onClick={startGame}
            />

            <SavagePursuitButton
              label="HELP"
              sublabel="วิธีเล่น & แปลงร่าง"
              size="md"
              onClick={() => {
                setInstructionPage(1)
                setScreen('instructions')
              }}
            />
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
              คู่มือการเล่น (INSTRUCTIONS {instructionPage}/2)
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
              src={
                instructionPage === 1
                  ? '/ben10/clean_instructions_nobtn.png'
                  : '/ben10/clean_instructions2_nobtn.png'
              }
              alt={`Instructions Panel ${instructionPage}`}
              className="max-h-80 object-contain rounded-2xl border-2 border-green-500/40 shadow-xl"
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
                  : เดินซ้าย / เดินขวา (ความเร็วนุ่มนวล)
                </li>
                <li>
                  <kbd className="px-2 py-1 bg-gray-700 rounded text-green-300 font-mono">
                    ▲
                  </kbd>{' '}
                  หรือ{' '}
                  <kbd className="px-2 py-1 bg-gray-700 rounded text-green-300 font-mono">
                    W
                  </kbd>{' '}
                  : กระโดดขึ้นแท่นหินหลบการพุ่งชนของบอส
                </li>
                <li>
                  <kbd className="px-2 py-1 bg-gray-700 rounded text-green-300 font-mono">
                    Spacebar
                  </kbd>{' '}
                  หรือ{' '}
                  <kbd className="px-2 py-1 bg-gray-700 rounded text-green-300 font-mono">
                    X
                  </kbd>{' '}
                  : ปล่อยท่าพิเศษของแต่ละตัว
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
              <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                บอสใหญ่ 3 เฟส & OMNITRIX TIMEOUT (18 วินาที)
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-3">
                เมื่อพลังงานหมดเป็น 0 นาฬิกาจะกลายเป็น <strong>สีแดง</strong> นาน 18 วินาที!
                และบอสใหญ่ <strong>Bio-Titan Overlord (2,500 HP)</strong> มี 3 เฟส:
                ยิงลูกไฟกระจาย, กระโดดทุบพื้น, กางเกราะสะท้อน, พุ่งชนความเร็วสูง
                และเรียกฝนอุกกาบาตลาวา!
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-orange-950/60 border border-orange-500/40 text-orange-200">
                  <strong>Heatblast:</strong> ยิงลูกไฟโจมตีบอสระยะไกล
                </div>
                <div className="p-2 rounded bg-yellow-950/60 border border-yellow-500/40 text-yellow-200">
                  <strong>Cannonbolt:</strong> กลิ้งชนหินและมอนสเตอร์
                </div>
                <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-200">
                  <strong>Wildvine:</strong> ปาเมล็ดพันธุ์ระเบิด 3 ลูก
                </div>
                <div className="p-2 rounded bg-amber-950/60 border border-amber-500/40 text-amber-200">
                  <strong>Wildmutt:</strong> กระโดดสูงหลบท่าพุ่งชนของบอส
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-2">
            {instructionPage === 1 ? (
              <SavagePursuitButton
                label="NEXT"
                sublabel="ดูความสามารถเอเลี่ยน (หน้า 2)"
                size="lg"
                onClick={() => {
                  sfx.beep(520, 'sine', 0.08)
                  setInstructionPage(2)
                }}
              />
            ) : (
              <SavagePursuitButton
                label="PLAY"
                sublabel="เริ่มเกมทันที"
                size="lg"
                onClick={startGame}
              />
            )}
            <SavagePursuitButton
              label="BACK"
              sublabel={instructionPage === 2 ? 'ย้อนกลับหน้า 1' : 'กลับหน้าเมนู'}
              size="md"
              onClick={() => {
                sfx.beep(380, 'sine', 0.08)
                if (instructionPage === 2) setInstructionPage(1)
                else setScreen('menu')
              }}
            />
          </div>
        </div>
      )}

      {/* 🎮 หน้าจอที่ 3: Canvas Gameplay & Authentic HUD */}
      {screen === 'playing' && (
        <div className="w-full max-w-5xl flex flex-col items-center select-none">
          {/* HUD ด้านบน */}
          <div className="w-full bg-gradient-to-r from-gray-900 via-black to-gray-900 border-2 border-green-500/80 rounded-t-2xl px-4 py-2.5 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3">
              {/* หน้าปัด Omnitrix */}
              <button
                onClick={() => {
                  if (isOmnitrixRed) {
                    sfx.lockedBuzz()
                    showToast('⚠️ OMNITRIX TIMEOUT! นาฬิกากำลังระบายความร้อน (โหมดสีแดง)')
                  } else {
                    sfx.beep(520, 'sine', 0.08)
                    setIsDialOpen(!isDialOpen)
                    engineRef.current.dialModalOpen = !isDialOpen
                  }
                }}
                title={
                  isOmnitrixRed
                    ? 'นาฬิกาติดคูลดาวน์สีแดง! รอระบายความร้อน'
                    : 'คลิกเพื่อเปิดหน้าปัด Omnitrix แปลงร่าง (กด Z)'
                }
                className={`relative group p-1.5 rounded-xl transition duration-300 cursor-pointer ${
                  isOmnitrixRed
                    ? 'bg-gradient-to-br from-red-600 to-rose-900 shadow-[0_0_20px_rgba(239,68,68,0.9)] animate-pulse'
                    : 'bg-gradient-to-br from-green-500 to-emerald-700 shadow-[0_0_15px_rgba(34,197,94,0.6)] hover:scale-110'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg bg-black border-2 flex items-center justify-center ${
                    isOmnitrixRed ? 'border-red-500' : 'border-green-400'
                  }`}
                >
                  <span
                    className={`font-black text-lg tracking-tighter ${
                      isOmnitrixRed ? 'text-red-500' : 'text-green-400'
                    }`}
                  >
                    {isOmnitrixRed ? '!' : hudLives}
                  </span>
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 px-1 rounded text-[9px] font-bold border ${
                    isOmnitrixRed
                      ? 'bg-red-950 text-red-300 border-red-500'
                      : 'bg-black text-green-300 border-green-500'
                  }`}
                >
                  {isOmnitrixRed ? `${redCooldownSec}s` : `x${hudLives}`}
                </div>
              </button>

              <div className="flex flex-col gap-1 w-36 sm:w-48">
                {/* หลอด HP */}
                <div className="w-full h-4 bg-gray-950 rounded-sm border border-gray-700 overflow-hidden relative shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-lime-400 to-green-500 transition-all duration-200"
                    style={{ width: `${hudHp}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-black tracking-widest drop-shadow-xs">
                    HP {hudHp}%
                  </span>
                </div>

                {/* หลอดพลังงาน Omnitrix */}
                <div className="w-full h-3.5 bg-gray-950 rounded-sm border border-gray-700 overflow-hidden relative shadow-inner">
                  <div
                    className={`h-full transition-all duration-200 ${
                      isOmnitrixRed
                        ? 'bg-gradient-to-r from-red-600 to-rose-500'
                        : 'bg-gradient-to-r from-yellow-300 to-amber-500'
                    }`}
                    style={{ width: `${hudEnergy}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black tracking-widest text-black drop-shadow-xs">
                    {isOmnitrixRed
                      ? `TIMEOUT (${redCooldownSec}s)`
                      : `OMNITRIX ${hudEnergy}%`}
                  </span>
                </div>
              </div>

              <div
                className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs ${
                  isOmnitrixRed
                    ? 'bg-red-950/80 border-red-500/50 text-red-300'
                    : 'bg-gray-800/80 border-green-500/40 text-green-400'
                }`}
              >
                <span className="text-gray-400">สถานะ:</span>
                <span className="font-bold uppercase">
                  {isOmnitrixRed
                    ? 'RECHARGING (RED)'
                    : ALIEN_FORMS[hudCurrentForm]?.name}
                </span>
              </div>
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold ${
                  currentStage === 3
                    ? 'bg-red-950/80 border-red-500/60 text-red-400'
                    : currentStage === 2
                    ? 'bg-orange-950/80 border-orange-500/60 text-orange-400'
                    : 'bg-emerald-950/80 border-emerald-500/60 text-emerald-400'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {currentStage === 1
                    ? 'ด่าน 1: DR. ANIMO'
                    : currentStage === 2
                    ? 'ด่าน 2: KEVIN 11'
                    : 'ด่าน 3: VILGAX (FINAL)'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-4">
              {/* ปุ่มสลับฉากหลังระหว่างเล่น (ซากเรือ / ถ้ำลาวา / อัตโนมัติ) */}
              <button
                onClick={cycleBgTheme}
                title="คลิกเพื่อเปลี่ยนฉากหลัง (อัตโนมัติ / ถ้ำลาวา / ซากเรือ)"
                className="px-2.5 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs font-bold text-amber-300 flex items-center gap-1.5 transition cursor-pointer"
              >
                <Mountain className="w-4 h-4 text-orange-400" />
                <span className="hidden sm:inline">
                  {bgTheme === 'auto'
                    ? 'ฉาก: อัตโนมัติ'
                    : bgTheme === 'lava'
                    ? 'ฉาก: ถ้ำลาวา'
                    : 'ฉาก: ซากเรือ'}
                </span>
              </button>

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
                className="absolute -top-3 w-8 h-8 -ml-4 rounded-full bg-black/60 border border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.8)] flex items-center justify-center transition-all duration-150 overflow-hidden"
                style={{ left: `${hudProgress}%` }}
              >
                <img
                  src="/ben10/sprites/real_ben_head.png"
                  alt="Ben"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="absolute -top-2.5 right-0 w-8 h-8 rounded-full bg-black border-2 border-red-500 flex items-center justify-center overflow-hidden shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                <img
                  src={
                    currentStage === 1
                      ? '/ben10/sprites/boss_animo.png'
                      : currentStage === 2
                      ? '/ben10/sprites/boss_kevin11.png'
                      : '/ben10/sprites/boss_vilgax.png'
                  }
                  alt="Boss Target"
                  className="w-full h-full object-contain p-0.5"
                />
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
                if (isOmnitrixRed) {
                  sfx.lockedBuzz()
                  showToast('⚠️ OMNITRIX TIMEOUT! นาฬิกาเป็นสีแดง กำลังระบายความร้อน')
                } else {
                  sfx.beep(520, 'sine', 0.08)
                  setIsDialOpen(!isDialOpen)
                  engineRef.current.dialModalOpen = !isDialOpen
                }
              }}
              className={`px-5 py-2.5 rounded-xl font-black text-sm tracking-wide shadow-md flex items-center gap-2 transition ${
                isOmnitrixRed
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse'
                  : 'bg-gradient-to-r from-lime-500 to-emerald-600 active:scale-95 text-black'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {isOmnitrixRed
                ? `TIMEOUT (${redCooldownSec}s)`
                : 'OMNITRIX DIAL (Z)'}
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

      {/* 🎉 หน้าจอจบด่าน (STAGE CLEAR MODAL) */}
      {screen === 'stage_clear' && stageClearedInfo && (
        <div className="w-full max-w-xl bg-gradient-to-b from-gray-900 via-emerald-950 to-black border-4 border-green-400 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(34,197,94,0.4)] animate-in zoom-in-95 duration-200 relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 bg-green-500/20 text-green-400 border border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-green-950/80 border border-green-400 text-green-300 font-mono text-xs font-bold uppercase mb-2">
            STAGE {stageClearedInfo.stage} CLEARED!
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-lime-200 to-emerald-400 mb-2">
            พิชิต {stageClearedInfo.bossName} สำเร็จ!
          </h2>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-5">
            {stageClearedInfo.stage === 1
              ? 'คุณหยุดยั้งการทดลองสร้างสัตว์กลายพันธุ์ของ ดร.แอนนีโม่ สำเร็จ! แต่สัญญาณเตือนแจ้งว่า เควิน 11 กำลังอาละวาดอยู่ในถ้ำลาวาภูเขาไฟ!'
              : 'เควิน 11 ถูกสยบแล้ว! แต่สัญญาณเตือนภัยระดับสูงสุดดังขึ้น! ลอร์ด วิวแก๊กซ์ นำยานรบ Chimerian Hammer ประชิดตัวเพื่อแย่งชิง Omnitrix!'}
          </p>

          <div className="grid grid-cols-2 gap-3 bg-black/60 rounded-2xl p-4 border border-green-500/30 mb-6 text-left">
            <div>
              <span className="text-[11px] text-gray-400 font-semibold block">
                โบนัสผ่านด่าน (STAGE BONUS)
              </span>
              <span className="text-xl sm:text-2xl font-mono font-bold text-yellow-400">
                +{stageClearedInfo.bonus.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-gray-400 font-semibold block">
                คะแนนรวมสะสม (TOTAL SCORE)
              </span>
              <span className="text-xl sm:text-2xl font-mono font-bold text-green-400">
                {stageClearedInfo.totalScore.toLocaleString()}
              </span>
            </div>
          </div>

          {/* พรีวิวบอสด่านถัดไป */}
          <div className="bg-gray-950/80 border border-gray-800 rounded-2xl p-4 mb-6 text-left flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-black border-2 border-orange-500/50 flex items-center justify-center p-1 shrink-0 overflow-hidden">
              <img
                src={
                  stageClearedInfo.nextStage === 2
                    ? '/ben10/sprites/boss_kevin11.png'
                    : '/ben10/sprites/boss_vilgax.png'
                }
                alt="Next Boss"
                className="max-h-full object-contain"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold text-orange-400 tracking-wider uppercase">
                ศัตรูด่านถัดไป (NEXT MISSION TARGET)
              </span>
              <h4 className="text-sm font-black text-white">
                {stageClearedInfo.nextStage === 2
                  ? 'ด่าน 2: เควิน 11 (Kevin Levin)'
                  : 'ด่าน 3: ลอร์ด วิวแก๊กซ์ (Lord Vilgax)'}
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">
                {stageClearedInfo.nextStage === 2
                  ? 'ร่างกลายพันธุ์รวมพลังเอเลี่ยน 11 ชนิด ในถ้ำลาวาภูเขาไฟเดือด'
                  : 'จอมราชันย์ไซบอร์กผู้พิชิต 10 พิภพ บนยานรบพิฆาตอวกาศ'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <SavagePursuitButton
              label="NEXT"
              sublabel={`ลุยต่อด่าน ${stageClearedInfo.nextStage}`}
              size="lg"
              onClick={() => startStage(stageClearedInfo.nextStage)}
            />
            <SavagePursuitButton
              label="MENU"
              sublabel="กลับหน้าหลัก"
              size="md"
              onClick={() => setScreen('menu')}
            />
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
            {screen === 'victory' ? '?? ???????????????????! GRAND VICTORY!' : '?????????????! GAME OVER'}
          </h2>

          <p className="text-gray-300 text-sm mb-6">
            {screen === 'victory'
              ? '???????????! ???????????????????? 3 ???? ???? ??.????????, ??? ????? 11 ????????? ????? ????????? ???????????????? Omnitrix ????????????!'
              : '??????????????????????????????? ?????????????????????? ????????????????????????????????!'}
          </p>

          <div className="bg-black/60 rounded-2xl p-4 border border-green-500/30 mb-6">
            <span className="text-xs text-gray-400 font-semibold">
              คะแนนสุดท้ายของคุณ (FINAL SCORE)
            </span>
            <div className="text-4xl font-mono font-black text-green-400 mt-1">
              {finalScore.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <SavagePursuitButton
              label="PLAY"
              sublabel="เล่นใหม่อีกครั้ง"
              size="lg"
              onClick={startGame}
            />
            <SavagePursuitButton
              label="MENU"
              sublabel="กลับหน้าหลัก"
              size="md"
              onClick={() => setScreen('menu')}
            />
          </div>
        </div>
      )}
    </div>
  )
}
