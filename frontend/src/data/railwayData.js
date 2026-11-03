// ข้อมูลเส้นทางรถไฟแห่งประเทศไทย (State Railway of Thailand - SRT)
// พิกัดเส้นทางหลัก 4 ภาค พร้อมสถานีสำคัญ และขบวนรถไฟจำลองแบบ Real-time

export const RAILWAY_LINES = {
  north: {
    id: 'north',
    name: 'ทางรถไฟสายเหนือ',
    color: '#0284c7', // Sky Blue
    description: 'กรุงเทพฯ - อยุธยา - พิษณุโลก - ลำปาง - เชียงใหม่',
    stations: [
      { name: 'สถานีกลางกรุงเทพอภิวัฒน์', pos: [13.8039, 100.5404], major: true },
      { name: 'ดอนเมือง', pos: [13.9130, 100.6015] },
      { name: 'อยุธยา', pos: [14.3570, 100.5830], major: true },
      { name: 'ลพบุรี', pos: [14.7995, 100.6158] },
      { name: 'นครสวรรค์', pos: [15.6791, 100.1654], major: true },
      { name: 'พิจิตร', pos: [16.4422, 100.3475] },
      { name: 'พิษณุโลก', pos: [16.8173, 100.2657], major: true },
      { name: 'ศิลาอาสน์ (อุตรดิตถ์)', pos: [17.6533, 100.0988] },
      { name: 'เด่นชัย (แพร่)', pos: [17.9780, 100.0520] },
      { name: 'นครลำปาง', pos: [18.2789, 99.4795], major: true },
      { name: 'ขุนตาน', pos: [18.5020, 99.2270] },
      { name: 'ลำพูน', pos: [18.5930, 99.0180] },
      { name: 'เชียงใหม่', pos: [18.7845, 99.0175], major: true },
    ],
    path: [
      [13.8039, 100.5404],
      [13.8610, 100.5630],
      [13.9130, 100.6015],
      [14.0150, 100.6120],
      [14.1500, 100.6050],
      [14.2800, 100.5900],
      [14.3570, 100.5830],
      [14.4800, 100.5750],
      [14.6500, 100.5900],
      [14.7995, 100.6158],
      [15.0200, 100.5500],
      [15.2500, 100.3500],
      [15.4800, 100.2200],
      [15.6791, 100.1654],
      [16.0200, 100.2200],
      [16.2500, 100.2900],
      [16.4422, 100.3475],
      [16.6500, 100.3200],
      [16.8173, 100.2657],
      [17.0500, 100.2000],
      [17.3200, 100.1300],
      [17.6533, 100.0988],
      [17.8200, 100.0600],
      [17.9780, 100.0520],
      [18.1200, 99.8800],
      [18.2789, 99.4795],
      [18.3900, 99.3500],
      [18.5020, 99.2270],
      [18.5930, 99.0180],
      [18.7845, 99.0175],
    ],
  },

  northeastNongkhai: {
    id: 'northeastNongkhai',
    name: 'สายตะวันออกเฉียงเหนือ (หนองคาย)',
    color: '#ea580c', // Orange
    description: 'กรุงเทพฯ - อยุธยา - สระบุรี - โคราช - ขอนแก่น - อุดรธานี - หนองคาย',
    stations: [
      { name: 'สระบุรี', pos: [14.5298, 100.9103] },
      { name: 'ชุมทางแก่งคอย', pos: [14.5880, 101.0020] },
      { name: 'ปากช่อง', pos: [14.7060, 101.4170] },
      { name: 'นครราชสีมา (โคราช)', pos: [14.9740, 102.0790], major: true },
      { name: 'ชุมทางบัวใหญ่', pos: [15.5860, 102.4280] },
      { name: 'เมืองพล', pos: [15.8190, 102.5970] },
      { name: 'ขอนแก่น', pos: [16.4250, 102.8270], major: true },
      { name: 'น้ำพอง', pos: [16.7020, 102.8500] },
      { name: 'กุมภวาปี', pos: [17.1120, 102.9750] },
      { name: 'อุดรธานี', pos: [17.4060, 102.8020], major: true },
      { name: 'หนองคาย', pos: [17.8680, 102.7290], major: true },
    ],
    path: [
      [14.3570, 100.5830],
      [14.4500, 100.7500],
      [14.5298, 100.9103],
      [14.5880, 101.0020],
      [14.6500, 101.2000],
      [14.7060, 101.4170],
      [14.8500, 101.7500],
      [14.9740, 102.0790],
      [15.1800, 102.2200],
      [15.3900, 102.3500],
      [15.5860, 102.4280],
      [15.8190, 102.5970],
      [16.0800, 102.7300],
      [16.4250, 102.8270],
      [16.7020, 102.8500],
      [17.1120, 102.9750],
      [17.4060, 102.8020],
      [17.6500, 102.7800],
      [17.8680, 102.7290],
    ],
  },

  northeastUbon: {
    id: 'northeastUbon',
    name: 'สายตะวันออกเฉียงเหนือ (อุบลราชธานี)',
    color: '#d97706', // Amber
    description: 'โคราช - บุรีรัมย์ - สุรินทร์ - ศรีสะเกษ - อุบลราชธานี',
    stations: [
      { name: 'ชุมทางถนนจิระ', pos: [14.9730, 102.1020] },
      { name: 'บุรีรัมย์', pos: [14.9960, 103.1090], major: true },
      { name: 'สุรินทร์', pos: [14.8870, 103.4930], major: true },
      { name: 'ศรีสะเกษ', pos: [15.1180, 104.3310], major: true },
      { name: 'อุบลราชธานี (วารินชำราบ)', pos: [15.2010, 104.8580], major: true },
    ],
    path: [
      [14.9740, 102.0790],
      [14.9730, 102.1020],
      [14.9900, 102.5000],
      [14.9960, 103.1090],
      [14.9400, 103.3200],
      [14.8870, 103.4930],
      [15.0200, 103.8800],
      [15.1180, 104.3310],
      [15.1500, 104.5800],
      [15.2010, 104.8580],
    ],
  },

  south: {
    id: 'south',
    name: 'ทางรถไฟสายใต้',
    color: '#7c3aed', // Purple
    description: 'กรุงเทพฯ - หัวหิน - ชุมพร - สุราษฎร์ฯ - หาดใหญ่ - สุไหงโก-ลก',
    stations: [
      { name: 'นครปฐม', pos: [13.8190, 100.0580] },
      { name: 'ราชบุรี', pos: [13.5380, 99.8220] },
      { name: 'เพชรบุรี', pos: [13.1150, 99.9410] },
      { name: 'หัวหิน', pos: [12.5685, 99.9540], major: true },
      { name: 'ประจวบคีรีขันธ์', pos: [11.8080, 99.7950] },
      { name: 'ชุมพร', pos: [10.4960, 99.1780], major: true },
      { name: 'สุราษฎร์ธานี (พุนพิน)', pos: [9.1060, 99.2320], major: true },
      { name: 'ชุมทางทุ่งสง', pos: [8.1630, 99.6800], major: true },
      { name: 'พัทลุง', pos: [7.6170, 100.0760] },
      { name: 'ชุมทางหาดใหญ่', pos: [7.0040, 100.4680], major: true },
      { name: 'ยะลา', pos: [6.5410, 101.2820] },
      { name: 'สุไหงโก-ลก', pos: [6.0270, 101.9670], major: true },
    ],
    path: [
      [13.8039, 100.5404],
      [13.7900, 100.4000],
      [13.8190, 100.0580],
      [13.6800, 99.9200],
      [13.5380, 99.8220],
      [13.3200, 99.8800],
      [13.1150, 99.9410],
      [12.8200, 99.9600],
      [12.5685, 99.9540],
      [12.2500, 99.9600],
      [11.8080, 99.7950],
      [11.3500, 99.5200],
      [10.9000, 99.3500],
      [10.4960, 99.1780],
      [9.8000, 99.1200],
      [9.1060, 99.2320],
      [8.6500, 99.4500],
      [8.1630, 99.6800],
      [7.8500, 99.8800],
      [7.6170, 100.0760],
      [7.3500, 100.2200],
      [7.0040, 100.4680],
      [6.8000, 100.8500],
      [6.5410, 101.2820],
      [6.3000, 101.6200],
      [6.0270, 101.9670],
    ],
  },

  east: {
    id: 'east',
    name: 'ทางรถไฟสายตะวันออก',
    color: '#db2777', // Pink
    description: 'กรุงเทพฯ - ฉะเชิงเทรา - ปราจีนบุรี - สระแก้ว - อรัญประเทศ',
    stations: [
      { name: 'ฉะเชิงเทรา', pos: [13.6970, 101.0770], major: true },
      { name: 'ปราจีนบุรี', pos: [14.0580, 101.3710] },
      { name: 'กบินทร์บุรี', pos: [13.9930, 101.7160] },
      { name: 'สระแก้ว', pos: [13.8200, 102.0670] },
      { name: 'อรัญประเทศ', pos: [13.6890, 102.5080], major: true },
    ],
    path: [
      [13.8039, 100.5404],
      [13.7500, 100.6500],
      [13.7200, 100.8500],
      [13.6970, 101.0770],
      [13.8500, 101.2000],
      [14.0580, 101.3710],
      [14.0200, 101.5500],
      [13.9930, 101.7160],
      [13.8800, 101.9000],
      [13.8200, 102.0670],
      [13.7500, 102.3000],
      [13.6890, 102.5080],
    ],
  },
}

