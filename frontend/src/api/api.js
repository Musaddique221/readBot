import axios from 'axios'

// const BASE_URL = 'http://localhost:8000'
const BASE_URL = 'https://readbot-a1le.onrender.com'

export const fetchBooks = async ({ query = '', startIndex = 0, category = '', orderBy = 'relevance', minRating = 0 }) => {
  const params = {
    q: query || 'bestsellers',
    startIndex,
    maxResults: 20,
    orderBy,
  }
  if (category) params.category = category
  if (minRating) params.minRating = minRating

  const res = await axios.get(`${BASE_URL}/books`, { params })
  return res.data
}

export const fetchBookById = async (id) => {
  const res = await axios.get(`${BASE_URL}/books/${id}`)
  return res.data
}

export const fetchSummary = async (title, description) => {
  const res = await axios.post(`${BASE_URL}/summary`, { title, description })
  return res.data
}

export const sendChatMessage = async (title, question) => {
  const res = await axios.post(`${BASE_URL}/chat`, { title, question })
  return res.data
}
