import React from "react";
import profileDp from "../assets/dp.jpg";

const About = () => {
  const containerStyle = {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "50px 30px",
    background: "linear-gradient(145deg, #18181b 0%, #09090b 100%)",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(249, 115, 22, 0.05)",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  };

  const socialBtnStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 22px",
    background: "rgba(255, 255, 255, 0.04)",
    color: "#fafafa",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "0.95rem",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  };

  const handleImageError = (e) => {
    // Bulletproof fallback if image fails to load
    e.target.onerror = null;
    e.target.src = "https://ui-avatars.com/api/?name=Divyansh+Thakur&background=f97316&color=fff&size=180";
  };

  return (
    <div style={containerStyle}>
      <div
        style={{
          position: "relative",
          display: "inline-block",
          marginBottom: "24px",
        }}
      >
        <img
          src={profileDp}
          alt="Divyansh Thakur"
          onError={handleImageError}
          style={{
            width: "160px",
            height: "160px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "4px solid #f97316",
            boxShadow: "0 8px 30px rgba(249, 115, 22, 0.4)",
            display: "block",
            margin: "0 auto",
          }}
        />
        <span
          style={{
            position: "absolute",
            bottom: "8px",
            right: "8px",
            width: "20px",
            height: "20px",
            backgroundColor: "#22c55e",
            borderRadius: "50%",
            border: "3px solid #18181b",
            boxShadow: "0 0 10px rgba(34, 197, 94, 0.8)",
          }}
        />
      </div>

      <h2
        style={{
          fontSize: "2.5rem",
          fontWeight: "700",
          marginBottom: "8px",
          color: "#ffffff",
          letterSpacing: "-0.5px",
        }}
      >
        About Me
      </h2>

      <h3
        style={{
          fontSize: "1.35rem",
          color: "#f97316",
          fontWeight: "600",
          marginBottom: "20px",
        }}
      >
        Divyansh Thakur (@divyanshthakur)
      </h3>

      <p
        style={{
          color: "#a1a1aa",
          fontSize: "1.1rem",
          lineHeight: "1.8",
          maxWidth: "650px",
          margin: "0 auto 36px auto",
        }}
      >
        <strong style={{ color: "#ffffff" }}>
          Join the community and grow together!
        </strong>{" "}
        Welcome to my platform where we build, deploy, and scale highly engineered systems.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "14px",
        }}
      >
        <a
          href="https://google.com"
          target="_blank"
          rel="noreferrer"
          style={socialBtnStyle}
        >
          🌐 Website
        </a>
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noreferrer"
          style={{
            ...socialBtnStyle,
            background: "rgba(239, 68, 68, 0.12)",
            borderColor: "rgba(239, 68, 68, 0.3)",
            color: "#f87171",
          }}
        >
          📺 YouTube
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          style={{
            ...socialBtnStyle,
            background: "rgba(236, 72, 153, 0.12)",
            borderColor: "rgba(236, 72, 153, 0.3)",
            color: "#f472b6",
          }}
        >
          📸 Instagram
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noreferrer"
          style={{
            ...socialBtnStyle,
            background: "rgba(59, 130, 246, 0.12)",
            borderColor: "rgba(59, 130, 246, 0.3)",
            color: "#60a5fa",
          }}
        >
          💼 LinkedIn
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noreferrer"
          style={socialBtnStyle}
        >
          ✖️ X (Twitter)
        </a>
        <a
          href="https://whatsapp.com"
          target="_blank"
          rel="noreferrer"
          style={{
            ...socialBtnStyle,
            background: "rgba(16, 185, 129, 0.12)",
            borderColor: "rgba(16, 185, 129, 0.3)",
            color: "#34d399",
          }}
        >
          💬 WhatsApp
        </a>
        <a
          href="https://linktr.ee"
          target="_blank"
          rel="noreferrer"
          style={socialBtnStyle}
        >
          🔗 Linktree
        </a>
      </div>
    </div>
  );
};

export default About;
