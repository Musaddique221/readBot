import { FiStar, FiBook } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

export default function BookCard({ book }) {
  const { isDark } = useTheme()
  const navigate = useNavigate()

  const handleClick = () => {
    // Book data route state mein pass karo taaki detail page pe re-fetch na karna pade
    navigate(`/book/${book.id}`, { state: { book } })
  }

  return (
    <div
      onClick={handleClick}
      className={`group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl ${
        isDark ? 'bg-gray-900 shadow-gray-900/50' : 'bg-white shadow-gray-200'
      } shadow-lg`}
    >
      {/* Cover Image */}
      <div className="relative h-52 overflow-hidden">
        {book.image ? (
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <FiBook className="text-violet-400 text-5xl" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Rating badge */}
        {book.rating && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
            <FiStar className="text-yellow-400 text-xs fill-yellow-400" />
            <span className="text-white text-xs font-semibold">{book.rating}</span>
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="p-4">
        <h3 className={`font-semibold text-sm leading-snug mb-1 line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {book.title}
        </h3>
        <p className={`text-xs mb-3 truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {book.authors?.[0] || 'Unknown Author'}
        </p>
        {book.genre?.[0] && (
          <span className="inline-block text-xs bg-violet-500/20 text-violet-400 px-2.5 py-1 rounded-full font-medium">
            {book.genre[0].length > 20 ? book.genre[0].substring(0, 20) + '...' : book.genre[0]}
          </span>
        )}
      </div>
    </div>
  )
}
