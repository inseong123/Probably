import { GameState } from '../types'

export const getEnhancementCost = (level: number): number => {
  if (level < 5) return 100
  if (level < 10) return 200
  if (level < 15) return 500
  if (level < 20) return 1000
  if (level < 25) return 2500
  if (level < 30) return 5000
  return 10000 + (level - 30) * 1000
}

export const getEnhancementSuccessRate = (level: number): number => {
  if (level < 5) return 1.0
  if (level < 10) return 0.9
  if (level < 15) return 0.7
  if (level < 20) return 0.5
  if (level < 25) return 0.3
  if (level < 30) return 0.15
  return Math.max(0.01, 0.1 - (level - 30) * 0.01)
}

export const getDestructionRate = (level: number): number => {
  if (level < 10) return 0
  if (level < 15) return 0.05
  if (level < 20) return 0.1
  if (level < 25) return 0.15
  if (level < 30) return 0.2
  return 0.25
}

export const calculateDamage = (
  baseDamage: number,
  bonusDamage: number,
  level: number,
  isWeakness: boolean = false
): { min: number; max: number } => {
  const base = baseDamage + bonusDamage * (level - 1) * 0.5
  const variance = base * 0.3
  let min = Math.floor(base - variance)
  let max = Math.floor(base + variance)

  if (isWeakness) {
    min = Math.floor(min * 1.5)
    max = Math.floor(max * 1.5)
  }

  return { min, max }
}

export const getRandomDamage = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
