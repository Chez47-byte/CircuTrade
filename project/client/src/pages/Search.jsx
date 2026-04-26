import { Search as SearchIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import { getFashionCategory } from "../data/fashionCategories";
import { getErrorMessage } from "../utils/apiError";

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .trim();
}

function LoadingGrid() {
  return (
    <div className="products-rail-grid">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="loading-shimmer rounded-[6px]"
          style={{ height: "420px", animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

function ErrorMsg({ children }) {
  return (
    <div
      className="rounded-[8px] px-4 py-3 text-[13px]"
      style={{
        background: "rgba(200,70,60,0.06)",
        border: "1px solid rgba(200,70,60,0.14)",
        color: "#8a2a24",
      }}
    >
      {children}
    </div>
  );
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(initialQuery);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setInputValue(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    API.get("/products")
      .then(({ data }) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => setError(getErrorMessage(err, "Unable to search products right now.")))
      .finally(() => setLoading(false));
  }, []);

  const query = normalize(initialQuery);

  const matchingProducts = useMemo(() => {
    if (!query) return [];

    return products.filter((product) => {
      const categoryLabel = getFashionCategory(product.category)?.label || "";
      const searchableText = normalize(
        [
          product.title,
          product.description,
          product.category,
          categoryLabel,
          product.type,
          product.price,
          product.rentPrice,
        ].join(" ")
      );

      return searchableText.includes(query);
    });
  }, [products, query]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setSearchParams({});
      return;
    }

    setSearchParams({ q: trimmed });
  };

  return (
    <div className="page-shell retail-page-shell">
      <div className="page-container space-y-10">
        <section className="catalog-shell">
          <div className="catalog-copy">
            <span className="section-kicker">Search The Marketplace</span>
            <h1 className="inner-hero-title">Search for any product, category, rental look, or sale listing.</h1>
            <p className="inner-hero-text">
              Type the product name or fashion style you want. If it matches any listing, we will show all matching
              products here.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="search-page-form">
            <label htmlFor="marketplace-search" className="product-field-label">
              Search products
            </label>
            <div className="search-page-input-shell">
              <SearchIcon size={18} className="search-page-input-icon" />
              <input
                id="marketplace-search"
                type="search"
                autoFocus
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Search by product name, category, sale, rent..."
                className="search-page-input"
              />
              <button type="submit" className="vintage-btn-primary search-page-submit">
                Search
              </button>
            </div>
          </form>
        </section>

        <section className="inventory-shell">
          <div className="inventory-toolbar">
            <div>
              <span className="section-kicker">Search Results</span>
              <h2 className="section-display-title">
                {query ? `Results for "${initialQuery}"` : "Start typing to search the listings"}
              </h2>
            </div>
            <p className="inventory-toolbar-copy">
              {query
                ? `${matchingProducts.length} matching product${matchingProducts.length === 1 ? "" : "s"} found`
                : "Search across sale listings, rentals, and curated marketplace products."}
            </p>
          </div>

          {loading && <LoadingGrid />}
          {error && <ErrorMsg>{error}</ErrorMsg>}

          {!loading && !error && !query ? (
            <div className="editorial-empty-state">Search for a product to see matching listings.</div>
          ) : null}

          {!loading && !error && query && !matchingProducts.length ? (
            <div className="editorial-empty-state">Sorry, product not listed.</div>
          ) : null}

          {!loading && !error && matchingProducts.length ? (
            <div className="products-rail-grid">
              {matchingProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
