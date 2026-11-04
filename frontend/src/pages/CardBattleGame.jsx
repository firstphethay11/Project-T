import { useState, useEffect, useRef } from 'react'
import {
  Swords,
  Shield,
  Zap,
  Flame,
  Sparkles,
  RotateCcw,
  Eye,
  BookOpen,
  Info,
  Layers,
  Bot,
  User,
  Heart,
  Crosshair,
  Volume2,
  VolumeX,
  X,
  Copy,
  Check,
  ShieldAlert,
  ChevronRight,
  Trophy,
  Skull,
  Activity,
  Cpu,
  Crown,
  Home,
  Play
} from 'lucide-react'

// ======================================================================
// Web Audio API Sound Synthesizer (Zero External Dependencies)
// ======================================================================
const playSoundEffect = (type, enabled = true) => {
  if (!enabled) return
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()

    if (type === 'laser') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.18)
      gain.gain.setValueAtTime(0.25, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.18)
    } else if (type === 'fire') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(160, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.3)
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.3)
    } else if (type === 'shield') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(320, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.22)
      gain.gain.setValueAtTime(0.35, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.22)
    } else if (type === 'spell_atk') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'square'
      osc.frequency.setValueAtTime(260, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 0.25)
      gain.gain.setValueAtTime(0.18, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.25)
    } else if (type === 'spell_def') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(440, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.28)
      gain.gain.setValueAtTime(0.2, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.28)
    } else if (type === 'summon') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(220, ctx.currentTime)
      osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 0.12)
      gain.gain.setValueAtTime(0.25, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.15)
    } else if (type === 'draw') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(500, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.08)
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.08)
    } else if (type === 'victory') {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.frequency.value = freq
        gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.1)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.1 + 0.35)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(ctx.currentTime + idx * 0.1)
        osc.stop(ctx.currentTime + idx * 0.1 + 0.35)
      })
    }
  } catch (e) {
    console.error('AudioContext error:', e)
  }
}

// ======================================================================
// 50-CARD MASTER CATALOG DATA (ตามสเปกครบ 25 สายบุก + 15 สายรับ + 10 สเปลล์)
// ======================================================================
const MASTER_CARD_DEFINITIONS = [
  // --------------------------------------------------------------------
  // 1. ATTACKER UNITS (สายบุก ATK สูง / 25 ใบในเด็ค)
  // --------------------------------------------------------------------
  // [Sci-Fi Mech]
  {
    templateId: 'atk_sci_1',
    name: 'Cyber Blade Vanguard',
    thaiName: 'ไซเบอร์ เบลด วานการ์ด',
    type: 'attacker',
    archetype: 'sci_fi_mech',
    faction: 'sci_fi',
    cost: 1,
    atk: 3,
    def: 2,
    copies: 3,
    desc: '【สายบุก 1 Cost】นักรบไซเบอร์เนติกความเร็วสูง ถือดาบเลเซอร์นีออนแดง ฟันเจาะเกราะศัตรูฉับไว ลงสนามได้ตั้งแต่เทิร์น 1',
    promptText:
      'A fierce futuristic cybernetic warrior holding a glowing neon red laser sword, dynamic battle pose, full body shot, detailed mecha armor, trading card game art style, vibrant colors, white background, isolated --ar 3:4'
  },
  {
    templateId: 'atk_sci_2',
    name: 'Plasma Striker Mech',
    thaiName: 'พลาสม่า สไตรเกอร์ เมคา',
    type: 'attacker',
    archetype: 'sci_fi_mech',
    faction: 'sci_fi',
    cost: 3,
    atk: 5,
    def: 3,
    copies: 3,
    desc: 'หุ่นยนต์รบสวมเกราะไฮเทค ติดตั้งปืนคู่ลำแสงพลาสม่าระเบิดพลังทำลายล้าง',
    promptText:
      'A futuristic cybernetic assault robot with dual glowing red plasma blades, combat stance, intricate machinery, glowing circuits, trading card game art style, isolated --ar 3:4'
  },
  {
    templateId: 'atk_sci_3',
    name: 'Neon Laser Samurai',
    thaiName: 'ซามูไรดาบแสงนีออน',
    type: 'attacker',
    archetype: 'sci_fi_mech',
    faction: 'sci_fi',
    cost: 4,
    atk: 6,
    def: 4,
    copies: 3,
    desc: 'ซามูไรจักรกลสังหาร ดาบคู่แสงนีออนแดงตัดเฉือนเกราะหนาได้ในพริบตาเดียว',
    promptText:
      'A fierce cybernetic samurai mecha wielding a glowing neon red nodachi laser sword, dynamic slashing pose, cyber armor plates, TCG card art, vibrant crimson glow, white background --ar 3:4'
  },
  {
    templateId: 'atk_sci_4',
    name: 'Hyperion Siege Walker',
    thaiName: 'ไฮเพอเรียน ซีจอสูรเหล็ก',
    type: 'attacker',
    archetype: 'sci_fi_mech',
    faction: 'sci_fi',
    cost: 5,
    atk: 7,
    def: 4,
    copies: 2,
    desc: 'หุ่นรบยักษ์รุ่นถล่มป้อมปราการ พลังทำลายล้างสูงลิบพร้อมเรลกันและดาบความร้อนสูง',
    promptText:
      'A massive heavy siege cybernetic warrior holding an oversized thermal laser blade, aggressive war stance, glowing reactor core, sci-fi card game illustration, isolated --ar 3:4'
  },
  {
    templateId: 'atk_sci_5',
    name: 'Apex Cyber Warlord',
    thaiName: 'เอเปกซ์ จอมทัพไซเบอร์',
    type: 'attacker',
    archetype: 'sci_fi_mech',
    faction: 'sci_fi',
    cost: 6,
    atk: 8,
    def: 5,
    copies: 2,
    desc: 'แม่ทัพไซเบอร์เนติกระดับตำนาน กวาดล้างสนามรบด้วยดาบเลเซอร์คู่พลังงานควอนตัม',
    promptText:
      'An ultimate supreme cybernetic warlord with dual glowing neon red plasma broadswords, glowing red visor, master tier mecha armor, TCG illustration, epic lighting --ar 3:4'
  },
  // [Fantasy Monster]
  {
    templateId: 'atk_fan_1',
    name: 'Magma Hound',
    thaiName: 'สุนัขนรกเพลิงลาวา',
    type: 'attacker',
    archetype: 'fantasy_monster',
    faction: 'dark_fantasy',
    cost: 1,
    atk: 3,
    def: 1,
    copies: 3,
    desc: '【สายบุก 1 Cost】อสูรหมาป่าไฟ ร่างกายลุกไหม้ด้วยธารลาวา พุ่งเข้าขย้ำศัตรูด้วยเขี้ยวเปลวเพลิง เหมาะกับเทิร์นแรก',
    promptText:
      'A roaring fire beast coated in magma and hellfire flames, aggressive attacking stance, glowing fiery fangs, fantasy card game illustration, dramatic lighting, isolated --ar 3:4'
  },
  {
    templateId: 'atk_fan_2',
    name: 'Infernal Hellion',
    thaiName: 'ปีศาจอัคคีพิฆาต',
    type: 'attacker',
    archetype: 'fantasy_monster',
    faction: 'dark_fantasy',
    cost: 3,
    atk: 5,
    def: 2,
    copies: 2,
    desc: 'ปีศาจจากขุมนรกเพลิง กรงเล็บหลอมละลายแผ่นเหล็ก โจมตีหนักหน่วงไร้ปรานี',
    promptText:
      'A fierce demonic fire elemental monster coated in molten rock and flames, slashing lava claws, aggressive leap pose, epic fantasy TCG art, white background --ar 3:4'
  },
  {
    templateId: 'atk_fan_3',
    name: 'Fire Behemoth',
    thaiName: 'เบเฮมอธอสูรลาวา',
    type: 'attacker',
    archetype: 'fantasy_monster',
    faction: 'dark_fantasy',
    cost: 4,
    atk: 6,
    def: 3,
    copies: 3,
    desc: 'อสูรยักษ์คำรามลั่น เปลือกนอกเป็นหินภูเขาไฟระเบิดลาวาร้อนระอุใส่แนวหน้าศัตรู',
    promptText:
      'A roaring fire behemoth monster coated in magma and flames, aggressive attacking stance, epic fantasy card game illustration, full body shot, dramatic lighting, white background, isolated --ar 3:4'
  },
  {
    templateId: 'atk_fan_4',
    name: 'Volcanic Wyrm Dragon',
    thaiName: 'มังกรภูเขาไฟระอุ',
    type: 'attacker',
    archetype: 'fantasy_monster',
    faction: 'dark_fantasy',
    cost: 5,
    atk: 7,
    def: 4,
    copies: 3,
    desc: 'มังกรเพลิงบรรพกาล ปีกอาบด้วยลาวา พ่นเปลวเพลิงนรกเผาผลาญทั้งสนามรบ',
    promptText:
      'A terrifying winged magma dragon monster coated in fire and brimstone, roaring violently, dynamic battle stance, fantasy trading card art, intense magma glow --ar 3:4'
  },
  {
    templateId: 'atk_fan_5',
    name: 'Ragnarok Fire Titan',
    thaiName: 'ไททันเพลิงวันสิ้นโลก',
    type: 'attacker',
    archetype: 'fantasy_monster',
    faction: 'dark_fantasy',
    cost: 7,
    atk: 9,
    def: 6,
    copies: 1,
    desc: 'เทพเจ้าอสูรเพลิงแห่งการทำลายล้าง พลังโจมตีสูงสุด บดขยี้ทุกสิ่งให้เป็นเถ้าถ่าน',
    promptText:
      'A colossal mythological fire behemoth god, molten core erupting with magma waves, earth-shaking attacking stance, ultra-detailed fantasy card illustration --ar 3:4'
  },

  // --------------------------------------------------------------------
  // 2. DEFENDER UNITS (สายรับ เกราะหนา โล่ยักษ์ Taunt / 15 ใบในเด็ค)
  // --------------------------------------------------------------------
  // [Fantasy Knight]
  {
    templateId: 'def_fan_1',
    name: 'Titanium Tower Knight',
    thaiName: 'อัศวินโล่ยักษ์ไททาเนียม',
    type: 'defender',
    archetype: 'fantasy_knight',
    faction: 'dark_fantasy',
    cost: 1,
    atk: 1,
    def: 4,
    isDefender: true,
    copies: 3,
    desc: '【สายรับ 1 Cost / Taunt】อัศวินโล่ยักษ์ไททาเนียม ป้องกันแน่นหนา บังคับศัตรูต้องตีตัวนี้ก่อน ปกป้องแม่ทัพตั้งแต่เทิร์นแรก',
    promptText:
      'A heavy armored knight clad in thick titanium shield plates, holding a massive tower shield, steadfast defensive stance, fantasy card game illustration, full body shot, epic lighting, white background, isolated --ar 3:4'
  },
  {
    templateId: 'def_fan_2',
    name: 'Paladin of Sacred Aegis',
    thaiName: 'พาลาดินแห่งโล่ศักดิ์สิทธิ์',
    type: 'defender',
    archetype: 'fantasy_knight',
    faction: 'dark_fantasy',
    cost: 4,
    atk: 3,
    def: 8,
    isDefender: true,
    copies: 3,
    desc: '【สายรับ / Taunt】ผู้พิทักษ์แห่งวิหารศักดิ์สิทธิ์ ชูโล่เกราะมนตราสีทอง ป้องกันดาเมจให้กองทัพอย่างเหนียวแน่น',
    promptText:
      'A majestic holy paladin knight in ornate gold and silver titanium armor, wielding an enormous fortress tower shield, defensive stance, glowing rune shield, fantasy TCG art --ar 3:4'
  },
  {
    templateId: 'def_fan_3',
    name: 'Grand Bastion Fortress',
    thaiName: 'แกรนด์ บาสเตียน ปราการเหล็ก',
    type: 'defender',
    archetype: 'fantasy_knight',
    faction: 'dark_fantasy',
    cost: 6,
    atk: 4,
    def: 10,
    isDefender: true,
    copies: 2,
    desc: '【สายรับ / Taunt】อัศวินปราการระดับตำนาน เกราะหนาประดุจกำแพงเมือง ศัตรูไม่สามารถข้ามผ่านไปได้เด็ดขาด',
    promptText:
      'A legendary iron fortress knight clad in colossal layered titanium armor plates, double tower shields locked together, impassable defensive stance, epic dark fantasy art --ar 3:4'
  },
  // [Sci-Fi Shield Mech]
  {
    templateId: 'def_sci_1',
    name: 'Security Blast Mech',
    thaiName: 'เมคารักษาการณ์เกราะสะท้อน',
    type: 'defender',
    archetype: 'sci_fi_shield',
    faction: 'sci_fi',
    cost: 2,
    atk: 2,
    def: 6,
    isDefender: true,
    copies: 3,
    desc: '【สายรับ 2 Cost / Taunt】หุ่นยนต์รักษาความปลอดภัย กางแผ่นเกราะกันระเบิดหนาพิเศษ ป้องกันคลื่นพลังทำลายล้าง',
    promptText:
      'A massive defensive security mech robot, heavy blast shields activated, solid iron curtain defense stance, futuristic sci-fi card art, full body shot, white background, isolated --ar 3:4'
  },
  {
    templateId: 'def_sci_2',
    name: 'Iron Curtain Sentinel',
    thaiName: 'เซนติเนลม่านเหล็กกล้า',
    type: 'defender',
    archetype: 'sci_fi_shield',
    faction: 'sci_fi',
    cost: 4,
    atk: 3,
    def: 8,
    isDefender: true,
    copies: 2,
    desc: '【สายรับ / Taunt】หุ่นกลรบกางม่านเหล็กกล้าและฉนวนกันกระสุน ล็อคเป้าหมายให้ศัตรูต้องโจมตีตนเองก่อนเท่านั้น',
    promptText:
      'A heavy defensive cybernetic tank mech locking its dual titanium blast shields into the ground, reinforced bulkhead armor, flashing warning beacon lights, sci-fi card illustration --ar 3:4'
  },
  {
    templateId: 'def_sci_3',
    name: 'Forcefield Colossus',
    thaiName: 'โคโลสซัสสนามพลังควอนตัม',
    type: 'defender',
    archetype: 'sci_fi_shield',
    faction: 'sci_fi',
    cost: 6,
    atk: 3,
    def: 11,
    isDefender: true,
    copies: 2,
    desc: '【สายรับ / Taunt】หุ่นรบป้องกันขนาดยักษ์ บาเรียสะท้อนแรงกระแทก DEF สูงสุดถึง 11 หน่วย ปกป้องผู้เล่นจนหยดสุดท้าย',
    promptText:
      'A colossal defense titan robot projecting a solid hexagonal magnetic forcefield from its oversized twin blast shield arms, impenetrable sci-fi defender art --ar 3:4'
  },

  // --------------------------------------------------------------------
  // 3. COMBAT TRICKS / SPELLS (บัฟชั่วคราว / 10 ใบในเด็ค)
  // --------------------------------------------------------------------
  // [ATK Boost Effect]
  {
    templateId: 'spl_atk_1',
    name: 'Golden Energy Burst',
    thaiName: 'ระเบิดพลังออร่าสีทอง',
    type: 'spell',
    archetype: 'atk_boost',
    faction: 'dark_fantasy',
    spellType: 'atk_boost',
    cost: 1,
    atk: 0,
    def: 0,
    boostVal: 3,
    copies: 3,
    desc: '【สเปลล์บุก】ระเบิดคลื่นพลังงานสีทองอร่าม มอบ +3 ATK ให้ยูนิตเป้าหมายทันที เพื่อบดขยี้แนวป้องกัน',
    promptText:
      'A powerful energy burst, glowing golden aura radiating strength, lightning and sparks flying, trading card game action spell art, vibrant and intense visual effect, white background, isolated --ar 3:4'
  },
  {
    templateId: 'spl_atk_2',
    name: 'Overdrive Spark Surge',
    thaiName: 'โอเวอร์ไดรฟ์ประกายสายฟ้า',
    type: 'spell',
    archetype: 'atk_boost',
    faction: 'sci_fi',
    spellType: 'atk_boost',
    cost: 2,
    atk: 0,
    def: 0,
    boostVal: 5,
    copies: 2,
    desc: '【สเปลล์บุก】อัดฉีดพลังงานซูเปอร์ชาร์จ มอบ +5 ATK ชั่วขณะ พลิกเกมจัดการยูนิตตัวใหญ่หรือปิดเกมฝ่ายตรงข้าม',
    promptText:
      'A supercharged electrical plasma burst, glowing golden-yellow aura with crackling lightning arcs, high intensity shockwave spell art, trading card game graphic --ar 3:4'
  },
  // [DEF Boost Effect]
  {
    templateId: 'spl_def_1',
    name: 'Hexagonal Neon Barrier',
    thaiName: 'บาเรียหกเหลี่ยมนีออนบลู',
    type: 'spell',
    archetype: 'def_boost',
    faction: 'sci_fi',
    spellType: 'def_boost',
    cost: 1,
    atk: 0,
    def: 0,
    boostVal: 4,
    copies: 3,
    desc: '【สเปลล์รับ】กางม่านพลังงานหกเหลี่ยมสีฟ้านีออน มอบ +4 DEF ให้ยูนิตเป้าหมาย และป้องกันการสูญเสียยูนิตสำคัญ',
    promptText:
      'A translucent hexagonal neon blue energy shield barrier, deflecting laser beams, sci-fi tactical card game spell art, protective aura effect, white background, isolated --ar 3:4'
  },
  {
    templateId: 'spl_def_2',
    name: 'Aegis Titanium Bulwark',
    thaiName: 'ปราการไททาเนียมพิทักษ์',
    type: 'spell',
    archetype: 'def_boost',
    faction: 'dark_fantasy',
    spellType: 'def_boost',
    cost: 2,
    atk: 0,
    def: 0,
    boostVal: 6,
    copies: 2,
    desc: '【สเปลล์รับ】เสริมเกราะแผ่นไททาเนียมหนาพิเศษ มอบ +6 DEF พร้อมมอบสถานะ 【Taunt ป้องกันเพื่อน】 ให้ยูนิต',
    promptText:
      'A glowing translucent kinetic aegis barrier shimmering with cyan hexagonal energy plates, deflecting fiery projectiles, defensive card game spell art --ar 3:4'
  }
]

