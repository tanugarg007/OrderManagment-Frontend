import { useState } from 'react';

const categories = [
  { name: 'Electronics', icon: '📱', count: 128, color: 'blue' },
  { name: 'Fashion', icon: '👗', count: 245, color: 'pink' },
  { name: 'Home & Kitchen', icon: '🏠', count: 186, color: 'orange' },
  { name: 'Beauty', icon: '💄', count: 94, color: 'purple' },
  { name: 'Sports', icon: '⚽', count: 76, color: 'green' },
  { name: 'Books', icon: '📚', count: 312, color: 'cyan' }
];

const products = [
  {
    id: 1,
    name: 'Wireless Noise-Cancelling Headphones',
    category: 'Electronics',
    price: 299.99,
    oldPrice: 399.99,
    rating: 4.8,
    reviews: 1243,
    stock: 'In Stock',
    badge: 'Best Seller',
    img: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Premium%20wireless%20over-ear%20headphones%20matte%20black%20product%20photo%20white%20background&image_size=square_hd'
  },
  {
    id: 2,
    name: 'Smart Watch Pro Series 8',
    category: 'Electronics',
    price: 249.0,
    oldPrice: 299.0,
    rating: 4.6,
    reviews: 892,
    stock: 'In Stock',
    badge: 'New',
    img: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Modern%20smartwatch%20silver%20aluminum%20case%20sport%20band%20product%20shot%20on%20white&image_size=square_hd'
  },
  {
    id: 3,
    name: 'Ergonomic Office Chair',
    category: 'Home & Kitchen',
    price: 449.0,
    oldPrice: 549.0,
    rating: 4.9,
    reviews: 567,
    stock: 'Low Stock',
    badge: 'Hot Deal',
    img: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Premium%20black%20ergonomic%20mesh%20office%20chair%20product%20photo%20white%20background&image_size=square_hd'
  },
  {
    id: 4,
    name: 'Classic Leather Backpack',
    category: 'Fashion',
    price: 159.5,
    oldPrice: 199.0,
    rating: 4.7,
    reviews: 412,
    stock: 'In Stock',
    badge: null,
    img: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Brown%20leather%20travel%20backpack%20product%20photo%20white%20background%20studio%20shot&image_size=square_hd'
  },
  {
    id: 5,
    name: 'Professional DSLR Camera 4K',
    category: 'Electronics',
    price: 1299.0,
    oldPrice: 1499.0,
    rating: 4.9,
    reviews: 238,
    stock: 'In Stock',
    badge: 'Premium',
    img: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Professional%20black%20DSLR%20camera%20with%20lens%20product%20photo%20white%20background&image_size=square_hd'
  },
  {
    id: 6,
    name: 'Minimalist Sneakers',
    category: 'Fashion',
    price: 89.0,
    oldPrice: 119.0,
    rating: 4.5,
    reviews: 1674,
    stock: 'In Stock',
    badge: null,
    img: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Minimalist%20white%20casual%20sneakers%20side%20view%20product%20photo%20white%20background&image_size=square_hd'
  },
  {
    id: 7,
    name: 'Organic Skincare Set',
    category: 'Beauty',
    price: 79.99,
    oldPrice: 99.99,
    rating: 4.8,
    reviews: 534,
    stock: 'In Stock',
    badge: 'Eco',
    img: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Organic%20skincare%20bottles%20set%20cream%20serum%20minimal%20product%20photo%20white%20background&image_size=square_hd'
  },
  {
    id: 8,
    name: 'Smart LED Desk Lamp',
    category: 'Home & Kitchen',
    price: 69.0,
    oldPrice: 89.0,
    rating: 4.6,
    reviews: 821,
    stock: 'In Stock',
    badge: null,
    img: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Modern%20LED%20desk%20lamp%20minimal%20design%20black%20product%20photo%20white%20background&image_size=square_hd'
  },
  {
    id: 9,
    name: 'Running Shoes Ultra Boost',
    category: 'Sports',
    price: 179.0,
    oldPrice: 219.0,
    rating: 4.7,
    reviews: 2341,
    stock: 'In Stock',
    badge: 'Trending',
    img: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Blue%20athletic%20running%20shoes%20side%20view%20product%20photo%20white%20background&image_size=square_hd'
  },
  {
    id: 10,
    name: 'Bestselling Novel Collection',
    category: 'Books',
    price: 49.99,
    oldPrice: 69.99,
    rating: 4.9,
    reviews: 3102,
    stock: 'In Stock',
    badge: null,
    img: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Stack%20of%20hardcover%20bestseller%20books%20product%20photo%20white%20background&image_size=square_hd'
  },
  {
    id: 11,
    name: 'Ceramic Coffee Mug Set (4)',
    category: 'Home & Kitchen',
    price: 39.0,
    oldPrice: 49.0,
    rating: 4.4,
    reviews: 968,
    stock: 'In Stock',
    badge: null,
    img: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Set%20of%20four%20minimal%20ceramic%20coffee%20mugs%20pastel%20colors%20product%20photo%20white%20background&image_size=square_hd'
  },
  {
    id: 12,
    name: 'Mechanical Gaming Keyboard',
    category: 'Electronics',
    price: 139.0,
    oldPrice: 169.0,
    rating: 4.8,
    reviews: 1576,
    stock: 'In Stock',
    badge: 'Gaming',
    img: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=RGB%20mechanical%20gaming%20keyboard%20top%20down%20product%20photo%20white%20background&image_size=square_hd'
  }
];

