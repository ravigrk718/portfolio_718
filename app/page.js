"use client";

import { useEffect, useMemo, useState } from "react";
import fallbackProducts from "../data/products.json";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const categories = ["All", "Football", "Basketball", "Running", "Fitness", "Apparel", "Tennis"];

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

function formatMoney(value) {
  return moneyFormatter.format(value);
}

export default function Home() {
  const [products, setProducts] = useState(fallbackProducts);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [checkoutStatus, setCheckoutStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(`${apiBaseUrl}/products`);

        if (!response.ok) {
          throw new Error("Products API request failed");
        }

        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        setProducts(fallbackProducts);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, products, searchTerm]);

  const cartDetails = useMemo(() => {
    const items = cart
      .map((cartItem) => {
        const product = products.find((item) => item.id === cartItem.id);

        if (!product) {
          return null;
        }

        return {
          ...product,
          quantity: cartItem.quantity,
          subtotal: product.price * cartItem.quantity
        };
      })
      .filter(Boolean);

    const subtotal = items.reduce((total, item) => total + item.subtotal, 0);
    const shipping = subtotal >= 150 || subtotal === 0 ? 0 : 9.99;
    const tax = subtotal * 0.0825;

    return {
      items,
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax,
      count: items.reduce((total, item) => total + item.quantity, 0)
    };
  }, [cart, products]);

  function addToCart(productId) {
    setCheckoutStatus("");
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === productId);

      if (!existingItem) {
        return [...currentCart, { id: productId, quantity: 1 }];
      }

      return currentCart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      );
    });
  }

  function updateQuantity(productId, nextQuantity) {
    setCheckoutStatus("");

    if (nextQuantity < 1) {
      setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId ? { ...item, quantity: nextQuantity } : item
      )
    );
  }

  async function checkout() {
    if (cart.length === 0) {
      setCheckoutStatus("Add an item before checkout.");
      return;
    }

    setCheckoutStatus("Creating checkout estimate...");

    try {
      const response = await fetch(`${apiBaseUrl}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Checkout failed");
      }

      setCheckoutStatus(
        `Order ${data.orderId} ready. Estimated total: ${formatMoney(data.total)}`
      );
    } catch (error) {
      setCheckoutStatus(error.message);
    }
  }

  return (
    <main>
      <header className="site-header">
        <nav className="nav">
          <a className="brand" href="#top" aria-label="SportSphere home">
            <span className="brand-mark">SS</span>
            <span>SportSphere</span>
          </a>
          <div className="nav-links">
            <a href="#products">Products</a>
            <a href="#deals">Deals</a>
            <a href="#cart">Cart ({cartDetails.count})</a>
          </div>
        </nav>

        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="eyebrow">Performance gear for every athlete</p>
            <h1>Shop premium sports essentials in one fast checkout.</h1>
            <p className="hero-text">
              Discover curated football, basketball, running, tennis, and fitness
              equipment with live stock from a Node.js backend.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#products">
                Shop gear
              </a>
              <a className="button secondary" href="#deals">
                View deals
              </a>
            </div>
          </div>

          <div className="hero-card" aria-label="Featured offer">
            <span>Weekend drop</span>
            <strong>Free shipping over $150</strong>
            <p>Build your training kit and save on every big order.</p>
          </div>
        </section>
      </header>

      <section className="stats-strip" aria-label="Store highlights">
        <div>
          <strong>6</strong>
          <span>Sport categories</span>
        </div>
        <div>
          <strong>4.7+</strong>
          <span>Average rating</span>
        </div>
        <div>
          <strong>24h</strong>
          <span>Fast dispatch</span>
        </div>
      </section>

      <section className="section" id="deals">
        <div className="section-heading">
          <p className="eyebrow">Featured collections</p>
          <h2>Gear up by sport</h2>
        </div>
        <div className="collection-grid">
          <article>
            <span>Football</span>
            <h3>Boots, kits, and match-day essentials</h3>
          </article>
          <article>
            <span>Running</span>
            <h3>Responsive shoes and breathable layers</h3>
          </article>
          <article>
            <span>Fitness</span>
            <h3>Home gym equipment for stronger sessions</h3>
          </article>
        </div>
      </section>

      <section className="section products-section" id="products">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop products</p>
            <h2>Top picks for your next game</h2>
          </div>
          <p className="api-status">
            {isLoading ? "Loading API products..." : "Products loaded"}
          </p>
        </div>

        <div className="filters" aria-label="Product filters">
          <label className="search-box">
            <span>Search</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search shoes, tennis, fitness..."
            />
          </label>

          <div className="category-list">
            {categories.map((category) => (
              <button
                className={activeCategory === category ? "active" : ""}
                key={category}
                onClick={() => setActiveCategory(category)}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <div
                className="product-art"
                style={{ "--accent": product.accent }}
                aria-hidden="true"
              >
                {product.category.slice(0, 2).toUpperCase()}
              </div>
              <div className="product-meta">
                <span className="badge">{product.badge}</span>
                <span>{product.category}</span>
              </div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="product-footer">
                <div>
                  <strong>{formatMoney(product.price)}</strong>
                  <span>{product.rating} rating</span>
                </div>
                <button type="button" onClick={() => addToCart(product.id)}>
                  Add to cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section cart-section" id="cart">
        <div className="cart-panel">
          <div>
            <p className="eyebrow">Your cart</p>
            <h2>Checkout summary</h2>
          </div>

          {cartDetails.items.length === 0 ? (
            <p className="empty-cart">Your cart is empty. Add gear to get started.</p>
          ) : (
            <div className="cart-items">
              {cartDetails.items.map((item) => (
                <article className="cart-item" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{formatMoney(item.price)} each</span>
                  </div>
                  <div className="quantity-controls">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="totals">
            <div>
              <span>Subtotal</span>
              <strong>{formatMoney(cartDetails.subtotal)}</strong>
            </div>
            <div>
              <span>Shipping</span>
              <strong>{cartDetails.shipping === 0 ? "Free" : formatMoney(cartDetails.shipping)}</strong>
            </div>
            <div>
              <span>Estimated tax</span>
              <strong>{formatMoney(cartDetails.tax)}</strong>
            </div>
            <div className="grand-total">
              <span>Total</span>
              <strong>{formatMoney(cartDetails.total)}</strong>
            </div>
          </div>

          <button className="checkout-button" type="button" onClick={checkout}>
            Checkout
          </button>
          {checkoutStatus && <p className="checkout-status">{checkoutStatus}</p>}
        </div>
      </section>
    </main>
  );
}