// สร้างสำรับ 50 ใบเต็ม (25 Attacker + 15 Defender + 10 Spell)
function buildFull50CardDeck() {
  const deck = []
  let instanceId = 1
  const uid = Math.random().toString(36).substring(2, 9)
  MASTER_CARD_DEFINITIONS.forEach((card) => {
    for (let i = 0; i < card.copies; i++) {
      deck.push({
        ...card,
        id: `c_${uid}_${instanceId++}`,
        currentAtk: card.atk,
        currentDef: card.def,
        hasAttacked: false
      })
    }
  })
  return deck
}

// สุ่มสลับการ์ดในเด็ค (Fisher-Yates)
function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// ======================================================================
// 2D Vector SVG Character Artworks (Rendered Inside Transparent Center)
// ======================================================================

// 1. [Sci-Fi Mech]
function SciFiMechArt() {
  return (
    <svg viewBox="0 0 200 240" className="w-full h-full select-none">
      <defs>
        <radialGradient id="cyberBg" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="60%" stopColor="#020617" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>
        <linearGradient id="neonRedSword" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#ff1744" />
          <stop offset="70%" stopColor="#d50000" />
          <stop offset="100%" stopColor="#ff5252" />
        </linearGradient>
        <linearGradient id="armorMetal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="50%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="cyanAccent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <filter id="neonGlowRed" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="neonGlowCyan" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Cyber Grid Background */}
      <rect width="200" height="240" fill="url(#cyberBg)" />
      <g stroke="#06b6d4" strokeWidth="0.5" opacity="0.25">
        <line x1="0" y1="40" x2="200" y2="40" />
        <line x1="0" y1="80" x2="200" y2="80" />
        <line x1="0" y1="120" x2="200" y2="120" />
        <line x1="0" y1="160" x2="200" y2="160" />
        <line x1="0" y1="200" x2="200" y2="200" />
        <line x1="40" y1="0" x2="40" y2="240" />
        <line x1="100" y1="0" x2="100" y2="240" />
        <line x1="160" y1="0" x2="160" y2="240" />
      </g>

      {/* Glowing Neon Cyber Rings / Hexagon Behind */}
      <polygon
        points="100,25 155,55 155,125 100,155 45,125 45,55"
        fill="none"
        stroke="#06b6d4"
        strokeWidth="1.5"
        opacity="0.5"
        filter="url(#neonGlowCyan)"
      />

      {/* Mech Shoulder Thrusters / Wings */}
      <path d="M40 90 L20 120 L45 130 Z" fill="url(#armorMetal)" stroke="#06b6d4" strokeWidth="1" />
      <path d="M160 90 L180 120 L155 130 Z" fill="url(#armorMetal)" stroke="#06b6d4" strokeWidth="1" />

      {/* Cybernetic Armor Body */}
      {/* Torso & Core */}
      <polygon
        points="75,80 125,80 135,130 115,175 85,175 65,130"
        fill="url(#armorMetal)"
        stroke="#64748b"
        strokeWidth="1.5"
      />
      {/* Cyan Core Arc Reactor */}
      <circle cx="100" cy="115" r="10" fill="#0891b2" filter="url(#neonGlowCyan)" />
      <circle cx="100" cy="115" r="5" fill="#a5f3fc" />

      {/* Mech Head / Visor */}
      <polygon points="85,45 115,45 125,65 100,78 75,65" fill="#1e293b" stroke="#06b6d4" strokeWidth="1.2" />
      {/* Glowing Red Optic Slit */}
      <path
        d="M86 58 L114 58 L108 63 L92 63 Z"
        fill="#ff1744"
        filter="url(#neonGlowRed)"
      />

      {/* Dual Laser Blade (Right Hand) - Dynamic Battle Pose */}
      {/* Laser Hilt */}
      <rect x="135" y="105" width="10" height="25" rx="3" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
      {/* Glowing Red Laser Blade */}
      <path
        d="M140 105 L175 25 L182 30 L145 110 Z"
        fill="url(#neonRedSword)"
        filter="url(#neonGlowRed)"
      />
      {/* Laser Sparks */}
      <circle cx="178" cy="28" r="3" fill="#ffffff" filter="url(#neonGlowRed)" />
      <line x1="165" y1="40" x2="190" y2="35" stroke="#ff8a80" strokeWidth="1.5" />
      <line x1="170" y1="20" x2="185" y2="15" stroke="#ff8a80" strokeWidth="1.5" />

      {/* Armored Legs */}
      <polygon points="75,175 85,175 80,225 65,225" fill="#1e293b" stroke="#475569" strokeWidth="1" />
      <polygon points="125,175 115,175 120,225 135,225" fill="#1e293b" stroke="#475569" strokeWidth="1" />

      {/* Tech HUD Accents */}
      <text x="12" y="25" fill="#06b6d4" fontSize="8" fontFamily="monospace" opacity="0.8">
        SYS://ONLINE
      </text>
      <text x="145" y="230" fill="#ff1744" fontSize="8" fontFamily="monospace" opacity="0.8">
        ATK-MODE
      </text>
    </svg>
  )
}

// 2. [Fantasy Monster]
function FantasyMonsterArt() {
  return (
    <svg viewBox="0 0 200 240" className="w-full h-full select-none">
      <defs>
        <radialGradient id="magmaBg" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#450a0a" />
          <stop offset="60%" stopColor="#1c0505" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>
        <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#7f1d1d" />
          <stop offset="40%" stopColor="#ea580c" />
          <stop offset="80%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id="obsidianRock" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#292524" />
          <stop offset="50%" stopColor="#1c1917" />
          <stop offset="100%" stopColor="#0c0a09" />
        </linearGradient>
        <filter id="flameGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Volcanic Crag Background */}
      <rect width="200" height="240" fill="url(#magmaBg)" />

      {/* Floating Embers / Sparks */}
      <circle cx="35" cy="50" r="2.5" fill="#f59e0b" filter="url(#flameGlow)" />
      <circle cx="165" cy="70" r="3" fill="#ef4444" filter="url(#flameGlow)" />
      <circle cx="80" cy="30" r="1.5" fill="#facc15" />
      <circle cx="140" cy="40" r="2" fill="#fb923c" />

      {/* Flame Wings / Fire Aura */}
      <path
        d="M30 140 Q 15 80 55 45 Q 65 95 75 110 Z"
        fill="url(#flameGrad)"
        filter="url(#flameGlow)"
        opacity="0.85"
      />
      <path
        d="M170 140 Q 185 80 145 45 Q 135 95 125 110 Z"
        fill="url(#flameGrad)"
        filter="url(#flameGlow)"
        opacity="0.85"
      />

      {/* Massive Magma Horns */}
      <path
        d="M80 75 Q 40 40 25 15 Q 55 35 90 60 Z"
        fill="url(#obsidianRock)"
        stroke="#f97316"
        strokeWidth="1.5"
      />
      <path
        d="M120 75 Q 160 40 175 15 Q 145 35 110 60 Z"
        fill="url(#obsidianRock)"
        stroke="#f97316"
        strokeWidth="1.5"
      />

      {/* Monster Torso / Obsidian Plates with Magma Fissures */}
      <polygon points="65,95 135,95 150,165 100,205 50,165" fill="url(#obsidianRock)" />
      {/* Magma Cracks */}
      <path
        d="M75 110 L95 130 L90 155 L105 185 M125 115 L110 135 L120 160"
        stroke="#f97316"
        strokeWidth="3"
        fill="none"
        filter="url(#flameGlow)"
      />

      {/* Roaring Monster Head & Jaw */}
      <polygon points="75,65 125,65 135,100 100,125 65,100" fill="#1c1917" stroke="#ea580c" strokeWidth="1.5" />
      {/* Roaring Fire Mouth */}
      <polygon points="85,95 115,95 100,120" fill="url(#flameGrad)" filter="url(#flameGlow)" />
      {/* Sharp Teeth */}
      <polygon points="88,95 93,103 98,95" fill="#fef08a" />
      <polygon points="102,95 107,103 112,95" fill="#fef08a" />
      {/* Glowing Molten Eyes */}
      <ellipse cx="86" cy="78" rx="4" ry="2.5" fill="#facc15" filter="url(#flameGlow)" />
      <ellipse cx="114" cy="78" rx="4" ry="2.5" fill="#facc15" filter="url(#flameGlow)" />

      {/* Blazing Legs / Talons */}
      <path d="M60 170 L40 220 L55 225 L75 185 Z" fill="#292524" stroke="#f97316" strokeWidth="1" />
      <path d="M140 170 L160 220 L145 225 L125 185 Z" fill="#292524" stroke="#f97316" strokeWidth="1" />
    </svg>
  )
}

