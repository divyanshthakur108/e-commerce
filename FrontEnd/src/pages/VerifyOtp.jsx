import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { safeFetch } from "../services/api";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(location.state?.email || "");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const data = await safeFetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      alert("OTP verified successfully. You are now logged in.");
      login(data);
      navigate("/");
    } catch (error) {
      console.error("[Verify OTP Error]:", error);
      setErrorMsg(error.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Verify OTP</h2>

        {errorMsg && (
          <div style={{ color: "#ef4444", marginBottom: "15px", textAlign: "center", fontSize: "0.9rem" }}>
            {errorMsg}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <input
          type="text"
          placeholder="Enter OTP"
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
