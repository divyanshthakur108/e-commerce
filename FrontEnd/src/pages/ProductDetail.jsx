import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import ProductCard from "../components/ProductCard";
import { safeFetch } from "../services/api";
import "../style/product.css";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [qty, setQty] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        setLoading(true);
        const data = await safeFetch(`/api/products/${id}`);
        setProduct(data);
        setSelectedImage(data.imageUrl || (data.images && data.images[0]));

        // Fetch related products in the same category
        if (data.category) {
          const relData = await safeFetch(
            `/api/products/category/${encodeURIComponent(data.category)}`
          );
          const filteredRel = (Array.isArray(relData) ? relData : relData.products || [])
            .filter((p) => p._id !== id)
            .slice(0, 4);
          setRelatedProducts(filteredRel);
        }
      } catch (error) {
        console.error("Error loading product detail:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndRelated();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="product-detail-loader">
        <div className="spinner"></div>
        <p>Loading Product Details...</p>
      </div>
    );
  }

  if (!product || product.message === "Product not found") {
    return (
      <div className="product-not-found-wrap">
        <h2>Product Not Found</h2>
        <p>The product you are looking for does not exist or has been removed.</p>
        <Link to="/shop" className="btn btn-primary">
          Back to Shop Catalog
        </Link>
      </div>
    );
  }

  const finalPrice = product.discountPrice || product.price;
  const discountPercent =
    product.discountPrice && product.discountPrice < product.price
      ? Math.round(
          ((product.price - product.discountPrice) / product.price) * 100
        )
      : 0;

  const imagesList =
    product.images && product.images.length > 0
      ? product.images
      : [product.imageUrl];

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: finalPrice,
        imageUrl: product.imageUrl,
        qty,
      })
    );
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  };

  const handleBuyNow = () => {
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: finalPrice,
        imageUrl: product.imageUrl,
        qty,
      })
    );
    navigate("/checkout");
  };

  return (
    <div className="product-detail-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link> <span>/</span> <Link to="/shop">Shop</Link>{" "}
        <span>/</span> <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>{" "}
        <span>/</span> <span className="current">{product.name}</span>
      </nav>

      {/* Main Grid */}
      <div className="product-detail-container">
        {/* Left Image Gallery */}
        <div className="detail-gallery-column">
          <div className="main-image-viewport">
            <img src={selectedImage} alt={product.name} />
            {discountPercent > 0 && (
              <span className="badge-discount-lg">-{discountPercent}% OFF</span>
            )}
          </div>

          {imagesList.length > 1 && (
            <div className="gallery-thumbnails">
              {imagesList.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.name} thumbnail ${idx}`}
                  className={selectedImage === img ? "active-thumb" : ""}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Info Column */}
        <div className="detail-info-column">
          <div className="detail-header">
            <span className="detail-brand-tag">{product.brand || "Brand"}</span>
            <span className="detail-category-tag">{product.category}</span>
          </div>

          <h1 className="detail-title">{product.name}</h1>

          {/* Rating */}
          <div className="detail-rating-row">
            <div className="stars-gold">
              {"★".repeat(Math.round(product.rating || 4.5))}
              {"☆".repeat(5 - Math.round(product.rating || 4.5))}
            </div>
            <span className="rating-score">{product.rating || 4.5}</span>
            <span className="rating-count">({product.numReviews || 12} customer reviews)</span>
          </div>

          {/* Price Block */}
          <div className="detail-price-block">
            <span className="detail-current-price">₹{finalPrice.toLocaleString()}</span>
            {discountPercent > 0 && (
              <span className="detail-original-price">₹{product.price.toLocaleString()}</span>
            )}
            {discountPercent > 0 && (
              <span className="detail-discount-pill">Save {discountPercent}%</span>
            )}
          </div>

          {/* Badges */}
          <div className="detail-badges-row">
            {product.freeDelivery && (
              <span className="badge-pill green">⚡ Free Express Shipping</span>
            )}
            <span className="badge-pill orange">🛡️ 1 Year Warranty</span>
            <span className="badge-pill blue">🔄 7-Day Replacement</span>
          </div>

          <hr className="divider" />

          {/* Description */}
          <p className="detail-description">{product.description}</p>

          {/* Stock */}
          <div className="detail-stock-row">
            <strong>Availability: </strong>
            {product.stock > 0 ? (
              <span className="stock-in">In Stock ({product.stock} items available)</span>
            ) : (
              <span className="stock-out">Out of Stock</span>
            )}
          </div>

          {/* Quantity Counter & Action Buttons */}
          {product.stock > 0 && (
            <div className="detail-purchase-row">
              <div className="qty-selector">
                <label>Qty:</label>
                <div className="qty-controls">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))}>
                    +
                  </button>
                </div>
              </div>

              <div className="detail-btn-group">
                <button
                  className="btn btn-add-cart-lg"
                  onClick={handleAddToCart}
                >
                  🛒 Add to Cart
                </button>
                <button
                  className="btn btn-buy-now-lg"
                  onClick={handleBuyNow}
                >
                  ⚡ Buy Now
                </button>
              </div>
            </div>
          )}

          {addedMessage && (
            <div className="added-success-alert">
              ✓ Item successfully added to your cart!
            </div>
          )}

          {/* Specifications Table */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="specifications-section">
              <h3>Technical Specifications</h3>
              <table className="specs-table">
                <tbody>
                  {product.specifications.map((spec, idx) => (
                    <tr key={idx}>
                      <td className="spec-name">{spec.name}</td>
                      <td className="spec-val">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <h2>You Might Also Like</h2>
          <div className="product-grid">
            {relatedProducts.map((relProd) => (
              <ProductCard key={relProd._id} product={relProd} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
