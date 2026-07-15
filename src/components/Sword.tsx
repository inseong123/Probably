import './Sword.css'

interface SwordProps {
  level: number
  animationState: 'idle' | 'success' | 'fail'
  isEnhancing: boolean
}

const Sword = ({ level, animationState, isEnhancing }: SwordProps) => {
  const getColor = (level: number): string => {
    if (level < 5) return '#888'
    if (level < 10) return '#4a90e2'
    if (level < 15) return '#7b68ee'
    if (level < 20) return '#ff6b6b'
    if (level < 25) return '#ffd700'
    return '#ff00ff'
  }

  return (
    <div className="sword-container">
      <div 
        className={`sword ${animationState} ${isEnhancing ? 'enhancing' : ''}`}
        style={{
          '--sword-color': getColor(level),
          '--glow': animationState === 'success' ? '0 0 30px ' + getColor(level) : 'none'
        } as React.CSSProperties}
      >
        ⚔️
      </div>
      <div className="level-badge">
        <span>강화 {level}</span>
      </div>
      {animationState === 'success' && (
        <div className="success-effect">✨</div>
      )}
      {animationState === 'fail' && (
        <div className="fail-effect">💥</div>
      )}
    </div>
  )
}

export default Sword
