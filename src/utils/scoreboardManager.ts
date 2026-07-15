import { GameState, ScoreboardEntry } from '../types'

const SCOREBOARD_KEY = 'sword_game_scoreboard'
const MAX_ENTRIES = 100

export const scoreboardManager = {
  // 스코어 추가/업데이트
  addScore(username: string, gameState: GameState) {
    const scoreboard = this.getScoreboard()
    
    const successRate = gameState.totalAttempts > 0
      ? (gameState.successCount / gameState.totalAttempts)
      : 0

    const entry: ScoreboardEntry = {
      username,
      level: gameState.level,
      maxLevel: gameState.maxLevel,
      exp: gameState.exp,
      successRate,
      totalAttempts: gameState.totalAttempts,
      timestamp: Date.now(),
    }

    // 중복된 사용자가 있으면 제거
    const filtered = scoreboard.filter(s => s.username !== username)
    filtered.push(entry)

    // 레벨순 정렬 후 상위 MAX_ENTRIES만 유지
    const sorted = filtered
      .sort((a, b) => {
        if (b.maxLevel !== a.maxLevel) return b.maxLevel - a.maxLevel
        if (b.exp !== a.exp) return b.exp - a.exp
        if (b.successRate !== a.successRate) return b.successRate - a.successRate
        return b.timestamp - a.timestamp
      })
      .slice(0, MAX_ENTRIES)

    localStorage.setItem(SCOREBOARD_KEY, JSON.stringify(sorted))
  },

  // 스코어보드 조회
  getScoreboard(): ScoreboardEntry[] {
    const data = localStorage.getItem(SCOREBOARD_KEY)
    return data ? JSON.parse(data) : []
  },

  // 사용자의 순위 조회
  getUserRank(username: string): number {
    const scoreboard = this.getScoreboard()
    const rank = scoreboard.findIndex(s => s.username === username)
    return rank >= 0 ? rank + 1 : 0
  },

  // 사용자의 최고 기록 조회
  getUserBestScore(username: string): ScoreboardEntry | null {
    const scoreboard = this.getScoreboard()
    return scoreboard.find(s => s.username === username) || null
  },
}
