import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { useCart } from '../hooks/useCart'
import { useTheme } from '../hooks/useTheme'

export default function Header({ setView, searchInput, setSearchInput, handleSearchSubmit, setSelectedCategory, setSearchQuery, onLoginClick, onCartClick }) {
  const { user, logout } = useContext(UserContext)
  const { cartCount } = useCart()
  const { theme, toggleTheme } = useTheme()

  const handleLogoClick = () => {
    setView('home')
    setSelectedCategory('Tümü')
    setSearchQuery('')
    setSearchInput('')
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={handleLogoClick}>
          n11<span className="logo-accent">clone</span>
        </div>

        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Ürün veya kategori ara..."
            className="search-input"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="search-button">Ara</button>
        </form>

        <div className="header-actions">
          <div className="action-item" onClick={toggleTheme}>
            <span>{theme === 'light' ? '🌙' : '☀️'}</span>
          </div>
          <div className="action-item" onClick={() => setView('addProduct')}>
            <span>Yeni Ürün</span>
          </div>
          {user ? (
            <div className="action-item" onClick={logout}>
              <span>Çıkış Yap</span>
            </div>
          ) : (
            <div className="action-item" onClick={onLoginClick}>
              <span>Giriş Yap</span>
            </div>
          )}
          <div className="action-item" onClick={onCartClick}>
            <span>Sepetim</span>
            <span className="badge">{cartCount}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
