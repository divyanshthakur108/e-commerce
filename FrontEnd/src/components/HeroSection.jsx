import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import "../style/hero.css";

// Local & CDN Product Slide Items with Verified Local WebP Fallbacks
const RAW_SLIDES = [
  {
    id: "hero-1",
    name: "ROG Strix Scar 18 Gaming Laptop",
    subtitle: "Intel i9 14900HX • RTX 4090 • 240Hz Display",
    category: "Laptops & Gaming",
    price: 299990,
    originalPrice: 349900,
    discount: "14% OFF",
    rating: "4.9 ★★★★★ (1.2k)",
    badge: "🔥 HOT DEAL",
    glowColor: "rgba(249, 115, 22, 0.4)",
    image: "/products/laptop.webp",
    fallbackImage: "/products/placeholder.webp",
    specs: ["Intel i9 14900HX", "RTX 4090 16GB", "240Hz QHD+ Display"],
  },
  {
    id: "hero-2",
    name: "Sony WH-1000XM5 Headphones",
    subtitle: "30-Hour Battery • Auto NC • Hi-Res Wireless",
    category: "Audio",
    price: 29990,
    originalPrice: 34990,
    discount: "14% OFF",
    rating: "4.8 ★★★★★ (3.4k)",
    badge: "🎧 BESTSELLER",
    glowColor: "rgba(234, 88, 12, 0.4)",
    image: "/products/headphones.webp",
    fallbackImage: "/products/placeholder.webp",
    specs: ["30-Hour Battery", "Custom Auto NC", "Hi-Res Audio"],
  },
  {
    id: "hero-3",
    name: "Apple Watch Ultra 2 Titanium",
    subtitle: "49mm Titanium Case • 3000 Nits Brightness",
    category: "Smart Watches",
    price: 89900,
    originalPrice: 99900,
    discount: "10% OFF",
    rating: "4.9 ★★★★★ (2.8k)",
    badge: "⌚ LUXURY EDITION",
    glowColor: "rgba(251, 146, 60, 0.4)",
    image: "/products/watch.webp",
    fallbackImage: "/products/placeholder.webp",
    specs: ["49mm Titanium Case", "3000 Nits", "100m Water Resistant"],
  },
  {
    id: "hero-4",
    name: "Ergonomic Luxury Mesh Throne",
    subtitle: "Full Lumbar Support • Breathable Mesh • 4D Armrests",
    category: "Furniture",
    price: 124990,
    originalPrice: 149990,
    discount: "16% OFF",
    rating: "4.9 ★★★★★ (890)",
    badge: "🛋️ PREMIUM COMFORT",
    glowColor: "rgba(249, 115, 22, 0.35)",
    image: "/products/chair.webp",
    fallbackImage: "/products/placeholder.webp",
    specs: ["Full Lumbar Support", "Breathable Mesh", "4D Armrests"],
  },
  {
    id: "hero-5",
    name: "iPhone 15 Pro Max Titanium",
    subtitle: "A17 Pro Bionic • 5X Telephoto • Action Button",
    category: "Mobiles",
    price: 159900,
    originalPrice: 179900,
    discount: "11% OFF",
    rating: "5.0 ★★★★★ (5.1k)",
    badge: "📱 FLAGSHIP",
    glowColor: "rgba(234, 88, 12, 0.45)",
    image: "/products/phone.webp",
    fallbackImage: "/products/placeholder.webp",
    specs: ["A17 Pro Bionic Chip", "5X Telephoto Lens", "Action Button"],
  },
  {
    id: "hero-6",
    name: "Air Jordan 1 High OG Edition",
    subtitle: "Premium Full Leather • Air-Sole Cushioning",
    category: "Sneakers",
    price: 19995,
    originalPrice: 24995,
    discount: "20% OFF",
    rating: "4.9 ★★★★★ (4.2k)",
    badge: "👟 LIMITED DROP",
    glowColor: "rgba(249, 115, 22, 0.4)",
    image: "/products/shoes.webp",
    fallbackImage: "/products/placeholder.webp",
    specs: ["Premium Full Leather", "Air-Sole Cushioning", "High-Top Ankle"],
  },
];

// Verify every product has a valid image string before rendering
const SLIDES = RAW_SLIDES.filter(
  (slide) => slide && slide.id && slide.image && typeof slide.image === "string"
);

// Bottom Horizontal Categories
const TOP_CATEGORIES = [
  { name: "Electronics", icon: "🎧", count: "450+ Products", tag: "Tech" },
  { name: "Fashion", icon: "👔", count: "1,200+ Items", tag: "Apparel" },
  { name: "Furniture", icon: "🛋️", count: "320+ Items", tag: "Living" },
  { name: "Beauty", icon: "💄", count: "890+ Products", tag: "Care" },
  { name: "Gaming", icon: "🎮", count: "650+ Gear", tag: "Setup" },
  { name: "Mobiles", icon: "📱", count: "210+ Devices", tag: "Smart" },
  { name: "Home & Kitchen", icon: "🍳", count: "540+ Items", tag: "Home" },
];

