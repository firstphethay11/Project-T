import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise'

const app = express()
const PORT = process.env.PORT || 5001

app.use(cors())
app.use(express.json())

// ตั้งค่าการเชื่อมต่อ MySQL ของ Project-T
// รองรับทั้งรันข้างนอก Docker (localhost:3307) และรันข้างใน Docker (project_t_mysql:3306)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3307,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'project_t_db',
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
})

// ==========================================
// ✈️ ระบบ Live Telemetry เรดาร์การบินน่านฟ้าไทย (OpenSky ADS-B Proxy)
// ==========================================
function detectAirline(callsign, country) {
  const cs = (callsign || '').toUpperCase().trim()
  if (cs.startsWith('THA')) {
    return { name: 'การบินไทย (Thai Airways)', code: 'THA', isThai: true, color: '#6d28d9' }
  }
  if (cs.startsWith('AIQ') || cs.startsWith('FDX')) {
    return { name: 'ไทยแอร์เอเชีย (Thai AirAsia)', code: 'AIQ', isThai: true, color: '#dc2626' }
  }
  if (cs.startsWith('AXM')) {
    return { name: 'แอร์เอเชีย มาเลเซีย (AirAsia)', code: 'AXM', isThai: false, color: '#dc2626' }
  }
  if (cs.startsWith('NOK')) {
    return { name: 'นกแอร์ (Nok Air)', code: 'NOK', isThai: true, color: '#ca8a04' }
  }
  if (cs.startsWith('BKP')) {
    return { name: 'บางกอกแอร์เวย์ส (Bangkok Airways)', code: 'BKP', isThai: true, color: '#0284c7' }
  }
  if (cs.startsWith('TVJ')) {
    return { name: 'ไทยเวียตเจ็ท (Thai Vietjet)', code: 'TVJ', isThai: true, color: '#ef4444' }
  }
  if (cs.startsWith('TLM')) {
    return { name: 'ไทยไลออนแอร์ (Thai Lion Air)', code: 'TLM', isThai: true, color: '#ea580c' }
  }
  if (cs.startsWith('SIA') || cs.startsWith('SQ')) {
    return { name: 'สิงคโปร์แอร์ไลน์ส (Singapore Airlines)', code: 'SIA', isThai: false, color: '#1e3a8a' }
  }
  if (cs.startsWith('MAS') || cs.startsWith('MH')) {
    return { name: 'มาเลเซียแอร์ไลน์ส (Malaysia Airlines)', code: 'MAS', isThai: false, color: '#dc2626' }
  }
  if (cs.startsWith('CPA') || cs.startsWith('CX')) {
    return { name: 'คาเธ่ย์ แปซิฟิก (Cathay Pacific)', code: 'CPA', isThai: false, color: '#047857' }
  }
  if (cs.startsWith('UAE') || cs.startsWith('EK')) {
    return { name: 'เอมิเรตส์ (Emirates)', code: 'UAE', isThai: false, color: '#dc2626' }
  }
  if (cs.startsWith('QTR') || cs.startsWith('QR')) {
    return { name: 'กาตาร์ แอร์เวย์ส (Qatar Airways)', code: 'QTR', isThai: false, color: '#701a75' }
  }
  if (cs.startsWith('AIC')) {
    return { name: 'แอร์อินเดีย (Air India)', code: 'AIC', isThai: false, color: '#ea580c' }
  }
  if (cs.startsWith('CES') || cs.startsWith('CCA') || cs.startsWith('CSN')) {
    return { name: 'สายการบินจีนพาณิชย์', code: 'CHN', isThai: false, color: '#b91c1c' }
  }
  if (cs.startsWith('JAL') || cs.startsWith('ANA')) {
    return { name: 'สายการบินญี่ปุ่น (JAL/ANA)', code: 'JPN', isThai: false, color: '#be123c' }
  }
  if (cs.startsWith('KAL') || cs.startsWith('AAR')) {
    return { name: 'สายการบินเกาหลี (KAL/Asiana)', code: 'KOR', isThai: false, color: '#0369a1' }
  }
  if (country === 'Thailand') {
    return { name: 'การบินพาณิชย์ไทย (ทั่วไป)', code: 'THA-GEN', isThai: true, color: '#2563eb' }
  }
  return {
    name: country ? `เที่ยวบินสากล (${country})` : 'สายการบินพาณิชย์สากล',
    code: 'INTL',
    isThai: false,
    color: '#475569',
  }
}

// In-memory cache for OpenSky Network
let flightCache = {
  timestamp: 0,
  payload: null,
}

