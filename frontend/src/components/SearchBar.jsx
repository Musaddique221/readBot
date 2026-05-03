import { useState } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'

export default function SearchBar({ onSearch, initialValue = '' }) {
  const { isDark } = useTheme()
  const [value, setValue] = useState(initialValue)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(value.trim())
  }

  const handleClear = () => {
    setValue('')
    onSearch('')
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all duration-300 ${
        isDark
          ? 'bg-gray-900 border-gray-700 focus-within:border-violet-500'
          : 'bg-white border-gray-200 focus-within:border-violet-500'
      } shadow-lg`}>
        <FiSearch className={`text-lg flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Search books by title, author..."
          className={`flex-1 bg-transparent outline-none text-sm ${
            isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
          }`}
        />
        {value && (
          <button type="button" onClick={handleClear} className="text-gray-400 hover:text-gray-300 transition-colors">
            <FiX size={16} />
          </button>
        )}
        <button
          type="submit"
          className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-1.5 rounded-xl transition-colors flex-shrink-0"
        >
          Search
        </button>
      </div>
    </form>
  )
}
