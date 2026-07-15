import { useState, useEffect } from 'react'
import { User, GameState } from '../types'
import { scoreboardManager } from '../utils/scoreboardManager'
import { soundManager } from '../utils/soundManager'
import { auth } from '../utils/auth'
import './Game.css'
import Sword from './Sword'
import Stats from './Stats'
import Shop from './Shop'
import Scoreboard from './Scoreboard'

const Game = () => {
  const [user] = useState<User>(() => {
    const currentUser = auth.getCurrentUser()
    return currentUser!;
  })

  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(`swordGameState_${user.id}`)
    return saved ? JSON.parse(saved) : {
      level: 1,
      exp: 0,
      gold: 1000,
      successCount: 0,
      failureCount: 0,
      totalAttempts: 0,
      maxLevel: 1,
      totalGoldEarned: 0,
    }
  })

  const [isEnhancing, setIsEnhancing] = useState(false)
  const [animationState, setAnimationState] = useState<'idle' | 'success' | 'fail'>('idle')
  const [isScoreboardOpen, setIsScoreboardOpen] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // 로컬스토리지에 저장
  useEffect(() => {
    localStorage.setItem(`swordGameState_${user.id}`, JSON.stringify(gameState))
    scoreboardManager.addScore(user.username, gameState)
  }, [gameState, user])

  // 강화 확률 계산
  const getSuccessProbability = (level: number): number => {
    if (level < 5) return 1.0
    if (level < 10) return 0.9
    if (level < 15) return 0.7
    if (level < 20) return 0.5
    if (level < 25) return 0.3
    if (level < 30) return 0.15
    return Math.max(0.01, 0.1 - (level - 30) * 0.01)
  }

  const handleEnhance = () => {
    if (isEnhancing) return
    if (gameState.gold < 100) {
      alert('골드가 부족합니다! (필요: 100, 보유: ' + gameState.gold + ')')
      return
    }

    soundEnabled && soundManager.playClick()
    setIsEnhancing(true)
    const successChance = getSuccessProbability(gameState.level)
    const isSuccess = Math.random() < successChance

    setTimeout(() => {
      setAnimationState(isSuccess ? 'success' : 'fail')
      
      if (soundEnabled) {
        if (isSuccess) {
          soundManager.playSuccess()
          soundManager.playLevelUp()
        } else {
          soundManager.playFail()
        }
      }

      setGameState(prev => {
        const newLevel = isSuccess ? prev.level + 1 : prev.level
        return {
          ...prev,
          level: newLevel,
          maxLevel: Math.max(prev.maxLevel, newLevel),
          exp: isSuccess ? prev.exp + 10 : prev.exp + 1,
          gold: prev.gold - 100,
          successCount: isSuccess ? prev.successCount + 1 : prev.successCount,
          failureCount: isSuccess ? prev.failureCount : prev.failureCount + 1,
          totalAttempts: prev.totalAttempts + 1,
        }
      })

      setTimeout(() => {
        setIsEnhancing(false)
        setAnimationState('idle')
      }, 500)
    }, 800)
  }

  const handleAddGold = (amount: number) => {
    soundEnabled && soundManager.playGoldSound()
    setGameState(prev => ({
      ...prev,
      gold: prev.gold + amount,
      totalGoldEarned: prev.totalGoldEarned + amount,
    }))
  }

  const handleReset = () => {
    if (confirm('정말 처음부터 다시 시작하시겠습니까? (스코어보드 기록은 유지됩니다)')) {
      soundEnabled && soundManager.playClick()
      setGameState({
        level: 1,
        exp: 0,
        gold: 1000,
        successCount: 0,
        failureCount: 0,
        totalAttempts: 0,
        maxLevel: gameState.maxLevel,
        totalGoldEarned: gameState.totalGoldEarned,
      })
    }
  }

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      soundEnabled && soundManager.playClick()
      auth.logout()
      window.location.reload()
    }
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>⚔️ 검 강화 게임</h1>
        <div className="header-controls">
          <div className="user-info">
            <span className="username">👤 {user.username}</span>
          </div>
          <button 
            className={`sound-toggle ${soundEnabled ? 'on' : 'off'}`}
            onClick={() => {
              setSoundEnabled(!soundEnabled)
              soundEnabled && soundManager.playClick()
            }}
            title={soundEnabled ? '음소거' : '음성 켜기'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button className="scoreboard-btn" onClick={() => setIsScoreboardOpen(true)}>
            🏆 스코어보드
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>
      
      <div className="game-content">
        <div className="main-section">
          <Sword 
            level={gameState.level} 
            animationState={animationState}
            isEnhancing={isEnhancing}
          />
          
          <button 
            className="enhance-btn" 
            onClick={handleEnhance}
            disabled={isEnhancing}
          >
            {isEnhancing ? '강화 중...' : '강화하기 (100 골드)'}
          </button>
        </div>

        <div className="sidebar">
          <Stats gameState={gameState} successRate={getSuccessProbability(gameState.level)} />
          <Shop onAddGold={handleAddGold} />
          <button className="reset-btn" onClick={handleReset}>
            🔄 처음부터 시작
          </button>
        </div>
      </div>

      <Scoreboard 
        isOpen={isScoreboardOpen}
        onClose={() => setIsScoreboardOpen(false)}
        currentUsername={user.username}
      />
    </div>
  )
}

export default Game
