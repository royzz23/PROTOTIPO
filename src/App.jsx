import { useEffect, useMemo, useRef, useState } from 'react'

const categories = [
  { name: 'Todos', icon: '🛒' },
  { name: 'Bebidas', icon: '🥤' },
  { name: 'Golosinas', icon: '🍬' },
  { name: 'Abarrotes', icon: '🛍️' },
  { name: 'Limpieza', icon: '🧴' },
  { name: 'Lácteos', icon: '🥛' }
]
function Login({ onLogin }) {
  const [modo, setModo] = useState('login')
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const googleRef = useRef(null)

  const cambiarModo = () => {
    setModo(modo === 'login' ? 'register' : 'login')
    setError('')
    setMsg('')
    setNombre('')
    setCorreo('')
    setPassword('')
  }

  const handleGoogleResponse = async (response) => {
    try {
      const res = await fetch('http://localhost:3001/api/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential })
      })

      const data = await res.json()

      if (res.ok && data.ok) {
        onLogin(data.usuario)
      } else {
        setError(data.mensaje || 'No se pudo iniciar con Google')
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor')
    }
  }

  useEffect(() => {
    const renderGoogleButton = () => {
      if (!window.google || !googleRef.current) return

      googleRef.current.innerHTML = ''

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse
      })

      window.google.accounts.id.renderButton(googleRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'pill',
        width: 320
      })
    }

    const timer = setTimeout(renderGoogleButton, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setMsg('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password })
      })

      const data = await res.json()

      if (res.ok && data.ok) {
        onLogin(data.usuario)
      } else {
        setError(data.mensaje || 'Error al iniciar sesión')
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setMsg('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, password })
      })

      const data = await res.json()

      if (res.ok && data.ok) {
        setMsg('Usuario creado correctamente. Ahora inicia sesión.')
        setModo('login')
        setNombre('')
        setCorreo('')
        setPassword('')
      } else {
        setError(data.mensaje || 'No se pudo registrar')
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🏪 Mi Kiosko</div>

        <h1>{modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h1>
        <p className="login-subtext">
          {modo === 'login'
            ? 'Ingresa a tu tienda virtual'
            : 'Regístrate para comprar en tu tienda virtual'}
        </p>

        <form
          onSubmit={modo === 'login' ? handleLogin : handleRegister}
          className="login-form"
        >
          {modo === 'register' && (
            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading
              ? 'Procesando...'
              : modo === 'login'
                ? 'Ingresar'
                : 'Registrarse'}
          </button>
        </form>

        <div className="google-login-box">
          <div className="google-divider">
            <span>o continúa con</span>
          </div>
          <div ref={googleRef} className="google-btn-wrapper"></div>
        </div>

        {error && <p className="error">{error}</p>}
        {msg && <p className="success-message">{msg}</p>}



        <div className="switch-box">
          <p className="switch-text">
            {modo === 'login'
              ? '¿No tienes cuenta?'
              : '¿Ya tienes cuenta?'}
          </p>

          <button
            type="button"
            className="switch-btn"
            onClick={cambiarModo}
          >
            {modo === 'login' ? 'Crear cuenta' : 'Iniciar sesión'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Header({ search, setSearch, cartCount, usuario }) {
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
        <button className="account-btn">
          👤 {usuario?.nombre || 'Mi Cuenta'}
        </button>
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
  if (items.length === 0) {
    return (
      <section className="products-grid">
        <p>No hay productos para mostrar.</p>
      </section>
    )
  }

  return (
    <section className="products-grid">
      {items.map((product) => (
        <div className="product-card" key={product.id}>
          <div className="product-image">{product.emoji || '🛒'}</div>

          <div className="product-info">
            {product.enOferta ? (
              <>
                <p className="product-price">S/ {Number(product.price).toFixed(2)}</p>
                <p className="product-old-price">
                  S/ {Number(product.originalPrice).toFixed(2)}
                </p>
              </>
            ) : (
              <p className="product-price">S/ {Number(product.price).toFixed(2)}</p>
            )}

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
  const subtotal = cart.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
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
                <div className="mini-emoji">{item.emoji || '🛒'}</div>
                <div>
                  <p className="cart-product-price">S/ {Number(item.price).toFixed(2)}</p>
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
  const [usuario, setUsuario] = useState(null)
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [cart, setCart] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('http://localhost:3001/api/productos')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error cargando productos:', error))
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory =
        selectedCategory === 'Todos' || product.category === selectedCategory

      const matchSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())

      return matchCategory && matchSearch
    })
  }, [products, search, selectedCategory])

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
    return (
      <Login
        onLogin={(user) => {
          setUsuario(user)
          setIsLogged(true)
        }}
      />
    )
  }

  return (
    <div className="app-shell">
      <Header
        search={search}
        setSearch={setSearch}
        cartCount={cartCount}
        usuario={usuario}
      />

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