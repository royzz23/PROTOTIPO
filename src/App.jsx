import { useMemo, useState } from 'react'

const products = [
  { id: 1, name: 'Inca Kola 500ml', category: 'Bebidas', price: 3.5, emoji: '🥤', description: 'Bebida tradicional peruana.' },
  { id: 2, name: 'Casino Menta', category: 'Golosinas', price: 1.2, emoji: '🍪', description: 'Galletas sabor menta.' },
  { id: 3, name: 'Sublime Clásico', category: 'Golosinas', price: 2.0, emoji: '🍫', description: 'Chocolate clásico peruano.' },
  { id: 4, name: 'Cua Cua 200g', category: 'Golosinas', price: 1.5, emoji: '🍬', description: 'Wafer relleno.' },
  { id: 5, name: 'Papas Lays', category: 'Abarrotes', price: 4.8, emoji: '🍟', description: 'Papas crocantes.' },
  { id: 6, name: 'Pulp Durazno', category: 'Bebidas', price: 1.2, emoji: '🧃', description: 'Jugo listo para tomar.' },
  { id: 7, name: 'Agua San Luis', category: 'Bebidas', price: 2.0, emoji: '💧', description: 'Agua mineral.' },
  { id: 8, name: 'Arroz Costeño', category: 'Abarrotes', price: 1.5, emoji: '🍚', description: 'Arroz de uso diario.' },
  { id: 9, name: 'Detergente', category: 'Limpieza', price: 6.5, emoji: '🧴', description: 'Limpieza para el hogar.' },
  { id: 10, name: 'Leche Gloria', category: 'Lácteos', price: 4.2, emoji: '🥛', description: 'Leche evaporada.' },
  { id: 11, name: 'Yogurt', category: 'Lácteos', price: 3.8, emoji: '🥣', description: 'Yogurt fresco.' },
  { id: 12, name: 'Galletas Oreo', category: 'Golosinas', price: 2.5, emoji: '🍪', description: 'Galletas favoritas.' }
]

const categories = [
  { name: 'Todos', icon: '🛒' },
  { name: 'Bebidas', icon: '🥤' },
  { name: 'Golosinas', icon: '🍬' },
  { name: 'Abarrotes', icon: '🛍️' },
  { name: 'Limpieza', icon: '🧴' },
  { name: 'Lácteos', icon: '🥛' }
]

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (username === 'admin' && password === '1234') {
      setError('')
      onLogin()
    } else {
      setError('Usuario o contraseña incorrectos')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🏪 Mi Kiosko</div>
        <h1>Bienvenido</h1>
        <p>Ingresa a tu tienda virtual</p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Ingresar</button>
        </form>

        {error && <p className="error">{error}</p>}

        <div className="credentials">
          <p><strong>Usuario:</strong> admin</p>
          <p><strong>Contraseña:</strong> 1234</p>
        </div>
      </div>
    </div>
  )
}

function Header({ search, setSearch, cartCount }) {
  return (
    <header className="header">
      <div className="brand">
        <span className="brand-icon">🏪</span>
        <div className="brand-text">
          <span className="brand-title">Mi Kiosko</span>
          <span className="brand-subtitle">Tu tienda online</span>
        </div>
      </div>

      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Busca tu snack o producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="header-actions">
        <button className="account-btn">👤 Mi Cuenta</button>
        <div className="cart-badge">🛒 {cartCount}</div>
      </div>
    </header>
  )
}

function Categories({ selectedCategory, setSelectedCategory }) {
  return (
    <section className="categories-row">
      {categories.map((item) => (
        <button
          key={item.name}
          className={selectedCategory === item.name ? 'category-chip active-chip' : 'category-chip'}
          onClick={() => setSelectedCategory(item.name)}
        >
          <div className="category-icon">{item.icon}</div>
          <span>{item.name}</span>
        </button>
      ))}
    </section>
  )
}

