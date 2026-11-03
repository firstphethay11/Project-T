import { useState } from 'react'
import {
  Home,
  Users,
  FolderGit2,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'

function Aside({ currentPage, setCurrentPage }) {
  // สถานะเปิด/พับแถบด้านข้าง (false = กางออก, true = พับเก็บเหลือแต่ไอคอน)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { id: 'home', label: 'หน้าแรก (Home)', icon: Home },
    { id: 'about', label: 'สมาชิกในทีม (About)', icon: Users },
  ]

  return (
    <aside
      className={`bg-white border-r border-gray-200 flex flex-col justify-between transition-all duration-300 shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* ส่วนบน: หัวข้อเมนู + ปุ่มพับ/กางหน้าต่าง */}
      <div className="p-4">
        <div
          className={`flex items-center mb-6 pb-3 border-b border-gray-100 ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          {!isCollapsed && (
            <div className="flex items-center gap-2 text-blue-600 font-bold text-base truncate">
              <FolderGit2 className="w-5 h-5 shrink-0" />
              <span>เมนูนำทาง</span>
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'กางแถบเมนูออก' : 'พับแถบเมนูเก็บ'}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition cursor-pointer"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* รายการเมนู */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id

            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                title={isCollapsed ? item.label : ''}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition cursor-pointer ${
                  isCollapsed ? 'justify-center' : 'justify-start'
                } ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            )
          })}
        </nav>
      </div>

      {/* ส่วนล่างของ Aside */}
      <div className="p-4 border-t border-gray-100">
        <button
          title={isCollapsed ? 'ตั้งค่า (Settings)' : ''}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition cursor-pointer ${
            isCollapsed ? 'justify-center' : 'justify-start'
          }`}
        >
          <Settings className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="truncate">ตั้งค่า (Settings)</span>}
        </button>
      </div>
    </aside>
  )
}

export default Aside

