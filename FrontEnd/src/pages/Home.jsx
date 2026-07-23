import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import QuickViewModal from "../components/QuickViewModal";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { safeFetch } from "../services/api";
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
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [featData, bestData, newData, mainData] = await Promise.all([
          safeFetch("/api/products/featured").catch(() => []),
          safeFetch("/api/products/best-sellers").catch(() => []),
          safeFetch("/api/products/new-arrivals").catch(() => []),
          safeFetch("/api/products?limit=12").catch(() => ({ products: [] })),
        ]);

        const featList = Array.isArray(featData) ? featData : featData.products || [];
        const bestList = Array.isArray(bestData) ? bestData : bestData.products || [];
        const newList = Array.isArray(newData) ? newData : newData.products || [];
        const mainList = Array.isArray(mainData) ? mainData : mainData.products || [];

        setFeatured(featList);
        setBestSellers(bestList);
        setNewArrivals(newList);
        setAllProducts(mainList);
      } catch (error) {
        console.error("Error fetching homepage products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
  };

  const handleAddToCartQuick = (product, qty = 1) => {
    const finalPrice = product.discountPrice || product.price;
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: finalPrice,
        imageUrl: product.imageUrl,
        qty,
      })
    );
  };

  const displayProducts = featured.length > 0 ? featured : allProducts;

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-banner-v2">
        <div className="hero-content">
          <span className="hero-badge">🔥 SUMMER SALE IS LIVE • UP TO 60% OFF</span>
          <h1>Discover Next-Gen Products at ShopNest</h1>
          <p>
            Upgrade your lifestyle with modern tech, trending fashion, and premium home essentials delivered directly to your doorstep.
          </p>
          <div className="hero-btn-group">
            <button className="btn-hero-primary" onClick={() => navigate("/shop")}>
              Explore Full Shop →
            </button>
            <button className="btn-hero-secondary" onClick={() => navigate("/shop?category=Electronics")}>
              Browse Electronics
            </button>
          </div>
        </div>
      </div>

      {/* Category Grid Section */}
      <section className="category-section">
        <div className="section-header">
          <h2>Popular Categories</h2>
          <Link to="/shop" className="view-all-link">
            All Categories &rarr;
          </Link>
        </div>
        <div className="category-grid">
          {CATEGORIES.map((cat, idx) => (
            <div
              key={idx}
              className="category-card"
              onClick={() => navigate(`/shop?category=${encodeURIComponent(cat.name)}`)}
            >
              <span className="category-icon">{cat.icon}</span>
              <span className="category-name">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Loading Indicator */}
      {loading ? (
        <div className="home-loader-wrap" style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ color: "#f97316", fontSize: "1.2rem" }}>Loading Products...</p>
        </div>
      ) : (
        <>
          {/* Featured / Main Products Section */}
          {displayProducts.length > 0 && (
            <section className="home-product-section" style={{ marginTop: "40px" }}>
              <div className="section-header">
                <div>
                  <h2 style={{ color: "#ffffff" }}>
                    {featured.length > 0 ? "Featured Products" : "Trending Products"}
                  </h2>
                </div>
                <Link to="/shop" className="view-all-link">
                  View All &rarr;
                </Link>
              </div>
              <div className="product-grid">
                {displayProducts.map((prod) => (
                  <ProductCard
                    key={prod._id}
                    product={prod}
                    onQuickView={handleQuickView}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Best Sellers */}
          {bestSellers.length > 0 && (
            <section className="home-product-section" style={{ marginTop: "40px" }}>
              <div className="section-header">
                <div>
                  <h2 style={{ color: "#ffffff" }}>Best Sellers</h2>
                </div>
                <Link to="/shop" className="view-all-link">
                  View All &rarr;
                </Link>
              </div>
              <div className="product-grid">
                {bestSellers.map((prod) => (
                  <ProductCard
                    key={prod._id}
                    product={prod}
                    onQuickView={handleQuickView}
                  />
                ))}
              </div>
            </section>
          )}

          {/* New Arrivals */}
          {newArrivals.length > 0 && (
            <section className="home-product-section" style={{ marginTop: "40px" }}>
              <div className="section-header">
                <div>
                  <h2 style={{ color: "#ffffff" }}>New Arrivals</h2>
                </div>
                <Link to="/shop?sort=newest" className="view-all-link">
                  View All &rarr;
                </Link>
              </div>
              <div className="product-grid">
                {newArrivals.map((prod) => (
                  <ProductCard
                    key={prod._id}
                    product={prod}
                    onQuickView={handleQuickView}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={handleCloseQuickView}
          onAddToCart={handleAddToCartQuick}
        />
      )}
    </div>
  );
};

export default Home;