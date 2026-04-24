import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { getErrorMessage } from "../utils/apiError";
import { saveToken } from "../utils/auth";

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((c) => ({ ...c, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/signup", form);
      saveToken(res.data.token);
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to sign up right now."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell flex min-h-screen items-center">
      <div className="page-container grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">

        {/* ── Left: editorial panel ── */}
        <section className="accent-panel px-8 py-12 md:px-12">
          <span className="section-kicker">Create Account</span>
          <h1
            className="max-w-sm text-[42px] font-medium text-stone-900 leading-[1.08]"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              letterSpacing: "-0.02em",
            }}
          >
            Join a warmer, more polished fashion marketplace.
          </h1>
          <p className="page-subtitle">
            Start buying, selling, and renting through a refined dashboard
            experience built for premium listings.
          </p>

          <hr className="warm-rule mt-10 mb-8" />

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { n: "01", t: "List your pieces" },
              { n: "02", t: "Manage bookings" },
              { n: "03", t: "Grow your wardrobe" },
            ].map(({ n, t }) => (
              <div
                key={n}
                className="rounded-[18px] p-4"
                style={{
                  background: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(200,164,106,0.2)",
                }}
              >
                <p
                  className="text-[22px] font-medium"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    color: "var(--warm)",
                  }}
                >
                  {n}
                </p>
                <p className="mt-1 text-[13px] font-medium text-stone-700">
                  {t}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Right: form ── */}
        <form
          onSubmit={handleSubmit}
          className="auth-form-panel mx-auto w-full max-w-md"
        >
          <h2
            className="text-[32px] font-medium text-stone-900 leading-tight"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              letterSpacing: "-0.01em",
            }}
          >
            Create Account
          </h2>
          <p className="mt-2 text-[13.5px]" style={{ color: "#6b5f56" }}>
            Join CircuTrade to start buying, selling, and renting.
          </p>

          <div className="mt-6 space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              className="vintage-input"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="vintage-input"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="vintage-input"
              required
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

          <button
            type="submit"
            disabled={loading}
            className="vintage-btn-primary mt-6 w-full py-[13px] text-[13.5px]"
          >
            {loading ? "Creating account…" : "Sign Up"}
          </button>

          <p
            className="mt-5 text-center text-[13px]"
            style={{ color: "#6b5f56" }}
          >
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-semibold text-stone-900 underline underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}