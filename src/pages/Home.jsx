import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/login.jsx";
import Register from "../components/Register.jsx";
import DeliveryAddressForm from "../components/DeliveryAddressForm.jsx";
import { getStoredSession, setStoredSession } from "../auth.js";

const shopCategories = [
  { label: "All", value: "All Items" },
  { label: "Home & Kitchen", value: "Home & Kitchen" },
  { label: "Sports", value: "Sports" },
  { label: "Books", value: "Books" },
  { label: "Fashion", value: "Fashion" },
  { label: "Beauty", value: "Beauty" },
  { label: "Electronics", value: "Electronics" },
];

const matchesCategory = (productCategory, selectedCategory) => {
  if (selectedCategory === "All Items") return true;

  const category = productCategory.toLowerCase().replace(/[^a-z]/g, "");
  if (selectedCategory === "Home & Kitchen") {
    return category.includes("home") || category.includes("kitchen");
  }

  return category.includes(selectedCategory.toLowerCase());
};

const hasCompleteDeliveryAddress = (address) =>
  Boolean(
    address &&
      ["name", "state", "city", "phoneNumber", "pincode", "address", "houseNumber"]
        .every((field) => String(address[field] || "").trim())
  );

const normalizeProduct = (item) => {
  const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
  const image = String(item.image || "");
  const quantity = Number(item.quantity) || 0;
  const savedStatus = String(item.status || "").toLowerCase();

  const imageUrl =
    /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?/i.test(image)
      ? image.replace(
          /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?/i,
          apiBaseUrl
        )
      : /^(data:|blob:|https?:\/\/)/i.test(image)
      ? image
      : `${apiBaseUrl}${image.startsWith("/") ? image : `/${image}`}`;

  return {
    id: String(item._id || item.id || ""),
    name: String(item.name || ""),
    category: String(item.category || "Other"),
    price: Number(item.price) || 0,
    quantity,

    stock:
      quantity === 0
        ? "Out of Stock"
        : savedStatus.includes("low")
        ? "Low Stock"
        : "In Stock",

    image: imageUrl,

    rating: Number(item.rating) || 0,
    reviews: Number(item.reviews) || 0,
  };
};

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  return (
    <div
      className="stars"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: full }).map((_, index) => (
        <span key={`full-${index}`}>★</span>
      ))}

      {half === 1 && <span>★</span>}

      {Array.from({ length: empty }).map((_, index) => (
        <span key={`empty-${index}`}>☆</span>
      ))}
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [filter, setFilter] = useState("All Items");
  const [sortBy, setSortBy] = useState("featured");

  const [cart, setCart] = useState({});
  const [buyNowId, setBuyNowId] = useState(null);
  const [selectedBuyNowId, setSelectedBuyNowId] = useState(null);
  const [buyNowLoginOpen, setBuyNowLoginOpen] = useState(false);
  const [buyNowRegisterOpen, setBuyNowRegisterOpen] = useState(false);
  const [deliveryAddressUser, setDeliveryAddressUser] = useState(null);
  const [checkingAddressFor, setCheckingAddressFor] = useState(null);
  const [checkoutError, setCheckoutError] = useState("");

  /*
  =========================================
  GET PRODUCTS
  =========================================
  */

  useEffect(() => {
    let isCurrent = true;

    const fetchProducts = async () => {
      setIsLoading(true);
      setLoadError("");

      try {
        const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
        const response = await fetch(`${apiBaseUrl}/users/items`);

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            payload.message ||
              `Products request failed (${response.status})`
          );
        }

        if (!Array.isArray(payload.items)) {
          throw new Error(
            "The products API returned an invalid response."
          );
        }

        const normalizedProducts = payload.items.map(
          normalizeProduct
        );

        if (isCurrent) {
          setProducts(normalizedProducts);
        }
      } catch (error) {
        if (isCurrent) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Something went wrong while loading products."
          );
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isCurrent = false;
    };
  }, [reloadKey]);

  /*
  =========================================
  CATEGORIES
  =========================================
  */

  const productCategories = [
    ...new Set(
      products.map((product) => product.category)
    ),
  ];

  const allCategories = [
    "All Items",
    ...productCategories,
  ];

  /*
  =========================================
  CATEGORY COLORS
  =========================================
  */

  const categoryColors = [
    "blue",
    "pink",
    "orange",
    "purple",
    "green",
    "cyan",
  ];

  const categories = productCategories.map(
    (name, index) => ({
      name,

      icon: name
        .slice(0, 1)
        .toUpperCase(),

      color:
        categoryColors[
          index % categoryColors.length
        ],

      count: products.filter(
        (product) =>
          product.category === name
      ).length,
    })
  );

  /*
  =========================================
  CART
  =========================================
  */

  const addToCart = (id) => {
    setCart((currentCart) => ({
      ...currentCart,

      [id]:
        (currentCart[id] || 0) + 1,
    }));
  };

  const cartCount = Object.values(cart).reduce(
    (total, quantity) => total + quantity,
    0
  );

  /*
  =========================================
  BUY NOW
  =========================================
  */

  const buyNow = async (id) => {
    setSelectedBuyNowId(id);
    setCheckoutError("");
    const session = getStoredSession();

    if (session?.user?.role === "user") {
      if (hasCompleteDeliveryAddress(session.user.deliveryAddress)) {
        completeBuyNow(id, session.user.deliveryAddress);
        return;
      }

      await continueBuyNow(id, session);
      return;
    }

    setBuyNowLoginOpen(true);
  };

  const continueBuyNow = async (productId, session) => {
    if (!productId || !session?.token) {
      setBuyNowLoginOpen(true);
      return;
    }

    setCheckingAddressFor(productId);

    try {
      const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
      const response = await fetch(`${apiBaseUrl}/users/delivery-address/mine`, {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          payload.message || `Could not check saved address (${response.status}).`
        );
      }
      if (!payload.user || payload.user.role !== "user") {
        throw new Error("The saved-address API returned an invalid user.");
      }

      const refreshedSession = { ...session, user: payload.user };
      setStoredSession(refreshedSession);

      if (hasCompleteDeliveryAddress(payload.address)) {
        completeBuyNow(productId, payload.address);
      } else {
        setDeliveryAddressUser(payload.user);
      }
    } catch (error) {
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Could not check your saved delivery address."
      );
    } finally {
      setCheckingAddressFor(null);
    }
  };

  const handleBuyNowSignIn = (user) => {
    if (user?.role === "user") {
      const session = getStoredSession();
      void continueBuyNow(selectedBuyNowId, {
        ...session,
        user,
      });
    }
  };

  const completeBuyNow = (productId, address) => {
    if (!productId || !hasCompleteDeliveryAddress(address)) return;

    const product = products.find((item) => item.id === productId);
    if (!product) return;

    navigate("/order-summary", {
      state: {
        product,
        address,
      },
    });
    setSelectedBuyNowId(null);
    setDeliveryAddressUser(null);
  };

  /*
  =========================================
  FILTER + SORT
  =========================================
  */

  const displayed = products
    .filter(
      (product) =>
        matchesCategory(product.category, filter)
    )
    .slice()
    .sort((a, b) => {
      if (sortBy === "price-asc") {
        return a.price - b.price;
      }

      if (sortBy === "price-desc") {
        return b.price - a.price;
      }

      if (sortBy === "rating") {
        return b.rating - a.rating;
      }

      return 0;
    });

  /*
  =========================================
  RENDER
  =========================================
  */

  return (
    <>
      <main className="home-page">

      <nav className="shop-category-strip" aria-label="Shop by category">
        <div className="shop-category-box">
          {shopCategories.map((category) => (
            <button
              key={category.value}
              type="button"
              className={`shop-category-button ${
                filter === category.value ? "active" : ""
              }`}
              aria-pressed={filter === category.value}
              onClick={() => setFilter(category.value)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </nav>

      <section id="products" className="home-products-section">
      {isLoading && (
        <div className="products-loading">
          Loading products...
        </div>
      )}

      {checkoutError && (
        <div className="products-error" role="alert">
          <p>{checkoutError}</p>
          <button type="button" onClick={() => setCheckoutError("")}>
            Dismiss
          </button>
        </div>
      )}

      {!isLoading && loadError && (
        <div className="products-error">
          <p>{loadError}</p>

          <button
            type="button"
            onClick={() =>
              setReloadKey(
                (key) => key + 1
              )
            }
          >
            Try Again
          </button>
        </div>
      )}

      {!isLoading &&
        !loadError &&
        displayed.length === 0 && (
          <div className="products-empty">
            No products found.
          </div>
        )}

      {!isLoading &&
        !loadError &&
        displayed.length > 0 && (
          <div className="products-grid">

            {displayed.map((product) => (
              <article
                className="product-card"
                key={product.id}
              >

                <div className="product-image">

                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                    />
                  ) : (
                    <div>
                      No Image
                    </div>
                  )}

                </div>

                <div className="product-content">

                  <span className="product-category">
                    {product.category}
                  </span>

                  <h3>
                    {product.name}
                  </h3>

                  <Stars
                    rating={product.rating}
                  />

                  <p>
                    {product.reviews} reviews
                  </p>

                  <strong>
                    ₹
                    {product.price.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                  <p>
                    {product.stock}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      addToCart(product.id)
                    }
                    disabled={
                      product.quantity === 0
                    }
                  >
                    Add to Cart
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      buyNow(product.id)
                    }
                    disabled={
                      product.quantity === 0
                    }
                  >
                    {buyNowId === product.id
                      ? "Added!"
                      : checkingAddressFor === product.id
                      ? "Checking address…"
                      : "Buy Now"}
                  </button>

                </div>

              </article>
            ))}

          </div>
        )}
      </section>

      </main>
      {buyNowLoginOpen && (
        <Login
          onClose={(authenticated) => {
            setBuyNowLoginOpen(false);
            if (!authenticated) setSelectedBuyNowId(null);
          }}
          onSuccess={handleBuyNowSignIn}
          onSwitchToRegister={() => {
            setBuyNowLoginOpen(false);
            setBuyNowRegisterOpen(true);
          }}
        />
      )}
      {buyNowRegisterOpen && (
        <Register
          onClose={() => setBuyNowRegisterOpen(false)}
          onSwitchToLogin={() => {
            setBuyNowRegisterOpen(false);
            setBuyNowLoginOpen(true);
          }}
          onSuccess={handleBuyNowSignIn}
        />
      )}
      {deliveryAddressUser && (
        <DeliveryAddressForm
          initialAddress={
            deliveryAddressUser.deliveryAddress || {
              name: deliveryAddressUser.name || "",
            }
          }
          onCancel={() => {
            setDeliveryAddressUser(null);
            setSelectedBuyNowId(null);
          }}
          onSaved={(address) => completeBuyNow(selectedBuyNowId, address)}
        />
      )}
    </>
  );
}

export default Home;