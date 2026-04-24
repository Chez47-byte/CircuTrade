import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight, Bell, CalendarDays, IndianRupee,
  Package2, ShoppingBag, Trash2, Plus,
} from "lucide-react";
import API from "../api/axios";
import { getErrorMessage } from "../utils/apiError";
import { handlePayment } from "../utils/payment";

const fmt = new Intl.NumberFormat("en-IN");
const fmtCur = (v) => `Rs. ${fmt.format(Number(v) || 0)}`;
const fmtDate = (v) =>
  v
    ? new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "Not scheduled";

const STATUS_STYLES = {
  requested: "status-requested",
  approved: "status-approved",
  declined: "status-declined",
  alternate_offered: "status-alternate",
  paid: "status-paid",
};

function MetricCard({ icon, label, value, hint }) {
  return (
    <div className="metric-card">
      <div className="metric-icon-wrap">{icon}</div>
      <p className="text-[12px] font-medium uppercase tracking-[0.22em]" style={{ color: "#8a7a6e" }}>
        {label}
      </p>
      <p
        className="mt-1 text-[34px] font-medium leading-none"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "var(--ink)" }}
      >
        {value}
      </p>
      <p className="mt-2 text-[12.5px] leading-[1.6]" style={{ color: "#9a8a7e" }}>{hint}</p>
    </div>
  );
}

