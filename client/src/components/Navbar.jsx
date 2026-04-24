import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Menu, Search, X } from "lucide-react";
import { clearToken, hasToken } from "../utils/auth";
import { fashionCategories } from "../data/fashionCategories";

const promoItems = [
  "Unisex fashion marketplace",
  "Buy premium resale pieces",
  "Rent event-ready looks",
  "List fashion with cleaner presentation",
  "Curated edits for men and women",
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const isAuth = hasToken();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/buy" },
    { name: "Sell", path: "/sell" },
    { name: "Rent", path: "/rent" },
  ];

  const logout = () => {
    clearToken();
    navigate("/");
  };

  const promoTrack = [...promoItems, ...promoItems];

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6">
      <div className="page-container">
        <div className="promo-strip w-full">
          <div className="promo-strip-viewport">
            <div className="promo-strip-track">
              {promoTrack.map((item, index) => (
                <span key={`${item}-${index}`} className="promo-strip-item">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="page-container">
        <div className="nav-shell mt-3 w-full">
          <div className="flex items-center justify-between gap-3">
            <button type="button" onClick={() => navigate("/")} className="flex-shrink-0 text-left">
              <span
                className="block text-[21px] font-medium tracking-tight text-white md:text-[22px] lg:text-[23px]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "-0.01em" }}
              >
                CircuTrade
              </span>
              <span
                className="block text-[8px] tracking-[0.28em] uppercase md:text-[8.5px] lg:text-[9px]"
                style={{ color: "rgba(200, 164, 106, 0.75)", marginTop: "1px" }}
              >
                Unisex Resale And Rental Fashion
              </span>
            </button>

            <div className="hidden items-center gap-0.5 lg:flex">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => navigate(item.path)}
                    className={`nav-link ${isActive ? "nav-link-active" : ""}`}
                  >
                    {item.name}
                  </button>
                );
              })}

              <div
                className="relative"
                onMouseEnter={() => setCollectionsOpen(true)}
                onMouseLeave={() => setCollectionsOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setCollectionsOpen((value) => !value)}
                  className={`nav-link ${collectionsOpen ? "nav-link-open" : ""}`}
                >
                  Collections
                  <ChevronDown
                    size={13}
                    style={{
                      opacity: 0.6,
                      transform: collectionsOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </button>

                {collectionsOpen && (
                  <div className="collections-dropdown">
                    <div className="mb-4 border-b border-[#c8a46a1f] pb-4">
                      <span className="eyebrow" style={{ color: "rgba(200, 164, 106, 0.7)" }}>
                        Shop By Collection
                      </span>
                      <p className="mt-2 text-[13px] leading-6" style={{ color: "rgba(210, 190, 165, 0.7)" }}>
                        Occasion-driven edits with stronger visual identity for a unisex storefront.
                      </p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      {fashionCategories.map((category) => (
                        <Link
                          key={category.slug}
                          to={`/collections/${category.slug}`}
                          className="collections-dropdown-item"
                        >
                          <p className="text-[14px] font-semibold text-white">{category.label}</p>
                          <p className="mt-1 text-[12px] leading-5" style={{ color: "rgba(200,180,155,0.6)" }}>
                            {category.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden flex-1 justify-center md:flex lg:flex-none lg:max-w-[21rem] xl:max-w-[23rem]">
              <button
                type="button"
                onClick={() => navigate("/buy")}
                className="nav-search-shell"
                aria-label="Browse inventory"
              >
                <Search size={15} />
                <span>Search products, categories, and curated edits</span>
              </button>
            </div>

            <div className="hidden flex-shrink-0 items-center gap-2 md:flex">
              {!isAuth ? (
                <>
                  <button type="button" onClick={() => navigate("/signin")} className="editorial-btn-ghost">
                    Sign In
                  </button>
                  <button type="button" onClick={() => navigate("/signup")} className="editorial-btn-light">
                    Join Now
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => navigate("/notifications")}
                    className="nav-icon-button"
                    aria-label="Notifications"
                  >
                    <Bell size={16} />
                  </button>
                  <button type="button" onClick={() => navigate("/dashboard")} className="editorial-btn-ghost">
                    Dashboard
                  </button>
                  <button type="button" onClick={logout} className="editorial-btn-light">
                    Logout
                  </button>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="flex h-9 w-9 items-center justify-center rounded-full transition md:hidden"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(200,164,106,0.18)",
                color: "rgba(230,200,160,0.9)",
              }}
              aria-label="Toggle menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {open && (
            <div className="mobile-nav-panel">
              <button
                type="button"
                onClick={() => {
                  navigate("/buy");
                  setOpen(false);
                }}
                className="nav-search-shell nav-search-shell-mobile"
              >
                <Search size={15} />
                <span>Browse inventory</span>
              </button>

              <div className="space-y-0.5">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => {
                        navigate(item.path);
                        setOpen(false);
                      }}
                      className={`mobile-nav-item ${isActive ? "mobile-nav-item-active" : ""}`}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 border-t border-[#c8a46a1a] pt-3">
                <p className="eyebrow mb-2 px-1" style={{ color: "rgba(200,164,106,0.6)" }}>
                  Collections
                </p>
                <div className="space-y-0.5">
                  {fashionCategories.map((category) => (
                    <button
                      key={category.slug}
                      type="button"
                      onClick={() => {
                        navigate(`/collections/${category.slug}`);
                        setOpen(false);
                      }}
                      className="mobile-nav-item"
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3 grid gap-2 border-t border-[#c8a46a1a] pt-3">
                {!isAuth ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/signin");
                        setOpen(false);
                      }}
                      className="editorial-btn-ghost w-full justify-center"
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/signup");
                        setOpen(false);
                      }}
                      className="editorial-btn-light w-full justify-center"
                    >
                      Join Now
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/notifications");
                        setOpen(false);
                      }}
                      className="editorial-btn-ghost w-full justify-center"
                    >
                      Notifications
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/dashboard");
                        setOpen(false);
                      }}
                      className="editorial-btn-ghost w-full justify-center"
                    >
                      Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="editorial-btn-light w-full justify-center"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
