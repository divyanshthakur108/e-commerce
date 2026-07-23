import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { clearCart } from "../redux/cartSlice";
import {
  loadRazorpayScript,
  fetchRazorpayKey,
  createRazorpayOrder,
  verifyPaymentSignature,
  createBackendOrder,
} from "../services/paymentService";

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { message, type: 'error' | 'success' | 'info' }

  const showToast = (message, type = "error") => {
    console.log(`[Checkout Toast ${type.toUpperCase()}]: ${message}`);
    setToast({ message, type });
    if (type !== "loading") {
      setTimeout(() => {
        setToast((prev) => (prev?.message === message ? null : prev));
      }, 5000);
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.qty || 1),
    0
  );

  const validateAddress = () => {
    console.log("[Checkout Step 1] Validating shipping address fields...", address);
    if (!address.fullName.trim()) {
      showToast("Full Name is required.", "error");
      return false;
    }
    if (!address.street.trim()) {
      showToast("Street Address is required.", "error");
      return false;
    }
    if (!address.city.trim()) {
      showToast("City is required.", "error");
      return false;
    }
    if (!address.postalCode.trim()) {
      showToast("Postal Code is required.", "error");
      return false;
    }
    if (!address.country.trim()) {
      showToast("Country is required.", "error");
      return false;
    }
    return true;
  };

  const validateCartAndAuth = () => {
    console.log("[Checkout Step 2] Checking authentication and cart contents...");
    if (!user || !user.token) {
      console.warn("[Checkout Warning] User is not authenticated.");
      showToast("Please log in to complete your checkout.", "error");
      navigate("/login");
      return false;
    }

    if (!cartItems || cartItems.length === 0) {
      console.warn("[Checkout Warning] Cart is empty.");
      showToast("Your cart is empty. Please add items to cart before proceeding.", "error");
      navigate("/cart");
      return false;
    }

    if (totalPrice <= 0) {
      console.warn("[Checkout Warning] Total price is 0 or invalid.");
      showToast("Invalid order total amount.", "error");
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    console.log("[Checkout Step 3] handlePayment() initiated");

    // Prevent duplicate payment requests
    if (loading) {
      console.warn("[Checkout Warning] Payment is already processing. Call ignored.");
      return;
    }

    // 1. Validate auth and cart
    if (!validateCartAndAuth()) return;

    // 2. Validate shipping address fields
    if (!validateAddress()) return;

    setLoading(true);
    showToast("Initializing payment process...", "info");

    try {
      // Step A: Load Razorpay SDK
      console.log("[Checkout Step A] Loading Razorpay SDK script...");
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error(
          "Failed to load Razorpay SDK. Please check your internet connection and try again."
        );
      }
      console.log("[Checkout Step A] Razorpay SDK is ready.");

      // Step B: Fetch Razorpay Key ID from backend
      console.log("[Checkout Step B] Fetching Razorpay Key ID from backend...");
      const razorpayKey = await fetchRazorpayKey(user.token);
      console.log("[Checkout Step B] Razorpay Key ID fetched:", razorpayKey);

      // Step C: Create Razorpay Order in backend before opening gateway
      console.log("[Checkout Step C] Creating Razorpay Order on backend for amount:", totalPrice);
      const razorpayOrder = await createRazorpayOrder(totalPrice, user.token);
      console.log("[Checkout Step C] Razorpay Order created successfully:", razorpayOrder);

      // Step D: Configure Razorpay Checkout Options
      console.log("[Checkout Step D] Initializing Razorpay Gateway options...");
      const options = {
        key: razorpayKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || "INR",
        name: "ShopNest",
        description: "E-Commerce Purchase Order",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          console.log("[Checkout Step E] Payment completed in modal. Handler response:", response);
          showToast("Verifying payment with server...", "info");
          try {
            // Step E1: Verify Payment Signature on Backend
            console.log("[Checkout Step E1] Verifying signature with backend...");
            await verifyPaymentSignature(
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              user.token
            );
            console.log("[Checkout Step E1] Payment signature verified successfully!");

            // Step E2: Create Order in Database
            console.log("[Checkout Step E2] Creating backend database order record...");
            const orderPayload = {
              items: cartItems.map((item) => ({
                productId: item.productId || item._id,
                name: item.name,
                qty: item.qty,
                price: item.price,
                imageUrl: item.imageUrl,
              })),
              totalAmount: totalPrice,
              address: address,
              paymentId: response.razorpay_payment_id,
            };

            const createdOrder = await createBackendOrder(orderPayload, user.token);
            console.log("[Checkout Step E2] Database Order created successfully:", createdOrder);

            showToast("Payment Successful! Redirecting...", "success");

            // Step E3: Clear cart in Redux & localStorage
            console.log("[Checkout Step E3] Cleaning up cart state...");
            dispatch(clearCart());

            // Step E4: Redirect to Order Success Page
            console.log("[Checkout Step E4] Redirecting user to Order Success page...");
            setTimeout(() => {
              navigate("/ordersuccess");
            }, 1000);
          } catch (verifyOrSaveErr) {
            console.error("[Checkout Step E Error] Failure during verification/order save:", verifyOrSaveErr);
            showToast(
              verifyOrSaveErr.message || "Payment verification or order creation failed.",
              "error"
            );
            setLoading(false);
          }
        },
        prefill: {
          name: address.fullName,
          email: user?.email || "",
          contact: "9999999999",
        },
        notes: {
          shipping_address: `${address.street}, ${address.city}, ${address.postalCode}, ${address.country}`,
        },
        theme: {
          color: "#f97316",
        },
        modal: {
          ondismiss: function () {
            console.log("[Checkout] Payment modal was closed by user.");
            showToast("Payment process cancelled by user.", "info");
            setLoading(false);
          },
        },
      };

      console.log("[Checkout Step D] Opening Razorpay Modal...");
      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on("payment.failed", function (failureResponse) {
        console.error("[Checkout] Payment failed in Razorpay modal:", failureResponse.error);
        showToast(`Payment failed: ${failureResponse.error.description || "Transaction failed"}`, "error");
        setLoading(false);
      });

      razorpayInstance.open();
    } catch (err) {
      console.error("[Checkout Error] Unhandled Exception during handlePayment:", err);
      showToast(err.message || "Payment initialization failed. Please try again.", "error");
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("[Checkout] Form submitted via Pay Now button click or form submit");
    handlePayment();
  };

  return (
    <div className="checkout-container" style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "20px", color: "#ffffff", textAlign: "center" }}>Checkout</h2>

      {toast && (
        <div
          className={`toast-alert toast-${toast.type}`}
          style={{
            padding: "12px 20px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "0.95rem",
            fontWeight: "600",
            textAlign: "center",
            backgroundColor:
              toast.type === "error"
                ? "#ef444422"
                : toast.type === "success"
                ? "#10b98122"
                : "#3b82f622",
            color:
              toast.type === "error"
                ? "#ef4444"
                : toast.type === "success"
                ? "#10b981"
                : "#3b82f6",
            border: `1px solid ${
              toast.type === "error"
                ? "#ef444444"
                : toast.type === "success"
                ? "#10b98144"
                : "#3b82f644"
            }`,
          }}
        >
          {toast.message}
        </div>
      )}

      <div className="checkout-content" style={{ background: "#18181b", padding: "30px", borderRadius: "16px", border: "1px solid #27272a" }}>
        <form onSubmit={handleSubmit} className="shipping-form">
          <h3 style={{ fontSize: "1.3rem", color: "#f97316", marginBottom: "20px" }}>Shipping Address</h3>

          <div style={{ display: "grid", gap: "16px", marginBottom: "24px" }}>
            <div>
              <label style={{ display: "block", color: "#a1a1aa", fontSize: "0.85rem", marginBottom: "6px" }}>Full Name *</label>
              <input
                type="text"
                placeholder="John Doe"
                required
                value={address.fullName}
                onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#09090b",
                  border: "1px solid #27272a",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "1rem",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", color: "#a1a1aa", fontSize: "0.85rem", marginBottom: "6px" }}>Street Address *</label>
              <input
                type="text"
                placeholder="123 Main St, Apt 4B"
                required
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#09090b",
                  border: "1px solid #27272a",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "1rem",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", color: "#a1a1aa", fontSize: "0.85rem", marginBottom: "6px" }}>City *</label>
                <input
                  type="text"
                  placeholder="New York"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "#09090b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                    color: "#ffffff",
                    fontSize: "1rem",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", color: "#a1a1aa", fontSize: "0.85rem", marginBottom: "6px" }}>Postal Code *</label>
                <input
                  type="text"
                  placeholder="10001"
                  required
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "#09090b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                    color: "#ffffff",
                    fontSize: "1rem",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", color: "#a1a1aa", fontSize: "0.85rem", marginBottom: "6px" }}>Country *</label>
              <input
                type="text"
                placeholder="United States"
                required
                value={address.country}
                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#09090b",
                  border: "1px solid #27272a",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "1rem",
                  boxSizing: "border-box"
                }}
              />
            </div>
          </div>

          <div className="checkout-summary" style={{ borderTop: "1px solid #27272a", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ color: "#a1a1aa", fontSize: "0.9rem", display: "block" }}>Cart Items: {cartItems.length}</span>
              <h4 style={{ fontSize: "1.4rem", color: "#ffffff", margin: "4px 0 0 0" }}>
                Total to Pay: <span style={{ color: "#f97316" }}>₹{totalPrice.toFixed(2)}</span>
              </h4>
            </div>

            <button
              type="submit"
              disabled={loading || cartItems.length === 0}
              style={{
                padding: "14px 32px",
                background: loading || cartItems.length === 0 ? "#52525b" : "#f97316",
                color: "#ffffff",
                fontSize: "1rem",
                fontWeight: "700",
                border: "none",
                borderRadius: "8px",
                cursor: loading || cartItems.length === 0 ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                opacity: loading || cartItems.length === 0 ? 0.7 : 1,
              }}
            >
              {loading ? "Processing Payment..." : "Pay Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
