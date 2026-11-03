import { useState, useEffect, useRef, useCallback } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  MapPin,
  Search,
  RotateCcw,
  Compass,
  Layers,
  Info,
  CheckCircle2,
  Maximize2,
  Radio,
  Plane,
  PlaneTakeoff,
  Gauge,
  Navigation,
  Clock,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  Crosshair,
  X,
  CloudSun,
  CloudRain,
  Thermometer,
  Wind,
  Droplets,
  Landmark,
  Trophy,
  Sparkles,
  Check,
  Flame,
  Award,
  Trees,
  Waves,
  Play,
  Pause,
  Mountain,
  Palmtree,
  Footprints,
  Tent,
} from 'lucide-react'
import { REGIONS, PROVINCES_MAP, getProvinceInfo } from '../data/provincesData'
import { MAJOR_AIRPORTS } from '../data/airportsData'
import { TOURISM_CATEGORIES, TOURISM_LANDMARKS } from '../data/tourismData'
import { GEO_QUIZ_QUESTIONS } from '../data/quizData'

// พิกัดศูนย์กลางประเทศไทยและภูมิภาคอาเซียน
const THAILAND_CENTER = [13.7367, 100.5231]
const DEFAULT_ZOOM = 6
const AUTO_REFRESH_INTERVAL = 12 // วินาทีสำหรับเรดาร์การบิน

// แหล่งข้อมูลแผนที่ฐาน (Base Maps) คุณภาพสูง แสดงทั่วโลกและประเทศเพื่อนบ้าน ไร้ลายน้ำ 100%
const MAP_THEMES = {
  osm: {
    id: 'osm',
    label: '🌍 แผนที่โลกมาตรฐาน (OSM)',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
    subdomains: ['a', 'b', 'c'],
  },
  esriStreet: {
    id: 'esriStreet',
    label: '🏙️ แผนที่ถนนโลก (ESRI)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 18,
  },
  satellite: {
    id: 'satellite',
    label: '🛰️ ภาพถ่ายดาวเทียม (Satellite)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 18,
  },
  esriGray: {
    id: 'esriGray',
    label: '📐 เทามินิมอล (ESRI Canvas)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 16,
  },
}

// 4 หมวดหมู่ข้อมูลหลัก
const MAIN_CATEGORIES = [
  {
    id: 'aviation',
    label: 'คมนาคม & การบิน',
    icon: Plane,
    badge: 'เรดาร์สด ADS-B',
    badgeColor: 'bg-blue-100 text-blue-800',
    desc: 'เรดาร์เที่ยวบินพาณิชย์จริง 100+ ลำ พร้อม 12 ท่าอากาศยานหลัก',
  },
  {
    id: 'weather',
    label: 'สิ่งแวดล้อม & สภาพอากาศ',
    icon: CloudSun,
    badge: 'เรดาร์เมฆฝน & PM2.5',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    desc: 'เรดาร์กลุ่มฝนเคลื่อนไหวสด + อุณหภูมิ & ฝุ่น PM2.5 ทั่วไทย',
  },
  {
    id: 'tourism',
    label: 'ท่องเที่ยว & ผจญภัย',
    icon: Footprints,
    badge: '28+ ที่เที่ยว ยอดฮิต',
    badgeColor: 'bg-amber-100 text-amber-800',
    desc: 'เดินป่า ภูเขา ทะเลหมอก เกาะสวรรค์ และมรดกโลก UNESCO',
  },
  {
    id: 'minigame',
    label: 'มินิเกมสำรวจไทย',
    icon: Trophy,
    badge: 'Geo Quiz สะสมคะแนน',
    badgeColor: 'bg-purple-100 text-purple-800',
    desc: 'เกมทายจังหวัดจากคำขวัญและพิกัดจริง พร้อมบินซูมดูคำตอบ',
  },
]

// ตรวจสอบที่อยู่ Backend API
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:5001'
    }
  }
  return ''
}

// คำนวณทิศทางเข็มทิศ
const getCompassDirection = (deg) => {
  if (deg === null || deg === undefined) return 'N/A'
  const directions = [
    'เหนือ (N)',
    'ต.อ.เฉียงเหนือ (NNE)',
    'ต.อ.เฉียงเหนือ (NE)',
    'ต.อ.เฉียงเหนือ (ENE)',
    'ตะวันออก (E)',
    'ต.อ.เฉียงใต้ (ESE)',
    'ต.อ.เฉียงใต้ (SE)',
    'ต.อ.เฉียงใต้ (SSE)',
    'ใต้ (S)',
    'ต.ต.เฉียงใต้ (SSW)',
    'ต.ต.เฉียงใต้ (SW)',
    'ต.ต.เฉียงใต้ (WSW)',
    'ตะวันตก (W)',
    'ต.ต.เฉียงเหนือ (WNW)',
    'ต.ต.เฉียงเหนือ (NW)',
    'ต.ต.เฉียงเหนือ (NNW)',
  ]
  const index = Math.round(deg / 22.5) % 16
  return directions[index]
}