// รายการขบวนรถไฟจำลองแบบ Real-time
export const INITIAL_TRAINS = [
  {
    id: 'train-9',
    code: 'ข.9',
    name: 'ด่วนพิเศษ 9 (อุตราวิถี)',
    lineId: 'north',
    from: 'กรุงเทพอภิวัฒน์',
    to: 'เชียงใหม่',
    type: 'รถด่วนพิเศษ CNR',
    speed: 88,
    status: 'ตรงเวลา (On Time)',
    statusColor: 'emerald',
    progress: 0.35, // 35% ของเส้นทาง
    direction: 1, // วิ่งขาไป (1) หรือ ขากลับ (-1)
    passengers: 320,
    nextStation: 'พิษณุโลก',
  },
  {
    id: 'train-10',
    code: 'ข.10',
    name: 'ด่วนพิเศษ 10 (อุตราวิถี)',
    lineId: 'north',
    from: 'เชียงใหม่',
    to: 'กรุงเทพอภิวัฒน์',
    type: 'รถด่วนพิเศษ CNR',
    speed: 92,
    status: 'ตรงเวลา (On Time)',
    statusColor: 'emerald',
    progress: 0.75,
    direction: -1,
    passengers: 285,
    nextStation: 'นครสวรรค์',
  },
  {
    id: 'train-25',
    code: 'ข.25',
    name: 'ด่วนพิเศษ 25 (อีสานมรรคา)',
    lineId: 'northeastNongkhai',
    from: 'กรุงเทพอภิวัฒน์',
    to: 'หนองคาย',
    type: 'รถด่วนพิเศษ CNR',
    speed: 76,
    status: 'ดีเลย์ 4 นาที',
    statusColor: 'amber',
    progress: 0.52,
    direction: 1,
    passengers: 310,
    nextStation: 'ขอนแก่น',
  },
  {
    id: 'train-23',
    code: 'ข.23',
    name: 'ด่วนพิเศษ 23 (อีสานวัตนา)',
    lineId: 'northeastUbon',
    from: 'กรุงเทพอภิวัฒน์',
    to: 'อุบลราชธานี',
    type: 'รถด่วนพิเศษ CNR',
    speed: 84,
    status: 'ตรงเวลา (On Time)',
    statusColor: 'emerald',
    progress: 0.45,
    direction: 1,
    passengers: 290,
    nextStation: 'สุรินทร์',
  },
  {
    id: 'train-31',
    code: 'ข.31',
    name: 'ด่วนพิเศษ 31 (ทักษิณารัถย์)',
    lineId: 'south',
    from: 'กรุงเทพอภิวัฒน์',
    to: 'หาดใหญ่',
    type: 'รถด่วนพิเศษ CNR',
    speed: 96,
    status: 'ตรงเวลา (On Time)',
    statusColor: 'emerald',
    progress: 0.38,
    direction: 1,
    passengers: 340,
    nextStation: 'ประจวบคีรีขันธ์',
  },
  {
    id: 'train-32',
    code: 'ข.32',
    name: 'ด่วนพิเศษ 32 (ทักษิณารัถย์)',
    lineId: 'south',
    from: 'หาดใหญ่',
    to: 'กรุงเทพอภิวัฒน์',
    type: 'รถด่วนพิเศษ CNR',
    speed: 90,
    status: 'ดีเลย์ 7 นาที',
    statusColor: 'amber',
    progress: 0.72,
    direction: -1,
    passengers: 305,
    nextStation: 'ชุมพร',
  },
  {
    id: 'train-275',
    code: 'ข.275',
    name: 'รถธรรมดา 275 (อรัญประเทศ)',
    lineId: 'east',
    from: 'กรุงเทพฯ',
    to: 'อรัญประเทศ',
    type: 'รถธรรมดา (Ordinary)',
    speed: 62,
    status: 'ตรงเวลา (On Time)',
    statusColor: 'emerald',
    progress: 0.60,
    direction: 1,
    passengers: 180,
    nextStation: 'สระแก้ว',
  },
]