// 3. [Fantasy Knight]
function FantasyKnightArt() {
  return (
    <svg viewBox="0 0 200 240" className="w-full h-full select-none">
      <defs>
        <linearGradient id="skyRays" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="60%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="titaniumSilver" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="40%" stopColor="#cbd5e1" />
          <stop offset="70%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="goldFiligree" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>
        <filter id="holyGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <rect width="200" height="240" fill="url(#skyRays)" />

      {/* Sunbeam Light Rays */}
      <polygon points="100,0 70,240 130,240" fill="#fef08a" opacity="0.12" />
      <polygon points="100,0 20,240 60,240" fill="#fef08a" opacity="0.08" />
      <polygon points="100,0 140,240 180,240" fill="#fef08a" opacity="0.08" />

      {/* Knight's Cape */}
      <path d="M60 80 Q 30 140 45 220 L 80 200 Z" fill="#1d4ed8" opacity="0.9" />

      {/* Knight Body in Heavy Armor */}
      <polygon points="80,75 120,75 130,140 100,165 70,140" fill="url(#titaniumSilver)" stroke="#94a3b8" />

      {/* Winged Helmet */}
      <polygon points="85,40 115,40 125,75 100,85 75,75" fill="url(#titaniumSilver)" stroke="#cbd5e1" strokeWidth="1.2" />
      {/* Helmet Wings */}
      <path d="M75 55 L50 35 L70 50 Z" fill="url(#goldFiligree)" />
      <path d="M125 55 L150 35 L130 50 Z" fill="url(#goldFiligree)" />
      {/* Glowing Blue Gaze */}
      <line x1="88" y1="62" x2="112" y2="62" stroke="#60a5fa" strokeWidth="2.5" filter="url(#holyGlow)" />

      {/* MASSIVE TOWER SHIELD (Front & Center) */}
      <path
        d="M95 65 L165 65 L175 170 Q 135 225 135 225 Q 95 225 85 170 Z"
        fill="url(#titaniumSilver)"
        stroke="url(#goldFiligree)"
        strokeWidth="3.5"
      />
      {/* Shield Inner Inset */}
      <path
        d="M102 75 L158 75 L165 165 Q 135 210 135 210 Q 105 210 95 165 Z"
        fill="#1e293b"
        stroke="#475569"
        strokeWidth="1.5"
      />
      {/* Embossed Golden Lion / Fortress Crest */}
      <polygon points="130,95 140,95 145,110 135,125 125,110" fill="url(#goldFiligree)" filter="url(#holyGlow)" />
      <circle cx="135" cy="140" r="14" fill="none" stroke="url(#goldFiligree)" strokeWidth="2" />
      <path d="M135 130 L135 150 M125 140 L145 140" stroke="url(#goldFiligree)" strokeWidth="2" />

      {/* Titanium Greaves */}
      <rect x="75" y="165" width="16" height="55" fill="url(#titaniumSilver)" rx="4" />
    </svg>
  )
}

// 4. [Sci-Fi Shield Mech]
function SciFiShieldMechArt() {
  return (
    <svg viewBox="0 0 200 240" className="w-full h-full select-none">
      <defs>
        <radialGradient id="shieldMechBg" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#0c4a6e" />
          <stop offset="60%" stopColor="#082f49" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
        <linearGradient id="heavyAlloy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="40%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="neonCyanShield" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <filter id="cyanForcefield" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <rect width="200" height="240" fill="url(#shieldMechBg)" />

      {/* Background Forcefield Projection Lines */}
      <circle cx="100" cy="120" r="80" fill="none" stroke="#0284c7" strokeWidth="1" strokeDasharray="6,4" opacity="0.4" />
      <circle cx="100" cy="120" r="55" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.6" />

      {/* Heavy Mech Head / Sensor Dome */}
      <path d="M85 50 Q 100 35 115 50 L 120 70 L 80 70 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
      {/* Sensor Visor Light */}
      <rect x="88" y="52" width="24" height="6" rx="2" fill="#38bdf8" filter="url(#cyanForcefield)" />

      {/* Hydraulic Center Bulkhead */}
      <rect x="70" y="70" width="60" height="70" rx="6" fill="url(#heavyAlloy)" stroke="#475569" strokeWidth="2" />
      {/* Pulsing Energy Core */}
      <circle cx="100" cy="100" r="14" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" filter="url(#cyanForcefield)" />
      <circle cx="100" cy="100" r="6" fill="#e0f2fe" />

      {/* DUAL MASSIVE BLAST SHIELDS (Iron Curtain Stance) */}
      {/* Left Blast Shield */}
      <path
        d="M20 70 L65 80 L60 210 L15 195 Z"
        fill="url(#heavyAlloy)"
        stroke="#38bdf8"
        strokeWidth="2.5"
      />
      {/* Hazard Stripes */}
      <line x1="25" y1="90" x2="45" y2="75" stroke="#facc15" strokeWidth="3" />
      <line x1="25" y1="120" x2="50" y2="105" stroke="#facc15" strokeWidth="3" />
      <line x1="25" y1="150" x2="50" y2="135" stroke="#facc15" strokeWidth="3" />

      {/* Right Blast Shield */}
      <path
        d="M180 70 L135 80 L140 210 L185 195 Z"
        fill="url(#heavyAlloy)"
        stroke="#38bdf8"
        strokeWidth="2.5"
      />
      {/* Hazard Stripes */}
      <line x1="175" y1="90" x2="155" y2="75" stroke="#facc15" strokeWidth="3" />
      <line x1="175" y1="120" x2="150" y2="105" stroke="#facc15" strokeWidth="3" />
      <line x1="175" y1="150" x2="150" y2="135" stroke="#facc15" strokeWidth="3" />

      {/* Center Kinetic Energy Barrier Grid */}
      <polygon
        points="70,140 130,140 120,205 80,205"
        fill="url(#neonCyanShield)"
        opacity="0.75"
        filter="url(#cyanForcefield)"
      />
    </svg>
  )
}

// 5. [ATK Boost Effect]
function AtkBoostArt() {
  return (
    <svg viewBox="0 0 200 240" className="w-full h-full select-none">
      <defs>
        <radialGradient id="burstBg" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#713f12" />
          <stop offset="60%" stopColor="#422006" />
          <stop offset="100%" stopColor="#050505" />
        </radialGradient>
        <radialGradient id="sunCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#fef08a" />
          <stop offset="70%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </radialGradient>
        <filter id="goldBurstGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <rect width="200" height="240" fill="url(#burstBg)" />

      {/* Shockwave Rings */}
      <circle cx="100" cy="120" r="75" fill="none" stroke="#fef08a" strokeWidth="1.5" opacity="0.4" />
      <circle cx="100" cy="120" r="50" fill="none" stroke="#facc15" strokeWidth="2.5" opacity="0.6" />

      {/* Radiating Explosion Beams */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <line
          key={deg}
          x1="100"
          y1="120"
          x2={100 + Math.cos((deg * Math.PI) / 180) * 85}
          y2={120 + Math.sin((deg * Math.PI) / 180) * 85}
          stroke="#fde047"
          strokeWidth={deg % 60 === 0 ? '4' : '2'}
          filter="url(#goldBurstGlow)"
        />
      ))}

      {/* Lightning Sparks Flying */}
      <path
        d="M100 120 L130 80 L120 70 L160 30"
        stroke="#ffffff"
        strokeWidth="2.5"
        fill="none"
        filter="url(#goldBurstGlow)"
      />
      <path
        d="M100 120 L70 150 L80 160 L40 210"
        stroke="#ffffff"
        strokeWidth="2.5"
        fill="none"
        filter="url(#goldBurstGlow)"
      />
      <path
        d="M100 120 L140 150 L130 165 L175 190"
        stroke="#fef08a"
        strokeWidth="2"
        fill="none"
        filter="url(#goldBurstGlow)"
      />

      {/* Blazing Golden Core */}
      <circle cx="100" cy="120" r="32" fill="url(#sunCore)" filter="url(#goldBurstGlow)" />
      <circle cx="100" cy="120" r="18" fill="#ffffff" />
    </svg>
  )
}

// 6. [DEF Boost Effect]
function DefBoostArt() {
  return (
    <svg viewBox="0 0 200 240" className="w-full h-full select-none">
      <defs>
        <radialGradient id="hexDefBg" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#083344" />
          <stop offset="60%" stopColor="#082f49" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
        <filter id="neonShieldGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <rect width="200" height="240" fill="url(#hexDefBg)" />

      {/* Hexagonal Shield Matrix Grid */}
      <g stroke="#38bdf8" strokeWidth="1.5" fill="rgba(14, 165, 233, 0.2)" filter="url(#neonShieldGlow)">
        {/* Center Hexagon */}
        <polygon points="100,85 130,102 130,138 100,155 70,138 70,102" />
        {/* Top Hexagon */}
        <polygon points="100,35 130,52 130,88 100,105 70,88 70,52" />
        {/* Bottom Hexagon */}
        <polygon points="100,135 130,152 130,188 100,205 70,188 70,152" />
        {/* Left Hexagon */}
        <polygon points="55,60 85,77 85,113 55,130 25,113 25,77" />
        {/* Right Hexagon */}
        <polygon points="145,60 175,77 175,113 145,130 115,113 115,77" />
      </g>

      {/* Deflecting Laser Beams Ricocheting */}
      <line x1="10" y1="40" x2="70" y2="88" stroke="#f43f5e" strokeWidth="3" />
      <line x1="70" y1="88" x2="30" y2="10" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4,3" />
      <circle cx="70" cy="88" r="5" fill="#fecdd3" filter="url(#neonShieldGlow)" />

      <line x1="190" y1="160" x2="130" y2="138" stroke="#f43f5e" strokeWidth="3" />
      <line x1="130" y1="138" x2="180" y2="210" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4,3" />
      <circle cx="130" cy="138" r="5" fill="#fecdd3" filter="url(#neonShieldGlow)" />

      {/* Concentric Forcefield Ripple */}
      <ellipse cx="100" cy="120" rx="65" ry="85" fill="none" stroke="#a5f3fc" strokeWidth="2" opacity="0.75" />
    </svg>
  )
}

// Function to route character artwork
function renderCardArtwork(archetype) {
  switch (archetype) {
    case 'sci_fi_mech':
      return <SciFiMechArt />
    case 'fantasy_monster':
      return <FantasyMonsterArt />
    case 'fantasy_knight':
      return <FantasyKnightArt />
    case 'sci_fi_shield':
      return <SciFiShieldMechArt />
    case 'atk_boost':
      return <AtkBoostArt />
    case 'def_boost':
      return <DefBoostArt />
    default:
      return <SciFiMechArt />
  }
}

// ======================================================================
// CARD FRAME TEMPLATES (Sci-Fi vs Dark Fantasy)
// ======================================================================
function TCGCard({
  card,
  themeOverride = 'auto', // 'auto', 'sci_fi', 'dark_fantasy'
  size = 'md', // 'sm', 'md', 'lg', 'zoom'
  onClick,
  onInspect,
  isPlayable = false,
  isSelected = false,
  isAttacker = false,
  isValidTarget = false,
  className = ''
}) {
  const activeTheme =
    themeOverride === 'auto'
      ? card.faction === 'sci_fi'
        ? 'sci_fi'
        : 'dark_fantasy'
      : themeOverride

  const isSciFi = activeTheme === 'sci_fi'

  // Size mapping (Ratio 2:3)
  const sizeClasses = {
    sm: 'w-20 sm:w-22 h-28 sm:h-32 text-[9px]',
    field: 'w-20 sm:w-24 md:w-26 h-30 sm:h-34 md:h-36 text-[9px]',
    hand: 'w-20 sm:w-24 md:w-26 h-30 sm:h-34 md:h-36 text-[9px]',
    md: 'w-22 sm:w-26 h-32 sm:h-36 text-[9px]',
    lg: 'w-32 sm:w-36 h-46 sm:h-52 text-xs',
    zoom: 'w-64 sm:w-76 h-96 sm:h-112 text-xs sm:text-sm'
  }[size] || 'w-22 sm:w-26 h-30 sm:h-36 text-[9px]'

  return (
    <div
      onClick={onClick}
      className={`relative group rounded-2xl select-none transition-all duration-300 cursor-pointer overflow-hidden ${sizeClasses} ${
        isSciFi
          ? 'bg-slate-950 text-cyan-50 shadow-md shadow-cyan-950/40 border-2 border-cyan-500/70'
          : 'bg-stone-950 text-amber-50 shadow-md shadow-amber-950/40 border-2 border-amber-600/70'
      } ${
        isPlayable
          ? 'ring-4 ring-emerald-400/80 shadow-emerald-500/50 scale-[1.03] animate-pulse'
          : ''
      } ${
        isSelected
          ? 'ring-4 ring-yellow-400 shadow-yellow-500/50 scale-105 z-20'
          : ''
      } ${
        isAttacker
          ? 'ring-4 ring-red-500 shadow-red-500/60 scale-105 animate-bounce z-20'
          : ''
      } ${
        isValidTarget
          ? 'ring-4 ring-rose-500/90 shadow-rose-600/70 animate-pulse scale-105 cursor-crosshair z-20'
          : ''
      } ${className}`}
    >
      {/* ------------------------------------------------------------- */}
      {/* Sci-Fi Theme Frame UI Overlay */}
      {/* ------------------------------------------------------------- */}
      {isSciFi && (
        <>
          {/* Futuristic Cybernetic Corner Brackets */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400 z-10 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400 z-10 pointer-events-none" />

          {/* High-tech circuit background grid lines */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/40 via-transparent to-slate-950 pointer-events-none" />
        </>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Dark Fantasy Theme Frame UI Overlay */}
      {/* ------------------------------------------------------------- */}
      {!isSciFi && (
        <>
          {/* Ornate Gothic Stone & Gold Filigree Corner Accents */}
          <div className="absolute top-1 left-1 text-amber-400 text-xs z-10 pointer-events-none font-serif">
            ✦
          </div>
          <div className="absolute top-1 right-1 text-amber-400 text-xs z-10 pointer-events-none font-serif">
            ✦
          </div>
          <div className="absolute bottom-1 left-1 text-amber-400 text-xs z-10 pointer-events-none font-serif">
            ✦
          </div>
          <div className="absolute bottom-1 right-1 text-amber-400 text-xs z-10 pointer-events-none font-serif">
            ✦
          </div>

          {/* Gothic stone vignette texture */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/25 via-stone-900/60 to-stone-950 pointer-events-none" />
        </>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CARD HEADER (Cost + Name + Inspect Button) */}
      {/* ------------------------------------------------------------- */}
      <div
        className={`relative z-10 flex items-center justify-between px-1.5 py-0.5 border-b ${
          isSciFi
            ? 'bg-slate-900/90 border-cyan-500/40 text-cyan-300'
            : 'bg-stone-900/90 border-amber-500/40 text-amber-300'
        }`}
      >
        {/* Cost Hexagon / Gem */}
        <div
          className={`flex items-center justify-center font-black rounded shadow-inner ${
            size === 'zoom' ? 'w-8 h-8 text-base' : 'w-4 h-4 text-[9px]'
          } ${
            isSciFi
              ? 'bg-cyan-500 text-slate-950 shadow-cyan-300'
              : 'bg-amber-500 text-stone-950 shadow-amber-300'
          }`}
          title={`ใช้พลังงาน: ${card.cost}`}
        >
          {card.cost}
        </div>

        {/* Card Name */}
        <div className="flex-1 mx-1 truncate text-left font-bold tracking-tight">
          <span className="block truncate text-[9px] sm:text-[10px]">
            {card.thaiName || card.name}
          </span>
        </div>

        {/* Quick Inspect Button */}
        {onInspect && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onInspect(card)
            }}
            title="กดดูรายละเอียดการ์ดและ Prompts"
            className="p-0.5 rounded text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <Eye className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TRANSPARENT CENTER: CHARACTER ARTWORK (3:4 ratio) */}
      {/* ------------------------------------------------------------- */}
      <div className="relative w-full h-[50%] overflow-hidden flex items-center justify-center bg-black/40">
        {renderCardArtwork(card.archetype)}

        {/* Defender (Taunt) Badge */}
        {card.isDefender && (
          <div className="absolute top-1 left-1 z-10 flex items-center gap-0.5 px-1 py-0.2 rounded bg-sky-500/90 text-white font-black text-[8px] shadow-sm shadow-sky-950 backdrop-blur-xs">
            <Shield className="w-2 h-2 text-yellow-300 fill-yellow-300" />
            <span>TAUNT</span>
          </div>
        )}

        {/* Card Type Chip */}
        <div
          className={`absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded text-[7.5px] font-bold uppercase tracking-wider backdrop-blur-xs ${
            card.type === 'attacker'
              ? 'bg-rose-600/80 text-rose-100'
              : card.type === 'defender'
              ? 'bg-sky-600/80 text-sky-100'
              : 'bg-amber-600/80 text-amber-100'
          }`}
        >
          {card.type === 'attacker'
            ? 'สายบุก'
            : card.type === 'defender'
            ? 'สายรับ'
            : 'สเปลล์'}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DESIGNATED SLOTS FOR TEXT DESCRIPTION & NUMBERS AT BOTTOM */}
      {/* ------------------------------------------------------------- */}
      <div
        className={`relative z-10 flex flex-col justify-between p-1 h-[38%] border-t ${
          isSciFi
            ? 'bg-slate-900/95 border-cyan-500/40 text-cyan-100'
            : 'bg-stone-900/95 border-amber-500/40 text-stone-200'
        }`}
      >
        {/* Description Text Slot */}
        <div className="flex-1 overflow-hidden">
          <p
            className={`line-clamp-2 text-[8px] sm:text-[8.5px] leading-tight ${
              isSciFi ? 'text-cyan-200/80' : 'text-amber-100/80'
            }`}
          >
            {card.desc}
          </p>
        </div>

        {/* Designated Numeric Slots (ATK & DEF) */}
        {card.type !== 'spell' ? (
          <div className="flex items-center justify-between pt-0.5 border-t border-white/10 mt-0.5">
            {/* ATK Slot (Left) */}
            <div
              className={`flex items-center gap-0.5 px-1.5 py-0.2 rounded font-black text-[8.5px] sm:text-[9.5px] ${
                isSciFi
                  ? 'bg-rose-950/80 border border-rose-500/60 text-rose-400'
                  : 'bg-red-950/80 border border-red-500/60 text-red-300'
              }`}
              title={`พลังโจมตี (ATK): ${card.currentAtk ?? card.atk}`}
            >
              <Swords className="w-2.5 h-2.5 text-rose-400" />
              <span>{card.currentAtk ?? card.atk}</span>
            </div>

            {/* DEF Slot (Right) */}
            <div
              className={`flex items-center gap-0.5 px-1.5 py-0.2 rounded font-black text-[8.5px] sm:text-[9.5px] ${
                isSciFi
                  ? 'bg-sky-950/80 border border-sky-500/60 text-sky-400'
                  : 'bg-blue-950/80 border border-blue-500/60 text-blue-300'
              }`}
              title={`พลังป้องกัน / พลังชีวิต (DEF): ${card.currentDef ?? card.def}`}
            >
              <Shield className="w-2.5 h-2.5 text-sky-400" />
              <span>{card.currentDef ?? card.def}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center pt-0.5 border-t border-white/10 mt-0.5">
            <span
              className={`inline-flex items-center gap-1 text-[8.5px] font-bold px-1.5 py-0.2 rounded ${
                card.spellType === 'atk_boost'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
              }`}
            >
              <Sparkles className="w-2.5 h-2.5" />
              {card.spellType === 'atk_boost' ? `+${card.boostVal} ATK` : `+${card.boostVal} DEF`}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// ======================================================================
// MAIN CARD BATTLE COMPONENT
// ======================================================================
export default function CardBattleGame({ setCurrentPage }) {
  // Theme mode: 'auto' (ตามการ์ด), 'sci_fi' (Sci-Fi ล้วน), 'dark_fantasy' (Fantasy ล้วน)
  const [frameTheme, setFrameTheme] = useState('auto')
  const [soundEnabled, setSoundEnabled] = useState(true)

  // -------------------------------------------------------------
  // GAME STATES
  // -------------------------------------------------------------
  const [gameStarted, setGameStarted] = useState(false) // หน้าล็อบบี้ก่อนเริ่มเล่น
  const [turn, setTurn] = useState(1)
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [currentPhase, setCurrentPhase] = useState('summon') // 'summon' | 'attack'
  const [gameOver, setGameOver] = useState(null) // 'victory' | 'defeat' | null

  // Player State
  const [playerHp, setPlayerHp] = useState(30)
  const [playerMaxHp] = useState(30)
  const [playerCost, setPlayerCost] = useState(1) // 1 Cost (+1 ทุกครั้งที่ถึงเทิร์น)
  const [playerDeck, setPlayerDeck] = useState([])
  const [playerHand, setPlayerHand] = useState([])
  const [playerField, setPlayerField] = useState([]) // Max 4 units

  // AI Opponent State
  const [enemyHp, setEnemyHp] = useState(30)
  const [enemyMaxHp] = useState(30)
  const [enemyCost, setEnemyCost] = useState(1) // AI Cost
  const [enemyDeck, setEnemyDeck] = useState([])
  const [enemyHandCount, setEnemyHandCount] = useState(4)
  const [enemyField, setEnemyField] = useState([]) // Max 4 units

  // Interactive Action States
  const [selectedHandCard, setSelectedHandCard] = useState(null)
  const [attackingUnitId, setAttackingUnitId] = useState(null)
  const [targetingSpell, setTargetingSpell] = useState(null)
  const [combatLog, setCombatLog] = useState([])
  const [floatingDamage, setFloatingDamage] = useState(null) // { targetId, damage, isHeal }

  // Attack Animation States
  const [attackAnim, setAttackAnim] = useState(null) // { attackerId, targetType, targetId, isPlayer, damage }
  const [hitAnimTargetId, setHitAnimTargetId] = useState(null)
  const [floatingSlash, setFloatingSlash] = useState(null) // { targetId, damage }

  // Mulligan State (ช่วงเปลี่ยนการ์ดตอนเริ่มเกม)
  const [isMulligan, setIsMulligan] = useState(false)
  const [selectedMulliganIds, setSelectedMulliganIds] = useState([])

  // Modals
  const [inspectedCard, setInspectedCard] = useState(null)
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false)
  const [deckFilter, setDeckFilter] = useState('all') // 'all', 'attacker', 'defender', 'spell'
  const [copiedPrompt, setCopiedPrompt] = useState(false)

  const logEndRef = useRef(null)
  const gameSessionIdRef = useRef(0)

  // -------------------------------------------------------------
  // INITIALIZE NEW GAME (ล้างข้อมูลเกมเก่าทั้งหมด 100% พร้อมสร้าง Session ใหม่)
  // -------------------------------------------------------------
  const startNewGame = (triggerMulligan = false) => {
    // ยกเลิกและตัดการทำงานของ Timeout/AI Turn ทั้งหมดจากเกมเก่าทันที
    gameSessionIdRef.current += 1

    const fullDeck1 = shuffle(buildFull50CardDeck())
    const fullDeck2 = shuffle(buildFull50CardDeck())

    // Initial hands (4 cards each)
    const pHand = fullDeck1.slice(0, 4)
    const pDeck = fullDeck1.slice(4)

    const eHand = fullDeck2.slice(0, 4)
    const eDeck = fullDeck2.slice(4)

    setPlayerHp(30)
    setEnemyHp(30)
    setPlayerCost(1)
    setEnemyCost(1)
    setTurn(1)
    setIsPlayerTurn(true)
    setCurrentPhase('summon')
    setGameOver(null)

    setPlayerHand(pHand)
    setPlayerDeck(pDeck)
    setPlayerField([])

    setEnemyHandCount(eHand.length)
    setEnemyDeck(eDeck)
    setEnemyField([])

    setSelectedHandCard(null)
    setAttackingUnitId(null)
    setTargetingSpell(null)
    setAttackAnim(null)
    setHitAnimTargetId(null)
    setFloatingSlash(null)

    setIsMulligan(triggerMulligan)
    setSelectedMulliganIds([])

    setCombatLog([
      {
        id: Date.now(),
        type: 'info',
        text: '⚔️ เริ่มการประลองการ์ด! ทั้งสองฝ่ายได้รับสำรับเต็ม 50 ใบ (บุก 25 / รับ 15 / สเปลล์ 10)'
      },
      {
        id: Date.now() + 1,
        type: 'info',
        text: triggerMulligan
          ? '🔄 ช่วงเปลี่ยนการ์ดเริ่มต้น (Mulligan Phase): เลือกการ์ดที่ไม่ต้องการเพื่อสลับและจั่วใหม่'
          : '⚡ เทิร์นที่ 1: ได้รับ 1 Cost • เทิร์นแรกเริ่มก่อนยังไม่สามารถโจมตีได้'
      }
    ])

    playSoundEffect('summon', soundEnabled)
  }

  // -------------------------------------------------------------
  // MULLIGAN ACTIONS
  // -------------------------------------------------------------
  const handleToggleMulliganCard = (cardId) => {
    setSelectedMulliganIds((prev) =>
      prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]
    )
  }

  const handleConfirmMulligan = (keepAll = false) => {
    if (keepAll || selectedMulliganIds.length === 0) {
      setIsMulligan(false)
      setSelectedMulliganIds([])
      addLog('✅ ยืนยันการ์ดมือเริ่มต้น! เข้าสู่เทิร์นที่ 1 (เฟสเตรียมตัว)', 'info')
      return
    }

    const cardsToReplace = playerHand.filter((c) => selectedMulliganIds.includes(c.id))
    const keptCards = playerHand.filter((c) => !selectedMulliganIds.includes(c.id))

    const newDeck = shuffle([...playerDeck, ...cardsToReplace])
    const newDraws = newDeck.slice(0, cardsToReplace.length)
    const remainingDeck = newDeck.slice(cardsToReplace.length)

    setPlayerHand([...keptCards, ...newDraws])
    setPlayerDeck(remainingDeck)
    setIsMulligan(false)
    setSelectedMulliganIds([])
    playSoundEffect('draw', soundEnabled)
    addLog(`🔄 สลับการ์ดเริ่มต้น ${cardsToReplace.length} ใบ และจั่วใหม่สำเร็จ! เข้าสู่เทิร์นที่ 1`, 'info')
  }

  const handleRedrawAllMulligan = () => {
    const newDeck = shuffle([...playerDeck, ...playerHand])
    const newHand = newDeck.slice(0, 4)
    const remainingDeck = newDeck.slice(4)

    setPlayerHand(newHand)
    setPlayerDeck(remainingDeck)
    setIsMulligan(false)
    setSelectedMulliganIds([])
    playSoundEffect('draw', soundEnabled)
    addLog('🔄 สลับการ์ดทั้งมือ 4 ใบ และจั่วใหม่สำเร็จ! เข้าสู่เทิร์นที่ 1', 'info')
  }

  useEffect(() => {
    startNewGame()
  }, [])

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [combatLog])

  const addLog = (text, type = 'normal') => {
    setCombatLog((prev) => [
      ...prev.slice(-30),
      { id: Date.now() + Math.random(), text, type }
    ])
  }

  // -------------------------------------------------------------
  // CHECK VICTORY / DEFEAT
  // -------------------------------------------------------------
  useEffect(() => {
    if (enemyHp <= 0 && !gameOver) {
      setGameOver('victory')
      playSoundEffect('victory', soundEnabled)
      addLog('🏆 ชัยชนะอันยิ่งใหญ่! คุณสามารถเอาชนะบอทศัตรูได้สำเร็จ!', 'victory')
    } else if (playerHp <= 0 && !gameOver) {
      setGameOver('defeat')
      playSoundEffect('fire', soundEnabled)
      addLog('💀 พ่ายแพ้! พลังชีวิตของคุณหมดลง...', 'defeat')
    }
  }, [playerHp, enemyHp, gameOver])

  // -------------------------------------------------------------
  // PLAYER ACTIONS
  // -------------------------------------------------------------

  // Play card from hand
  const handleSelectHandCard = (card) => {
    if (!isPlayerTurn || gameOver) return

    if (currentPhase === 'attack') {
      addLog('⚠️ อยู่ใน "เฟสโจมตี" แล้ว! ไม่สามารถลงการ์ดเพิ่มได้ (ต้องลงในเฟสเตรียมตัวก่อนกด Attack)', 'warning')
      return
    }

    if (card.cost > playerCost) {
      addLog(`❌ Cost ไม่พอ! การ์ดนี้ต้องการ ${card.cost} Cost (ปัจจุบันมี ${playerCost} Cost)`, 'warning')
      return
    }

    if (card.type === 'spell') {
      // Cast spell
      if (playerField.length === 0) {
        addLog('⚠️ ไม่มีเป้าหมายยูนิตในสนามของคุณให้ร่ายสเปลล์!', 'warning')
        return
      }
      setSelectedHandCard(card)
      setTargetingSpell(card)
      setAttackingUnitId(null)
      addLog(`✨ เลือกยูนิตในสนามของคุณ 1 ตัวเพื่อมอบผลของ [${card.thaiName}]`, 'info')
    } else {
      // Summon unit to field (Max 4 units)
      if (playerField.length >= 4) {
        addLog('⚠️ สนามของคุณเต็มแล้ว (จำกัดสูงสุด 4 ยูนิต)', 'warning')
        return
      }

      setPlayerCost((prev) => prev - card.cost)
      setPlayerHand((prev) => prev.filter((c) => c.id !== card.id))

      const summonedUnit = {
        ...card,
        currentAtk: card.atk,
        currentDef: card.def,
        hasAttacked: false // ลงสนามแล้วสามารถสั่งโจมตีในเฟสโจมตีได้ทันที
      }

      setPlayerField((prev) => [...prev, summonedUnit])
      playSoundEffect('summon', soundEnabled)
      addLog(`🛡️ คุณจ่าย ${card.cost} Cost อัญเชิญ [${card.thaiName}] (ATK: ${card.atk} / DEF: ${card.def}) ลงสู่สนาม!`, 'action')
      setSelectedHandCard(null)
    }
  }

  // Apply Spell to target friendly unit
  const handleApplySpell = (targetUnit) => {
    if (!targetingSpell) return

    setPlayerCost((prev) => prev - targetingSpell.cost)
    setPlayerHand((prev) => prev.filter((c) => c.id !== targetingSpell.id))

    setPlayerField((prev) =>
      prev.map((unit) => {
        if (unit.id === targetUnit.id) {
          if (targetingSpell.spellType === 'atk_boost') {
            return {
              ...unit,
              currentAtk: unit.currentAtk + targetingSpell.boostVal
            }
          } else {
            return {
              ...unit,
              currentDef: unit.currentDef + targetingSpell.boostVal,
              isDefender: true // Grant taunt on titanium bulwark
            }
          }
        }
        return unit
      })
    )

    if (targetingSpell.spellType === 'atk_boost') {
      playSoundEffect('spell_atk', soundEnabled)
      addLog(`⚡ ร่าย [${targetingSpell.thaiName}] ใส่ [${targetUnit.thaiName}] เพิ่ม +${targetingSpell.boostVal} ATK!`, 'buff')
    } else {
      playSoundEffect('spell_def', soundEnabled)
      addLog(`🛡️ ร่าย [${targetingSpell.thaiName}] ใส่ [${targetUnit.thaiName}] เพิ่ม +${targetingSpell.boostVal} DEF และมอบ Taunt!`, 'buff')
    }

    setTargetingSpell(null)
    setSelectedHandCard(null)
  }

  // Attack with field unit
  const handleSelectAttackingUnit = (unit) => {
    if (!isPlayerTurn || gameOver) return

    if (turn === 1) {
      addLog('⚠️ ผู้เล่นที่เริ่มคนแรก ไม่สามารถสั่งโจมตีได้ในเทิร์นแรกตามกฎ!', 'warning')
      return
    }

    if (currentPhase === 'summon') {
      addLog('⚠️ ตอนนี้อยู่ใน "เฟสลงการ์ด" — กรุณากดปุ่ม "⚔️ เริ่มโจมตี (Attack)" ก่อนเพื่อเข้าสู่การโจมตี!', 'warning')
      return
    }

    if (unit.hasAttacked) {
      addLog(`⏳ [${unit.thaiName}] โจมตีไปแล้วในเทิร์นนี้! (มอนสเตอร์ 1 ตัวโจมตีได้ 1 ครั้งต่อเทิร์น)`, 'warning')
      return
    }

    if (attackingUnitId === unit.id) {
      setAttackingUnitId(null)
      addLog(`ยกเลิกการเลือก [${unit.thaiName}]`, 'info')
    } else {
      setAttackingUnitId(unit.id)
      setTargetingSpell(null)
      setSelectedHandCard(null)
      if (enemyField.length > 0) {
        addLog(`🎯 คุณเลือก [${unit.thaiName}] แล้ว! กรุณากดที่มอนสเตอร์ฝ่ายตรงข้ามเพื่อโจมตี`, 'action')
      } else {
        addLog(`🎯 คุณเลือก [${unit.thaiName}] แล้ว! ฝ่ายตรงข้ามไม่มีมอนสเตอร์ กดที่ผู้เล่นฝั่งตรงข้ามด้านบนเพื่อโจมตีเข้า HP`, 'action')
      }
    }
  }

  // Switch from Summon phase to Attack phase
  const handleEnterAttackPhase = () => {
    if (!isPlayerTurn || gameOver) return
    if (turn === 1) {
      addLog('⚠️ ผู้เล่นที่เริ่มคนแรก ไม่สามารถโจมตีได้ในเทิร์นแรกตามกฎ!', 'warning')
      return
    }
    // ถ้าไม่มีมอนก็ตีไม่ได้
    if (playerField.length === 0) {
      addLog('⚠️ คุณไม่มีมอนสเตอร์บนสนาม ไม่สามารถโจมตีได้!', 'warning')
      return
    }
    const readyCount = playerField.filter((u) => !u.hasAttacked).length
    if (readyCount === 0) {
      addLog('⚠️ มอนสเตอร์ทุกตัวในสนามของคุณโจมตีไปหมดแล้วในเทิร์นนี้!', 'warning')
      return
    }
    setCurrentPhase('attack')
    setSelectedHandCard(null)
    setTargetingSpell(null)
    setAttackingUnitId(null)
    playSoundEffect('laser', soundEnabled)
    addLog(`⚔️ เข้าสู่ "เฟสโจมตี (Attack Phase)"! มอนสเตอร์พร้อมโจมตี ${readyCount} ตัว (คลิกที่มอนสเตอร์ แล้วคลิกที่เป้าหมาย)`, 'info')
  }

  // Execute attack on enemy unit or enemy leader
  const handleAttackTarget = (targetType, enemyUnit = null) => {
    if (!attackingUnitId || !isPlayerTurn || gameOver || attackAnim) return

    const attacker = playerField.find((u) => u.id === attackingUnitId)
    if (!attacker) return
    const currentSession = gameSessionIdRef.current

    // 1. Direct attack on enemy leader
    if (targetType === 'leader') {
      // RULE: เราจะตีเข้า HP ผู้เล่นได้ก็ต่อเมื่อผู้เล่นไม่มีการ์ดวางอยู่
      if (enemyField.length > 0) {
        addLog(`🛡️ ไม่สามารถโจมตีผู้เล่นฝั่งตรงข้ามได้! ต้องกำจัดมอนสเตอร์บนสนามของศัตรูให้หมดก่อน (${enemyField.length} ตัว)`, 'warning')
        playSoundEffect('shield', soundEnabled)
        return
      }

      const dmg = attacker.currentAtk

      // 1. Trigger Card Attack Lunge (พุ่งขึ้นด้านบนไปตี)
      setAttackAnim({
        attackerId: attacker.id,
        targetType: 'leader',
        targetId: 'leader',
        isPlayer: true,
        damage: dmg
      })
      playSoundEffect(attacker.faction === 'sci_fi' ? 'laser' : 'fire', soundEnabled)

      // 2. Impact on enemy leader after 260ms
      setTimeout(() => {
        if (gameSessionIdRef.current !== currentSession) return
        setHitAnimTargetId('leader')
        setFloatingSlash({ targetId: 'leader', damage: dmg })
        setEnemyHp((prev) => Math.max(0, prev - dmg))
        playSoundEffect('fire', soundEnabled)

        setPlayerField((prev) =>
          prev.map((u) => (u.id === attacker.id ? { ...u, hasAttacked: true } : u))
        )
        addLog(`💥 ฝั่งตรงข้ามไม่มีมอนสเตอร์! [${attacker.thaiName}] พุ่งเข้าโจมตีแม่ทัพศัตรูโดยตรง! สร้างความเสียหาย ${dmg} ดาเมจ!`, 'damage')

        // 3. Clear animation after 550ms
        setTimeout(() => {
          if (gameSessionIdRef.current !== currentSession) return
          setAttackAnim(null)
          setHitAnimTargetId(null)
          setFloatingSlash(null)
          setAttackingUnitId(null)
        }, 320)
      }, 260)
      return
    }

    // 2. Attack enemy unit (Clash)
    if (enemyUnit) {
      const enemyHasDefender = enemyField.some((u) => u.isDefender)
      if (enemyHasDefender && !enemyUnit.isDefender) {
        addLog('🛡️ ศัตรูมี "ยูนิตสายรับ (Defender / Taunt)" อยู่ในสนาม! คุณต้องกดโจมตีตัวรับก่อนเท่านั้น!', 'warning')
        playSoundEffect('shield', soundEnabled)
        return
      }

      const playerDmg = attacker.currentAtk
      const counterDmg = enemyUnit.currentAtk

      // 1. Trigger Card Attack Lunge (พุ่งขึ้นด้านบนไปตีมอนสเตอร์ศัตรู)
      setAttackAnim({
        attackerId: attacker.id,
        targetType: 'unit',
        targetId: enemyUnit.id,
        isPlayer: true,
        damage: playerDmg
      })
      playSoundEffect(attacker.faction === 'sci_fi' ? 'laser' : 'fire', soundEnabled)

      // 2. Impact on enemy unit after 260ms
      setTimeout(() => {
        if (gameSessionIdRef.current !== currentSession) return
        setHitAnimTargetId(enemyUnit.id)
        setFloatingSlash({ targetId: enemyUnit.id, damage: playerDmg })
        playSoundEffect(
          enemyUnit.isDefender ? 'shield' : attacker.faction === 'sci_fi' ? 'laser' : 'fire',
          soundEnabled
        )

        addLog(`⚔️ [${attacker.thaiName}] พุ่งเข้าปะทะกับมอนสเตอร์ฝ่ายตรงข้าม [${enemyUnit.thaiName}]!`, 'action')

        // Update enemy field
        setEnemyField((prev) =>
          prev
            .map((u) => {
              if (u.id === enemyUnit.id) {
                const newDef = u.currentDef - playerDmg
                return { ...u, currentDef: newDef }
              }
              return u
            })
            .filter((u) => {
              if (u.currentDef <= 0) {
                addLog(`💀 [${u.thaiName}] ของศัตรูถูกทำลายสิ้นซาก!`, 'destroy')
                return false
              }
              return true
            })
        )

        // Attacker takes counter damage
        setPlayerField((prev) =>
          prev
            .map((u) => {
              if (u.id === attacker.id) {
                const newDef = u.currentDef - counterDmg
                return { ...u, currentDef: newDef, hasAttacked: true }
              }
              return u
            })
            .filter((u) => {
              if (u.currentDef <= 0) {
                addLog(`💀 [${u.thaiName}] ของคุณถูกทำลายในการปะทะ!`, 'destroy')
                return false
              }
              return true
            })
        )

        // 3. Clear animation after 550ms
        setTimeout(() => {
          if (gameSessionIdRef.current !== currentSession) return
          setAttackAnim(null)
          setHitAnimTargetId(null)
          setFloatingSlash(null)
          setAttackingUnitId(null)
        }, 320)
      }, 260)
    }
  }

  // -------------------------------------------------------------
  // END TURN & AI AUTOMATION
  // -------------------------------------------------------------
  const handleEndTurn = () => {
    if (!isPlayerTurn || gameOver) return

    setIsPlayerTurn(false)
    setSelectedHandCard(null)
    setAttackingUnitId(null)
    setTargetingSpell(null)

    addLog('⌛ คุณสิ้นสุดเทิร์น — ส่งต่อให้ตาของ AI (Cyber Overlord)', 'info')

    const currentSession = gameSessionIdRef.current
    // AI Turn runs with brief delays for natural pacing
    setTimeout(() => {
      if (gameSessionIdRef.current !== currentSession) return
      runAiTurn()
    }, 700)
  }

  const runAiTurn = () => {
    const currentSession = gameSessionIdRef.current
    if (gameSessionIdRef.current !== currentSession) return

    // 1. Enemy Cost & Draw (ได้รับ 1 Cost บวกเข้ากับ Cost คงเหลือ)
    const newEnemyCost = enemyCost + 1
    let currentEnemyCost = newEnemyCost
    let currentEnemyField = enemyField.map((u) => ({ ...u, hasAttacked: false }))
    let currentEnemyDeck = [...enemyDeck]
    let currentEnemyHandCount = enemyHandCount + 1

    if (currentEnemyDeck.length > 0) {
      currentEnemyDeck.shift()
      playSoundEffect('draw', soundEnabled)
    }

    addLog(`🤖 ตาของ AI (เทิร์นที่ ${turn + 1}) ได้รับ 1 Cost (มีทั้งหมด: ${newEnemyCost} Cost)`, 'info')

    // 2. AI Card Play Logic
    const possibleSummons = [
      MASTER_CARD_DEFINITIONS.find((c) => c.templateId === 'atk_sci_1'),
      MASTER_CARD_DEFINITIONS.find((c) => c.templateId === 'atk_sci_2'),
      MASTER_CARD_DEFINITIONS.find((c) => c.templateId === 'def_fan_1'),
      MASTER_CARD_DEFINITIONS.find((c) => c.templateId === 'atk_fan_3'),
      MASTER_CARD_DEFINITIONS.find((c) => c.templateId === 'def_sci_2')
    ].filter(Boolean)

    for (let i = 0; i < 2; i++) {
      if (currentEnemyField.length < 4) {
        const candidate = possibleSummons[Math.floor(Math.random() * possibleSummons.length)]
        if (candidate && candidate.cost <= currentEnemyCost) {
          currentEnemyCost -= candidate.cost
          const newUnit = {
            ...candidate,
            id: `enemy_unit_${Date.now()}_${Math.random()}`,
            currentAtk: candidate.atk,
            currentDef: candidate.def,
            hasAttacked: false
          }
          currentEnemyField.push(newUnit)
          addLog(`🤖 AI จ่าย ${candidate.cost} Cost อัญเชิญ [${candidate.thaiName}] ลงสู่สนาม!`, 'action')
          playSoundEffect('summon', soundEnabled)
        }
      }
    }

    setEnemyCost(currentEnemyCost)
    setEnemyField(currentEnemyField)
    setEnemyDeck(currentEnemyDeck)
    setEnemyHandCount(Math.max(1, currentEnemyHandCount - 1))

    // 3. AI Combat Phase (AI Attacks with Sequential Card Lunge Animation)
    setTimeout(async () => {
      if (gameSessionIdRef.current !== currentSession) return

      let updatedPlayerField = [...playerField]
      let updatedPlayerHp = playerHp
      let updatedEnemyField = [...currentEnemyField]

      const readyAiAttackers = updatedEnemyField.filter((u) => !u.hasAttacked)

      for (let i = 0; i < readyAiAttackers.length; i++) {
        if (gameSessionIdRef.current !== currentSession) return
        const aiUnit = readyAiAttackers[i]
        if (aiUnit.currentDef <= 0) continue

        const playerDefenders = updatedPlayerField.filter((u) => u.isDefender)
        const targetDefender = playerDefenders.length > 0 ? playerDefenders[0] : null
        const targetUnit = targetDefender || (updatedPlayerField.length > 0 ? updatedPlayerField[0] : null)
        const targetType = targetUnit ? 'unit' : 'leader'
        const targetId = targetUnit ? targetUnit.id : 'player_leader'

        // 1. AI Card Lunges Down (พุ่งลงมาตีการ์ดหรือแม่ทัพผู้เล่น)
        setAttackAnim({
          attackerId: aiUnit.id,
          targetType,
          targetId,
          isPlayer: false,
          damage: aiUnit.currentAtk
        })
        playSoundEffect(aiUnit.faction === 'sci_fi' ? 'laser' : 'fire', soundEnabled)

        // 2. Impact on player target after 260ms
        await new Promise((resolve) => setTimeout(resolve, 260))
        if (gameSessionIdRef.current !== currentSession) return

        setHitAnimTargetId(targetId)
        setFloatingSlash({ targetId, damage: aiUnit.currentAtk })

        if (targetUnit) {
          playSoundEffect(targetUnit.isDefender ? 'shield' : 'laser', soundEnabled)
          addLog(
            targetDefender
              ? `🤖 AI สั่ง [${aiUnit.thaiName}] พุ่งชนยูนิตสายรับของคุณ [${targetUnit.thaiName}]!`
              : `🤖 AI สั่ง [${aiUnit.thaiName}] พุ่งเข้าปะทะกับยูนิตของคุณ [${targetUnit.thaiName}]!`,
            'warning'
          )

          const enemyDmg = aiUnit.currentAtk
          const playerCounter = targetUnit.currentAtk

          targetUnit.currentDef -= enemyDmg
          aiUnit.currentDef -= playerCounter

          if (targetUnit.currentDef <= 0) {
            addLog(`💔 [${targetUnit.thaiName}] ของคุณถูกทำลายแล้ว!`, 'destroy')
            updatedPlayerField = updatedPlayerField.filter((u) => u.id !== targetDefender?.id && u.id !== targetUnit.id)
          }
          if (aiUnit.currentDef <= 0) {
            addLog(`💀 [${aiUnit.thaiName}] ของ AI ถูกทำลายสวนกลับ!`, 'destroy')
          }
        } else {
          // Attack player HP directly
          playSoundEffect('fire', soundEnabled)
          const dmg = aiUnit.currentAtk
          updatedPlayerHp = Math.max(0, updatedPlayerHp - dmg)
          addLog(`💥 สนามของคุณไม่มีการ์ดยูนิต! AI สั่ง [${aiUnit.thaiName}] พุ่งโจมตี HP คุณโดยตรง ${dmg} ดาเมจ!`, 'damage')
        }

        aiUnit.hasAttacked = true
        setPlayerField([...updatedPlayerField])
        setPlayerHp(updatedPlayerHp)
        setEnemyField([...updatedEnemyField.filter((u) => u.currentDef > 0)])

        // 3. Clear animation and pause briefly before next AI attack
        await new Promise((resolve) => setTimeout(resolve, 320))
        if (gameSessionIdRef.current !== currentSession) return

        setAttackAnim(null)
        setHitAnimTargetId(null)
        setFloatingSlash(null)

        if (updatedPlayerHp <= 0) break
        await new Promise((resolve) => setTimeout(resolve, 150))
      }

      if (gameSessionIdRef.current !== currentSession) return

      // Clean dead AI units
      currentEnemyField = updatedEnemyField.filter((u) => u.currentDef > 0)
      setEnemyField(currentEnemyField)

      // 4. Return turn to player
      setTimeout(() => {
        if (gameSessionIdRef.current !== currentSession) return

        setTurn((prev) => prev + 1)
        setCurrentPhase('summon') // เริ่มเทิร์นใหม่ด้วยเฟสลงการ์ดเสมอ

        // Player gains 1 Cost
        setPlayerCost((prevCost) => {
          const nextCost = prevCost + 1
          addLog(`✨ เทิร์นของคุณ (เทิร์นที่ ${turn + 1}): ได้รับ 1 Cost (มีทั้งหมด: ${nextCost} Cost) เข้าสู่เฟสลงการ์ด`, 'info')
          return nextCost
        })

        // Draw 1 card for player
        setPlayerDeck((prevDeck) => {
          if (prevDeck.length > 0) {
            const drawn = prevDeck[0]
            setPlayerHand((prevHand) =>
              prevHand.length < 7 ? [...prevHand, drawn] : prevHand
            )
            playSoundEffect('draw', soundEnabled)
            addLog(`🃏 คุณจั่วการ์ด [${drawn.thaiName}] เข้าสู่มือ`, 'info')
            return prevDeck.slice(1)
          }
          return prevDeck
        })

        // Reset player units readiness (ทุกตัวในสนามพร้อมโจมตีในรอบใหม่)
        setPlayerField((prev) =>
          prev.map((u) => ({ ...u, hasAttacked: false }))
        )

        setIsPlayerTurn(true)
      }, 600)
    }, 800)
  }

  // Copy prompt helper
  const handleCopyPrompt = (text) => {
    navigator.clipboard.writeText(text)
    setCopiedPrompt(true)
    setTimeout(() => setCopiedPrompt(false), 2000)
  }

  return (
    <div className="w-full flex flex-col h-[calc(100vh-4.25rem)] max-h-[calc(100vh-4.25rem)] bg-slate-950 text-white font-sans selection:bg-cyan-500 selection:text-black overflow-hidden select-none p-1.5 sm:p-2 gap-1.5">
      {/* Keyframe Animations for Card Attack Lunge & Hit Shake */}
      <style>{`
        @keyframes lungeUp {
          0% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-72px) scale(1.15) rotate(-3deg); filter: drop-shadow(0 0 25px rgba(239, 68, 68, 0.95)); z-index: 50; }
          70% { transform: translateY(-55px) scale(1.08); z-index: 50; }
          100% { transform: translateY(0) scale(1); z-index: 1; }
        }
        @keyframes lungeDown {
          0% { transform: translateY(0) scale(1); }
          40% { transform: translateY(72px) scale(1.15) rotate(3deg); filter: drop-shadow(0 0 25px rgba(244, 63, 94, 0.95)); z-index: 50; }
          70% { transform: translateY(55px) scale(1.08); z-index: 50; }
          100% { transform: translateY(0) scale(1); z-index: 1; }
        }
        @keyframes hitShake {
          0%, 100% { transform: translate(0, 0) scale(1); filter: none; }
          20% { transform: translate(-6px, 4px) scale(0.95); filter: brightness(2) drop-shadow(0 0 16px rgba(239, 68, 68, 0.9)); }
          40% { transform: translate(6px, -4px) scale(1.06); filter: brightness(2.2) drop-shadow(0 0 22px rgba(244, 63, 94, 1)); }
          60% { transform: translate(-4px, -2px) scale(0.98); }
          80% { transform: translate(3px, 2px) scale(1.02); }
        }
        @keyframes slashPop {
          0% { opacity: 0; transform: scale(0.4) rotate(-25deg); }
          50% { opacity: 1; transform: scale(1.25) rotate(0deg); }
          100% { opacity: 0; transform: scale(1.5) rotate(15deg); }
        }
        .animate-lunge-up {
          animation: lungeUp 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          z-index: 50 !important;
        }
        .animate-lunge-down {
          animation: lungeDown 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          z-index: 50 !important;
        }
        .animate-hit-shake {
          animation: hitShake 0.45s ease-in-out forwards;
        }
        .animate-slash-fx {
          animation: slashPop 0.45s ease-out forwards;
        }
      `}</style>

      {!gameStarted ? (
        <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto p-2 sm:p-4">
          <div className="w-full max-w-3xl bg-slate-900/95 border border-cyan-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-cyan-950/70 backdrop-blur-md flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Top Badge & Title */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-xl shadow-cyan-500/30 border border-cyan-400/40">
                <Swords className="w-7 h-7 text-cyan-200" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[11px] font-bold text-cyan-300">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>50-CARD STRATEGY BATTLE ARENA</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-sky-200 to-amber-300 bg-clip-text text-transparent">
                  TCG BATTLE ARENA
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                  ศึกประลองการ์ด Sci-Fi Cybernetics vs Dark Fantasy RPG ด้วยสำรับ 50 ใบ วางแผนคอส จัดแนวรุกและแนวรับ เพื่อโค่นล้มแม่ทัพศัตรู
                </p>
              </div>
            </div>

            {/* 3 Archetype Cards Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full text-left">
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-rose-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-black text-rose-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Swords className="w-3.5 h-3.5" />
                      สายบุก (Attacker)
                    </span>
                    <span className="text-[10px] bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-800/50">25 ใบ</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    ยูนิตพลังโจมตี ATK สูง (Sci-Fi Mech & Fantasy Monster) สำหรับเปิดฉากทะลวงแนวป้องกัน
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-rose-300/80 font-semibold">
                  • ATK 3 - 7 • บุกทะลวง
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/70 border border-sky-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-black text-sky-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5" />
                      สายรับ (Defender)
                    </span>
                    <span className="text-[10px] bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-800/50">15 ใบ</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    เกราะหนา DEF สูงพร้อมสกิล <strong className="text-sky-300">Taunt</strong> บังคับให้ศัตรูต้องโจมตีตัวนี้ก่อนเสมอ ปกป้องยูนิตอื่นและแม่ทัพ
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-sky-300/80 font-semibold">
                  • DEF 4 - 8 • มี Taunt ป้องกัน
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/70 border border-amber-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-black text-amber-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" />
                      เวทมนตร์ (Combat Spells)
                    </span>
                    <span className="text-[10px] bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/50">10 ใบ</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    สเปลล์บัฟพลังฉับพลัน +ATK ออร่าทอง หรือ +DEF โล่หกเหลี่ยม เพิ่มความได้เปรียบในการต่อสู้
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-amber-300/80 font-semibold">
                  • บัฟ ATK / DEF • พลิกเกม
                </div>
              </div>
            </div>

            {/* Quick Rules Overview */}
            <div className="w-full p-3 sm:p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-left text-xs space-y-1.5 text-slate-300">
              <div className="font-extrabold text-cyan-300 text-xs flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>กฎและขั้นตอนการเล่น (Game Rules)</span>
              </div>
              <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                <li><strong className="text-slate-200">1 Cost ทุกเทิร์น:</strong> ทุกครั้งที่เข้าเทิร์นตนเอง จะจั่วการ์ด 1 ใบ และได้รับ 1 Cost เพิ่มขึ้นเรื่อยๆ</li>
                <li><strong className="text-slate-200">เฟส 1 (เตรียมตัว):</strong> ลงยูนิตมอนสเตอร์ตาม Cost และร่ายสเปลล์ใส่ยูนิตเพื่อบัฟพลัง</li>
                <li><strong className="text-slate-200">เฟส 2 (โจมตี):</strong> กดปุ่มเริ่มโจมตี (Attack) เลือกมอนสเตอร์ของคุณ แล้วคลิกมอนสเตอร์ศัตรู หรือคลิก HP ศัตรู (ถ้าไม่มีมอนสเตอร์บนสนามจะไม่สามารถกดโจมตีได้)</li>
                <li><strong className="text-slate-200">โจมตี HP โดยตรง:</strong> ตีเข้าพลังชีวิตผู้เล่นได้ก็ต่อเมื่อบนสนามของศัตรูไม่มีมอนสเตอร์เหลืออยู่แล้ว</li>
                <li><strong className="text-slate-200">กฎเทิร์นแรก:</strong> ผู้เล่นที่เริ่มคนแรกจะยังไม่สามารถสั่งโจมตีได้ในเทิร์น 1</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full pt-1">
              <button
                onClick={() => {
                  startNewGame(true)
                  setGameStarted(true)
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm sm:text-base shadow-xl shadow-cyan-600/30 flex items-center justify-center gap-2 cursor-pointer transition transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>เข้าสู่สนามประลอง (เริ่มเล่นเกม)</span>
              </button>

              <button
                onClick={() => setIsDeckModalOpen(true)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>สารานุกรมเด็ค 50 ใบ</span>
              </button>

              {setCurrentPage && (
                <button
                  onClick={() => setCurrentPage('home')}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition"
                >
                  <Home className="w-4 h-4 text-slate-400" />
                  <span>กลับหน้าหลัก</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ------------------------------------------------------------- */}
          {/* 1. TOP COMPACT HEADER */}
          {/* ------------------------------------------------------------- */}
          <header className="h-9 sm:h-10 px-2.5 sm:px-3 bg-slate-900/90 backdrop-blur-md border border-cyan-500/20 rounded-xl flex items-center justify-between shadow-md shrink-0">
        {/* Left Title & Status */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white shadow-sm shadow-cyan-500/30 shrink-0">
            <Swords className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-xs sm:text-sm font-black tracking-tight bg-gradient-to-r from-cyan-400 via-sky-200 to-amber-300 bg-clip-text text-transparent">
              TCG ARENA
            </h1>
            <span className="text-[8.5px] font-bold px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-700/50 hidden sm:inline">
              50 CARDS
            </span>
          </div>
        </div>

        {/* Right Controls & Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Deck Encyclopedia Button */}
          <button
            onClick={() => setIsDeckModalOpen(true)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] sm:text-[11px] font-bold text-cyan-300 transition cursor-pointer"
            title="ดูสารานุกรมการ์ดทั้ง 50 ใบ และ Prompts"
          >
            <BookOpen className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">สารานุกรมเด็ค (50 ใบ)</span>
          </button>

          {/* Frame Theme Switcher */}
          <div className="hidden md:flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700 text-[10px]">
            <button
              onClick={() => setFrameTheme('auto')}
              className={`px-2 py-0.5 rounded-md font-semibold transition cursor-pointer ${
                frameTheme === 'auto' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="ใช้กรอบตามเผ่าของการ์ด (Sci-Fi / Fantasy)"
            >
              ออโต้
            </button>
            <button
              onClick={() => setFrameTheme('sci_fi')}
              className={`px-2 py-0.5 rounded-md font-semibold transition cursor-pointer ${
                frameTheme === 'sci_fi' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="บังคับใช้กรอบ Sci-Fi"
            >
              Sci-Fi
            </button>
            <button
              onClick={() => setFrameTheme('dark_fantasy')}
              className={`px-2 py-0.5 rounded-md font-semibold transition cursor-pointer ${
                frameTheme === 'dark_fantasy' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="บังคับใช้กรอบ Fantasy"
            >
              Fantasy
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1 sm:p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition cursor-pointer"
            title={soundEnabled ? 'ปิดเสียงเอฟเฟกต์' : 'เปิดเสียงเอฟเฟกต์'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-rose-400" />}
          </button>

          {/* Restart Button */}
          <button
            onClick={() => startNewGame(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] sm:text-[11px] font-bold shadow-sm shadow-cyan-600/30 transition cursor-pointer"
            title="เริ่มเกมใหม่ สลับการ์ดเริ่มต้น และสับเด็ค 50 ใบใหม่"
          >
            <RotateCcw className="w-3 h-3" />
            <span>เริ่มใหม่</span>
          </button>

          {/* Return to Lobby Button */}
          <button
            onClick={() => setGameStarted(false)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] sm:text-[11px] font-bold text-amber-300 transition cursor-pointer"
            title="กลับสู่หน้าล็อบบี้ (Lobby)"
          >
            <Home className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">ล็อบบี้</span>
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN BATTLE ARENA (FITS 1 SCREEN) */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-h-0 w-full gap-1.5 justify-between">
        {/* ========================================================= */}
        {/* ENEMY LEADER BAR (TOP) */}
        {/* ========================================================= */}
        <div
          onClick={() => handleAttackTarget('leader')}
          className={`relative h-10 sm:h-11 px-3 rounded-xl border flex items-center justify-between shrink-0 transition-all duration-300 overflow-hidden ${
            hitAnimTargetId === 'leader'
              ? 'animate-hit-shake ring-4 ring-rose-500 bg-rose-950/90 border-rose-500 shadow-xl shadow-rose-950'
              : enemyField.length > 0
              ? 'bg-slate-900/80 border-slate-800'
              : currentPhase === 'attack' && attackingUnitId
              ? 'bg-rose-950/80 border-rose-500/90 shadow-md shadow-rose-900/60 cursor-crosshair animate-pulse ring-2 ring-rose-500'
              : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          {/* Floating Impact Slash Effect */}
          {floatingSlash?.targetId === 'leader' && (
            <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none animate-slash-fx">
              <div className="flex items-center gap-1.5 bg-rose-600 text-white font-black px-3 py-1 rounded-full shadow-2xl text-xs animate-bounce border-2 border-rose-300">
                <Swords className="w-4 h-4 text-white" />
                <span>-{floatingSlash.damage} HP!</span>
              </div>
            </div>
          )}
          {/* Enemy Profile */}
          <div className="flex items-center gap-2">
            <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-rose-600 to-indigo-900 flex items-center justify-center shadow-sm shadow-rose-950 border border-rose-400/40 shrink-0">
              <Bot className="w-4 h-4 text-white" />
              {enemyField.length > 0 && (
                <div
                  className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-sky-500 text-white flex items-center justify-center shadow text-[8px]"
                  title={`มีกองทัพป้องกันอยู่ ${enemyField.length} ตัว!`}
                >
                  <ShieldAlert className="w-2.5 h-2.5" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-black text-xs text-slate-100">AI OVERLORD</span>
              {enemyField.length > 0 ? (
                <span className="text-[8.5px] font-bold px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-0.5">
                  <Shield className="w-2 h-2 text-sky-400" /> มียูนิตป้องกันอยู่ ({enemyField.length} ใบ)
                </span>
              ) : currentPhase === 'attack' && attackingUnitId ? (
                <span className="text-[8.5px] font-bold px-1.5 py-0.2 rounded-full bg-rose-600 text-white animate-bounce flex items-center gap-0.5">
                  <Crosshair className="w-2 h-2" /> สนามว่าง! คลิกโจมตี HP บอทได้เลย!
                </span>
              ) : (
                <span className="text-[8.5px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50 flex items-center gap-0.5">
                  สนามว่างเปล่า (ไม่มีตัวกัน HP)
                </span>
              )}

              {/* Enemy HP Bar */}
              <div className="flex items-center gap-1.5 ml-1.5">
                <div className="w-20 sm:w-28 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-rose-600 to-red-400 transition-all duration-300"
                    style={{ width: `${(enemyHp / enemyMaxHp) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-black text-rose-400 flex items-center gap-0.5">
                  <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                  {enemyHp}/{enemyMaxHp}
                </span>
              </div>
            </div>
          </div>

          {/* Enemy Energy & Deck Counter */}
          <div className="flex items-center gap-2 text-right">
            <div className="flex items-center gap-1 font-black text-xs text-amber-400" title="Cost ของ AI (+1 ทุกเทิร์น)">
              <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{enemyCost} Cost</span>
            </div>

            <div className="hidden sm:block pl-2 border-l border-slate-800 text-[10px] text-slate-400">
              มือ {enemyHandCount} • เด็ค {enemyDeck.length}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BATTLEFIELD LANES (MIDDLE AREA) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-1.5 sm:gap-2 flex-1 min-h-0 items-stretch">
          {/* Main Combat Field (9 Cols on Desktop) */}
          <div className="lg:col-span-9 flex flex-col justify-between gap-1 min-h-0">
            {/* ENEMY FIELD SLOTS */}
            <div className="bg-slate-900/40 rounded-xl border border-slate-800/80 p-1 flex-1 min-h-0 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[9.5px] text-slate-400 font-bold px-1 shrink-0">
                <span className="flex items-center gap-1">
                  <Bot className="w-3 h-3 text-rose-400" /> แนวรบฝั่งศัตรู ({enemyField.length}/4)
                </span>
                {enemyField.length > 0 ? (
                  <span className="text-amber-400 flex items-center gap-1 text-[9px]">
                    🛡️ ต้องกำจัดยูนิตบนสนามให้หมดก่อน จึงจะโจมตีเข้า HP ได้
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1 text-[9px]">
                    ⚡ ศัตรูไม่มีการ์ดวางอยู่ โจมตีเข้า HP ได้โดยตรง
                  </span>
                )}
              </div>

              {/* Field Cards Row */}
              <div className="grid grid-cols-4 gap-1.5 flex-1 min-h-0 items-center justify-items-center">
                {[0, 1, 2, 3].map((slotIdx) => {
                  const card = enemyField[slotIdx]
                  if (!card) {
                    return (
                      <div
                        key={`enemy_empty_${slotIdx}`}
                        className="w-full max-w-[110px] sm:max-w-[120px] h-full max-h-[140px] rounded-xl border-2 border-dashed border-slate-800/60 flex items-center justify-center text-slate-700 text-[9px] font-bold"
                      >
                        ว่าง
                      </div>
                    )
                  }

                  const enemyHasDefender = enemyField.some((u) => u.isDefender)
                  const isValidTarget =
                    attackingUnitId &&
                    (!enemyHasDefender || card.isDefender)
                  const isCurrentlyAttacking = attackAnim?.attackerId === card.id && !attackAnim?.isPlayer
                  const isCurrentlyHit = hitAnimTargetId === card.id

                  return (
                    <div
                      key={card.id}
                      className={`relative flex justify-center items-center h-full max-h-[140px] transition-transform duration-200 ${
                        isCurrentlyAttacking ? 'animate-lunge-down z-40' : ''
                      } ${isCurrentlyHit ? 'animate-hit-shake z-30' : ''}`}
                    >
                      <TCGCard
                        card={card}
                        themeOverride={frameTheme}
                        size="field"
                        isValidTarget={isValidTarget}
                        onClick={() => handleAttackTarget('unit', card)}
                        onInspect={(c) => setInspectedCard(c)}
                      />

                      {/* Floating Impact Slash Effect */}
                      {floatingSlash?.targetId === card.id && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none animate-slash-fx">
                          <div className="flex flex-col items-center">
                            <Swords className="w-8 h-8 text-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,1)] animate-bounce" />
                            <span className="text-[11px] font-black text-white drop-shadow-[0_0_8px_rgba(239,68,68,1)] bg-rose-600/95 px-2 py-0.5 rounded-full border border-rose-300 shadow-xl">
                              -{floatingSlash.damage}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* COMBAT CLASH DIVIDER WITH ACTION PROMPT */}
            <div className="h-6 px-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between text-[9.5px] sm:text-[10.5px] shrink-0">
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isPlayerTurn ? 'bg-cyan-400 animate-ping' : 'bg-rose-500'
                  }`}
                />
                <span className="font-extrabold text-slate-200">
                  {isPlayerTurn
                    ? `เทิร์น ${turn}: ${currentPhase === 'summon' ? '【1. เฟสลงการ์ด】' : '【2. เฟสโจมตี】'}`
                    : '🤖 ตาของศัตรู (AI กำลังเดินหมาก...)'}
                </span>
              </div>

              <div className="text-[9px] text-slate-400 truncate max-w-[65%]">
                {turn === 1 && isPlayerTurn
                  ? '⚠️ เทิร์นแรกเริ่มก่อน ยังไม่สามารถโจมตีได้ (ลงการ์ดแล้วจบเทิร์น)'
                  : targetingSpell
                  ? '⚡ เลือกยูนิตฝั่งคุณเพื่อรับสเปลล์บัฟ'
                  : attackingUnitId
                  ? enemyField.length > 0
                    ? `🎯 คลิกยูนิตศัตรูที่ต้องการโจมตี (ต้องเคลียร์การ์ดให้หมดก่อนตี HP ศัตรู)`
                    : '🎯 สนามศัตรูว่างเปล่า! คลิกที่แม่ทัพ AI ด้านบนเพื่อโจมตีเข้า HP โดยตรง'
                  : isPlayerTurn
                  ? currentPhase === 'summon'
                    ? `ลงตัวละครตามคอส (มีมอนสเตอร์ ${playerField.length} ตัว เมื่อลงเสร็จกด "เริ่มโจมตี")`
                    : `คลิกมอนสเตอร์ที่พร้อมตี (กรอบทอง) เพื่อสั่งโจมตี (เหลือ ${playerField.filter((u) => !u.hasAttacked).length} ตัว)`
                  : 'รอสักครู่...'}
              </div>
            </div>

            {/* PLAYER FIELD SLOTS */}
            <div className="bg-slate-900/40 rounded-xl border border-slate-800/80 p-1 flex-1 min-h-0 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[9.5px] text-slate-400 font-bold px-1 shrink-0">
                <span className="flex items-center gap-1 text-cyan-400">
                  <User className="w-3 h-3" /> แนวรบฝั่งของคุณ ({playerField.length}/4)
                </span>
                <span className="text-slate-500 hidden sm:inline text-[9px]">
                  {currentPhase === 'summon'
                    ? 'อยู่ในเฟสลงการ์ด (ยังโจมตีไม่ได้)'
                    : 'อยู่ในเฟสโจมตี: คลิกยูนิตกรอบทองเพื่อโจมตี'}
                </span>
              </div>

              {/* Player Field Row */}
              <div className="grid grid-cols-4 gap-1.5 flex-1 min-h-0 items-center justify-items-center">
                {[0, 1, 2, 3].map((slotIdx) => {
                  const card = playerField[slotIdx]
                  if (!card) {
                    return (
                      <div
                        key={`player_empty_${slotIdx}`}
                        className="w-full max-w-[110px] sm:max-w-[120px] h-full max-h-[140px] rounded-xl border-2 border-dashed border-slate-800/60 flex items-center justify-center text-slate-700 text-[9px] font-bold"
                      >
                        ว่าง
                      </div>
                    )
                  }

                  const isReady =
                    isPlayerTurn &&
                    turn > 1 &&
                    currentPhase === 'attack' &&
                    !card.hasAttacked
                  const isAttacking = attackingUnitId === card.id
                  const isSpellTarget = targetingSpell !== null
                  const isCurrentlyAttacking = attackAnim?.attackerId === card.id && attackAnim?.isPlayer
                  const isCurrentlyHit = hitAnimTargetId === card.id

                  return (
                    <div
                      key={card.id}
                      className={`relative flex justify-center items-center h-full max-h-[140px] transition-transform duration-200 ${
                        isCurrentlyAttacking ? 'animate-lunge-up z-40' : ''
                      } ${isCurrentlyHit ? 'animate-hit-shake z-30' : ''}`}
                    >
                      <TCGCard
                        card={card}
                        themeOverride={frameTheme}
                        size="field"
                        isAttacker={isAttacking}
                        isSelected={isReady && !isAttacking}
                        isValidTarget={isSpellTarget}
                        className={`${card.hasAttacked ? 'opacity-65 grayscale-[35%]' : ''}`}
                        onClick={() => {
                          if (targetingSpell) {
                            handleApplySpell(card)
                          } else {
                            handleSelectAttackingUnit(card)
                          }
                        }}
                        onInspect={(c) => setInspectedCard(c)}
                      />

                      {/* Ready to Attack Indicator */}
                      {isReady && !isAttacking && (
                        <div className="absolute -top-1.5 -right-1.5 z-20 bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 text-[7.5px] font-black px-1.5 py-0.2 rounded-full shadow-md animate-bounce pointer-events-none flex items-center gap-0.5">
                          <Swords className="w-2 h-2" />
                          <span>พร้อมตี</span>
                        </div>
                      )}

                      {/* Already Attacked Badge */}
                      {card.hasAttacked && (
                        <div className="absolute top-1 left-1 z-20 bg-slate-900/90 text-slate-400 text-[7.5px] font-bold px-1.5 py-0.2 rounded border border-slate-700 pointer-events-none">
                          โจมตีแล้ว
                        </div>
                      )}

                      {/* Floating Impact Slash Effect */}
                      {floatingSlash?.targetId === card.id && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none animate-slash-fx">
                          <div className="flex flex-col items-center">
                            <Swords className="w-8 h-8 text-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,1)] animate-bounce" />
                            <span className="text-[11px] font-black text-white drop-shadow-[0_0_8px_rgba(239,68,68,1)] bg-rose-600/95 px-2 py-0.5 rounded-full border border-rose-300 shadow-xl">
                              -{floatingSlash.damage}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* COMBAT LOGS & TACTICAL FEED (Right 3 Cols on Desktop) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col bg-slate-900/80 rounded-xl border border-slate-800 p-2 min-h-0 overflow-hidden">
            <div className="flex items-center gap-1.5 pb-1 border-b border-slate-800 text-[10.5px] font-extrabold text-cyan-400 shrink-0">
              <Activity className="w-3.5 h-3.5" />
              <span>บันทึกการต่อสู้ (Combat Log)</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 py-1 text-[9.5px] font-mono pr-0.5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-700">
              {combatLog.map((log) => (
                <div
                  key={log.id}
                  className={`p-1 rounded border leading-tight ${
                    log.type === 'damage'
                      ? 'bg-rose-950/40 text-rose-300 border-rose-900/40'
                      : log.type === 'buff'
                      ? 'bg-amber-950/40 text-amber-300 border-amber-900/40'
                      : log.type === 'action'
                      ? 'bg-cyan-950/40 text-cyan-300 border-cyan-900/40'
                      : log.type === 'warning'
                      ? 'bg-yellow-950/40 text-yellow-300 border-yellow-900/40'
                      : log.type === 'destroy'
                      ? 'bg-red-950/50 text-red-400 border-red-800/40'
                      : log.type === 'victory'
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500 font-bold'
                      : 'bg-slate-950/40 text-slate-300 border-slate-800'
                  }`}
                >
                  {log.text}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>

            {/* Quick Rules Legend */}
            <div className="pt-1 border-t border-slate-800 text-[8.5px] text-slate-400 space-y-0.5 shrink-0">
              <p>• ได้รับ 1 Cost ทุกเทิร์น</p>
              <p>• มีมอนสเตอร์กี่ตัวก็สั่งตีได้ตามจำนวนตัว (ตัวละ 1 ครั้งต่อรอบ)</p>
              <p>• ตีเข้า HP ได้ก็ต่อเมื่อศัตรูไม่มีการ์ดวางอยู่</p>
              <p>• เทิร์นแรกที่เริ่มก่อนยังโจมตีไม่ได้</p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PLAYER LEADER BAR & HAND (BOTTOM AREA) */}
        {/* ========================================================= */}
        <div
          className={`bg-slate-900/90 rounded-xl border border-slate-800 p-1.5 sm:p-2 flex flex-col gap-1 shrink-0 relative transition-all duration-300 overflow-hidden ${
            hitAnimTargetId === 'player_leader'
              ? 'animate-hit-shake ring-4 ring-rose-500 bg-rose-950/90 border-rose-500 shadow-xl shadow-rose-950'
              : ''
          }`}
        >
          {/* Floating Impact Slash Effect */}
          {floatingSlash?.targetId === 'player_leader' && (
            <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none animate-slash-fx">
              <div className="flex items-center gap-1.5 bg-rose-600 text-white font-black px-3 py-1 rounded-full shadow-2xl text-xs animate-bounce border-2 border-rose-300">
                <Swords className="w-4 h-4 text-white" />
                <span>-{floatingSlash.damage} HP!</span>
              </div>
            </div>
          )}
          {/* Player Leader Info & End Turn Button */}
          <div className="flex items-center justify-between">
            {/* Player Profile & HP */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white shadow-sm shadow-cyan-950 border border-cyan-400/40 shrink-0">
                <User className="w-4 h-4" />
              </div>

              <div className="flex items-center gap-2">
                <span className="font-black text-xs text-cyan-200">คุณ (ผู้เล่น)</span>
                <span className="text-[8.5px] font-bold px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-700/50">
                  เด็ค {playerDeck.length} ใบ
                </span>

                {/* HP Bar */}
                <div className="flex items-center gap-1.5 ml-1">
                  <div className="w-20 sm:w-28 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
                      style={{ width: `${(playerHp / playerMaxHp) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-emerald-400 flex items-center gap-0.5">
                    <Heart className="w-2.5 h-2.5 fill-emerald-500 text-emerald-500" />
                    {playerHp}/{playerMaxHp}
                  </span>
                </div>
              </div>
            </div>

            {/* Energy Core & Turn Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Cost Meter */}
              <div className="flex items-center gap-1 font-black text-xs sm:text-sm text-amber-400" title="ได้รับ 1 Cost ทุกเทิร์น">
                <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{playerCost} Cost</span>
              </div>

              {/* Action Buttons based on Turn and Phase */}
              <div className="flex items-center gap-1.5">
                {turn === 1 ? (
                  <button
                    disabled={!isPlayerTurn || gameOver}
                    onClick={handleEndTurn}
                    className="px-3 sm:px-4 py-1.5 rounded-lg font-black text-[11px] bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-sm transition cursor-pointer"
                    title="เทิร์นแรกเริ่มก่อน ยังไม่สามารถโจมตีได้ตามกฎ"
                  >
                    {isPlayerTurn ? 'จบเทิร์น 1 (เทิร์นแรกโจมตีไม่ได้)' : 'รอศัตรู...'}
                  </button>
                ) : currentPhase === 'summon' ? (
                  <>
                    <button
                      disabled={!isPlayerTurn || gameOver || playerField.length === 0}
                      onClick={handleEnterAttackPhase}
                      className={`flex items-center gap-1 px-3 sm:px-4 py-1.5 rounded-lg font-black text-[11px] tracking-wide transition cursor-pointer ${
                        playerField.length === 0
                          ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                          : 'bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white shadow-md shadow-rose-600/30 scale-[1.02] active:scale-95 animate-pulse'
                      }`}
                      title={playerField.length === 0 ? 'ไม่มีมอนสเตอร์บนสนาม ไม่สามารถโจมตีได้' : 'ลงตัวละครเสร็จแล้ว กดเพื่อเข้าสู่เฟสโจมตี'}
                    >
                      <Swords className="w-3 h-3" />
                      <span>
                        {playerField.length === 0
                          ? 'ไม่มีมอน (ตีไม่ได้)'
                          : `เริ่มโจมตี (Attack • พร้อม ${playerField.filter((u) => !u.hasAttacked).length} ตัว)`}
                      </span>
                    </button>
                    <button
                      disabled={!isPlayerTurn || gameOver}
                      onClick={handleEndTurn}
                      className="px-2.5 py-1.5 rounded-lg font-bold text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                      title="ข้ามการโจมตีแล้วจบเทิร์นทันที"
                    >
                      จบเทิร์น
                    </button>
                  </>
                ) : (
                  <button
                    disabled={!isPlayerTurn || gameOver}
                    onClick={handleEndTurn}
                    className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg font-black text-[11px] tracking-wide bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 hover:from-amber-400 hover:to-yellow-300 shadow-amber-500/30 scale-[1.02] active:scale-95 transition cursor-pointer"
                    title="สิ้นสุดเทิร์นโจมตีของคุณ"
                  >
                    <span>{isPlayerTurn ? 'สิ้นสุดเทิร์น (End Turn)' : 'รอศัตรู...'}</span>
                    {isPlayerTurn && playerField.filter((u) => !u.hasAttacked).length > 0 && (
                      <span className="text-[9px] font-black bg-stone-950/20 px-1 py-0.2 rounded-full">
                        ยังตีได้อีก {playerField.filter((u) => !u.hasAttacked).length} ตัว
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* PLAYER HAND CARDS */}
          <div className="pt-0.5">
            <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold mb-0.5 px-0.5">
              <span className="flex items-center gap-1 text-cyan-400">
                <Layers className="w-2.5 h-2.5" /> การ์ดในมือ ({playerHand.length}/7 ใบ)
              </span>
              <span className="text-[8.5px] text-slate-500 hidden sm:inline">
                {currentPhase === 'summon'
                  ? 'เฟสลงการ์ด: คลิกการ์ดที่มีคอสพอเพื่อลงสนาม'
                  : 'เฟสโจมตี: ไม่สามารถลงการ์ดยูนิตเพิ่มได้'}
              </span>
            </div>

            {playerHand.length === 0 ? (
              <div className="py-2.5 text-center text-slate-600 border border-dashed border-slate-800 rounded-lg text-[9px]">
                ไม่มีการ์ดในมือ (จั่วอัตโนมัติในเทิร์นหน้า)
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-0.5 px-0.5 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-slate-700">
                {playerHand.map((card) => {
                  const isPlayable = isPlayerTurn && currentPhase === 'summon' && card.cost <= playerCost
                  const isSelected = selectedHandCard?.id === card.id

                  return (
                    <div key={card.id} className="shrink-0 transform hover:-translate-y-1 transition-transform duration-200">
                      <TCGCard
                        card={card}
                        themeOverride={frameTheme}
                        size="hand"
                        isPlayable={isPlayable}
                        isSelected={isSelected}
                        onClick={() => handleSelectHandCard(card)}
                        onInspect={(c) => setInspectedCard(c)}
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )}

      {/* ============================================================= */}
      {/* 2.5 MULLIGAN PHASE MODAL (สลับการ์ดเริ่มต้น / ค้นหาการ์ด 1 Cost) */}
      {/* ============================================================= */}
      {isMulligan && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-cyan-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-cyan-950/70 flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 border border-cyan-400/40">
                <RotateCcw className="w-6 h-6 text-cyan-200" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-cyan-400 via-sky-200 to-amber-300 bg-clip-text text-transparent">
                สลับเปลี่ยนการ์ดเริ่มต้น (MULLIGAN PHASE)
              </h2>
              <p className="text-xs text-slate-300 max-w-lg">
                คลิกที่การ์ดเพื่อ <span className="text-rose-400 font-bold">เลือกเปลี่ยนออก</span> (จะนำกลับเข้าสำรับ สับเด็ค และจั่วใหม่) หรือกดเปลี่ยนทั้งมือ เพื่อค้นหาการ์ด 1 Cost สำหรับลงสนามในเทิร์นแรก
              </p>
            </div>

            {/* 4 Opening Cards Selection Area */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full justify-items-center py-1">
              {playerHand.map((card) => {
                const isSelectedForRedraw = selectedMulliganIds.includes(card.id)
                const isOneCost = card.cost === 1

                return (
                  <div
                    key={card.id}
                    onClick={() => handleToggleMulliganCard(card.id)}
                    className="relative flex flex-col items-center cursor-pointer group select-none"
                  >
                    {/* Status Badge above Card */}
                    <div className="mb-1">
                      {isSelectedForRedraw ? (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-md animate-pulse flex items-center gap-0.5">
                          <RotateCcw className="w-2.5 h-2.5" /> เปลี่ยนออก
                        </span>
                      ) : isOneCost ? (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-md flex items-center gap-0.5 animate-pulse">
                          <Sparkles className="w-2.5 h-2.5" /> 1 Cost (แนะนำ)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-0.5">
                          <Check className="w-2.5 h-2.5 text-cyan-400" /> เก็บไว้
                        </span>
                      )}
                    </div>

                    {/* Card Container with Selection Highlight */}
                    <div
                      className={`relative rounded-2xl transition-all duration-200 transform ${
                        isSelectedForRedraw
                          ? 'ring-4 ring-rose-500 scale-95 opacity-70 grayscale-[20%]'
                          : isOneCost
                          ? 'ring-4 ring-emerald-400/90 shadow-lg shadow-emerald-500/30 scale-100 group-hover:scale-105'
                          : 'ring-2 ring-cyan-500/40 group-hover:scale-105'
                      }`}
                    >
                      <TCGCard
                        card={card}
                        themeOverride={frameTheme}
                        size="field"
                        onInspect={(c) => setInspectedCard(c)}
                      />

                      {/* Redraw Overlay Indicator */}
                      {isSelectedForRedraw && (
                        <div className="absolute inset-0 bg-rose-950/60 backdrop-blur-[1px] rounded-2xl flex flex-col items-center justify-center text-white pointer-events-none gap-1">
                          <RotateCcw className="w-8 h-8 text-rose-400 animate-spin" style={{ animationDuration: '3s' }} />
                          <span className="font-black text-xs text-rose-200">นำกลับเข้าเด็ค</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full pt-1">
              <button
                onClick={() => handleConfirmMulligan(true)}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>ยืนยันมือนี้ (ไม่เปลี่ยนการ์ด)</span>
              </button>

              <button
                disabled={selectedMulliganIds.length === 0}
                onClick={() => handleConfirmMulligan(false)}
                className={`w-full sm:flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedMulliganIds.length > 0
                    ? 'bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-lg shadow-rose-600/30'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-50'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>เปลี่ยนเฉพาะที่เลือก ({selectedMulliganIds.length} ใบ)</span>
              </button>

              <button
                onClick={handleRedrawAllMulligan}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-cyan-600/30 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>เปลี่ยนทั้งมือ (4 ใบ)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 3. CARD ZOOM INSPECTOR & PROMPT MODAL */}
      {/* ============================================================= */}
      {inspectedCard && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-cyan-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setInspectedCard(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left: High-Res Card Rendering */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <TCGCard
                card={inspectedCard}
                themeOverride={frameTheme}
                size="zoom"
              />
              <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                <span>สลับสไตล์พรีวิว:</span>
                <button
                  onClick={() => setFrameTheme('sci_fi')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    frameTheme === 'sci_fi' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Sci-Fi
                </button>
                <button
                  onClick={() => setFrameTheme('dark_fantasy')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    frameTheme === 'dark_fantasy' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Dark Fantasy
                </button>
              </div>
            </div>

            {/* Right: Card Lore, Stats & AI Prompt Details */}
            <div className="flex-1 flex flex-col justify-between space-y-4 text-left">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      inspectedCard.type === 'attacker'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : inspectedCard.type === 'defender'
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {inspectedCard.type === 'attacker'
                      ? '⚔️ สายบุก (ATK สูง)'
                      : inspectedCard.type === 'defender'
                      ? '🛡️ สายรับ (DEF สูง / Taunt)'
                      : '✨ สเปลล์เสริมพลัง'}
                  </span>
                  <span className="text-xs text-slate-400">
                    เผ่า: {inspectedCard.faction === 'sci_fi' ? 'Sci-Fi Cybernetic' : 'Dark Fantasy Gothic'}
                  </span>
                </div>

                <h2 className="text-2xl font-black text-white mt-1">
                  {inspectedCard.thaiName}
                </h2>
                <p className="text-sm text-cyan-400 font-mono">{inspectedCard.name}</p>

                {/* Stats Breakdown */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block">ใช้พลังงาน</span>
                    <span className="text-lg font-black text-cyan-400">{inspectedCard.cost} คอร์</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block">พลังโจมตี (ATK)</span>
                    <span className="text-lg font-black text-rose-400">{inspectedCard.atk}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block">พลังป้องกัน (DEF)</span>
                    <span className="text-lg font-black text-sky-400">{inspectedCard.def}</span>
                  </div>
                </div>

                {/* Description / Effect */}
                <div className="mt-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-xs font-bold text-slate-300 block mb-1">ความสามารถ & คำอธิบาย:</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{inspectedCard.desc}</p>
                </div>

                {/* Midjourney / SD Prompt Section (ตามคำขอ) */}
                <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-cyan-500/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Prompt สำหรับสร้างภาพการ์ดนี้:
                    </span>
                    <button
                      onClick={() => handleCopyPrompt(inspectedCard.promptText)}
                      className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg bg-cyan-600/30 text-cyan-300 hover:bg-cyan-600 hover:text-white transition cursor-pointer"
                    >
                      {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedPrompt ? 'คัดลอกแล้ว!' : 'คัดลอก Prompt'}
                    </button>
                  </div>
                  <p className="text-[11px] font-mono text-slate-300 bg-black/60 p-2.5 rounded-lg border border-slate-800 select-all leading-relaxed">
                    {inspectedCard.promptText}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setInspectedCard(null)}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold cursor-pointer transition"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 4. FULL 50-CARD DECK ENCYCLOPEDIA MODAL */}
      {/* ============================================================= */}
      {isDeckModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-5xl bg-slate-900 border border-cyan-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-600 flex items-center justify-center text-white">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white">
                    สารานุกรมเด็คการ์ด 50 ใบ (TCG Deck Encyclopedia)
                  </h2>
                  <p className="text-xs text-slate-400">
                    25 สายบุก • 15 สายรับ • 10 สเปลล์ • สลับกรอบ Sci-Fi / Dark Fantasy ได้อิสระ
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsDeckModalOpen(false)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 py-3 shrink-0">
              <button
                onClick={() => setDeckFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  deckFilter === 'all'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ทั้งหมด (50 ใบ)
              </button>
              <button
                onClick={() => setDeckFilter('attacker')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  deckFilter === 'attacker'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ยูนิตสายบุก (25 ใบ)
              </button>
              <button
                onClick={() => setDeckFilter('defender')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  deckFilter === 'defender'
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ยูนิตสายรับ / Taunt (15 ใบ)
              </button>
              <button
                onClick={() => setDeckFilter('spell')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  deckFilter === 'spell'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                สเปลล์บัฟ / คอมแบททริค (10 ใบ)
              </button>
            </div>

            {/* Card Grid */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-1">
                {MASTER_CARD_DEFINITIONS.filter((c) =>
                  deckFilter === 'all' ? true : c.type === deckFilter
                ).map((card) => (
                  <div
                    key={card.templateId}
                    className="flex flex-col items-center p-2 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/50 transition duration-200"
                  >
                    <TCGCard
                      card={card}
                      themeOverride={frameTheme}
                      size="sm"
                      onClick={() => setInspectedCard(card)}
                      onInspect={() => setInspectedCard(card)}
                    />
                    <div className="mt-2 text-center">
                      <span className="text-[10px] text-cyan-400 font-bold block">
                        ใส่ในเด็ค: {card.copies} ใบ
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 5. GAME OVER MODAL (VICTORY / DEFEAT) */}
      {/* ============================================================= */}
      {gameOver && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-cyan-500/50 rounded-3xl p-6 text-center shadow-2xl space-y-4 animate-in fade-in zoom-in duration-300">
            <div
              className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-xl ${
                gameOver === 'victory'
                  ? 'bg-amber-500 text-stone-950 shadow-amber-500/30'
                  : 'bg-rose-600 text-white shadow-rose-600/30'
              }`}
            >
              {gameOver === 'victory' ? (
                <Trophy className="w-10 h-10 animate-bounce" />
              ) : (
                <Skull className="w-10 h-10" />
              )}
            </div>

            <div>
              <h2
                className={`text-2xl font-black ${
                  gameOver === 'victory' ? 'text-amber-400' : 'text-rose-400'
                }`}
              >
                {gameOver === 'victory' ? 'VICTORY! ชัยชนะเป็นของคุณ' : 'DEFEAT! พ่ายแพ้ในการรบ'}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                {gameOver === 'victory'
                  ? 'คุณใช้กลยุทธ์สายบุกและสายรับประสานงานกันได้อย่างยอดเยี่ยม!'
                  : 'พลังชีวิตของคุณลดเหลือ 0 ปรับแผนเด็คแล้วลองสู้ใหม่อีกครั้ง!'}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>จำนวนเทิร์นที่เล่น:</span>
                <span className="font-bold text-white">{turn} เทิร์น</span>
              </div>
              <div className="flex justify-between">
                <span>พลังชีวิตของคุณคงเหลือ:</span>
                <span className="font-bold text-emerald-400">{playerHp} HP</span>
              </div>
              <div className="flex justify-between">
                <span>พลังชีวิตของศัตรู:</span>
                <span className="font-bold text-rose-400">{enemyHp} HP</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => startNewGame(true)}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-cyan-600/30 transition cursor-pointer"
              >
                เล่นใหม่อีกครั้ง (Play Again)
              </button>
              <button
                onClick={() => {
                  setGameOver(null)
                  setGameStarted(false)
                }}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-xs sm:text-sm border border-slate-700 transition cursor-pointer"
              >
                กลับล็อบบี้
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

