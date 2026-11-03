import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

// หน้าแรกของ API เช็กว่าเซิร์ฟเวอร์ทำงานไหม
app.get('/', (req, res) => {
  res.json({ message: 'Backend API ของ Project-T ทำงานปกติครับ!' })
})

// ตัวอย่าง API ดึงรายชื่อสมาชิกในทีม (ลองแก้ข้อมูลตรงนี้เพื่อฝึก Git ฝั่ง Backend ได้)
app.get('/api/members', (req, res) => {
  res.json([
    {
      id: 1,
      name: '[ใส่ชื่อของคุณ]',
      role: 'Frontend Developer',
      greeting: 'สวัสดีครับ มาฝึกใช้ Git ด้วยกัน!',
    },
    {
      id: 2,
      name: '[ใส่ชื่อของเพื่อน]',
      role: 'Backend & UI Developer',
      greeting: 'ยินดีที่ได้ร่วมทีมครับ!',
    },
  ])
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

