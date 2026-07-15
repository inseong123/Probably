import { useState } from 'react'
import { User } from '../types'
import { auth } from '../utils/auth'
import { soundManager } from '../utils/soundManager'
import './Auth.css'

interface AuthProps {
  onLogin: (user: User) => void
}

const Auth = ({ onLogin }: AuthProps) => {
  const [mode, setMode] = useState<'select' | 'login' | 'signup'>('select')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    setError('')
    setLoading(true)
    soundManager.playClick()

    try {
      const user = auth.signup(username)
      onLogin(user)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    setError('')
    setLoading(true)
    soundManager.playClick()

    try {
      const user = auth.login(username)
      onLogin(user)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>⚔️ 검 강화 게임</h1>

        {mode === 'select' && (
          <div className="auth-select">
            <p>계정으로 시작하세요!</p>
            <button className="auth-btn primary" onClick={() => setMode('login')}>
              🔓 로그인
            </button>
            <button className="auth-btn secondary" onClick={() => setMode('signup')}>
              ✨ 회원가입
            </button>
          </div>
        )}

        {mode === 'login' && (
          <div className="auth-form">
            <h2>로그인</h2>
            <input
              type="text"
              placeholder="닉네임 입력"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError('')
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              disabled={loading}
            />
            {error && <div className="error-message">{error}</div>}
            <button className="auth-btn primary" onClick={handleLogin} disabled={loading || !username}>
              {loading ? '로그인 중...' : '로그인'}
            </button>
            <button className="auth-btn tertiary" onClick={() => {
              setMode('select')
              setUsername('')
              setError('')
            }}>
              ← 돌아가기
            </button>
          </div>
        )}

        {mode === 'signup' && (
          <div className="auth-form">
            <h2>회원가입</h2>
            <input
              type="text"
              placeholder="사용할 닉네임 (2~20자)"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError('')
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSignup()}
              disabled={loading}
              maxLength={20}
            />
            {error && <div className="error-message">{error}</div>}
            <button className="auth-btn primary" onClick={handleSignup} disabled={loading || !username}>
              {loading ? '가입 중...' : '회원가입'}
            </button>
            <button className="auth-btn tertiary" onClick={() => {
              setMode('select')
              setUsername('')
              setError('')
            }}>
              ← 돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Auth
