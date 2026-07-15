export interface GameState {
  level: number
  exp: number
  gold: number
  successCount: number
  failureCount: number
  totalAttempts: number
  maxLevel: number
  totalGoldEarned: number
  swordId: string
  mana: number
  maxMana: number
  health: number
  maxHealth: number
  potions: {
    heal: number
    strength: number
    mana: number
  }
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

export interface Sword {
  id: string
  name: string
  type: 'normal' | 'fire' | 'lightning' | 'ice' | 'dark' | 'light'
  baseDamage: number
  level: number
  requiredLevel: number
  bonusDamage: number
  icon: string
  color: string
  description: string
}

export interface DungeonMonster {
  id: string
  name: string
  health: number
  maxHealth: number
  difficulty: 'easy' | 'normal' | 'hard' | 'very_hard' | 'extreme'
  goldReward: { min: number; max: number }
  type: 'slime' | 'goblin' | 'dragon' | 'skeleton' | 'wolf' | 'phoenix'
  icon: string
  weaknesses: string[]
}

export interface BattleAction {
  id: string
  name: string
  category: 'attack' | 'magic' | 'defend' | 'item' | 'escape'
  damage: { min: number; max: number }
  manaCost: number
  accuracy: number
  description: string
  requiresSwordType?: string
}

export interface BattleState {
  playerHealth: number
  playerMana: number
  monsterHealth: number
  turn: number
  log: string[]
  isPlayerTurn: boolean
  isBattleEnd: boolean
  battleResult: 'win' | 'loss' | 'escape' | null
  rewards: { gold: number; exp: number }
}
