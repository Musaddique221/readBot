import { useState, useRef, useEffect } from 'react'
import { FiSend, FiMessageCircle } from 'react-icons/fi'
import { sendChatMessage } from '../api/api'
import { TypingIndicator } from './Loader'
import { useTheme } from '../context/ThemeContext'

export default function ChatBox({ book, initialQuestion = '' }) {
  const { isDark } = useTheme()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (initialQuestion) {
      setInput(initialQuestion)
    }
  }, [initialQuestion])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text) => {
    const question = text || input
    if (!question.trim() || loading) return

    setMessages(prev => [...prev, { role: 'user', content: question }])
    setInput('')
    setLoading(true)

    try {
      const data = await sendChatMessage(book.title, question)
      setMessages(prev => [...prev, { role: 'ai', content: data.answer, followUps: data.follow_ups || [] }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: 'error from ai', followUps: [] }])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage()
  }

  return (
    <div className={`rounded-2xl overflow-hidden flex flex-col ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`px-5 py-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <h2 className={`font-semibold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Chat about this book
        </h2>
        <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Ask anything — in any language
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-64 max-h-96">
        {messages.length === 0 && (
          <div className={`text-center text-sm py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Ask anything about this book
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed rounded-2xl ${
              msg.role === 'user'
                ? 'bg-violet-600 text-white rounded-br-sm'
                : isDark
                  ? 'bg-gray-800 text-gray-200 rounded-tl-sm'
                  : 'bg-white text-gray-700 rounded-tl-sm shadow-sm'
            }`}>
              {msg.content}
            </div>

            {/* Follow-up question chips — sirf AI messages ke neeche */}
            {msg.role === 'ai' && msg.followUps?.length > 0 && (
              <div className="mt-2 max-w-[90%]">
                <div className={`flex items-center gap-1 mb-1.5 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  <FiMessageCircle size={11} />
                  <span>Ask more:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {msg.followUps.map((q, j) => (
                    <button
                      key={j}
                      onClick={() => sendMessage(q)}
                      disabled={loading}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
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
        ))}

        {loading && (
          <div className="flex justify-start">
            <TypingIndicator isDark={isDark} />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className={`px-4 py-3 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Write your question..."
            className={`flex-1 bg-transparent outline-none text-sm ${
              isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
            }`}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-8 h-8 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
          >
            <FiSend className="text-white text-xs" />
          </button>
        </div>
      </form>
    </div>
  )
}