app.get('/api/flights', async (req, res) => {
  const now = Date.now()
  const isForce = req.query.force === 'true'
  const minInterval = isForce ? 4000 : 10000

  if (flightCache.payload && now - flightCache.timestamp < minInterval) {
    return res.json({
      ...flightCache.payload,
      cached: true,
      ageMs: now - flightCache.timestamp,
    })
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 7500)

    const url = 'https://opensky-network.org/api/states/all?lamin=5.0&lomin=96.0&lamax=21.0&lomax=107.0'
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Project-T-LiveMap/1.0',
        Accept: 'application/json',
      },
    })
    clearTimeout(timeout)

    if (!response.ok) {
      if (flightCache.payload) {
        return res.json({
          ...flightCache.payload,
          cached: true,
          notice: `OpenSky HTTP ${response.status}, serving cached telemetry`,
        })
      }
      return res.status(response.status).json({
        error: `OpenSky Network error: ${response.statusText}`,
      })
    }

    const data = await response.json()
    const rawStates = data.states || []

    const flights = rawStates
      .filter((s) => s[5] !== null && s[6] !== null)
      .map((s) => {
        const callsign = (s[1] || '').trim()
        const airlineInfo = detectAirline(callsign, s[2])
        const altMeters = s[7]
        const velMs = s[9]

        return {
          icao24: s[0],
          callsign: callsign || 'N/A',
          airline: airlineInfo.name,
          airlineCode: airlineInfo.code,
          airlineColor: airlineInfo.color,
          isThaiAirline: airlineInfo.isThai,
          country: s[2] || 'Unknown',
          timePosition: s[3],
          lastContact: s[4],
          lng: Number(s[5]),
          lat: Number(s[6]),
          altitudeMeters: altMeters !== null ? Math.round(altMeters) : 0,
          altitudeFeet: altMeters !== null ? Math.round(altMeters * 3.28084) : 0,
          onGround: Boolean(s[8]),
          velocityKmh: velMs !== null ? Math.round(velMs * 3.6) : 0,
          heading: s[10] !== null ? Math.round(s[10]) : 0,
          verticalRateFpm: s[11] !== null ? Math.round(s[11] * 196.85) : 0,
          squawk: s[14] || null,
        }
      })

    const payload = {
      success: true,
      count: flights.length,
      thaiCount: flights.filter((f) => f.isThaiAirline).length,
      intlCount: flights.filter((f) => !f.isThaiAirline).length,
      timestamp: now,
      updatedTime: new Date(now).toLocaleTimeString('th-TH'),
      flights,
    }

    flightCache = {
      timestamp: now,
      payload,
    }

    res.json({
      ...payload,
      cached: false,
    })
  } catch (err) {
    if (flightCache.payload) {
      return res.json({
        ...flightCache.payload,
        cached: true,
        notice: `Network issue (${err.message}), serving cached telemetry`,
      })
    }
    res.status(502).json({ error: 'Failed to fetch flight telemetry', details: err.message })
  }
})

// ==========================================
// 🌦️ ระบบ Live Weather & PM2.5 Telemetry (Open-Meteo Public API)
// ==========================================
const WEATHER_STATIONS = [
  { id: 'bkk', province: 'กรุงเทพมหานคร', provinceEn: 'Bangkok', region: 'central', lat: 13.75, lng: 100.50 },
  { id: 'cnx', province: 'เชียงใหม่', provinceEn: 'Chiang Mai', region: 'north', lat: 18.79, lng: 98.98 },
  { id: 'cei', province: 'เชียงราย', provinceEn: 'Chiang Rai', region: 'north', lat: 19.91, lng: 99.83 },
  { id: 'nan', province: 'น่าน', provinceEn: 'Nan', region: 'north', lat: 18.78, lng: 100.77 },
  { id: 'hkt', province: 'ภูเก็ต', provinceEn: 'Phuket', region: 'south', lat: 7.88, lng: 98.39 },
  { id: 'hdy', province: 'สงขลา (หาดใหญ่)', provinceEn: 'Songkhla', region: 'south', lat: 6.93, lng: 100.47 },
  { id: 'surat', province: 'สุราษฎร์ธานี', provinceEn: 'Surat Thani', region: 'south', lat: 9.14, lng: 99.33 },
  { id: 'kkc', province: 'ขอนแก่น', provinceEn: 'Khon Kaen', region: 'northeast', lat: 16.44, lng: 102.83 },
  { id: 'korat', province: 'นครราชสีมา', provinceEn: 'Nakhon Ratchasima', region: 'northeast', lat: 14.97, lng: 102.10 },
  { id: 'ubp', province: 'อุบลราชธานี', provinceEn: 'Ubon Ratchathani', region: 'northeast', lat: 15.24, lng: 104.85 },
  { id: 'uth', province: 'อุดรธานี', provinceEn: 'Udon Thani', region: 'northeast', lat: 17.41, lng: 102.79 },
  { id: 'rayong', province: 'ระยอง', provinceEn: 'Rayong', region: 'east', lat: 12.68, lng: 101.28 },
  { id: 'chon', province: 'ชลบุรี (พัทยา)', provinceEn: 'Chonburi', region: 'east', lat: 12.93, lng: 100.88 },
  { id: 'nsn', province: 'นครสวรรค์', provinceEn: 'Nakhon Sawan', region: 'central', lat: 15.70, lng: 100.14 },
  { id: 'kan', province: 'กาญจนบุรี', provinceEn: 'Kanchanaburi', region: 'west', lat: 14.02, lng: 99.53 },
  { id: 'huahin', province: 'ประจวบคีรีขันธ์ (หัวหิน)', provinceEn: 'Prachuap Khiri Khan', region: 'west', lat: 12.57, lng: 99.96 },
]

