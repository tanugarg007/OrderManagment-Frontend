import {
  ArrowRight,
  Heart,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function Products() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

// GET PRODUCTS API
useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/users/products",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch products");
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);

  // CREATE CATEGORIES FROM PRODUCTS
  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ];
  }, [products]);

  // FILTER PRODUCTS
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") {
      return products;
    }

    return products.filter(
      (product) => product.category === selectedCategory
    );
  }, [products, selectedCategory]);

  return (
    <main className="products-premium-page">
      {/* HERO SECTION */}
      <section className="products-hero">
        <div className="products-hero__inner">
          <div className="products-hero__content">
            <span className="eyebrow">
              <Sparkles size={14} />
              Premium collection
            </span>

            <h1>Curated essentials for elevated living.</h1>

            <p>
              Discover thoughtfully designed products that blend comfort,
              craftsmanship, and everyday practicality.
            </p>

            <div className="products-hero__actions">
              <button
                className="premium-btn premium-btn--primary"
                type="button"
              >
                Shop now
                <ArrowRight size={16} />
              </button>

              <button
                className="premium-btn premium-btn--secondary"
                type="button"
              >
                <Search size={16} />
                Explore deals
              </button>
            </div>

            <div className="products-hero__highlights">
              <div>
                <strong>4.9/5</strong>
                <span>Customer rating</span>
              </div>

              <div>
                <strong>24H</strong>
                <span>Dispatch</span>
              </div>

              <div>
                <strong>1200+</strong>
                <span>Curated picks</span>
              </div>
            </div>
          </div>

          <div className="products-hero__panel">
            <div className="hero-badge">Trending now</div>

            <div className="hero-panel__card">
              <img
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80"
                alt="Premium collection showcase"
              />
            </div>

            <div className="hero-panel__meta">
              <div>
                <span>Signature drop</span>
                <strong>Urban Luxe</strong>
              </div>

              <button
                type="button"
                aria-label="Add to wishlist"
              >
                <Heart size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="products-shell">
        <div className="products-toolbar">
          <div>
            <span className="toolbar-kicker">Shop</span>
            <h2>Featured products</h2>
          </div>

          <div className="products-toolbar__right">
            <button type="button" className="filter-button">
              <SlidersHorizontal size={15} />
              Filters
            </button>
          </div>
        </div>

        {/* CATEGORY FILTER */}
        <div
          className="products-filter-chips"
          aria-label="Product categories"
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                selectedCategory === category
                  ? "chip chip--active"
                  : "chip"
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="products-message">
            <p>Loading products...</p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="products-message">
            <p>{error}</p>
          </div>
        )}

        {/* NO PRODUCTS */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="products-message">
            <p>No products found.</p>
          </div>
        )}

        {/* PRODUCT GRID */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="products-premium-grid">
            {filteredProducts.map((product) => (
              <article
                className="product-card-premium"
                key={product._id}
              >
                {/* IMAGE */}
                <div className="product-card-premium__media">
                  <button
                    type="button"
                    className="product-card-premium__wishlist"
                    aria-label={`Save ${product.name}`}
                  >
                    <Heart size={15} />
                  </button>

                  <img
                    src={`http://localhost:5000${product.imageUrl}`}
                    alt={product.name}
                  />
                </div>

                {/* PRODUCT DETAILS */}
                <div className="product-card-premium__body">
                  <div className="product-card-premium__meta">
                    <span>
                      {product.category || "Product"}
                    </span>
                  </div>

                  <h3>{product.name}</h3>

                  <p className="product-description">
                    {product.description}
                  </p>

                  <div className="product-card-premium__footer">
                    <strong>
                      ₹
                      {Number(product.price).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                    <button type="button">
                      Add to cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Products;