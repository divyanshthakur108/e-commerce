import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import { safeFetch } from "../services/api";

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await safeFetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (error) {
        console.error("Fetch Orders Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchOrders();
    }
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      await safeFetch(`/api/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ status }),
      });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error("Update Status Error:", error);
    }
  };

  if (loading) {
    return <h3 style={{ color: "#fff" }}>Loading Orders...</h3>;
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ color: "#f97316", marginBottom: "20px" }}>Manage Orders </h2>

      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr style={rowStyle}>
              <th style={thStyle}>ORDER ID</th>
              <th style={thStyle}>USER</th>
              <th style={thStyle}>TOTAL</th>
              <th style={thStyle}>DATE</th>
              <th style={thStyle}>STATUS</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} style={rowStyle}>
                  <td style={tdStyle}>{order._id?.substring(0, 8)}...</td>

                  <td style={tdStyle}>
                    {order.userId?.name || "Deleted User"}
                  </td>

                  <td style={tdStyle}>₹{order.totalAmount?.toFixed(2)}</td>

                  <td style={tdStyle}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td style={tdStyle}>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={tdStyle}>
                  No Orders Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const containerStyle = {
  maxWidth: "1200px",
  margin: "40px auto",
  padding: "30px",
  background: "#18181b",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.05)",
  color: "#fafafa",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const rowStyle = {
  borderBottom: "1px solid rgba(255,255,255,0.1)",
};

const thStyle = {
  padding: "15px",
  textAlign: "left",
  color: "#a1a1aa",
};

const tdStyle = {
  padding: "15px",
};

export default AdminOrders;
