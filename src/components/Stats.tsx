import './Stats.css'

interface GameState {
  level: number
  exp: number
  gold: number
  successCount: number
  failureCount: number
  totalAttempts: number
}

interface StatsProps {
  gameState: GameState
  successRate: number
}

const Stats = ({ gameState, successRate }: StatsProps) => {
  const successPercentage = gameState.totalAttempts > 0 
    ? Math.round((gameState.successCount / gameState.totalAttempts) * 100)
    : 0

  return (
    <div className="stats-panel">
      <h2>📊 통계</h2>
      <div className="stat-item">
        <span className="stat-label">현재 레벨:</span>
        <span className="stat-value">{gameState.level}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">골드:</span>
        <span className="stat-value">{gameState.gold}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">경험치:</span>
        <span className="stat-value">{gameState.exp}</span>
      </div>
      <hr className="stat-divider" />
      <div className="stat-item">
        <span className="stat-label">성공 확률:</span>
        <span className="stat-value">{(successRate * 100).toFixed(0)}%</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">총 시도:</span>
        <span className="stat-value">{gameState.totalAttempts}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">성공:</span>
        <span className="stat-value success">{gameState.successCount}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">실패:</span>
        <span className="stat-value fail">{gameState.failureCount}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">성공률:</span>
        <span className="stat-value">{successPercentage}%</span>
      </div>
    </div>
  )
}

export default Stats
