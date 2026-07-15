import { ScoreboardEntry } from '../types'
import { scoreboardManager } from '../utils/scoreboardManager'
import './Scoreboard.css'

interface ScoreboardProps {
  isOpen: boolean
  onClose: () => void
  currentUsername: string
}

const Scoreboard = ({ isOpen, onClose, currentUsername }: ScoreboardProps) => {
  const scoreboard = scoreboardManager.getScoreboard()
  const userRank = scoreboardManager.getUserRank(currentUsername)
  const userBestScore = scoreboardManager.getUserBestScore(currentUsername)

  if (!isOpen) return null

  return (
    <div className="scoreboard-overlay" onClick={onClose}>
      <div className="scoreboard-modal" onClick={(e) => e.stopPropagation()}>
        <div className="scoreboard-header">
          <h2>🏆 스코어보드</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {userBestScore && (
          <div className="user-info">
            <div className="user-rank">당신의 순위: #{userRank}</div>
            <div className="user-stats">
              <span>최고 레벨: <strong>{userBestScore.maxLevel}</strong></span>
              <span>성공률: <strong>{(userBestScore.successRate * 100).toFixed(1)}%</strong></span>
            </div>
          </div>
        )}

        <div className="scoreboard-table">
          <div className="scoreboard-header-row">
            <div className="rank">순위</div>
            <div className="name">닉네임</div>
            <div className="level">레벨</div>
            <div className="exp">경험치</div>
            <div className="rate">성공률</div>
          </div>
          {scoreboard.length === 0 ? (
            <div className="empty-message">아직 기록이 없습니다!</div>
          ) : (
            scoreboard.map((entry, index) => (
              <div 
                key={index} 
                className={`scoreboard-row ${currentUsername === entry.username ? 'highlight' : ''}`}
              >
                <div className="rank">{index + 1}</div>
                <div className="name">
                  {currentUsername === entry.username ? '👤 ' : ''}{entry.username}
                </div>
                <div className="level">{entry.maxLevel}</div>
                <div className="exp">{entry.exp}</div>
                <div className="rate">{(entry.successRate * 100).toFixed(1)}%</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Scoreboard
