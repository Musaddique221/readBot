import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiStar, FiBook, FiCalendar, FiFileText } from 'react-icons/fi'
import { fetchBookById } from '../api/api'
import SummarySection from '../components/SummarySection'
import ChatBox from '../components/ChatBox'
import Navbar from '../components/Navbar'
import { Spinner } from '../components/Loader'
import { useTheme } from '../context/ThemeContext'

export default function BookDetail() {
  const { isDark } = useTheme()
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  // Route state se book lo, nahi toh API se fetch karo (page refresh case)
  const [book, setBook] = useState(location.state?.book || null)
  const [loading, setLoading] = useState(!book)
  const [chatQuestion, setChatQuestion] = useState('')

  useEffect(() => {
    if (!book) {
      fetchBookById(id).then(setBook).finally(() => setLoading(false))
    }
  }, [id, book])

  // Suggestion chip click → ChatBox mein question bhejo
  const handleSuggestionClick = (question) => {
    setChatQuestion(question)
    document.getElementById('chatbox')?.scrollIntoView({ behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <Spinner size="lg" />
      </div>
    )
  }

  if (!book) return null

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 text-sm mb-8 transition-colors ${
            isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <FiArrowLeft size={16} />
          Back to Books
        </button>

        {/* Book Info Card */}
        <div className={`rounded-2xl p-6 sm:p-8 mb-6 ${isDark ? 'bg-gray-900' : 'bg-white shadow-sm'}`}>
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Cover */}
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              {book.image ? (
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-36 h-52 object-cover rounded-xl shadow-xl"
                />
              ) : (
                <div className={`w-36 h-52 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <FiBook className="text-violet-400 text-4xl" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h1 className={`text-2xl sm:text-3xl font-bold mb-2 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {book.title}
              </h1>
              <p className={`text-base mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                by {book.authors?.join(', ') || 'Unknown Author'}
              </p>

              {/* Meta chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                {book.rating && (
                  <span className="flex items-center gap-1 text-sm bg-yellow-500/15 text-yellow-400 px-3 py-1 rounded-full">
                    <FiStar size={12} className="fill-yellow-400" />
                    {book.rating}
                  </span>
                )}
                {book.genre?.map((g, i) => (
                  <span key={i} className="text-sm bg-violet-500/15 text-violet-400 px-3 py-1 rounded-full">
                    {g}
                  </span>
                ))}
                {book.publishedDate && (
                  <span className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                    <FiCalendar size={12} />
                    {book.publishedDate}
                  </span>
                )}
                {book.pageCount && (
                  <span className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                    <FiFileText size={12} />
                    {book.pageCount} pages
                  </span>
                )}
              </div>

              {/* Description */}
              <p className={`text-sm leading-relaxed line-clamp-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {book.description}
              </p>
            </div>
          </div>
        </div>

        {/* AI Summary + Suggestions */}
        <div className="mb-6">
          <SummarySection book={book} onSuggestionClick={handleSuggestionClick} />
        </div>

        {/* Chat Box */}
        <div id="chatbox">
          <ChatBox book={book} initialQuestion={chatQuestion} />
        </div>
      </div>
    </div>
  )
}
