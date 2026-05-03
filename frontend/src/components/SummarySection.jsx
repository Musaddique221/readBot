import { useEffect, useState } from 'react'
import { FiZap, FiMessageCircle } from 'react-icons/fi'
import { fetchSummary } from '../api/api'
import { Spinner } from './Loader'
import { useTheme } from '../context/ThemeContext'

export default function SummarySection({ book, onSuggestionClick }) {
  const { isDark } = useTheme()
  const [summary, setSummary] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Component mount hone par automatically summary fetch karo
    const load = async () => {
      try {
        setLoading(true)
        const data = await fetchSummary(book.title, book.description)
        setSummary(data.summary)
        setSuggestions(data.suggestions || [])
      } catch {
        setError('getting error while fetching summary. Please retry.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [book.title, book.description])

  return (
    <div className={`rounded-2xl p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
          <FiZap className="text-white text-xs" />
        </div>
        <h2 className={`font-semibold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
          AI Summary
        </h2>
      </div>

      {/* Summary content */}
      {loading ? (
        <div className="flex items-center gap-3 py-4">
          <Spinner size="sm" />
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Generating summary...
          </span>
        </div>
      ) : error ? (
        <p className="text-red-400 text-sm">{error}</p>
      ) : (
        <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {summary}
        </p>
      )}

      {/* Suggested questions — clickable chips */}
      {suggestions.length > 0 && !loading && (
        <div className="mt-5">
          <div className={`flex items-center gap-1.5 mb-3 text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <FiMessageCircle size={12} />
            <span>Ask about this book:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((q, i) => (
              <button
                key={i}
                onClick={() => onSuggestionClick(q)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all hover:scale-105 ${
                  isDark
                    ? 'border-gray-700 text-gray-300 hover:border-violet-500 hover:text-violet-400 hover:bg-violet-500/10'
                    : 'border-gray-200 text-gray-600 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
