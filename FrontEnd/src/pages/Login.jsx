import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { safeFetch } from "../services/api";
import "../style/auth.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const data = await safeFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (data && data.token) {
        login(data);
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        }
        navigate(data.role === "admin" ? "/admin" : "/");
      } else {
        setErrorMessage(data.message || "Invalid credentials provided.");
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider) => {
    alert(`${provider} Login integration active! Redirecting...`);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-split-wrapper">
        {/* LEFT SIDE (50%): Illustration & Showcase */}
        <div className="auth-left-showcase">
          <div className="showcase-glow-bg" />
          <div className="showcase-content">
            <div className="brand-pill">
              <span className="pill-dot" />
              <span>SHOPNEST LUXURY EXPERIENCE</span>
            </div>

            <h1 className="showcase-title">
              Welcome Back to <span className="gradient-text">ShopNest</span>
            </h1>

            <p className="showcase-subtitle">
              Continue your premium shopping journey. Access your wishlist, track orders, and unlock exclusive rewards.
            </p>

            {/* Floating Product Cards Illustration */}
            <div className="showcase-floating-card">
              <div className="floating-card-header">
                <span className="card-tag">🔥 VIP MEMBER DEALS</span>
                <span className="card-discount">UP TO 60% OFF</span>
              </div>
              <div className="floating-card-body">
                <div className="floating-item-icon">🎧</div>
                <div>
                  <div className="floating-item-title">Sony WH-1000XM5</div>
                  <div className="floating-item-price">₹29,990 <span className="old-price">₹34,990</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (50%): Glassmorphism Login Card */}
        <div className="auth-right-form">
          <div className="glass-auth-card">
            <div className="auth-card-header">
              <h2 className="auth-heading">Sign In</h2>
              <p className="auth-subheading">Enter your details to access your account</p>
            </div>

            {errorMessage && (
              <div className="auth-error-banner">
                <span>⚠️ {errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Email Field */}
              <div className="form-field-group">
                <label className="form-label">Email Address</label>
                <div className="input-input-wrap">
                  <svg className="field-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="auth-input-field"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="form-field-group">
                <label className="form-label">Password</label>
                <div className="input-input-wrap">
                  <svg className="field-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="auth-input-field"
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️" : "🙈"}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="form-options-row">
                <label className="remember-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>

                <Link to="/forgot-password" className="forgot-password-link">
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-auth-submit-glow"
              >
                {loading ? "Signing in..." : "Sign In to Account →"}
              </button>
            </form>

            {/* Divider */}
            <div className="auth-divider">
              <span>OR CONTINUE WITH</span>
            </div>

            {/* OAuth Social Login Buttons */}
            <div className="social-oauth-grid">
              <button
                type="button"
                className="oauth-btn"
                onClick={() => handleOAuthLogin("Google")}
              >
                <svg className="oauth-svg" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Google
              </button>

              <button
                type="button"
                className="oauth-btn"
                onClick={() => handleOAuthLogin("GitHub")}
              >
                <svg className="oauth-svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </button>
            </div>

            {/* Redirect link to Register */}
            <div className="auth-card-footer">
              <span>Don't have an account? </span>
              <Link to="/register" className="auth-switch-link">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
