import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { safeFetch } from "../services/api";
import "../style/auth.css";

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    avatar: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("Please accept the Terms and Conditions to proceed.");
      return;
    }

    try {
      setLoading(true);
      const data = await safeFetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          avatar: formData.avatar,
        }),
      });

      if (data && (data.token || data.user)) {
        login(data.user ? { ...data.user, token: data.token } : data);
        navigate("/");
      } else {
        setErrorMessage(data.message || "Registration failed.");
      }
    } catch (err) {
      setErrorMessage(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-split-wrapper">
        {/* LEFT SIDE: Brand Showcase */}
        <div className="auth-left-showcase">
          <div className="showcase-glow-bg" />
          <div className="showcase-content">
            <div className="brand-pill">
              <span className="pill-dot" />
              <span>JOIN SHOPNEST COMMUNITY</span>
            </div>

            <h1 className="showcase-title">
              Start Your <span className="gradient-text">Shopping Journey</span> Today
            </h1>

            <p className="showcase-subtitle">
              Create an account to unlock 250 Loyalty Reward Points, express 1-click checkout, and VIP access to flash sales.
            </p>

            <div className="showcase-features-list">
              <div className="feat-item">🎁 250 Loyalty Welcome Points</div>
              <div className="feat-item">⚡ 1-Click Fast Express Checkout</div>
              <div className="feat-item">🔒 Encrypted 256-Bit Security</div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Register Card */}
        <div className="auth-right-form">
          <div className="glass-auth-card register-card">
            <div className="auth-card-header">
              <h2 className="auth-heading">Create Account</h2>
              <p className="auth-subheading">Fill in your information to join ShopNest</p>
            </div>

            {errorMessage && (
              <div className="auth-error-banner">
                <span>⚠️ {errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Profile Avatar Upload */}
              <div className="avatar-upload-section">
                <div className="avatar-preview-box">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar Preview" />
                  ) : (
                    <div className="avatar-placeholder-text">📷 Upload</div>
                  )}
                </div>
                <label className="btn-upload-avatar">
                  <span>Choose Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: "none" }}
                  />
                </label>
              </div>

              {/* Grid 2-Col for Inputs */}
              <div className="form-fields-grid">
                {/* Full Name */}
                <div className="form-field-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Divyansh Thakur"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="auth-input-field"
                  />
                </div>

                {/* Username */}
                <div className="form-field-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="divyansh108"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="auth-input-field"
                  />
                </div>

                {/* Email */}
                <div className="form-field-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="auth-input-field"
                  />
                </div>

                {/* Phone */}
                <div className="form-field-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="auth-input-field"
                  />
                </div>

                {/* Password */}
                <div className="form-field-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="auth-input-field"
                  />
                </div>

                {/* Confirm Password */}
                <div className="form-field-group">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="auth-input-field"
                  />
                </div>
              </div>

              {/* Terms & Conditions Checkbox */}
              <div className="terms-checkbox-row">
                <label className="remember-checkbox-label">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  <span>
                    I agree to the <Link to="/disclaimer" className="terms-link">Terms of Service</Link> & <Link to="/return" className="terms-link">Privacy Policy</Link>
                  </span>
                </label>
              </div>

              {/* Submit Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-auth-submit-glow"
              >
                {loading ? "Creating Account..." : "Create Free Account →"}
              </button>
            </form>

            <div className="auth-card-footer" style={{ marginTop: "20px" }}>
              <span>Already have an account? </span>
              <Link to="/login" className="auth-switch-link">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