function MapPage() {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const tileLayerRef = useRef(null)
  const geojsonLayerRef = useRef(null)
  const provinceLayersRef = useRef({})

  // หมุดเลเยอร์ต่างๆ
  const flightMarkersRef = useRef({})
  const airportMarkersRef = useRef([])
  const weatherMarkersRef = useRef([])
  const rainRadarLayerRef = useRef(null)
  const tourismMarkersRef = useRef([])
  const quizMarkerRef = useRef(null)

  // 1. โหมดหมวดหมู่หลัก: 'aviation' | 'weather' | 'tourism' | 'minigame'
  const [activeCategory, setActiveCategory] = useState('aviation')

  // ข้อมูลแผนที่ & สถานะทั่วไป
  const [geoData, setGeoData] = useState(null)
  const [currentTheme, setCurrentTheme] = useState('osm')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredProvince, setHoveredProvince] = useState(null)
  const [activeProvince, setActiveProvince] = useState(null)
  const [showProvincesOverlay, setShowProvincesOverlay] = useState(true)

  // ==========================================
  // หมวดที่ 1: คมนาคม & การบิน (Aviation Telemetry)
  // ==========================================
  const [flights, setFlights] = useState([])
  const [flightFilter, setFlightFilter] = useState('all') // 'all' | 'thai' | 'intl'
  const [flightSearch, setFlightSearch] = useState('')
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [selectedAirport, setSelectedAirport] = useState(null)
  const [showFlights, setShowFlights] = useState(true)
  const [showAirports, setShowAirports] = useState(true)
  const [followSelectedFlight, setFollowSelectedFlight] = useState(true)
  const [isRefreshingFlights, setIsRefreshingFlights] = useState(false)
  const [lastFlightUpdate, setLastFlightUpdate] = useState('')
  const [flightCountdown, setFlightCountdown] = useState(AUTO_REFRESH_INTERVAL)
  const [rightPanelTab, setRightPanelTab] = useState('flights') // 'flights' | 'airports' | 'province'

  // ==========================================
  // หมวดที่ 2: สิ่งแวดล้อม & สภาพอากาศ (Weather & Rain Radar)
  // ==========================================
  const [weatherStations, setWeatherStations] = useState([])
  const [selectedWeatherStation, setSelectedWeatherStation] = useState(null)
  const [weatherMode, setWeatherMode] = useState('temp') // 'temp' | 'pm25'
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [lastWeatherUpdate, setLastWeatherUpdate] = useState('')

  // เรดาร์ฝน RainViewer
  const [radarFrames, setRadarFrames] = useState([])
  const [currentRadarIndex, setCurrentRadarIndex] = useState(0)
  const [isPlayingRadar, setIsPlayingRadar] = useState(true)
  const [showRainRadar, setShowRainRadar] = useState(true)
  const [showWeatherStations, setShowWeatherStations] = useState(true)

  // ==========================================
  // หมวดที่ 3: ท่องเที่ยว & ผจญภัย (Tourism & Adventure)
  // ==========================================
  const [tourismCategory, setTourismCategory] = useState('all')
  const [tourismSearch, setTourismSearch] = useState('')
  const [selectedLandmark, setSelectedLandmark] = useState(null)

  // ==========================================
  // หมวดที่ 4: มินิเกมสำรวจไทย (Geo Quiz)
  // ==========================================
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [quizStreak, setQuizStreak] = useState(0)
  const [quizSelectedOption, setQuizSelectedOption] = useState(null)
  const [quizAnswered, setQuizAnswered] = useState(false)
  const [quizFinished, setQuizFinished] = useState(false)

  // แจ้งเตือน Toast
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3200)
  }

  // 1. ดึงข้อมูล GeoJSON ขอบเขตจังหวัดประเทศไทย
  useEffect(() => {
    fetch('/thailand.json')
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error('Failed to load thailand.json:', err))
  }, [])

  // 2. ดึงข้อมูลเรดาร์เที่ยวบินจริง (OpenSky Telemetry ผ่าน Backend)
  const fetchLiveFlights = useCallback(
    async (isManual = false) => {
      try {
        setIsRefreshingFlights(true)
        const url = `${getApiBaseUrl()}/api/flights${isManual ? '?force=true' : ''}`
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()

        if (data.flights && Array.isArray(data.flights)) {
          setFlights(data.flights)
          const timeStr = data.updatedTime || new Date().toLocaleTimeString('th-TH')
          setLastFlightUpdate(timeStr)
          setFlightCountdown(AUTO_REFRESH_INTERVAL)

          if (isManual) {
            showToast(`อัปเดตเรดาร์สำเร็จ: พบ ${data.flights.length} เที่ยวบิน`)
          }

          if (selectedFlight && followSelectedFlight && mapInstanceRef.current) {
            const updated = data.flights.find((f) => f.icao24 === selectedFlight.icao24)
            if (updated) {
              setSelectedFlight(updated)
              mapInstanceRef.current.panTo([updated.lat, updated.lng], {
                animate: true,
                duration: 1.0,
              })
            }
          }
        }
      } catch (err) {
        console.warn('Flight fetch notice:', err.message)
      } finally {
        setIsRefreshingFlights(false)
      }
    },
    [selectedFlight, followSelectedFlight]
  )

  // 3. ดึงข้อมูลสภาพอากาศ & PM2.5 จริง + ข้อมูลเรดาร์ฝน RainViewer
  const fetchLiveWeather = useCallback(async (isManual = false) => {
    try {
      setWeatherLoading(true)
      const [wRes, rRes] = await Promise.all([
        fetch(`${getApiBaseUrl()}/api/weather`),
        fetch(`${getApiBaseUrl()}/api/radar`),
      ])

      if (wRes.ok) {
        const wData = await wRes.json()
        if (wData.stations && Array.isArray(wData.stations)) {
          setWeatherStations(wData.stations)
          setLastWeatherUpdate(wData.updatedTime || new Date().toLocaleTimeString('th-TH'))
        }
      }

      if (rRes.ok) {
        const rData = await rRes.json()
        if (rData.frames && Array.isArray(rData.frames)) {
          setRadarFrames(rData.frames)
          setCurrentRadarIndex(rData.frames.length - 1)
        }
      }

      if (isManual) {
        showToast('อัปเดตเรดาร์กลุ่มฝนสดและสภาพอากาศเรียบร้อยแล้ว')
      }
    } catch (err) {
      console.warn('Weather fetch notice:', err.message)
    } finally {
      setWeatherLoading(false)
    }
  }, [])

  // โหลดข้อมูลตามหมวดที่เปิด
  useEffect(() => {
    if (activeCategory === 'aviation') {
      fetchLiveFlights(false)
    } else if (activeCategory === 'weather') {
      fetchLiveWeather(false)
    }
  }, [activeCategory, fetchLiveFlights, fetchLiveWeather])

  // นับเวลาถอยหลังอัปเดตการบิน
  useEffect(() => {
    if (activeCategory !== 'aviation') return
    const timer = setInterval(() => {
      setFlightCountdown((prev) => {
        if (prev <= 1) {
          fetchLiveFlights(false)
          return AUTO_REFRESH_INTERVAL
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [activeCategory, fetchLiveFlights])

  // ลูปเล่นเรดาร์ฝนเคลื่อนไหวอัตโนมัติ (Rain Radar Animation Loop)
  useEffect(() => {
    if (activeCategory !== 'weather' || !isPlayingRadar || radarFrames.length === 0) return

    const interval = setInterval(() => {
      setCurrentRadarIndex((prev) => (prev + 1) % radarFrames.length)
    }, 900)

    return () => clearInterval(interval)
  }, [activeCategory, isPlayingRadar, radarFrames])

  // 4. เริ่มต้น Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapInstanceRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: THAILAND_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom: 3,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
    })

    L.control
      .zoom({
        position: 'topright',
      })
      .addTo(map)

    const initialTheme = MAP_THEMES.osm
    const baseTile = L.tileLayer(initialTheme.url, {
      maxZoom: initialTheme.maxZoom || 19,
      subdomains: initialTheme.subdomains || 'abc',
    }).addTo(map)

    tileLayerRef.current = baseTile
    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // 5. ResizeObserver ปรับแผนที่เต็ม 100% ทันทีที่ส่วนสูงเปลี่ยน
  useEffect(() => {
    if (!mapContainerRef.current || !mapInstanceRef.current) return
    const resizeObserver = new ResizeObserver(() => {
      mapInstanceRef.current?.invalidateSize()
    })
    resizeObserver.observe(mapContainerRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize()
    }, 120)
    return () => clearTimeout(timer)
  }, [activeCategory, selectedAirport, selectedFlight, selectedWeatherStation, selectedLandmark])

  // 6. เปลี่ยน Theme แผนที่ฐาน
  const changeTileLayer = (themeKey) => {
    if (!mapInstanceRef.current) return
    const theme = MAP_THEMES[themeKey]
    if (!theme) return

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current)
      tileLayerRef.current = null
    }

    if (theme.url) {
      const newTile = L.tileLayer(theme.url, {
        maxZoom: theme.maxZoom || 19,
        subdomains: theme.subdomains || 'abc',
      }).addTo(mapInstanceRef.current)
      tileLayerRef.current = newTile
    }

    setCurrentTheme(themeKey)
  }

  // 7. สไตล์เส้นขอบเขตจังหวัด (Semi-transparent)
  const getFeatureStyle = useCallback(
    (feature, currentRegion = selectedRegion) => {
      const rawName = feature.properties?.name
      const info = getProvinceInfo(rawName)
      const regionConfig = REGIONS[info.region] || REGIONS.central

      const isMatchRegion =
        currentRegion === 'all' || info.region === currentRegion

      return {
        fillColor: regionConfig.color,
        fillOpacity: isMatchRegion ? 0.12 : 0.02,
        color: isMatchRegion ? regionConfig.border : '#94a3b8',
        weight: isMatchRegion ? 1.5 : 0.8,
        opacity: isMatchRegion ? 0.9 : 0.4,
      }
    },
    [selectedRegion]
  )

  // 8. เรนเดอร์ GeoJSON ขอบเขตจังหวัด
  useEffect(() => {
    if (!mapInstanceRef.current) return

    if (geojsonLayerRef.current) {
      mapInstanceRef.current.removeLayer(geojsonLayerRef.current)
      geojsonLayerRef.current = null
    }

    if (!showProvincesOverlay || !geoData) return

    provinceLayersRef.current = {}

    const layer = L.geoJSON(geoData, {
      style: (feature) => getFeatureStyle(feature, selectedRegion),
      onEachFeature: (feature, l) => {
        const rawName = feature.properties?.name
        const info = getProvinceInfo(rawName)
        const region = REGIONS[info.region] || REGIONS.central

        provinceLayersRef.current[rawName] = l

        l.bindTooltip(
          `<div class="px-1 text-center font-sans">
            <p class="font-bold text-gray-900 text-sm leading-tight">${info.th}</p>
            <p class="text-[11px] text-gray-500">${info.en} • ${region.name}</p>
          </div>`,
          {
            sticky: true,
            className:
              'bg-white/95 backdrop-blur-sm border border-gray-200 shadow-md rounded-lg py-1 px-2.5',
            direction: 'top',
          }
        )

        l.on({
          mouseover: (e) => {
            const currentLayer = e.target
            currentLayer.setStyle({
              weight: 2.8,
              color: '#1e40af',
              fillOpacity: 0.35,
            })
            currentLayer.bringToFront()
            setHoveredProvince(info)
          },
          mouseout: (e) => {
            if (activeProvince?.en !== info.en) {
              geojsonLayerRef.current.resetStyle(e.target)
            }
            setHoveredProvince(null)
          },
          click: (e) => {
            setActiveProvince(info)
            if (activeCategory === 'aviation') {
              setRightPanelTab('province')
            }
            const bounds = e.target.getBounds()
            mapInstanceRef.current.fitBounds(bounds, {
              padding: [60, 60],
              maxZoom: 9,
              animate: true,
            })
          },
        })
      },
    }).addTo(mapInstanceRef.current)

    geojsonLayerRef.current = layer
  }, [geoData, selectedRegion, activeProvince, showProvincesOverlay, activeCategory, getFeatureStyle])

  // ==========================================
  // จัดการหมุดหมวดที่ 1: การบิน & สนามบิน (Aviation)
  // ==========================================
  useEffect(() => {
    if (!mapInstanceRef.current) return
    if (activeCategory !== 'aviation') {
      Object.values(flightMarkersRef.current).forEach((m) =>
        mapInstanceRef.current.removeLayer(m)
      )
      flightMarkersRef.current = {}
      airportMarkersRef.current.forEach((m) => mapInstanceRef.current.removeLayer(m))
      airportMarkersRef.current = []
      return
    }

    // หมุดสนามบิน 12 แห่ง
    if (showAirports && airportMarkersRef.current.length === 0) {
      const newMarkers = []
      MAJOR_AIRPORTS.forEach((airport) => {
        const airportIcon = L.divIcon({
          className: 'custom-airport-marker',
          html: `
            <div class="group relative flex items-center justify-center cursor-pointer select-none">
              <div class="w-7 h-7 rounded-lg bg-sky-700 text-white shadow-lg border border-white flex items-center justify-center text-xs group-hover:scale-115 transition-transform duration-200">
                🛫
              </div>
              <div class="absolute -bottom-4 bg-white/95 text-[10px] font-black text-sky-900 px-1.5 rounded border border-sky-300 shadow-xs whitespace-nowrap">
                ${airport.iata}
              </div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        })

        const marker = L.marker(airport.pos, { icon: airportIcon }).addTo(
          mapInstanceRef.current
        )

        marker.bindTooltip(
          `<div class="font-sans text-xs p-1">
            <p class="font-bold text-sky-900">🛫 ${airport.nameTh} (${airport.iata})</p>
            <p class="text-gray-600 font-medium">จ.${airport.province} • ${airport.runways}</p>
          </div>`,
          { direction: 'top', offset: [0, -12] }
        )

        marker.on('click', () => {
          setSelectedAirport(airport)
          setSelectedFlight(null)
          setRightPanelTab('airports')
          mapInstanceRef.current.setView(airport.pos, 11, { animate: true })
        })

        newMarkers.push(marker)
      })
      airportMarkersRef.current = newMarkers
    } else if (!showAirports) {
      airportMarkersRef.current.forEach((m) => mapInstanceRef.current.removeLayer(m))
      airportMarkersRef.current = []
    }

    // หมุดเครื่องบินจริง ADS-B
    if (!showFlights) {
      Object.values(flightMarkersRef.current).forEach((m) =>
        mapInstanceRef.current.removeLayer(m)
      )
      flightMarkersRef.current = {}
      return
    }

    const visibleFlights = flights.filter((f) => {
      if (flightFilter === 'thai' && !f.isThaiAirline) return false
      if (flightFilter === 'intl' && f.isThaiAirline) return false
      if (flightSearch) {
        const q = flightSearch.toLowerCase()
        const cs = (f.callsign || '').toLowerCase()
        const al = (f.airline || '').toLowerCase()
        if (!cs.includes(q) && !al.includes(q)) return false
      }
      return true
    })

    const currentIcaos = new Set(visibleFlights.map((f) => f.icao24))

    Object.keys(flightMarkersRef.current).forEach((icao) => {
      if (!currentIcaos.has(icao)) {
        mapInstanceRef.current.removeLayer(flightMarkersRef.current[icao])
        delete flightMarkersRef.current[icao]
      }
    })

    visibleFlights.forEach((flight) => {
      const pos = [flight.lat, flight.lng]
      const heading = flight.heading || 0
      const color = flight.airlineColor || '#2563eb'

      if (flightMarkersRef.current[flight.icao24]) {
        const marker = flightMarkersRef.current[flight.icao24]
        marker.setLatLng(pos)
        const planeEl = marker.getElement()?.querySelector('.plane-svg')
        if (planeEl) {
          planeEl.style.transform = `rotate(${heading}deg)`
        }
      } else {
        const flightIcon = L.divIcon({
          className: 'custom-flight-marker',
          html: `
            <div class="relative flex flex-col items-center justify-center cursor-pointer select-none">
              <div class="plane-svg transition-transform duration-700 ease-out" style="transform: rotate(${heading}deg); transform-origin: center center;">
                <svg viewBox="0 0 24 24" width="28" height="28" class="drop-shadow-md">
                  <path fill="${color}" stroke="#ffffff" stroke-width="1.3" stroke-linejoin="round" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
              </div>
              <div class="mt-0.5 bg-slate-900/90 text-white text-[9px] font-bold px-1.5 py-0.2 rounded shadow-sm border border-white/20 whitespace-nowrap">
                ${flight.callsign}
              </div>
            </div>
          `,
          iconSize: [36, 44],
          iconAnchor: [18, 22],
        })

        const marker = L.marker(pos, { icon: flightIcon }).addTo(
          mapInstanceRef.current
        )

        marker.bindTooltip(
          `<div class="font-sans text-xs p-1">
            <p class="font-bold text-gray-900 flex items-center gap-1.5">
              <span>✈️ ${flight.callsign}</span>
              <span class="text-[10px] text-gray-400">(${flight.country})</span>
            </p>
            <p class="text-blue-600 font-semibold">${flight.airline}</p>
            <div class="mt-1 text-[11px] text-gray-600 space-y-0.5">
              <p>ความสูง: <b>${flight.altitudeFeet.toLocaleString()} ft</b></p>
              <p>ความเร็ว: <b>${flight.velocityKmh} km/h</b></p>
            </div>
          </div>`,
          { direction: 'top', offset: [0, -14] }
        )

        marker.on('click', () => {
          setSelectedFlight(flight)
          setSelectedAirport(null)
          setRightPanelTab('flights')
          mapInstanceRef.current.setView(pos, 9, { animate: true })
        })

        flightMarkersRef.current[flight.icao24] = marker
      }
    })
  }, [activeCategory, flights, showFlights, showAirports, flightFilter, flightSearch])

  // ==========================================
  // จัดการเรดาร์ฝนเคลื่อนไหว RainViewer (Weather Radar Overlay)
  // ==========================================
  useEffect(() => {
    if (!mapInstanceRef.current) return

    if (activeCategory !== 'weather' || !showRainRadar || radarFrames.length === 0) {
      if (rainRadarLayerRef.current) {
        mapInstanceRef.current.removeLayer(rainRadarLayerRef.current)
        rainRadarLayerRef.current = null
      }
      return
    }

    const currentFrame = radarFrames[currentRadarIndex]
    if (!currentFrame) return

    if (rainRadarLayerRef.current) {
      mapInstanceRef.current.removeLayer(rainRadarLayerRef.current)
    }

    const radarTile = L.tileLayer(currentFrame.tileUrl, {
      opacity: 0.72,
      zIndex: 400,
      maxZoom: 18,
    }).addTo(mapInstanceRef.current)

    rainRadarLayerRef.current = radarTile
  }, [activeCategory, showRainRadar, radarFrames, currentRadarIndex])

  // ==========================================
  // จัดการหมุดสภาพอากาศ (Sleek Glassmorphism Pills)
  // ==========================================
  useEffect(() => {
    if (!mapInstanceRef.current) return
    if (activeCategory !== 'weather' || !showWeatherStations) {
      weatherMarkersRef.current.forEach((m) => mapInstanceRef.current.removeLayer(m))
      weatherMarkersRef.current = []
      return
    }

    weatherMarkersRef.current.forEach((m) => mapInstanceRef.current.removeLayer(m))
    weatherMarkersRef.current = []

    const newMarkers = []
    weatherStations.forEach((station) => {
      const isPm25 = weatherMode === 'pm25'
      const iconHtml = isPm25
        ? `
          <div class="flex flex-col items-center justify-center cursor-pointer select-none group">
            <div class="px-2 py-0.5 rounded-full shadow-md border-2 border-white flex items-center gap-1 font-extrabold text-[11px] text-white group-hover:scale-115 transition-transform duration-200" style="background-color: ${station.aqiColor}">
              <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              <span>${station.pm25} µg</span>
            </div>
            <div class="bg-slate-900/85 text-white text-[9px] font-bold px-1.5 rounded mt-0.5 shadow-sm border border-white/20 whitespace-nowrap">
              ${station.province}
            </div>
          </div>
        `
        : `
          <div class="flex flex-col items-center justify-center cursor-pointer select-none group">
            <div class="px-2 py-0.5 rounded-full shadow-md bg-white/95 border border-amber-300 flex items-center gap-1 font-extrabold text-[11px] text-gray-800 group-hover:scale-115 transition-transform duration-200">
              <span class="text-xs">${station.weatherIcon}</span>
              <span class="text-amber-700">${station.temperature}°</span>
            </div>
            <div class="bg-slate-900/85 text-white text-[9px] font-bold px-1.5 rounded mt-0.5 shadow-sm border border-white/20 whitespace-nowrap">
              ${station.province}
            </div>
          </div>
        `

      const weatherIcon = L.divIcon({
        className: 'custom-weather-marker',
        html: iconHtml,
        iconSize: [56, 38],
        iconAnchor: [28, 19],
      })

      const marker = L.marker([station.lat, station.lng], { icon: weatherIcon }).addTo(
        mapInstanceRef.current
      )

      marker.bindTooltip(
        `<div class="font-sans text-xs p-1">
          <p class="font-bold text-gray-900">${station.province} (${station.provinceEn})</p>
          <p class="text-amber-600 font-bold">${station.weatherIcon} ${station.weatherLabel} • ${station.temperature}°C</p>
          <p class="text-gray-600">PM2.5: <b>${station.pm25} µg/m³</b> (${station.aqiLabel})</p>
        </div>`,
        { direction: 'top', offset: [0, -10] }
      )

      marker.on('click', () => {
        setSelectedWeatherStation(station)
        mapInstanceRef.current.setView([station.lat, station.lng], 9, { animate: true })
      })

      newMarkers.push(marker)
    })

    weatherMarkersRef.current = newMarkers
  }, [activeCategory, showWeatherStations, weatherStations, weatherMode])

  // ==========================================
  // จัดการหมุดหมวดที่ 3: ท่องเที่ยว & ผจญภัย (28+ ที่เที่ยว)
  // ==========================================
  useEffect(() => {
    if (!mapInstanceRef.current) return
    if (activeCategory !== 'tourism') {
      tourismMarkersRef.current.forEach((m) => mapInstanceRef.current.removeLayer(m))
      tourismMarkersRef.current = []
      return
    }

    tourismMarkersRef.current.forEach((m) => mapInstanceRef.current.removeLayer(m))
    tourismMarkersRef.current = []

    const visibleLandmarks = TOURISM_LANDMARKS.filter((l) => {
      if (tourismCategory !== 'all' && l.category !== tourismCategory) return false
      if (tourismSearch) {
        const q = tourismSearch.toLowerCase()
        const nTh = l.nameTh.toLowerCase()
        const nEn = l.nameEn.toLowerCase()
        const prov = l.province.toLowerCase()
        if (!nTh.includes(q) && !nEn.includes(q) && !prov.includes(q)) return false
      }
      return true
    })

    const newMarkers = []
    visibleLandmarks.forEach((landmark) => {
      const getCategoryBadge = (cat) => {
        if (cat === 'trekking') return { icon: '🥾', bg: 'bg-emerald-600' }
        if (cat === 'mountain') return { icon: '⛰️', bg: 'bg-orange-600' }
        if (cat === 'island') return { icon: '🏝️', bg: 'bg-sky-600' }
        if (cat === 'unesco') return { icon: '🏛️', bg: 'bg-amber-600' }
        return { icon: '✨', bg: 'bg-purple-600' }
      }

      const badge = getCategoryBadge(landmark.category)

      const landmarkIcon = L.divIcon({
        className: 'custom-tourism-marker',
        html: `
          <div class="flex flex-col items-center justify-center cursor-pointer select-none group">
            <div class="w-8 h-8 rounded-full bg-white shadow-xl border-2 flex items-center justify-center text-sm group-hover:scale-120 transition-transform duration-200" style="border-color: ${landmark.badgeColor}">
              <span>${badge.icon}</span>
            </div>
            <div class="bg-slate-900/90 text-white text-[9px] font-bold px-1.5 py-0.2 rounded mt-0.5 shadow-sm border border-white/20 whitespace-nowrap max-w-[120px] truncate">
              ${landmark.nameTh.split('(')[0]}
            </div>
          </div>
        `,
        iconSize: [36, 44],
        iconAnchor: [18, 22],
      })

      const marker = L.marker(landmark.pos, { icon: landmarkIcon }).addTo(
        mapInstanceRef.current
      )

      marker.bindTooltip(
        `<div class="font-sans text-xs p-1">
          <p class="font-bold text-gray-900">${landmark.nameTh}</p>
          <p class="text-amber-700 font-semibold">${landmark.categoryLabel} • จ.${landmark.province}</p>
          <p class="text-emerald-700 font-medium">★ ${landmark.rating} • ${landmark.bestSeason}</p>
        </div>`,
        { direction: 'top', offset: [0, -14] }
      )

      marker.on('click', () => {
        setSelectedLandmark(landmark)
        mapInstanceRef.current.setView(landmark.pos, 11, { animate: true })
      })

      newMarkers.push(marker)
    })

    tourismMarkersRef.current = newMarkers
  }, [activeCategory, tourismCategory, tourismSearch])

  // ==========================================
  // จัดการหมวดที่ 4: มินิเกมสำรวจไทย (Geo Quiz)
  // ==========================================
  const currentQuiz = GEO_QUIZ_QUESTIONS[quizIndex]

  const handleQuizAnswer = (option) => {
    if (quizAnswered) return
    setQuizSelectedOption(option)
    setQuizAnswered(true)

    const isCorrect = option === currentQuiz.correct
    if (isCorrect) {
      setQuizScore((prev) => prev + 100)
      setQuizStreak((prev) => prev + 1)
      showToast(`🎉 ถูกต้อง! +100 คะแนน`)
    } else {
      setQuizStreak(0)
      showToast(`❌ คำตอบที่ถูกต้องคือ "${currentQuiz.correct}"`)
    }

    if (mapInstanceRef.current && currentQuiz.pos) {
      mapInstanceRef.current.setView(currentQuiz.pos, 8, { animate: true })

      if (quizMarkerRef.current) {
        mapInstanceRef.current.removeLayer(quizMarkerRef.current)
      }

      const answerIcon = L.divIcon({
        className: 'quiz-answer-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute -inset-3 rounded-full ${
              isCorrect ? 'bg-emerald-400' : 'bg-rose-400'
            } opacity-60 animate-ping"></span>
            <div class="w-10 h-10 rounded-full ${
              isCorrect ? 'bg-emerald-600' : 'bg-rose-600'
            } text-white font-bold flex items-center justify-center text-sm shadow-xl border-2 border-white">
              ${isCorrect ? '✓' : '!'}
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      })

      quizMarkerRef.current = L.marker(currentQuiz.pos, {
        icon: answerIcon,
      }).addTo(mapInstanceRef.current)
    }
  }

  const handleNextQuiz = () => {
    if (quizIndex + 1 < GEO_QUIZ_QUESTIONS.length) {
      setQuizIndex((prev) => prev + 1)
      setQuizSelectedOption(null)
      setQuizAnswered(false)
      if (quizMarkerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(quizMarkerRef.current)
        quizMarkerRef.current = null
      }
    } else {
      setQuizFinished(true)
    }
  }

  const handleRestartQuiz = () => {
    setQuizIndex(0)
    setQuizScore(0)
    setQuizStreak(0)
    setQuizSelectedOption(null)
    setQuizAnswered(false)
    setQuizFinished(false)
    if (quizMarkerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(quizMarkerRef.current)
      quizMarkerRef.current = null
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(THAILAND_CENTER, DEFAULT_ZOOM, { animate: true })
    }
  }

  // รีเซ็ตมุมมอง
  const handleResetView = () => {
    setSelectedRegion('all')
    setActiveProvince(null)
    setSelectedFlight(null)
    setSelectedAirport(null)
    setSelectedWeatherStation(null)
    setSelectedLandmark(null)
    setSearchQuery('')
    setFlightSearch('')
    setTourismSearch('')
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(THAILAND_CENTER, DEFAULT_ZOOM, {
        animate: true,
      })
    }
  }

  const allProvinces = Object.values(PROVINCES_MAP)
  const filteredProvinces = allProvinces.filter(
    (p) =>
      p.th.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.en.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentDisplayProvince = activeProvince || hoveredProvince

  const displayedFlights = flights.filter((f) => {
    if (flightFilter === 'thai' && !f.isThaiAirline) return false
    if (flightFilter === 'intl' && f.isThaiAirline) return false
    if (flightSearch) {
      const q = flightSearch.toLowerCase()
      const cs = (f.callsign || '').toLowerCase()
      const al = (f.airline || '').toLowerCase()
      if (!cs.includes(q) && !al.includes(q)) return false
    }
    return true
  })

  const currentFrame = radarFrames[currentRadarIndex]

  return (
    <div className="space-y-6 pb-12">
      <style>{`
        .leaflet-control-attribution {
          display: none !important;
        }
      `}</style>

      {/* แถบเลือก 4 หมวดหมู่หลัก (Category Mode Selector) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {MAIN_CATEGORIES.map((cat) => {
          const Icon = cat.icon
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id)
                setSelectedFlight(null)
                setSelectedAirport(null)
                setSelectedWeatherStation(null)
                setSelectedLandmark(null)
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer shadow-xs flex flex-col justify-between ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-400/40 shadow-md transform -translate-y-0.5'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isActive ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white text-blue-900' : cat.badgeColor
                  }`}
                >
                  {cat.badge}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">{cat.label}</h3>
                <p
                  className={`text-[11px] mt-0.5 line-clamp-1 ${
                    isActive ? 'text-blue-100' : 'text-gray-400'
                  }`}
                >
                  {cat.desc}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* ส่วนหัวหน้าเว็บ & แถบสลับ Theme แผนที่ฐาน */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
              <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>
                {activeCategory === 'aviation' && 'เรดาร์การบินน่านฟ้าไทย (OpenSky ADS-B)'}
                {activeCategory === 'weather' && 'เรดาร์เมฆฝนสด (RainViewer) & คุณภาพอากาศ'}
                {activeCategory === 'tourism' && 'คู่มือท่องเที่ยวไทย 28+ แห่ง (เดินป่า ภูเขา เกาะ UNESCO)'}
                {activeCategory === 'minigame' && 'มินิเกมภูมิศาสตร์และคำขวัญ 77 จังหวัด'}
              </span>
            </span>

            {activeCategory === 'aviation' && lastFlightUpdate && (
              <span className="text-gray-500 text-xs flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <span>อัปเดตล่าสุด {lastFlightUpdate}</span>
              </span>
            )}

            {activeCategory === 'weather' && currentFrame && (
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                <CloudRain className="w-3 h-3 text-emerald-600 animate-pulse" />
                <span>เรดาร์ฝนสด: {currentFrame.timeLabel} น.</span>
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <span>
              {activeCategory === 'aviation' && 'เรดาร์การบิน & ท่าอากาศยาน (Live Transit)'}
              {activeCategory === 'weather' && 'เรดาร์สภาพอากาศ & กลุ่มฝนสด (Weather Radar)'}
              {activeCategory === 'tourism' && 'ท่องเที่ยว & ผจญภัยธรรมชาติ (Tourism & Adventure)'}
              {activeCategory === 'minigame' && 'เกมทายจังหวัดสำรวจไทย (Geo Quiz)'}
            </span>
          </h1>
        </div>

        {/* ปุ่มควบคุม & สลับสไตล์แผนที่ฐาน (OSM ทั่วโลก) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* เมนูเปลี่ยน Theme แผนที่ฐาน */}
          <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-medium text-gray-600 border border-gray-200">
            {Object.values(MAP_THEMES).map((theme) => (
              <button
                key={theme.id}
                onClick={() => changeTileLayer(theme.id)}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  currentTheme === theme.id
                    ? 'bg-white text-blue-600 shadow-xs font-bold'
                    : 'hover:text-gray-900'
                }`}
              >
                {theme.label}
              </button>
            ))}
          </div>

          {/* ปุ่มรีเฟรชเฉพาะหมวด */}
          {activeCategory === 'aviation' && (
            <button
              onClick={() => fetchLiveFlights(true)}
              disabled={isRefreshingFlights}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm disabled:opacity-60"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefreshingFlights ? 'animate-spin' : ''}`}
              />
              <span>รีเฟรช ({flightCountdown}s)</span>
            </button>
          )}

          {activeCategory === 'weather' && (
            <button
              onClick={() => fetchLiveWeather(true)}
              disabled={weatherLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm disabled:opacity-60"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${weatherLoading ? 'animate-spin' : ''}`}
              />
              <span>รีเฟรชเรดาร์ฝน</span>
            </button>
          )}

          {/* ปุ่มรีเซ็ตมุมมอง */}
          <button
            onClick={handleResetView}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
            <span>รีเซ็ต</span>
          </button>
        </div>
      </div>

      {/* แถบสวิตช์ย่อยประจำหมวด */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-200 shadow-xs">
        {/* สวิตช์ย่อยตามหมวดหมู่ที่เลือก */}
        <div className="flex flex-wrap items-center gap-2">
          {/* หมวดการบิน */}
          {activeCategory === 'aviation' && (
            <>
              <button
                onClick={() => setShowFlights(!showFlights)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  showFlights
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Plane className="w-4 h-4" />
                <span>เที่ยวบินจริง ({flights.length} ลำ)</span>
              </button>

              <button
                onClick={() => setShowAirports(!showAirports)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  showAirports
                    ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <PlaneTakeoff className="w-4 h-4" />
                <span>ท่าอากาศยาน (12 แห่ง)</span>
              </button>

              <button
                onClick={() => setFollowSelectedFlight(!followSelectedFlight)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  followSelectedFlight
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-gray-50 text-gray-500 border-gray-200'
                }`}
              >
                <Crosshair className="w-3.5 h-3.5 text-emerald-600" />
                <span>ติดตามกล้อง</span>
              </button>
            </>
          )}

          {/* หมวดสภาพอากาศ: มีเรดาร์ฝนเคลื่อนไหว + เครื่องเล่น Play/Pause */}
          {activeCategory === 'weather' && (
            <>
              {/* สวิตช์เรดาร์กลุ่มฝนสด */}
              <button
                onClick={() => setShowRainRadar(!showRainRadar)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  showRainRadar
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <CloudRain className="w-4 h-4" />
                <span>เรดาร์กลุ่มฝนสด (Rain Radar)</span>
              </button>

              {/* ปุ่ม Play / Pause เรดาร์ลูป */}
              {showRainRadar && radarFrames.length > 0 && (
                <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-bold text-gray-700 border border-gray-200">
                  <button
                    onClick={() => setIsPlayingRadar(!isPlayingRadar)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg text-emerald-700 shadow-xs cursor-pointer hover:bg-emerald-50"
                  >
                    {isPlayingRadar ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlayingRadar ? 'หยุดลูป' : 'เล่นภาพลูป'}</span>
                  </button>
                  <span className="px-2 text-[11px] text-gray-500">
                    {currentFrame?.timeLabel} น.
                  </span>
                </div>
              )}

              {/* สวิตช์หมุดตรวจวัด */}
              <button
                onClick={() => setShowWeatherStations(!showWeatherStations)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  showWeatherStations
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-gray-50 text-gray-500 border-gray-200'
                }`}
              >
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                <span>หมุดตรวจวัด (16 จุด)</span>
              </button>

              {/* สลับโหมดอุณหภูมิ vs PM2.5 */}
              {showWeatherStations && (
                <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold text-gray-600 border border-gray-200">
                  <button
                    onClick={() => setWeatherMode('temp')}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                      weatherMode === 'temp'
                        ? 'bg-white text-amber-700 shadow-xs'
                        : 'hover:text-gray-900'
                    }`}
                  >
                    °C อุณหภูมิ
                  </button>
                  <button
                    onClick={() => setWeatherMode('pm25')}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                      weatherMode === 'pm25'
                        ? 'bg-white text-emerald-700 shadow-xs'
                        : 'hover:text-gray-900'
                    }`}
                  >
                    µg ฝุ่น PM2.5
                  </button>
                </div>
              )}
            </>
          )}

          {/* หมวดท่องเที่ยว & ผจญภัย */}
          {activeCategory === 'tourism' && (
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin py-0.5">
              {TOURISM_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setTourismCategory(cat.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                    tourismCategory === cat.id
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* หมวดมินิเกม */}
          {activeCategory === 'minigame' && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-600" />
                <span>
                  ข้อที่ {quizIndex + 1}/{GEO_QUIZ_QUESTIONS.length}
                </span>
              </span>
              <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                คะแนน: {quizScore} pts
              </span>
              {quizStreak > 1 && (
                <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1 animate-pulse">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  <span>Streak {quizStreak}x</span>
                </span>
              )}
            </div>
          )}

          {/* สวิตช์ขอบเขต 77 จังหวัด */}
          <button
            onClick={() => setShowProvincesOverlay(!showProvincesOverlay)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              showProvincesOverlay
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>ขอบเขต 77 จังหวัด</span>
          </button>
        </div>

        {/* ตัวนับถอยหลัง (เฉพาะหมวดการบิน) */}
        {activeCategory === 'aviation' && (
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>รีเฟรชในอีก {flightCountdown} วินาที</span>
            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-1000 ease-linear rounded-full"
                style={{
                  width: `${(flightCountdown / AUTO_REFRESH_INTERVAL) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* แจ้งเตือน Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[2000] bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* แผนที่ Leaflet และ แถบควบคุมข้อมูลด้านข้าง */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        {/* แผนที่ Leaflet (3 คอลัมน์บนจอใหญ่ - ขยายเต็มความสูง 100% เสมอ) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs relative flex flex-col h-full min-h-[600px]">
          {/* ช่องค้นหาลอยบนแผนที่ */}
          <div className="absolute top-4 left-4 z-[500] w-64 sm:w-72">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาชื่อจังหวัด (เช่น เชียงใหม่, ภูเก็ต)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>

            {searchQuery && (
              <div className="mt-1 max-h-48 overflow-y-auto bg-white/95 backdrop-blur-md rounded-xl border border-gray-200 shadow-lg p-1 space-y-1">
                {filteredProvinces.slice(0, 6).map((p) => (
                  <div
                    key={p.en}
                    onClick={() => {
                      const layer = provinceLayersRef.current[p.en]
                      if (layer && mapInstanceRef.current) {
                        mapInstanceRef.current.fitBounds(layer.getBounds(), {
                          padding: [60, 60],
                          maxZoom: 9,
                          animate: true,
                        })
                      }
                      setActiveProvince(p)
                      setSearchQuery('')
                    }}
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs hover:bg-blue-50 cursor-pointer text-gray-700"
                  >
                    <span className="font-medium text-gray-900">{p.th}</span>
                    <span className="text-[11px] text-gray-400">{p.en}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ป้าย Legend สัญลักษณ์มุมล่างซ้าย */}
          <div className="absolute bottom-4 left-4 z-[500] bg-white/90 backdrop-blur-md p-3 rounded-xl border border-gray-200 shadow-md text-xs space-y-1.5 hidden sm:block">
            <span className="font-bold text-gray-800 block text-[11px] uppercase tracking-wider mb-1">
              คำอธิบายหมุดในโหมดนี้
            </span>
            {activeCategory === 'aviation' && (
              <>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-sm">✈️</span>
                  <span>เครื่องบินพาณิชย์จริง (หมุนตามทิศจริง)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-sm">🛫</span>
                  <span>ท่าอากาศยานหลัก 12 แห่ง</span>
                </div>
              </>
            )}
            {activeCategory === 'weather' && (
              <>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="w-3 h-2 rounded bg-gradient-to-r from-emerald-500 via-yellow-400 to-red-500"></span>
                  <span>เรดาร์ฝน RainViewer (เขียว=เบา, ส้ม/แดง=หนัก)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>PM2.5 ระดับดีมาก (0 - 15 µg)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                  <span>PM2.5 เริ่มมีผลต่อสุขภาพ (37.5+ µg)</span>
                </div>
              </>
            )}
            {activeCategory === 'tourism' && (
              <>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>🥾</span>
                  <span>เดินป่า & แคมป์ปิ้ง (ภูกระดึง, ช้างเผือก, โมโกจู)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>⛰️</span>
                  <span>ภูเขา & ทะเลหมอก (ภูชี้ฟ้า, ทับเบิก, ปางอุ๋ง)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>🏝️</span>
                  <span>เกาะ & ทะเล (หลีเป๊ะ, กูด, เต่า, พีพี, สิมิลัน)</span>
                </div>
              </>
            )}
            {activeCategory === 'minigame' && (
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-sm">🎯</span>
                <span>คลิกตอบคำถามทางขวาเพื่อเฉลยพิกัด</span>
              </div>
            )}
          </div>

          {/* กล่องแสดงแผนที่ Leaflet (ขยายเต็มพื้นที่ความสูง 100% เสมอ) */}
          <div
            ref={mapContainerRef}
            className="w-full flex-1 h-full min-h-[600px] sm:min-h-[660px] md:min-h-[720px] z-0 select-none bg-slate-100"
          ></div>
        </div>

        {/* แถบข้อมูลด้านข้าง (เปลี่ยนไปตามหมวดหมู่ที่เลือก) */}
        <div className="space-y-4 flex flex-col">
          {/* ==================================================== */}
          {/* หมวดที่ 1: คมนาคม & การบิน (Aviation UI) */}
          {/* ==================================================== */}
          {activeCategory === 'aviation' && (
            <>
              {/* เมนู 3 Tabs ด้านข้าง */}
              <div className="grid grid-cols-3 bg-gray-100 p-1 rounded-xl text-xs font-semibold text-gray-600 border border-gray-200">
                <button
                  onClick={() => setRightPanelTab('flights')}
                  className={`py-2 rounded-lg flex flex-col items-center justify-center gap-0.5 transition cursor-pointer ${
                    rightPanelTab === 'flights'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'hover:text-gray-900'
                  }`}
                >
                  <Plane className="w-3.5 h-3.5" />
                  <span className="text-[11px]">เที่ยวบิน ({flights.length})</span>
                </button>
                <button
                  onClick={() => setRightPanelTab('airports')}
                  className={`py-2 rounded-lg flex flex-col items-center justify-center gap-0.5 transition cursor-pointer ${
                    rightPanelTab === 'airports'
                      ? 'bg-white text-sky-600 shadow-xs'
                      : 'hover:text-gray-900'
                  }`}
                >
                  <PlaneTakeoff className="w-3.5 h-3.5" />
                  <span className="text-[11px]">สนามบิน (12)</span>
                </button>
                <button
                  onClick={() => setRightPanelTab('province')}
                  className={`py-2 rounded-lg flex flex-col items-center justify-center gap-0.5 transition cursor-pointer ${
                    rightPanelTab === 'province'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'hover:text-gray-900'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-[11px]">จังหวัด (77)</span>
                </button>
              </div>

              {/* Tab 1: เที่ยวบิน */}
              {rightPanelTab === 'flights' && (
                <div className="space-y-4 flex-1 flex flex-col">
                  {selectedFlight ? (
                    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-5 rounded-2xl shadow-lg border border-slate-700 relative overflow-hidden animate-fadeIn">
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border"
                          style={{
                            backgroundColor: `${selectedFlight.airlineColor}25`,
                            color: '#38bdf8',
                            borderColor: '#38bdf840',
                          }}
                        >
                          {selectedFlight.airlineCode || 'FLIGHT'} • {selectedFlight.icao24}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                            <Radio className="w-2.5 h-2.5 animate-ping text-emerald-400" />
                            Live ADS-B
                          </span>
                          <button
                            onClick={() => setSelectedFlight(null)}
                            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-2xl font-black tracking-tight mb-1 flex items-center gap-2">
                        <span>{selectedFlight.callsign}</span>
                        {selectedFlight.isThaiAirline && (
                          <span className="text-xs px-2 py-0.5 rounded bg-blue-500/30 text-blue-300 border border-blue-400/30 font-medium">
                            🇹🇭 ไทย
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-sky-200 font-semibold mb-3">
                        {selectedFlight.airline}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-white/5 p-3 rounded-xl border border-white/10 mb-3">
                        <div>
                          <span className="text-[11px] text-slate-400 block">ระดับความสูง</span>
                          <span className="font-bold text-sky-300 text-sm">
                            {selectedFlight.altitudeFeet.toLocaleString()} ft
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-400 block">ความเร็วพื้นดิน</span>
                          <span className="font-bold text-amber-300 text-sm">
                            {selectedFlight.velocityKmh} km/h
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-400 block">ทิศทางบิน</span>
                          <span className="font-bold text-white text-xs">
                            {selectedFlight.heading}° {getCompassDirection(selectedFlight.heading)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-400 block">สถานะการบิน</span>
                          <span className="font-bold text-emerald-400 text-xs">
                            {selectedFlight.onGround ? 'อยู่บนรันเวย์' : 'กำลังบิน'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blue-50/80 border border-blue-200 p-4 rounded-2xl text-xs text-blue-900">
                      <div className="flex items-center gap-2 font-bold mb-1">
                        <Plane className="w-4 h-4 text-blue-600" />
                        <span>ตรวจพบ {flights.length} เที่ยวบินในเรดาร์</span>
                      </div>
                      <p className="text-gray-600">
                        คลิกที่รูปเครื่องบินบนแผนที่ หรือค้นหาชื่อสายการบิน/รหัสเที่ยวบินเพื่อดูความสูงและความเร็วแบบสดๆ
                      </p>
                    </div>
                  )}

                  {/* ช่องค้นหาเที่ยวบิน */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="ค้นหา Callsign หรือสายการบิน..."
                      value={flightSearch}
                      onChange={(e) => setFlightSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                    />
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                  </div>

                  {/* รายการเที่ยวบินในเรดาร์ */}
                  <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex-1 flex flex-col">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>สัญญาณเรดาร์เที่ยวบินสด</span>
                      <span className="text-[11px] text-blue-600 font-bold">{displayedFlights.length} ลำ</span>
                    </span>

                    <div
                      className={`space-y-2 overflow-y-auto pr-1 ${
                        selectedFlight ? 'max-h-[260px]' : 'max-h-[460px]'
                      }`}
                    >
                      {displayedFlights.map((flight) => (
                        <div
                          key={flight.icao24}
                          onClick={() => {
                            setSelectedFlight(flight)
                            mapInstanceRef.current?.setView([flight.lat, flight.lng], 9, {
                              animate: true,
                            })
                          }}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all duration-200 ${
                            selectedFlight?.icao24 === flight.icao24
                              ? 'bg-blue-50 border-blue-400'
                              : 'bg-gray-50/60 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-gray-900 flex items-center gap-1.5">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: flight.airlineColor }}
                              ></span>
                              <span>{flight.callsign}</span>
                            </span>
                            <span className="text-blue-600 font-semibold text-[11px]">
                              {flight.altitudeFeet.toLocaleString()} ft
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-gray-500">
                            <span className="truncate max-w-[140px]">{flight.airline}</span>
                            <span>{flight.velocityKmh} km/h</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: สนามบิน */}
              {rightPanelTab === 'airports' && (
                <div className="space-y-4 flex-1 flex flex-col">
                  {selectedAirport && (
                    <div className="bg-gradient-to-br from-sky-900 via-sky-800 to-blue-900 text-white p-5 rounded-2xl shadow-lg border border-sky-700 relative overflow-hidden animate-fadeIn">
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded-md bg-white/20 text-white text-[10px] font-extrabold uppercase border border-white/30">
                          {selectedAirport.iata} • {selectedAirport.icao}
                        </span>
                        <button
                          onClick={() => setSelectedAirport(null)}
                          className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-sky-200 hover:text-white transition cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h3 className="text-lg font-black tracking-tight mb-0.5">
                        {selectedAirport.nameTh}
                      </h3>
                      <p className="text-xs text-sky-200 mb-3">{selectedAirport.nameEn}</p>
                      <div className="space-y-1.5 text-xs bg-white/10 p-3 rounded-xl border border-white/15">
                        <div className="flex justify-between">
                          <span className="text-sky-200">จังหวัด:</span>
                          <span className="font-semibold text-white">{selectedAirport.province}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sky-200">ทางวิ่ง:</span>
                          <span className="font-semibold text-white">{selectedAirport.runways}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sky-200">ความจุผู้โดยสาร:</span>
                          <span className="font-semibold text-amber-300">{selectedAirport.passengersYear}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex-1 flex flex-col">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      ท่าอากาศยานหลัก ({MAJOR_AIRPORTS.length} แห่ง)
                    </span>
                    <div
                      className={`space-y-2 overflow-y-auto pr-1 ${
                        selectedAirport ? 'max-h-[260px]' : 'max-h-[480px]'
                      }`}
                    >
                      {MAJOR_AIRPORTS.map((airport) => (
                        <div
                          key={airport.iata}
                          onClick={() => {
                            setSelectedAirport(airport)
                            mapInstanceRef.current?.setView(airport.pos, 11, { animate: true })
                          }}
                          className="p-2.5 rounded-xl border border-gray-200/80 bg-gray-50/60 hover:bg-sky-50 hover:border-sky-300 cursor-pointer text-xs transition"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-gray-900 flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 bg-sky-100 text-sky-800 rounded font-extrabold text-[10px]">
                                {airport.iata}
                              </span>
                              <span>{airport.nameTh}</span>
                            </span>
                            <span className="text-[11px] text-gray-400">จ.{airport.province}</span>
                          </div>
                          <div className="flex justify-between text-[11px] text-gray-400">
                            <span>{airport.nameEn}</span>
                            <span className="text-sky-700 font-semibold">{airport.passengersYear}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: ข้อมูลจังหวัด */}
              {rightPanelTab === 'province' && (
                <div className="space-y-4 flex-1 flex flex-col">
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                      ข้อมูลจังหวัด
                    </span>
                    {currentDisplayProvince ? (
                      <div>
                        <h3 className="text-2xl font-black text-gray-900">{currentDisplayProvince.th}</h3>
                        <p className="text-xs text-gray-400 mb-3">{currentDisplayProvince.en} Province</p>
                        <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-gray-500">ภูมิภาค:</span>
                            <span className="font-semibold text-gray-800">
                              {REGIONS[currentDisplayProvince.region]?.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 py-6 text-center">
                        คลิกเลือกจังหวัดบนแผนที่เพื่อดูข้อมูล
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ==================================================== */}
          {/* หมวดที่ 2: สิ่งแวดล้อม & สภาพอากาศ (Weather UI) */}
          {/* ==================================================== */}
          {activeCategory === 'weather' && (
            <div className="space-y-4 flex-1 flex flex-col">
              {/* เรดาร์ฝน RainViewer Live Banner */}
              <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-4 rounded-2xl border border-emerald-700/50 shadow-md">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-extrabold text-emerald-300 flex items-center gap-1.5">
                    <CloudRain className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>เรดาร์กลุ่มฝนสด RainViewer</span>
                  </span>
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                    {isPlayingRadar ? 'กำลังเล่นลูป ▶' : 'หยุดชั่วคราว ⏸'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  แผนที่แสดงกลุ่มเมฆฝนจริงที่กำลังเคลื่อนตัวเหนือน่านน้ำและแผ่นดินไทย สีเขียว=ฝนเบา, สีเหลือง/แดง=ฝนตกหนัก
                </p>
              </div>

              {/* การ์ดเจาะลึกสถานีตรวจวัดสภาพอากาศ */}
              {selectedWeatherStation ? (
                <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 text-white p-5 rounded-2xl shadow-lg border border-emerald-800/40 relative overflow-hidden animate-fadeIn">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ตรวจวัดสด • Open-Meteo
                    </span>
                    <button
                      onClick={() => setSelectedWeatherStation(null)}
                      className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-2xl font-black tracking-tight mb-0.5 flex items-center gap-2">
                    <span>{selectedWeatherStation.province}</span>
                    <span className="text-xl">{selectedWeatherStation.weatherIcon}</span>
                  </h3>
                  <p className="text-xs text-emerald-200 mb-3 font-medium">
                    {selectedWeatherStation.provinceEn} • {selectedWeatherStation.weatherLabel}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-white/5 p-3 rounded-xl border border-white/10 mb-3">
                    <div>
                      <span className="text-[11px] text-slate-400 block">อุณหภูมิปัจจุบัน</span>
                      <span className="font-bold text-amber-300 text-base">
                        {selectedWeatherStation.temperature}°C
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">ฝุ่น PM2.5</span>
                      <span
                        className="font-bold text-base"
                        style={{ color: selectedWeatherStation.aqiColor }}
                      >
                        {selectedWeatherStation.pm25} µg/m³
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">ความชื้นสัมพัทธ์</span>
                      <span className="font-bold text-sky-300 text-xs">
                        {selectedWeatherStation.humidity}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">ความเร็วลม</span>
                      <span className="font-bold text-slate-200 text-xs">
                        {selectedWeatherStation.windSpeed} km/h
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/10 text-xs border border-white/10">
                    <span className="font-bold block mb-0.5" style={{ color: selectedWeatherStation.aqiColor }}>
                      ระดับ: {selectedWeatherStation.aqiLabel}
                    </span>
                    <p className="text-[11px] text-slate-300">{selectedWeatherStation.aqiDesc}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-900">
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <CloudSun className="w-4 h-4 text-emerald-600" />
                    <span>ข้อมูลสภาพอากาศ & ฝุ่น PM2.5 แบบสด</span>
                  </div>
                  <p className="text-gray-600">
                    คลิกหมุดสภาพอากาศบนแผนที่ เพื่อดูอุณหภูมิ ความชื้น ความเร็วลม และคำแนะนำสุขภาพรายจังหวัด
                  </p>
                </div>
              )}

              {/* รายการสถานีตรวจวัดสภาพอากาศ */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex-1 flex flex-col">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>สถานีตรวจวัดสภาพอากาศ 16 จุด</span>
                  <span className="text-[11px] text-emerald-600 font-bold">Live</span>
                </span>

                <div
                  className={`space-y-2 overflow-y-auto pr-1 ${
                    selectedWeatherStation ? 'max-h-[220px]' : 'max-h-[440px]'
                  }`}
                >
                  {weatherStations.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => {
                        setSelectedWeatherStation(st)
                        mapInstanceRef.current?.setView([st.lat, st.lng], 9, { animate: true })
                      }}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all duration-200 ${
                        selectedWeatherStation?.id === st.id
                          ? 'bg-emerald-50 border-emerald-400'
                          : 'bg-gray-50/60 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-gray-900 flex items-center gap-1.5">
                          <span className="text-sm">{st.weatherIcon}</span>
                          <span>{st.province}</span>
                        </span>
                        <span className="font-bold text-amber-700">{st.temperature}°C</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-500">
                        <span>{st.weatherLabel}</span>
                        <span
                          className="font-semibold px-1.5 py-0.2 rounded"
                          style={{
                            backgroundColor: `${st.aqiColor}20`,
                            color: st.aqiColor,
                          }}
                        >
                          PM2.5: {st.pm25} µg
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* หมวดที่ 3: ท่องเที่ยว & ผจญภัย (Tourism UI - 28+ แห่ง) */}
          {/* ==================================================== */}
          {activeCategory === 'tourism' && (
            <div className="space-y-4 flex-1 flex flex-col">
              {/* การ์ดเจาะลึกแหล่งท่องเที่ยว */}
              {selectedLandmark ? (
                <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 text-white p-5 rounded-2xl shadow-lg border border-amber-700/40 relative overflow-hidden animate-fadeIn">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {selectedLandmark.categoryLabel}
                    </span>
                    <button
                      onClick={() => setSelectedLandmark(null)}
                      className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-xl font-black tracking-tight mb-0.5">
                    {selectedLandmark.nameTh}
                  </h3>
                  <p className="text-xs text-amber-200 mb-3 font-medium">
                    {selectedLandmark.nameEn} • จ.{selectedLandmark.province}
                  </p>

                  <div className="space-y-1.5 text-xs bg-white/10 p-3 rounded-xl border border-white/15 mb-3">
                    <div className="flex justify-between">
                      <span className="text-amber-200">ฤดูกาลน่าเที่ยว:</span>
                      <span className="font-semibold text-amber-300">{selectedLandmark.bestSeason}</span>
                    </div>
                    {selectedLandmark.difficulty && (
                      <div className="flex justify-between">
                        <span className="text-amber-200">ระดับความยาก:</span>
                        <span className="font-semibold text-white truncate max-w-[180px]">{selectedLandmark.difficulty}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-amber-200">ค่าธรรมเนียม:</span>
                      <span className="font-semibold text-slate-200 truncate max-w-[180px]">{selectedLandmark.ticketFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-200">คะแนนความนิยม:</span>
                      <span className="font-semibold text-yellow-400">★ {selectedLandmark.rating} / 5.0</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/35 text-xs border border-white/10">
                    <span className="text-[11px] text-amber-300 font-bold block mb-1">จุดเด่นที่น่าสนใจ:</span>
                    <p className="text-[11px] text-slate-200 leading-relaxed">{selectedLandmark.highlight}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900">
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <Footprints className="w-4 h-4 text-amber-600" />
                    <span>เดินป่า ภูเขา เกาะสวรรค์ & มรดกโลก ({TOURISM_LANDMARKS.length} แห่ง)</span>
                  </div>
                  <p className="text-gray-600">
                    คลิกหมุดสถานที่ท่องเที่ยวบนแผนที่เพื่อดูข้อมูลเส้นทางเดินป่า ช่วงเวลาน่าเที่ยว อัตราค่าบริการ และจุดกางเต็นท์
                  </p>
                </div>
              )}

              {/* ช่องค้นหาสถานที่ท่องเที่ยว */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="ค้นหาชื่อที่เที่ยว เช่น ภูกระดึง, หลีเป๊ะ, ภูทับเบิก..."
                  value={tourismSearch}
                  onChange={(e) => setTourismSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              </div>

              {/* รายการสถานที่ท่องเที่ยว */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex-1 flex flex-col">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>สถานที่ยอดนิยม</span>
                  <span className="text-[11px] text-amber-700 font-bold">
                    {TOURISM_LANDMARKS.filter((l) =>
                      tourismCategory === 'all' ? true : l.category === tourismCategory
                    ).length} แห่ง
                  </span>
                </span>

                <div
                  className={`space-y-2 overflow-y-auto pr-1 ${
                    selectedLandmark ? 'max-h-[220px]' : 'max-h-[440px]'
                  }`}
                >
                  {TOURISM_LANDMARKS.filter((l) => {
                    if (tourismCategory !== 'all' && l.category !== tourismCategory) return false
                    if (tourismSearch) {
                      const q = tourismSearch.toLowerCase()
                      return (
                        l.nameTh.toLowerCase().includes(q) ||
                        l.nameEn.toLowerCase().includes(q) ||
                        l.province.toLowerCase().includes(q)
                      )
                    }
                    return true
                  }).map((landmark) => (
                    <div
                      key={landmark.id}
                      onClick={() => {
                        setSelectedLandmark(landmark)
                        mapInstanceRef.current?.setView(landmark.pos, 11, { animate: true })
                      }}
                      className="p-2.5 rounded-xl border border-gray-200/80 bg-gray-50/60 hover:bg-amber-50 hover:border-amber-300 cursor-pointer text-xs transition"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-gray-900 truncate max-w-[170px]">
                          {landmark.nameTh}
                        </span>
                        <span className="text-[11px] font-semibold text-amber-700">★ {landmark.rating}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-500">
                        <span>{landmark.categoryLabel}</span>
                        <span>จ.{landmark.province}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* หมวดที่ 4: มินิเกมสำรวจไทย (Geo Quiz UI) */}
          {/* ==================================================== */}
          {activeCategory === 'minigame' && (
            <div className="space-y-4 flex-1 flex flex-col">
              {!quizFinished ? (
                <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white p-5 rounded-2xl shadow-lg border border-indigo-700/40 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      คำถามข้อที่ {quizIndex + 1}/{GEO_QUIZ_QUESTIONS.length}
                    </span>
                    <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      {quizScore} pts
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 leading-snug">
                    {currentQuiz.question}
                  </h3>

                  <p className="text-xs text-indigo-200 mb-4 bg-white/10 p-2.5 rounded-xl border border-white/10">
                    💡 <b>คำใบ้:</b> {currentQuiz.hint}
                  </p>

                  {/* ตัวเลือก 4 ข้อ */}
                  <div className="space-y-2 mb-4">
                    {currentQuiz.options.map((option) => {
                      const isSelected = quizSelectedOption === option
                      const isCorrect = option === currentQuiz.correct
                      let btnStyle = 'bg-white/10 hover:bg-white/20 text-white border-white/15'

                      if (quizAnswered) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-600 text-white border-emerald-400 font-bold'
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-600 text-white border-rose-400 line-through'
                        } else {
                          btnStyle = 'bg-white/5 text-gray-400 border-white/5 opacity-50'
                        }
                      }

                      return (
                        <button
                          key={option}
                          onClick={() => handleQuizAnswer(option)}
                          disabled={quizAnswered}
                          className={`w-full p-2.5 rounded-xl text-xs text-left border transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{option}</span>
                          {quizAnswered && isCorrect && <Check className="w-4 h-4 text-emerald-300" />}
                        </button>
                      )
                    })}
                  </div>

                  {/* เฉลยข้อเท็จจริง & ปุ่มถัดไป */}
                  {quizAnswered && (
                    <div className="pt-3 border-t border-white/15 space-y-3 animate-fadeIn">
                      <p className="text-xs text-slate-300 leading-relaxed">
                        📖 <b>เกร็ดความรู้:</b> {currentQuiz.fact}
                      </p>
                      <button
                        onClick={handleNextQuiz}
                        className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
                      >
                        <span>{quizIndex + 1 === GEO_QUIZ_QUESTIONS.length ? 'ดูคะแนนสรุป' : 'ข้อถัดไป →'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* หน้าสรุปผลคะแนนเมื่อเล่นจบ */
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-300 mx-auto flex items-center justify-center text-3xl shadow-sm">
                    🏆
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900">ยอดเยี่ยมมาก! สำรวจครบ 10 ข้อแล้ว</h3>
                    <p className="text-xs text-gray-500 mt-1">คะแนนรวมของคุณ</p>
                    <p className="text-4xl font-black text-blue-600 mt-1">{quizScore} / 1000</p>
                  </div>

                  <p className="text-xs text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200 font-semibold">
                    {quizScore >= 800
                      ? '🏅 ผู้เชี่ยวชาญภูมิศาสตร์ไทยระดับทองคำ!'
                      : quizScore >= 500
                      ? '🥈 นักสำรวจดินแดนสยามระดับเหรียญเงิน!'
                      : '🥉 พยายามได้ดีมาก ลองเล่นอีกรอบเพื่อทำคะแนนเต็ม!'}
                  </p>

                  <button
                    onClick={handleRestartQuiz}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-md"
                  >
                    เล่นใหม่อีกครั้ง 🔄
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MapPage