function mapWeatherCode(code) {
  if (code === 0) return { label: 'ท้องฟ้าแจ่มใส', icon: '☀️', condition: 'sunny' }
  if (code === 1 || code === 2) return { label: 'มีเมฆบางส่วน', icon: '🌤️', condition: 'partly_cloudy' }
  if (code === 3) return { label: 'มีเมฆมาก', icon: '☁️', condition: 'cloudy' }
  if (code >= 45 && code <= 48) return { label: 'มีหมอกหนา', icon: '🌫️', condition: 'fog' }
  if (code >= 51 && code <= 67) return { label: 'ฝนตกปรอยๆ', icon: '🌦️', condition: 'rain' }
  if (code >= 80 && code <= 82) return { label: 'ฝนตกหนัก', icon: '🌧️', condition: 'heavy_rain' }
  if (code >= 95) return { label: 'พายุฝนฟ้าคะนอง', icon: '⛈️', condition: 'thunderstorm' }
  return { label: 'มีเมฆเป็นหย่อมๆ', icon: '🌤️', condition: 'cloudy' }
}

function getAqiLevel(pm25) {
  const val = Number(pm25) || 0
  if (val <= 15) return { label: 'ดีมาก (ฟ้าใส)', color: '#10b981', status: 'very_good', desc: 'คุณภาพอากาศดีมาก เหมาะสำหรับกิจกรรมกลางแจ้ง' }
  if (val <= 25) return { label: 'ดี (มาตรฐาน)', color: '#22c55e', status: 'good', desc: 'คุณภาพอากาศอยู่ในเกณฑ์ดี ทำกิจกรรมได้ตามปกติ' }
  if (val <= 37.5) return { label: 'ปานกลาง', color: '#eab308', status: 'moderate', desc: 'ผู้แพ้ง่ายควรสังเกตอาการ' }
  if (val <= 75) return { label: 'เริ่มมีผลต่อสุขภาพ', color: '#f97316', status: 'unhealthy', desc: 'ควรสวมหน้ากากอนามัย และลดกิจกรรมกลางแจ้ง' }
  return { label: 'มีผลต่อสุขภาพ', color: '#ef4444', status: 'hazardous', desc: 'ควรหลีกเลี่ยงกิจกรรมกลางแจ้ง และสวมหน้ากาก N95' }
}

let weatherCache = {
  timestamp: 0,
  payload: null,
}

