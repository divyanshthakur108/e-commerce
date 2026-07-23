import { safeFetch } from "./api";

/**
 * Payment Service Module
 * Handles script loading, Razorpay backend integration, and order persistence.
 */

// Dynamically load Razorpay SDK checkout.js
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      console.log("[PaymentService] Razorpay SDK already loaded in window.");
      return resolve(true);
    }

    console.log("[PaymentService] Dynamically injecting Razorpay SDK script...");
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      console.log("[PaymentService] Razorpay SDK loaded successfully.");
      resolve(true);
    };

    script.onerror = () => {
      console.error("[PaymentService] Failed to load Razorpay SDK script.");
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

// Fetch public Razorpay Key ID from backend
export const fetchRazorpayKey = async (token) => {
  console.log("[PaymentService] Fetching Razorpay Key ID from backend...");
  const data = await safeFetch("/api/payment/key", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!data.key) {
    throw new Error(data.message || "Failed to retrieve Razorpay Key ID from backend.");
  }

  return data.key;
};

// Create Razorpay Order on Backend
export const createRazorpayOrder = async (amount, token) => {
  console.log("[PaymentService] Creating Razorpay order on backend for amount:", amount);
  const data = await safeFetch("/api/payment/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount }),
  });

  if (!data.id) {
    throw new Error(data.message || "Failed to create payment order on backend.");
  }

  return data;
};

// Verify Payment Signature on Backend
export const verifyPaymentSignature = async (paymentResponse, token) => {
  console.log("[PaymentService] Verifying payment signature with backend...", paymentResponse);
  const data = await safeFetch("/api/payment/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(paymentResponse),
  });

  if (!data.success) {
    throw new Error(data.message || "Payment signature verification failed.");
  }

  return data;
};

// Save Final Order in Backend Database
export const createBackendOrder = async (orderPayload, token) => {
  console.log("[PaymentService] Saving completed order in DB...", orderPayload);
  const data = await safeFetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderPayload),
  });

  if (!data.success) {
    throw new Error(data.message || "Failed to save order to database.");
  }

  return data;
};
