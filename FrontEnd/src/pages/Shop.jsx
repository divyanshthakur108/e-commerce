import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import QuickViewModal from "../components/QuickViewModal";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import "../style/product.css";

const CATEGORIES = [
  "All",
  "Electronics",
  "Mobiles",
  "Laptops",
  "Fashion",
  "Shoes",
  "Furniture",
  "Home & Kitchen",
  "Beauty",
  "Grocery",
  "Sports",
  "Watches",
  "Books",
  "Toys",
  "Gaming",
  "Accessories",
];

const BRANDS = [
  "All",
  "Apple",
  "Samsung",
  "Sony",
  "Bose",
  "Nike",
  "Adidas",
  "ASUS",
  "Dell",
  "Dyson",
  "Philips",
  "Ray-Ban",
  "Puma",
  "Fossil",
  "LEGO",
  "Bowflex",
];

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Read URL query params
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const initialCategory = queryParams.get("category") || "All";
  const initialSearch = queryParams.get("search") || "";

  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync from URL changes
  useEffect(() => {
    const catFromUrl = queryParams.get("category") || "All";
    const searchFromUrl = queryParams.get("search") || "";
    setSelectedCategory(catFromUrl);
    setSearch(searchFromUrl);
  }, [queryParams]);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = `/api/products?page=${page}&limit=12&sort=${sort}`;

        if (selectedCategory && selectedCategory !== "All") {
          url += `&category=${encodeURIComponent(selectedCategory)}`;
        }
        if (selectedBrand && selectedBrand !== "All") {
          url += `&brand=${encodeURIComponent(selectedBrand)}`;
        }
        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }
        if (minPrice) {
          url += `&minPrice=${minPrice}`;
        }
        if (maxPrice) {
          url += `&maxPrice=${maxPrice}`;
        }
        if (minRating > 0) {
          url += `&rating=${minRating}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if (Array.isArray(data)) {
          setProducts(data);
          setTotalProducts(data.length);
          setTotalPages(1);
        } else {
          setProducts(data.products || []);
          setTotalProducts(data.totalProducts || 0);
          setTotalPages(data.pages || 1);
        }
      } catch (error) {
        console.error("Error fetching shop products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedBrand, search, minPrice, maxPrice, minRating, sort, page]);

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSelectedBrand("All");
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating(0);
    setSort("newest");
    setPage(1);
    navigate("/shop");
  };

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
    if (quickViewProduct) setQuickViewProduct(null);
  };

  return (
    <div className="shop-page-wrapper">
      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Header Bar */}
      <div className="shop-header">
        <div>
          <h1>Explore Store Catalog</h1>
          <p className="shop-subheading">
            Showing {totalProducts} products {selectedCategory !== "All" && `in "${selectedCategory}"`}
          </p>
        </div>

        <button
          className="mobile-filter-toggle-btn"
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
        >
          ⚙️ Filters & Sort
        </button>
      </div>

      <div className="shop-layout">
        {/* Left Sidebar Filters */}
        <aside className={`shop-sidebar ${mobileFilterOpen ? "mobile-open" : ""}`}>
          <div className="sidebar-header">
            <h3>Filters</h3>
            <button className="btn-reset-filters" onClick={handleResetFilters}>
              Reset All
            </button>
          </div>

          {/* Search Box */}
          <div className="filter-group">
            <label className="filter-label">Search Products</label>
            <input
              type="text"
              placeholder="Search by keyword, brand..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="search-input"
            />
          </div>

          {/* Categories Filter */}
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <div className="filter-list">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`filter-chip ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setPage(1);
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="filter-group">
            <label className="filter-label">Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setPage(1);
              }}
              className="filter-select"
            >
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="filter-group">
            <label className="filter-label">Price Range (₹)</label>
            <div className="price-inputs-row">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setPage(1);
                }}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div className="filter-group">
            <label className="filter-label">Minimum Rating</label>
            <div className="rating-filter-options">
              {[4, 3, 2].map((r) => (
                <button
                  key={r}
                  className={`rating-filter-btn ${minRating === r ? "active" : ""}`}
                  onClick={() => {
                    setMinRating(minRating === r ? 0 : r);
                    setPage(1);
                  }}
                >
                  {"★".repeat(r)} & Above
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Product Grid Container */}
        <main className="shop-main-content">
          {/* Top Sort Bar */}
          <div className="shop-sort-bar">
            <span className="results-count">
              Showing <strong>{products.length}</strong> of <strong>{totalProducts}</strong> Items
            </span>

            <div className="sort-dropdown-wrap">
              <label>Sort By:</label>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="sort-select"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Grid or Loader */}
          {loading ? (
            <div className="skeleton-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="skeleton-card"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="empty-shop-state">
              <span className="empty-icon">🔍</span>
              <h3>No matching products found</h3>
              <p>Try adjusting your search criteria or resetting filters.</p>
              <button className="btn btn-primary" onClick={handleResetFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-bar">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="btn btn-page-nav"
              >
                ◀ Previous
              </button>

              <span className="page-indicator">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="btn btn-page-nav"
              >
                Next ▶
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
