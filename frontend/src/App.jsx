import { useState } from 'react'
import Navbar from './components/Navbar'
import Aside from './components/Aside'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import GuidePage from './pages/GuidePage'
import Game from './pages/Game'
import WerewolfGame from './pages/WerewolfGame'
import UnoGame from './pages/UnoGame'
import LoginPage from './pages/LoginPage'
import MapPage from './pages/MapPage'
import Ben10Game from './pages/Ben10Game'

function App() {
  // เก็บสถานะว่าตอนนี้เปิดหน้าไหนอยู่ ('home', 'map', 'about', 'guide', 'game', 'werewolf', 'uno', หรือ 'login')
  const [currentPage, setCurrentPage] = useState('home')
  // เก็บข้อมูลผู้ใช้ที่ Login สำเร็จจาก MySQL
  const [currentUser, setCurrentUser] = useState(null)

  // ถ้าเลือกหน้า Login ให้แสดงหน้า LoginPage แบบเดี่ยวๆ เต็มจอ (ไม่มี Navbar/Aside มารบกวน)
  if (currentPage === 'login') {
    return (
      <LoginPage
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        setCurrentPage={setCurrentPage}
      />
    )
  }

  const isGameView =
    currentPage === 'game' || currentPage === 'werewolf' || currentPage === 'uno' || currentPage === 'ben10'

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
      {/* ส่วนแถบเมนูด้านบน */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />

      {/* ส่วนกลาง: แบ่งเป็น Aside ด้านซ้าย และ เนื้อหาหลักด้านขวา */}
      <div className="flex flex-1 min-h-0">
        <Aside currentPage={currentPage} setCurrentPage={setCurrentPage} />

        <div className="flex-1 flex flex-col min-h-0">
          {/* ส่วนเนื้อหาหลักที่สลับตามปุ่มที่กด */}
          <main
            className={`flex-grow w-full mx-auto ${
              currentPage === 'game'
                ? 'max-w-[1480px] px-2 sm:px-4 py-2 sm:py-3 flex flex-col justify-center'
                : currentPage === 'uno'
                ? 'max-w-7xl px-3 sm:px-6 py-4 flex flex-col justify-center'
                : isGameView
                ? 'max-w-5xl px-4 py-3 flex flex-col justify-center'
                : currentPage === 'map'
                ? 'max-w-6xl px-4 py-4'
                : 'max-w-4xl px-6 py-8'
            }`}
          >
            {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} />}
            {currentPage === 'ben10' && <Ben10Game currentUser={currentUser} />}
            {currentPage === 'map' && <MapPage />}
            {currentPage === 'about' && <AboutPage />}
            {currentPage === 'guide' && <GuidePage setCurrentPage={setCurrentPage} />}
            {currentPage === 'game' && <Game setCurrentPage={setCurrentPage} />}
            {currentPage === 'werewolf' && <WerewolfGame setCurrentPage={setCurrentPage} />}
            {currentPage === 'uno' && <UnoGame setCurrentPage={setCurrentPage} />}
          </main>

          {/* ส่วนท้ายเว็บ - ซ่อนในหน้าเกมเพื่อให้แสดงผลเต็มหน้าจอ 1 หน้าพอดี */}
          {!isGameView && <Footer />}
        </div>
      </div>
    </div>
  )
}

export default App
