import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import QuickViewModal from "../components/QuickViewModal";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import "../style/product.css";

const CATEGORIES = [
  { name: "Electronics", icon: "🎧" },
  { name: "Mobiles", icon: "📱" },
  { name: "Laptops", icon: "💻" },
  { name: "Fashion", icon: "👔" },
  { name: "Shoes", icon: "👟" },
  { name: "Furniture", icon: "🛋️" },
  { name: "Home & Kitchen", icon: "🍳" },
  { name: "Beauty", icon: "💄" },
  { name: "Grocery", icon: "🛒" },
  { name: "Sports", icon: "⚽" },
  { name: "Watches", icon: "⌚" },
  { name: "Books", icon: "📚" },
  { name: "Toys", icon: "🧸" },
  { name: "Gaming", icon: "🎮" },
  { name: "Accessories", icon: "🎒" },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [featRes, bestRes, newRes] = await Promise.all([
          fetch("/api/products/featured"),
          fetch("/api/products/best-sellers"),
          fetch("/api/products/new-arrivals"),
        ]);

        const featData = await featRes.json();
        const bestData = await bestRes.json();
        const newData = await newRes.json();

        setFeatured(Array.isArray(featData) ? featData : featData.products || []);
        setBestSellers(Array.isArray(bestData) ? bestData : bestData.products || []);
        setNewArrivals(Array.isArray(newData) ? newData : newData.products || []);
      } catch (error) {
        console.error("Error fetching homepage products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
    if (quickViewProduct) setQuickViewProduct(null);
  };

  return (
    <div className="home-container">
      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Hero Banner */}
      <div className="hero-banner-v2">
        <div className="hero-content">
          <span className="hero-badge">MEGA SEASON SALE • UP TO 60% OFF</span>
          <h1>Next-Gen Shopping Experience</h1>
          <p>
            Explore top brands in Electronics, Mobiles, Fashion & Gaming with instant
            express delivery & easy returns.
          </p>
          <div className="hero-btn-group">
            <button
              onClick={() => navigate("/shop")}
              className="btn btn-hero-primary"
            >
              Shop All Products ➔
            </button>
            <button
              onClick={() => navigate("/shop?category=Electronics")}
              className="btn btn-hero-secondary"
            >
              Explore Electronics
            </button>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="trust-features-bar">
        <div className="trust-item">
          <span className="trust-icon">🚚</span>
          <div>
            <h4>Free & Fast Delivery</h4>
            <p>On orders above ₹499</p>
          </div>
        </div>
        <div className="trust-item">
          <span className="trust-icon">🛡️</span>
          <div>
            <h4>100% Authentic</h4>
            <p>Direct from top official brands</p>
          </div>
        </div>
        <div className="trust-item">
          <span className="trust-icon">🔄</span>
          <div>
            <h4>7 Days Easy Return</h4>
            <p>Hassle-free instant refund</p>
          </div>
        </div>
        <div className="trust-item">
          <span className="trust-icon">💳</span>
          <div>
            <h4>Secure Payments</h4>
            <p>Razorpay & UPI Protected</p>
          </div>
        </div>
      </div>

      {/* Category Icons Bar */}
      <section className="category-section">
        <div className="section-header">
          <h2>Shop By Category</h2>
          <Link to="/shop" className="view-all-link">
            See All Categories ➔
          </Link>
        </div>

        <div className="category-grid">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="category-card"
              onClick={() => navigate(`/shop?category=${encodeURIComponent(cat.name)}`)}
            >
              <span className="category-icon">{cat.icon}</span>
              <span className="category-name">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="home-product-section">
        <div className="section-header">
          <h2>🔥 Featured Products</h2>
          <Link to="/shop" className="view-all-link">
            View All ➔
          </Link>
        </div>

        {loading ? (
          <div className="skeleton-grid">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="skeleton-card"></div>
            ))}
          </div>
        ) : (
          <div className="product-grid">
            {featured.slice(0, 8).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}
      </section>

      {/* Promo Banner */}
      <div className="promo-banner">
        <div className="promo-text">
          <h3>UP TO 50% OFF ON APPLE & SONY</h3>
          <p>Get the latest iPhones, MacBooks, and Noise-Cancelling Headphones.</p>
        </div>
        <button
          onClick={() => navigate("/shop?category=Mobiles")}
          className="btn btn-promo"
        >
          Grab Deal Now
        </button>
      </div>

      {/* Best Sellers */}
      <section className="home-product-section">
        <div className="section-header">
          <h2>⭐ Best Sellers</h2>
          <Link to="/shop" className="view-all-link">
            View All ➔
          </Link>
        </div>

        {loading ? (
          <div className="skeleton-grid">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="skeleton-card"></div>
            ))}
          </div>
        ) : (
          <div className="product-grid">
            {bestSellers.slice(0, 8).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}
      </section>

      {/* New Arrivals */}
      <section className="home-product-section">
        <div className="section-header">
          <h2>✨ New Arrivals</h2>
          <Link to="/shop" className="view-all-link">
            View All ➔
          </Link>
        </div>

        {loading ? (
          <div className="skeleton-grid">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="skeleton-card"></div>
            ))}
          </div>
        ) : (
          <div className="product-grid">
            {newArrivals.slice(0, 8).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;