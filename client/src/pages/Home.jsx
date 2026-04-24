import { useEffect, useMemo, useState } from "react";
import { ArrowRight, MoveRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import { fashionCategories } from "../data/fashionCategories";
import { getErrorMessage } from "../utils/apiError";

const heroLinks = [
  { label: "Shop Sale", path: "/buy" },
  { label: "Rent Looks", path: "/rent" },
  { label: "List a Piece", path: "/sell" },
];

const modelSlides = [
  {
    src: "https://images.unsplash.com/photos/woman-in-blue-denim-jeans-and-white-cap-standing-on-gray-shopping-cart-during-daytime-wuxV6H0S0U0/",
    alt: "Male fashion model",
  },
  {
    src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
    alt: "Female fashion model",
  },
  {
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
    alt: "Male portrait model",
  },
  {
    src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    alt: "Female editorial model",
  },
  {
    src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    alt: "Unisex street fashion styling",
  },
];

const campaignRows = [
  {
    title: "Wedding Season",
    copy: "Curated occasionwear for ceremonies, receptions, festive weekends, and destination celebrations.",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1400&q=80",
    link: "/collections/wedding",
  },
  {
    title: "Luxury Party Edit",
    copy: "After-dark silhouettes, statement textures, and premium rental pieces styled for standout evenings.",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=80",
    link: "/collections/party",
  },
];

const trustHighlights = [
  {
    icon: ShieldCheck,
    title: "Verified listings",
    copy: "Cleaner cards and stronger hierarchy make each product feel more trustworthy.",
  },
  {
    icon: Sparkles,
    title: "Curated discovery",
    copy: "Collections and featured edits are grouped like a modern fashion shopping app.",
  },
  {
    icon: Truck,
    title: "Built for every mode",
    copy: "Buy, rent, and resell all sit inside one storefront that also adapts better on mobile.",
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => setError(getErrorMessage(err, "Unable to load the marketplace.")))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % modelSlides.length);
    }, 2000);

    return () => window.clearInterval(timer);
  }, []);

  const sellProducts = useMemo(() => products.filter((p) => p.type === "sell").slice(0, 8), [products]);
  const rentProducts = useMemo(() => products.filter((p) => p.type === "rent").slice(0, 4), [products]);
  const premiumEdit = useMemo(
    () => products.filter((p) => ["premium", "wedding", "party"].includes(p.category)).slice(0, 4),
    [products]
  );
  const spotlightCategories = useMemo(() => fashionCategories.slice(0, 4), []);

  return (
    <div className="page-shell retail-page-shell retail-home-shell">
      <section className="full-bleed-hero">
        <div className="full-bleed-hero-media">
          {modelSlides.map((slide, index) => (
            <div
              key={slide.src}
              className={`full-bleed-hero-slide ${activeSlide === index ? "full-bleed-hero-slide-active" : ""}`}
            >
              <img src={slide.src} alt={slide.alt} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>

        <div className="full-bleed-hero-overlay" />

        <div className="page-container relative z-[2] flex min-h-[calc(100svh-8.75rem)] items-end md:items-center">
          <div className="full-bleed-hero-copy">
            <p className="hero-mini-label text-white/80">Luxury Redefined</p>
            <h1 className="full-bleed-hero-title">Shop fashion in a cleaner, product-first storefront.</h1>
            <p className="full-bleed-hero-text">
              Explore sale drops, rental edits, and premium collections with steadier spacing, stronger product
              focus, and image frames that stay aligned across screen sizes.
            </p>

            <div className="homepage-hero-actions">
              {heroLinks.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className="retail-link-pill"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="full-bleed-hero-meta">
              <span>Men</span>
              <span>Women</span>
              <span>Resale</span>
              <span>Rental</span>
              <span>Premium edit</span>
            </div>
          </div>
        </div>
      </section>

      <div className="page-container space-y-16 pt-16">
        <section className="commerce-toolbar">
          <div>
            <span className="section-kicker">Storefront Highlights</span>
            <h2 className="section-display-title">Built to browse like a shopping app</h2>
          </div>
          <div className="commerce-toolbar-pills">
            <button type="button" onClick={() => navigate("/buy")} className="commerce-pill">
              Trending now
            </button>
            <button type="button" onClick={() => navigate("/collections/premium")} className="commerce-pill">
              Premium picks
            </button>
            <button type="button" onClick={() => navigate("/rent")} className="commerce-pill">
              Rent by occasion
            </button>
          </div>
        </section>

        <section className="trust-grid">
          {trustHighlights.map((item) => {
            const ItemIcon = item.icon;

            return (
              <article key={item.title} className="trust-card">
                <span className="trust-card-icon">
                  <ItemIcon size={18} />
                </span>
                <div>
                  <h3 className="trust-card-title">{item.title}</h3>
                  <p className="trust-card-copy">{item.copy}</p>
                </div>
              </article>
            );
          })}
        </section>

        <section className="split-rental-banner home-compact-section">
          <div className="split-rental-copy">
            <div>
              <span className="section-kicker">Shop by Category</span>
              <h2 className="section-display-title">Discover the collections</h2>
            </div>
            <p className="section-side-copy">
              Big visual category entries keep the first scroll close to the style of mainstream fashion marketplaces.
            </p>
            <button
              type="button"
              onClick={() => navigate("/collections/premium")}
              className="editorial-btn-light mt-6"
            >
              Explore collections
            </button>
          </div>

          <div className="compact-category-grid">
            {fashionCategories.map((category) => (
              <Link key={category.slug} to={`/collections/${category.slug}`} className="category-showcase-item group">
                <img
                  src={category.heroImage}
                  alt={category.label}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
                <div className="category-showcase-overlay" />
                <div className="category-showcase-copy">
                  <h3>{category.label}</h3>
                  <p>{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="spotlight-grid">
          <div className="spotlight-copy-panel">
            <span className="section-kicker">Shop Faster</span>
            <h2 className="section-display-title">Quick paths shoppers expect</h2>
            <p className="section-side-copy max-w-none">
              Category shortcuts, strong visual promos, and clear product rails make the home page feel more
              like a modern e-commerce experience instead of a plain catalogue.
            </p>
            <div className="spotlight-action-row">
              <button type="button" onClick={() => navigate("/buy")} className="editorial-btn-light">
                Start shopping
              </button>
              <button type="button" onClick={() => navigate("/sell")} className="retail-link-pill">
                Start selling
              </button>
            </div>
          </div>

          <div className="spotlight-category-grid">
            {spotlightCategories.map((category) => (
              <Link key={category.slug} to={`/collections/${category.slug}`} className="spotlight-category-card">
                <img src={category.heroImage} alt={category.label} className="h-full w-full object-cover" />
                <div className="spotlight-category-overlay" />
                <div className="spotlight-category-copy">
                  <p>{category.label}</p>
                  <span>Shop now</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="split-rental-banner home-compact-section">
          <div className="split-rental-copy">
            <div>
              <span className="section-kicker">New In</span>
              <h2 className="section-display-title">Latest sale arrivals</h2>
            </div>
            <p className="section-side-copy max-w-[34rem]">
              Fresh sale listings in a smaller, denser grid so shoppers can scan products faster.
            </p>
            <Link to="/buy" className="section-inline-link mt-6">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="split-rental-products">
            {loading && <LoadingGrid compact />}
            {error && <ErrorMsg>{error}</ErrorMsg>}

            {!loading && !error &&
              sellProducts.slice(0, 4).map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        </section>

        <section className="campaign-row-list">
          {campaignRows.map((row, index) => (
            <Link
              key={row.title}
              to={row.link}
              className={`campaign-row ${index % 2 === 1 ? "campaign-row-reverse" : ""}`}
            >
              <div className="campaign-row-image">
                <img src={row.image} alt={row.title} className="h-full w-full object-cover" />
              </div>
              <div className="campaign-row-copy">
                <span className="section-kicker">Featured Edit</span>
                <h2 className="campaign-row-title">{row.title}</h2>
                <p className="campaign-row-text">{row.copy}</p>
                <span className="campaign-row-link">
                  Explore now <MoveRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </section>

        <section className="split-rental-banner home-compact-section">
          <div className="split-rental-copy">
            <div>
              <span className="section-kicker">Premium Edit</span>
              <h2 className="section-display-title">Curated standout pieces</h2>
            </div>
            <p className="section-side-copy max-w-[34rem]">
              Premium listings stay inside the same compact storefront rhythm for better alignment across sections.
            </p>
            <Link to="/collections/premium" className="section-inline-link mt-6">
              Explore premium <ArrowRight size={14} />
            </Link>
          </div>

          <div className="split-rental-products">
            {!loading && !error &&
              premiumEdit.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        </section>

        <section className="split-rental-banner">
          <div className="split-rental-copy">
            <span className="section-kicker">Rental Edit</span>
            <h2 className="section-display-title">Borrow premium looks with clearer daily pricing.</h2>
            <p className="section-side-copy max-w-[34rem]">
              The same section rhythm carries across desktop and small screens, so browsing rentals still
              feels clean and easy on mobile.
            </p>
            <button type="button" onClick={() => navigate("/rent")} className="editorial-btn-light mt-6">
              Explore rentals
            </button>
          </div>

          <div className="split-rental-products">
            {rentProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function LoadingGrid({ compact = false }) {
  return (
    <div className={compact ? "split-rental-products" : "products-rail-grid"}>
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="loading-shimmer rounded-[6px]"
          style={{ height: "420px", animationDelay: `${i * 140}ms` }}
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