app.get('/api/weather', async (req, res) => {
  const now = Date.now()
  if (weatherCache.payload && now - weatherCache.timestamp < 180000) {
    return res.json({
      ...weatherCache.payload,
      cached: true,
      ageMs: now - weatherCache.timestamp,
    })
  }

  try {
    const lats = WEATHER_STATIONS.map((s) => s.lat).join(',')
    const lngs = WEATHER_STATIONS.map((s) => s.lng).join(',')

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lngs}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lats}&longitude=${lngs}&current=pm2_5,us_aqi`

    const [weatherRes, aqiRes] = await Promise.all([
      fetch(weatherUrl, { headers: { 'User-Agent': 'Project-T/1.0' } }),
      fetch(aqiUrl, { headers: { 'User-Agent': 'Project-T/1.0' } }),
    ])

    if (!weatherRes.ok || !aqiRes.ok) {
      if (weatherCache.payload) {
        return res.json({ ...weatherCache.payload, cached: true })
      }
      return res.status(502).json({ error: 'Failed to fetch weather telemetry' })
    }

    const weatherData = await weatherRes.json()
    const aqiData = await aqiRes.json()

    const weatherList = Array.isArray(weatherData) ? weatherData : [weatherData]
    const aqiList = Array.isArray(aqiData) ? aqiData : [aqiData]

    const stations = WEATHER_STATIONS.map((st, idx) => {
      const wCurrent = weatherList[idx]?.current || {}
      const aCurrent = aqiList[idx]?.current || {}

      const temp = wCurrent.temperature_2m !== undefined ? Math.round(wCurrent.temperature_2m * 10) / 10 : 32.0
      const humidity = wCurrent.relative_humidity_2m !== undefined ? Math.round(wCurrent.relative_humidity_2m) : 60
      const windSpeed = wCurrent.wind_speed_10m !== undefined ? Math.round(wCurrent.wind_speed_10m * 10) / 10 : 3.5
      const weatherInfo = mapWeatherCode(wCurrent.weather_code)
      const pm25 = aCurrent.pm2_5 !== undefined ? Math.round(aCurrent.pm2_5 * 10) / 10 : 22.0
      const usAqi = aCurrent.us_aqi !== undefined ? Math.round(aCurrent.us_aqi) : 70
      const aqiInfo = getAqiLevel(pm25)

      return {
        ...st,
        temperature: temp,
        humidity,
        windSpeed,
        weatherLabel: weatherInfo.label,
        weatherIcon: weatherInfo.icon,
        weatherCondition: weatherInfo.condition,
        pm25,
        usAqi,
        aqiLabel: aqiInfo.label,
        aqiColor: aqiInfo.color,
        aqiStatus: aqiInfo.status,
        aqiDesc: aqiInfo.desc,
      }
    })

    const payload = {
      success: true,
      timestamp: now,
      updatedTime: new Date(now).toLocaleTimeString('th-TH'),
      stations,
    }

    weatherCache = {
      timestamp: now,
      payload,
    }

    res.json({
      ...payload,
      cached: false,
    })
  } catch (err) {
    if (weatherCache.payload) {
      return res.json({ ...weatherCache.payload, cached: true, notice: err.message })
    }
    res.status(502).json({ error: 'Weather API error', details: err.message })
  }
})

// ==========================================
// 🌧️ ระบบ Live Rain & Cloud Radar (RainViewer Public Proxy)
// ==========================================
let radarCache = {
  timestamp: 0,
  payload: null,
}

app.get('/api/radar', async (req, res) => {
  const now = Date.now()
  if (radarCache.payload && now - radarCache.timestamp < 120000) {
    return res.json({
      ...radarCache.payload,
      cached: true,
      ageMs: now - radarCache.timestamp,
    })
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 6500)
    const response = await fetch('https://api.rainviewer.com/public/weather-maps.json', {
      signal: controller.signal,
      headers: { 'User-Agent': 'Project-T/1.0' },
    })
    clearTimeout(timeout)

    if (!response.ok) {
      if (radarCache.payload) return res.json(radarCache.payload)
      return res.status(502).json({ error: 'RainViewer error' })
    }

    const data = await response.json()
    const host = data.host || 'https://tilecache.rainviewer.com'
    const frames = (data.radar?.past || []).map((f) => ({
      time: f.time,
      timeLabel: new Date(f.time * 1000).toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      tileUrl: `${host}${f.path}/256/{z}/{x}/{y}/2/1_1.png`,
    }))

    const payload = {
      success: true,
      host,
      latestFrame: frames[frames.length - 1] || null,
      frames,
    }

    radarCache = {
      timestamp: now,
      payload,
    }

    res.json(payload)
  } catch (err) {
    if (radarCache.payload) return res.json(radarCache.payload)
    res.status(502).json({ error: 'Failed to fetch radar', details: err.message })
  }
})

// หน้าแรกของ API เช็กว่าเซิร์ฟเวอร์ทำงานไหม
app.get('/', (req, res) => {
  res.json({ message: 'Backend API ของ Project-T ทำงานปกติครับ!' })
})

// API ดึงรายชื่อผู้ใช้ทั้งหมดจากตาราง users
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, full_name, role, created_at FROM users ORDER BY id ASC'
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// API สำหรับเข้าสู่ระบบ (Login)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' })
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, username, full_name, role FROM users WHERE username = ? AND password = ?',
      [username, password]
    )

    if (rows.length === 0) {
      return res.status(401).json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' })
    }

    res.json({
      message: 'เข้าสู่ระบบสำเร็จ!',
      user: rows[0],
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// API สำหรับสมัครสมาชิกใหม่ (Register) - ใช้แค่ username และ password
app.post('/api/register', async (req, res) => {
  const { username, password, full_name, role } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' })
  }

  try {
    const nameToSave = full_name || username
    const roleToSave = role || 'Member'

    const [result] = await pool.query(
      'INSERT INTO users (username, password, full_name, role) VALUES (?, ?, ?, ?)',
      [username, password, nameToSave, roleToSave]
    )

    res.status(201).json({
      message: 'สมัครสมาชิกสำเร็จ!',
      user: {
        id: result.insertId,
        username,
        full_name: nameToSave,
        role: roleToSave,
      },
    })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'ชื่อผู้ใช้นี้มีในระบบแล้ว' })
    }
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
