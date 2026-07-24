import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useSelector } from "react-redux";
import logo from "../assets/ShopNestLogo.png";
import "../style/navbar.css";

const CATEGORY_ITEMS = [
  { name: "Electronics", icon: "🎧", path: "/shop?category=Electronics" },
  { name: "Mobiles", icon: "📱", path: "/shop?category=Mobiles" },
  { name: "Laptops", icon: "💻", path: "/shop?category=Laptops" },
  { name: "Fashion", icon: "👔", path: "/shop?category=Fashion" },
  { name: "Shoes", icon: "👟", path: "/shop?category=Shoes" },
  { name: "Furniture", icon: "🛋️", path: "/shop?category=Furniture" },
  { name: "Beauty", icon: "💄", path: "/shop?category=Beauty" },
  { name: "Gaming", icon: "🎮", path: "/shop?category=Gaming" },
];

const Navbar = () => {
  const { user, logout, darkMode, toggleDarkMode } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dropdownRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Detect window scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-close menus on path change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setCategoryDropdownOpen(false);
    setSearchModalOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchModalOpen(false);
      setSearchQuery("");
    }
  };

  const totalCartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header className={`navbar-wrapper ${isScrolled ? "navbar-scrolled" : ""}`}>
      <nav className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="logo-box">
            <img src={logo} alt="ShopNest Logo" className="brand-logo-img" />
          </div>
          <span className="brand-name">
            ShopNest<span className="brand-dot">.</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="navbar-nav-links desktop-links">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/shop"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              Shop
            </NavLink>
          </li>

          {/* Categories Dropdown */}
          <li
            className="nav-dropdown-item"
            onMouseEnter={() => setCategoryDropdownOpen(true)}
            onMouseLeave={() => setCategoryDropdownOpen(false)}
          >
            <span className="nav-item cursor-pointer">
              Categories
              <svg className="dropdown-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>

            {categoryDropdownOpen && (
              <div className="glass-category-dropdown">
                {CATEGORY_ITEMS.map((cat, i) => (
                  <Link
                    key={i}
                    to={cat.path}
                    className="category-dropdown-link"
                    onClick={() => setCategoryDropdownOpen(false)}
                  >
                    <span className="cat-icon">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </li>

          <li>
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              Contact
            </NavLink>
          </li>
        </ul>

        {/* Right Section Actions & Auth */}
        <div className="navbar-actions" ref={dropdownRef}>
          {/* Search Icon */}
          <button
            className="nav-icon-btn"
            onClick={() => setSearchModalOpen(true)}
            aria-label="Search"
            title="Search Products"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Wishlist Icon */}
          <Link
            to={user ? "/profile?tab=wishlist" : "/login"}
            className="nav-icon-btn"
            aria-label="Wishlist"
            title="My Wishlist"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </Link>

          {/* Cart Icon & Counter Badge */}
          <Link to="/cart" className="nav-icon-btn cart-icon-btn" title="Shopping Cart">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {totalCartCount > 0 && (
              <span className="cart-badge-count">{totalCartCount}</span>
            )}
          </Link>

          {/* AUTH SECTION */}
          {user ? (
            /* Logged In: Profile Avatar & Premium Dropdown */
            <div className="user-profile-menu-container">
              <button
                className="user-avatar-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                aria-label="User Menu"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="avatar-img" />
                ) : (
                  <div className="avatar-fallback">{getInitials(user.name)}</div>
                )}
                <span className="user-online-dot" />
              </button>

              {/* Premium Glassmorphism Dropdown */}
              {profileDropdownOpen && (
                <div className="glass-profile-dropdown">
                  <div className="dropdown-user-header">
                    <div className="dropdown-avatar-wrap">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="dropdown-avatar-img" />
                      ) : (
                        <div className="dropdown-avatar-fallback">{getInitials(user.name)}</div>
                      )}
                    </div>
                    <div className="dropdown-user-meta">
                      <div className="dropdown-user-name">{user.name}</div>
                      <div className="dropdown-user-email">{user.email}</div>
                      <span className="dropdown-loyalty-badge">
                        🎁 {user.rewardBadge || "VIP Gold Member"}
                      </span>
                    </div>
                  </div>

                  <div className="dropdown-divider" />

                  <ul className="dropdown-items-list">
                    <li>
                      <Link to="/profile?tab=profile" className="dropdown-item">
                        <span className="item-icon">👤</span> My Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/profile?tab=orders" className="dropdown-item">
                        <span className="item-icon">📦</span> My Orders
                      </Link>
                    </li>
                    <li>
                      <Link to="/profile?tab=wishlist" className="dropdown-item">
                        <span className="item-icon">❤️</span> My Wishlist
                      </Link>
                    </li>
                    <li>
                      <Link to="/cart" className="dropdown-item">
                        <span className="item-icon">🛒</span> Cart ({totalCartCount})
                      </Link>
                    </li>
                    <li>
                      <Link to="/profile?tab=addresses" className="dropdown-item">
                        <span className="item-icon">📍</span> Saved Addresses
                      </Link>
                    </li>
                    <li>
                      <Link to="/profile?tab=settings" className="dropdown-item">
                        <span className="item-icon">💳</span> Payment Methods
                      </Link>
                    </li>
                    <li>
                      <div className="dropdown-item rewards-item">
                        <span className="item-icon">🎁</span> Rewards Points
                        <span className="rewards-badge-count">{user.loyaltyPoints || 250} PTS</span>
                      </div>
                    </li>
                    <li>
                      <Link to="/profile?tab=settings" className="dropdown-item">
                        <span className="item-icon">⚙</span> Account Settings
                      </Link>
                    </li>
                    {user.role === "admin" && (
                      <li>
                        <Link to="/admin" className="dropdown-item admin-dropdown-item">
                          <span className="item-icon">👑</span> Admin Dashboard
                        </Link>
                      </li>
                    )}
                  </ul>

                  <div className="dropdown-divider" />

                  {/* Dark Mode Toggle & Logout */}
                  <div className="dropdown-footer-actions">
                    <button className="theme-toggle-btn" onClick={toggleDarkMode}>
                      <span>{darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}</span>
                      <span className={`toggle-switch ${darkMode ? "active" : ""}`} />
                    </button>

                    <button className="dropdown-logout-btn" onClick={handleLogout}>
                      <span>🚪 Logout Account</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Not Logged In: Login & Register Buttons */
            <div className="auth-buttons-group">
              <Link to="/login" className="btn-glass-login">
                Login
              </Link>
              <Link to="/register" className="btn-gradient-register">
                Register
              </Link>
            </div>
          )}

          {/* Hamburger Toggle */}
          <button
            className={`hamburger-btn ${mobileMenuOpen ? "is-open" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            <span className="hamburger-line line-1" />
            <span className="hamburger-line line-2" />
            <span className="hamburger-line line-3" />
          </button>
        </div>

        {/* Mobile Backdrop & Drawer */}
        <div
          className={`mobile-backdrop ${mobileMenuOpen ? "active" : ""}`}
          onClick={() => setMobileMenuOpen(false)}
        />

        <div className={`mobile-drawer ${mobileMenuOpen ? "active" : ""}`}>
          <div className="mobile-drawer-header">
            <Link to="/" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
              <img src={logo} alt="ShopNest Logo" className="brand-logo-img" />
              <span className="brand-name">
                ShopNest<span className="brand-dot">.</span>
              </span>
            </Link>
            <button
              className="drawer-close-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="mobile-drawer-body">
            {user && (
              <div className="mobile-user-profile-card">
                <div className="avatar-wrap">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <div>{getInitials(user.name)}</div>
                  )}
                </div>
                <div>
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                </div>
              </div>
            )}

            <ul className="mobile-nav-links">
              <li>
                <NavLink to="/" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                  🏠 Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/shop" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                  🛍️ Shop Products
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                  ℹ️ About Us
                </NavLink>
              </li>
              <li>
                <NavLink to="/cart" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                  🛒 Cart ({totalCartCount})
                </NavLink>
              </li>
              {user ? (
                <>
                  <li>
                    <NavLink to="/profile?tab=profile" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                      👤 My Profile
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/profile?tab=orders" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                      📦 My Orders
                    </NavLink>
                  </li>
                  {user.role === "admin" && (
                    <li>
                      <NavLink to="/admin" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                        👑 Admin Dashboard
                      </NavLink>
                    </li>
                  )}
                </>
              ) : (
                <>
                  <li>
                    <NavLink to="/login" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                      🔑 Sign In / Login
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/register" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                      ✨ Create Account
                    </NavLink>
                  </li>
                </>
              )}
            </ul>

            <div className="mobile-drawer-footer">
              {!user ? (
                <div className="mobile-auth-group">
                  <Link to="/login" className="mobile-btn-login" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="mobile-btn-register" onClick={() => setMobileMenuOpen(false)}>
                    Register Account
                  </Link>
                </div>
              ) : (
                <button onClick={handleLogout} className="mobile-logout-btn">
                  Logout Account
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* SEARCH LIGHTBOX MODAL */}
      {searchModalOpen && (
        <div className="search-modal-overlay" onClick={() => setSearchModalOpen(false)}>
          <div className="search-modal-box" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSearchSubmit} className="search-input-form">
              <svg className="search-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products, laptops, sneakers, audio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="search-modal-input"
              />
              <button type="submit" className="search-modal-btn">
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;