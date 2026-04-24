import { Link } from "react-router-dom";
import { Mail, Phone, Send } from "lucide-react";
import { fashionCategories } from "../data/fashionCategories";

export default function Footer() {
  return (
    <footer className="mt-24 px-4 pb-6 md:px-6">
      <div className="page-container footer-shell">
        <div className="footer-cta-panel">
          <div>
            <span className="eyebrow" style={{ color: "rgba(200, 164, 106, 0.72)" }}>
              Better Commerce Flow
            </span>
            <h2
              className="mt-3 text-[28px] leading-[1] text-white md:text-[40px]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Shop, rent, and resell from one fashion-first marketplace.
            </h2>
          </div>
          <div className="footer-cta-actions">
            <Link to="/buy" className="editorial-btn-light">
              Shop now
            </Link>
            <Link to="/sell" className="editorial-btn-ghost">
              Start selling
            </Link>
          </div>
        </div>

        <div className="grid gap-12 px-8 py-12 md:grid-cols-2 lg:grid-cols-4 md:px-12">
          <div className="lg:col-span-1">
            <p className="eyebrow mb-3" style={{ color: "rgba(200, 164, 106, 0.65)" }}>
              CircuTrade
            </p>
            <h2
              className="text-[22px] font-medium leading-[1.2] text-white"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Curated commerce for statement fashion.
            </h2>
            <p className="mt-4 text-[13.5px] leading-[1.75]" style={{ color: "rgba(200,175,150,0.6)" }}>
              Buy rare pieces, list wardrobe gems, or rent occasionwear through a fashion-first marketplace.
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href="mailto:contact@circutrade.com"
                className="flex h-8 w-8 items-center justify-center rounded-full transition"
                style={{
                  background: "rgba(200,164,106,0.1)",
                  border: "1px solid rgba(200,164,106,0.18)",
                  color: "rgba(200,164,106,0.75)",
                }}
                aria-label="Email"
              >
                <Mail size={13} />
              </a>
              <a
                href="tel:+919876543210"
                className="flex h-8 w-8 items-center justify-center rounded-full transition"
                style={{
                  background: "rgba(200,164,106,0.1)",
                  border: "1px solid rgba(200,164,106,0.18)",
                  color: "rgba(200,164,106,0.75)",
                }}
                aria-label="Phone"
              >
                <Phone size={13} />
              </a>
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full transition"
                style={{
                  background: "rgba(200,164,106,0.1)",
                  border: "1px solid rgba(200,164,106,0.18)",
                  color: "rgba(200,164,106,0.75)",
                }}
                aria-label="Social"
              >
                <Send size={13} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-[15px] font-semibold text-white" style={{ letterSpacing: "-0.01em" }}>
              About
            </h3>
            <p className="text-[13.5px] leading-[1.75]" style={{ color: "rgba(200,175,150,0.6)" }}>
              CircuTrade blends resale, rental, and discovery into one premium space for fashion lovers who
              want category-led browsing and stronger listing presentation.
            </p>
            <div className="mt-5 space-y-2">
              <div className="flex items-center gap-3 text-[13px]" style={{ color: "rgba(200,175,150,0.55)" }}>
                <Mail size={13} style={{ color: "rgba(200,164,106,0.55)", flexShrink: 0 }} />
                contact@circutrade.com
              </div>
              <div className="flex items-center gap-3 text-[13px]" style={{ color: "rgba(200,175,150,0.55)" }}>
                <Phone size={13} style={{ color: "rgba(200,164,106,0.55)", flexShrink: 0 }} />
                +91 98765 43210
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-[15px] font-semibold text-white" style={{ letterSpacing: "-0.01em" }}>
              Marketplace
            </h3>
            <div className="space-y-1">
              {[
                { name: "Home", path: "/" },
                { name: "Shop", path: "/buy" },
                { name: "Sell a Piece", path: "/sell" },
                { name: "Rent a Piece", path: "/rent" },
                { name: "Dashboard", path: "/dashboard" },
              ].map(({ name, path }) => (
                <Link key={path} to={path} className="footer-link">
                  {name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-[15px] font-semibold text-white" style={{ letterSpacing: "-0.01em" }}>
              Collections
            </h3>
            <div className="space-y-1">
              {fashionCategories.map((category) => (
                <Link key={category.slug} to={`/collections/${category.slug}`} className="footer-link">
                  {category.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div
          className="flex flex-wrap items-center justify-between gap-3 px-8 py-5 md:px-12"
          style={{ borderTop: "1px solid rgba(200,164,106,0.1)" }}
        >
          <p className="text-[12.5px]" style={{ color: "rgba(180,155,125,0.5)" }}>
            (c) {new Date().getFullYear()} CircuTrade. Fashion resale, rental, and occasion discovery.
          </p>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Support"].map((item) => (
              <a key={item} href="#" className="text-[12px] transition" style={{ color: "rgba(180,155,125,0.45)" }}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
