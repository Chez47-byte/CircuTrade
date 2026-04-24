import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import { fashionCategories } from "../data/fashionCategories";
import { getErrorMessage } from "../utils/apiError";

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

export default function Buy() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const selectedCategory = searchParams.get("category") || "";

  useEffect(() => {
    const q = new URLSearchParams({ type: "sell" });
    if (selectedCategory) q.set("category", selectedCategory);
    API.get(`/products?${q}`)
      .then((r) => setProducts(r.data))
      .catch((err) => setError(getErrorMessage(err, "Unable to load products for sale.")))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const activeCategory = fashionCategories.find((c) => c.slug === selectedCategory);
  const categoryLabel = activeCategory ? activeCategory.label : "All categories";

  return (
    <div className="page-shell retail-page-shell">
      <div className="page-container space-y-12">
        <section className="catalog-shell">
          <div className="catalog-copy">
            <span className="section-kicker">Shop Fashion</span>
            <h1 className="inner-hero-title">Browse fashion in a tighter retail layout with cleaner alignment.</h1>
            <p className="inner-hero-text">
              Sale listings now sit in a more structured catalogue with stronger image framing, balanced spacing,
              and product cards that stay consistent from mobile to desktop.
            </p>
            <div className="catalog-stat-row">
              <div className="catalog-stat-card">
                <span>Categories</span>
                <strong>{fashionCategories.length}+</strong>
              </div>
              <div className="catalog-stat-card">
                <span>Selection</span>
                <strong>{categoryLabel}</strong>
              </div>
              <div className="catalog-stat-card">
                <span>Listings</span>
                <strong>{loading ? "--" : products.length}</strong>
              </div>
            </div>
          </div>

          <div className="catalog-visual">
            <img
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80"
              alt="Menswear model"
              className="h-full w-full object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80"
              alt="Womenswear model"
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        <section className="inventory-shell">
          <div className="inventory-toolbar">
            <div>
              <span className="section-kicker">Filter By Category</span>
              <h2 className="section-display-title">Find the right fashion edit quickly</h2>
            </div>
            <p className="inventory-toolbar-copy">
              Structured filters and uniform cards make it easier to compare listings without image sizes jumping
              around.
            </p>
          </div>

          <section className="catalog-filters">
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setSearchParams({});
              }}
              className={`category-filter-pill ${!selectedCategory ? "category-filter-pill-active" : ""}`}
            >
              All Sale Pieces
            </button>
            {fashionCategories.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => {
                  setLoading(true);
                  setSearchParams({ category: c.slug });
                }}
                className={`category-filter-pill ${selectedCategory === c.slug ? "category-filter-pill-active" : ""}`}
              >
                {c.label}
              </button>
            ))}
          </section>

          <section className="products-rail-section">
            <div className="section-heading-row">
              <div>
                <span className="section-kicker">Sale Inventory</span>
                <h2 className="section-display-title">
                  {activeCategory ? `${activeCategory.label} sale listings` : "All sale listings"}
                </h2>
              </div>
              <Link to="/collections/premium" className="section-inline-link">
                Browse collections
              </Link>
            </div>

            {loading && <LoadingGrid />}
            {error && <ErrorMsg>{error}</ErrorMsg>}

            {!loading && !error &&
              (products.length ? (
                <div className="products-rail-grid">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="editorial-empty-state">No sale products are live in this category yet.</div>
              ))}
          </section>
        </section>
      </div>
    </div>
  );
}
