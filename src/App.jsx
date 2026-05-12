import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

const API_URL = 'https://prototipo-production-7c5f.up.railway.app'
const ALL_CATEGORY = 'Todos'

const CATEGORY_THEME = {
  todos: { icon: '\u2728', soft: '#fff3d7', accent: '#f2b93b' },
  bebidas: { icon: '\u{1F964}', soft: '#dff6ff', accent: '#4fa3ff' },
  golosinas: { icon: '\u{1F36C}', soft: '#ffe0ea', accent: '#ff6b9f' },
  abarrotes: { icon: '\u{1F6D2}', soft: '#efe3d4', accent: '#b8794d' },
  limpieza: { icon: '\u{1F9FC}', soft: '#daf6ef', accent: '#3fb58b' },
  lacteos: { icon: '\u{1F95B}', soft: '#fff6d9', accent: '#e3b02c' },
  snacks: { icon: '\u{1F35F}', soft: '#ffe8ce', accent: '#f08d33' },
  panaderia: { icon: '\u{1F956}', soft: '#f3e6cf', accent: '#c58742' },
  hogar: { icon: '\u{1F9FB}', soft: '#e7ecff', accent: '#6f7ff6' },
  default: { icon: '\u{1F6CD}', soft: '#f2f1ff', accent: '#8a78ff' }
}

const currencyFormatter = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  minimumFractionDigits: 2
})

function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0)
}

function normalizeText(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}
function getCategoryMeta(name) {
  const normalized = normalizeText(name)
  const theme = CATEGORY_THEME[normalized] || CATEGORY_THEME.default

  return {
    name: name || 'Sin categoria',
    normalized,
    ...theme
  }
}

function getProductAccent(product) {
  return getCategoryMeta(product.category)
}

