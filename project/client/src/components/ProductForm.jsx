import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, QrCode, ImagePlus } from "lucide-react";
import API from "../api/axios";
import { getErrorMessage } from "../utils/apiError";
import { hasToken } from "../utils/auth";
import { fashionCategories } from "../data/fashionCategories";

const MAX_FILES = 5;
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

export default function ProductForm({ mode }) {
  const navigate = useNavigate();
  const isRent = mode === "rent";
  const [form, setForm] = useState({
    title: "",
    category: "trendy",
    price: "",
    rentPrice: "",
    upiId: "",
    upiQrImage: "",
    description: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm((c) => ({ ...c, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setError("");

    if (form.images.length + files.length > MAX_FILES) {
      setError("You can upload up to 5 images for one product.");
      e.target.value = "";
      return;
    }

    const oversized = files.find((f) => f.size > MAX_FILE_SIZE_BYTES);
    if (oversized) {
      setError("Each image must be smaller than 2 MB.");
      e.target.value = "";
      return;
    }

    try {
      const encoded = await Promise.all(
        files.map(
          (f) =>
            new Promise((res, rej) => {
              const reader = new FileReader();
              reader.onloadend = () => res(reader.result);
              reader.onerror = rej;
              reader.readAsDataURL(f);
            })
        )
      );
      setForm((c) => ({ ...c, images: [...c.images, ...encoded] }));
    } catch {
      setError("Unable to read the selected images. Please try again.");
    } finally {
      e.target.value = "";
    }
  };

  const removeImage = (idx) => {
    setForm((c) => ({ ...c, images: c.images.filter((_, i) => i !== idx) }));
  };

  const handleUpiQrUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const encoded = await new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onloadend = () => res(reader.result);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });
      setForm((c) => ({ ...c, upiQrImage: encoded }));
    } catch {
      setError("Unable to read the QR image. Please try again.");
    } finally {
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!hasToken()) {
      setError("Please sign in before adding a product.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: form.title,
        category: form.category,
        price: Number(form.price),
        type: mode,
        description: form.description,
        image: form.images[0] || "",
        images: form.images,
      };

      if (isRent) {
        payload.rentPrice = Number(form.rentPrice);
        payload.upiId = form.upiId;
        payload.upiQrImage = form.upiQrImage;
      }

      await API.post("/products", payload);
      setSuccess(isRent ? "Rental product listed successfully." : "Product listed for sale successfully.");
      setForm({
        title: "",
        category: "trendy",
        price: "",
        rentPrice: "",
        upiId: "",
        upiQrImage: "",
        description: "",
        images: [],
      });
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Your session has expired. Please sign in again.");
        navigate("/signin");
        return;
      }
      if (err.response?.status === 413) {
        setError("Images are too large. Try fewer images or smaller files.");
        return;
      }
      setError(getErrorMessage(err, "Unable to save this product right now."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="vintage-panel w-full max-w-xl" style={{ padding: "clamp(20px, 4vw, 36px)" }}>
      <div className="mb-8">
        <span className="section-kicker">{isRent ? "Rental Listing" : "Sell Listing"}</span>
        <h2
          className="text-[28px] font-medium leading-[1.15] text-stone-900"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "-0.01em" }}
        >
          {isRent ? "List a piece for elegant short-term rentals." : "Publish a polished listing for buyers."}
        </h2>
        <p className="mt-3 text-[13.5px] leading-[1.7]" style={{ color: "#6b5f56" }}>
          {isRent
            ? "Share standout wardrobe pieces with transparent pricing, payment details, and gallery images."
            : "Create a premium storefront listing that feels complete and trustworthy from first glance."}
        </p>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          name="title"
          placeholder="Product title"
          value={form.title}
          onChange={handleChange}
          className="vintage-input"
          required
        />

        <div className="relative">
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="vintage-input pr-10"
            required
            style={{ cursor: "pointer" }}
          >
            {fashionCategories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon />
        </div>

        <div className={`grid gap-3 ${isRent ? "md:grid-cols-2" : "grid-cols-1"}`}>
          <div className="relative">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[12px] font-semibold uppercase"
              style={{ color: "rgba(90,75,65,0.5)" }}
            >
              Rs
            </span>
            <input
              type="number"
              min="0"
              name="price"
              placeholder={isRent ? "Security deposit" : "Selling price"}
              value={form.price}
              onChange={handleChange}
              className="vintage-input pl-10"
              required
            />
          </div>

          {isRent && (
            <div className="relative">
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[12px] font-semibold uppercase"
                style={{ color: "rgba(90,75,65,0.5)" }}
              >
                Rs
              </span>
              <input
                type="number"
                min="0"
                name="rentPrice"
                placeholder="Rent per day"
                value={form.rentPrice}
                onChange={handleChange}
                className="vintage-input pl-10"
                required
              />
            </div>
          )}
        </div>

        {isRent && (
          <>
            <input
              type="text"
              name="upiId"
              placeholder="UPI ID for payment (e.g. name@upi)"
              value={form.upiId}
              onChange={handleChange}
              className="vintage-input"
              required
            />

            <div
              className="relative overflow-hidden rounded-[16px] p-4"
              style={{
                background: "rgba(255,255,255,0.7)",
                border: "1.5px dashed rgba(16,13,10,0.12)",
              }}
            >
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-xl"
                  style={{ background: "rgba(200,164,106,0.12)", color: "var(--warm)" }}
                >
                  <QrCode size={14} />
                </div>
                <label className="text-[13px] font-medium text-stone-700">UPI QR Code Image</label>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpiQrUpload}
                className="vintage-input text-[12.5px]"
              />
              {form.upiQrImage && (
                <div className="mt-3 overflow-hidden rounded-xl">
                  <img src={form.upiQrImage} alt="UPI QR preview" className="h-32 w-full object-cover" />
                </div>
              )}
            </div>
          </>
        )}

        <div
          className="overflow-hidden rounded-[16px] p-4"
          style={{
            background: "rgba(255,255,255,0.7)",
            border: "1.5px dashed rgba(16,13,10,0.12)",
          }}
        >
          <div className="mb-3 flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl"
              style={{ background: "rgba(200,164,106,0.12)", color: "var(--warm)" }}
            >
              <ImagePlus size={14} />
            </div>
            <label className="text-[13px] font-medium text-stone-700">
              Product Images
              <span className="ml-2 text-[11px]" style={{ color: "rgba(90,75,65,0.45)" }}>
                Up to 5 images
              </span>
            </label>
          </div>
          <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="vintage-input text-[12.5px]" />
          <p className="mt-2 text-[11.5px]" style={{ color: "rgba(90,75,65,0.5)" }}>
            Well-lit, close-up images make listings feel more premium.
          </p>
        </div>

        {form.images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {form.images.map((img, idx) => (
              <div
                key={`${img.slice(0, 20)}-${idx}`}
                className="group relative overflow-hidden"
                style={{
                  borderRadius: "14px",
                  border: "1px solid rgba(16,13,10,0.08)",
                }}
              >
                <img src={img} alt={`Upload ${idx + 1}`} className="h-20 w-full object-cover sm:h-24" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{ background: "rgba(15,12,9,0.55)" }}
                >
                  <X size={16} style={{ color: "#f5ead8" }} />
                </button>
              </div>
            ))}
          </div>
        )}

        <textarea
          name="description"
          placeholder="Describe the product - fit, material, occasion, and why it stands out."
          value={form.description}
          onChange={handleChange}
          className="vintage-textarea min-h-[120px]"
        />
      </div>

      {error && (
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
      )}
      {success && (
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
      )}

      <div className="mt-6 space-y-3">
        <button type="submit" disabled={loading} className="vintage-btn-primary w-full py-[13px] text-[13.5px]">
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Saving listing...
            </span>
          ) : isRent ? (
            "Add For Rent"
          ) : (
            "Add For Sale"
          )}
        </button>

        {!hasToken() && (
          <p className="text-center text-[13px]" style={{ color: "#6b5f56" }}>
            Need an account?{" "}
            <Link to="/signin" className="font-semibold text-stone-900 underline underline-offset-4">
              Sign In
            </Link>
          </p>
        )}
      </div>
    </form>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgba(90,75,65,0.5)"
      strokeWidth="2"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
