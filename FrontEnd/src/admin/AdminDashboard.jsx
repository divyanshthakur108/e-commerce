import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { safeFetch } from "../services/api";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchStats = async () => {
      try {
        const data = await safeFetch("/api/analytics", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        setStats({
          totalOrders: data.totalOrders || 0,
          totalProducts: data.totalProducts || 0,
          totalUsers: data.totalUsers || 0,
          totalRevenue: data.totalRevenue || 0,
        });
      } catch (error) {
        console.error("Analytics Error:", error);
        setStats({
          totalOrders: 0,
          totalProducts: 0,
          totalUsers: 0,
          totalRevenue: 0,
        });
        if (error.message && (error.message.includes("401") || error.message.includes("Not authorized"))) {
          navigate("/login");
        }
      }
    };

    fetchStats();
  }, [user, navigate]);

  const cardStyle = {
    padding: "25px",
    background: "#18181b",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    textAlign: "center",
  };

  const numberStyle = {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#f97316",
  };

  if (!stats) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "100px",
          color: "#f97316",
        }}
      >
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1 style={{ marginBottom: "10px" }}>Admin Dashboard</h1>

      <p
        style={{
          color: "#a1a1aa",
          marginBottom: "30px",
        }}
      >
        Welcome back, {user?.name}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Orders</h3>
          <div style={numberStyle}>{stats.totalOrders}</div>
        </div>

        <div style={cardStyle}>
          <h3>Total Products</h3>
          <div style={numberStyle}>{stats.totalProducts}</div>
        </div>

        <div style={cardStyle}>
          <h3>Total Users</h3>
          <div style={numberStyle}>{stats.totalUsers}</div>
        </div>

        <div style={cardStyle}>
          <h3>Total Revenue</h3>
          <div style={numberStyle}>
            ₹{Number(stats.totalRevenue || 0).toFixed(2)}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "40px",
          padding: "30px",
          background: "#18181b",
          borderRadius: "12px",
        }}
      >
        <h2 style={{ color: "#f97316" }}>Administrative Controls</h2>

        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            marginTop: "20px",
          }}
        >
          <button
            className="btn"
            onClick={() => navigate("/admin/add-product")}
          >
            Add Product
          </button>

          <button className="btn" onClick={() => navigate("/admin/products")}>
            Manage Products
          </button>

          <button className="btn" onClick={() => navigate("/admin/orders")}>
            Manage Orders
          </button>

          <button className="btn" onClick={() => navigate("/admin/users")}>
            Manage Users
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
