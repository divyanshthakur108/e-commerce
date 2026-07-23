import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/auth/users", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await fetch(`/api/auth/users/${id}/toggle-block`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();

      alert(data.message);

      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  return (
    <div style={containerStyle}>
      <h2 style={{ color: "#f97316", marginBottom: "20px" }}>
        User Directory{" "}
      </h2>
      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr style={rowStyle}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>NAME</th>
              <th style={thStyle}>EMAIL</th>
              <th style={thStyle}>ROLE</th>
              <th style={thStyle}>STATUS</th>
              <th style={thStyle}>ACTION</th>
              <th style={thStyle}>JOINED</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} style={rowStyle}>
                <td style={tdStyle}>{u._id.substring(0, 8)}...</td>

                <td style={tdStyle}>{u.name}</td>

                <td style={tdStyle}>{u.email}</td>

                <td style={tdStyle}>
                  <span
                    style={{
                      background:
                        u.role === "admin"
                          ? "rgba(234,88,12,0.2)"
                          : "rgba(16,185,129,0.2)",
                      color: u.role === "admin" ? "#f97316" : "#10b981",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                    }}
                  >
                    {u.role.toUpperCase()}
                  </span>
                </td>

                <td style={tdStyle}>
                  {u.isBlocked ? (
                    <span
                      style={{
                        color: "#ef4444",
                        fontWeight: "bold",
                      }}
                    >
                      LOCKED
                    </span>
                  ) : (
                    <span
                      style={{
                        color: "#22c55e",
                        fontWeight: "bold",
                      }}
                    >
                      ACTIVE
                    </span>
                  )}
                </td>

                <td style={tdStyle}>
                  {u.role !== "admin" && (
                    <button
                      onClick={() => handleToggle(u._id)}
                      style={{
                        padding: "8px 12px",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        background: u.isBlocked ? "#22c55e" : "#ef4444",
                        color: "#fff",
                      }}
                    >
                      {u.isBlocked ? "Unlock" : "Lock"}
                    </button>
                  )}
                </td>

                <td style={tdStyle}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
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
  fontSize: "0.9rem",
};

const tdStyle = {
  padding: "15px",
  textAlign: "left",
};

export default AdminUsers;
