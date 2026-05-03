import { FiSun, FiMoon } from 'react-icons/fi'
import { RiRobot2Line } from 'react-icons/ri'
import { useTheme } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
      isDark ? 'bg-gray-950/90 border-gray-800' : 'bg-white/90 border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center group-hover:bg-violet-500 transition-colors">
            <RiRobot2Line className="text-white text-sm" />
          </div>
          <span className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            ReadBot
          </span>
        </button>

        <button
          onClick={toggleTheme}
          className={`p-2.5 rounded-full transition-all duration-300 ${
            isDark
              ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 hover:scale-110'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-110'
          }`}
        >
          {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
      </div>
    </nav>
  )
}
