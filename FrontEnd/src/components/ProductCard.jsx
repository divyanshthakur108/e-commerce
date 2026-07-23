import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import "../style/product.css";

const ProductCard = ({ product, onQuickView }) => {
  if (!product) return null;

  const dispatch = useDispatch();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const discountPercent =
    product.discountPrice && product.discountPrice < product.price
      ? Math.round(
          ((product.price - product.discountPrice) / product.price) * 100
        )
      : 0;

  const finalPrice = product.discountPrice || product.price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: finalPrice,
        imageUrl: product.imageUrl,
        qty: 1,
      })
    );

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="product-card">
      {/* Top Badges */}
      <div className="card-badges">
        {product.isBestSeller && (
          <span className="badge badge-bestseller">BEST SELLER</span>
        )}
        {product.isNewArrival && (
          <span className="badge badge-new">NEW</span>
        )}
        {product.isFeatured && !product.isBestSeller && (
          <span className="badge badge-featured">FEATURED</span>
        )}
        {discountPercent > 0 && (
          <span className="badge badge-discount">-{discountPercent}%</span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
        onClick={toggleWishlist}
        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        {isWishlisted ? "❤️" : "🤍"}
      </button>

      {/* Image Container with Quick View Button */}
      <div className="product-image-wrap">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        {onQuickView && (
          <button
            className="quickview-trigger-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
          >
            👁️ Quick View
          </button>
        )}
      </div>

      {/* Product Content */}
      <div className="product-info">
        <div className="brand-category-row">
          <span className="product-brand">{product.brand || "Brand"}</span>
          <span className="product-category">{product.category}</span>
        </div>

        <h3 className="product-title" title={product.name}>
          <Link to={`/product/${product._id}`}>{product.name}</Link>
        </h3>

        {/* Rating */}
        <div className="card-rating">
          <span className="stars-gold">
            {"★".repeat(Math.round(product.rating || 4.5))}
            {"☆".repeat(5 - Math.round(product.rating || 4.5))}
          </span>
          <span className="rating-num">{product.rating || 4.5}</span>
          <span className="reviews-num">({product.numReviews || 12})</span>
        </div>

        {/* Price & Badges */}
        <div className="card-price-block">
          <span className="current-price">₹{finalPrice.toLocaleString()}</span>
          {discountPercent > 0 && (
            <span className="original-price">
              ₹{product.price.toLocaleString()}
            </span>
          )}
        </div>

        {product.freeDelivery && (
          <div className="free-delivery-tag">⚡ Free Express Delivery</div>
        )}

        {/* Action Buttons */}
        <div className="card-actions">
          <button
            onClick={handleAddToCart}
            className={`btn btn-add-to-cart ${addedAnimation ? "added" : ""}`}
            disabled={product.stock <= 0}
          >
            {addedAnimation
              ? "✓ Added!"
              : product.stock <= 0
              ? "Out of Stock"
              : "Add to Cart"}
          </button>
          <Link to={`/product/${product._id}`} className="btn btn-details">
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