// ฟังก์ชันคำนวณตำแหน่งพิกัด [lat, lng] ตาม Progress (0.0 - 1.0) บน Polyline
export function interpolateTrainPosition(path, progress) {
  if (!path || path.length === 0) return [13.7367, 100.5231]
  if (path.length === 1) return path[0]

  const clampedProgress = Math.max(0, Math.min(1, progress))

  // คำนวณระยะทางรวมของทุก segment
  const segmentLengths = []
  let totalDist = 0

  for (let i = 0; i < path.length - 1; i++) {
    const p1 = path[i]
    const p2 = path[i + 1]
    const dLat = p2[0] - p1[0]
    const dLng = p2[1] - p1[1]
    const dist = Math.sqrt(dLat * dLat + dLng * dLng)
    segmentLengths.push(dist)
    totalDist += dist
  }

  const targetDist = clampedProgress * totalDist
  let accumulated = 0

  for (let i = 0; i < segmentLengths.length; i++) {
    const segLen = segmentLengths[i]
    if (accumulated + segLen >= targetDist || i === segmentLengths.length - 1) {
      const segProgress = segLen > 0 ? (targetDist - accumulated) / segLen : 0
      const p1 = path[i]
      const p2 = path[i + 1]
      const lat = p1[0] + (p2[0] - p1[0]) * segProgress
      const lng = p1[1] + (p2[1] - p1[1]) * segProgress
      return [lat, lng]
    }
    accumulated += segLen
  }

  return path[path.length - 1]
}
