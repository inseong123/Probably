import { GameState } from '../types'

export const initializeGameState = (userId: string): GameState => {
  return {
    level: 1,
    exp: 0,
    gold: 1000,
    successCount: 0,
    failureCount: 0,
    totalAttempts: 0,
    maxLevel: 1,
    totalGoldEarned: 0,
    swordId: 'normal',
    mana: 100,
    maxMana: 100,
    health: 100,
    maxHealth: 100,
    potions: {
      heal: 5,
      strength: 3,
      mana: 3,
    },
  }
}
