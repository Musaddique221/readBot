import { useState, useEffect, useCallback } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { fetchBooks } from '../api/api'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'
import BookCard from '../components/BookCard'
import { BookCardSkeleton, Spinner } from '../components/Loader'
import Navbar from '../components/Navbar'
import { useTheme } from '../context/ThemeContext'

export default function Home() {
  const { isDark } = useTheme()
  const [books, setBooks] = useState([])
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({ category: '', minRating: 0, orderBy: 'relevance' })
  const [startIndex, setStartIndex] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')

  // Pehli baar ya filter/search change hone par fresh load
  const loadInitial = useCallback(async () => {
    setInitialLoading(true)
    setError('')
    try {
      const data = await fetchBooks({ query, startIndex: 0, ...filters })
      setBooks(data.books)
      setStartIndex(20)
      setHasMore(data.books.length === 20)
    } catch {
      setError('Something wnet wrong while fetching books.')
    } finally {
      setInitialLoading(false)
    }
  }, [query, filters])

  useEffect(() => {
    loadInitial()
  }, [loadInitial])

  // Infinite scroll — aur books fetch karo
  const loadMore = async () => {
    try {
      const data = await fetchBooks({ query, startIndex, ...filters })
      setBooks(prev => [...prev, ...data.books])
      setStartIndex(prev => prev + 20)
      setHasMore(data.books.length === 20)
    } catch {
      setHasMore(false)
    }
  }

  const handleSearch = (val) => {
    setQuery(val)
    setStartIndex(0)
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setStartIndex(0)
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="text-center mb-8">
          <h1 className={`text-4xl sm:text-5xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Discover Your Next{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
              Great Readp
            </span>
          </h1>
          <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Search millions of books and get AI-powered summaries instantly
          </p>
        </div>

        <SearchBar onSearch={handleSearch} initialValue={query} />
      </div>

      {/* Filters + Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <FilterBar filters={filters} onChange={handleFilterChange} />
          {!initialLoading && (
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {books.length} books loaded
            </p>
          )}
        </div>

        {error && (
          <div className="text-center py-16 text-red-400">{error}</div>
        )}

        {/* Initial Loading Skeletons */}
        {initialLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, i) => <BookCardSkeleton key={i} />)}
          </div>
        ) : (
          <InfiniteScroll
            dataLength={books.length}
            next={loadMore}
            hasMore={hasMore}
            loader={
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            }
            endMessage={
              <p className={`text-center text-sm py-8 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                {books.length == 0 ? "No Books Found" : "You've Seen All Books"} 
              </p>
            }
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {books.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </div>
  )
}
