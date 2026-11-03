import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise'

const app = express()
const PORT = 5001

app.use(cors())
app.use(express.json())

// ตั้งค่าการเชื่อมต่อ MySQL ของ Project-T (พอร์ต 3307)
const pool = mysql.createPool({
  host: 'localhost',
  port: 3307,
  user: 'root',
  password: '1234',
  database: 'project_t_db',
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
})

// หน้าแรกของ API เช็กว่าเซิร์ฟเวอร์ทำงานไหม
app.get('/', (req, res) => {
  res.json({ message: 'Backend API ของ Project-T (MySQL Port 3307) ทำงานปกติครับ!' })
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

// API สำหรับสมัครสมาชิกใหม่ (Register)
app.post('/api/register', async (req, res) => {
  const { username, password, full_name, role } = req.body

  if (!username || !password || !full_name) {
    return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' })
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO users (username, password, full_name, role) VALUES (?, ?, ?, ?)',
      [username, password, full_name, role || 'Member']
    )

    res.status(201).json({
      message: 'สมัครสมาชิกสำเร็จ!',
      user: {
        id: result.insertId,
        username,
        full_name,
        role: role || 'Member',
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