function FiltersPanel() {
  return (
    <aside className="filters-panel">
      <h3>Filtros</h3>

      <div className="filter-group">
        <p>Precio (rango)</p>
        <input type="range" min="1" max="10" />
      </div>

      <div className="filter-group">
        <p>Marca</p>
        <label><input type="checkbox" /> Gloria</label>
        <label><input type="checkbox" /> Casino</label>
        <label><input type="checkbox" /> Inca Kola</label>
      </div>

      <div className="filter-group">
        <p>Contenido</p>
        <label><input type="checkbox" /> Bebidas</label>
        <label><input type="checkbox" /> Dulces</label>
        <label><input type="checkbox" /> Limpieza</label>
      </div>

      <div className="filter-group">
        <p>Valoración</p>
        <div className="stars">★★★★★</div>
      </div>
    </aside>
  )
}

function ProductsGrid({ items, addToCart }) {
  return (
    <section className="products-grid">
      {items.map((product) => (
        <div className="product-card" key={product.id}>
          <div className="product-image">{product.emoji}</div>

          <div className="product-info">
            <p className="product-price">S/ {product.price.toFixed(2)}</p>
            <h3>{product.name}</h3>
            <p className="product-description">{product.description}</p>
          </div>

          <button className="add-btn" onClick={() => addToCart(product)}>
            +
          </button>
        </div>
      ))}
    </section>
  )
}

function CartSidebar({ cart, increaseQty, decreaseQty, clearCart }) {
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0)
  const envio = cart.length > 0 ? 4.8 : 0
  const total = subtotal + envio

  return (
    <aside className="cart-sidebar">
      <h3>Carrito de Compras</h3>

      <div className="cart-list">
        {cart.length === 0 ? (
          <p className="empty-cart-text">No hay productos aún</p>
        ) : (
          cart.map((item) => (
            <div className="cart-product" key={item.id}>
              <div className="cart-product-left">
                <div className="mini-emoji">{item.emoji}</div>
                <div>
                  <p className="cart-product-price">S/ {item.price.toFixed(2)}</p>
                  <h4>{item.name}</h4>
                </div>
              </div>

              <div className="qty-controls">
                <button onClick={() => decreaseQty(item.id)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => increaseQty(item.id)}>+</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cart-summary">
        <div className="summary-line">
          <span>Subtotal</span>
          <span>S/ {subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-line">
          <span>Est. de envío</span>
          <span>S/ {envio.toFixed(2)}</span>
        </div>
        <div className="summary-line total-line">
          <span>Total</span>
          <span>S/ {total.toFixed(2)}</span>
        </div>

        <button className="pay-btn">Pagar</button>

        {cart.length > 0 && (
          <button className="clear-btn" onClick={clearCart}>
            Vaciar carrito
          </button>
        )}
      </div>
    </aside>
  )
}

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <button>🏠</button>
      <button>📦</button>
      <button>🛒</button>
      <button>👤</button>
    </nav>
  )
}

export default function App() {
  const [isLogged, setIsLogged] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [cart, setCart] = useState([])
  const [message, setMessage] = useState('')

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory =
        selectedCategory === 'Todos' || product.category === selectedCategory

      const matchSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())

      return matchCategory && matchSearch
    })
  }, [search, selectedCategory])

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id)

      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      }

      return [...prev, { ...product, qty: 1 }]
    })

    setMessage(`${product.name} agregado`)
    setTimeout(() => setMessage(''), 1400)
  }

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    )
  }

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    )
  }

  const clearCart = () => setCart([])

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0)

  if (!isLogged) {
    return <Login onLogin={() => setIsLogged(true)} />
  }

  return (
    <div className="app-shell">
      <Header search={search} setSearch={setSearch} cartCount={cartCount} />

      <main className="main-container">
        <Categories
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {message && <div className="toast-message">{message}</div>}

        <section className="store-layout">
          <FiltersPanel />

          <ProductsGrid
            items={filteredProducts}
            addToCart={addToCart}
          />

          <CartSidebar
            cart={cart}
            increaseQty={increaseQty}
            decreaseQty={decreaseQty}
            clearCart={clearCart}
          />
        </section>
      </main>

      <BottomNav />
    </div>
  )
}