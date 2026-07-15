import { User } from '../types'

const USERS_KEY = 'sword_game_users'
const CURRENT_USER_KEY = 'sword_game_current_user'

export const auth = {
  // 현재 로그인된 사용자 가져오기
  getCurrentUser(): User | null {
    const userId = localStorage.getItem(CURRENT_USER_KEY)
    if (!userId) return null
    
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}') as Record<string, User>
    return users[userId] || null
  },

  // 계정 생성
  signup(username: string): User {
    const usersData = localStorage.getItem(USERS_KEY) || '{}'
    const users: Record<string, User> = JSON.parse(usersData)
    
    // 중복 확인
    const userArray: User[] = Object.values(users)
    const isDuplicate = userArray.some((u) => u.username === username)
    
    if (isDuplicate) {
      throw new Error('이미 존재하는 닉네임입니다!')
    }

    if (username.length < 2 || username.length > 20) {
      throw new Error('닉네임은 2~20자여야 합니다!')
    }

    const id = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    const user: User = {
      id,
      username,
      createdAt: Date.now(),
      lastPlayed: Date.now(),
    }

    users[id] = user
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    localStorage.setItem(CURRENT_USER_KEY, id)

    return user
  },

  // 계정 로그인 (기존 계정으로)
  login(username: string): User {
    const usersData = localStorage.getItem(USERS_KEY) || '{}'
    const users: Record<string, User> = JSON.parse(usersData)
    const userArray: User[] = Object.values(users)
    const foundUser = userArray.find((u) => u.username === username)
    
    if (!foundUser) {
      throw new Error('존재하지 않는 계정입니다!')
    }

    foundUser.lastPlayed = Date.now()
    users[foundUser.id] = foundUser
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    localStorage.setItem(CURRENT_USER_KEY, foundUser.id)

    return foundUser
  },

  // 로그아웃
  logout() {
    localStorage.removeItem(CURRENT_USER_KEY)
  },

  // 모든 사용자 목록
  getAllUsers(): User[] {
    const usersData = localStorage.getItem(USERS_KEY) || '{}'
    const users: Record<string, User> = JSON.parse(usersData)
    return Object.values(users)
  },
}