// Live Notifications Data
const RECENT_PURCHASES = [
  { name: "Rahul S.", location: "Delhi", item: "ROG Strix Scar 18", time: "2 mins ago" },
  { name: "Ananya M.", location: "Mumbai", item: "iPhone 15 Pro Max", time: "5 mins ago" },
  { name: "Vikram K.", location: "Bangalore", item: "Sony WH-1000XM5", time: "8 mins ago" },
  { name: "Priya P.", location: "Hyderabad", item: "Air Jordan 1 High OG", time: "12 mins ago" },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [couponCopied, setCouponCopied] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeToastIndex, setActiveToastIndex] = useState(0);
  const [showToast, setShowToast] = useState(true);
  const [addedItemToast, setAddedItemToast] = useState(null);

  // Flash Sale Countdown Timer (Hours : Minutes : Seconds)
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 24, seconds: 16 });

  // Auto Slider Timer (Every 4s)
  useEffect(() => {
    if (isPaused || SLIDES.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Countdown Timer Interval
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cycle Recent Purchase Toast
  useEffect(() => {
    const toastTimer = setInterval(() => {
      setActiveToastIndex((prev) => (prev + 1) % RECENT_PURCHASES.length);
      setShowToast(true);
    }, 7000);
    return () => clearInterval(toastTimer);
  }, []);

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText("GET10");
    setCouponCopied(true);
    setTimeout(() => setCouponCopied(false), 2500);
  };

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.image,
        qty: 1,
      })
    );
    setAddedItemToast(product.name);
    setTimeout(() => setAddedItemToast(null), 3000);
  };

  // Handle broken images with fallback placeholder
  const handleImageError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/products/placeholder.webp";
  };

  const currentProduct = SLIDES[currentSlide] || SLIDES[0];

  return (
    <section className="luxury-hero-container">
      {/* Background Animated Layer */}
      <div className="hero-bg-layer">
        <div className="mesh-blob blob-1" />
        <div className="mesh-blob blob-2" />
        <div className="mesh-blob blob-3" />
        <div className="hero-light-beam" />
        <div className="floating-particles">
          <span className="particle p1" />
          <span className="particle p2" />
          <span className="particle p3" />
          <span className="particle p4" />
          <span className="particle p5" />
        </div>
      </div>

      {/* Main Split Content */}
      <div className="hero-content-wrapper">
        {/* LEFT COLUMN (45%) */}
        <div className="hero-left-col">
          {/* Animated Badge */}
          <div className="hero-sale-badge">
            <span className="badge-flame">🔥</span>
            <span className="badge-text">SUMMER SALE IS LIVE • UP TO 60% OFF</span>
            <span className="badge-pulse-dot" />
          </div>

          {/* Large Headline with Gradient Text */}
          <h1 className="hero-main-title">
            Discover <span className="gradient-text">Next Generation</span> Shopping Experience
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            Elevate your everyday with engineered tech, luxury aesthetics, and curated deals delivered directly to your doorstep with zero friction.
          </p>

          {/* Live Visitor & Flash Sale Bar */}
          <div className="hero-live-bar">
            <div className="live-visitors-pill">
              <span className="eye-icon">👁</span>
              <span className="live-text">
                <strong className="count-highlight">5,283</strong> shopping now
              </span>
              <span className="live-indicator-dot" />
            </div>

            <div className="flash-timer-pill">
              <span className="timer-label">Flash Sale:</span>
              <div className="timer-box">
                <span>{String(timeLeft.hours).padStart(2, "0")}</span>:
                <span>{String(timeLeft.minutes).padStart(2, "0")}</span>:
                <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="hero-btn-group">
            <button
              className="btn-hero-primary-glow"
              onClick={() => navigate("/shop")}
            >
              <span>Explore Collection</span>
              <svg className="btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <button
              className="btn-hero-secondary-glass"
              onClick={() => setShowVideoModal(true)}
            >
              <span className="play-icon-wrap">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span>Watch Products</span>
            </button>
          </div>

          {/* Trust Badges & Avatars */}
          <div className="hero-trust-section">
            <div className="avatar-stack">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Customer Avatar"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/products/placeholder.webp";
                }}
                className="stack-avatar"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt="Customer Avatar"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/products/placeholder.webp";
                }}
                className="stack-avatar"
              />
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                alt="Customer Avatar"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/products/placeholder.webp";
                }}
                className="stack-avatar"
              />
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                alt="Customer Avatar"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/products/placeholder.webp";
                }}
                className="stack-avatar"
              />
              <div className="avatar-count-badge">+20k</div>
            </div>

            <div className="trust-details">
              <div className="star-rating">★★★★★ <strong className="rating-num">4.9</strong>/5 Rating</div>
              <p className="trust-text">Join 20,000+ happy customers worldwide</p>
            </div>
          </div>

          {/* Quick Features List */}
          <div className="hero-features-row">
            <span className="feat-chip">⚡ Free Express Shipping</span>
            <span className="feat-chip">🔒 256-Bit SSL Checkout</span>
            <span className="feat-chip">🔄 30-Day Easy Returns</span>
          </div>
        </div>

        {/* RIGHT COLUMN (55%) - PREMIUM PRODUCT SLIDER */}
        {currentProduct && (
          <div
            className="hero-right-col"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Card Ambient Glow background */}
            <div
              className="slider-glow-backdrop"
              style={{ background: currentProduct.glowColor }}
            />

            {/* Floating Product Card */}
            <div className="floating-product-card">
              {/* Card Header & Badges */}
              <div className="card-top-bar">
                <span className="slide-badge">{currentProduct.badge}</span>
                <span className="slide-discount">{currentProduct.discount}</span>
              </div>

              {/* Product Image Showcase Container (Fixed 380px container, object-fit contain, zero CLS) */}
              <div className="card-image-wrap">
                <img
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  loading="lazy"
                  onError={handleImageError}
                  className="card-product-img"
                />
              </div>

              {/* Card Details */}
              <div className="card-info-wrap">
                <div className="category-meta">{currentProduct.category}</div>
                <h3 className="product-title">{currentProduct.name}</h3>
                <p className="product-subtitle">{currentProduct.subtitle}</p>

                {/* Specs Chips */}
                <div className="specs-chips-list">
                  {currentProduct.specs.map((spec, i) => (
                    <span key={i} className="spec-chip">
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Price & Action Row */}
                <div className="price-action-row">
                  <div className="price-box">
                    <span className="current-price">
                      ₹{currentProduct.price.toLocaleString("en-IN")}
                    </span>
                    <span className="original-price">
                      ₹{currentProduct.originalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <button
                    className="btn-card-add-cart"
                    onClick={() => handleAddToCart(currentProduct)}
                  >
                    <svg className="cart-add-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>

              {/* Slider Navigation Controls */}
              <div className="slider-controls-bar">
                <button
                  className="slider-arrow-btn"
                  onClick={() =>
                    setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))
                  }
                  aria-label="Previous Slide"
                >
                  ‹
                </button>

                <div className="slider-dots-group">
                  {SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      className={`slider-dot ${idx === currentSlide ? "active" : ""}`}
                      onClick={() => setCurrentSlide(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  className="slider-arrow-btn"
                  onClick={() =>
                    setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
                  }
                  aria-label="Next Slide"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM OF HERO - HORIZONTAL ANIMATED CATEGORY CARDS */}
      <div className="hero-categories-bar">
        <div className="categories-header-mini">
          <h3 className="mini-section-title">Explore Top Categories</h3>
          <span className="title-sub-tag">Handcrafted Selections</span>
        </div>

        <div className="categories-cards-grid">
          {TOP_CATEGORIES.map((cat, idx) => (
            <div
              key={idx}
              className="luxury-cat-card"
              onClick={() => navigate(`/shop?category=${encodeURIComponent(cat.name)}`)}
            >
              <div className="cat-card-glass">
                <span className="cat-card-icon">{cat.icon}</span>
                <div className="cat-card-text">
                  <h4 className="cat-card-title">{cat.name}</h4>
                  <span className="cat-card-count">{cat.count}</span>
                </div>
                <span className="cat-arrow">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FLOATING DISCOUNT COUPON PILL */}
      <div
        className={`floating-coupon-pill ${couponCopied ? "copied" : ""}`}
        onClick={handleCopyCoupon}
        title="Click to copy coupon code"
      >
        <span className="coupon-gift-icon">🎁</span>
        <span className="coupon-code-text">
          {couponCopied ? "COPIED! 10% OFF" : "CODE: GET10 (Tap to Copy)"}
        </span>
      </div>

      {/* RECENTLY PURCHASED TOAST POPUP */}
      {showToast && (
        <div className="recent-purchase-toast">
          <button
            className="toast-close-btn"
            onClick={() => setShowToast(false)}
          >
            ✕
          </button>
          <div className="toast-content">
            <span className="toast-shopping-icon">🛍️</span>
            <div>
              <p className="toast-msg">
                <strong>{RECENT_PURCHASES[activeToastIndex].name}</strong> from{" "}
                {RECENT_PURCHASES[activeToastIndex].location} purchased{" "}
                <span className="toast-item-highlight">
                  {RECENT_PURCHASES[activeToastIndex].item}
                </span>
              </p>
              <span className="toast-time">
                {RECENT_PURCHASES[activeToastIndex].time} • Verified Buyer
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ADDED TO CART NOTIFICATION TOAST */}
      {addedItemToast && (
        <div className="cart-added-toast">
          <span className="check-icon">✓</span>
          <span>Added <strong>{addedItemToast}</strong> to Cart!</span>
        </div>
      )}

      {/* VIDEO PREVIEW LIGHTBOX MODAL */}
      {showVideoModal && (
        <div className="video-lightbox-overlay" onClick={() => setShowVideoModal(false)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="video-modal-close"
              onClick={() => setShowVideoModal(false)}
            >
              ✕
            </button>
            <div className="video-placeholder-wrap">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0"
                title="ShopNest Product Showcase Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
