import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ShieldCheck, Truck, Wallet } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import { getFashionCategory } from "../data/fashionCategories";
import { getErrorMessage } from "../utils/apiError";
import { hasToken } from "../utils/auth";

const FALLBACK = "https://via.placeholder.com/600x600";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [bookingForm, setBookingForm] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get(`/products/${id}`)
      .then(({ data }) => {
        setProduct(data);
        setSelectedImage(data.image || data.images?.[0] || FALLBACK);
      })
      .catch((err) => setError(getErrorMessage(err, "Unable to load this product.")));
  }, [id]);

  const handleChange = (e) => setBookingForm((current) => ({ ...current, [e.target.name]: e.target.value }));

  const totalDays = useMemo(() => {
    if (!bookingForm.startDate || !bookingForm.endDate) return 0;
    const diff = (new Date(bookingForm.endDate) - new Date(bookingForm.startDate)) / 86400000;
    return diff > 0 ? diff : 0;
  }, [bookingForm.endDate, bookingForm.startDate]);

  const totalAmount = totalDays * (product?.rentPrice || 0);
  const category = getFashionCategory(product?.category);

  const handleBooking = async () => {
    setError("");
    setSuccess("");

    if (!hasToken()) {
      navigate("/signin");
      return;
    }

    if (
      !bookingForm.customerName ||
      !bookingForm.customerPhone ||
      !bookingForm.customerAddress ||
      !bookingForm.startDate ||
      !bookingForm.endDate
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (!totalDays) {
      setError("End date must be after start date.");
      return;
    }

    setLoading(true);
    try {
      await API.post("/bookings", { productId: product._id, ...bookingForm });
      setSuccess("Booking request sent. The owner will receive a notification.");
      setBookingForm({
        customerName: "",
        customerPhone: "",
        customerAddress: "",
        startDate: "",
        endDate: "",
      });
    } catch (err) {
      setError(getErrorMessage(err, "Unable to create booking right now."));
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="page-shell retail-page-shell">
        <div className="page-container vintage-panel p-10 text-[14px]" style={{ color: "#9a8a7e" }}>
          {error || "Loading product..."}
        </div>
      </div>
    );
  }

  const gallery = product.images?.length ? product.images : product.image ? [product.image] : [FALLBACK];

  return (
    <div className="page-shell retail-page-shell">
      <div className="page-container product-detail-stack">
        <button type="button" onClick={() => navigate(-1)} className="product-back-link">
          <ArrowLeft size={16} />
          Back to browsing
        </button>

        <div className="product-detail-layout">
          <section className="product-gallery-panel">
            <div className="product-gallery-stage">
              <img src={selectedImage} alt={product.title} className="product-gallery-main-image" />
            </div>

            {gallery.length > 1 ? (
              <div className="product-gallery-thumbs">
                {gallery.map((img, idx) => (
                  <button
                    key={`${img.slice(-8)}-${idx}`}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`product-thumb ${selectedImage === img ? "product-thumb-active" : ""}`}
                  >
                    <img src={img} alt={`${product.title} ${idx + 1}`} className="product-thumb-image" />
                  </button>
                ))}
              </div>
            ) : null}
          </section>

          <section className="product-detail-sidebar">
            <div className="product-summary-panel">
              <div className="product-summary-header">
                <span className="section-kicker">Product Details</span>
                <h1 className="product-detail-title">{product.title}</h1>
                <div className="product-detail-tags">
                  {category ? <span className="editorial-chip">{category.label}</span> : null}
                  <span className="vintage-chip">
                    {product.type === "rent" ? "Available for rent" : "Available for sale"}
                  </span>
                </div>
              </div>

              <div className="product-price-panel">
                <div>
                  <p className="product-price-label">Listing price</p>
                  <p className="product-price-value">Rs. {Number(product.price || 0).toLocaleString("en-IN")}</p>
                </div>
                {product.type === "rent" ? (
                  <div className="product-price-secondary">
                    <p className="product-price-label">Rent per day</p>
                    <p className="product-price-secondary-value">
                      Rs. {Number(product.rentPrice || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                ) : null}
              </div>

              <p className="product-description">{product.description || "No description added for this piece yet."}</p>

              <div className="product-benefits">
                <article className="product-benefit-card">
                  <ShieldCheck size={18} />
                  <div>
                    <h2>Clear listing details</h2>
                    <p>Product images, pricing, and category tags stay visible without layout drift.</p>
                  </div>
                </article>
                <article className="product-benefit-card">
                  <Truck size={18} />
                  <div>
                    <h2>{product.type === "rent" ? "Rental-ready flow" : "Ready to purchase"}</h2>
                    <p>
                      {product.type === "rent"
                        ? "Choose dates, review the total, and send a booking request from the same screen."
                        : "Use the cleaner product page to review the listing before moving ahead with the seller."}
                    </p>
                  </div>
                </article>
                <article className="product-benefit-card">
                  <Wallet size={18} />
                  <div>
                    <h2>{product.type === "rent" ? "Transparent pricing" : "Straightforward pricing"}</h2>
                    <p>
                      {product.type === "rent"
                        ? "Deposit and daily rental cost are separated so the total is easy to understand."
                        : "The product value is highlighted first so shoppers can compare items faster."}
                    </p>
                  </div>
                </article>
              </div>
            </div>

            {product.type === "rent" ? (
              <div className="product-booking-panel">
                <span className="section-kicker">Rental Booking</span>
                <h2 className="product-booking-title">Request this piece for your dates</h2>

                <div className="mt-6 space-y-3">
                  <input
                    type="text"
                    name="customerName"
                    value={bookingForm.customerName}
                    onChange={handleChange}
                    placeholder="Full name"
                    className="vintage-input"
                  />
                  <input
                    type="tel"
                    name="customerPhone"
                    value={bookingForm.customerPhone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="vintage-input"
                  />
                  <textarea
                    name="customerAddress"
                    value={bookingForm.customerAddress}
                    onChange={handleChange}
                    placeholder="Delivery address"
                    className="vintage-textarea min-h-[90px]"
                  />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="product-field-label">Start date</label>
                      <input
                        type="date"
                        name="startDate"
                        value={bookingForm.startDate}
                        onChange={handleChange}
                        className="vintage-input"
                      />
                    </div>
                    <div>
                      <label className="product-field-label">End date</label>
                      <input
                        type="date"
                        name="endDate"
                        value={bookingForm.endDate}
                        onChange={handleChange}
                        className="vintage-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="product-booking-summary">
                  <p className="product-booking-summary-label">Booking Summary</p>
                  {[
                    { label: "Total days", value: totalDays },
                    { label: "Per day", value: `Rs. ${Number(product.rentPrice || 0).toLocaleString("en-IN")}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="product-booking-summary-row">
                      <span>{label}</span>
                      <span>{value}</span>
                    </div>
                  ))}
                  <div className="product-booking-summary-total">
                    <span>Total amount</span>
                    <span>Rs. {totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {error ? (
                  <div
                    className="mt-4 rounded-[14px] px-4 py-3 text-[13px]"
                    style={{
                      background: "rgba(200,70,60,0.07)",
                      border: "1px solid rgba(200,70,60,0.18)",
                      color: "#8a2a24",
                    }}
                  >
                    {error}
                  </div>
                ) : null}
                {success ? (
                  <div
                    className="mt-4 rounded-[14px] px-4 py-3 text-[13px]"
                    style={{
                      background: "rgba(80,160,100,0.08)",
                      border: "1px solid rgba(80,160,100,0.2)",
                      color: "#2d6b40",
                    }}
                  >
                    {success}
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={handleBooking}
                  disabled={loading}
                  className="vintage-btn-primary mt-5 w-full py-[13px] text-[13.5px]"
                >
                  {loading ? "Sending request..." : "Send Booking Request"}
                </button>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}
