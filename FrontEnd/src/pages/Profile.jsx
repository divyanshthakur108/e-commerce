import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { safeFetch } from "../services/api";
import "../style/auth.css";

const Profile = () => {
  const { user, updateUser, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Read active tab from URL query param (e.g. ?tab=orders)
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab") || "profile";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Form states for profile editing
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "",
  });

  // Form states for password change
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Sync tab from URL
  useEffect(() => {
    const tabParam = new URLSearchParams(location.search).get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // Sync user state to form
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  // Fetch My Orders when orders tab is selected
  useEffect(() => {
    if (activeTab === "orders" && user) {
      fetchMyOrders();
    }
  }, [activeTab, user]);

  const fetchMyOrders = async () => {
    try {
      setLoadingOrders(true);
      const data = await safeFetch("/api/orders/myorders");
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdateMessage("");
    setErrorMessage("");

    try {
      const updated = await safeFetch("/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });

      if (updated && updated.name) {
        updateUser(updated);
        setUpdateMessage("Profile updated successfully!");
      } else {
        setErrorMessage(updated.message || "Failed to update profile");
      }
    } catch (err) {
      setErrorMessage(err.message || "Error updating profile");
    }
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setProfileForm((prev) => ({ ...prev, avatar: "" }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setUpdateMessage("");
    setErrorMessage("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMessage("New passwords do not match!");
      return;
    }

    try {
      const res = await safeFetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (res && res.message) {
        setUpdateMessage("Password changed successfully!");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setErrorMessage(res.message || "Failed to change password");
      }
    } catch (err) {
      setErrorMessage(err.message || "Error changing password");
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2 style={{ color: "#ffffff", marginBottom: "16px" }}>Please log in to view your profile</h2>
        <button className="btn-auth-submit-glow" style={{ maxWidth: "200px" }} onClick={() => navigate("/login")}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="profile-page-container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 0" }}>
      {/* Large Luxury Cover Banner */}
      <div
        style={{
          height: "200px",
          borderRadius: "24px",
          background: "linear-gradient(135deg, #18181b 0%, #09090b 60%, rgba(249, 115, 22, 0.3) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          position: "relative",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
        }}
      />

      {/* User Header Profile Card */}
      <div
        style={{
          marginTop: "-60px",
          padding: "0 30px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: "20px" }}>
          {/* Avatar Container */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                border: "4px solid #f97316",
                overflow: "hidden",
                background: "#18181b",
                boxShadow: "0 8px 30px rgba(249, 115, 22, 0.5)",
              }}
            >
              {profileForm.avatar || user.avatar ? (
                <img
                  src={profileForm.avatar || user.avatar}
                  alt={user.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2.5rem",
                    fontWeight: "800",
                    color: "#ffffff",
                    background: "linear-gradient(135deg, #f97316, #ea580c)",
                  }}
                >
                  {getInitials(user.name)}
                </div>
              )}
            </div>
            <label
              style={{
                position: "absolute",
                bottom: "4px",
                right: "4px",
                background: "#f97316",
                color: "#ffffff",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
              }}
              title="Upload Avatar"
            >
              📷
              <input type="file" accept="image/*" onChange={handleAvatarFileChange} style={{ display: "none" }} />
            </label>
          </div>

          <div>
            <h1 style={{ color: "#ffffff", fontSize: "2rem", fontWeight: "800", margin: "0 0 4px 0" }}>
              {user.name}
            </h1>
            <p style={{ color: "#a1a1aa", fontSize: "0.95rem", margin: "0 0 8px 0" }}>
              @{user.username || user.name.toLowerCase().replace(/\s+/g, "")} • {user.email}
            </p>
            <span
              style={{
                background: "rgba(249, 115, 22, 0.15)",
                color: "#fb923c",
                border: "1px solid rgba(249, 115, 22, 0.3)",
                padding: "4px 12px",
                borderRadius: "8px",
                fontSize: "0.8rem",
                fontWeight: "700",
              }}
            >
              🎁 {user.rewardBadge || "VIP Gold Member"} ({user.loyaltyPoints || 250} PTS)
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          style={{
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#f87171",
            padding: "10px 20px",
            borderRadius: "12px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Logout Account
        </button>
      </div>

      {/* Statistics Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "rgba(18, 18, 22, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            padding: "20px",
            borderRadius: "16px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#f97316" }}>
            {orders.length > 0 ? orders.length : 12}
          </div>
          <div style={{ color: "#a1a1aa", fontSize: "0.85rem" }}>Total Orders</div>
        </div>

        <div
          style={{
            background: "rgba(18, 18, 22, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            padding: "20px",
            borderRadius: "16px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#ffffff" }}>
            5
          </div>
          <div style={{ color: "#a1a1aa", fontSize: "0.85rem" }}>Wishlist Items</div>
        </div>

        <div
          style={{
            background: "rgba(18, 18, 22, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            padding: "20px",
            borderRadius: "16px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#facc15" }}>
            4.9 ★
          </div>
          <div style={{ color: "#a1a1aa", fontSize: "0.85rem" }}>Customer Reviews</div>
        </div>

        <div
          style={{
            background: "rgba(18, 18, 22, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            padding: "20px",
            borderRadius: "16px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#f97316" }}>
            {user.loyaltyPoints || 250}
          </div>
          <div style={{ color: "#a1a1aa", fontSize: "0.85rem" }}>Reward Points</div>
        </div>
      </div>

      {/* Tabs Row */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          marginBottom: "30px",
          paddingBottom: "10px",
        }}
      >
        {[
          { id: "profile", label: "👤 Profile Settings" },
          { id: "orders", label: "📦 My Orders" },
          { id: "addresses", label: "📍 Saved Addresses" },
          { id: "wishlist", label: "❤️ Wishlist" },
          { id: "settings", label: "⚙ Account Security" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? "#f97316" : "rgba(255, 255, 255, 0.04)",
              color: "#ffffff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "12px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Banners for feedback */}
      {updateMessage && (
        <div style={{ background: "rgba(34, 197, 94, 0.15)", border: "1px solid #22c55e", color: "#4ade80", padding: "12px 18px", borderRadius: "12px", marginBottom: "20px" }}>
          ✓ {updateMessage}
        </div>
      )}
      {errorMessage && (
        <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid #ef4444", color: "#f87171", padding: "12px 18px", borderRadius: "12px", marginBottom: "20px" }}>
          ⚠️ {errorMessage}
        </div>
      )}

      {/* TAB CONTENT: PROFILE */}
      {activeTab === "profile" && (
        <div className="glass-auth-card" style={{ maxWidth: "100%" }}>
          <h3 style={{ color: "#ffffff", fontSize: "1.3rem", marginBottom: "20px" }}>Edit Profile Details</h3>
          <form onSubmit={handleProfileSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="form-field-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="auth-input-field"
              />
            </div>

            <div className="form-field-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                value={profileForm.username}
                onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                className="auth-input-field"
              />
            </div>

            <div className="form-field-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="auth-input-field"
              />
            </div>

            <div className="form-field-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="auth-input-field"
              />
            </div>

            <div style={{ gridColumn: "span 2", display: "flex", gap: "10px" }}>
              <button type="submit" className="btn-auth-submit-glow" style={{ width: "auto", padding: "12px 30px" }}>
                Save Changes
              </button>
              {profileForm.avatar && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  style={{
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "#f87171",
                    padding: "12px 20px",
                    borderRadius: "12px",
                    cursor: "pointer",
                  }}
                >
                  Remove Avatar
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* TAB CONTENT: ORDERS */}
      {activeTab === "orders" && (
        <div className="glass-auth-card" style={{ maxWidth: "100%" }}>
          <h3 style={{ color: "#ffffff", fontSize: "1.3rem", marginBottom: "20px" }}>My Order History</h3>
          {loadingOrders ? (
            <p style={{ color: "#f97316" }}>Loading orders...</p>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p style={{ color: "#a1a1aa", fontSize: "1.1rem" }}>No orders placed yet!</p>
              <button className="btn-auth-submit-glow" style={{ width: "auto", marginTop: "14px" }} onClick={() => navigate("/shop")}>
                Explore Products Now
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {orders.map((ord) => (
                <div
                  key={ord._id}
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "16px",
                    padding: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "14px",
                  }}
                >
                  <div>
                    <div style={{ color: "#ffffff", fontWeight: "700", fontSize: "1.05rem" }}>
                      Order #{ord._id.substring(0, 10)}
                    </div>
                    <div style={{ color: "#71717a", fontSize: "0.82rem" }}>
                      Placed on {new Date(ord.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>

                  <span
                    style={{
                      background: ord.status === "Delivered" ? "rgba(34, 197, 94, 0.2)" : "rgba(249, 115, 22, 0.2)",
                      color: ord.status === "Delivered" ? "#4ade80" : "#fb923c",
                      padding: "4px 12px",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      fontWeight: "700",
                    }}
                  >
                    ● {ord.status || "Pending Processing"}
                  </span>

                  <div style={{ color: "#f97316", fontWeight: "800", fontSize: "1.2rem" }}>
                    ₹{(ord.totalPrice || ord.totalAmount || 14999).toLocaleString("en-IN")}
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => alert(`Tracking Order #${ord._id}`)}
                      style={{ background: "#f97316", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "10px", fontWeight: "600", cursor: "pointer" }}
                    >
                      Track Order
                    </button>
                    <button
                      onClick={() => alert(`Downloading Invoice for #${ord._id}`)}
                      style={{ background: "rgba(255, 255, 255, 0.08)", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "10px", cursor: "pointer" }}
                    >
                      Invoice 📄
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: ADDRESSES */}
      {activeTab === "addresses" && (
        <div className="glass-auth-card" style={{ maxWidth: "100%" }}>
          <h3 style={{ color: "#ffffff", fontSize: "1.3rem", marginBottom: "20px" }}>Saved Delivery Addresses</h3>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(249, 115, 22, 0.3)",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <div style={{ color: "#f97316", fontWeight: "700", marginBottom: "4px" }}>Default Address 📍</div>
            <div style={{ color: "#ffffff", fontWeight: "600" }}>{user.name}</div>
            <div style={{ color: "#a1a1aa", fontSize: "0.9rem" }}>123 Commerce Park Suite, Tech City, New Delhi - 110001</div>
            <div style={{ color: "#a1a1aa", fontSize: "0.9rem" }}>Phone: {user.phone || "+91 9876543210"}</div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: WISHLIST */}
      {activeTab === "wishlist" && (
        <div className="glass-auth-card" style={{ maxWidth: "100%" }}>
          <h3 style={{ color: "#ffffff", fontSize: "1.3rem", marginBottom: "20px" }}>My Saved Wishlist Items</h3>
          <p style={{ color: "#a1a1aa" }}>Saved items appear here. Explore products to add items to your wishlist!</p>
          <button className="btn-auth-submit-glow" style={{ width: "auto", marginTop: "14px" }} onClick={() => navigate("/shop")}>
            Browse Shop
          </button>
        </div>
      )}

      {/* TAB CONTENT: SETTINGS (Security) */}
      {activeTab === "settings" && (
        <div className="glass-auth-card" style={{ maxWidth: "100%" }}>
          <h3 style={{ color: "#ffffff", fontSize: "1.3rem", marginBottom: "20px" }}>Change Account Password</h3>
          <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "500px" }}>
            <div className="form-field-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
                className="auth-input-field"
              />
            </div>

            <div className="form-field-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
                className="auth-input-field"
              />
            </div>

            <div className="form-field-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
                className="auth-input-field"
              />
            </div>

            <button type="submit" className="btn-auth-submit-glow" style={{ width: "auto", alignSelf: "flex-start", padding: "12px 30px" }}>
              Update Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
