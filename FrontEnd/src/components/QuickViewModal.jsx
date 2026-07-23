import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style/product.css";

const QuickViewModal = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(
    product.imageUrl || (product.images && product.images[0])
  );
  const [qty, setQty] = useState(1);

  const imagesList =
    product.images && product.images.length > 0
      ? product.images
      : [product.imageUrl];

  const discountPercent =
    product.discountPrice && product.discountPrice < product.price
      ? Math.round(
          ((product.price - product.discountPrice) / product.price) * 100
        )
      : 0;

  const finalPrice = product.discountPrice || product.price;

  const handleAddToCart = () => {
    onAddToCart({
      productId: product._id,
      name: product.name,
      price: finalPrice,
      imageUrl: product.imageUrl,
      qty,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="quickview-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="quickview-grid">
          {/* Gallery */}
          <div className="quickview-gallery">
            <div className="quickview-main-image">
              <img src={selectedImage} alt={product.name} />
              {discountPercent > 0 && (
                <span className="badge-discount">-{discountPercent}% OFF</span>
              )}
            </div>
            {imagesList.length > 1 && (
              <div className="quickview-thumbnails">
                {imagesList.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${product.name} ${idx}`}
                    className={selectedImage === img ? "active-thumb" : ""}
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="quickview-info">
            <span className="product-brand-tag">{product.brand}</span>
            <h2>{product.name}</h2>

            <div className="rating-row">
              <div className="stars">
                {"★".repeat(Math.round(product.rating || 4))}
                {"☆".repeat(5 - Math.round(product.rating || 4))}
              </div>
              <span className="rating-value">{product.rating || 4.5}</span>
              <span className="reviews-count">({product.numReviews || 12} reviews)</span>
            </div>

            <div className="price-row">
              <span className="current-price">₹{finalPrice.toLocaleString()}</span>
              {discountPercent > 0 && (
                <span className="original-price">₹{product.price.toLocaleString()}</span>
              )}
              {product.freeDelivery && (
                <span className="badge-free-delivery">Free Delivery</span>
              )}
            </div>

            <p className="quickview-desc">{product.description}</p>

            <div className="stock-info">
              Availability:{" "}
              {product.stock > 0 ? (
                <span className="in-stock">In Stock ({product.stock} left)</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>

            {product.stock > 0 && (
              <div className="qty-picker">
                <label>Quantity:</label>
                <div className="qty-btn-group">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))}>
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="quickview-actions">
              <button
                className="btn btn-add-cart"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                🛒 Add to Cart
              </button>
              <Link
                to={`/product/${product._id}`}
                className="btn btn-view-full"
                onClick={onClose}
              >
                View Full Details ➔
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