function Login({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const googleRef = useRef(null)
  const isLogin = mode === 'login'

  const switchMode = () => {
    setMode(isLogin ? 'register' : 'login')
    setError('')
    setMessage('')
    setName('')
    setEmail('')
    setPassword('')
  }

  const handleGoogleResponse = async (response) => {
    try {
      const res = await fetch(`${API_URL}/api/google-login`, {
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
    } catch (requestError) {
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

    const timer = window.setTimeout(renderGoogleButton, 500)
    return () => window.clearTimeout(timer)
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, password })
      })

      const data = await res.json()

      if (res.ok && data.ok) {
        onLogin(data.usuario)
      } else {
        setError(data.mensaje || 'No se pudo iniciar sesion')
      }
    } catch (requestError) {
      setError('No se pudo conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: name, correo: email, password })
      })

      const data = await res.json()

      if (res.ok && data.ok) {
        setMessage('Usuario creado correctamente. Ahora puedes iniciar sesion.')
        setMode('login')
        setName('')
        setEmail('')
        setPassword('')
      } else {
        setError(data.mensaje || 'No se pudo registrar')
      }
    } catch (requestError) {
      setError('No se pudo conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-layout">
        <section className="login-aside">
          <span className="eyebrow">Kiosko digital</span>
          <h1>Una vitrina mas clara, rapida y lista para vender.</h1>
          <p className="login-lead">
            Organiza productos, encuentra categorias rapido y deja el carrito a
            un toque de distancia.
          </p>

          <div className="login-highlight-grid">
            <article className="highlight-card">
              <span className="highlight-icon">{'\u{1F525}'}</span>
              <div>
                <h3>Compra sin friccion</h3>
                <p>Busqueda central, filtros utiles y carrito visible.</p>
              </div>
            </article>

            <article className="highlight-card">
              <span className="highlight-icon">{'\u{1F4B3}'}</span>
              <div>
                <h3>Acceso directo</h3>
                <p>Entra con correo o con tu cuenta de Google.</p>
              </div>
            </article>
          </div>

          <div className="login-metrics">
            <div>
              <strong>+6</strong>
              <span>zonas listas para catalogo</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>tu tienda disponible</span>
            </div>
            <div>
              <strong>1 toque</strong>
              <span>para agregar al carrito</span>
            </div>
          </div>
        </section>

        <section className="login-card">
          <div className="login-logo">
            <span className="brand-mark">{'\u{1F3EA}'}</span>
            Mi Kiosko
          </div>

          <span className="eyebrow">{isLogin ? 'Bienvenido' : 'Nueva cuenta'}</span>
          <h2>{isLogin ? 'Iniciar sesion' : 'Crear cuenta'}</h2>
          <p className="login-subtext">
            {isLogin
              ? 'Ingresa para explorar tu tienda virtual.'
              : 'Registrate y empieza a comprar en segundos.'}
          </p>

          <form
            onSubmit={isLogin ? handleLogin : handleRegister}
            className="login-form"
          >
            {mode === 'register' && (
              <label className="field">
                <span>Nombre</span>
                <input
                  type="text"
                  placeholder="Tu nombre completo"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
            )}

            <label className="field">
              <span>Correo</span>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label className="field">
              <span>Contrasena</span>
              <input
                type="password"
                placeholder="Tu contrasena"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>

            <button type="submit" disabled={loading} className="primary-action">
              {loading
                ? 'Procesando...'
                : isLogin
                  ? 'Entrar a la tienda'
                  : 'Crear mi cuenta'}
            </button>
          </form>

          <div className="google-login-box">
            <div className="google-divider">
              <span>o continua con</span>
            </div>
            <div ref={googleRef} className="google-btn-wrapper"></div>
          </div>

          {error && <p className="status-text error">{error}</p>}
          {message && <p className="status-text success-message">{message}</p>}

          <div className="switch-box">
            <p className="switch-text">
              {isLogin ? 'Aun no tienes cuenta?' : 'Ya tienes una cuenta?'}
            </p>

            <button type="button" className="switch-btn" onClick={switchMode}>
              {isLogin ? 'Crear cuenta' : 'Volver al login'}
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

function Header({
  search,
  setSearch,
  cartCount,
  cartTotal,
  usuario,
  onToggleCart,
  onLogout
}) {
  const firstName = usuario?.nombre?.split(' ')[0] || 'Cliente'

  return (
    <header className="header">
      <div className="brand">
        <div className="brand-icon">{'\u{1F3EA}'}</div>
        <div className="brand-text">
          <span className="brand-title">Mi Kiosko</span>
          <span className="brand-subtitle">Sabores de barrio, version online</span>
        </div>
      </div>

      <div className="search-panel">
        <label className="search-box">
          <span className="search-icon">{'\u2315'}</span>
          <input
            type="text"
            placeholder="Busca snacks, bebidas o articulos del hogar..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <div className="search-caption">
          <span>{'\u{1F4A1}'} Encuentra productos en segundos</span>
          <span>{'\u{1F69A}'} Carrito listo para revisar</span>
        </div>
      </div>

      <div className="header-actions">
        <button className="account-btn" type="button">
          <span className="account-avatar">{firstName.slice(0, 1).toUpperCase()}</span>
          <span>
            <strong>{usuario?.nombre || 'Mi cuenta'}</strong>
            <small>Sesion activa</small>
          </span>
        </button>

        <button className="cart-pill" type="button" onClick={onToggleCart}>
          <span>{'\u{1F6D2}'} {cartCount}</span>
          <strong>{formatCurrency(cartTotal)}</strong>
        </button>

        <button className="ghost-btn" type="button" onClick={onLogout}>
          Salir
        </button>
      </div>
    </header>
  )
}

function HeroSection({
  usuario,
  productCount,
  categoryCount,
  cartCount,
  cartTotal,
  onExplore,
  onOpenCart
}) {
  const firstName = usuario?.nombre?.split(' ')[0] || 'Cliente'

  return (
    <section className="hero-panel">
      <div className="hero-copy">
        <span className="eyebrow">Catalogo activo</span>
        <h1>Hola, {firstName}. Tu tienda ya se siente mucho mas moderna.</h1>
        <p>
          Reorganicé el frente con mejor jerarquia visual, filtros utiles y un
          carrito mas comodo en desktop y movil.
        </p>

        <div className="hero-actions">
          <button type="button" className="primary-action" onClick={onExplore}>
            Explorar catalogo
          </button>
          <button type="button" className="secondary-action" onClick={onOpenCart}>
            Ver carrito
          </button>
        </div>
      </div>

      <div className="hero-stats">
        <article className="stat-card">
          <span>Productos</span>
          <strong>{productCount}</strong>
          <small>catalogo visible</small>
        </article>
        <article className="stat-card">
          <span>Categorias</span>
          <strong>{categoryCount}</strong>
          <small>listas para navegar</small>
        </article>
        <article className="stat-card">
          <span>En carrito</span>
          <strong>{cartCount}</strong>
          <small>{formatCurrency(cartTotal)} acumulado</small>
        </article>
      </div>
    </section>
  )
}

function Categories({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <section className="categories-row" id="categorias">
      {categories.map((item) => (
        <button
          key={item.name}
          type="button"
          className={
            selectedCategory === item.name
              ? 'category-chip active-chip'
              : 'category-chip'
          }
          style={{
            '--chip-bg': item.soft,
            '--chip-accent': item.accent
          }}
          onClick={() => setSelectedCategory(item.name)}
        >
          <div className="category-icon">{item.icon}</div>
          <span>{item.name}</span>
        </button>
      ))}
    </section>
  )
}

function FiltersPanel({
  resultCount,
  selectedCategory,
  search,
  sortBy,
  setSortBy,
  priceLimit,
  setPriceLimit,
  maxPrice,
  onClear
}) {
  const safeMax = Math.max(Math.ceil(maxPrice), 1)
  const safeValue = Math.min(priceLimit || safeMax, safeMax)

  return (
    <aside className="filters-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Control rapido</span>
          <h3>Filtros del catalogo</h3>
        </div>
        <button type="button" className="text-btn" onClick={onClear}>
          Limpiar
        </button>
      </div>

      <div className="filter-stack">
        <div className="summary-badge">
          <strong>{resultCount}</strong>
          <span>resultados</span>
        </div>

        <div className="filter-card">
          <p>Categoria activa</p>
          <strong>{selectedCategory}</strong>
        </div>

        <div className="filter-card">
          <p>Busqueda</p>
          <strong>{search ? `"${search}"` : 'Sin termino'}</strong>
        </div>

        <label className="field">
          <span>Ordenar por</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="recommended">Recomendados</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="name">Nombre A-Z</option>
          </select>
        </label>

        <div className="range-block">
          <div className="range-header">
            <span>Precio maximo</span>
            <strong>{formatCurrency(safeValue)}</strong>
          </div>

          <input
            type="range"
            min="0"
            max={safeMax}
            value={safeValue}
            onChange={(event) => setPriceLimit(Number(event.target.value))}
          />

          <div className="range-scale">
            <span>{formatCurrency(0)}</span>
            <span>{formatCurrency(safeMax)}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

function ProductSkeleton() {
  return (
    <article className="product-card skeleton-card">
      <div className="skeleton skeleton-badge"></div>
      <div className="product-image skeleton"></div>
      <div className="product-info">
        <div className="skeleton skeleton-price"></div>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-line"></div>
        <div className="skeleton skeleton-line short"></div>
      </div>
      <div className="skeleton skeleton-button"></div>
    </article>
  )
}

function ProductsGrid({
  items,
  loading,
  error,
  cartMap,
  addToCart,
  onRetry,
  onClear
}) {
  if (loading) {
    return (
      <section className="products-grid" id="catalogo">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductSkeleton key={`skeleton-${index}`} />
        ))}
      </section>
    )
  }

  if (error) {
    return (
      <section className="empty-state" id="catalogo">
        <div className="empty-icon">{'\u26A0'}</div>
        <h3>No pudimos cargar el catalogo</h3>
        <p>{error}</p>
        <button type="button" className="primary-action" onClick={onRetry}>
          Intentar de nuevo
        </button>
      </section>
    )
  }

  if (items.length === 0) {
    return (
      <section className="empty-state" id="catalogo">
        <div className="empty-icon">{'\u{1F50E}'}</div>
        <h3>No encontramos productos con esos filtros</h3>
        <p>Prueba otra categoria, cambia la busqueda o amplia el rango de precio.</p>
        <button type="button" className="secondary-action" onClick={onClear}>
          Limpiar filtros
        </button>
      </section>
    )
  }

  return (
    <section className="products-grid" id="catalogo">
      {items.map((product) => {
        const accent = getProductAccent(product)
        const quantityInCart = cartMap.get(product.id) || 0

        return (
          <article
            className="product-card"
            key={product.id}
            style={{
              '--product-soft': accent.soft,
              '--product-accent': accent.accent
            }}
          >
            <div className="product-meta">
              <span className="product-tag">{accent.name}</span>
              {quantityInCart > 0 && (
                <span className="product-counter">{quantityInCart} en carrito</span>
              )}
            </div>

            <div className="product-image">{product.emoji || accent.icon}</div>

            <div className="product-info">
              <p className="product-price">{formatCurrency(product.price)}</p>
              <h3>{product.name}</h3>
              <p className="product-description">
                {product.description || 'Producto disponible para entrega inmediata.'}
              </p>
            </div>

            <button className="add-btn" type="button" onClick={() => addToCart(product)}>
              <span>Agregar</span>
              <strong>+</strong>
            </button>
          </article>
        )
      })}
    </section>
  )
}

function CartPanel({
  cart,
  subtotal,
  shipping,
  total,
  increaseQty,
  decreaseQty,
  clearCart,
  onClose,
  mobile = false
}) {
  return (
    <div className={mobile ? 'cart-panel cart-panel-mobile' : 'cart-panel'}>
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Resumen</span>
          <h3>Carrito de compras</h3>
        </div>
        {mobile ? (
          <button type="button" className="icon-btn" onClick={onClose}>
            Cerrar
          </button>
        ) : null}
      </div>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <div className="empty-icon">{'\u{1F6D2}'}</div>
          <h4>Tu carrito esta vacio</h4>
          <p>Agrega productos desde el catalogo para ver el resumen aqui.</p>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <article className="cart-product" key={item.id}>
                <div className="cart-product-left">
                  <div className="mini-emoji">
                    {item.emoji || getProductAccent(item).icon}
                  </div>
                  <div>
                    <p className="cart-product-price">{formatCurrency(item.price)}</p>
                    <h4>{item.name}</h4>
                  </div>
                </div>

                <div className="qty-controls">
                  <button type="button" onClick={() => decreaseQty(item.id)}>
                    -
                  </button>
                  <span>{item.qty}</span>
                  <button type="button" onClick={() => increaseQty(item.id)}>
                    +
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-line">
              <span>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <div className="summary-line">
              <span>Envio estimado</span>
              <strong>{formatCurrency(shipping)}</strong>
            </div>
            <div className="summary-line total-line">
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </div>

            <button type="button" className="primary-action wide">
              Pagar pedido
            </button>
            <button type="button" className="secondary-action wide" onClick={clearCart}>
              Vaciar carrito
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function MobileCart({
  isOpen,
  cart,
  subtotal,
  shipping,
  total,
  increaseQty,
  decreaseQty,
  clearCart,
  onClose
}) {
  if (!isOpen) return null

  return (
    <div className="mobile-cart-layer">
      <button
        type="button"
        className="mobile-cart-overlay"
        aria-label="Cerrar carrito"
        onClick={onClose}
      ></button>

      <div className="mobile-cart-sheet">
        <CartPanel
          cart={cart}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          increaseQty={increaseQty}
          decreaseQty={decreaseQty}
          clearCart={clearCart}
          onClose={onClose}
          mobile
        />
      </div>
    </div>
  )
}

function BottomNav({ onGoTop, onGoCatalog, onOpenCart, cartCount, onLogout }) {
  return (
    <nav className="bottom-nav">
      <button type="button" onClick={onGoTop}>
        <span>{'\u{1F3E0}'}</span>
        <small>Inicio</small>
      </button>
      <button type="button" onClick={onGoCatalog}>
        <span>{'\u{1F50D}'}</span>
        <small>Catalogo</small>
      </button>
      <button type="button" onClick={onOpenCart} className="bottom-cart-btn">
        <span>{'\u{1F6D2}'}</span>
        <small>Carrito ({cartCount})</small>
      </button>
      <button type="button" onClick={onLogout}>
        <span>{'\u21AA'}</span>
        <small>Salir</small>
      </button>
    </nav>
  )
}

export default function App() {
  const [isLogged, setIsLogged] = useState(false)
  const [usuario, setUsuario] = useState(null)
  const [products, setProducts] = useState([])
  const [productsStatus, setProductsStatus] = useState('loading')
  const [productsError, setProductsError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY)
  const [sortBy, setSortBy] = useState('recommended')
  const [priceLimit, setPriceLimit] = useState(0)
  const [cart, setCart] = useState([])
  const [message, setMessage] = useState('')
  const [isCartOpen, setIsCartOpen] = useState(false)

  const toastTimerRef = useRef(null)
  const deferredSearch = useDeferredValue(search)

  const loadProducts = async () => {
    setProductsStatus('loading')
    setProductsError('')

    try {
      const res = await fetch(`${API_URL}/api/productos`)

      if (!res.ok) {
        throw new Error('El servidor no pudo devolver los productos.')
      }

      const data = await res.json()
      setProducts(Array.isArray(data) ? data : [])
      setProductsStatus('ready')
    } catch (error) {
      console.error('Error cargando productos:', error)
      setProductsError('Revisa el backend o tu conexion y vuelve a intentarlo.')
      setProductsStatus('error')
    }
  }

  useEffect(() => {
    loadProducts()

    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current)
      }
    }
  }, [])

  const maxProductPrice = useMemo(() => {
    if (products.length === 0) return 0

    return products.reduce((highest, product) => {
      const price = Number(product.price) || 0
      return price > highest ? price : highest
    }, 0)
  }, [products])

  useEffect(() => {
    if (!maxProductPrice) return

    setPriceLimit((current) => {
      if (current === 0 || current > maxProductPrice) {
        return Math.ceil(maxProductPrice)
      }

      return current
    })
  }, [maxProductPrice])

  const categories = useMemo(() => {
    const catalogCategories = Array.from(
      new Set(products.map((product) => product.category).filter(Boolean))
    )

    return [getCategoryMeta(ALL_CATEGORY)].concat(
      catalogCategories
        .sort((left, right) => left.localeCompare(right))
        .map((category) => getCategoryMeta(category))
    )
  }, [products])

  const filteredProducts = useMemo(() => {
    const searchTerm = normalizeText(deferredSearch)

    const list = products.filter((product) => {
      const matchesCategory =
        selectedCategory === ALL_CATEGORY || product.category === selectedCategory

      const matchesSearch =
        !searchTerm ||
        normalizeText(product.name || '').includes(searchTerm) ||
        normalizeText(product.description || '').includes(searchTerm)

      const matchesPrice = Number(product.price) <= (priceLimit || maxProductPrice)

      return matchesCategory && matchesSearch && matchesPrice
    })

    if (sortBy === 'price-asc') {
      return [...list].sort((left, right) => Number(left.price) - Number(right.price))
    }

    if (sortBy === 'price-desc') {
      return [...list].sort((left, right) => Number(right.price) - Number(left.price))
    }

    if (sortBy === 'name') {
      return [...list].sort((left, right) => left.name.localeCompare(right.name))
    }

    return [...list].sort((left, right) => {
      const leftScore =
        (normalizeText(left.category) === normalizeText(selectedCategory) ? 2 : 0) +
        (Number(left.price) <= maxProductPrice / 2 ? 1 : 0)
      const rightScore =
        (normalizeText(right.category) === normalizeText(selectedCategory) ? 2 : 0) +
        (Number(right.price) <= maxProductPrice / 2 ? 1 : 0)

      if (rightScore !== leftScore) {
        return rightScore - leftScore
      }

      return left.name.localeCompare(right.name)
    })
  }, [deferredSearch, maxProductPrice, priceLimit, products, selectedCategory, sortBy])

  const cartMap = useMemo(() => {
    return new Map(cart.map((item) => [item.id, item.qty]))
  }, [cart])

  const subtotal = useMemo(() => {
    return cart.reduce((accumulator, item) => {
      return accumulator + Number(item.price) * item.qty
    }, 0)
  }, [cart])

  const shipping = cart.length > 0 ? 4.8 : 0
  const total = subtotal + shipping
  const cartCount = cart.reduce((accumulator, item) => accumulator + item.qty, 0)

  const clearToast = () => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current)
    }
  }

  const addToCart = (product) => {
    setCart((previousCart) => {
      const exists = previousCart.find((item) => item.id === product.id)

      if (exists) {
        return previousCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      }

      return [...previousCart, { ...product, qty: 1 }]
    })

    clearToast()
    setMessage(`${product.name} agregado al carrito`)
    toastTimerRef.current = window.setTimeout(() => setMessage(''), 1800)
  }

  const increaseQty = (id) => {
    setCart((previousCart) =>
      previousCart.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    )
  }

  const decreaseQty = (id) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    )
  }

  const clearCart = () => setCart([])

  const resetFilters = () => {
    setSelectedCategory(ALL_CATEGORY)
    setSearch('')
    setSortBy('recommended')
    setPriceLimit(Math.ceil(maxProductPrice) || 0)
  }

  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)

  const goToCatalog = () => {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
  }

  const goToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogout = () => {
    setIsLogged(false)
    setUsuario(null)
    setCart([])
    setMessage('')
    closeCart()
  }

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
        cartTotal={total}
        usuario={usuario}
        onToggleCart={openCart}
        onLogout={handleLogout}
      />

      <main className="main-container">


        <Categories
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {message && <div className="toast-message">{message}</div>}

        <section className="store-layout">
          <FiltersPanel
            resultCount={filteredProducts.length}
            selectedCategory={selectedCategory}
            search={search}
            sortBy={sortBy}
            setSortBy={setSortBy}
            priceLimit={priceLimit}
            setPriceLimit={setPriceLimit}
            maxPrice={maxProductPrice}
            onClear={resetFilters}
          />

          <ProductsGrid
            items={filteredProducts}
            loading={productsStatus === 'loading'}
            error={productsStatus === 'error' ? productsError : ''}
            cartMap={cartMap}
            addToCart={addToCart}
            onRetry={loadProducts}
            onClear={resetFilters}
          />

          <aside className="cart-sidebar">
            <CartPanel
              cart={cart}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              increaseQty={increaseQty}
              decreaseQty={decreaseQty}
              clearCart={clearCart}
            />
          </aside>
        </section>
      </main>

      <MobileCart
        isOpen={isCartOpen}
        cart={cart}
        subtotal={subtotal}
        shipping={shipping}
        total={total}
        increaseQty={increaseQty}
        decreaseQty={decreaseQty}
        clearCart={clearCart}
        onClose={closeCart}
      />

      <BottomNav
        onGoTop={goToTop}
        onGoCatalog={goToCatalog}
        onOpenCart={openCart}
        cartCount={cartCount}
        onLogout={handleLogout}
      />
    </div>
  )
}
