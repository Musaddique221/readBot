import { FiFilter } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'

const CATEGORIES = ['', 'Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Self-Help', 'Technology', 'Business', 'Fantasy', 'Mystery', 'Romance']
const RATINGS = [
  { label: 'All Ratings', value: 0 },
  { label: '3+ Stars', value: 3 },
  { label: '4+ Stars', value: 4 },
]
const SORT = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Newest', value: 'newest' },
]

export default function FilterBar({ filters, onChange }) {
  const { isDark } = useTheme()

  const selectClass = `text-sm px-3 py-2 rounded-xl border outline-none cursor-pointer transition-colors ${
    isDark
      ? 'bg-gray-900 border-gray-700 text-gray-200 focus:border-violet-500'
      : 'bg-white border-gray-200 text-gray-700 focus:border-violet-500'
  }`

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className={`flex items-center gap-1.5 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        <FiFilter size={14} />
        <span>Filters:</span>
      </div>

      {/* Category filter */}
      <select
        className={selectClass}
        value={filters.category}
        onChange={e => onChange({ ...filters, category: e.target.value })}
      >
        <option value="">All Categories</option>
        {CATEGORIES.filter(c => c).map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* Rating filter */}
      <select
        className={selectClass}
        value={filters.minRating}
        onChange={e => onChange({ ...filters, minRating: Number(e.target.value) })}
      >
        {RATINGS.map(r => (
          <option key={r.value} value={r.value}>{r.label}</option>
        ))}
      </select>

      {/* Sort order */}
      <select
        className={selectClass}
        value={filters.orderBy}
        onChange={e => onChange({ ...filters, orderBy: e.target.value })}
      >
        {SORT.map(s => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
    </div>
  )
}
