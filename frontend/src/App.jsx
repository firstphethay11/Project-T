import { useState } from 'react'
import Navbar from './components/Navbar'
import Aside from './components/Aside'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import GuidePage from './pages/GuidePage'
import Game from './pages/Game'

function App() {
  // เก็บสถานะว่าตอนนี้เปิดหน้าไหนอยู่ ('home', 'about', 'guide', หรือ 'game')
  const [currentPage, setCurrentPage] = useState('home')

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* ส่วนแถบเมนูด้านบน */}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* ส่วนกลาง: แบ่งเป็น Aside ด้านซ้าย และ เนื้อหาหลักด้านขวา */}
      <div className="flex flex-1 min-h-0">
        <Aside currentPage={currentPage} setCurrentPage={setCurrentPage} />

        <div className="flex-1 flex flex-col min-h-0">
          {/* ส่วนเนื้อหาหลักที่สลับตามปุ่มที่กด */}
          <main
            className={`flex-grow w-full mx-auto ${
              currentPage === 'game'
                ? 'max-w-5xl px-4 py-3 flex flex-col justify-center'
                : 'max-w-4xl px-6 py-8'
            }`}
          >
            {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} />}
            {currentPage === 'about' && <AboutPage />}
            {currentPage === 'guide' && <GuidePage setCurrentPage={setCurrentPage} />}
            {currentPage === 'game' && <Game />}
          </main>

          {/* ส่วนท้ายเว็บ - ซ่อนในหน้าเกมเพื่อให้แสดงผลเต็มหน้าจอ 1 หน้าพอดี */}
          {currentPage !== 'game' && <Footer />}
        </div>
      </div>
    </div>
  )
}

export default App
