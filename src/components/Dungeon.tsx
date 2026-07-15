import { useState, useEffect } from 'react'
import { Sword, DungeonMonster, BattleState } from '../types'
import { SWORDS, DUNGEONS, getBattleActions } from '../data/swords'
import { calculateDamage, getRandomDamage } from '../utils/gameCalculations'
import { soundManager } from '../utils/soundManager'
import './Dungeon.css'

interface DungeonProps {
  sword: Sword
  playerHealth: number
  playerMana: number
  maxHealth: number
  maxMana: number
  potions: { heal: number; strength: number; mana: number }
  onBattleEnd: (gold: number, exp: number) => void
  onClose: () => void
}

const Dungeon = ({
  sword,
  playerHealth,
  playerMana,
  maxHealth,
  maxMana,
  potions,
  onBattleEnd,
  onClose,
}: DungeonProps) => {
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard' | 'very_hard' | 'extreme' | null>(null)
  const [currentMonster, setCurrentMonster] = useState<DungeonMonster | null>(null)
  const [battleState, setBattleState] = useState<BattleState | null>(null)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const startBattle = (diff: typeof difficulty) => {
    if (!diff) return
    const monsters = DUNGEONS[diff]
    const randomMonster = monsters[Math.floor(Math.random() * monsters.length)]

    setCurrentMonster({ ...randomMonster, health: randomMonster.maxHealth })
    setBattleState({
      playerHealth,
      playerMana,
      monsterHealth: randomMonster.maxHealth,
      turn: 0,
      log: [`${randomMonster.name}이(가) 나타났다!`],
      isPlayerTurn: true,
      isBattleEnd: false,
      battleResult: null,
      rewards: { gold: 0, exp: 0 },
    })
    setDifficulty(diff)
  }

  const executeAction = (action: string) => {
    if (!battleState || !currentMonster || isAnimating) return

    setIsAnimating(true)
    const actions = getBattleActions(sword.type)
    const actionData = actions[action]

    if (!actionData) return

    soundManager.playClick()
    const newLog = [...battleState.log]

    // 플레이어 턴
    if (battleState.isPlayerTurn) {
      // 마나 체크
      if (battleState.playerMana < actionData.manaCost) {
        newLog.push('❌ 마나가 부족합니다!')
        setTimeout(() => setIsAnimating(false), 500)
        return
      }

      // 도망 시도
      if (action === 'escape') {
        if (Math.random() < actionData.accuracy / 100) {
          soundManager.playSuccess()
          newLog.push('✅ 성공적으로 도망쳤습니다!')
          setBattleState({ ...battleState, log: newLog, isBattleEnd: true, battleResult: 'escape' })
          setTimeout(() => {
            onBattleEnd(0, 0)
            setIsAnimating(false)
          }, 1000)
          return
        } else {
          newLog.push('❌ 도망 실패!')
        }
      }

      // 방어
      if (action === 'defend') {
        newLog.push(`🛡️ ${sword.name}으로 방어 자세를 취했다!`)
        soundManager.playClick()
      } else if (action !== 'escape') {
        // 공격
        const isWeakness = currentMonster.weaknesses.includes(sword.type)
        const { min, max } = calculateDamage(actionData.damage.min, sword.bonusDamage, sword.level, isWeakness)
        const damage = getRandomDamage(min, max)

        if (Math.random() < actionData.accuracy / 100) {
          let finalDamage = damage
          if (isWeakness) {
            newLog.push(`💥 약점 공략! ${actionData.name} - ${finalDamage} 대미지!`)
            soundManager.playSuccess()
          } else {
            newLog.push(`⚔️ ${actionData.name} - ${finalDamage} 대미지!`)
            soundManager.playClick()
          }

          const newMonsterHealth = Math.max(0, currentMonster.health - finalDamage)
          setCurrentMonster({ ...currentMonster, health: newMonsterHealth })

          if (newMonsterHealth <= 0) {
            const goldReward = getRandomDamage(currentMonster.goldReward.min, currentMonster.goldReward.max)
            const expReward = Math.floor(goldReward / 10)
            newLog.push(`🎉 승리! ${goldReward} 골드와 ${expReward} 경험치를 획득했습니다!`)
            soundManager.playLevelUp()
            setBattleState({
              ...battleState,
              playerMana: battleState.playerMana - actionData.manaCost,
              monsterHealth: newMonsterHealth,
              log: newLog,
              isBattleEnd: true,
              battleResult: 'win',
              rewards: { gold: goldReward, exp: expReward },
            })
            setTimeout(() => {
              onBattleEnd(goldReward, expReward)
              setIsAnimating(false)
            }, 1500)
            return
          }
        } else {
          newLog.push(`❌ ${actionData.name} 실패!`)
          soundManager.playFail()
        }
      }

      // 마나 소비
      const newPlayerMana = Math.max(0, battleState.playerMana - actionData.manaCost)
      setBattleState(prev => ({ ...prev, playerMana: newPlayerMana, log: newLog, isPlayerTurn: false }))
    }

    // 몬스터 턴
    setTimeout(() => {
      const monsterDamage = getRandomDamage(10, 30)
      let playerDamageTaken = monsterDamage

      // 방어 상태 확인
      if (selectedAction === 'defend') {
        playerDamageTaken = Math.floor(monsterDamage * 0.5)
        newLog.push(`🛡️ 방어로 인해 ${monsterDamage - playerDamageTaken} 대미지 감소!`)
      }

      newLog.push(`${currentMonster.name}의 공격! ${playerDamageTaken} 대미지!`)
      soundManager.playFail()

      const newPlayerHealth = Math.max(0, battleState.playerHealth - playerDamageTaken)

      if (newPlayerHealth <= 0) {
        newLog.push(`💀 패배했습니다!`)
        setBattleState(prev => ({
          ...prev,
          playerHealth: newPlayerHealth,
          log: newLog,
          isBattleEnd: true,
          battleResult: 'loss',
        }))
        setTimeout(() => {
          onBattleEnd(0, 0)
          setIsAnimating(false)
        }, 1000)
      } else {
        setBattleState(prev => ({
          ...prev,
          playerHealth: newPlayerHealth,
          log: newLog,
          isPlayerTurn: true,
        }))
        setTimeout(() => setIsAnimating(false), 300)
      }
    }, 800)
  }

  if (!difficulty) {
    return (
      <div className="dungeon-container">
        <div className="dungeon-modal">
          <h2>🗡️ 던전 선택</h2>
          <div className="difficulty-list">
            <button className="difficulty-btn easy" onClick={() => startBattle('easy')}>
              <div className="difficulty-name">쉬움</div>
              <div className="difficulty-info">골드: 30~100 | 몬스터: 약함</div>
            </button>
            <button className="difficulty-btn normal" onClick={() => startBattle('normal')}>
              <div className="difficulty-name">보통</div>
              <div className="difficulty-info">골드: 100~300 | 몬스터: 중간</div>
            </button>
            <button className="difficulty-btn hard" onClick={() => startBattle('hard')}>
              <div className="difficulty-name">어려움</div>
              <div className="difficulty-info">골드: 300~800 | 몬스터: 강함</div>
            </button>
            <button className="difficulty-btn very_hard" onClick={() => startBattle('very_hard')}>
              <div className="difficulty-name">매우 어려움</div>
              <div className="difficulty-info">골드: 800~2000 | 몬스터: 매우 강함</div>
            </button>
            <button className="difficulty-btn extreme" onClick={() => startBattle('extreme')}>
              <div className="difficulty-name">극악</div>
              <div className="difficulty-info">골드: 2000~5000 | 몬스터: 최강</div>
            </button>
          </div>
          <button className="close-btn" onClick={onClose}>닫기</button>
        </div>
      </div>
    )
  }

  if (!battleState || !currentMonster) return null

  const actions = getBattleActions(sword.type)

  return (
    <div className="dungeon-container">
      <div className="battle-modal">
        <div className="battle-header">
          <div className="player-info">
            <h3>{sword.name}</h3>
            <div className="health-bar">
              <div className="health-fill" style={{ width: `${(battleState.playerHealth / maxHealth) * 100}%` }}></div>
            </div>
            <div className="stats">체력: {battleState.playerHealth}/{maxHealth}</div>
            <div className="stats">마나: {battleState.playerMana}/{maxMana}</div>
          </div>
          <div className="monster-info">
            <h3>{currentMonster.name} {currentMonster.icon}</h3>
            <div className="monster-level">난이도: {currentMonster.difficulty}</div>
            <div className="health-bar">
              <div className="health-fill" style={{ width: `${(currentMonster.health / currentMonster.maxHealth) * 100}%` }}></div>
            </div>
            <div className="stats">체력: {currentMonster.health}/{currentMonster.maxHealth}</div>
          </div>
        </div>

        <div className="battle-log">
          {battleState.log.map((msg, idx) => (
            <div key={idx} className="log-entry">
              {msg}
            </div>
          ))}
        </div>

        {!battleState.isBattleEnd && battleState.isPlayerTurn && (
          <div className="action-menu">
            <div className="actions-grid">
              {Object.entries(actions).map(([key, action]: any) => (
                <button
                  key={key}
                  className="action-btn"
                  onClick={() => {
                    setSelectedAction(key)
                    executeAction(key)
                  }}
                  disabled={isAnimating || battleState.playerMana < action.manaCost}
                >
                  <div className="action-name">{action.name}</div>
                  {action.manaCost > 0 && (
                    <div className="action-cost">마나: {action.manaCost}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {battleState.isBattleEnd && (
          <div className="battle-result">
            <h3>
              {battleState.battleResult === 'win' && '🎉 승리!'}
              {battleState.battleResult === 'loss' && '💀 패배!'}
              {battleState.battleResult === 'escape' && '🏃 도망 성공!'}
            </h3>
            {battleState.battleResult === 'win' && (
              <div className="rewards">
                <p>💰 {battleState.rewards.gold} 골드</p>
                <p>⭐ {battleState.rewards.exp} 경험치</p>
              </div>
            )}
            <button className="return-btn" onClick={onClose}>돌아가기</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dungeon
