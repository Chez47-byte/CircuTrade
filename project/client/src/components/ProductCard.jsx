import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getFashionCategory } from "../data/fashionCategories";

export default function ProductCard({ product }) {
  const primaryImage = product.image || product.images?.[0] || "https://via.placeholder.com/600x700";
  const category = getFashionCategory(product.category);
  const isRent = product.type === "rent";
  const primaryPrice = Number(product.price || 0).toLocaleString("en-IN");
  const rentalPrice = Number(product.rentPrice || 0).toLocaleString("en-IN");
  const primaryLabel = isRent ? "Security deposit" : "Selling price";
  const footerLabel = isRent ? "View rental details" : "View product details";

  return (
    <Link to={`/product/${product._id}`} className="retail-product-card group">
      <div className="retail-product-media-shell">
        <div className="retail-product-media">
          <img src={primaryImage} alt={product.title} className="retail-product-image" />
        </div>
        <div className="retail-product-badge-row">
          <span className="retail-product-badge">{isRent ? "Rent" : "Sale"}</span>
          {category ? <span className="retail-product-badge retail-product-badge-soft">{category.label}</span> : null}
        </div>
      </div>

      <div className="retail-product-content">
        <div className="retail-product-copy">
          <p className="retail-product-eyebrow">{category?.label || "Curated"} collection</p>
          <h3 className="retail-product-title">{product.title}</h3>
          <p className="retail-product-subcopy">
            {isRent
              ? "Rental-ready piece with transparent day pricing."
              : "Cleanly presented resale listing with full product visibility."}
          </p>
        </div>

        <div className="retail-product-pricing">
          <div className="retail-product-price-stack">
            <p className="retail-product-price-label">{primaryLabel}</p>
            <p className="retail-product-price">Rs. {primaryPrice}</p>
          </div>
          {isRent ? (
            <div className="retail-product-price-stack retail-product-price-stack-right">
              <p className="retail-product-price-label">Per day</p>
              <p className="retail-product-secondary-price">Rs. {rentalPrice}</p>
            </div>
          ) : null}
        </div>

        <div className="retail-product-footer">
          <span>{footerLabel}</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
}