const badgeClass = (badge) => ({
  'Best Seller': 'badge--orange',
  'New': 'badge--green',
  'Hot Deal': 'badge--red',
  'Premium': 'badge--purple',
  'Eco': 'badge--emerald',
  'Trending': 'badge--pink',
  'Gaming': 'badge--blue'
}[badge] || '');

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <div className="stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: full }).map((_, i) => (
        <svg key={`f${i}`} viewBox="0 0 24 24" width="14" height="14" fill="#f59e0b"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
      ))}
      {half === 1 && <svg viewBox="0 0 24 24" width="14" height="14"><defs><linearGradient id="half"><stop offset="50%" stopColor="#f59e0b"/><stop offset="50%" stopColor="#e5e7eb"/></linearGradient></defs><path fill="url(#half)" d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>}
      {Array.from({ length: empty }).map((_, i) => (
        <svg key={`e${i}`} viewBox="0 0 24 24" width="14" height="14" fill="#e5e7eb"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
      ))}
    </div>
  );
}

const allCategories = ['All Items', ...new Set(products.map((p) => p.category))];

function Home() {
  const [filter, setFilter] = useState('All Items');
  const [sortBy, setSortBy] = useState('featured');
  const [cart, setCart] = useState({});
  const [buyNowId, setBuyNowId] = useState(null);

  const addToCart = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const buyNow = (id) => {
    setBuyNowId(id);
    addToCart(id);
    setTimeout(() => setBuyNowId(null), 2000);
  };

  const displayed = products
    .filter((p) => filter === 'All Items' || p.category === filter)
    .slice()
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <>
      <section className="shop-hero" id="top">
        <div className="container shop-hero-grid">
          <div className="shop-hero-content">
            <span className="badge">
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor"/></svg>
              Season Sale — Up to 50% OFF
            </span>
            <h1 className="shop-hero-title">
              Discover Premium
              <span className="gradient-text"> Products </span>
              For Every Need
            </h1>
            <p className="shop-hero-subtitle">
              Browse thousands of curated items across electronics, fashion, home goods, and more. Fast shipping, easy returns, and best price guaranteed.
            </p>
            <div className="shop-hero-actions">
              <a href="#products" className="btn btn-primary btn-lg">
                Shop Now
                <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
              <a href="#categories" className="btn btn-outline btn-lg">Browse Categories</a>
            </div>
            <div className="shop-hero-meta">
              <div><strong>10K+</strong><span>Products</span></div>
              <div><strong>150+</strong><span>Brands</span></div>
              <div><strong>4.9★</strong><span>Customer Rating</span></div>
            </div>
          </div>
          <div className="shop-hero-visual">
            <img
              src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Colorful%20shopping%20bags%20with%20laptop%20credit%20card%20glasses%20modern%20flat%20lay%20ecommerce%20hero&image_size=portrait_4_3"
              alt="Featured products"
              className="hero-img"
            />
            <div className="floating-card floating-card--left">
              <strong>Free Shipping</strong>
              <span>On orders over $50</span>
            </div>
            <div className="floating-card floating-card--right">
              <strong>{cartCount} items</strong>
              <span>in your cart</span>
            </div>
          </div>
        </div>
      </section>

      <section className="page" id="categories">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Categories</span>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Explore our wide range of categories to find exactly what you're looking for.</p>
          </div>
          <div className="categories-grid">
            {categories.map((c) => (
              <button
                key={c.name}
                onClick={() => setFilter(c.name)}
                className={`category-card ${c.color}${filter === c.name ? ' category-card--active' : ''}`}
              >
                <span className="category-icon">{c.icon}</span>
                <h3>{c.name}</h3>
                <p>{c.count} Items</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="page page--light" id="products">
        <div className="container">
          <div className="shop-toolbar">
            <div>
              <h2 className="shop-title">Featured Products</h2>
              <p className="muted-sm">Showing {displayed.length} of {products.length} products</p>
            </div>
            <div className="shop-toolbar-right">
              <label className="field field--inline">
                <span>Sort by</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </label>
            </div>
          </div>

          <div className="product-filters">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`chip${filter === cat ? ' chip--active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {displayed.length === 0 ? (
            <div className="empty-row no-filter"><div><strong>No products found.</strong><p>Try selecting a different category.</p></div></div>
          ) : (
            <div className="products-grid">
              {displayed.map((p) => (
                <article key={p.id} className="product-card">
                  <div className="product-media">
                    <img src={p.img} alt={p.name} loading="lazy" />
                    {p.badge && <span className={`product-badge ${badgeClass(p.badge)}`}>{p.badge}</span>}
                    <div className="product-wish" aria-label="Add to wishlist">
                      <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                  <div className="product-body">
                    <span className="product-category">{p.category}</span>
                    <h3 className="product-name">{p.name}</h3>
                    <div className="product-rating">
                      <Stars rating={p.rating} />
                      <span className="product-reviews">{p.rating} ({p.reviews.toLocaleString()})</span>
                    </div>
                    <div className="product-footer">
                      <div className="product-price">
                        <span className="price-current">${p.price.toFixed(2)}</span>
                        {p.oldPrice && <span className="price-old">${p.oldPrice.toFixed(2)}</span>}
                      </div>
                      <span className={`stock stock--${p.stock === 'In Stock' ? 'ok' : 'low'}`}>{p.stock}</span>
                    </div>
                    <div className="product-actions">
                      <button className="btn btn-outline add-cart" onClick={() => addToCart(p.id)}>
                        <svg viewBox="0 0 24 24" fill="none" width="15" height="15">
                          <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        {cart[p.id] ? `Cart (${cart[p.id]})` : 'Add'}
                      </button>
                      <button className={`btn buy-now${buyNowId === p.id ? ' buy-now--active' : ''}`} onClick={() => buyNow(p.id)}>
                        <svg viewBox="0 0 24 24" fill="none" width="15" height="15">
                          <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {buyNowId === p.id ? 'Checking Out…' : 'Buy Now'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="page" id="deals">
        <div className="container">
          <div className="promo-banner">
            <div>
              <span className="section-tag section-tag--light">Limited Time</span>
              <h2>Flash Deals — Extra 20% Off Electronics</h2>
              <p>Use code <strong>FLASH20</strong> at checkout. Offer ends this Sunday.</p>
            </div>
            <button className="btn btn-primary btn-lg">Shop Flash Deals</button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
