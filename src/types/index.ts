export interface GameState {
  level: number
  exp: number
  gold: number
  successCount: number
  failureCount: number
  totalAttempts: number
  maxLevel: number
  totalGoldEarned: number
}

export interface User {
  id: string
  username: string
  createdAt: number
  lastPlayed: number
}

export interface ScoreboardEntry {
  username: string
  level: number
  maxLevel: number
  exp: number
  successRate: number
  totalAttempts: number
  timestamp: number
}
