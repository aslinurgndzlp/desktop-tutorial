import { useState } from 'react'
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from './productsMock'
import { UserProvider } from './context/UserContext'
import { ThemeProvider } from './context/ThemeContext'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import ProductGrid from './components/ProductGrid'
import AddProductForm from './components/AddProductForm'
import ProductDetail from './components/ProductDetail'
import CategoriesList from './components/CategoriesList'
import AboutUs from './components/AboutUs'
import HelpCenter from './components/HelpCenter'
import OrderTracking from './components/OrderTracking'
import ProductReturns from './components/ProductReturns'
import CartDrawer from './components/CartDrawer'
import LoginModal from './components/LoginModal'
import Footer from './components/Footer'


function AppContent() {
  const [view, setView] = useState('home')
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [selectedCategory, setSelectedCategory] = useState('Tümü')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  const handleAddProduct = (data) => {
    const newProduct = {
      id: Date.now(),
      title: data.title,
      price: Number(data.price),
      category: data.category,
      rating: 5.0,
      ratingCount: 1,
      image: data.image,
      description: data.description,
    }
    setProducts([newProduct, ...products])
  }

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'Tümü' || p.category === selectedCategory
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setSearchQuery(searchInput)
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setView('detail')
  }

  const handleBackToList = () => {
    setSelectedProduct(null)
    setView('home')
  }

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    setView('home')
  }

  return (
    <div>
      <Header
        setView={setView}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSearchSubmit={handleSearchSubmit}
        setSelectedCategory={setSelectedCategory}
        setSearchQuery={setSearchQuery}
        onLoginClick={() => setIsLoginOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
      />

      <Navbar
        categories={MOCK_CATEGORIES}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        setView={setView}
      />

      {view === 'home' && (
        <main className="main-layout">
          <Sidebar
            categories={MOCK_CATEGORIES}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setView={setView}
          />

          <div className="content-area">
            <div className="content-header">
              <h1 className="page-title">
                {selectedCategory} {searchQuery && `> "${searchQuery}"`} Ürünleri
              </h1>
              <span className="text-sm">Toplam {filteredProducts.length} ürün listelendi</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">Aradığınız kriterlere uygun ürün bulunamadı.</p>
              </div>
            ) : (
              <ProductGrid
                products={filteredProducts}
                onProductClick={handleProductClick}
              />
            )}
          </div>
        </main>
      )}

      {view === 'addProduct' && (
        <AddProductForm
          categories={MOCK_CATEGORIES}
          onAddProduct={handleAddProduct}
          setView={setView}
        />
      )}

      {view === 'detail' && (
        <ProductDetail
          product={selectedProduct}
          onBack={handleBackToList}
        />
      )}

      {view === 'categories' && (
        <CategoriesList
          categories={MOCK_CATEGORIES}
          products={products}
          onCategoryClick={handleCategoryClick}
        />
      )}

      {view === 'about' && <AboutUs />}

      {view === 'help' && <HelpCenter />}

      {view === 'tracking' && <OrderTracking />}

      {view === 'returns' && <ProductReturns />}

      

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        setView={setView}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />

      <Footer setView={setView} setSelectedCategory={setSelectedCategory} />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </CartProvider>
    </ThemeProvider>
  )
}

export default App
