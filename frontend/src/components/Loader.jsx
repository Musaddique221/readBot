import { useTheme } from '../context/ThemeContext'

// Skeleton card — book load hone tak placeholder
export function BookCardSkeleton() {
  const { isDark } = useTheme()
  return (
    <div className={`rounded-2xl overflow-hidden animate-pulse ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`h-52 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`} />
      <div className="p-4 space-y-2">
        <div className={`h-4 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`} />
        <div className={`h-3 w-2/3 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`} />
        <div className={`h-5 w-1/3 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`} />
      </div>
    </div>
  )
}

// Spinner — chat ya summary load hone tak
export function Spinner({ size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className={`${sizes[size]} border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin`} />
  )
}

// AI typing indicator
export function TypingIndicator({ isDark }) {
  return (
    <div className={`flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm w-fit ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  )
}
