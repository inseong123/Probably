import { useState } from 'react'
import './Shop.css'

interface ShopProps {
  onAddGold: (amount: number) => void
}

const Shop = ({ onAddGold }: ShopProps) => {
  const [clickCount, setClickCount] = useState(0)

  const products = [
    { id: 1, name: '작은 금화', gold: 100, price: 0, emoji: '🪙' },
    { id: 2, name: '중간 금화', gold: 500, price: 0, emoji: '💰' },
    { id: 3, name: '큰 금화', gold: 1000, price: 0, emoji: '💎' },
  ]

  const handleBuyGold = (amount: number) => {
    onAddGold(amount)
    setClickCount(clickCount + 1)
  }

  return (
    <div className="shop-panel">
      <h2>🏪 상점</h2>
      <div className="shop-items">
        {products.map(product => (
          <button 
            key={product.id}
            className="shop-item"
            onClick={() => handleBuyGold(product.gold)}
            title={`${product.gold} 골드 획득`}
          >
            <span className="emoji">{product.emoji}</span>
            <span className="name">{product.name}</span>
            <span className="gold">+{product.gold}</span>
          </button>
        ))}
      </div>
      {clickCount > 0 && (
        <div className="cheat-notice">🤐 {clickCount}번 쌓쌓...</div>
      )}
    </div>
  )
}

export default Shop
