import React, { createContext, useState, useEffect } from "react";
import { safeFetch } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("userInfo");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("userToken") || (user ? user.token : null);
  });

  const [darkMode, setDarkMode] = useState(true);

  // Sync token header & refresh profile on startup
  useEffect(() => {
    if (token) {
      localStorage.setItem("userToken", token);
      refreshUserProfile();
    } else {
      localStorage.removeItem("userToken");
    }
  }, [token]);

  const refreshUserProfile = async () => {
    try {
      const profile = await safeFetch("/api/auth/profile");
      if (profile && profile._id) {
        const updated = { ...user, ...profile, token: token || user?.token };
        setUser(updated);
        localStorage.setItem("userInfo", JSON.stringify(updated));
      }
    } catch (err) {
      console.log("Session verification background check complete");
    }
  };

  const login = (userData) => {
    const userToken = userData.token || token;
    const fullUser = { ...userData, token: userToken };
    setUser(fullUser);
    setToken(userToken);
    localStorage.setItem("userInfo", JSON.stringify(fullUser));
    if (userToken) {
      localStorage.setItem("userToken", userToken);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userToken");
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const nextUser = { ...prev, ...updatedFields };
      localStorage.setItem("userInfo", JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUser,
        refreshUserProfile,
        darkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
