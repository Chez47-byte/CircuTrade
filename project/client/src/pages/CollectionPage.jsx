import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import { fashionCategories, getFashionCategory } from "../data/fashionCategories";
import { getErrorMessage } from "../utils/apiError";

export default function CollectionPage() {
  const { categorySlug } = useParams();
  const category = getFashionCategory(categorySlug);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!category) {
      setLoading(false);
      return;
    }

    const loadProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await API.get(`/products?category=${category.slug}`);
        setProducts(data);
      } catch (err) {
        setError(getErrorMessage(err, "Unable to load this collection right now."));
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category]);

  const sellCount = useMemo(() => products.filter((product) => product.type === "sell").length, [products]);
  const rentCount = useMemo(() => products.filter((product) => product.type === "rent").length, [products]);

  if (!category) {
    return (
      <div className="page-shell retail-page-shell">
        <div className="page-container">
          <section className="inner-hero">
            <div className="inner-hero-copy">
              <p className="section-kicker">Collection</p>
              <h1 className="inner-hero-title">That fashion edit does not exist.</h1>
              <p className="inner-hero-text">
                Choose another collection to explore curated men’s and women’s listings by style and occasion.
              </p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell retail-page-shell">
      <div className="page-container space-y-12">
        <section className="inner-hero">
          <div className="inner-hero-copy">
            <span className="section-kicker">{category.label} Collection</span>
            <h1 className="inner-hero-title">
              Discover {category.label.toLowerCase()} fashion for both sale and rental.
            </h1>
            <p className="inner-hero-text">{category.description}</p>

            <div className="homepage-hero-actions">
              <Link to="/buy" className="retail-link-pill">
                Shop sale
              </Link>
              <Link to="/rent" className="retail-link-pill">
                Explore rental
              </Link>
            </div>
          </div>

          <div className="inner-hero-media">
            <img src={category.heroImage} alt={category.label} className="h-full w-full object-cover" />
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="glass-stat">
            <p className="eyebrow text-stone-500">Total listings</p>
            <p className="metric-value">{products.length}</p>
          </div>
          <div className="glass-stat">
            <p className="eyebrow text-stone-500">For sale</p>
            <p className="metric-value">{sellCount}</p>
          </div>
          <div className="glass-stat">
            <p className="eyebrow text-stone-500">For rent</p>
            <p className="metric-value">{rentCount}</p>
          </div>
        </section>

        <section className="flex flex-wrap gap-3">
          {fashionCategories.map((item) => (
            <Link
              key={item.slug}
              to={`/collections/${item.slug}`}
              className={`category-filter-pill ${item.slug === category.slug ? "category-filter-pill-active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </section>

        <section className="products-rail-section">
          <div className="section-heading-row">
            <div>
              <p className="section-kicker">{category.label} Pieces</p>
              <h2 className="section-display-title">Curated listings in this style</h2>
            </div>
            <Link to="/buy" className="section-inline-link">
              Browse all inventory
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? <p className="text-stone-600">Loading collection...</p> : null}
          {error ? <p className="text-rose-700">{error}</p> : null}

          {!loading && !error ? (
            products.length ? (
              <div className="products-rail-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="editorial-empty-state">
                No listings are live in the {category.label.toLowerCase()} collection yet.
              </div>
            )
          ) : null}
        </section>
      </div>
    </div>
  );
}
