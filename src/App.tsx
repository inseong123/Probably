import { useState, useEffect } from 'react'
import './App.css'
import Auth from './components/Auth'
import Game from './components/Game'
import { User } from './types'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 기존 로그인 확인
    const savedUserId = localStorage.getItem('sword_game_current_user')
    if (savedUserId) {
      const users = JSON.parse(localStorage.getItem('sword_game_users') || '{}')
      const currentUser = users[savedUserId]
      if (currentUser) {
        setUser(currentUser)
      }
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <div className="loading">로딩 중...</div>
  }

  return (
    <div className="app">
      {user ? (
        <Game />
      ) : (
        <Auth onLogin={setUser} />
      )}
    </div>
  )
}

export default App