function BookingCard({ booking, isOwnerView = false, onPayNow, paying = false }) {
  const product = booking.product || {};
  const otherParty = isOwnerView
    ? booking.customerName || booking.user?.name || "Customer"
    : product.title || "Rental product";
  const statusClass = STATUS_STYLES[booking.status] || "";
  const canPay = !isOwnerView && booking.status === "approved";
  const isPaid = !isOwnerView && booking.status === "paid";

  return (
    <article className="vintage-card overflow-hidden">
      <div className="p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="eyebrow mb-1" style={{ color: "#a09080" }}>
              {isOwnerView ? "Incoming rental order" : "My rental order"}
            </p>
            <h3
              className="text-[20px] font-medium leading-tight text-stone-900"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {isOwnerView ? product.title || "Rental product" : otherParty}
            </h3>
            <p className="mt-1 text-[12.5px]" style={{ color: "#9a8a7e" }}>
              {isOwnerView
                ? `Requested by ${otherParty}`
                : `Booked on ${fmtDate(booking.createdAt)}`}
            </p>
          </div>
          <span className={`status-badge ${statusClass}`}>
            {booking.status?.replaceAll("_", " ")}
          </span>
        </div>

        <div className="grid gap-2 text-[13px] sm:grid-cols-2">
          <div className="booking-cell">
            <p className="eyebrow mb-1.5" style={{ color: "#a09080" }}>Rental window</p>
            <p className="text-stone-700">{fmtDate(booking.startDate)} to {fmtDate(booking.endDate)}</p>
          </div>
          <div className="booking-cell">
            <p className="eyebrow mb-1.5" style={{ color: "#a09080" }}>Order value</p>
            <p className="text-[15px] font-semibold text-stone-900">{fmtCur(booking.totalAmount)}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-4 text-[12.5px]" style={{ color: "#9a8a7e" }}>
          <span>Total days: <strong style={{ color: "var(--ink)" }}>{booking.totalDays || 0}</strong></span>
          <span>Per day: <strong style={{ color: "var(--ink)" }}>{fmtCur(booking.perDayPrice)}</strong></span>
        </div>

        {booking.ownerMessage && (
          <div
            className="mt-4 rounded-[14px] p-4 text-[13px]"
            style={{
              background: "rgba(200,164,106,0.08)",
              border: "1px solid rgba(200,164,106,0.18)",
            }}
          >
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--warm)" }}>
              Owner message
            </p>
            <p style={{ color: "var(--ink-soft)" }}>{booking.ownerMessage}</p>
          </div>
        )}

        {isOwnerView && (
          <div className="mt-3 grid gap-2 text-[12.5px] sm:grid-cols-2" style={{ color: "#9a8a7e" }}>
            <span>Phone: {booking.customerPhone || "Not shared"}</span>
            <span>Address: {booking.customerAddress || "Not shared"}</span>
          </div>
        )}

        {canPay && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => onPayNow?.(booking)}
              disabled={paying}
              className="vintage-btn-primary gap-2 text-[12.5px] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <IndianRupee size={13} />
              {paying ? "Opening payment..." : "Pay Now"}
            </button>
          </div>
        )}

        {isPaid && (
          <div
            className="mt-4 rounded-[14px] px-4 py-3 text-[13px]"
            style={{
              background: "rgba(80,160,100,0.08)",
              border: "1px solid rgba(80,160,100,0.2)",
              color: "#2d6b40",
            }}
          >
            Payment completed successfully. This booking is now confirmed as paid.
          </div>
        )}
      </div>
    </article>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [customerBookings, setCustomerBookings] = useState([]);
  const [ownerBookings, setOwnerBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [removingId, setRemovingId] = useState("");
  const [payingBookingId, setPayingBookingId] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    const [productsResult, bookingsResult] = await Promise.allSettled([
      API.get("/products/my"),
      API.get("/bookings/dashboard"),
    ]);

    if (productsResult.status === "fulfilled") {
      setProducts(productsResult.value.data || []);
    } else {
      setProducts([]);
    }

    if (bookingsResult.status === "fulfilled") {
      setCustomerBookings(bookingsResult.value.data?.customerBookings || []);
      setOwnerBookings(bookingsResult.value.data?.ownerBookings || []);
    } else {
      setCustomerBookings([]);
      setOwnerBookings([]);
    }

    if (productsResult.status === "rejected" || bookingsResult.status === "rejected") {
      const firstError =
        productsResult.status === "rejected"
          ? productsResult.reason
          : bookingsResult.reason;
      setError(getErrorMessage(firstError, "Unable to load dashboard right now."));
    }

    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const rentalListings = useMemo(() => products.filter((p) => p.type === "rent"), [products]);
  const sellListings = useMemo(() => products.filter((p) => p.type === "sell"), [products]);
  const activeOwnerOrders = useMemo(
    () => ownerBookings.filter((b) => ["requested", "approved", "alternate_offered", "paid"].includes(b.status)),
    [ownerBookings]
  );
  const activeListingIds = useMemo(
    () => new Set(activeOwnerOrders.map((b) => b.product?._id).filter(Boolean)),
    [activeOwnerOrders]
  );
  const approvedCustomerOrders = useMemo(
    () => customerBookings.filter((b) => ["approved", "paid"].includes(b.status)),
    [customerBookings]
  );
  const expectedRevenue = useMemo(
    () => ownerBookings
      .filter((b) => ["approved", "paid"].includes(b.status))
      .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0),
    [ownerBookings]
  );

  const handleRemoveListing = async (productId) => {
    setRemovingId(productId);
    setError("");
    setSuccess("");
    try {
      await API.delete(`/products/${productId}`);
      setProducts((current) => current.filter((p) => p._id !== productId));
      setOwnerBookings((current) => current.filter((b) => b.product?._id !== productId));
    } catch (err) {
      setError(getErrorMessage(err, "Unable to remove this listing right now."));
    } finally {
      setRemovingId("");
    }
  };

  const handlePayNow = async (booking) => {
    setPayingBookingId(booking._id);
    setError("");
    setSuccess("");

    try {
      await handlePayment({
        bookingId: booking._id,
        customerName: booking.customerName || "",
        customerPhone: booking.customerPhone || "",
      });
      await loadDashboard();
      setSuccess("Payment completed successfully. Your booking has been marked as paid.");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to complete payment right now."));
    } finally {
      setPayingBookingId("");
    }
  };

  return (
    <div className="page-shell retail-page-shell">
      <div className="page-container">
        <section className="ink-panel">
          <div className="grid gap-8 px-8 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:px-12">
            <div>
              <span className="section-kicker" style={{ color: "rgba(200,164,106,0.7)" }}>
                User Dashboard
              </span>
              <h1
                className="max-w-2xl text-[40px] font-medium leading-[1.1] text-white md:text-[50px]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "-0.02em" }}
              >
                Manage rentals, track orders, and keep listings sharp.
              </h1>
              <p className="mt-4 max-w-xl text-[14px] leading-[1.8]" style={{ color: "rgba(210,190,165,0.65)" }}>
                This space brings together your rental products, rental orders you placed, and customer
                requests coming to your own wardrobe.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={() => navigate("/rent")} className="editorial-btn-light">
                  <Plus size={14} /> Add on Rent
                </button>
                <button type="button" onClick={() => navigate("/sell")} className="editorial-btn-dark">
                  Create Sell Listing
                </button>
                <button type="button" onClick={() => navigate("/notifications")} className="editorial-btn-dark">
                  <Bell size={14} /> Notifications
                </button>
              </div>
            </div>

            <div className="grid gap-3 self-start md:grid-cols-2">
              <MetricCard icon={<Package2 size={18} />} label="Rental listings" value={rentalListings.length} hint="Products live on your profile." />
              <MetricCard icon={<CalendarDays size={18} />} label="Incoming requests" value={activeOwnerOrders.length} hint="Active bookings on your pieces." />
              <MetricCard icon={<ShoppingBag size={18} />} label="My rental orders" value={customerBookings.length} hint="Requests you have placed." />
              <MetricCard icon={<IndianRupee size={18} />} label="Approved revenue" value={fmtCur(expectedRevenue)} hint="Approved or paid rental value." />
            </div>
          </div>
        </section>

        {loading && (
          <div className="mt-8 vintage-panel p-10 text-center text-[14px]" style={{ color: "#9a8a7e" }}>
            Loading your dashboard...
          </div>
        )}

        {error && (
          <div
            className="mt-8 rounded-[20px] p-4 text-[13.5px]"
            style={{
              background: "rgba(200,70,60,0.07)",
              border: "1px solid rgba(200,70,60,0.18)",
              color: "#8a2a24",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="mt-8 rounded-[20px] p-4 text-[13.5px]"
            style={{
              background: "rgba(80,160,100,0.08)",
              border: "1px solid rgba(80,160,100,0.2)",
              color: "#2d6b40",
            }}
          >
            {success}
          </div>
        )}

        {!loading && (
          <div className="mt-8 grid gap-8 xl:grid-cols-[1.12fr_0.88fr]">
            <div className="space-y-8">
              <div className="vintage-panel p-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="eyebrow mb-1" style={{ color: "#a09080" }}>My rental listings</p>
                    <h2
                      className="text-[24px] font-medium text-stone-900"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                      Products currently on rent
                    </h2>
                  </div>
                  <Link to="/rent" className="vintage-btn-secondary gap-2">
                    <Plus size={14} /> Add rental
                  </Link>
                </div>

                {rentalListings.length ? (
                  <div className="grid gap-5 lg:grid-cols-2">
                    {rentalListings.map((product) => {
                      const hasActive = activeListingIds.has(product._id);
                      const img = product.image || product.images?.[0] || "https://via.placeholder.com/600x400";
                      return (
                        <article key={product._id} className="vintage-card overflow-hidden">
                          <div className="relative">
                            <img src={img} alt={product.title} className="h-44 w-full object-cover" />
                            <div
                              className="absolute inset-0"
                              style={{ background: "linear-gradient(to top, rgba(15,12,9,0.35), transparent 50%)" }}
                            />
                            <span
                              className="absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold"
                              style={{
                                background: hasActive ? "rgba(80,160,100,0.15)" : "rgba(200,164,106,0.15)",
                                border: `1px solid ${hasActive ? "rgba(80,160,100,0.3)" : "rgba(200,164,106,0.3)"}`,
                                color: hasActive ? "#2d6b40" : "var(--warm)",
                              }}
                            >
                              {hasActive ? "Active orders" : "Active"}
                            </span>
                          </div>
                          <div className="p-5">
                            <h3
                              className="text-[20px] font-medium leading-tight text-stone-900"
                              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                            >
                              {product.title}
                            </h3>
                            <p className="mt-0.5 text-[12px]" style={{ color: "#9a8a7e" }}>
                              Added {fmtDate(product.createdAt)}
                            </p>
                            <p className="mt-3 line-clamp-2 text-[13px] leading-[1.6]" style={{ color: "#7a6a60" }}>
                              {product.description || "No description added yet."}
                            </p>

                            <div className="mt-4 grid grid-cols-2 gap-2">
                              <div className="booking-cell">
                                <p className="eyebrow mb-1" style={{ color: "#a09080" }}>Selling price</p>
                                <p className="text-[14px] font-semibold text-stone-900">{fmtCur(product.price)}</p>
                              </div>
                              <div className="booking-cell">
                                <p className="eyebrow mb-1" style={{ color: "#a09080" }}>Rent / day</p>
                                <p className="text-[14px] font-semibold text-stone-900">{fmtCur(product.rentPrice)}</p>
                              </div>
                            </div>

                            <div className="mt-4 flex items-center justify-end">
                              <button
                                type="button"
                                disabled={hasActive || removingId === product._id}
                                onClick={() => handleRemoveListing(product._id)}
                                className="vintage-btn-secondary gap-2 text-[12.5px] disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <Trash2 size={13} />
                                {removingId === product._id ? "Removing..." : "Remove"}
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="editorial-empty-state">
                    <p
                      className="mb-2 text-[18px] font-medium text-stone-900"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                      No rental products listed yet.
                    </p>
                    <p className="text-[13.5px]" style={{ color: "#9a8a7e" }}>
                      Add your first rental listing so users can start sending booking requests.
                    </p>
                  </div>
                )}
              </div>

              <div className="vintage-panel p-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="eyebrow mb-1" style={{ color: "#a09080" }}>My orders</p>
                    <h2
                      className="text-[24px] font-medium text-stone-900"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                      Rental requests and order details
                    </h2>
                  </div>
                  <div
                    className="rounded-full px-4 py-2 text-[12.5px] font-medium"
                    style={{
                      background: "rgba(80,160,100,0.1)",
                      border: "1px solid rgba(80,160,100,0.2)",
                      color: "#2d6b40",
                    }}
                  >
                    Approved: {approvedCustomerOrders.length}
                  </div>
                </div>
                {customerBookings.length ? (
                  <div className="space-y-4">
                    {customerBookings.map((booking) => (
                      <BookingCard
                        key={booking._id}
                        booking={booking}
                        onPayNow={handlePayNow}
                        paying={payingBookingId === booking._id}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="editorial-empty-state">
                    <p className="mb-2 text-[18px] font-medium text-stone-900"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                      No rental orders yet.
                    </p>
                    <p className="text-[13.5px]" style={{ color: "#9a8a7e" }}>
                      When you request a product on rent, its order details will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div className="vintage-panel p-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="eyebrow mb-1" style={{ color: "#a09080" }}>Incoming customer orders</p>
                    <h2
                      className="text-[24px] font-medium text-stone-900"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                      Requests on your products
                    </h2>
                  </div>
                  <button type="button" onClick={() => navigate("/notifications")} className="vintage-btn-primary gap-2 text-[12.5px]">
                    <Bell size={13} /> Respond
                  </button>
                </div>
                {ownerBookings.length ? (
                  <div className="space-y-4">
                    {ownerBookings.map((booking) => <BookingCard key={booking._id} booking={booking} isOwnerView />)}
                  </div>
                ) : (
                  <div className="editorial-empty-state">
                    <p className="mb-2 text-[18px] font-medium text-stone-900"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                      No incoming requests yet.
                    </p>
                    <p className="text-[13.5px]" style={{ color: "#9a8a7e" }}>
                      Once someone books your rental product, the request will appear here.
                    </p>
                  </div>
                )}
              </div>

              <div className="accent-panel p-6">
                <p className="eyebrow mb-1" style={{ color: "rgba(100,80,60,0.65)" }}>Dashboard snapshot</p>
                <h2
                  className="mb-6 text-[24px] font-medium text-stone-900"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Quick business health
                </h2>

                <div className="space-y-3">
                  {[
                    {
                      label: "Total listings",
                      value: products.length,
                      sub: `${sellListings.length} sell / ${rentalListings.length} rental`,
                    },
                    {
                      label: "Listings safe to remove",
                      value: rentalListings.filter((p) => !activeListingIds.has(p._id)).length,
                      sub: "These rental products have no active orders.",
                    },
                    {
                      label: "Best next step",
                      value: null,
                      sub: ownerBookings.length
                        ? "Review notifications to approve or decline pending bookings."
                        : "Add a rental listing with strong images to attract your first order.",
                    },
                  ].map(({ label, value, sub }) => (
                    <div
                      key={label}
                      className="rounded-[18px] p-5"
                      style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(200,164,106,0.16)" }}
                    >
                      <p className="text-[12px] font-medium uppercase tracking-[0.18em]" style={{ color: "#9a8270" }}>
                        {label}
                      </p>
                      {value !== null && (
                        <p
                          className="mt-1 text-[32px] font-medium leading-none"
                          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "var(--ink)" }}
                        >
                          {value}
                        </p>
                      )}
                      <p className="mt-2 text-[13px] leading-[1.6]" style={{ color: "#7a6a60" }}>{sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
