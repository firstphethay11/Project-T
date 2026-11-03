import { useState } from 'react'
import Navbar from './components/Navbar'
import Aside from './components/aside'
import Footer from './components/Footer'
import Homepage from './pages/Homepage'
import AboutPage from './pages/AboutPage'

function App() {
  // เก็บสถานะว่าตอนนี้เปิดหน้าไหนอยู่ ('home' หรือ 'about')
  const [currentPage, setCurrentPage] = useState('home')

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* ส่วนแถบเมนูด้านบน */}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* ส่วนกลาง: แบ่งเป็น Aside ด้านซ้าย และ เนื้อหาหลักด้านขวา */}
      <div className="flex flex-1">
        <Aside currentPage={currentPage} setCurrentPage={setCurrentPage} />

        <div className="flex-1 flex flex-col">
          {/* ส่วนเนื้อหาหลักที่สลับตามปุ่มที่กด */}
          <main className="flex-grow max-w-4xl w-full mx-auto px-6 py-8">
            {currentPage === 'home' && <Homepage setCurrentPage={setCurrentPage} />}
            {currentPage === 'about' && <AboutPage />}
          </main>

          {/* ส่วนท้ายเว็บ */}
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default App
