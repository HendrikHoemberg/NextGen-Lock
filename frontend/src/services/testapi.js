/**
 * Test API for Development
 * Returns dummy data instead of making real API calls
 * Useful for frontend development without a backend server
 */

import { dummyCards, dummyLogs, dummyUsers } from './dummyData'

// Simple response wrapper to match axios response format
const createResponse = (data) => ({
  data,
  status: 200,
  statusText: 'OK',
})

// Simulate API delay (ms)
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// Users API
export const usersAPI = {
  getAll: async () => {
    await delay()
    return createResponse(dummyUsers)
  },

  getById: async (id) => {
    await delay()
    const user = dummyUsers.find(u => u.user_id === id)
    if (!user) {
      throw new Error(`User with ID ${id} not found`)
    }
    return createResponse(user)
  },

  create: async (userData) => {
    await delay()
    const newUser = {
      user_id: String(Math.max(...dummyUsers.map(u => parseInt(u.user_id)), 0) + 1),
      ...userData,
      created_at: new Date().toISOString(),
    }
    dummyUsers.push(newUser)
    console.log('✓ User created:', newUser)
    return createResponse(newUser)
  },

  update: async (id, userData) => {
    await delay()
    const userIndex = dummyUsers.findIndex(u => u.user_id === id)
    if (userIndex === -1) {
      throw new Error(`User with ID ${id} not found`)
    }
    const updatedUser = { ...dummyUsers[userIndex], ...userData }
    dummyUsers[userIndex] = updatedUser
    console.log('✓ User updated:', updatedUser)
    return createResponse(updatedUser)
  },

  delete: async (id) => {
    await delay()
    const userIndex = dummyUsers.findIndex(u => u.user_id === id)
    if (userIndex === -1) {
      throw new Error(`User with ID ${id} not found`)
    }
    const deletedUser = dummyUsers.splice(userIndex, 1)[0]
    console.log('✓ User deleted:', deletedUser)
    return createResponse({ message: 'User deleted', id })
  },
}

// RFID Cards API
export const cardsAPI = {
  getAll: async () => {
    await delay()
    return createResponse(dummyCards)
  },

  getById: async (id) => {
    await delay()
    const card = dummyCards.find(c => c.card_id === id)
    if (!card) {
      throw new Error(`Card with ID ${id} not found`)
    }
    return createResponse(card)
  },

  getByUserId: async (userId) => {
    await delay()
    const userCards = dummyCards.filter(c => c.user_id === userId)
    return createResponse(userCards)
  },

  create: async (cardData) => {
    await delay()
    const newCard = {
      card_id: String(Math.max(...dummyCards.map(c => parseInt(c.card_id)), 0) + 1),
      ...cardData,
      added_on: new Date().toISOString(),
    }
    dummyCards.push(newCard)
    console.log('✓ Card created:', newCard)
    return createResponse(newCard)
  },

  update: async (id, cardData) => {
    await delay()
    const cardIndex = dummyCards.findIndex(c => c.card_id === id)
    if (cardIndex === -1) {
      throw new Error(`Card with ID ${id} not found`)
    }
    const updatedCard = { ...dummyCards[cardIndex], ...cardData }
    dummyCards[cardIndex] = updatedCard
    console.log('✓ Card updated:', updatedCard)
    return createResponse(updatedCard)
  },

  delete: async (id) => {
    await delay()
    const cardIndex = dummyCards.findIndex(c => c.card_id === id)
    if (cardIndex === -1) {
      throw new Error(`Card with ID ${id} not found`)
    }
    const deletedCard = dummyCards.splice(cardIndex, 1)[0]
    console.log('✓ Card deleted:', deletedCard)
    return createResponse({ message: 'Card deleted', id })
  },

  authorize: async (id) => {
    await delay()
    const cardIndex = dummyCards.findIndex(c => c.card_id === id)
    if (cardIndex === -1) {
      throw new Error(`Card with ID ${id} not found`)
    }
    dummyCards[cardIndex].authorized = true
    console.log('✓ Card authorized:', dummyCards[cardIndex])
    return createResponse(dummyCards[cardIndex])
  },

  revoke: async (id) => {
    await delay()
    const cardIndex = dummyCards.findIndex(c => c.card_id === id)
    if (cardIndex === -1) {
      throw new Error(`Card with ID ${id} not found`)
    }
    dummyCards[cardIndex].authorized = false
    console.log('✓ Card revoked:', dummyCards[cardIndex])
    return createResponse(dummyCards[cardIndex])
  },
}

// Access Logs API
export const logsAPI = {
  getAll: async (params) => {
    await delay()
    let logs = [...dummyLogs]
    
    // Support filtering by params if needed
    if (params?.limit) {
      logs = logs.slice(0, parseInt(params.limit))
    }
    
    return createResponse(logs)
  },

  getById: async (id) => {
    await delay()
    const log = dummyLogs.find(l => l.log_id === id)
    if (!log) {
      throw new Error(`Log with ID ${id} not found`)
    }
    return createResponse(log)
  },

  getRecent: async (limit = 10) => {
    await delay()
    const recentLogs = dummyLogs.slice(-limit)
    return createResponse(recentLogs)
  },

  getStats: async () => {
    await delay()
    const totalLogs = dummyLogs.length
    const grantedLogs = dummyLogs.filter(l => l.access_granted).length
    const deniedLogs = totalLogs - grantedLogs
    
    return createResponse({
      total: totalLogs,
      granted: grantedLogs,
      denied: deniedLogs,
      grantPercentage: ((grantedLogs / totalLogs) * 100).toFixed(2),
    })
  },
}

export default {
  usersAPI,
  cardsAPI,
  logsAPI,
}
